import * as React from 'react';
import {
  View,
  StyleSheet,
  AccessibilityRole,
  AccessibilityStates,
} from 'react-native';
import { Route, CommonActions } from '@react-navigation/core';
import { TabNavigationState } from '@react-navigation/routers';
// eslint-disable-next-line import/no-unresolved
import { ScreenContainer } from 'react-native-screens';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import BottomTabBar from './BottomTabBar';
import {
  BottomTabNavigationConfig,
  BottomTabDescriptorMap,
  BottomTabNavigationHelpers,
} from '../types';
import ResourceSavingScene from './ResourceSavingScene';

type Props = BottomTabNavigationConfig & {
  state: TabNavigationState;
  navigation: BottomTabNavigationHelpers;
  descriptors: BottomTabDescriptorMap;
};

type State = {
  loaded: number[];
};

export default class BottomTabView extends React.Component<Props, State> {
  static defaultProps = {
    lazy: true,
  };

  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    const { index } = nextProps.state;

    return {
      // Set the current tab to be loaded if it was not loaded before
      loaded: prevState.loaded.includes(index)
        ? prevState.loaded
        : [...prevState.loaded, index],
    };
  }

  state = {
    loaded: [this.props.state.index],
  };

  private getButtonComponent = ({ route }: { route: Route<string> }) => {
    const { descriptors } = this.props;
    const descriptor = descriptors[route.key];
    const options = descriptor.options;

    if (options.tabBarButtonComponent) {
      return options.tabBarButtonComponent;
    }

    return undefined;
  };

  private renderIcon = ({
    route,
    focused,
    color,
    size,
  }: {
    route: Route<string>;
    focused: boolean;
    color: string;
    size: number;
  }) => {
    const { descriptors } = this.props;
    const descriptor = descriptors[route.key];
    const options = descriptor.options;

    if (options.tabBarIcon) {
      return typeof options.tabBarIcon === 'function'
        ? options.tabBarIcon({ focused, color, size })
        : options.tabBarIcon;
    }

    return null;
  };

  private getLabelText = ({ route }: { route: Route<string> }) => {
    const { descriptors } = this.props;
    const descriptor = descriptors[route.key];
    const options = descriptor.options;

    if (options.tabBarLabel !== undefined) {
      return options.tabBarLabel;
    }

    if (typeof options.title === 'string') {
      return options.title;
    }

    return route.name;
  };

  private getAccessibilityLabel = ({ route }: { route: Route<string> }) => {
    const { state, descriptors } = this.props;
    const descriptor = descriptors[route.key];
    const options = descriptor.options;

    if (typeof options.tabBarAccessibilityLabel !== 'undefined') {
      return options.tabBarAccessibilityLabel;
    }

    const label = this.getLabelText({ route });

    if (typeof label === 'string') {
      return `${label}, tab, ${state.routes.indexOf(route) + 1} of ${
        state.routes.length
      }`;
    }

    return undefined;
  };

  private getAccessibilityRole = (): AccessibilityRole => 'button';

  private getAccessibilityStates = ({
    focused,
  }: {
    focused: boolean;
  }): AccessibilityStates[] => (focused ? ['selected'] : []);

  private getTestID = ({ route }: { route: Route<string> }) =>
    this.props.descriptors[route.key].options.tabBarTestID;

  private handleTabPress = ({ route }: { route: Route<string> }) => {
    const { state, navigation } = this.props;
    const event = this.props.navigation.emit({
      type: 'tabPress',
      target: route.key,
    });

    if (
      state.routes[state.index].key !== route.key &&
      !event.defaultPrevented
    ) {
      navigation.dispatch({
        ...CommonActions.navigate(route.name),
        target: state.key,
      });
    }
  };

  private handleTabLongPress = ({ route }: { route: Route<string> }) => {
    this.props.navigation.emit({
      type: 'tabLongPress',
      target: route.key,
    });
  };

  private renderTabBar = () => {
    const {
      tabBarComponent: TabBarComponent = BottomTabBar,
      tabBarOptions,
      state,
      navigation,
    } = this.props;

    const { descriptors } = this.props;
    const route = state.routes[state.index];
    const descriptor = descriptors[route.key];
    const options = descriptor.options;

    if (options.tabBarVisible === false) {
      return null;
    }

    return (
      <TabBarComponent
        {...tabBarOptions}
        state={state}
        descriptors={descriptors}
        navigation={navigation}
        onTabPress={this.handleTabPress}
        onTabLongPress={this.handleTabLongPress}
        getLabelText={this.getLabelText}
        getButtonComponent={this.getButtonComponent}
        getAccessibilityLabel={this.getAccessibilityLabel}
        getAccessibilityRole={this.getAccessibilityRole}
        getAccessibilityStates={this.getAccessibilityStates}
        getTestID={this.getTestID}
        renderIcon={this.renderIcon}
      />
    );
  };

  render() {
    const { state, descriptors, lazy } = this.props;
    const { routes } = state;
    const { loaded } = this.state;

    return (
      <SafeAreaProvider>
        <View style={styles.container}>
          <ScreenContainer style={styles.pages}>
            {routes.map((route, index) => {
              if (lazy && !loaded.includes(index)) {
                // Don't render a screen if we've never navigated to it
                return null;
              }

              const isFocused = state.index === index;

              return (
                <ResourceSavingScene
                  key={route.key}
                  style={StyleSheet.absoluteFill}
                  isVisible={isFocused}
                >
                  <View
                    accessibilityElementsHidden={!isFocused}
                    importantForAccessibility={
                      isFocused ? 'auto' : 'no-hide-descendants'
                    }
                    style={styles.content}
                  >
                    {descriptors[route.key].render()}
                  </View>
                </ResourceSavingScene>
              );
            })}
          </ScreenContainer>
          {this.renderTabBar()}
        </View>
      </SafeAreaProvider>
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
