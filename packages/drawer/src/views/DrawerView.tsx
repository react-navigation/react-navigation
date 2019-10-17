import * as React from 'react';
import {
  Dimensions,
  StyleSheet,
  I18nManager,
  Platform,
  ScaledSize,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
// eslint-disable-next-line import/no-unresolved
import { ScreenContainer } from 'react-native-screens';
import { PanGestureHandler } from 'react-native-gesture-handler';
import {
  DrawerNavigationState,
  DrawerActions,
} from '@react-navigation/routers';

import DrawerGestureContext from '../utils/DrawerGestureContext';
import ResourceSavingScene from './ResourceSavingScene';
import DrawerContent from './DrawerContent';
import Drawer from './Drawer';
import {
  DrawerDescriptorMap,
  DrawerNavigationConfig,
  DrawerNavigationHelpers,
} from '../types';

type Props = Omit<DrawerNavigationConfig, 'overlayColor'> & {
  state: DrawerNavigationState;
  navigation: DrawerNavigationHelpers;
  descriptors: DrawerDescriptorMap;
  overlayColor: string;
};

type State = {
  loaded: number[];
  drawerWidth: number;
};

const getDefaultDrawerWidth = ({
  height,
  width,
}: {
  height: number;
  width: number;
}) => {
  /*
   * Default drawer width is screen width - header height
   * with a max width of 280 on mobile and 320 on tablet
   * https://material.io/guidelines/patterns/navigation-drawer.html
   */
  const smallerAxisSize = Math.min(height, width);
  const isLandscape = width > height;
  const isTablet = smallerAxisSize >= 600;
  const appBarHeight = Platform.OS === 'ios' ? (isLandscape ? 32 : 44) : 56;
  const maxWidth = isTablet ? 320 : 280;

  return Math.min(smallerAxisSize - appBarHeight, maxWidth);
};

/**
 * Component that renders the drawer.
 */
export default class DrawerView extends React.PureComponent<Props, State> {
  static defaultProps = {
    lazy: true,
    contentComponent: DrawerContent,
    drawerPosition: I18nManager.isRTL ? 'right' : 'left',
    keyboardDismissMode: 'on-drag',
    overlayColor: 'rgba(0, 0, 0, 0.5)',
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
    drawerWidth: getDefaultDrawerWidth(Dimensions.get('window')),
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

  private updateWidth = ({ window }: { window: ScaledSize }) => {
    const drawerWidth = getDefaultDrawerWidth(window);

    if (this.state.drawerWidth !== drawerWidth) {
      this.setState({ drawerWidth });
    }
  };

  private renderNavigationView = ({ progress }: any) => {
    const {
      state,
      navigation,
      descriptors,
      drawerPosition,
      contentComponent: ContentComponent,
      contentOptions,
    } = this.props;

    return (
      <ContentComponent
        progress={progress}
        state={state}
        navigation={navigation}
        descriptors={descriptors}
        drawerPosition={drawerPosition}
        {...contentOptions}
      />
    );
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
      overlayColor,
      sceneContainerStyle,
      drawerStyle,
      edgeWidth,
      minSwipeDistance,
      hideStatusBar,
      statusBarAnimation,
      gestureHandlerProps,
    } = this.props;

    const { drawerWidth } = this.state;

    const activeKey = state.routes[state.index].key;
    const { drawerLockMode } = descriptors[activeKey].options;

    const isOpen =
      drawerLockMode === 'locked-closed'
        ? false
        : drawerLockMode === 'locked-open'
        ? true
        : state.isDrawerOpen;

    return (
      <SafeAreaProvider>
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
            sceneContainerStyle={sceneContainerStyle}
            drawerStyle={[{ width: drawerWidth }, drawerStyle]}
            overlayStyle={{ backgroundColor: overlayColor }}
            swipeEdgeWidth={edgeWidth}
            swipeDistanceThreshold={minSwipeDistance}
            hideStatusBar={hideStatusBar}
            statusBarAnimation={statusBarAnimation}
            renderDrawerContent={this.renderNavigationView}
            renderSceneContent={this.renderContent}
          />
        </DrawerGestureContext.Provider>
      </SafeAreaProvider>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
});
