import React from 'react';
import { Dimensions, Platform, ScrollView } from 'react-native';
import {
  createNavigator,
  createNavigationContainer,
  SafeAreaView,
} from 'react-navigation';
import DrawerRouter from '../routers/DrawerRouter';
import DrawerView from '../views/DrawerView';
import DrawerItems from '../views/DrawerNavigatorItems';

// A stack navigators props are the intersection between
// the base navigator props (navgiation, screenProps, etc)
// and the view's props

const defaultContentComponent = props => (
  <ScrollView alwaysBounceVertical={false}>
    <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
      <DrawerItems {...props} />
    </SafeAreaView>
  </ScrollView>
);

const DefaultDrawerConfig = {
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
  contentComponent: defaultContentComponent,
  drawerPosition: 'left',
  drawerBackgroundColor: 'white',
  useNativeAnimations: true,
  drawerType: 'front',
  hideStatusBar: false,
  statusBarAnimation: 'slide',
  overlayColor: 'black',
};

const DrawerNavigator = (routeConfigs, config = {}) => {
  const mergedConfig = { ...DefaultDrawerConfig, ...config };

  const {
    order,
    paths,
    initialRouteName,
    initialRouteParams,
    backBehavior,
    getCustomActionCreators,
    ...drawerConfig
  } = mergedConfig;

  const routerConfig = {
    order,
    paths,
    initialRouteName,
    initialRouteParams,
    backBehavior,
    getCustomActionCreators,
  };

  const drawerRouter = DrawerRouter(routeConfigs, routerConfig);

  const navigator = createNavigator(DrawerView, drawerRouter, drawerConfig);

  return createNavigationContainer(navigator);
};

export default DrawerNavigator;
