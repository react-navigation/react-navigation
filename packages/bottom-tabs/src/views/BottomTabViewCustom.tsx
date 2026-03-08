import {
  ActivityView,
  Container,
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
}: Props) {
  const { routes } = state;
  const focusedRouteKey = routes[state.index].key;

  const [loaded, setLoaded] = React.useState([focusedRouteKey]);

  if (!loaded.includes(focusedRouteKey)) {
    setLoaded([...loaded, focusedRouteKey]);
  }

  const [lastUpdate, setLastUpdate] = React.useState<{
    current: string;
    previous?: string;
  }>({
    current: focusedRouteKey,
  });

  if (lastUpdate.current !== focusedRouteKey) {
    setLastUpdate({
      current: focusedRouteKey,
      previous: lastUpdate.current,
    });
  }

  const tabAnims = useAnimatedHashMap(state);

  const [isAnimating, setIsAnimating] = React.useState(false);

  const previousRouteKeyRef = React.useRef(focusedRouteKey);

  React.useEffect(() => {
    const previousRouteKey = previousRouteKeyRef.current;

    let popToTopAction: NavigationAction | undefined;

    if (
      previousRouteKey &&
      previousRouteKey !== focusedRouteKey &&
      descriptors[previousRouteKey]?.options.popToTopOnBlur
    ) {
      const prevRoute = state.routes.find(
        (route) => route.key === previousRouteKey
      );

      console.log(
        'checking if we need to pop to top for route',
        previousRouteKey,
        focusedRouteKey
      );

      if (prevRoute?.state?.type === 'stack' && prevRoute.state.key) {
        popToTopAction = {
          ...StackActions.popToTop(),
          target: prevRoute.state.key,
        };
      }
    }

    let timer: ReturnType<typeof setTimeout>;

    const animateToIndex = () => {
      if (previousRouteKey !== focusedRouteKey) {
        navigation.emit({
          type: 'transitionStart',
          target: focusedRouteKey,
        });
      }

      const animations = state.routes
        .map((route, index) => {
          const { options } = descriptors[route.key];
          const {
            animation = 'none',
            transitionSpec = NAMED_TRANSITIONS_PRESETS[animation]
              .transitionSpec,
          } = options;

          let spec = transitionSpec;

          if (route.key !== previousRouteKey && route.key !== focusedRouteKey) {
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
        .filter((anim) => anim != null);

      if (animations.length) {
        // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
        setIsAnimating(true);
      }

      Animated.parallel(animations).start(({ finished }) => {
        if (finished && popToTopAction) {
          console.log('dispatching pop to top action', popToTopAction);
          // navigation.dispatch(popToTopAction);
        }

        if (previousRouteKey !== focusedRouteKey) {
          navigation.emit({
            type: 'transitionEnd',
            target: focusedRouteKey,
          });
        }

        if (finished && animations.length) {
          // Delay clearing `isAnimating`
          // This will give time for `popToAction` to get handled before pause
          timer = setTimeout(() => {
            setIsAnimating(false);
          }, 32);
        }
      });
    };

    animateToIndex();

    previousRouteKeyRef.current = focusedRouteKey;

    return () => {
      clearTimeout(timer);
    };
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
      <Container key="screens" style={styles.screens}>
        {routes.map((route, index) => {
          const descriptor = descriptors[route.key];

          const { navigation, options, render } = descriptor;

          const {
            lazy = true,
            inactiveBehavior = 'pause',
            animation = 'none',
            sceneStyleInterpolator = NAMED_TRANSITIONS_PRESETS[animation]
              .sceneStyleInterpolator,
            sceneStyle: customSceneStyle,
          } = options;

          const isFocused = state.index === index;
          const isPreloaded = state.preloadedRouteKeys.includes(route.key);

          if (
            lazy &&
            !loaded.includes(route.key) &&
            !isFocused &&
            !isPreloaded
          ) {
            // Don't render a lazy screen if we've never navigated to it or it wasn't preloaded
            return null;
          }

          const animationEnabled = hasAnimation(descriptor.options);

          const content = (
            <AnimatedScreenContent
              key={route.key}
              progress={tabAnims[route.key]}
              animationEnabled={animationEnabled}
              sceneStyleInterpolator={sceneStyleInterpolator}
              style={[StyleSheet.absoluteFill, customSceneStyle]}
            >
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
            </AnimatedScreenContent>
          );

          const isAnimatingRoute =
            isAnimating &&
            (lastUpdate.previous === route.key ||
              lastUpdate.current === route.key);

          // For preloaded screens and if lazy is false,
          // Keep them active so that the effects can run
          const isActive =
            inactiveBehavior === 'none' ||
            isAnimatingRoute ||
            isPreloaded ||
            (lazy === false && !loaded.includes(route.key));

          return (
            <ActivityView
              key={route.key}
              mode={isFocused ? 'normal' : isActive ? 'inert' : 'paused'}
              visible={isFocused || isAnimatingRoute}
              style={{ ...StyleSheet.absoluteFill, zIndex: isFocused ? 0 : -1 }}
            >
              {content}
            </ActivityView>
          );
        })}
      </Container>
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
  sceneStyleInterpolator?: BottomTabSceneStyleInterpolator | undefined;
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
