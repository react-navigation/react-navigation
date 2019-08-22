import * as React from 'react';
import { Dimensions, StyleSheet, I18nManager, Platform } from 'react-native';
// eslint-disable-next-line import/no-unresolved
import { ScreenContainer } from 'react-native-screens';
import SafeAreaView from 'react-native-safe-area-view';
import { PanGestureHandler, ScrollView } from 'react-native-gesture-handler';
import {
  DrawerNavigationState,
  DrawerActions,
} from '@react-navigation/routers';

import DrawerSidebar from './DrawerSidebar';
import DrawerGestureContext from '../utils/DrawerGestureContext';
import ResourceSavingScene from './ResourceSavingScene';
import DrawerNavigatorItems from './DrawerNavigatorItems';
import Drawer from './Drawer';
import {
  DrawerDescriptorMap,
  DrawerNavigationConfig,
  ContentComponentProps,
  DrawerNavigationHelpers,
} from '../types';

type Props = DrawerNavigationConfig & {
  state: DrawerNavigationState;
  navigation: DrawerNavigationHelpers;
  descriptors: DrawerDescriptorMap;
};

type State = {
  loaded: number[];
  drawerWidth: number;
};

const DefaultContentComponent = (props: ContentComponentProps) => (
  <ScrollView alwaysBounceVertical={false}>
    <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
      <DrawerNavigatorItems {...props} />
    </SafeAreaView>
  </ScrollView>
);

/**
 * Component that renders the drawer.
 */
export default class DrawerView extends React.PureComponent<Props, State> {
  static defaultProps = {
    lazy: true,
    drawerWidth: () => {
      /*
       * Default drawer width is screen width - header height
       * with a max width of 280 on mobile and 320 on tablet
       * https://material.io/guidelines/patterns/navigation-drawer.html
       */
      const { height, width } = Dimensions.get('window');
      const smallerAxisSize = Math.min(height, width);
      const isLandscape = width > height;
      const isTablet = smallerAxisSize >= 600;
      const appBarHeight = Platform.OS === 'ios' ? (isLandscape ? 32 : 44) : 56;
      const maxWidth = isTablet ? 320 : 280;

      return Math.min(smallerAxisSize - appBarHeight, maxWidth);
    },
    contentComponent: DefaultContentComponent,
    drawerPosition: I18nManager.isRTL ? 'right' : 'left',
    keyboardDismissMode: 'on-drag',
    drawerBackgroundColor: 'white',
    drawerType: 'front',
    hideStatusBar: false,
    statusBarAnimation: 'slide',
  };

  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    const { index } = nextProps.state;

    return {
      // Set the current tab to be loaded if it was not loaded before
      loaded: prevState.loaded.includes(index)
        ? prevState.loaded
        : [...prevState.loaded, index],
    };
  }

  state: State = {
    loaded: [this.props.state.index],
    drawerWidth:
      typeof this.props.drawerWidth === 'function'
        ? this.props.drawerWidth()
        : this.props.drawerWidth,
  };

  componentDidMount() {
    Dimensions.addEventListener('change', this.updateWidth);
  }

  componentWillUnmount() {
    Dimensions.removeEventListener('change', this.updateWidth);
  }

  private drawerGestureRef = React.createRef<PanGestureHandler>();

  private handleDrawerOpen = () => {
    const { state, navigation } = this.props;

    navigation.dispatch({
      ...DrawerActions.openDrawer(),
      target: state.key,
    });

    navigation.emit({ type: 'drawerOpen' });
  };

  private handleDrawerClose = () => {
    const { state, navigation } = this.props;

    navigation.dispatch({
      ...DrawerActions.closeDrawer(),
      target: state.key,
    });

    navigation.emit({ type: 'drawerClose' });
  };

  private updateWidth = () => {
    const drawerWidth =
      typeof this.props.drawerWidth === 'function'
        ? this.props.drawerWidth()
        : this.props.drawerWidth;

    if (this.state.drawerWidth !== drawerWidth) {
      this.setState({ drawerWidth });
    }
  };

  private renderNavigationView = ({ progress }: any) => {
    return <DrawerSidebar drawerOpenProgress={progress} {...this.props} />;
  };

  private renderContent = () => {
    let { lazy, state, descriptors, unmountInactiveRoutes } = this.props;

    const { loaded } = this.state;

    if (unmountInactiveRoutes) {
      const activeKey = state.routes[state.index].key;
      const descriptor = descriptors[activeKey];

      return descriptor.render();
    } else {
      return (
        <ScreenContainer style={styles.content}>
          {state.routes.map((route, index) => {
            if (lazy && !loaded.includes(index)) {
              // Don't render a screen if we've never navigated to it
              return null;
            }

            const isFocused = state.index === index;
            const descriptor = descriptors[route.key];

            return (
              <ResourceSavingScene
                key={route.key}
                style={[
                  StyleSheet.absoluteFill,
                  // eslint-disable-next-line react-native/no-inline-styles
                  { opacity: isFocused ? 1 : 0 },
                ]}
                isVisible={isFocused}
              >
                {descriptor.render()}
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
    const {
      state,
      descriptors,
      drawerType,
      drawerPosition,
      drawerBackgroundColor,
      overlayColor,
      contentContainerStyle,
      edgeWidth,
      minSwipeDistance,
      hideStatusBar,
      statusBarAnimation,
      gestureHandlerProps,
    } = this.props;

    const activeKey = state.routes[state.index].key;
    const { drawerLockMode } = descriptors[activeKey].options;

    const isOpen =
      drawerLockMode === 'locked-closed'
        ? false
        : drawerLockMode === 'locked-open'
        ? true
        : state.isDrawerOpen;

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
          gestureHandlerProps={gestureHandlerProps}
          drawerType={drawerType}
          drawerPosition={drawerPosition}
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
