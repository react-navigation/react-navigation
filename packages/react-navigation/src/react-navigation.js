/* eslint global-require: 0 */

module.exports = {
  // Themes
  get useTheme() {
    return require('@react-navigation/core').useTheme;
  },
  get ThemeContext() {
    return require('@react-navigation/core').ThemeContext;
  },
  get ThemeColors() {
    return require('@react-navigation/core').ThemeColors;
  },
  get Themed() {
    return require('@react-navigation/native').Themed;
  },

  // Native
  get createAppContainer() {
    return require('@react-navigation/native').createAppContainer;
  },
  get createNavigationContainer() {
    console.warn(
      '`createNavigationContainer()` has been deprecated, please use `createAppContainer()` instead. You can also import createAppContainer directly from @react-navigation/native'
    );
    return require('@react-navigation/native').createAppContainer;
  },
  get createKeyboardAwareNavigator() {
    return require('@react-navigation/native').createKeyboardAwareNavigator;
  },
  get createNavigationAwareScrollable() {
    return require('@react-navigation/native').createNavigationAwareScrollable;
  },
  get ScrollView() {
    return require('@react-navigation/native').ScrollView;
  },
  get FlatList() {
    return require('@react-navigation/native').FlatList;
  },
  get SectionList() {
    return require('@react-navigation/native').SectionList;
  },
  get ResourceSavingSceneView() {
    return require('@react-navigation/native').ResourceSavingSceneView;
  },
  get SafeAreaView() {
    return require('@react-navigation/native').SafeAreaView;
  },
  get withOrientation() {
    return require('@react-navigation/native').withOrientation;
  },

  // Core
  get createNavigator() {
    return require('@react-navigation/core').createNavigator;
  },
  get StateUtils() {
    return require('@react-navigation/core').StateUtils;
  },
  get getNavigation() {
    return require('@react-navigation/core').getNavigation;
  },
  get NavigationContext() {
    return require('@react-navigation/core').NavigationContext;
  },
  get NavigationProvider() {
    return require('@react-navigation/core').NavigationProvider;
  },
  get NavigationConsumer() {
    return require('@react-navigation/core').NavigationConsumer;
  },
  get NavigationActions() {
    return require('@react-navigation/core').NavigationActions;
  },
  get StackActions() {
    return require('@react-navigation/core').StackActions;
  },
  get StackRouter() {
    return require('@react-navigation/core').StackRouter;
  },
  get TabRouter() {
    return require('@react-navigation/core').TabRouter;
  },
  get SwitchRouter() {
    return require('@react-navigation/core').SwitchRouter;
  },
  get SwitchActions() {
    return require('@react-navigation/core').SwitchActions;
  },
  get createConfigGetter() {
    return require('@react-navigation/core').StackAcreateConfigGetterctions;
  },
  get getScreenForRouteName() {
    return require('@react-navigation/core').getScreenForRouteName;
  },
  get validateRouteConfigMap() {
    return require('@react-navigation/core').validateRouteConfigMap;
  },
  get getActiveChildNavigationOptions() {
    return require('@react-navigation/core').getActiveChildNavigationOptions;
  },
  get pathUtils() {
    return require('@react-navigation/core').pathUtils;
  },
  get SceneView() {
    return require('@react-navigation/core').SceneView;
  },
  get SwitchView() {
    return require('@react-navigation/core').SwitchView;
  },
  get NavigationEvents() {
    return require('@react-navigation/core').NavigationEvents;
  },
  get withNavigation() {
    return require('@react-navigation/core').withNavigation;
  },
  get withNavigationFocus() {
    return require('@react-navigation/core').withNavigationFocus;
  },

  // Navigators

  get createStackNavigator() {
    return require('react-navigation-stack').createStackNavigator;
  },
  get createSwitchNavigator() {
    return require('@react-navigation/core').createSwitchNavigator;
  },

  get createBottomTabNavigator() {
    return require('react-navigation-tabs').createBottomTabNavigator;
  },
  get createMaterialTopTabNavigator() {
    return require('react-navigation-tabs').createMaterialTopTabNavigator;
  },

  get createDrawerNavigator() {
    return require('react-navigation-drawer').createDrawerNavigator;
  },

  // Gesture contexts

  get StackGestureContext() {
    return require('react-navigation-stack').StackGestureContext;
  },
  get DrawerGestureContext() {
    return require('react-navigation-drawer').DrawerGestureContext;
  },

  // Routers and Actions

  get DrawerRouter() {
    return require('react-navigation-drawer').DrawerRouter;
  },
  get DrawerActions() {
    return require('react-navigation-drawer').DrawerActions;
  },

  // Views
  get Transitioner() {
    console.warn(
      'Importing the stack Transitioner directly from react-navigation is now deprecated. Instead, import { Transitioner } from "react-navigation-stack";'
    );
    return require('react-navigation-stack').Transitioner;
  },
  get StackView() {
    return require('react-navigation-stack').StackView;
  },
  get StackViewCard() {
    return require('react-navigation-stack').StackViewCard;
  },
  get StackViewTransitionConfigs() {
    return require('react-navigation-stack').StackViewTransitionConfigs;
  },

  // Header
  get Header() {
    return require('react-navigation-stack').Header;
  },
  get HeaderTitle() {
    return require('react-navigation-stack').HeaderTitle;
  },
  get HeaderBackButton() {
    return require('react-navigation-stack').HeaderBackButton;
  },
  get HeaderStyleInterpolator() {
    return require('react-navigation-stack').HeaderStyleInterpolator;
  },

  // DrawerView
  get DrawerView() {
    return require('react-navigation-drawer').DrawerView;
  },
  get DrawerItems() {
    return require('react-navigation-drawer').DrawerNavigatorItems;
  },
  get DrawerSidebar() {
    return require('react-navigation-drawer').DrawerSidebar;
  },

  // Tabs
  get BottomTabBar() {
    return require('react-navigation-tabs').BottomTabBar;
  },
  get MaterialTopTabBar() {
    return require('react-navigation-tabs').MaterialTopTabBar;
  },
};
