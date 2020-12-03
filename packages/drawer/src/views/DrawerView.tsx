import * as React from 'react';
import {
  View,
  StyleSheet,
  I18nManager,
  Platform,
  BackHandler,
  NativeEventSubscription,
} from 'react-native';
import { ScreenContainer } from 'react-native-screens';
import { useSafeAreaFrame } from 'react-native-safe-area-context';
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
import getIsDrawerOpenFromState from '../utils/getIsDrawerOpenFromState';
import type {
  DrawerDescriptorMap,
  DrawerNavigationConfig,
  DrawerNavigationHelpers,
  DrawerContentComponentProps,
  DrawerHeaderProps,
  DrawerNavigationProp,
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

function DrawerViewBase({
  state,
  navigation,
  descriptors,
  lazy = true,
  drawerContent = (props: DrawerContentComponentProps) => (
    <DrawerContent {...props} />
  ),
  detachInactiveScreens = true,
}: Props) {
  const activeKey = state.routes[state.index].key;
  const {
    drawerHideStatusBarOnOpen = false,
    drawerPosition = I18nManager.isRTL ? 'right' : 'left',
    drawerStatusBarAnimation = 'slide',
    drawerStyle,
    drawerType = Platform.select({ ios: 'slide', default: 'front' }),
    gestureEnabled,
    gestureHandlerProps,
    keyboardDismissMode = 'on-drag',
    overlayColor = 'rgba(0, 0, 0, 0.5)',
    sceneContainerStyle,
    swipeEdgeWidth,
    swipeEnabled,
    swipeMinDistance,
  } = descriptors[activeKey].options;

  const [loaded, setLoaded] = React.useState([activeKey]);
  const dimensions = useSafeAreaFrame();

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
    let subscription: NativeEventSubscription | undefined;

    if (isDrawerOpen) {
      // We only add the subscription when drawer opens
      // This way we can make sure that the subscription is added as late as possible
      // This will make sure that our handler will run first when back button is pressed
      subscription = BackHandler.addEventListener('hardwareBackPress', () => {
        handleDrawerClose();

        return true;
      });
    }

    return () => subscription?.remove();
  }, [handleDrawerClose, isDrawerOpen, navigation, state.key]);

  const focusedRouteKey = state.routes[state.index].key;

  if (!loaded.includes(focusedRouteKey)) {
    setLoaded([...loaded, focusedRouteKey]);
  }

  const renderDrawerContent = ({ progress }: any) => {
    return (
      <DrawerPositionContext.Provider value={drawerPosition}>
        {drawerContent({
          progress: progress,
          state: state,
          navigation: navigation,
          descriptors: descriptors,
        })}
      </DrawerPositionContext.Provider>
    );
  };

  const renderSceneContent = () => {
    return (
      // @ts-ignore
      <ScreenContainer enabled={detachInactiveScreens} style={styles.content}>
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
            headerShown = true,
          } = descriptor.options;

          return (
            <ResourceSavingScene
              key={route.key}
              style={[StyleSheet.absoluteFill, { opacity: isFocused ? 1 : 0 }]}
              isVisible={isFocused}
              enabled={detachInactiveScreens}
            >
              {headerShown ? (
                <NavigationContext.Provider value={descriptor.navigation}>
                  <NavigationRouteContext.Provider value={route}>
                    {header({
                      layout: dimensions,
                      route: descriptor.route,
                      navigation: descriptor.navigation as DrawerNavigationProp<
                        ParamListBase
                      >,
                      options: descriptor.options,
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

  return (
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
        swipeEdgeWidth={swipeEdgeWidth}
        swipeDistanceThreshold={swipeMinDistance}
        hideStatusBarOnOpen={drawerHideStatusBarOnOpen}
        statusBarAnimation={drawerStatusBarAnimation}
        renderDrawerContent={renderDrawerContent}
        renderSceneContent={renderSceneContent}
        keyboardDismissMode={keyboardDismissMode}
        dimensions={dimensions}
      />
    </DrawerOpenContext.Provider>
  );
}

export default function DrawerView({ navigation, ...rest }: Props) {
  return (
    <NavigationHelpersContext.Provider value={navigation}>
      <SafeAreaProviderCompat>
        <GestureHandlerWrapper style={styles.content}>
          <DrawerViewBase navigation={navigation} {...rest} />
        </GestureHandlerWrapper>
      </SafeAreaProviderCompat>
    </NavigationHelpersContext.Provider>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
});
