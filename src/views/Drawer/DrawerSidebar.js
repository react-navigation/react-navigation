/* @flow */

import React, { PureComponent } from 'react';
import { StyleSheet, View } from 'react-native';

import withCachedChildNavigation from '../../withCachedChildNavigation';
import NavigationActions from '../../NavigationActions';

import type {
  NavigationScreenProp,
  NavigationRoute,
  NavigationAction,
  NavigationRouter,
  NavigationDrawerScreenOptions,
  NavigationState,
  NavigationStateRoute,
  ViewStyleProp,
} from '../../TypeDefinition';

import type { DrawerScene, DrawerItem } from './DrawerView';

type Navigation = NavigationScreenProp<NavigationStateRoute, NavigationAction>;

type Props = {
  router: NavigationRouter<
    NavigationState,
    NavigationAction,
    NavigationDrawerScreenOptions
  >,
  navigation: Navigation,
  childNavigationProps: { [key: string]: Navigation },
  contentComponent: ReactClass<*>,
  contentOptions?: {},
  screenProps?: {},
  style?: ViewStyleProp,
};

/**
 * Component that renders the sidebar screen of the drawer.
 */
class DrawerSidebar extends PureComponent<void, Props, void> {
  props: Props;

  _getScreenOptions = (routeKey: string) => {
    const DrawerScreen = this.props.router.getComponentForRouteName(
      'DrawerClose'
    );
    const { [routeKey]: childNavigation } = this.props.childNavigationProps;
    return DrawerScreen.router.getScreenOptions(
      childNavigation.state.index !== undefined // if the child screen is a StackRouter then always show the screen options of its first screen (see #1914)
        ? {
            ...childNavigation,
            state: { ...childNavigation.state, index: 0 },
          }
        : childNavigation,
      this.props.screenProps
    );
  };

  _getLabel = ({ focused, tintColor, route }: DrawerScene) => {
    const { drawerLabel, title } = this._getScreenOptions(route.key);
    if (drawerLabel) {
      return typeof drawerLabel === 'function'
        ? drawerLabel({ tintColor, focused })
        : drawerLabel;
    }

    if (typeof title === 'string') {
      return title;
    }

    return route.routeName;
  };

  _renderIcon = ({ focused, tintColor, route }: DrawerScene) => {
    const { drawerIcon } = this._getScreenOptions(route.key);
    if (drawerIcon) {
      return typeof drawerIcon === 'function'
        ? drawerIcon({ tintColor, focused })
        : drawerIcon;
    }
    return null;
  };

  _onItemPress = ({ route, focused }: DrawerItem) => {
    this.props.navigation.navigate('DrawerClose');
    if (!focused) {
      let subAction;
      // if the child screen is a StackRouter then always navigate to its first screen (see #1914)
      if (route.index !== undefined && route.index !== 0) {
        route = ((route: any): NavigationStateRoute);
        subAction = NavigationActions.navigate({
          routeName: route.routes[0].routeName,
        });
      }
      this.props.navigation.navigate(route.routeName, undefined, subAction);
    }
  };

  render() {
    const ContentComponent = this.props.contentComponent;
    const { state } = this.props.navigation;
    return (
      <View style={[styles.container, this.props.style]}>
        <ContentComponent
          {...this.props.contentOptions}
          navigation={this.props.navigation}
          items={state.routes}
          activeItemKey={
            state.routes[state.index] && state.routes[state.index].key
          }
          screenProps={this.props.screenProps}
          getLabel={this._getLabel}
          renderIcon={this._renderIcon}
          onItemPress={this._onItemPress}
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
