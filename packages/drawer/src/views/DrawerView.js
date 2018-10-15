import React from 'react';
import { Dimensions } from 'react-native';
import { SceneView } from '@react-navigation/core';
import DrawerActions from '../routers/DrawerActions';
import DrawerLayout from './DrawerLayout';
import DrawerSidebar from './DrawerSidebar';
import DrawerGestureContext from '../utils/DrawerGestureContext';

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

  componentDidMount() {
    Dimensions.addEventListener('change', this._updateWidth);
  }

  componentDidUpdate(prevProps) {
    const {
      openId,
      closeId,
      toggleId,
      isDrawerOpen,
    } = this.props.navigation.state;
    const {
      openId: prevOpenId,
      closeId: prevCloseId,
      toggleId: prevToggleId,
    } = prevProps.navigation.state;

    let prevIds = [prevOpenId, prevCloseId, prevToggleId];
    let changedIds = [openId, closeId, toggleId]
      .filter(id => !prevIds.includes(id))
      .sort((a, b) => a > b);

    changedIds.forEach(id => {
      if (id === openId) {
        this._drawer.openDrawer();
      } else if (id === closeId) {
        this._drawer.closeDrawer();
      } else if (id === toggleId) {
        if (isDrawerOpen) {
          this._drawer.closeDrawer();
        } else {
          this._drawer.openDrawer();
        }
      }
    });
  }

  componentWillUnmount() {
    Dimensions.removeEventListener('change', this._updateWidth);
  }

  drawerGestureRef = React.createRef();

  _handleDrawerOpen = () => {
    this.props.navigation.dispatch({
      type: DrawerActions.DRAWER_OPENED,
      key: this.props.navigation.state.key,
    });
  };

  _handleDrawerClose = () => {
    this.props.navigation.dispatch({
      type: DrawerActions.DRAWER_CLOSED,
      key: this.props.navigation.state.key,
    });
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

  _renderNavigationView = () => {
    return (
      <DrawerGestureContext.Provider value={this.drawerGestureRef}>
        <DrawerSidebar
          screenProps={this.props.screenProps}
          navigation={this.props.navigation}
          descriptors={this.props.descriptors}
          contentComponent={this.props.navigationConfig.contentComponent}
          contentOptions={this.props.navigationConfig.contentOptions}
          drawerPosition={this.props.navigationConfig.drawerPosition}
          style={this.props.navigationConfig.style}
          {...this.props.navigationConfig}
        />
      </DrawerGestureContext.Provider>
    );
  };

  render() {
    const { state } = this.props.navigation;
    const activeKey = state.routes[state.index].key;
    const descriptor = this.props.descriptors[activeKey];

    const { drawerLockMode } = descriptor.options;

    return (
      <DrawerLayout
        ref={c => {
          this._drawer = c;
        }}
        gestureRef={this.drawerGestureRef}
        drawerLockMode={
          drawerLockMode ||
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
        /* props specific to react-native-gesture-handler/DrawerLayout */
        drawerType={this.props.navigationConfig.drawerType}
        edgeWidth={this.props.navigationConfig.edgeWidth}
        hideStatusBar={this.props.navigationConfig.hideStatusBar}
        statusBarAnimation={this.props.navigationConfig.statusBarAnimation}
        minSwipeDistance={this.props.navigationConfig.minSwipeDistance}
        overlayColor={this.props.navigationConfig.overlayColor}
      >
        <DrawerGestureContext.Provider value={this.drawerGestureRef}>
          <SceneView
            navigation={descriptor.navigation}
            screenProps={this.props.screenProps}
            component={descriptor.getComponent()}
          />
        </DrawerGestureContext.Provider>
      </DrawerLayout>
    );
  }
}
