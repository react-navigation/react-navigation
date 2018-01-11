/* @flow */

import * as React from 'react';
import { Dimensions } from 'react-native';
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
  drawerWidth?: number | (() => number),
  drawerPosition?: 'left' | 'right',
  drawerOpenRoute?: string,
  drawerCloseRoute?: string,
  drawerToggleRoute?: string,
  contentComponent?: React.ComponentType<*>,
  contentOptions?: {},
  style?: ViewStyleProp,
  useNativeAnimations?: boolean,
  drawerBackgroundColor?: string,
  screenProps?: {},
};

export type DrawerViewProps = {
  drawerLockMode?: 'unlocked' | 'locked-closed' | 'locked-open',
  drawerWidth: number | (() => number),
  drawerPosition: 'left' | 'right',
  drawerOpenRoute: string,
  drawerCloseRoute: string,
  drawerToggleRoute: string,
  contentComponent: React.ComponentType<*>,
  contentOptions?: {},
  style?: ViewStyleProp,
  useNativeAnimations: boolean,
  drawerBackgroundColor: string,
  screenProps?: {},

  navigation: NavigationScreenProp<NavigationState>,
  router: NavigationRouter<NavigationState, NavigationDrawerScreenOptions>,
};

type DrawerViewState = {
  drawerWidth?: number,
};

/**
 * Component that renders the drawer.
 */
export default class DrawerView extends React.PureComponent<
  DrawerViewProps,
  DrawerViewState
> {
  state: DrawerViewState = {
    drawerWidth:
      typeof this.props.drawerWidth === 'function'
        ? this.props.drawerWidth()
        : this.props.drawerWidth,
  };

  componentWillMount() {
    this._updateScreenNavigation(this.props.navigation);

    Dimensions.addEventListener('change', this._updateWidth);
  }

  componentWillUnmount() {
    Dimensions.removeEventListener('change', this._updateWidth);
  }

  componentWillReceiveProps(nextProps: DrawerViewProps) {
    if (
      this.props.navigation.state.index !== nextProps.navigation.state.index
    ) {
      const {
        drawerOpenRoute,
        drawerCloseRoute,
        drawerToggleRoute,
      } = this.props;
      const { routes, index } = nextProps.navigation.state;
      if (routes[index].routeName === drawerOpenRoute) {
        this._drawer.openDrawer();
      } else if (routes[index].routeName === drawerToggleRoute) {
        if (this.props.navigation.state.index === 0) {
          this.props.navigation.navigate(drawerOpenRoute);
        } else {
          this.props.navigation.navigate(drawerCloseRoute);
        }
      } else {
        this._drawer.closeDrawer();
      }
    }
    this._updateScreenNavigation(nextProps.navigation);
  }

  _screenNavigationProp: NavigationScreenProp<NavigationStateRoute>;

  _handleDrawerOpen = () => {
    const { navigation, drawerOpenRoute } = this.props;
    const { routes, index } = navigation.state;
    if (routes[index].routeName !== drawerOpenRoute) {
      this.props.navigation.navigate(drawerOpenRoute);
    }
  };

  _handleDrawerClose = () => {
    const { navigation, drawerCloseRoute } = this.props;
    const { routes, index } = navigation.state;
    if (routes[index].routeName !== drawerCloseRoute) {
      this.props.navigation.navigate(drawerCloseRoute);
    }
  };

  _updateScreenNavigation = (
    navigation: NavigationScreenProp<NavigationState>
  ) => {
    const { drawerCloseRoute } = this.props;
    // $FlowFixMe there's no way type the specific shape of the nav state
    const navigationState: NavigationStateRoute = navigation.state.routes.find(
      (route: *) => route.routeName === drawerCloseRoute
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

  _updateWidth = () => {
    const drawerWidth =
      typeof this.props.drawerWidth === 'function'
        ? this.props.drawerWidth()
        : this.props.drawerWidth;

    if (this.state.drawerWidth !== drawerWidth) {
      this.setState({ drawerWidth });
    }
  };

  _getNavigationState = (navigation: NavigationScreenProp<NavigationState>) => {
    const { drawerCloseRoute } = this.props;
    const navigationState = navigation.state.routes.find(
      (route: *) => route.routeName === drawerCloseRoute
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
      drawerPosition={this.props.drawerPosition}
      style={this.props.style}
    />
  );

  _drawer: any;

  render() {
    const DrawerScreen = this.props.router.getComponentForRouteName(
      this.props.drawerCloseRoute
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
        drawerWidth={this.state.drawerWidth}
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
