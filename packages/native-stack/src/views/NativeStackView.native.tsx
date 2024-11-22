import {
  getDefaultHeaderHeight,
  getHeaderTitle,
  HeaderBackContext,
  HeaderHeightContext,
  HeaderShownContext,
  SafeAreaProviderCompat,
} from '@react-navigation/elements';
import {
  NavigationContext,
  NavigationRouteContext,
  type ParamListBase,
  type RouteProp,
  StackActions,
  type StackNavigationState,
  usePreventRemoveContext,
  useTheme,
} from '@react-navigation/native';
import * as React from 'react';
import {
  Animated,
  Platform,
  StatusBar,
  StyleSheet,
  useAnimatedValue,
  View,
} from 'react-native';
import {
  useSafeAreaFrame,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {
  type ScreenProps,
  ScreenStack,
  ScreenStackItem,
} from 'react-native-screens';

import type {
  NativeStackDescriptor,
  NativeStackDescriptorMap,
  NativeStackNavigationHelpers,
} from '../types';
import { debounce } from '../utils/debounce';
import { getModalRouteKeys } from '../utils/getModalRoutesKeys';
import { AnimatedHeaderHeightContext } from '../utils/useAnimatedHeaderHeight';
import { useDismissedRouteError } from '../utils/useDismissedRouteError';
import { useInvalidPreventRemoveError } from '../utils/useInvalidPreventRemoveError';
import { useHeaderConfigProps } from './useHeaderConfigProps';

const ANDROID_DEFAULT_HEADER_HEIGHT = 56;

type SceneViewProps = {
  index: number;
  focused: boolean;
  descriptor: NativeStackDescriptor;
  previousDescriptor?: NativeStackDescriptor;
  nextDescriptor?: NativeStackDescriptor;
  isPresentationModal?: boolean;
  isPreloaded?: boolean;
  onWillDisappear: () => void;
  onWillAppear: () => void;
  onAppear: () => void;
  onDisappear: () => void;
  onDismissed: ScreenProps['onDismissed'];
  onHeaderBackButtonClicked: ScreenProps['onHeaderBackButtonClicked'];
  onNativeDismissCancelled: ScreenProps['onDismissed'];
  onGestureCancel: ScreenProps['onGestureCancel'];
  onSheetDetentChanged: ScreenProps['onSheetDetentChanged'];
};

const SceneView = ({
  index,
  focused,
  descriptor,
  previousDescriptor,
  nextDescriptor,
  isPresentationModal,
  isPreloaded,
  onWillDisappear,
  onWillAppear,
  onAppear,
  onDisappear,
  onDismissed,
  onHeaderBackButtonClicked,
  onNativeDismissCancelled,
  onGestureCancel,
  onSheetDetentChanged,
}: SceneViewProps) => {
  const { route, navigation, options, render } = descriptor;

  let {
    animation,
    animationMatchesGesture,
    presentation = isPresentationModal ? 'modal' : 'card',
    fullScreenGestureEnabled,
  } = options;

  const {
    animationDuration,
    animationTypeForReplace = 'push',
    fullScreenGestureShadowEnabled = true,
    gestureEnabled,
    gestureDirection = presentation === 'card' ? 'horizontal' : 'vertical',
    gestureResponseDistance,
    header,
    headerBackButtonMenuEnabled,
    headerShown,
    headerBackground,
    headerTransparent,
    autoHideHomeIndicator,
    keyboardHandlingEnabled,
    navigationBarColor,
    navigationBarTranslucent,
    navigationBarHidden,
    orientation,
    sheetAllowedDetents = [1.0],
    sheetLargestUndimmedDetentIndex = -1,
    sheetGrabberVisible = false,
    sheetCornerRadius = -1.0,
    sheetElevation = 24,
    sheetExpandsWhenScrolledToEdge = true,
    sheetInitialDetentIndex = 0,
    statusBarAnimation,
    statusBarHidden,
    statusBarStyle,
    statusBarTranslucent,
    statusBarBackgroundColor,
    unstable_sheetFooter,
    freezeOnBlur,
    contentStyle,
  } = options;

  if (gestureDirection === 'vertical' && Platform.OS === 'ios') {
    // for `vertical` direction to work, we need to set `fullScreenGestureEnabled` to `true`
    // so the screen can be dismissed from any point on screen.
    // `animationMatchesGesture` needs to be set to `true` so the `animation` set by user can be used,
    // otherwise `simple_push` will be used.
    // Also, the default animation for this direction seems to be `slide_from_bottom`.
    if (fullScreenGestureEnabled === undefined) {
      fullScreenGestureEnabled = true;
    }

    if (animationMatchesGesture === undefined) {
      animationMatchesGesture = true;
    }

    if (animation === undefined) {
      animation = 'slide_from_bottom';
    }
  }

  // workaround for rn-screens where gestureDirection has to be set on both
  // current and previous screen - software-mansion/react-native-screens/pull/1509
  const nextGestureDirection = nextDescriptor?.options.gestureDirection;
  const gestureDirectionOverride =
    nextGestureDirection != null ? nextGestureDirection : gestureDirection;

  if (index === 0) {
    // first screen should always be treated as `card`, it resolves problems with no header animation
    // for navigator with first screen as `modal` and the next as `card`
    presentation = 'card';
  }

  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const frame = useSafeAreaFrame();

  // `modal` and `formSheet` presentations do not take whole screen, so should not take the inset.
  const isModal = presentation === 'modal' || presentation === 'formSheet';

  // Modals are fullscreen in landscape only on iPhone
  const isIPhone = Platform.OS === 'ios' && !(Platform.isPad || Platform.isTV);
  const isLandscape = frame.width > frame.height;

  const isParentHeaderShown = React.useContext(HeaderShownContext);
  const parentHeaderHeight = React.useContext(HeaderHeightContext);
  const parentHeaderBack = React.useContext(HeaderBackContext);

  const topInset =
    isParentHeaderShown ||
    (Platform.OS === 'ios' && isModal) ||
    (isIPhone && isLandscape)
      ? 0
      : insets.top;

  const { preventedRoutes } = usePreventRemoveContext();

  const defaultHeaderHeight = Platform.select({
    // FIXME: Currently screens isn't using Material 3
    // So our `getDefaultHeaderHeight` doesn't return the correct value
    // So we hardcode the value here for now until screens is updated
    android: ANDROID_DEFAULT_HEADER_HEIGHT + topInset,
    default: getDefaultHeaderHeight(frame, isModal, topInset),
  });

  const [headerHeight, setHeaderHeight] = React.useState(defaultHeaderHeight);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const setHeaderHeightDebounced = React.useCallback(
    // Debounce the header height updates to avoid excessive re-renders
    debounce(setHeaderHeight, 100),
    []
  );

  const hasCustomHeader = header !== undefined;

  let headerHeightCorrectionOffset = 0;

  if (Platform.OS === 'android' && !hasCustomHeader) {
    const statusBarHeight = StatusBar.currentHeight ?? 0;

    // FIXME: On Android, the native header height is not correctly calculated
    // It includes status bar height even if statusbar is not translucent
    // And the statusbar value itself doesn't match the actual status bar height
    // So we subtract the bogus status bar height and add the actual top inset
    headerHeightCorrectionOffset = -statusBarHeight + topInset;
  }

  const rawAnimatedHeaderHeight = useAnimatedValue(defaultHeaderHeight);
  const animatedHeaderHeight = React.useMemo(
    () =>
      Animated.add<number>(
        rawAnimatedHeaderHeight,
        headerHeightCorrectionOffset
      ),
    [headerHeightCorrectionOffset, rawAnimatedHeaderHeight]
  );

  // During the very first render topInset is > 0 when running
  // in non edge-to-edge mode on Android, while on every consecutive render
  // topInset === 0, causing header content to jump, as we add padding on the first frame,
  // just to remove it in next one. To prevent this, when statusBarTranslucent is set,
  // we apply additional padding in header only if its true.
  // For more details see: https://github.com/react-navigation/react-navigation/pull/12014
  const headerTopInsetEnabled =
    typeof statusBarTranslucent === 'boolean'
      ? statusBarTranslucent
      : topInset !== 0;

  const canGoBack = previousDescriptor != null || parentHeaderBack != null;
  const backTitle = previousDescriptor
    ? getHeaderTitle(previousDescriptor.options, previousDescriptor.route.name)
    : parentHeaderBack?.title;

  const headerBack = React.useMemo(() => {
    if (canGoBack) {
      return {
        href: undefined, // No href needed for native
        title: backTitle,
      };
    }

    return undefined;
  }, [canGoBack, backTitle]);

  const isRemovePrevented = preventedRoutes[route.key]?.preventRemove;

  const headerConfig = useHeaderConfigProps({
    ...options,
    route,
    canGoBack,
    headerBackButtonMenuEnabled:
      isRemovePrevented !== undefined
        ? !isRemovePrevented
        : headerBackButtonMenuEnabled,
    headerBackTitle:
      options.headerBackTitle !== undefined
        ? options.headerBackTitle
        : undefined,
    headerHeight,
    headerShown: header !== undefined ? false : headerShown,
    headerTopInsetEnabled,
  });

  return (
    <ScreenStackItem
      key={route.key}
      screenId={route.key}
      activityState={isPreloaded ? 0 : 2}
      style={StyleSheet.absoluteFill}
      accessibilityElementsHidden={!focused}
      importantForAccessibility={focused ? 'auto' : 'no-hide-descendants'}
      customAnimationOnSwipe={animationMatchesGesture}
      fullScreenSwipeEnabled={fullScreenGestureEnabled}
      fullScreenSwipeShadowEnabled={fullScreenGestureShadowEnabled}
      freezeOnBlur={freezeOnBlur}
      gestureEnabled={
        Platform.OS === 'android'
          ? // This prop enables handling of system back gestures on Android
            // Since we handle them in JS side, we disable this
            false
          : gestureEnabled
      }
      homeIndicatorHidden={autoHideHomeIndicator}
      hideKeyboardOnSwipe={keyboardHandlingEnabled}
      navigationBarColor={navigationBarColor}
      navigationBarTranslucent={navigationBarTranslucent}
      navigationBarHidden={navigationBarHidden}
      replaceAnimation={animationTypeForReplace}
      stackPresentation={presentation === 'card' ? 'push' : presentation}
      stackAnimation={animation}
      screenOrientation={orientation}
      sheetAllowedDetents={sheetAllowedDetents}
      sheetLargestUndimmedDetentIndex={sheetLargestUndimmedDetentIndex}
      sheetGrabberVisible={sheetGrabberVisible}
      sheetInitialDetentIndex={sheetInitialDetentIndex}
      sheetCornerRadius={sheetCornerRadius}
      sheetElevation={sheetElevation}
      sheetExpandsWhenScrolledToEdge={sheetExpandsWhenScrolledToEdge}
      statusBarAnimation={statusBarAnimation}
      statusBarHidden={statusBarHidden}
      statusBarStyle={statusBarStyle}
      statusBarColor={statusBarBackgroundColor}
      statusBarTranslucent={statusBarTranslucent}
      swipeDirection={gestureDirectionOverride}
      transitionDuration={animationDuration}
      onWillAppear={onWillAppear}
      onWillDisappear={onWillDisappear}
      onAppear={onAppear}
      onDisappear={onDisappear}
      onDismissed={onDismissed}
      onGestureCancel={onGestureCancel}
      onSheetDetentChanged={onSheetDetentChanged}
      gestureResponseDistance={gestureResponseDistance}
      nativeBackButtonDismissalEnabled={false} // on Android
      onHeaderBackButtonClicked={onHeaderBackButtonClicked}
      preventNativeDismiss={isRemovePrevented} // on iOS
      onNativeDismissCancelled={onNativeDismissCancelled}
      // Unfortunately, because of the bug that exists on Fabric, where native event drivers
      // for Animated objects are being created after the first notifications about the header height
      // from the native side, `onHeaderHeightChange` event does not notify
      // `animatedHeaderHeight` about initial values on appearing screens at the moment.
      onHeaderHeightChange={Animated.event(
        [
          {
            nativeEvent: {
              headerHeight: rawAnimatedHeaderHeight,
            },
          },
        ],
        {
          useNativeDriver: true,
          listener: (e) => {
            if (
              Platform.OS === 'android' &&
              (options.headerBackground != null || options.headerTransparent)
            ) {
              // FIXME: On Android, we get 0 if the header is translucent
              // So we set a default height in that case
              setHeaderHeight(ANDROID_DEFAULT_HEADER_HEIGHT + topInset);
              return;
            }

            if (
              e.nativeEvent &&
              typeof e.nativeEvent === 'object' &&
              'headerHeight' in e.nativeEvent &&
              typeof e.nativeEvent.headerHeight === 'number'
            ) {
              const headerHeight =
                e.nativeEvent.headerHeight + headerHeightCorrectionOffset;

              // Only debounce if header has large title or search bar
              // As it's the only case where the header height can change frequently
              const doesHeaderAnimate =
                Platform.OS === 'ios' &&
                (options.headerLargeTitle || options.headerSearchBarOptions);

              if (doesHeaderAnimate) {
                setHeaderHeightDebounced(headerHeight);
              } else {
                setHeaderHeight(headerHeight);
              }
            }
          },
        }
      )}
      contentStyle={[
        presentation !== 'transparentModal' &&
          presentation !== 'containedTransparentModal' && {
            backgroundColor: colors.background,
          },
        contentStyle,
      ]}
      headerConfig={headerConfig}
      unstable_sheetFooter={unstable_sheetFooter}
      // When ts-expect-error is added, it affects all the props below it
      // So we keep any props that need it at the end
      // Otherwise invalid props may not be caught by TypeScript
    >
      <NavigationContext.Provider value={navigation}>
        <NavigationRouteContext.Provider value={route}>
          <AnimatedHeaderHeightContext.Provider value={animatedHeaderHeight}>
            <HeaderHeightContext.Provider
              value={
                headerShown !== false ? headerHeight : parentHeaderHeight ?? 0
              }
            >
              {headerBackground != null ? (
                /**
                 * To show a custom header background, we render it at the top of the screen below the header
                 * The header also needs to be positioned absolutely (with `translucent` style)
                 */
                <View
                  style={[
                    styles.background,
                    headerTransparent ? styles.translucent : null,
                    { height: headerHeight },
                  ]}
                >
                  {headerBackground()}
                </View>
              ) : null}
              {header !== undefined && headerShown !== false ? (
                <View
                  onLayout={(e) => {
                    const headerHeight = e.nativeEvent.layout.height;

                    setHeaderHeight(headerHeight);
                    rawAnimatedHeaderHeight.setValue(headerHeight);
                  }}
                  style={[
                    styles.header,
                    headerTransparent ? styles.absolute : null,
                  ]}
                >
                  {header({
                    back: headerBack,
                    options,
                    route,
                    navigation,
                  })}
                </View>
              ) : null}
              <HeaderShownContext.Provider
                value={isParentHeaderShown || headerShown !== false}
              >
                <HeaderBackContext.Provider value={headerBack}>
                  {render()}
                </HeaderBackContext.Provider>
              </HeaderShownContext.Provider>
            </HeaderHeightContext.Provider>
          </AnimatedHeaderHeightContext.Provider>
        </NavigationRouteContext.Provider>
      </NavigationContext.Provider>
    </ScreenStackItem>
  );
};

type Props = {
  state: StackNavigationState<ParamListBase>;
  navigation: NativeStackNavigationHelpers;
  descriptors: NativeStackDescriptorMap;
  describe: (
    route: RouteProp<ParamListBase>,
    placeholder: boolean
  ) => NativeStackDescriptor;
};

export function NativeStackView({
  state,
  navigation,
  descriptors,
  describe,
}: Props) {
  const { setNextDismissedKey } = useDismissedRouteError(state);

  useInvalidPreventRemoveError(descriptors);

  const modalRouteKeys = getModalRouteKeys(state.routes, descriptors);

  const preloadedDescriptors =
    state.preloadedRoutes.reduce<NativeStackDescriptorMap>((acc, route) => {
      acc[route.key] = acc[route.key] || describe(route, true);
      return acc;
    }, {});

  return (
    <SafeAreaProviderCompat>
      <ScreenStack style={styles.container}>
        {state.routes.concat(state.preloadedRoutes).map((route, index) => {
          const descriptor =
            descriptors[route.key] ?? preloadedDescriptors[route.key];
          const isFocused = state.index === index;
          const previousKey = state.routes[index - 1]?.key;
          const nextKey = state.routes[index + 1]?.key;
          const previousDescriptor = previousKey
            ? descriptors[previousKey]
            : undefined;
          const nextDescriptor = nextKey ? descriptors[nextKey] : undefined;

          const isModal = modalRouteKeys.includes(route.key);

          const isPreloaded =
            preloadedDescriptors[route.key] !== undefined &&
            descriptors[route.key] === undefined;

          return (
            <SceneView
              key={route.key}
              index={index}
              focused={isFocused}
              descriptor={descriptor}
              previousDescriptor={previousDescriptor}
              nextDescriptor={nextDescriptor}
              isPresentationModal={isModal}
              isPreloaded={isPreloaded}
              onWillDisappear={() => {
                navigation.emit({
                  type: 'transitionStart',
                  data: { closing: true },
                  target: route.key,
                });
              }}
              onWillAppear={() => {
                navigation.emit({
                  type: 'transitionStart',
                  data: { closing: false },
                  target: route.key,
                });
              }}
              onAppear={() => {
                navigation.emit({
                  type: 'transitionEnd',
                  data: { closing: false },
                  target: route.key,
                });
              }}
              onDisappear={() => {
                navigation.emit({
                  type: 'transitionEnd',
                  data: { closing: true },
                  target: route.key,
                });
              }}
              onDismissed={(event) => {
                navigation.dispatch({
                  ...StackActions.pop(event.nativeEvent.dismissCount),
                  source: route.key,
                  target: state.key,
                });

                setNextDismissedKey(route.key);
              }}
              onHeaderBackButtonClicked={() => {
                navigation.dispatch({
                  ...StackActions.pop(),
                  source: route.key,
                  target: state.key,
                });
              }}
              onNativeDismissCancelled={(event) => {
                navigation.dispatch({
                  ...StackActions.pop(event.nativeEvent.dismissCount),
                  source: route.key,
                  target: state.key,
                });
              }}
              onGestureCancel={() => {
                navigation.emit({
                  type: 'gestureCancel',
                  target: route.key,
                });
              }}
              onSheetDetentChanged={(event) => {
                navigation.emit({
                  type: 'sheetDetentChange',
                  target: route.key,
                  data: {
                    index: event.nativeEvent.index,
                    stable: event.nativeEvent.isStable,
                  },
                });
              }}
            />
          );
        })}
      </ScreenStack>
    </SafeAreaProviderCompat>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    zIndex: 1,
  },
  absolute: {
    position: 'absolute',
    top: 0,
    start: 0,
    end: 0,
  },
  translucent: {
    position: 'absolute',
    top: 0,
    start: 0,
    end: 0,
    zIndex: 1,
    elevation: 1,
  },
  background: {
    overflow: 'hidden',
  },
});
