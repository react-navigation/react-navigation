import * as React from 'react';
import {
  Dimensions,
  StyleSheet,
  I18nManager,
  Platform,
  ScaledSize,
} from 'react-native';
// eslint-disable-next-line import/no-unresolved
import { ScreenContainer } from 'react-native-screens';
import { PanGestureHandler } from 'react-native-gesture-handler';
import {
  DrawerNavigationState,
  DrawerActions,
} from '@react-navigation/routers';
import { useTheme } from '@react-navigation/native';

import DrawerGestureContext from '../utils/DrawerGestureContext';
import SafeAreaProviderCompat from './SafeAreaProviderCompat';
import ResourceSavingScene from './ResourceSavingScene';
import DrawerContent from './DrawerContent';
import Drawer from './Drawer';
import {
  DrawerDescriptorMap,
  DrawerNavigationConfig,
  DrawerNavigationHelpers,
  DrawerContentComponentProps,
} from '../types';

type Props = DrawerNavigationConfig & {
  state: DrawerNavigationState;
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
  unmountInactiveScreens,
}: Props) {
  const [loaded, setLoaded] = React.useState([state.index]);
  const [drawerWidth, setDrawerWidth] = React.useState(() =>
    getDefaultDrawerWidth(Dimensions.get('window'))
  );

  const drawerGestureRef = React.useRef<PanGestureHandler>(null);

  const { colors } = useTheme();

  React.useEffect(() => {
    const updateWidth = ({ window }: { window: ScaledSize }) => {
      setDrawerWidth(getDefaultDrawerWidth(window));
    };

    Dimensions.addEventListener('change', updateWidth);

    return () => Dimensions.removeEventListener('change', updateWidth);
  }, []);

  if (!loaded.includes(state.index)) {
    setLoaded([...loaded, state.index]);
  }

  const handleDrawerOpen = () => {
    navigation.dispatch({
      ...DrawerActions.openDrawer(),
      target: state.key,
    });

    navigation.emit({ type: 'drawerOpen' });
  };

  const handleDrawerClose = () => {
    navigation.dispatch({
      ...DrawerActions.closeDrawer(),
      target: state.key,
    });

    navigation.emit({ type: 'drawerClose' });
  };

  const renderNavigationView = ({ progress }: any) => {
    return drawerContent({
      ...drawerContentOptions,
      progress: progress,
      state: state,
      navigation: navigation,
      descriptors: descriptors,
      drawerPosition: drawerPosition,
    });
  };

  const renderContent = () => {
    return (
      <ScreenContainer style={styles.content}>
        {state.routes.map((route, index) => {
          if (unmountInactiveScreens && index !== state.index) {
            return null;
          }

          if (lazy && !loaded.includes(index) && index !== state.index) {
            // Don't render a screen if we've never navigated to it
            return null;
          }

          const isFocused = state.index === index;
          const descriptor = descriptors[route.key];

          return (
            <ResourceSavingScene
              key={route.key}
              style={[StyleSheet.absoluteFill, { opacity: isFocused ? 1 : 0 }]}
              isVisible={isFocused}
            >
              {descriptor.render()}
            </ResourceSavingScene>
          );
        })}
      </ScreenContainer>
    );
  };

  const activeKey = state.routes[state.index].key;
  const { gestureEnabled } = descriptors[activeKey].options;

  return (
    <SafeAreaProviderCompat>
      <DrawerGestureContext.Provider value={drawerGestureRef}>
        <Drawer
          open={Boolean(state.history.find(it => it.type === 'drawer'))}
          gestureEnabled={gestureEnabled !== false}
          onOpen={handleDrawerOpen}
          onClose={handleDrawerClose}
          onGestureRef={ref => {
            // @ts-ignore
            drawerGestureRef.current = ref;
          }}
          gestureHandlerProps={gestureHandlerProps}
          drawerType={drawerType}
          drawerPosition={drawerPosition}
          sceneContainerStyle={[
            { backgroundColor: colors.background },
            sceneContainerStyle,
          ]}
          drawerStyle={[
            { width: drawerWidth, backgroundColor: colors.card },
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
          drawerPostion={drawerPosition}
        />
      </DrawerGestureContext.Provider>
    </SafeAreaProviderCompat>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
});
