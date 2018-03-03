import React from 'react';
import { Dimensions } from 'react-native';
import DrawerLayout from 'react-native-drawer-layout-polyfill';

import addNavigationHelpers from '../../addNavigationHelpers';
import DrawerSidebar from './DrawerSidebar';
import getChildEventSubscriber from '../../getChildEventSubscriber';

/**
 * Component that renders the drawer.
 */
export default class DrawerView extends React.PureComponent {
  state = {
    drawerWidth:
      typeof this.props.drawerWidth === 'function'
        ? this.props.drawerWidth()
        : this.props.drawerWidth,
  };

  _childEventSubscribers = {};

  componentWillMount() {
    this._updateScreenNavigation(this.props.navigation);

    Dimensions.addEventListener('change', this._updateWidth);
  }

  componentWillUnmount() {
    Dimensions.removeEventListener('change', this._updateWidth);
  }

  componentDidUpdate() {
    const activeKeys = this.props.navigation.state.routes.map(
      route => route.key
    );
    Object.keys(this._childEventSubscribers).forEach(key => {
      if (!activeKeys.includes(key)) {
        delete this._childEventSubscribers[key];
      }
    });
  }

  componentWillReceiveProps(nextProps) {
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

  _isRouteFocused = route => () => {
    const { state } = this.props.navigation;
    const focusedRoute = state.routes[state.index];
    return route === focusedRoute;
  };

  _updateScreenNavigation = navigation => {
    const { drawerCloseRoute } = this.props;
    const navigationState = navigation.state.routes.find(
      route => route.routeName === drawerCloseRoute
    );
    if (
      this._screenNavigationProp &&
      this._screenNavigationProp.state === navigationState
    ) {
      return;
    }

    if (!this._childEventSubscribers[navigationState.key]) {
      this._childEventSubscribers[
        navigationState.key
      ] = getChildEventSubscriber(navigation.addListener, navigationState.key);
    }

    this._screenNavigationProp = addNavigationHelpers({
      dispatch: navigation.dispatch,
      state: navigationState,
      isFocused: this._isRouteFocused.bind(this, navigationState),
      addListener: this._childEventSubscribers[navigationState.key],
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

  _getNavigationState = navigation => {
    const { drawerCloseRoute } = this.props;
    const navigationState = navigation.state.routes.find(
      route => route.routeName === drawerCloseRoute
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

  render() {
    const DrawerScreen = this.props.router.getComponentForRouteName(
      this.props.drawerCloseRoute
    );

    const config = this.props.router.getScreenOptions(
      this._screenNavigationProp,
      this.props.screenProps
    );

    return (
      <DrawerLayout
        ref={c => {
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
