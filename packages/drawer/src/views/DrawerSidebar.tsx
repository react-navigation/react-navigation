import * as React from 'react';
import { StyleSheet, View, Animated, ViewStyle } from 'react-native';
import { NavigationActions } from '@react-navigation/core';

import { Props as DrawerNavigatorItemsProps } from './DrawerNavigatorItems';
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
  private getScreenOptions = (routeKey: string) => {
    const descriptor = this.props.descriptors[routeKey];

    if (!descriptor.options) {
      throw new Error(
        'Cannot access screen descriptor options from drawer sidebar'
      );
    }

    return descriptor.options;
  };

  private getLabel = ({ focused, tintColor, route }: Scene) => {
    const { drawerLabel, title } = this.getScreenOptions(route.key);
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

  private renderIcon = ({ focused, tintColor, route }: Scene) => {
    const { drawerIcon } = this.getScreenOptions(route.key);
    if (drawerIcon) {
      return typeof drawerIcon === 'function'
        ? drawerIcon({ tintColor, focused })
        : drawerIcon;
    }
    return null;
  };

  private handleItemPress = ({
    route,
    focused,
  }: {
    route: Route;
    focused: boolean;
  }) => {
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

    if (typeof state.index !== 'number') {
      throw new Error(
        'The index of the route should be state in the navigation state'
      );
    }

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
          getLabel={this.getLabel}
          renderIcon={this.renderIcon}
          onItemPress={this.handleItemPress}
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
