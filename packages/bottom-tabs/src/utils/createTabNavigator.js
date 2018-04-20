/* @flow */

import * as React from 'react';
import {
  TabRouter,
  StackActions,
  createNavigator,
  createNavigationContainer,
  NavigationActions,
} from 'react-navigation';
import SceneView from 'react-navigation/src/views/SceneView';

export type InjectedProps = {
  getLabelText: (props: { route: any }) => any,
  renderIcon: (props: {
    route: any,
    focused: boolean,
    tintColor: string,
  }) => React.Node,
  renderScene: (props: { route: any }) => ?React.Node,
  onIndexChange: (index: number) => any,
  onTabPress: (props: { route: any }) => mixed,
  navigation: any,
  descriptors: any,
  screenProps?: any,
};

export default function createTabNavigator(TabView: React.ComponentType<*>) {
  class NavigationView extends React.Component<*> {
    _renderScene = ({ route }) => {
      const { screenProps, descriptors } = this.props;
      const descriptor = descriptors[route.key];
      const TabComponent = descriptor.getComponent();
      return (
        <SceneView
          screenProps={screenProps}
          navigation={descriptor.navigation}
          component={TabComponent}
        />
      );
    };

    _renderIcon = ({ route, focused = true, tintColor }) => {
      const { descriptors } = this.props;
      const descriptor = descriptors[route.key];
      const options = descriptor.options;

      if (options.tabBarIcon) {
        return typeof options.tabBarIcon === 'function'
          ? options.tabBarIcon({ focused, tintColor })
          : options.tabBarIcon;
      }

      return null;
    };

    _getLabelText = ({ route }) => {
      const { descriptors } = this.props;
      const descriptor = descriptors[route.key];
      const options = descriptor.options;

      if (options.tabBarLabel) {
        return options.tabBarLabel;
      }

      if (typeof options.title === 'string') {
        return options.title;
      }

      return route.routeName;
    };

    _handleOnTabPress = ({ route }) => {
      const { descriptors } = this.props;
      const descriptor = descriptors[route.key];
      const { navigation, options } = descriptor;

      if (options.tabBarOnPress) {
        options.tabBarOnPress({
          navigation,
        });
      } else {
        const isFocused =
          this.props.navigation.state.index ===
          this.props.navigation.state.routes.indexOf(route);

        if (isFocused) {
          if (route.hasOwnProperty('index') && route.index > 0) {
            navigation.dispatch(StackActions.popToTop({ key: route.key }));
          } else {
            // TODO: do something to scroll to top
          }
        }
      }
    };

    _handleIndexChange = index => {
      const { navigation } = this.props;
      navigation.dispatch(NavigationActions.navigate({
        routeName: navigation.state.routes[index].routeName,
      }));
    };

    render() {
      const { descriptors, navigation, screenProps } = this.props;
      const { state } = navigation;
      const route = state.routes[state.index];
      const descriptor = descriptors[route.key];
      const options = {
        ...this.props.navigationConfig,
        ...descriptor.options,
      };

      return (
        <TabView
          {...options}
          getLabelText={this._getLabelText}
          renderIcon={this._renderIcon}
          renderScene={this._renderScene}
          onIndexChange={this._handleIndexChange}
          onTabPress={this._handleOnTabPress}
          navigation={navigation}
          descriptors={descriptors}
          screenProps={screenProps}
        />
      );
    }
  }

  return (routes: *, config: * = {}) => {
    const router = TabRouter(routes, config);
    const navigator = createNavigator(NavigationView, router, config);

    return createNavigationContainer(navigator);
  };
}
