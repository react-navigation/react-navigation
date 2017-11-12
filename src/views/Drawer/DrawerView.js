/* @flow */

import * as React from 'react';
import DrawerLayout from 'react-native-drawer-layout-polyfill';

import addNavigationHelpers from '../../addNavigationHelpers';
import DrawerSidebar from './DrawerSidebar';

import type {
  NavigationScreenProp,
  NavigationRoute,
  NavigationRouter,
  NavigationState,
  NavigationDrawerScreenOptions,
  ViewStyleProp,
  NavigationTabAction,
  NavigationStateRoute,
} from '../../TypeDefinition';

export type DrawerScene = {
  route: NavigationRoute,
  focused: boolean,
  index: number,
  tintColor?: string,
};

export type DrawerItem = {
  route: NavigationRoute,
  focused: boolean,
};

export type DrawerViewConfig = {
  drawerLockMode?: 'unlocked' | 'locked-closed' | 'locked-open',
  drawerWidth?: number,
  drawerPosition?: 'left' | 'right',
  contentComponent?: React.ComponentType<*>,
  contentOptions?: {},
  style?: ViewStyleProp,
  useNativeAnimations?: boolean,
  drawerBackgroundColor?: string,
  screenProps?: {},
};

export type DrawerViewPropsExceptRouter = DrawerViewConfig & {
  navigation: NavigationScreenProp<NavigationState>,
};

export type DrawerViewProps = DrawerViewPropsExceptRouter & {
  router: NavigationRouter<
    NavigationState,
    NavigationTabAction,
    NavigationDrawerScreenOptions
  >,
};

/**
 * Component that renders the drawer.
 */
export default class DrawerView<T: NavigationRoute> extends React.PureComponent<
  DrawerViewProps
> {
  componentWillMount() {
    this._updateScreenNavigation(this.props.navigation);
  }

  componentWillReceiveProps(nextProps: DrawerViewProps) {
    if (
      this.props.navigation.state.index !== nextProps.navigation.state.index
    ) {
      const { routes, index } = nextProps.navigation.state;
      if (routes[index].routeName === 'DrawerOpen') {
        this._drawer.openDrawer();
      } else if (routes[index].routeName === 'DrawerToggle') {
        if (this._drawer.state.drawerShown) {
          this.props.navigation.navigate('DrawerClose');
        } else {
          this.props.navigation.navigate('DrawerOpen');
        }
      } else {
        this._drawer.closeDrawer();
      }
    }
    this._updateScreenNavigation(nextProps.navigation);
  }

  _screenNavigationProp: NavigationScreenProp<NavigationStateRoute>;

  _handleDrawerOpen = () => {
    const { navigation } = this.props;
    const { routes, index } = navigation.state;
    if (routes[index].routeName !== 'DrawerOpen') {
      this.props.navigation.navigate('DrawerOpen');
    }
  };

  _handleDrawerClose = () => {
    const { navigation } = this.props;
    const { routes, index } = navigation.state;
    if (routes[index].routeName !== 'DrawerClose') {
      this.props.navigation.navigate('DrawerClose');
    }
  };

  _updateScreenNavigation = (
    navigation: NavigationScreenProp<NavigationState>
  ) => {
    // $FlowFixMe there's no way type the specific shape of the nav state
    const navigationState: NavigationStateRoute = navigation.state.routes.find(
      (route: *) => route.routeName === 'DrawerClose'
    );
    if (
      this._screenNavigationProp &&
      this._screenNavigationProp.state === navigationState
    ) {
      return;
    }
    this._screenNavigationProp = addNavigationHelpers({
      dispatch: navigation.dispatch,
      state: navigationState,
    });
  };

  _getNavigationState = (navigation: NavigationScreenProp<NavigationState>) => {
    const navigationState = navigation.state.routes.find(
      (route: *) => route.routeName === 'DrawerClose'
    );
    return navigationState;
  };

  _renderNavigationView = () => (
    <DrawerSidebar
      screenProps={this.props.screenProps}
      navigation={this._screenNavigationProp}
      router={this.props.router}
      contentComponent={this.props.contentComponent}
      contentOptions={this.props.contentOptions}
      style={this.props.style}
    />
  );

  _drawer: any;

  render() {
    const DrawerScreen = this.props.router.getComponentForRouteName(
      'DrawerClose'
    );

    const screenNavigation = addNavigationHelpers({
      state: this._screenNavigationProp.state,
      dispatch: this._screenNavigationProp.dispatch,
    });

    const config = this.props.router.getScreenOptions(
      screenNavigation,
      this.props.screenProps
    );

    return (
      <DrawerLayout
        ref={(c: *) => {
          this._drawer = c;
        }}
        drawerLockMode={
          (this.props.screenProps && this.props.screenProps.drawerLockMode) ||
          (config && config.drawerLockMode)
        }
        drawerBackgroundColor={this.props.drawerBackgroundColor}
        drawerWidth={this.props.drawerWidth}
        onDrawerOpen={this._handleDrawerOpen}
        onDrawerClose={this._handleDrawerClose}
        useNativeAnimations={this.props.useNativeAnimations}
        renderNavigationView={this._renderNavigationView}
        drawerPosition={
          this.props.drawerPosition === 'right'
            ? DrawerLayout.positions.Right
            : DrawerLayout.positions.Left
        }
      >
        <DrawerScreen
          screenProps={this.props.screenProps}
          navigation={this._screenNavigationProp}
        />
      </DrawerLayout>
    );
  }
}
