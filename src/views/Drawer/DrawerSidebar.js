import React from 'react';
import { StyleSheet, View } from 'react-native';

import withCachedChildNavigation from '../../withCachedChildNavigation';
import NavigationActions from '../../NavigationActions';
import invariant from '../../utils/invariant';

import SafeAreaView from '../SafeAreaView';

/**
 * Component that renders the sidebar screen of the drawer.
 */
class DrawerSidebar extends React.PureComponent {
  _getScreenOptions = routeKey => {
    const DrawerScreen = this.props.router.getComponentForRouteName(
      'DrawerClose'
    );
    invariant(
      DrawerScreen.router,
      'NavigationComponent with routeName DrawerClose should be a Navigator'
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

  _getLabel = ({ focused, tintColor, route }) => {
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

  _renderIcon = ({ focused, tintColor, route }) => {
    const { drawerIcon } = this._getScreenOptions(route.key);
    if (drawerIcon) {
      return typeof drawerIcon === 'function'
        ? drawerIcon({ tintColor, focused })
        : drawerIcon;
    }
    return null;
  };

  _onItemPress = ({ route, focused }) => {
    this.props.navigation.navigate('DrawerClose');
    if (!focused) {
      let subAction;
      // if the child screen is a StackRouter then always navigate to its first screen (see #1914)
      if (route.index !== undefined && route.index !== 0) {
        subAction = NavigationActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({
              routeName: route.routes[0].routeName,
            }),
          ],
        });
      }
      this.props.navigation.navigate(route.routeName, undefined, subAction);
    }
  };

  render() {
    const ContentComponent = this.props.contentComponent;
    if (!ContentComponent) {
      return null;
    }
    const { state } = this.props.navigation;
    invariant(typeof state.index === 'number', 'should be set');
    return (
      <View style={[styles.container, this.props.style]}>
        <ContentComponent
          {...this.props.contentOptions}
          navigation={this.props.navigation}
          items={state.routes}
          activeItemKey={
            state.routes[state.index] ? state.routes[state.index].key : null
          }
          screenProps={this.props.screenProps}
          getLabel={this._getLabel}
          renderIcon={this._renderIcon}
          onItemPress={this._onItemPress}
          router={this.props.router}
          drawerPosition={this.props.drawerPosition}
        />
      </View>
    );
  }
}

export default withCachedChildNavigation(DrawerSidebar);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
