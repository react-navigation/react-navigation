import * as React from 'react';
import { Dimensions, StyleSheet, ViewStyle } from 'react-native';
import {
  SceneView,
  ThemeColors,
  ThemeContext,
  NavigationScreenProp,
} from 'react-navigation';
import { ScreenContainer, screensEnabled } from 'react-native-screens';

import * as DrawerActions from '../routers/DrawerActions';
import DrawerSidebar from './DrawerSidebar';
import DrawerGestureContext from '../utils/DrawerGestureContext';
import ResourceSavingScene from './ResourceSavingScene';
import Drawer from './Drawer';
import {
  NavigationDrawerState,
  DrawerContentComponentProps,
  SceneDescriptorMap,
} from '../types';
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
  sceneContainerStyle?: ViewStyle;
  edgeWidth: number;
  hideStatusBar?: boolean;
  style?: ViewStyle;
  gestureHandlerProps?: React.ComponentProps<typeof PanGestureHandler>;
};

type Props = {
  lazy: boolean;
  navigation: NavigationScreenProp<NavigationDrawerState>;
  descriptors: SceneDescriptorMap;
  navigationConfig: DrawerOptions & {
    contentComponent?: React.ComponentType<DrawerContentComponentProps>;
    unmountInactiveRoutes?: boolean;
    contentOptions?: object;
  };
  screenProps: unknown;
  detachInactiveScreens: boolean;
};

type State = {
  loaded: number[];
  drawerWidth: number;
};

/**
 * Component that renders the drawer.
 */
export default class DrawerView extends React.PureComponent<Props, State> {
  // eslint-disable-next-line react/sort-comp
  static contextType = ThemeContext;
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
    // If drawerLockMode was set to `locked-open`, we should open the drawer on mount
    if (this.getLockMode(this.props) === 'locked-open') {
      this.handleDrawerOpen();
    }

    Dimensions.addEventListener('change', this.updateWidth);
  }

  componentDidUpdate(prevProps: Props) {
    const prevLockMode = this.getLockMode(prevProps);
    const nextLockMode = this.getLockMode(this.props);

    if (prevLockMode !== nextLockMode) {
      if (nextLockMode === 'locked-open') {
        this.handleDrawerOpen();
      } else {
        this.handleDrawerClose();
      }
    }
  }

  componentWillUnmount() {
    Dimensions.removeEventListener('change', this.updateWidth);
  }

  context!: React.ContextType<typeof ThemeContext>;

  private drawerGestureRef = React.createRef<PanGestureHandler>();

  private getLockMode = ({ navigation, descriptors }: Props) => {
    const activeKey = navigation.state.routes[navigation.state.index].key;
    const { drawerLockMode } = descriptors[activeKey].options;

    return drawerLockMode;
  };

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
        {...this.props.navigationConfig}
      />
    );
  };

  private renderContent = () => {
    let { lazy, navigation, detachInactiveScreens = true } = this.props;
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
      const enabled = screensEnabled?.() && detachInactiveScreens;

      return (
        // @ts-ignore
        <ScreenContainer enabled={enabled} style={styles.content}>
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
                enabled={detachInactiveScreens}
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

  private getDrawerBackgroundColor() {
    const { drawerBackgroundColor } = this.props.navigationConfig;

    if (drawerBackgroundColor) {
      return typeof drawerBackgroundColor === 'string'
        ? drawerBackgroundColor
        : drawerBackgroundColor[this.context];
    } else {
      return ThemeColors[this.context].bodyContent;
    }
  }

  private getOverlayColor() {
    const { overlayColor } = this.props.navigationConfig;

    if (overlayColor) {
      return typeof overlayColor === 'string'
        ? overlayColor
        : overlayColor[this.context];
    } else {
      return 'rgba(0,0,0,0.5)';
    }
  }

  render() {
    const { navigation, navigationConfig } = this.props;
    const {
      drawerType,
      sceneContainerStyle,
      edgeWidth,
      minSwipeDistance,
      hideStatusBar,
      statusBarAnimation,
      gestureHandlerProps,
    } = navigationConfig;

    const drawerLockMode = this.getLockMode(this.props);
    const drawerBackgroundColor = this.getDrawerBackgroundColor();
    const overlayColor = this.getOverlayColor();

    return (
      <DrawerGestureContext.Provider value={this.drawerGestureRef}>
        <Drawer
          open={navigation.state.isDrawerOpen}
          gestureEnabled={
            drawerLockMode !== 'locked-open' &&
            drawerLockMode !== 'locked-closed'
          }
          onOpen={this.handleDrawerOpen}
          onClose={this.handleDrawerClose}
          onGestureRef={this.setDrawerGestureRef}
          gestureHandlerProps={gestureHandlerProps}
          drawerType={drawerType}
          drawerPosition={this.props.navigationConfig.drawerPosition}
          sceneContainerStyle={sceneContainerStyle}
          drawerStyle={{
            backgroundColor: drawerBackgroundColor,
            width: this.state.drawerWidth,
          }}
          overlayStyle={{ backgroundColor: overlayColor }}
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
