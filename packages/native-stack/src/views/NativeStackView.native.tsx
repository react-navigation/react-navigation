import {
  getDefaultHeaderHeight,
  getHeaderTitle,
  HeaderBackContext,
  HeaderHeightContext,
  HeaderShownContext,
  useFrameSize,
} from '@react-navigation/elements';
import { SafeAreaProviderCompat } from '@react-navigation/elements/internal';
import {
  NavigationProvider,
  type ParamListBase,
  StackActions,
  type StackNavigationState,
  usePreventRemoveContext,
  useTheme,
} from '@react-navigation/native';
import * as React from 'react';
import {
  Animated,
  Platform,
  StyleSheet,
  useAnimatedValue,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  type ScreenProps,
  ScreenStack,
  ScreenStackItem,
} from 'react-native-screens';

import {
  clearZoomTransitionRouteConfig,
  setZoomTransitionRouteConfig,
  setZoomTransitionSource,
} from '../native/NativeStackZoomTransitionModule';
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
import { ZoomTransitionRouteKeyContext } from '../utils/ZoomTransitionRouteKeyContext';
import { useHeaderConfigProps } from './useHeaderConfigProps';

const ANDROID_DEFAULT_HEADER_HEIGHT = 56;

function isFabric() {
  return 'nativeFabricUIManager' in global;
}

type SceneViewProps = {
  index: number;
  focused: boolean;
  shouldFreeze: boolean;
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

const useNativeDriver = Platform.OS !== 'web';

const SceneView = ({
  index,
  focused,
  shouldFreeze,
  descriptor,
  previousDescriptor,
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

  const {
    animation,
    animationDuration,
    animationMatchesGesture,
    animationTypeForReplace = 'push',
    fullScreenGestureEnabled,
    fullScreenGestureShadowEnabled = true,
    gestureEnabled,
    gestureDirection,
    gestureResponseDistance,
    header,
    headerBackButtonMenuEnabled,
    headerShown,
    headerBackground,
    headerTransparent,
    autoHideHomeIndicator,
    keyboardHandlingEnabled,
    navigationBarHidden,
    orientation,
    sheetAllowedDetents = [1.0],
    sheetLargestUndimmedDetentIndex = -1,
    sheetGrabberVisible = false,
    sheetCornerRadius = -1.0,
    sheetElevation = 24,
    sheetExpandsWhenScrolledToEdge = true,
    sheetInitialDetentIndex = 0,
    sheetShouldOverflowTopInset = false,
    sheetResizeAnimationEnabled = true,
    statusBarAnimation,
    statusBarHidden,
    statusBarStyle,
    unstable_sheetFooter,
    zoomTransitionSourceId,
    zoomTransitionDimmingColor,
    zoomTransitionDimmingBlurEffect,
    scrollEdgeEffects,
    freezeOnBlur,
    contentStyle,
  } = options;

  let { presentation = isPresentationModal ? 'modal' : 'card' } = options;

  if (index === 0) {
    // first screen should always be treated as `card`, it resolves problems with no header animation
    // for navigator with first screen as `modal` and the next as `card`
    presentation = 'card';
  }

  const shouldEnableZoomTransition =
    Platform.OS === 'ios' &&
    presentation === 'card' &&
    zoomTransitionSourceId != null;

  React.useLayoutEffect(() => {
    if (shouldEnableZoomTransition) {
      setZoomTransitionSource(zoomTransitionSourceId);
      setZoomTransitionRouteConfig({
        routeKey: route.key,
        sourceId: zoomTransitionSourceId,
        targetId: zoomTransitionSourceId,
        dimmingColor: zoomTransitionDimmingColor,
        dimmingBlurEffect: zoomTransitionDimmingBlurEffect,
        interactiveDismiss: gestureEnabled,
      });
    } else {
      clearZoomTransitionRouteConfig(route.key);
    }

    return () => {
      clearZoomTransitionRouteConfig(route.key);
    };
  }, [
    gestureEnabled,
    route.key,
    shouldEnableZoomTransition,
    zoomTransitionDimmingBlurEffect,
    zoomTransitionDimmingColor,
    zoomTransitionSourceId,
  ]);

  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  // `modal`, `formSheet` and `pageSheet` presentations do not take whole screen, so should not take the inset.
  const isModal =
    presentation === 'modal' ||
    presentation === 'formSheet' ||
    presentation === 'pageSheet';

  // Modals are fullscreen in landscape only on iPhone
  const isIPhone = Platform.OS === 'ios' && !(Platform.isPad || Platform.isTV);

  const isParentHeaderShown = React.useContext(HeaderShownContext);
  const parentHeaderHeight = React.useContext(HeaderHeightContext);
  const parentHeaderBack = React.useContext(HeaderBackContext);

  const isLandscape = useFrameSize((frame) => frame.width > frame.height);

  const topInset =
    isParentHeaderShown ||
    (Platform.OS === 'ios' && isModal) ||
    (isIPhone && isLandscape)
      ? 0
      : insets.top;

  const defaultHeaderHeight = useFrameSize((frame) =>
    Platform.select({
      // FIXME: Currently screens isn't using Material 3
      // So our `getDefaultHeaderHeight` doesn't return the correct value
      // So we hardcode the value here for now until screens is updated
      android: ANDROID_DEFAULT_HEADER_HEIGHT + topInset,
      default: getDefaultHeaderHeight({
        landscape: frame.width > frame.height,
        modalPresentation: isModal,
        topInset,
      }),
    })
  );

  const { preventedRoutes } = usePreventRemoveContext();

  const [headerHeight, setHeaderHeight] = React.useState(defaultHeaderHeight);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const setHeaderHeightDebounced = React.useCallback(
    // Debounce the header height updates to avoid excessive re-renders
    debounce(setHeaderHeight, 100),
    []
  );

  const hasCustomHeader = header != null;

  const headerTopInsetEnabled = topInset !== 0;

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

  const animatedHeaderHeight = useAnimatedValue(defaultHeaderHeight);

  const headerConfig = useHeaderConfigProps({
    ...options,
    route,
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
    headerBack,
  });

  const onHeaderHeightChange = hasCustomHeader
    ? // If we have a custom header, don't use native header height
      undefined
    : // On Fabric, there's a bug where native event drivers for Animated objects
      // are created after the first notifications about the header height
      // from the native side, `onHeaderHeightChange` event does not notify
      // `animatedHeaderHeight` about initial values on appearing screens at the moment.
      Animated.event(
        [
          {
            nativeEvent: {
              headerHeight: animatedHeaderHeight,
            },
          },
        ],
        {
          useNativeDriver,
          listener: (e) => {
            if (
              e.nativeEvent &&
              typeof e.nativeEvent === 'object' &&
              'headerHeight' in e.nativeEvent &&
              typeof e.nativeEvent.headerHeight === 'number'
            ) {
              const headerHeight = e.nativeEvent.headerHeight;

              // Only debounce if header has large title or search bar
              // As it's the only case where the header height can change frequently
              const doesHeaderAnimate =
                Platform.OS === 'ios' &&
                (options.headerLargeTitleEnabled ||
                  options.headerSearchBarOptions);

              if (doesHeaderAnimate) {
                setHeaderHeightDebounced(headerHeight);
              } else {
                if (
                  Platform.OS === 'android' &&
                  headerHeight !== 0 &&
                  headerHeight <= ANDROID_DEFAULT_HEADER_HEIGHT
                ) {
                  // FIXME: On Android, events may get delivered out-of-order
                  // https://github.com/facebook/react-native/issues/54636
                  // We seem to get header height without status bar height first,
                  // and then the correct height with status bar height included
                  // But due to out-of-order delivery, we may get the correct height first
                  // and then the one without status bar height
                  // This is hack to include status bar height if it's not already included
                  // It only works because header height doesn't change dynamically on Android
                  setHeaderHeight(headerHeight + insets.top);
                } else {
                  setHeaderHeight(headerHeight);
                }
              }
            }
          },
        }
      );

  return (
    <NavigationProvider navigation={navigation} route={route}>
      <ScreenStackItem
        key={route.key}
        screenId={route.key}
        activityState={isPreloaded ? 0 : 2}
        style={StyleSheet.absoluteFill}
        aria-hidden={!focused}
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
        sheetShouldOverflowTopInset={sheetShouldOverflowTopInset}
        sheetDefaultResizeAnimationEnabled={sheetResizeAnimationEnabled}
        statusBarAnimation={statusBarAnimation}
        statusBarHidden={statusBarHidden}
        statusBarStyle={statusBarStyle}
        swipeDirection={gestureDirection}
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
        scrollEdgeEffects={{
          bottom: scrollEdgeEffects?.bottom ?? 'automatic',
          top: scrollEdgeEffects?.top ?? 'automatic',
          left: scrollEdgeEffects?.left ?? 'automatic',
          right: scrollEdgeEffects?.right ?? 'automatic',
        }}
        onNativeDismissCancelled={onNativeDismissCancelled}
        onHeaderHeightChange={onHeaderHeightChange}
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
        shouldFreeze={shouldFreeze}
      >
        <AnimatedHeaderHeightContext.Provider value={animatedHeaderHeight}>
          <HeaderHeightContext.Provider
            value={
              headerShown !== false ? headerHeight : (parentHeaderHeight ?? 0)
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
            {header != null && headerShown !== false ? (
              <View
                onLayout={(e) => {
                  const headerHeight = e.nativeEvent.layout.height;

                  animatedHeaderHeight.setValue(headerHeight);
                  setHeaderHeight(headerHeight);
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
                <ZoomTransitionRouteKeyContext.Provider value={route.key}>
                  {render()}
                </ZoomTransitionRouteKeyContext.Provider>
              </HeaderBackContext.Provider>
            </HeaderShownContext.Provider>
          </HeaderHeightContext.Provider>
        </AnimatedHeaderHeightContext.Provider>
      </ScreenStackItem>
    </NavigationProvider>
  );
};

type Props = {
  state: StackNavigationState<ParamListBase>;
  navigation: NativeStackNavigationHelpers;
  descriptors: NativeStackDescriptorMap;
};

export function NativeStackView({ state, navigation, descriptors }: Props) {
  const { setNextDismissedKey } = useDismissedRouteError(state);

  useInvalidPreventRemoveError(descriptors);

  const modalRouteKeys = getModalRouteKeys(state.routes, descriptors);

  return (
    <SafeAreaProviderCompat>
      <ScreenStack style={styles.container}>
        {state.routes.concat(state.preloadedRoutes).map((route, index) => {
          const descriptor = descriptors[route.key];
          const isFocused = state.index === index;
          const isBelowFocused = state.index - 1 === index;
          const previousKey = state.routes[index - 1]?.key;
          const nextKey = state.routes[index + 1]?.key;
          const previousDescriptor = previousKey
            ? descriptors[previousKey]
            : undefined;
          const nextDescriptor = nextKey ? descriptors[nextKey] : undefined;

          const isModal = modalRouteKeys.includes(route.key);
          const isModalOnIos = isModal && Platform.OS === 'ios';

          const isPreloaded = state.preloadedRoutes.some(
            (r) => r.key === route.key
          );

          // On Fabric, when screen is frozen, animated and reanimated values are not updated
          // due to component being unmounted. To avoid this, we don't freeze the previous screen there
          const shouldFreeze = isFabric()
            ? !isPreloaded && !isFocused && !isBelowFocused && !isModalOnIos
            : !isPreloaded && !isFocused && !isModalOnIos;

          return (
            <SceneView
              key={route.key}
              index={index}
              focused={isFocused}
              shouldFreeze={shouldFreeze}
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
