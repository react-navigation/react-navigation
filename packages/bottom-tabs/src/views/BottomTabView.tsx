import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import {
  NavigationHelpersContext,
  TabNavigationState,
  useTheme,
} from '@react-navigation/native';
import { ScreenContainer } from 'react-native-screens';

import SafeAreaProviderCompat from './SafeAreaProviderCompat';
import ResourceSavingScene from './ResourceSavingScene';
import BottomTabBar from './BottomTabBar';
import type {
  BottomTabNavigationConfig,
  BottomTabDescriptorMap,
  BottomTabNavigationHelpers,
  BottomTabBarProps,
} from '../types';

type Props = BottomTabNavigationConfig & {
  state: TabNavigationState;
  navigation: BottomTabNavigationHelpers;
  descriptors: BottomTabDescriptorMap;
};

type State = {
  loaded: string[];
};

function SceneContent({
  isFocused,
  children,
}: {
  isFocused: boolean;
  children: React.ReactNode;
}) {
  const { colors } = useTheme();

  return (
    <View
      accessibilityElementsHidden={!isFocused}
      importantForAccessibility={isFocused ? 'auto' : 'no-hide-descendants'}
      style={[styles.content, { backgroundColor: colors.background }]}
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

  state: State = {
    loaded: [this.props.state.routes[this.props.state.index].key],
  };

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

  render() {
    const { state, descriptors, navigation, lazy } = this.props;
    const { routes } = state;
    const { loaded } = this.state;

    return (
      <NavigationHelpersContext.Provider value={navigation}>
        <SafeAreaProviderCompat>
          <View style={styles.container}>
            <ScreenContainer style={styles.pages}>
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
                  >
                    <SceneContent isFocused={isFocused}>
                      {descriptor.render()}
                    </SceneContent>
                  </ResourceSavingScene>
                );
              })}
            </ScreenContainer>
            {this.renderTabBar()}
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
