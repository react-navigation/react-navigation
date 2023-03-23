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
import { Animated, Easing, Platform, StyleSheet } from 'react-native';
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
import { useAnimatedValueArray } from '../utils/useAnimatedValueArray';
import { BottomTabBar, getTabBarHeight } from './BottomTabBar';
import { MaybeScreen, MaybeScreenContainer } from './ScreenFallback';

type Props = BottomTabNavigationConfig & {
  state: TabNavigationState<ParamListBase>;
  navigation: BottomTabNavigationHelpers;
  descriptors: BottomTabDescriptorMap;
};

const PUSH_AWAY = Platform.OS === 'web' ? 0 : 9999;

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
    sceneAnimationOptions = {},
  } = props;

  const {
    animationEasing = Easing.ease,
    animationEnabled = true,
    animationType = 'opacity',
    transitionSpec,
    sceneStyleInterpolator,
  } = sceneAnimationOptions;

  const prevNavigationState = React.useRef<typeof state>();

  const isShifting = animationType === 'shifting';
  let shifting = isShifting ?? state.routes.length > 3;

  if (shifting && state.routes.length < 2) {
    shifting = false;
    console.warn(
      'BottomNavigation needs at least 2 tabs to run shifting animation'
    );
  }

  const focusedRouteKey = state.routes[state.index].key;

  /**
   * Active state of individual tab item positions:
   * -1 if they're before the active tab, 0 if they're active, 1 if they're after the active tab
   */
  const tabsPositionAnims = useAnimatedValueArray(
    state.routes.map((_, i) =>
      i === state.index ? 0 : i >= state.index ? 1 : -1
    )
  );

  /**
   * The top offset for each tab item to position it offscreen.
   * Placing items offscreen helps to save memory usage for inactive screens with removeClippedSubviews.
   * We use animated values for this to prevent unnecessary re-renders.
   */
  const offsetsAnims = useAnimatedValueArray(
    state.routes.map(
      // offscreen === 1, normal === 0
      (_, i) => (i === state.index ? 0 : 1)
    )
  );

  /**
   * List of loaded tabs, tabs will be loaded when navigated to.
   */
  const [loaded, setLoaded] = React.useState([focusedRouteKey]);

  if (!loaded.includes(focusedRouteKey)) {
    // Set the current tab to be loaded if it was not loaded before
    setLoaded([...loaded, focusedRouteKey]);
  }

  const animateToIndex = React.useCallback(
    (index: number) => {
      Animated.parallel([
        ...state.routes.map((_, i) =>
          Animated[transitionSpec?.animation || 'timing'](
            tabsPositionAnims[i],
            transitionSpec?.animation === 'spring'
              ? {
                  toValue: i === index ? 0 : i >= index ? 1 : -1,
                  useNativeDriver: true,
                  easing: animationEasing,
                  ...transitionSpec?.config,
                }
              : {
                  toValue: i === index ? 0 : i >= index ? 1 : -1,
                  duration: shifting ? 150 : 0,
                  useNativeDriver: true,
                  easing: animationEasing,
                  ...transitionSpec?.config,
                }
          )
        ),
      ]).start(({ finished }) => {
        if (finished) {
          // Position all inactive screens offscreen to save memory usage
          // Only do it when animation has finished to avoid glitches mid-transition if switching fast
          offsetsAnims.forEach((offset, i) => {
            if (i === index) {
              offset.setValue(0);
            } else {
              offset.setValue(1);
            }
          });
        }
      });
    },
    [
      transitionSpec?.animation,
      transitionSpec?.config,
      shifting,
      state.routes,
      offsetsAnims,
      tabsPositionAnims,
      animationEasing,
    ]
  );

  React.useEffect(() => {
    // Workaround for native animated bug in react-native@^0.57
    animateToIndex(state.index);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    // Reset offsets of previous and current tabs before animation
    offsetsAnims.forEach((offset, i) => {
      if (i === state.index || i === prevNavigationState.current?.index) {
        offset.setValue(0);
      }
    });

    animateToIndex(state.index);
  }, [state.index, animateToIndex, offsetsAnims]);

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

  return (
    <SafeAreaProviderCompat>
      <MaybeScreenContainer
        enabled={detachInactiveScreens}
        hasTwoStates
        style={styles.container}
      >
        {routes.map((route, index) => {
          const descriptor = descriptors[route.key];
          const { lazy = true, unmountOnBlur } = descriptor.options;
          const isFocused = state.index === index;
          const isPreviouslyFocused =
            prevNavigationState.current?.index === index;

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

          const opacity = animationEnabled
            ? tabsPositionAnims[index].interpolate({
                inputRange: [-1, 0, 1],
                outputRange: [0, 1, 0],
              })
            : isFocused
            ? 1
            : 0;

          const top = animationEnabled
            ? offsetsAnims[index].interpolate({
                inputRange: [0, 1],
                outputRange: [0, PUSH_AWAY],
              })
            : isFocused
            ? 0
            : PUSH_AWAY;

          const left =
            isShifting && animationEnabled
              ? tabsPositionAnims[index].interpolate({
                  inputRange: [-1, 0, 1],
                  outputRange: [-50, 0, 50],
                })
              : 0;

          const countAlphaOffscreen =
            animationEnabled && (isFocused || isPreviouslyFocused);

          const renderToHardwareTextureAndroid = animationEnabled && isFocused;

          const { sceneStyle } = sceneStyleInterpolator
            ? sceneStyleInterpolator({
                current: tabsPositionAnims[index],
              })
            : { sceneStyle: {} };

          return (
            <MaybeScreen
              key={route.key}
              style={[StyleSheet.absoluteFill, { zIndex: isFocused ? 0 : -1 }]}
              visible={isFocused}
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
                  style={sceneContainerStyle}
                >
                  <Animated.View
                    {...(Platform.OS === 'android' && {
                      needsOffscreenAlphaCompositing: countAlphaOffscreen,
                    })}
                    renderToHardwareTextureAndroid={
                      renderToHardwareTextureAndroid
                    }
                    style={[
                      styles.content,
                      {
                        ...(!sceneStyle && {
                          opacity,
                          transform: [
                            { translateX: left },
                            { translateY: top },
                          ],
                        }),
                        ...(animationEnabled && sceneStyle),
                      },
                    ]}
                  >
                    {descriptor.render()}
                  </Animated.View>
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
  content: {
    flex: 1,
  },
});
