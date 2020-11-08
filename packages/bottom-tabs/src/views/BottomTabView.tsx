import * as React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  StyleProp,
  ViewStyle,
} from 'react-native';

import {
  NavigationHelpersContext,
  ParamListBase,
  TabNavigationState,
  useTheme,
} from '@react-navigation/native';
import { ScreenContainer } from 'react-native-screens';

import SafeAreaProviderCompat, {
  initialSafeAreaInsets,
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
  static defaultProps = {
    lazy: true,
  };

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

    const { state, tabBarOptions } = this.props;

    const dimensions = Dimensions.get('window');
    const tabBarHeight = getTabBarHeight({
      state,
      dimensions,
      layout: { width: dimensions.width, height: 0 },
      insets: initialSafeAreaInsets,
      adaptive: tabBarOptions?.adaptive,
      labelPosition: tabBarOptions?.labelPosition,
      tabStyle: tabBarOptions?.tabStyle,
      style: tabBarOptions?.style,
    });

    this.state = {
      loaded: [state.routes[state.index].key],
      tabBarHeight: tabBarHeight,
    };
  }

  private renderTabBar = () => {
    const {
      tabBar = (props: BottomTabBarProps) => <BottomTabBar {...props} />,
      tabBarOptions,
      state,
      navigation,
      descriptors,
    } = this.props;
    return tabBar({
      ...tabBarOptions,
      state: state,
      descriptors: descriptors,
      navigation: navigation,
    });
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
      lazy,
      detachInactiveScreens = true,
      sceneContainerStyle,
    } = this.props;
    const { routes } = state;
    const { loaded, tabBarHeight } = this.state;

    return (
      <NavigationHelpersContext.Provider value={navigation}>
        <SafeAreaProviderCompat>
          <View style={styles.container}>
            <ScreenContainer
              // @ts-ignore
              enabled={detachInactiveScreens}
              style={styles.pages}
            >
              {routes.map((route, index) => {
                const descriptor = descriptors[route.key];
                const { unmountOnBlur } = descriptor.options;
                const isFocused = state.index === index;

                if (unmountOnBlur && !isFocused) {
                  return null;
                }

                if (lazy && !loaded.includes(route.key) && !isFocused) {
                  // Don't render a screen if we've never navigated to it
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
          </View>
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
  pages: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
