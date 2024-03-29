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
  type Route,
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
  Screen,
  type ScreenProps,
  ScreenStack,
  type StackPresentationTypes,
} from 'react-native-screens';
import warnOnce from 'warn-once';

import type {
  NativeStackDescriptor,
  NativeStackDescriptorMap,
  NativeStackNavigationHelpers,
  NativeStackNavigationOptions,
} from '../types';
import { debounce } from '../utils/debounce';
import { getModalRouteKeys } from '../utils/getModalRoutesKeys';
import { AnimatedHeaderHeightContext } from '../utils/useAnimatedHeaderHeight';
import { useDismissedRouteError } from '../utils/useDismissedRouteError';
import { useInvalidPreventRemoveError } from '../utils/useInvalidPreventRemoveError';
import { DebugContainer } from './DebugContainer';
import { HeaderConfig } from './HeaderConfig';

const isAndroid = Platform.OS === 'android';

const MaybeNestedStack = ({
  options,
  route,
  presentation,
  headerHeight,
  headerTopInsetEnabled,
  children,
}: {
  options: NativeStackNavigationOptions;
  route: Route<string>;
  presentation: Exclude<StackPresentationTypes, 'push'> | 'card';
  headerHeight: number;
  headerTopInsetEnabled: boolean;
  children: React.ReactNode;
}) => {
  const { colors } = useTheme();
  const { header, headerShown = true, contentStyle } = options;

  const isHeaderInModal = isAndroid
    ? false
    : presentation !== 'card' && headerShown === true && header === undefined;

  const headerShownPreviousRef = React.useRef(headerShown);

  React.useEffect(() => {
    warnOnce(
      !isAndroid &&
        presentation !== 'card' &&
        headerShownPreviousRef.current !== headerShown,
      `Dynamically changing 'headerShown' in modals will result in remounting the screen and losing all local state. See options for the screen '${route.name}'.`
    );

    headerShownPreviousRef.current = headerShown;
  }, [headerShown, presentation, route.name]);

  const content = (
    <DebugContainer
      style={[
        styles.container,
        presentation !== 'transparentModal' &&
          presentation !== 'containedTransparentModal' && {
            backgroundColor: colors.background,
          },
        contentStyle,
      ]}
      stackPresentation={presentation === 'card' ? 'push' : presentation}
    >
      {children}
    </DebugContainer>
  );

  if (isHeaderInModal) {
    return (
      <ScreenStack style={styles.container}>
        <Screen
          enabled
          isNativeStack
          hasLargeHeader={options.headerLargeTitle ?? false}
          style={StyleSheet.absoluteFill}
        >
          {content}
          <HeaderConfig
            {...options}
            route={route}
            headerHeight={headerHeight}
            headerTopInsetEnabled={headerTopInsetEnabled}
            canGoBack
          />
        </Screen>
      </ScreenStack>
    );
  }

  return content;
};

type SceneViewProps = {
  index: number;
  focused: boolean;
  descriptor: NativeStackDescriptor;
  previousDescriptor?: NativeStackDescriptor;
  nextDescriptor?: NativeStackDescriptor;
  isPresentationModal?: boolean;
  onWillDisappear: () => void;
  onWillAppear: () => void;
  onAppear: () => void;
  onDisappear: () => void;
  onDismissed: ScreenProps['onDismissed'];
  onHeaderBackButtonClicked: ScreenProps['onHeaderBackButtonClicked'];
  onNativeDismissCancelled: ScreenProps['onDismissed'];
  onGestureCancel: ScreenProps['onGestureCancel'];
};

const SceneView = ({
  index,
  focused,
  descriptor,
  previousDescriptor,
  nextDescriptor,
  isPresentationModal,
  onWillDisappear,
  onWillAppear,
  onAppear,
  onDisappear,
  onDismissed,
  onHeaderBackButtonClicked,
  onNativeDismissCancelled,
  onGestureCancel,
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
    navigationBarHidden,
    orientation,
    sheetAllowedDetents = 'large',
    sheetLargestUndimmedDetent = 'all',
    sheetGrabberVisible = false,
    sheetCornerRadius = -1.0,
    sheetExpandsWhenScrolledToEdge = true,
    statusBarAnimation,
    statusBarHidden,
    statusBarStyle,
    statusBarTranslucent,
    statusBarBackgroundColor,
    freezeOnBlur,
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
    android: 56 + topInset,
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

  if (isAndroid && !hasCustomHeader) {
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

  const headerTopInsetEnabled = topInset !== 0;

  const backTitle = previousDescriptor
    ? getHeaderTitle(previousDescriptor.options, previousDescriptor.route.name)
    : parentHeaderBack?.title;

  const headerBack = React.useMemo(
    () => ({
      // No href needed for native
      href: undefined,
      title: backTitle,
    }),
    [backTitle]
  );

  const isRemovePrevented = preventedRoutes[route.key]?.preventRemove;

  return (
    <Screen
      key={route.key}
      enabled
      isNativeStack
      style={StyleSheet.absoluteFill}
      hasLargeHeader={options.headerLargeTitle ?? false}
      customAnimationOnSwipe={animationMatchesGesture}
      fullScreenSwipeEnabled={fullScreenGestureEnabled}
      gestureEnabled={
        isAndroid
          ? // This prop enables handling of system back gestures on Android
            // Since we handle them in JS side, we disable this
            false
          : gestureEnabled
      }
      homeIndicatorHidden={autoHideHomeIndicator}
      hideKeyboardOnSwipe={keyboardHandlingEnabled}
      navigationBarColor={navigationBarColor}
      navigationBarHidden={navigationBarHidden}
      replaceAnimation={animationTypeForReplace}
      stackPresentation={presentation === 'card' ? 'push' : presentation}
      stackAnimation={animation}
      screenOrientation={orientation}
      sheetAllowedDetents={sheetAllowedDetents}
      sheetLargestUndimmedDetent={sheetLargestUndimmedDetent}
      sheetGrabberVisible={sheetGrabberVisible}
      sheetCornerRadius={sheetCornerRadius}
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
      // this prop is available since rn-screens 3.16
      freezeOnBlur={freezeOnBlur}
    >
      <NavigationContext.Provider value={navigation}>
        <NavigationRouteContext.Provider value={route}>
          <HeaderShownContext.Provider
            value={isParentHeaderShown || headerShown !== false}
          >
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
                <View
                  accessibilityElementsHidden={!focused}
                  importantForAccessibility={
                    focused ? 'auto' : 'no-hide-descendants'
                  }
                  style={styles.scene}
                >
                  <MaybeNestedStack
                    options={options}
                    route={route}
                    presentation={presentation}
                    headerHeight={headerHeight}
                    headerTopInsetEnabled={headerTopInsetEnabled}
                  >
                    <HeaderBackContext.Provider value={headerBack}>
                      {render()}
                    </HeaderBackContext.Provider>
                  </MaybeNestedStack>
                  {header !== undefined && headerShown !== false ? (
                    <View
                      onLayout={(e) => {
                        const headerHeight = e.nativeEvent.layout.height;

                        setHeaderHeight(headerHeight);
                        rawAnimatedHeaderHeight.setValue(headerHeight);
                      }}
                      style={headerTransparent ? styles.absolute : null}
                    >
                      {header({
                        back: headerBack,
                        options,
                        route,
                        navigation,
                      })}
                    </View>
                  ) : null}
                </View>
                {/**
                 * `HeaderConfig` needs to be the direct child of `Screen` without any intermediate `View`
                 * We don't render it conditionally to make it possible to dynamically render a custom `header`
                 * Otherwise dynamically rendering a custom `header` leaves the native header visible
                 *
                 * https://github.com/software-mansion/react-native-screens/blob/main/guides/GUIDE_FOR_LIBRARY_AUTHORS.md#screenstackheaderconfig
                 *
                 * HeaderConfig must not be first child of a Screen.
                 * See https://github.com/software-mansion/react-native-screens/pull/1825
                 * for detailed explanation
                 */}
                <HeaderConfig
                  {...options}
                  route={route}
                  headerBackButtonMenuEnabled={
                    isRemovePrevented !== undefined
                      ? !isRemovePrevented
                      : headerBackButtonMenuEnabled
                  }
                  headerShown={header !== undefined ? false : headerShown}
                  headerHeight={headerHeight}
                  headerBackTitle={
                    options.headerBackTitle !== undefined
                      ? options.headerBackTitle
                      : undefined
                  }
                  headerTopInsetEnabled={headerTopInsetEnabled}
                  canGoBack={headerBack !== undefined}
                />
              </HeaderHeightContext.Provider>
            </AnimatedHeaderHeightContext.Provider>
          </HeaderShownContext.Provider>
        </NavigationRouteContext.Provider>
      </NavigationContext.Provider>
    </Screen>
  );
};

type Props = {
  state: StackNavigationState<ParamListBase>;
  navigation: NativeStackNavigationHelpers;
  descriptors: NativeStackDescriptorMap;
};

export function NativeStackView({ state, navigation, descriptors }: Props) {
  const { setNextDismissedKey } = useDismissedRouteError(state);

  const { colors } = useTheme();

  useInvalidPreventRemoveError(descriptors);

  const modalRouteKeys = getModalRouteKeys(state.routes, descriptors);

  return (
    <SafeAreaProviderCompat style={{ backgroundColor: colors.background }}>
      <ScreenStack style={styles.container}>
        {state.routes.map((route, index) => {
          const descriptor = descriptors[route.key];
          const isFocused = state.index === index;
          const previousKey = state.routes[index - 1]?.key;
          const nextKey = state.routes[index + 1]?.key;
          const previousDescriptor = previousKey
            ? descriptors[previousKey]
            : undefined;
          const nextDescriptor = nextKey ? descriptors[nextKey] : undefined;

          const isModal = modalRouteKeys.includes(route.key);

          return (
            <SceneView
              key={route.key}
              index={index}
              focused={isFocused}
              descriptor={descriptor}
              previousDescriptor={previousDescriptor}
              nextDescriptor={nextDescriptor}
              isPresentationModal={isModal}
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
  scene: {
    flex: 1,
    flexDirection: 'column-reverse',
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
