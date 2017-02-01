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
  NavigationState,
  NavigationAction,
  NavigationRouter,
  DrawerConfig,
} from '../../TypeDefinition';

import type {
  DrawerScene,
} from './DrawerView';

type Navigation = NavigationScreenProp<NavigationState, NavigationAction>;

type Props = {
  router: NavigationRouter,
  navigation: Navigation,
  childNavigationProps: { [key: string]: Navigation },
  contentComponent: ReactClass<*>,
  contentOptions?: {},
  style?: any;
};

type DrawerConfigs = {
  [key: string]: {
    focused: ?DrawerConfig,
    unfocused: ?DrawerConfig,
  }
};

/**
 * Component that renders child screen of the drawer.
 */
class DrawerSidebar extends PureComponent<void, Props, void> {
  props: Props;

  _getScreenConfig = (
    routeKey: string,
    configName: string,
    options?: { focused: boolean, tintColor: * }
  ) => {
    const DrawerScreen = this.props.router.getComponentForRouteName('DrawerClose');
    return DrawerScreen.router.getScreenConfig(
      this.props.childNavigationProps[routeKey],
      configName,
      options,
    );
  }

  _getLabelText = (configs: DrawerConfigs) => ({ route }: DrawerScene) => {
    const drawer = configs[route.key].focused;
    if (drawer && typeof drawer.label === 'string') {
      return drawer.label;
    }

    const title = this._getScreenConfig(route.key, 'title');
    if (typeof title === 'string') {
      return title;
    }

    return route.routeName;
  };

  _renderIcon = (configs: DrawerConfigs) => ({ focused, route }: DrawerScene) => {
    const drawer = focused ? configs[route.key].focused : configs[route.key].unfocused;
    return drawer && drawer.icon ? drawer.icon : null;
  };

  render() {
    const {
      contentComponent: ContentComponent,
      contentOptions,
      navigation,
    } = this.props;

    const defaultDrawerProps = ContentComponent.defaultProps || {};
    const activeTintColor =
      contentOptions && contentOptions.activeTintColor ?
      contentOptions.activeTintColor :
      defaultDrawerProps.activeTintColor;
    const inactiveTintColor =
      contentOptions && contentOptions.inactiveTintColor ?
      contentOptions.inactiveTintColor :
      defaultDrawerProps.inactiveTintColor;

    const configs = navigation.state.routes.reduce((acc: DrawerConfigs, route: *) => {
      const focusedOptions = { focused: true, tintColor: activeTintColor };
      const unfocusedOptions = { focused: false, tintColor: inactiveTintColor };
      const focusedConfig = this._getScreenConfig(route.key, 'drawer', focusedOptions);
      const unfocusedConfig = this._getScreenConfig(route.key, 'drawer', unfocusedOptions);
      return {
        ...acc,
        [route.key]: {
          focused: focusedConfig,
          unfocused: unfocusedConfig,
        },
      };
    }, {});

    return (
      <View style={[styles.container, this.props.style]}>
        <ContentComponent
          {...this.props.contentOptions}
          router={this.props.router}
          navigation={this.props.navigation}
          getLabelText={this._getLabelText(configs)}
          renderIcon={this._renderIcon(configs)}
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
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
  },
});
