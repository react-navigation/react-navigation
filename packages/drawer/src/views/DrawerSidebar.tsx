import * as React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import {
  NavigationActions,
  NavigationRoute,
  NavigationScreenProp,
} from 'react-navigation';
import Animated from 'react-native-reanimated';
import {
  Scene,
  NavigationDrawerState,
  DrawerContentComponentProps,
  SceneDescriptorMap,
} from '../types';

type Props = {
  contentComponent?: React.ComponentType<DrawerContentComponentProps>;
  contentOptions?: object;
  screenProps?: unknown;
  navigation: NavigationScreenProp<NavigationDrawerState>;
  descriptors: SceneDescriptorMap;
  drawerOpenProgress: Animated.Node<number>;
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
    route: NavigationRoute;
    focused: boolean;
  }) => {
    if (focused) {
      // @ts-ignore
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
