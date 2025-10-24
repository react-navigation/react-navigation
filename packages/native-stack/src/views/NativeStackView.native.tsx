import {
  getHeaderTitle,
  HeaderBackContext,
  SafeAreaProviderCompat,
  useHeaderConfig,
  useHeaderConfigProp,
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
import { Platform, StyleSheet } from 'react-native';
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
import { getModalRouteKeys } from '../utils/getModalRoutesKeys';
import { useDismissedRouteError } from '../utils/useDismissedRouteError';
import { useInvalidPreventRemoveError } from '../utils/useInvalidPreventRemoveError';

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

const SceneView = ({
  index,
  focused,
  shouldFreeze,
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
    statusBarAnimation,
    statusBarHidden,
    statusBarStyle,
    unstable_sheetFooter,
    scrollEdgeEffects,
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

  // `modal` and `formSheet` presentations do not take whole screen, so should not take the inset.
  const isModal = presentation === 'modal' || presentation === 'formSheet';

  const { preventedRoutes } = usePreventRemoveContext();

  const parentHeaderBack = React.useContext(HeaderBackContext);

  const canGoBack = previousDescriptor != null || parentHeaderBack != null;
  const backTitle = previousDescriptor
    ? getHeaderTitle(previousDescriptor.options, previousDescriptor.route.name)
    : parentHeaderBack?.title;

  const isRemovePrevented = preventedRoutes[route.key]?.preventRemove;

  const headerBack = React.useMemo(() => {
    if (canGoBack) {
      return {
        href: undefined, // No href needed for native
        title: backTitle,
      };
    }

    return undefined;
  }, [canGoBack, backTitle]);

  const {
    onHeaderHeightChange,
    headerHeight,
    headerTopInsetEnabled,
    HeaderProvider,
  } = useHeaderConfig({
    isModal,
    options,
    headerShown: options.headerShown !== false,
    renderCustomHeader: header
      ? () =>
          header({
            back: headerBack,
            options,
            route,
            navigation,
          })
      : null,
  });

  const headerConfigProp = useHeaderConfigProp({
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

  return (
    <NavigationContext.Provider value={navigation}>
      <NavigationRouteContext.Provider value={route}>
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
          statusBarAnimation={statusBarAnimation}
          statusBarHidden={statusBarHidden}
          statusBarStyle={statusBarStyle}
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
          scrollEdgeEffects={{
            bottom: scrollEdgeEffects?.bottom ?? 'automatic',
            top: scrollEdgeEffects?.top ?? 'automatic',
            left: scrollEdgeEffects?.left ?? 'automatic',
            right: scrollEdgeEffects?.right ?? 'automatic',
          }}
          onNativeDismissCancelled={onNativeDismissCancelled}
          // Unfortunately, because of the bug that exists on Fabric, where native event drivers
          // for Animated objects are being created after the first notifications about the header height
          // from the native side, `onHeaderHeightChange` event does not notify
          // `animatedHeaderHeight` about initial values on appearing screens at the moment.
          onHeaderHeightChange={onHeaderHeightChange}
          contentStyle={[
            presentation !== 'transparentModal' &&
              presentation !== 'containedTransparentModal' && {
                backgroundColor: colors.background,
              },
            contentStyle,
          ]}
          headerConfig={headerConfigProp}
          unstable_sheetFooter={unstable_sheetFooter}
          // When ts-expect-error is added, it affects all the props below it
          // So we keep any props that need it at the end
          // Otherwise invalid props may not be caught by TypeScript
          shouldFreeze={shouldFreeze}
        >
          <HeaderProvider>
            <HeaderBackContext.Provider value={headerBack}>
              {render()}
            </HeaderBackContext.Provider>
          </HeaderProvider>
        </ScreenStackItem>
      </NavigationRouteContext.Provider>
    </NavigationContext.Provider>
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
          const isBelowFocused = state.index - 1 === index;
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

          // On Fabric, when screen is frozen, animated and reanimated values are not updated
          // due to component being unmounted. To avoid this, we don't freeze the previous screen there
          const shouldFreeze = isFabric()
            ? !isPreloaded && !isFocused && !isBelowFocused
            : !isPreloaded && !isFocused;

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
