import * as React from 'react';
import { StyleSheet, View, Animated, ViewStyle } from 'react-native';
import { NavigationActions } from '@react-navigation/core';

import { Props as DrawerNavigatorItemsProps } from './DrawerNavigatorItems';
import invariant from '../utils/invariant';
import { Navigation, Scene, Route } from '../types';

export type ContentComponentProps = DrawerNavigatorItemsProps & {
  navigation: Navigation;
  descriptors: { [key: string]: any };
  drawerOpenProgress: Animated.AnimatedInterpolation;
  screenProps: unknown;
};

type Props = {
  contentComponent?: React.ComponentType<ContentComponentProps>;
  contentOptions?: object;
  screenProps?: unknown;
  navigation: Navigation;
  descriptors: { [key: string]: any };
  drawerOpenProgress: Animated.AnimatedInterpolation;
  drawerPosition: 'left' | 'right';
  style?: ViewStyle;
};

/**
 * Component that renders the sidebar screen of the drawer.
 */
class DrawerSidebar extends React.PureComponent<Props> {
  _getScreenOptions = (routeKey: string) => {
    const descriptor = this.props.descriptors[routeKey];
    invariant(
      descriptor.options,
      'Cannot access screen descriptor options from drawer sidebar'
    );
    return descriptor.options;
  };

  _getLabel = ({ focused, tintColor, route }: Scene) => {
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

  _renderIcon = ({ focused, tintColor, route }: Scene) => {
    const { drawerIcon } = this._getScreenOptions(route.key);
    if (drawerIcon) {
      return typeof drawerIcon === 'function'
        ? drawerIcon({ tintColor, focused })
        : drawerIcon;
    }
    return null;
  };

  _onItemPress = ({ route, focused }: { route: Route; focused: boolean }) => {
    if (focused) {
      this.props.navigation.closeDrawer();
    } else {
      this.props.navigation.dispatch(
        NavigationActions.navigate({ routeName: route.routeName })
      );
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
          descriptors={this.props.descriptors}
          drawerOpenProgress={this.props.drawerOpenProgress}
          items={state.routes}
          activeItemKey={
            state.routes[state.index] ? state.routes[state.index].key : null
          }
          screenProps={this.props.screenProps}
          getLabel={this._getLabel}
          renderIcon={this._renderIcon}
          onItemPress={this._onItemPress}
          drawerPosition={this.props.drawerPosition}
        />
      </View>
    );
  }
}

export default DrawerSidebar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
