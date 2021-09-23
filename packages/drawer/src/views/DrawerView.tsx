import * as React from 'react';
import {
  View,
  StyleSheet,
  I18nManager,
  Platform,
  BackHandler,
} from 'react-native';
import { ScreenContainer, screensEnabled } from 'react-native-screens';
import {
  NavigationHelpersContext,
  NavigationContext,
  NavigationRouteContext,
  DrawerNavigationState,
  DrawerActions,
  useTheme,
  ParamListBase,
} from '@react-navigation/native';

import { GestureHandlerRootView } from './GestureHandler';
import SafeAreaProviderCompat from './SafeAreaProviderCompat';
import ResourceSavingScene from './ResourceSavingScene';
import Header from './Header';
import DrawerContent from './DrawerContent';
import Drawer from './Drawer';
import DrawerOpenContext from '../utils/DrawerOpenContext';
import DrawerPositionContext from '../utils/DrawerPositionContext';
import useWindowDimensions from '../utils/useWindowDimensions';
import getIsDrawerOpenFromState from '../utils/getIsDrawerOpenFromState';
import type {
  DrawerDescriptorMap,
  DrawerNavigationConfig,
  DrawerNavigationHelpers,
  DrawerContentComponentProps,
  DrawerHeaderProps,
} from '../types';

type Props = DrawerNavigationConfig & {
  state: DrawerNavigationState<ParamListBase>;
  navigation: DrawerNavigationHelpers;
  descriptors: DrawerDescriptorMap;
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
   * https://material.io/components/navigation-drawer
   */
  const smallerAxisSize = Math.min(height, width);
  const isLandscape = width > height;
  const isTablet = smallerAxisSize >= 600;
  const appBarHeight = Platform.OS === 'ios' ? (isLandscape ? 32 : 44) : 56;
  const maxWidth = isTablet ? 320 : 280;

  return Math.min(smallerAxisSize - appBarHeight, maxWidth);
};

const GestureHandlerWrapper = GestureHandlerRootView ?? View;

/**
 * Component that renders the drawer.
 */
export default function DrawerView({
  state,
  navigation,
  descriptors,
  lazy = true,
  drawerContent = (props: DrawerContentComponentProps) => (
    <DrawerContent {...props} />
  ),
  drawerPosition = I18nManager.isRTL ? 'right' : 'left',
  keyboardDismissMode = 'on-drag',
  overlayColor = 'rgba(0, 0, 0, 0.5)',
  drawerType = 'front',
  hideStatusBar = false,
  statusBarAnimation = 'slide',
  drawerContentOptions,
  drawerStyle,
  edgeWidth,
  gestureHandlerProps,
  minSwipeDistance,
  sceneContainerStyle,
  detachInactiveScreens = true,
}: Props) {
  const [loaded, setLoaded] = React.useState([state.routes[state.index].key]);
  const dimensions = useWindowDimensions();

  const { colors } = useTheme();

  const isDrawerOpen = getIsDrawerOpenFromState(state);

  const handleDrawerOpen = React.useCallback(() => {
    navigation.dispatch({
      ...DrawerActions.openDrawer(),
      target: state.key,
    });
  }, [navigation, state.key]);

  const handleDrawerClose = React.useCallback(() => {
    navigation.dispatch({
      ...DrawerActions.closeDrawer(),
      target: state.key,
    });
  }, [navigation, state.key]);

  React.useEffect(() => {
    if (!isDrawerOpen || drawerType === 'permanent') {
      return;
    }

    const handleClose = () => {
      // We shouldn't handle the back button if the parent screen isn't focused
      // This will avoid the drawer overriding event listeners from a focused screen
      if (!navigation.isFocused()) {
        return false;
      }

      handleDrawerClose();

      return true;
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    // We only add the listeners when drawer opens
    // This way we can make sure that the listener is added as late as possible
    // This will make sure that our handler will run first when back button is pressed
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      handleClose
    );

    if (Platform.OS === 'web') {
      document?.body?.addEventListener?.('keyup', handleEscape);
    }

    return () => {
      subscription.remove();

      if (Platform.OS === 'web') {
        document?.body?.removeEventListener?.('keyup', handleEscape);
      }
    };
  }, [drawerType, handleDrawerClose, isDrawerOpen, navigation]);

  const focusedRouteKey = state.routes[state.index].key;

  if (!loaded.includes(focusedRouteKey)) {
    setLoaded([...loaded, focusedRouteKey]);
  }

  const renderNavigationView = ({ progress }: any) => {
    return (
      <DrawerPositionContext.Provider value={drawerPosition}>
        {drawerContent({
          ...drawerContentOptions,
          progress: progress,
          state: state,
          navigation: navigation,
          descriptors: descriptors,
        })}
      </DrawerPositionContext.Provider>
    );
  };

  const renderContent = () => {
    const isScreensEnabled = screensEnabled?.() && detachInactiveScreens;

    return (
      // @ts-ignore
      <ScreenContainer enabled={isScreensEnabled} style={styles.content}>
        {state.routes.map((route, index) => {
          const descriptor = descriptors[route.key];
          const { unmountOnBlur } = descriptor.options;
          const isFocused = state.index === index;

          if (unmountOnBlur && !isFocused) {
            return null;
          }

          if (lazy && !loaded.includes(route.key) && !isFocused) {
            // Don't render a screen if we've never navigated to it
            return null;
          }

          const {
            header = (props: DrawerHeaderProps) => <Header {...props} />,
            headerShown = false,
          } = descriptor.options;

          return (
            <ResourceSavingScene
              key={route.key}
              style={[StyleSheet.absoluteFill, { opacity: isFocused ? 1 : 0 }]}
              isVisible={isFocused}
              enabled={isScreensEnabled}
            >
              {headerShown ? (
                <NavigationContext.Provider value={descriptor.navigation}>
                  <NavigationRouteContext.Provider value={route}>
                    {header({
                      layout: dimensions,
                      scene: { route, descriptor },
                    })}
                  </NavigationRouteContext.Provider>
                </NavigationContext.Provider>
              ) : null}
              {descriptor.render()}
            </ResourceSavingScene>
          );
        })}
      </ScreenContainer>
    );
  };

  const activeKey = state.routes[state.index].key;
  const { gestureEnabled, swipeEnabled } = descriptors[activeKey].options;

  return (
    <NavigationHelpersContext.Provider value={navigation}>
      <GestureHandlerWrapper style={styles.content}>
        <SafeAreaProviderCompat>
          <DrawerOpenContext.Provider value={isDrawerOpen}>
            <Drawer
              open={isDrawerOpen}
              gestureEnabled={gestureEnabled}
              swipeEnabled={swipeEnabled}
              onOpen={handleDrawerOpen}
              onClose={handleDrawerClose}
              gestureHandlerProps={gestureHandlerProps}
              drawerType={drawerType}
              drawerPosition={drawerPosition}
              sceneContainerStyle={[
                { backgroundColor: colors.background },
                sceneContainerStyle,
              ]}
              drawerStyle={[
                {
                  width: getDefaultDrawerWidth(dimensions),
                  backgroundColor: colors.card,
                },
                drawerType === 'permanent' &&
                  (drawerPosition === 'left'
                    ? {
                        borderRightColor: colors.border,
                        borderRightWidth: StyleSheet.hairlineWidth,
                      }
                    : {
                        borderLeftColor: colors.border,
                        borderLeftWidth: StyleSheet.hairlineWidth,
                      }),
                drawerStyle,
              ]}
              overlayStyle={{ backgroundColor: overlayColor }}
              swipeEdgeWidth={edgeWidth}
              swipeDistanceThreshold={minSwipeDistance}
              hideStatusBar={hideStatusBar}
              statusBarAnimation={statusBarAnimation}
              renderDrawerContent={renderNavigationView}
              renderSceneContent={renderContent}
              keyboardDismissMode={keyboardDismissMode}
              dimensions={dimensions}
            />
          </DrawerOpenContext.Provider>
        </SafeAreaProviderCompat>
      </GestureHandlerWrapper>
    </NavigationHelpersContext.Provider>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
});
