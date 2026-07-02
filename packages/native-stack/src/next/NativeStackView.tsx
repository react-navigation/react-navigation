import {
  getDefaultHeaderHeight,
  getHeaderTitle,
  HeaderBackContext,
  HeaderHeightContext,
  HeaderShownContext,
  type Icon,
  useFrameSize,
} from '@react-navigation/elements';
import {
  ActivityView,
  SafeAreaProviderCompat,
} from '@react-navigation/elements/internal';
import {
  MaterialSymbol,
  NavigationProvider,
  type ParamListBase,
  type Route,
  StackActions,
  type StackNavigationState,
  usePreventRemoveContext,
  useTheme,
} from '@react-navigation/native';
import * as React from 'react';
import {
  type ColorValue,
  Platform,
  StyleSheet,
  useAnimatedValue,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Stack,
  type StackHeaderConfigProps,
} from 'react-native-screens/experimental';

import type {
  NativeStackDescriptor,
  NativeStackDescriptorMap,
  NativeStackNavigationHelpers,
} from '../types';
import { AnimatedHeaderHeightContext } from '../utils/useAnimatedHeaderHeight';
import { useDismissedRouteError } from '../utils/useDismissedRouteError';
import { useInvalidPreventRemoveError } from '../utils/useInvalidPreventRemoveError';

type Props = {
  state: StackNavigationState<ParamListBase>;
  navigation: NativeStackNavigationHelpers;
  descriptors: NativeStackDescriptorMap;
};

type StackHeaderConfigAndroid = NonNullable<StackHeaderConfigProps['android']>;

type NativeStackViewState = {
  previous: {
    index: number;
    routes: Route<string>[];
    descriptors: NativeStackDescriptorMap;
  };
  popped: {
    route: Route<string>;
    descriptor: NativeStackDescriptor;
  }[];
  nativelyDismissedRouteKeys: string[];
};

type NativeStackViewStateAction =
  | {
      type: 'SYNC_STATE';
      index: number;
      routes: Route<string>[];
      descriptors: NativeStackDescriptorMap;
    }
  | { type: 'REMOVE_POPPED_ROUTE'; key: string }
  | { type: 'ADD_NATIVELY_DISMISSED_ROUTES'; keys: string[] };

function reducer(
  state: NativeStackViewState,
  action: NativeStackViewStateAction
) {
  switch (action.type) {
    case 'SYNC_STATE': {
      const routeKeys = action.routes.map((route) => route.key);

      let popped = state.popped;
      let nativelyDismissedRouteKeys = state.nativelyDismissedRouteKeys;

      if (action.routes !== state.previous.routes) {
        // Routes removed by JS need to stay rendered so screens can animate the native pop.
        // Routes already dismissed by native shouldn't be added here,
        // otherwise screens would try to pop them a second time and crash.
        const previousActiveRoutes = state.previous.routes.slice(
          0,
          state.previous.index + 1
        );

        const nextPoppedRoutes = previousActiveRoutes.filter((r) => {
          if (routeKeys.includes(r.key)) {
            return false;
          }

          if (popped.some((p) => p.route.key === r.key)) {
            return false;
          }

          if (nativelyDismissedRouteKeys.includes(r.key)) {
            return false;
          }

          return true;
        });

        // Keep removed JS-driven routes around until screens tells us the native
        // pop finished via onDismiss.
        if (nextPoppedRoutes.length > 0) {
          popped = [
            ...popped,
            ...nextPoppedRoutes.map((r) => ({
              route: r,
              descriptor:
                action.descriptors[r.key] || state.previous.descriptors[r.key],
            })),
          ];
        }

        // Once native-dismissed routes have left navigation state, stop tracking them.
        if (nativelyDismissedRouteKeys.length > 0) {
          const nextNativelyDismissedRouteKeys =
            nativelyDismissedRouteKeys.filter((key) => routeKeys.includes(key));

          if (
            nextNativelyDismissedRouteKeys.length !==
            nativelyDismissedRouteKeys.length
          ) {
            nativelyDismissedRouteKeys = nextNativelyDismissedRouteKeys;
          }
        }
      }

      if (
        action.index === state.previous.index &&
        action.routes === state.previous.routes &&
        action.descriptors === state.previous.descriptors &&
        popped === state.popped &&
        nativelyDismissedRouteKeys === state.nativelyDismissedRouteKeys
      ) {
        return state;
      }

      return {
        previous: {
          index: action.index,
          routes: action.routes,
          descriptors: action.descriptors,
        },
        popped,
        nativelyDismissedRouteKeys,
      };
    }

    case 'REMOVE_POPPED_ROUTE': {
      const popped = state.popped.filter((p) => p.route.key !== action.key);

      return popped.length === state.popped.length
        ? state
        : {
            ...state,
            popped,
          };
    }

    case 'ADD_NATIVELY_DISMISSED_ROUTES': {
      const keys = action.keys.filter(
        (key) => !state.nativelyDismissedRouteKeys.includes(key)
      );

      return keys.length === 0
        ? state
        : {
            ...state,
            nativelyDismissedRouteKeys: [
              ...state.nativelyDismissedRouteKeys,
              ...keys,
            ],
          };
    }
  }
}

export function NativeStackView({ state, navigation, descriptors }: Props) {
  const { colors } = useTheme();

  const parentHeaderBack = React.use(HeaderBackContext);

  const { preventedRoutes } = usePreventRemoveContext();
  const { setNextDismissedKey } = useDismissedRouteError(state);

  useInvalidPreventRemoveError(descriptors);

  const [viewState, dispatchViewState] = React.useReducer(reducer, {
    previous: {
      index: state.index,
      routes: state.routes,
      descriptors,
    },
    popped: [],
    nativelyDismissedRouteKeys: [],
  });

  if (
    state.index !== viewState.previous.index ||
    state.routes !== viewState.previous.routes ||
    descriptors !== viewState.previous.descriptors
  ) {
    dispatchViewState({
      type: 'SYNC_STATE',
      index: state.index,
      routes: state.routes,
      descriptors,
    });
  }

  const activeRoutes = state.routes.slice(0, state.index + 1);
  const detachedRoutes = state.routes.slice(state.index + 1);

  const routes = [
    ...activeRoutes,
    ...viewState.popped.map((p) => p.route),
    ...detachedRoutes,
  ];

  return (
    <SafeAreaProviderCompat>
      <Stack.Host>
        {routes.map((route) => {
          const descriptor =
            descriptors[route.key] ||
            viewState.popped.find((p) => p.route.key === route.key)?.descriptor;

          if (descriptor == null) {
            throw new Error(
              `Couldn't find descriptor for route ${route.name} (${route.key}). This is likely a bug.`
            );
          }

          const {
            header,
            headerShown,
            headerLeft,
            headerRight,
            headerTitle,
            headerBackTitle,
            headerBackIcon,
            headerBackVisible,
            headerBackground,
            headerTransparent,
            headerLargeTitleEnabled,
            headerTintColor,
            inactiveBehavior = 'pause',
          } = descriptor.options;

          const index = state.routes.findIndex((r) => r.key === route.key);

          const isPopped = viewState.popped.some(
            (p) => p.route.key === route.key
          );
          const isDetached = detachedRoutes.some((r) => r.key === route.key);
          const isFocused = index === state.index;
          const isBeforeLast = index === activeRoutes.length - 2;

          const previousKey =
            index > 0 ? activeRoutes[index - 1]?.key : undefined;
          const previousDescriptor = previousKey
            ? descriptors[previousKey]
            : undefined;

          const isRemovePrevented = preventedRoutes[route.key]?.preventRemove;

          const hasCustomHeader = header !== undefined;

          const headerTitleText = getHeaderTitle(
            descriptor.options,
            route.name
          );

          const previousHeaderTitle =
            previousDescriptor != null
              ? getHeaderTitle(
                  previousDescriptor.options,
                  previousDescriptor.route.name
                )
              : undefined;

          const canGoBack =
            previousDescriptor != null || parentHeaderBack != null;
          const headerBack = canGoBack
            ? {
                href: undefined,
                title: previousHeaderTitle ?? parentHeaderBack?.title,
              }
            : undefined;

          const headerLeftElement = hasCustomHeader
            ? null
            : headerLeft?.({
                tintColor: headerTintColor,
                canGoBack,
                label: headerBackTitle ?? headerBack?.title,
                href: undefined,
              });

          const headerTitleElement =
            !hasCustomHeader && typeof headerTitle === 'function'
              ? headerTitle({
                  tintColor: headerTintColor,
                  children: headerTitleText,
                })
              : null;

          const headerRightElement = hasCustomHeader
            ? null
            : headerRight?.({
                tintColor: headerTintColor,
                canGoBack,
              });

          const headerBackgroundElement =
            Platform.OS === 'android' &&
            headerBackground != null &&
            !hasCustomHeader &&
            headerShown !== false
              ? headerBackground()
              : null;

          const headerConfig: StackHeaderConfigProps = {
            title: headerTitleElement == null ? headerTitleText : undefined,
            hidden: hasCustomHeader || headerShown === false,
            transparent: headerBackground != null || headerTransparent,
            backButtonHidden:
              headerBackVisible === false ||
              !canGoBack ||
              (headerLeftElement != null && headerBackVisible !== true),
            android: {
              type: headerLargeTitleEnabled ? 'large' : undefined,
              backgroundSubview:
                headerBackgroundElement != null
                  ? { Component: headerBackgroundElement }
                  : undefined,
              leadingSubview:
                headerLeftElement != null
                  ? { Component: headerLeftElement }
                  : undefined,
              centerSubview:
                headerTitleElement != null
                  ? { Component: headerTitleElement }
                  : undefined,
              trailingSubview:
                headerRightElement != null
                  ? { Component: headerRightElement }
                  : undefined,
              backButtonTintColor: headerTintColor,
              backButtonIcon: headerBackIcon
                ? getAndroidBackButtonIcon(
                    headerBackIcon,
                    headerTintColor ?? colors.text
                  )
                : undefined,
            },
          };

          const activityMode =
            inactiveBehavior === 'none' || isFocused || isPopped || isDetached
              ? 'normal'
              : inactiveBehavior === 'unmount' &&
                  !isBeforeLast &&
                  !('state' in route && route.state)
                ? 'unmounted'
                : 'paused';

          /*
           * Native stack options without an equivalent in the current
           * react-native-screens experimental stack API:
           * - headerBackTitle
           * - headerBackTitleStyle
           * - headerLargeStyle
           * - headerLargeTitleShadowVisible
           * - headerLargeTitleStyle
           * - headerStyle
           * - headerShadowVisible
           * - headerBlurEffect
           * - headerLeftBackgroundVisible
           * - headerRightBackgroundVisible
           * - unstable_headerLeftItems
           * - unstable_headerRightItems
           * - headerTitleAlign
           * - headerTitleStyle
           * - headerSearchBarOptions
           * - headerBackButtonMenuEnabled
           * - headerBackButtonDisplayMode
           * - autoHideHomeIndicator
           * - keyboardHandlingEnabled
           * - navigationBarHidden
           * - statusBarAnimation
           * - statusBarHidden
           * - statusBarStyle
           * - gestureDirection
           * - animationMatchesGesture
           * - fullScreenGestureEnabled
           * - fullScreenGestureShadowEnabled
           * - gestureEnabled
           * - gestureResponseDistance
           * - animationTypeForReplace
           * - animation
           * - animationDuration
           * - presentation
           * - sheetAllowedDetents
           * - sheetElevation
           * - sheetExpandsWhenScrolledToEdge
           * - sheetCornerRadius
           * - sheetInitialDetentIndex
           * - sheetGrabberVisible
           * - sheetLargestUndimmedDetentIndex
           * - sheetShouldOverflowTopInset
           * - sheetResizeAnimationEnabled
           * - orientation
           * - scrollEdgeEffects
           * - unstable_sheetFooter
           *
           * react-native-screens experimental stack options not mapped here:
           * - android.type: 'medium'
           * - android.backgroundSubview.collapseMode
           * - android.backButtonIcon: 'drawableResource'
           * - android.scrollFlagScroll
           * - android.scrollFlagEnterAlways
           * - android.scrollFlagEnterAlwaysCollapsed
           * - android.scrollFlagExitUntilCollapsed
           * - android.scrollFlagSnap
           */
          return (
            <Stack.Screen
              key={route.key}
              screenKey={route.key}
              activityMode={isPopped || isDetached ? 'detached' : 'attached'}
              preventNativeDismiss={isRemovePrevented}
              onWillAppear={() => {
                navigation.emit({
                  type: 'transitionStart',
                  data: { closing: false },
                  target: route.key,
                });
              }}
              onDidAppear={() => {
                navigation.emit({
                  type: 'transitionEnd',
                  data: { closing: false },
                  target: route.key,
                });
              }}
              onWillDisappear={() => {
                navigation.emit({
                  type: 'transitionStart',
                  data: { closing: true },
                  target: route.key,
                });
              }}
              onDidDisappear={() => {
                navigation.emit({
                  type: 'transitionEnd',
                  data: { closing: true },
                  target: route.key,
                });
              }}
              onDismiss={(screenKey) => {
                dispatchViewState({
                  type: 'REMOVE_POPPED_ROUTE',
                  key: screenKey,
                });
              }}
              onNativeDismiss={(screenKey) => {
                const routeIndex = state.routes.findIndex(
                  (r) => r.key === screenKey
                );

                if (routeIndex === -1) {
                  return;
                }

                const dismissCount = state.index - routeIndex + 1;

                if (dismissCount < 1) {
                  return;
                }

                const dismissedRouteKeys = activeRoutes
                  .slice(routeIndex)
                  .map((route) => route.key);

                dispatchViewState({
                  type: 'ADD_NATIVELY_DISMISSED_ROUTES',
                  keys: dismissedRouteKeys,
                });

                navigation.dispatch({
                  ...StackActions.pop(dismissCount),
                  source: screenKey,
                  target: state.key,
                });

                setNextDismissedKey(screenKey);
              }}
              onNativeDismissPrevented={() => {
                navigation.dispatch({
                  ...StackActions.pop(),
                  source: route.key,
                  target: state.key,
                });
              }}
            >
              <NavigationProvider
                navigation={descriptor.navigation}
                route={descriptor.route}
              >
                <SceneContent
                  descriptor={descriptor}
                  headerBack={headerBack}
                  activityMode={activityMode}
                  backgroundColor={colors.background}
                />
                <Stack.HeaderConfig {...headerConfig} />
              </NavigationProvider>
            </Stack.Screen>
          );
        })}
      </Stack.Host>
    </SafeAreaProviderCompat>
  );
}

function SceneContent({
  descriptor,
  headerBack,
  activityMode,
  backgroundColor,
}: {
  descriptor: NativeStackDescriptor;
  headerBack: React.ContextType<typeof HeaderBackContext>;
  activityMode: React.ComponentProps<typeof ActivityView>['mode'] | 'unmounted';
  backgroundColor: ColorValue;
}) {
  const { route, navigation, options, render } = descriptor;

  const {
    header,
    headerBackground,
    headerShown,
    headerTransparent,
    contentStyle,
  } = options;
  const usesNativeHeaderBackground =
    Platform.OS === 'android' && header == null && headerShown !== false;

  const insets = useSafeAreaInsets();

  const parentHeaderHeight = React.use(HeaderHeightContext);
  const isParentHeaderShown = React.use(HeaderShownContext);

  const isLandscape = useFrameSize((frame) => frame.width > frame.height);

  const topInset =
    isParentHeaderShown ||
    (Platform.OS === 'ios' && !(Platform.isPad || Platform.isTV) && isLandscape)
      ? 0
      : insets.top;

  const defaultHeaderHeight = useFrameSize((frame) =>
    getDefaultHeaderHeight({
      landscape: frame.width > frame.height,
      modalPresentation: false,
      topInset,
    })
  );

  const animatedHeaderHeight = useAnimatedValue(defaultHeaderHeight);

  const [headerHeight, setHeaderHeight] = React.useState(defaultHeaderHeight);

  const headerContainerRef = React.useRef<View>(null);

  React.useLayoutEffect(() => {
    headerContainerRef.current?.measure((_x, _y, _width, height) => {
      animatedHeaderHeight.setValue(height);
      setHeaderHeight(height);
    });
  }, [animatedHeaderHeight]);

  return (
    <View style={[styles.container, { backgroundColor }, contentStyle]}>
      {activityMode === 'unmounted' ? null : (
        <ActivityView mode={activityMode} visible style={styles.content}>
          <AnimatedHeaderHeightContext.Provider value={animatedHeaderHeight}>
            <HeaderHeightContext.Provider
              value={
                headerShown !== false ? headerHeight : (parentHeaderHeight ?? 0)
              }
            >
              {headerBackground != null && !usesNativeHeaderBackground ? (
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
                  style={[
                    styles.header,
                    headerTransparent
                      ? [styles.absolute, { minHeight: headerHeight }]
                      : null,
                  ]}
                >
                  <View
                    ref={headerContainerRef}
                    onLayout={(e) => {
                      const headerHeight = e.nativeEvent.layout.height;

                      animatedHeaderHeight.setValue(headerHeight);
                      setHeaderHeight(headerHeight);
                    }}
                    style={{ pointerEvents: 'box-none' }}
                  >
                    {header({
                      back: headerBack,
                      options,
                      route,
                      navigation,
                    })}
                  </View>
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
        </ActivityView>
      )}
    </View>
  );
}

function getAndroidBackButtonIcon(
  icon: Icon,
  tintColor: ColorValue
): StackHeaderConfigAndroid['backButtonIcon'] {
  if (icon.type === 'image') {
    return {
      type: 'imageSource',
      imageSource: icon.source,
    };
  }

  if (icon.type === 'materialSymbol' && Platform.OS === 'android') {
    return {
      type: 'imageSource',
      imageSource: MaterialSymbol.getImageSource({
        name: icon.name,
        variant: icon.variant,
        weight: icon.weight,
        color: tintColor,
      }),
    };
  }

  throw new Error(
    `Unsupported back button icon type: ${icon.type}. Only 'image' and 'materialSymbol' icons are supported on Android.`
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
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
