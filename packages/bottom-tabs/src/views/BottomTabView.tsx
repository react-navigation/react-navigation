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
  BottomTabNavigationProp,
} from '../types';
import { BottomTabBarHeightCallbackContext } from '../utils/BottomTabBarHeightCallbackContext';
import { BottomTabBarHeightContext } from '../utils/BottomTabBarHeightContext';
import { useAnimatedHashMap } from '../utils/useAnimatedHashMap';
import { BottomTabBar, getTabBarHeight } from './BottomTabBar';
import { MaybeScreen, MaybeScreenContainer } from './ScreenFallback';
import CompositeAnimation = Animated.CompositeAnimation;

type Props = BottomTabNavigationConfig & {
  state: TabNavigationState<ParamListBase>;
  navigation: BottomTabNavigationHelpers;
  descriptors: BottomTabDescriptorMap;
};

const EPSILON = 1e-5;
const STATE_INACTIVE = 0;
const STATE_TRANSITIONING_OR_BELOW_TOP = 1;
const STATE_ON_TOP = 2;

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

  const tabAnims = useAnimatedHashMap(state.routes);

  React.useEffect(() => {
    const animateToIndex = () => {
      Animated.parallel(
        state.routes
          .map((route) => {
            const { animationEnabled, transitionSpec } =
              descriptors[route.key].options;
            if (!animationEnabled || !transitionSpec) {
              return false;
            }
            return Animated[transitionSpec?.animation || 'timing'](
              tabAnims[route.key],
              {
                ...transitionSpec?.config,
                toValue: route.key === focusedRouteKey ? 0 : 1,
                useNativeDriver: true,
              }
            );
          })
          .filter(Boolean) as CompositeAnimation[]
      ).start();
    };

    animateToIndex();
  }, [state.routes, tabAnims, focusedRouteKey, descriptors]);

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

  // not needed if not animation
  const hasTwoStates = !routes.some(
    (route) => descriptors[route.key].options.animationEnabled
  );

  return (
    <SafeAreaProviderCompat>
      <MaybeScreenContainer
        enabled={detachInactiveScreens}
        hasTwoStates={hasTwoStates}
        style={styles.container}
      >
        {routes.map((route, index) => {
          const descriptor = descriptors[route.key];
          const {
            lazy = true,
            unmountOnBlur,
            animationEnabled,
            sceneStyleInterpolator,
          } = descriptor.options;
          const isFocused = state.index === index;

          if (unmountOnBlur && !isFocused) {
            return null;
          }

          if (lazy && !loaded.includes(route.key) && !isFocused) {
            // Don't render a lazy screen if we've never navigated to it
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
              <BottomTabBarHeightContext.Provider value={tabBarHeight}>
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
      <BottomTabBarHeightCallbackContext.Provider value={setTabBarHeight}>
        {renderTabBar()}
      </BottomTabBarHeightCallbackContext.Provider>
    </SafeAreaProviderCompat>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
});
