/* @flow */

import React, { PureComponent } from 'react';
import {
  Platform,
  StyleSheet,
  View,
} from 'react-native';

import withCachedChildNavigation from '../../withCachedChildNavigation';

import type {
  NavigationScreenProp,
  NavigationRoute,
  NavigationAction,
  NavigationRouter,
  Style,
} from '../../TypeDefinition';

import type {
  DrawerScene,
} from './DrawerView';

type Navigation = NavigationScreenProp<NavigationRoute, NavigationAction>;

type Props = {
  router: NavigationRouter,
  navigation: Navigation,
  childNavigationProps: { [key: string]: Navigation },
  drawerComponent: ReactClass<*>,
  drawerOptions?: {},
  style?: Style;
};

/**
 * Component that renders the sidebar screen of the drawer.
 */
class DrawerSidebar extends PureComponent<void, Props, void> {
  props: Props;

  _getScreenConfig = (routeKey: string, configName: string) => {
    const DrawerScreen = this.props.router.getComponentForRouteName('DrawerClose');
    return DrawerScreen.router.getScreenConfig(
      this.props.childNavigationProps[routeKey],
      configName
    );
  }

  _getLabel = ({ focused, tintColor, route }: DrawerScene) => {
    const drawer = this._getScreenConfig(route.key, 'drawer');
    if (drawer && drawer.label) {
      return typeof drawer.label === 'function'
        ? drawer.label({ tintColor, focused })
        : drawer.label;
    }

    const title = this._getScreenConfig(route.key, 'title');
    if (typeof title === 'string') {
      return title;
    }

    return route.routeName;
  };

  _renderIcon = ({ focused, tintColor, route }: DrawerScene) => {
    const drawer = this._getScreenConfig(route.key, 'drawer');
    if (drawer && drawer.icon) {
      return typeof drawer.icon === 'function'
        ? drawer.icon({ tintColor, focused })
        : drawer.icon;
    }
    return null;
  };

  render() {
    const DrawerComponent = this.props.drawerComponent;
    return (
      <View style={[styles.container, this.props.style]}>
        <DrawerComponent
          {...this.props.drawerOptions}
          navigation={this.props.navigation}
          getLabel={this._getLabel}
          renderIcon={this._renderIcon}
          router={this.props.router}
        />
      </View>
    );
  }
}

export default withCachedChildNavigation(DrawerSidebar);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
