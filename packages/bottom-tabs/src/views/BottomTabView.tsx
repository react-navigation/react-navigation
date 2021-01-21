import * as React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { ScreenContainer } from 'react-native-screens';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import {
  NavigationHelpersContext,
  ParamListBase,
  TabNavigationState,
  useTheme,
} from '@react-navigation/native';

import SafeAreaProviderCompat, {
  initialMetrics,
} from './SafeAreaProviderCompat';
import ResourceSavingScene from './ResourceSavingScene';
import BottomTabBar, { getTabBarHeight } from './BottomTabBar';
import BottomTabBarHeightCallbackContext from '../utils/BottomTabBarHeightCallbackContext';
import BottomTabBarHeightContext from '../utils/BottomTabBarHeightContext';
import type {
  BottomTabNavigationConfig,
  BottomTabDescriptorMap,
  BottomTabNavigationHelpers,
  BottomTabBarProps,
} from '../types';

type Props = BottomTabNavigationConfig & {
  state: TabNavigationState<ParamListBase>;
  navigation: BottomTabNavigationHelpers;
  descriptors: BottomTabDescriptorMap;
};

type State = {
  loaded: string[];
  tabBarHeight: number;
};

function SceneContent({
  isFocused,
  children,
  style,
}: {
  isFocused: boolean;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors } = useTheme();

  return (
    <View
      accessibilityElementsHidden={!isFocused}
      importantForAccessibility={isFocused ? 'auto' : 'no-hide-descendants'}
      style={[styles.content, { backgroundColor: colors.background }, style]}
    >
      {children}
    </View>
  );
}

export default class BottomTabView extends React.Component<Props, State> {
  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    const focusedRouteKey = nextProps.state.routes[nextProps.state.index].key;

    return {
      // Set the current tab to be loaded if it was not loaded before
      loaded: prevState.loaded.includes(focusedRouteKey)
        ? prevState.loaded
        : [...prevState.loaded, focusedRouteKey],
    };
  }

  constructor(props: Props) {
    super(props);

    const { state, descriptors } = this.props;

    const dimensions = initialMetrics.frame;
    const tabBarHeight = getTabBarHeight({
      state,
      descriptors,
      dimensions,
      layout: { width: dimensions.width, height: 0 },
      insets: {
        ...initialMetrics.insets,
        ...props.safeAreaInsets,
      },
      style: descriptors[state.routes[state.index].key].options.tabBarStyle,
    });

    this.state = {
      loaded: [state.routes[state.index].key],
      tabBarHeight: tabBarHeight,
    };
  }

  private renderTabBar = () => {
    const {
      tabBar = (props: BottomTabBarProps) => <BottomTabBar {...props} />,
      state,
      navigation,
      descriptors,
      safeAreaInsets,
    } = this.props;

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

  private handleTabBarHeightChange = (height: number) => {
    this.setState((state) => {
      if (state.tabBarHeight !== height) {
        return { tabBarHeight: height };
      }

      return null;
    });
  };

  render() {
    const {
      state,
      descriptors,
      navigation,
      detachInactiveScreens = true,
      sceneContainerStyle,
    } = this.props;
    const { routes } = state;
    const { loaded, tabBarHeight } = this.state;

    return (
      <NavigationHelpersContext.Provider value={navigation}>
        <SafeAreaProviderCompat>
          <ScreenContainer
            // @ts-ignore
            enabled={detachInactiveScreens}
            style={styles.container}
          >
            {routes.map((route, index) => {
              const descriptor = descriptors[route.key];
              const { lazy = true, unmountOnBlur } = descriptor.options;
              const isFocused = state.index === index;

              if (unmountOnBlur && !isFocused) {
                return null;
              }

              if (lazy && !loaded.includes(route.key) && !isFocused) {
                // Don't render a lazy screen if we've never navigated to it
                return null;
              }

              return (
                <ResourceSavingScene
                  key={route.key}
                  style={StyleSheet.absoluteFill}
                  isVisible={isFocused}
                  enabled={detachInactiveScreens}
                >
                  <SceneContent
                    isFocused={isFocused}
                    style={sceneContainerStyle}
                  >
                    <BottomTabBarHeightContext.Provider value={tabBarHeight}>
                      {descriptor.render()}
                    </BottomTabBarHeightContext.Provider>
                  </SceneContent>
                </ResourceSavingScene>
              );
            })}
          </ScreenContainer>
          <BottomTabBarHeightCallbackContext.Provider
            value={this.handleTabBarHeightChange}
          >
            {this.renderTabBar()}
          </BottomTabBarHeightCallbackContext.Provider>
        </SafeAreaProviderCompat>
      </NavigationHelpersContext.Provider>
    );
  }
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
