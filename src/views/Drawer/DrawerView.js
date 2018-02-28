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
      typeof this.props.navigationConfig.drawerWidth === 'function'
        ? this.props.navigationConfig.drawerWidth()
        : this.props.navigationConfig.drawerWidth,
  };

  componentWillMount() {
    Dimensions.addEventListener('change', this._updateWidth);
  }

  componentWillUnmount() {
    Dimensions.removeEventListener('change', this._updateWidth);
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.navigation.state.index !== nextProps.navigation.state.index
    ) {
      const {
        drawerOpenRoute,
        drawerCloseRoute,
        drawerToggleRoute,
      } = this.props.navigationConfig;
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
  }

  _handleDrawerOpen = () => {
    const { navigation, navigationConfig } = this.props;
    const { drawerOpenRoute } = navigationConfig;
    const { routes, index } = navigation.state;
    if (routes[index].routeName !== drawerOpenRoute) {
      this.props.navigation.navigate(drawerOpenRoute);
    }
  };

  _handleDrawerClose = () => {
    const { navigation, navigationConfig } = this.props;
    const { drawerCloseRoute } = navigationConfig;
    const { routes, index } = navigation.state;
    if (routes[index].routeName !== drawerCloseRoute) {
      this.props.navigation.navigate(drawerCloseRoute);
    }
  };

  _updateWidth = () => {
    const drawerWidth =
      typeof this.props.navigationConfig.drawerWidth === 'function'
        ? this.props.navigationConfig.drawerWidth()
        : this.props.navigationConfig.drawerWidth;

    if (this.state.drawerWidth !== drawerWidth) {
      this.setState({ drawerWidth });
    }
  };

  _getNavigationState = navigation => {
    const { drawerCloseRoute } = this.props.navigationConfig;
    const navigationState = navigation.state.routes.find(
      route => route.routeName === drawerCloseRoute
    );

    return navigationState;
  };

  _renderNavigationView = () => {
    const details = Object.values(this.props.descriptors).find(
      d => d.state.routeName === this.props.navigationConfig.drawerCloseRoute
    );

    const router = details.getComponent().router;
    const { state, addListener, dispatch } = this.props.navigation;
    const { routes } = details.state;

    const tabDescriptors = {};
    routes.forEach(route => {
      const getComponent = () =>
        router.getComponentForRouteName(route.routeName);

      const childNavigation = addNavigationHelpers({
        dispatch,
        state: route,
        addListener: getChildEventSubscriber(addListener, route.key),
      });
      const options = router.getScreenOptions(
        childNavigation,
        this.props.screenProps
      );
      tabDescriptors[route.key] = {
        key: route.key,
        getComponent,
        options,
        state: route,
        navigation: childNavigation,
      };
    });

    return (
      <DrawerSidebar
        screenProps={this.props.screenProps}
        navigation={details.navigation}
        descriptors={tabDescriptors}
        contentComponent={this.props.navigationConfig.contentComponent}
        contentOptions={this.props.navigationConfig.contentOptions}
        drawerPosition={this.props.navigationConfig.drawerPosition}
        style={this.props.navigationConfig.style}
        {...this.props.navigationConfig}
      />
    );
  };

  render() {
    const descriptor = Object.values(this.props.descriptors).find(
      d => d.state.routeName === this.props.navigationConfig.drawerCloseRoute
    );

    const DrawerScreen = descriptor.getComponent();

    const { drawerLockMode } = descriptor.options;

    return (
      <DrawerLayout
        ref={c => {
          this._drawer = c;
        }}
        drawerLockMode={
          (this.props.screenProps && this.props.screenProps.drawerLockMode) ||
          this.props.navigationConfig.drawerLockMode
        }
        drawerBackgroundColor={
          this.props.navigationConfig.drawerBackgroundColor
        }
        drawerWidth={this.state.drawerWidth}
        onDrawerOpen={this._handleDrawerOpen}
        onDrawerClose={this._handleDrawerClose}
        useNativeAnimations={this.props.navigationConfig.useNativeAnimations}
        renderNavigationView={this._renderNavigationView}
        drawerPosition={
          this.props.navigationConfig.drawerPosition === 'right'
            ? DrawerLayout.positions.Right
            : DrawerLayout.positions.Left
        }
      >
        <DrawerScreen
          screenProps={this.props.screenProps}
          navigation={descriptor.navigation}
        />
      </DrawerLayout>
    );
  }
}
