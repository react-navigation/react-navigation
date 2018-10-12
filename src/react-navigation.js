/* eslint global-require: 0 */

module.exports = {
  // Core
  get createNavigationContainer() {
    return require('@react-navigation/native').createNavigationContainer;
  },

  get StateUtils() {
    return require('@react-navigation/core').StateUtils;
  },
  get getNavigation() {
    return require('@react-navigation/core').getNavigation;
  },

  // Navigators
  get createNavigator() {
    return require('@react-navigation/core').createNavigator;
  },
  get createKeyboardAwareNavigator() {
    return require('@react-navigation/native').createKeyboardAwareNavigator;
  },
  get NavigationProvider() {
    return require('@react-navigation/core').NavigationProvider;
  },
  get NavigationConsumer() {
    return require('@react-navigation/core').NavigationConsumer;
  },
  get createStackNavigator() {
    return require('react-navigation-stack').createStackNavigator;
  },
  get StackNavigator() {
    console.warn(
      'The StackNavigator function name is deprecated, please use createStackNavigator instead'
    );
    return require('react-navigation-stack').createStackNavigator;
  },
  get createSwitchNavigator() {
    return require('./navigators/createContainedSwitchNavigator').default;
  },
  get SwitchNavigator() {
    console.warn(
      'The SwitchNavigator function name is deprecated, please use createSwitchNavigator instead'
    );
    return require('./navigators/createContainedSwitchNavigator').default;
  },
  get createDrawerNavigator() {
    return require('react-navigation-drawer').createDrawerNavigator;
  },
  get DrawerNavigator() {
    console.warn(
      'The DrawerNavigator function name is deprecated, please use createDrawerNavigator instead'
    );
    return require('react-navigation-drawer').createDrawerNavigator;
  },
  get createTabNavigator() {
    console.warn(
      'createTabNavigator is deprecated. Please use the createBottomTabNavigator or createMaterialTopTabNavigator instead.'
    );
    return require('react-navigation-deprecated-tab-navigator')
      .createTabNavigator;
  },
  get TabNavigator() {
    console.warn(
      'TabNavigator is deprecated. Please use the createBottomTabNavigator or createMaterialTopTabNavigator instead.'
    );
    return require('react-navigation-deprecated-tab-navigator')
      .createTabNavigator;
  },
  get createBottomTabNavigator() {
    return require('react-navigation-tabs').createBottomTabNavigator;
  },
  get createMaterialTopTabNavigator() {
    return require('react-navigation-tabs').createMaterialTopTabNavigator;
  },

  // Actions
  get NavigationActions() {
    return require('@react-navigation/core').NavigationActions;
  },
  get StackActions() {
    return require('@react-navigation/core').StackActions;
  },
  get DrawerActions() {
    return require('react-navigation-drawer').DrawerActions;
  },

  // Routers
  get StackRouter() {
    return require('@react-navigation/core').StackRouter;
  },
  get TabRouter() {
    return require('@react-navigation/core').TabRouter;
  },
  get DrawerRouter() {
    return require('react-navigation-drawer').DrawerRouter;
  },
  get SwitchRouter() {
    return require('@react-navigation/core').SwitchRouter;
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

  // Utils
  get getActiveChildNavigationOptions() {
    return require('@react-navigation/core').getActiveChildNavigationOptions;
  },
  get pathUtils() {
    return require('@react-navigation/core').pathUtils;
  },

  // Views
  get Transitioner() {
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
  get SafeAreaView() {
    return require('react-native-safe-area-view').default;
  },
  get SceneView() {
    return require('@react-navigation/core').SceneView;
  },
  get ResourceSavingSceneView() {
    return require('@react-navigation/native').ResourceSavingSceneView;
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

  // TabView
  get TabView() {
    console.warn(
      'TabView is deprecated. Please use the react-navigation-tabs package instead: https://github.com/react-navigation/react-navigation-tabs'
    );
    return require('react-navigation-deprecated-tab-navigator').TabView;
  },
  get TabBarTop() {
    console.warn(
      'TabBarTop is deprecated. Please use the react-navigation-tabs package instead: https://github.com/react-navigation/react-navigation-tabs'
    );
    return require('react-navigation-deprecated-tab-navigator').TabBarTop;
  },
  get TabBarBottom() {
    console.warn(
      'TabBarBottom is deprecated. Please use the react-navigation-tabs package instead: https://github.com/react-navigation/react-navigation-tabs'
    );
    return require('react-navigation-deprecated-tab-navigator').TabBarBottom;
  },

  // SwitchView
  get SwitchView() {
    return require('@react-navigation/core').SwitchView;
  },

  // NavigationEvents
  get NavigationEvents() {
    return require('@react-navigation/core').NavigationEvents;
  },

  // HOCs
  get withNavigation() {
    return require('@react-navigation/core').withNavigation;
  },
  get withNavigationFocus() {
    return require('@react-navigation/core').withNavigationFocus;
  },
  get withOrientation() {
    return require('@react-navigation/native').withOrientation;
  },
};
