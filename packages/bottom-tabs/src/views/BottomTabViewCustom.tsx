import {
  Container,
  Lazy,
  SafeAreaProviderCompat,
} from '@react-navigation/elements/internal';
import {
  type NavigationAction,
  type ParamListBase,
  StackActions,
  type TabNavigationState,
} from '@react-navigation/native';
import * as React from 'react';
import {
  Animated,
  Platform,
  type StyleProp,
  StyleSheet,
  type ViewStyle,
} from 'react-native';
import { Screen, ScreenContainer } from 'react-native-screens';

import {
  FadeTransition,
  ShiftTransition,
} from '../TransitionConfigs/TransitionPresets';
import type {
  BottomTabBarProps,
  BottomTabDescriptorMap,
  BottomTabNavigationConfig,
  BottomTabNavigationHelpers,
  BottomTabNavigationOptions,
  BottomTabSceneStyleInterpolator,
} from '../types';
import { BottomTabAnimationContext } from '../utils/BottomTabAnimationContext';
import { BottomTabBarHeightCallbackContext } from '../utils/BottomTabBarHeightCallbackContext';
import { BottomTabBarHeightContext } from '../utils/BottomTabBarHeightContext';
import { useAnimatedHashMap } from '../utils/useAnimatedHashMap';
import { useTabBarPosition } from '../utils/useTabBarPosition';
import { BottomTabBar, getTabBarHeight } from './BottomTabBar';
import { ScreenContent } from './ScreenContent';

type Props = BottomTabNavigationConfig & {
  state: TabNavigationState<ParamListBase>;
  navigation: BottomTabNavigationHelpers;
  descriptors: BottomTabDescriptorMap;
};

const EPSILON = 1e-5;
const STATE_INACTIVE = 0;
const STATE_TRANSITIONING_OR_BELOW_TOP = 1;
const STATE_ON_TOP = 2;

const NAMED_TRANSITIONS_PRESETS = {
  fade: FadeTransition,
  shift: ShiftTransition,
  none: {
    sceneStyleInterpolator: undefined,
    transitionSpec: {
      animation: 'timing',
      config: { duration: 0 },
    },
  },
} as const;

const useNativeDriver = Platform.OS !== 'web';

const hasAnimation = (options: BottomTabNavigationOptions) => {
  const { animation, transitionSpec } = options;

  if (animation) {
    return animation !== 'none';
  }

  return Boolean(transitionSpec);
};

const renderTabBarDefault = (props: BottomTabBarProps) => (
  <BottomTabBar {...props} />
);

export function BottomTabViewCustom({
  tabBar = renderTabBarDefault,
  state,
  navigation,
  descriptors,
  detachInactiveScreens = Platform.OS === 'web' ||
    Platform.OS === 'android' ||
    Platform.OS === 'ios',
}: Props) {
  const { routes } = state;
  const focusedRouteKey = routes[state.index].key;

  const previousRouteKeyRef = React.useRef(focusedRouteKey);
  const tabAnims = useAnimatedHashMap(state);

  React.useEffect(() => {
    const previousRouteKey = previousRouteKeyRef.current;

    let popToTopAction: NavigationAction | undefined;

    if (
      previousRouteKey !== focusedRouteKey &&
      descriptors[previousRouteKey]?.options.popToTopOnBlur
    ) {
      const prevRoute = state.routes.find(
        (route) => route.key === previousRouteKey
      );

      if (prevRoute?.state?.type === 'stack' && prevRoute.state.key) {
        popToTopAction = {
          ...StackActions.popToTop(),
          target: prevRoute.state.key,
        };
      }
    }

    const animateToIndex = () => {
      if (previousRouteKey !== focusedRouteKey) {
        navigation.emit({
          type: 'transitionStart',
          target: focusedRouteKey,
        });
      }

      Animated.parallel(
        state.routes
          .map((route, index) => {
            const { options } = descriptors[route.key];
            const {
              animation = 'none',
              transitionSpec = NAMED_TRANSITIONS_PRESETS[animation]
                .transitionSpec,
            } = options;

            let spec = transitionSpec;

            if (
              route.key !== previousRouteKey &&
              route.key !== focusedRouteKey
            ) {
              // Don't animate if the screen is not previous one or new one
              // This will avoid flicker for screens not involved in the transition
              spec = NAMED_TRANSITIONS_PRESETS.none.transitionSpec;
            }

            spec = spec ?? NAMED_TRANSITIONS_PRESETS.none.transitionSpec;

            const toValue =
              index === state.index ? 0 : index >= state.index ? 1 : -1;

            return Animated[spec.animation](tabAnims[route.key], {
              ...spec.config,
              toValue,
              useNativeDriver,
            });
          })
          .filter(Boolean) as Animated.CompositeAnimation[]
      ).start(({ finished }) => {
        if (finished && popToTopAction) {
          navigation.dispatch(popToTopAction);
        }

        if (previousRouteKey !== focusedRouteKey) {
          navigation.emit({
            type: 'transitionEnd',
            target: focusedRouteKey,
          });
        }
      });
    };

    animateToIndex();

    previousRouteKeyRef.current = focusedRouteKey;
  }, [
    descriptors,
    focusedRouteKey,
    navigation,
    state.index,
    state.routes,
    tabAnims,
  ]);

  const [tabBarHeight, setTabBarHeight] = React.useState(() =>
    getTabBarHeight({
      state,
      descriptors,
      dimensions: SafeAreaProviderCompat.initialMetrics.frame,
      insets: SafeAreaProviderCompat.initialMetrics.insets,
      style: descriptors[focusedRouteKey].options.tabBarStyle,
    })
  );

  const tabBarElement = (
    <BottomTabBarHeightCallbackContext.Provider
      key="tabbar"
      value={setTabBarHeight}
    >
      {tabBar({
        state: state,
        descriptors: descriptors,
        navigation: navigation,
      })}
    </BottomTabBarHeightCallbackContext.Provider>
  );

  // If there is no animation, we only have 2 states: visible and invisible
  const hasTwoStates = !routes.some((route) =>
    hasAnimation(descriptors[route.key].options)
  );

  const tabBarPosition = useTabBarPosition(
    descriptors[focusedRouteKey].options
  );

  return (
    <SafeAreaProviderCompat
      style={{
        flexDirection:
          tabBarPosition === 'left' || tabBarPosition === 'right'
            ? 'row'
            : 'column',
      }}
    >
      {tabBarPosition === 'top' || tabBarPosition === 'left'
        ? tabBarElement
        : null}
      <ScreenContainer
        key="screens"
        enabled={detachInactiveScreens}
        hasTwoStates={hasTwoStates}
        style={styles.screens}
      >
        {routes.map((route, index) => {
          const descriptor = descriptors[route.key];

          const { navigation, options, render } = descriptor;

          const {
            lazy = true,
            animation = 'none',
            sceneStyleInterpolator = NAMED_TRANSITIONS_PRESETS[animation]
              .sceneStyleInterpolator,
            sceneStyle: customSceneStyle,
          } = options;

          const isFocused = state.index === index;
          const isPreloaded = state.preloadedRouteKeys.includes(route.key);

          const animationEnabled = hasAnimation(descriptor.options);

          const content = (
            <AnimatedScreenContent
              progress={tabAnims[route.key]}
              animationEnabled={animationEnabled}
              sceneStyleInterpolator={sceneStyleInterpolator}
              style={customSceneStyle}
            >
              <Lazy enabled={lazy} visible={isFocused || isPreloaded}>
                {/* TODO: provide tab bar height */}
                <ScreenContent
                  isFocused={isFocused}
                  route={route}
                  navigation={navigation}
                  options={options}
                >
                  <BottomTabBarHeightContext.Provider
                    value={tabBarPosition === 'bottom' ? tabBarHeight : 0}
                  >
                    {render()}
                  </BottomTabBarHeightContext.Provider>
                </ScreenContent>
              </Lazy>
            </AnimatedScreenContent>
          );

          if (Platform.OS === 'web') {
            /**
             * Don't use react-native-screens on web:
             * - It applies display: none as fallback, which triggers `onLayout` events
             * - We still need to hide the view when screens is not enabled
             * - We can use `inert` to handle a11y better for unfocused screens
             */
            return (
              <Container
                key={route.key}
                inert={!isFocused}
                style={{
                  ...StyleSheet.absoluteFillObject,
                  visibility: isFocused ? 'visible' : 'hidden',
                }}
              >
                {content}
              </Container>
            );
          }

          const activityState = isFocused
            ? STATE_ON_TOP // the screen is on top after the transition
            : animationEnabled // is animation is not enabled, immediately move to inactive state
              ? tabAnims[route.key].interpolate({
                  inputRange: [0, 1 - EPSILON, 1],
                  outputRange: [
                    STATE_TRANSITIONING_OR_BELOW_TOP, // screen visible during transition
                    STATE_TRANSITIONING_OR_BELOW_TOP,
                    STATE_INACTIVE, // the screen is detached after transition
                  ],
                  extrapolate: 'extend',
                })
              : STATE_INACTIVE;

          return (
            <Screen
              key={route.key}
              style={[
                StyleSheet.absoluteFill,
                {
                  zIndex: isFocused ? 0 : -1,
                  pointerEvents: isFocused ? 'auto' : 'none',
                },
              ]}
              activityState={activityState}
              enabled={detachInactiveScreens}
              shouldFreeze={activityState === STATE_INACTIVE && !isPreloaded}
            >
              {content}
            </Screen>
          );
        })}
      </ScreenContainer>
      {tabBarPosition === 'bottom' || tabBarPosition === 'right'
        ? tabBarElement
        : null}
    </SafeAreaProviderCompat>
  );
}

function AnimatedScreenContent({
  progress,
  animationEnabled,
  sceneStyleInterpolator,
  children,
  style,
}: {
  progress: Animated.Value;
  animationEnabled: boolean;
  sceneStyleInterpolator?: BottomTabSceneStyleInterpolator;
  children: React.ReactNode;
  style: StyleProp<ViewStyle>;
}) {
  const interpolationProps = React.useMemo(() => {
    return {
      current: { progress },
    };
  }, [progress]);

  const { sceneStyle } = sceneStyleInterpolator?.(interpolationProps) ?? {};

  return (
    <Animated.View
      style={[styles.scene, style, animationEnabled && sceneStyle]}
    >
      <BottomTabAnimationContext.Provider value={interpolationProps}>
        {children}
      </BottomTabAnimationContext.Provider>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  screens: {
    flex: 1,
    overflow: 'hidden',
  },
  scene: {
    flex: 1,
    pointerEvents: 'box-none',
  },
});
