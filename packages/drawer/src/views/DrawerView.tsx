import * as React from 'react';
import { Dimensions, StyleSheet, ViewStyle } from 'react-native';
import { SceneView } from '@react-navigation/core';
import { ScreenContainer } from 'react-native-screens';

import * as DrawerActions from '../routers/DrawerActions';
import DrawerSidebar, { ContentComponentProps } from './DrawerSidebar';
import DrawerGestureContext from '../utils/DrawerGestureContext';
import ResourceSavingScene from './ResourceSavingScene';
import Drawer from './Drawer';
import { Navigation } from '../types';
import { PanGestureHandler } from 'react-native-gesture-handler';

type DrawerOptions = {
  drawerBackgroundColor?: string;
  overlayColor?: string;
  minSwipeDistance?: number;
  drawerPosition: 'left' | 'right';
  drawerType: 'front' | 'back' | 'slide';
  drawerLockMode?: 'unlocked' | 'locked-closed' | 'locked-open';
  keyboardDismissMode?: 'on-drag' | 'none';
  drawerWidth: number | (() => number);
  statusBarAnimation: 'slide' | 'none' | 'fade';
  onDrawerClose?: () => void;
  onDrawerOpen?: () => void;
  contentContainerStyle?: ViewStyle;
  edgeWidth: number;
  hideStatusBar?: boolean;
  style?: ViewStyle;
};

type Props = {
  lazy: boolean;
  navigation: Navigation;
  descriptors: {
    [key: string]: {
      navigation: {};
      getComponent: () => React.ComponentType<{}>;
      options: DrawerOptions;
    };
  };
  navigationConfig: DrawerOptions & {
    contentComponent?: React.ComponentType<ContentComponentProps>;
    unmountInactiveRoutes?: boolean;
    contentOptions?: object;
  };
  screenProps: unknown;
};

type State = {
  loaded: number[];
  drawerWidth: number;
};

/**
 * Component that renders the drawer.
 */
export default class DrawerView extends React.PureComponent<Props, State> {
  static defaultProps = {
    lazy: true,
  };

  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    const { index } = nextProps.navigation.state;

    return {
      // Set the current tab to be loaded if it was not loaded before
      loaded: prevState.loaded.includes(index)
        ? prevState.loaded
        : [...prevState.loaded, index],
    };
  }

  state: State = {
    loaded: [this.props.navigation.state.index],
    drawerWidth:
      typeof this.props.navigationConfig.drawerWidth === 'function'
        ? this.props.navigationConfig.drawerWidth()
        : this.props.navigationConfig.drawerWidth,
  };

  componentDidMount() {
    Dimensions.addEventListener('change', this.updateWidth);
  }

  componentWillUnmount() {
    Dimensions.removeEventListener('change', this.updateWidth);
  }

  private drawerGestureRef = React.createRef<PanGestureHandler>();

  private handleDrawerOpen = () => {
    const { navigation } = this.props;

    navigation.dispatch(
      DrawerActions.openDrawer({
        key: navigation.state.key,
      })
    );
  };

  private handleDrawerClose = () => {
    const { navigation } = this.props;

    navigation.dispatch(
      DrawerActions.closeDrawer({
        key: navigation.state.key,
      })
    );
  };

  private updateWidth = () => {
    const drawerWidth =
      typeof this.props.navigationConfig.drawerWidth === 'function'
        ? this.props.navigationConfig.drawerWidth()
        : this.props.navigationConfig.drawerWidth;

    if (this.state.drawerWidth !== drawerWidth) {
      this.setState({ drawerWidth });
    }
  };

  private renderNavigationView = ({ progress }: any) => {
    return (
      <DrawerSidebar
        screenProps={this.props.screenProps}
        drawerOpenProgress={progress}
        navigation={this.props.navigation}
        descriptors={this.props.descriptors}
        contentComponent={this.props.navigationConfig.contentComponent}
        contentOptions={this.props.navigationConfig.contentOptions}
        drawerPosition={this.props.navigationConfig.drawerPosition}
        style={this.props.navigationConfig.style}
        {...this.props.navigationConfig}
      />
    );
  };

  private renderContent = () => {
    let { lazy, navigation } = this.props;
    let { loaded } = this.state;
    let { routes } = navigation.state;

    if (this.props.navigationConfig.unmountInactiveRoutes) {
      let activeKey = navigation.state.routes[navigation.state.index].key;
      let descriptor = this.props.descriptors[activeKey];

      return (
        <SceneView
          navigation={descriptor.navigation}
          screenProps={this.props.screenProps}
          component={descriptor.getComponent()}
        />
      );
    } else {
      return (
        <ScreenContainer style={styles.content}>
          {routes.map((route, index) => {
            if (lazy && !loaded.includes(index)) {
              // Don't render a screen if we've never navigated to it
              return null;
            }

            let isFocused = navigation.state.index === index;
            let descriptor = this.props.descriptors[route.key];

            return (
              <ResourceSavingScene
                key={route.key}
                style={[
                  StyleSheet.absoluteFill,
                  { opacity: isFocused ? 1 : 0 },
                ]}
                isVisible={isFocused}
              >
                <SceneView
                  navigation={descriptor.navigation}
                  screenProps={this.props.screenProps}
                  component={descriptor.getComponent()}
                />
              </ResourceSavingScene>
            );
          })}
        </ScreenContainer>
      );
    }
  };

  private setDrawerGestureRef = (ref: PanGestureHandler | null) => {
    // @ts-ignore
    this.drawerGestureRef.current = ref;
  };

  render() {
    const { navigation } = this.props;
    const {
      drawerType,
      drawerBackgroundColor,
      overlayColor,
      contentContainerStyle,
      edgeWidth,
      minSwipeDistance,
      hideStatusBar,
      statusBarAnimation,
    } = this.props.navigationConfig;
    const activeKey = navigation.state.routes[navigation.state.index].key;
    const { drawerLockMode } = this.props.descriptors[activeKey].options;

    const isOpen =
      drawerLockMode === 'locked-closed'
        ? false
        : drawerLockMode === 'locked-open'
        ? true
        : this.props.navigation.state.isDrawerOpen;

    return (
      <DrawerGestureContext.Provider value={this.drawerGestureRef}>
        <Drawer
          open={isOpen}
          locked={
            drawerLockMode === 'locked-open' ||
            drawerLockMode === 'locked-closed'
          }
          onOpen={this.handleDrawerOpen}
          onClose={this.handleDrawerClose}
          onGestureRef={this.setDrawerGestureRef}
          drawerType={drawerType}
          drawerPosition={this.props.navigationConfig.drawerPosition}
          contentContainerStyle={contentContainerStyle}
          drawerStyle={{
            backgroundColor: drawerBackgroundColor || 'white',
            width: this.state.drawerWidth,
          }}
          overlayStyle={{
            backgroundColor: overlayColor || 'rgba(0, 0, 0, 0.5)',
          }}
          swipeEdgeWidth={edgeWidth}
          swipeDistanceThreshold={minSwipeDistance}
          hideStatusBar={hideStatusBar}
          statusBarAnimation={statusBarAnimation}
          renderDrawerContent={this.renderNavigationView}
          renderSceneContent={this.renderContent}
        />
      </DrawerGestureContext.Provider>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
});
