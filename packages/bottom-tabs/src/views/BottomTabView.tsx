import {
  getHeaderTitle,
  Header,
  SafeAreaProviderCompat,
  Screen,
} from '@react-navigation/elements';
import type {
  ParamListBase,
  TabNavigationState,
} from '@react-navigation/native';
import * as React from 'react';
import { Animated, Platform, StyleSheet } from 'react-native';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';

import type {
  BottomTabBarProps,
  BottomTabDescriptorMap,
  BottomTabHeaderProps,
  BottomTabNavigationConfig,
  BottomTabNavigationHelpers,
  BottomTabNavigationOptions,
  BottomTabNavigationProp,
} from '../types';
import { BottomTabBarHeightCallbackContext } from '../utils/BottomTabBarHeightCallbackContext';
import { BottomTabBarHeightContext } from '../utils/BottomTabBarHeightContext';
import { useAnimatedHashMap } from '../utils/useAnimatedHashMap';
import { BottomTabBar, getTabBarHeight } from './BottomTabBar';
import { MaybeScreen, MaybeScreenContainer } from './ScreenFallback';

type Props = BottomTabNavigationConfig & {
  state: TabNavigationState<ParamListBase>;
  navigation: BottomTabNavigationHelpers;
  descriptors: BottomTabDescriptorMap;
};

const EPSILON = 1e-5;
const STATE_INACTIVE = 0;
const STATE_TRANSITIONING_OR_BELOW_TOP = 1;
const STATE_ON_TOP = 2;

const hasAnimation = (options: BottomTabNavigationOptions) => {
  const { animationEnabled, transitionSpec } = options;

  if (animationEnabled === false || !transitionSpec) {
    return false;
  }

  return true;
};

export function BottomTabView(props: Props) {
  const {
    tabBar = (props: BottomTabBarProps) => <BottomTabBar {...props} />,
    state,
    navigation,
    descriptors,
    safeAreaInsets,
    detachInactiveScreens = Platform.OS === 'web' ||
      Platform.OS === 'android' ||
      Platform.OS === 'ios',
    sceneContainerStyle,
  } = props;

  const focusedRouteKey = state.routes[state.index].key;

  /**
   * List of loaded tabs, tabs will be loaded when navigated to.
   */
  const [loaded, setLoaded] = React.useState([focusedRouteKey]);

  if (!loaded.includes(focusedRouteKey)) {
    // Set the current tab to be loaded if it was not loaded before
    setLoaded([...loaded, focusedRouteKey]);
  }

  const tabAnims = useAnimatedHashMap(state);

  React.useEffect(() => {
    const animateToIndex = () => {
      Animated.parallel(
        state.routes
          .map((route, index) => {
            const { options } = descriptors[route.key];
            const { transitionSpec } = options;

            const animationEnabled = hasAnimation(options);

            const toValue =
              index === state.index ? 0 : index >= state.index ? 1 : -1;

            if (!animationEnabled || !transitionSpec) {
              return Animated.timing(tabAnims[route.key], {
                toValue,
                duration: 0,
                useNativeDriver: true,
              });
            }

            return Animated[transitionSpec.animation](tabAnims[route.key], {
              ...transitionSpec.config,
              toValue,
              useNativeDriver: true,
            });
          })
          .filter(Boolean) as Animated.CompositeAnimation[]
      ).start();
    };

    animateToIndex();
  }, [descriptors, state.index, state.routes, tabAnims]);

  const dimensions = SafeAreaProviderCompat.initialMetrics.frame;
  const [tabBarHeight, setTabBarHeight] = React.useState(() =>
    getTabBarHeight({
      state,
      descriptors,
      dimensions,
      layout: { width: dimensions.width, height: 0 },
      insets: {
        ...SafeAreaProviderCompat.initialMetrics.insets,
        ...props.safeAreaInsets,
      },
      style: descriptors[state.routes[state.index].key].options.tabBarStyle,
    })
  );

  const renderTabBar = () => {
    return (
      <SafeAreaInsetsContext.Consumer>
        {(insets) =>
          tabBar({
            state: state,
            descriptors: descriptors,
            navigation: navigation,
            insets: {
              top: safeAreaInsets?.top ?? insets?.top ?? 0,
              right: safeAreaInsets?.right ?? insets?.right ?? 0,
              bottom: safeAreaInsets?.bottom ?? insets?.bottom ?? 0,
              left: safeAreaInsets?.left ?? insets?.left ?? 0,
            },
          })
        }
      </SafeAreaInsetsContext.Consumer>
    );
  };

  const { routes } = state;

  // If there is no animation, we only have 2 states: visible and invisible
  const hasTwoStates = !routes.some((route) =>
    hasAnimation(descriptors[route.key].options)
  );

  const { tabBarPosition = 'bottom' } = descriptors[focusedRouteKey].options;

  return (
    <SafeAreaProviderCompat
      style={
        tabBarPosition === 'left'
          ? styles.left
          : tabBarPosition === 'right'
            ? styles.right
            : null
      }
    >
      {tabBarPosition === 'top' ? (
        <BottomTabBarHeightCallbackContext.Provider value={setTabBarHeight}>
          {renderTabBar()}
        </BottomTabBarHeightCallbackContext.Provider>
      ) : null}
      <MaybeScreenContainer
        enabled={detachInactiveScreens}
        hasTwoStates={hasTwoStates}
        style={styles.screens}
      >
        {routes.map((route, index) => {
          const descriptor = descriptors[route.key];
          const {
            lazy = true,
            unmountOnBlur,
            sceneStyleInterpolator,
          } = descriptor.options;
          const isFocused = state.index === index;

          if (unmountOnBlur && !isFocused) {
            return null;
          }

          if (
            lazy &&
            !loaded.includes(route.key) &&
            !isFocused &&
            !state.preloadedRouteKeys.includes(route.key)
          ) {
            // Don't render a lazy screen if we've never navigated to it or it wasn't preloaded
            return null;
          }

          const {
            freezeOnBlur,
            header = ({ layout, options }: BottomTabHeaderProps) => (
              <Header
                {...options}
                layout={layout}
                title={getHeaderTitle(options, route.name)}
              />
            ),
            headerShown,
            headerStatusBarHeight,
            headerTransparent,
          } = descriptor.options;

          const { sceneStyle } =
            sceneStyleInterpolator?.({
              current: tabAnims[route.key],
            }) ?? {};

          const animationEnabled = hasAnimation(descriptor.options);
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
            <MaybeScreen
              key={route.key}
              style={[StyleSheet.absoluteFill, { zIndex: isFocused ? 0 : -1 }]}
              active={activityState}
              enabled={detachInactiveScreens}
              freezeOnBlur={freezeOnBlur}
            >
              <BottomTabBarHeightContext.Provider
                value={tabBarPosition === 'bottom' ? tabBarHeight : 0}
              >
                <Screen
                  focused={isFocused}
                  route={descriptor.route}
                  navigation={descriptor.navigation}
                  headerShown={headerShown}
                  headerStatusBarHeight={headerStatusBarHeight}
                  headerTransparent={headerTransparent}
                  header={header({
                    layout: dimensions,
                    route: descriptor.route,
                    navigation:
                      descriptor.navigation as BottomTabNavigationProp<ParamListBase>,
                    options: descriptor.options,
                  })}
                  style={[sceneContainerStyle, animationEnabled && sceneStyle]}
                >
                  {descriptor.render()}
                </Screen>
              </BottomTabBarHeightContext.Provider>
            </MaybeScreen>
          );
        })}
      </MaybeScreenContainer>
      {tabBarPosition !== 'top' ? (
        <BottomTabBarHeightCallbackContext.Provider value={setTabBarHeight}>
          {renderTabBar()}
        </BottomTabBarHeightCallbackContext.Provider>
      ) : null}
    </SafeAreaProviderCompat>
  );
}

const styles = StyleSheet.create({
  left: {
    flexDirection: 'row-reverse',
  },
  right: {
    flexDirection: 'row',
  },
  screens: {
    flex: 1,
    overflow: 'hidden',
  },
});
