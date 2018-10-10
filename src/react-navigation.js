/* eslint global-require: 0 */

module.exports = {
  // Core
  get createNavigationContainer() {
    return require('./createNavigationContainer').default;
  },
  get StateUtils() {
    return require('./StateUtils').default;
  },
  get getNavigation() {
    return require('./getNavigation').default;
  },

  // Navigators
  get createNavigator() {
    return require('./navigators/createNavigator').default;
  },
  get createKeyboardAwareNavigator() {
    return require('./navigators/createKeyboardAwareNavigator').default;
  },
  get NavigationProvider() {
    return require('./views/NavigationContext').default.NavigationProvider;
  },
  get NavigationConsumer() {
    return require('./views/NavigationContext').default.NavigationConsumer;
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
    return require('./NavigationActions').default;
  },
  get StackActions() {
    return require('./routers/StackActions').default;
  },
  get DrawerActions() {
    return require('react-navigation-drawer').DrawerActions;
  },

  // Routers
  get StackRouter() {
    return require('./routers/StackRouter').default;
  },
  get TabRouter() {
    return require('./routers/TabRouter').default;
  },
  get DrawerRouter() {
    return require('react-navigation-drawer').DrawerRouter;
  },
  get SwitchRouter() {
    return require('./routers/SwitchRouter').default;
  },
  get createConfigGetter() {
    return require('./routers/createConfigGetter').default;
  },
  get getScreenForRouteName() {
    return require('./routers/getScreenForRouteName').default;
  },
  get validateRouteConfigMap() {
    return require('./routers/validateRouteConfigMap').default;
  },

  // Utils
  get getActiveChildNavigationOptions() {
    return require('./utils/getActiveChildNavigationOptions').default;
  },
  get pathUtils() {
    return require('./routers/pathUtils').default;
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
    return require('./views/SceneView').default;
  },
  get ResourceSavingSceneView() {
    return require('./views/ResourceSavingSceneView').default;
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
    return require('./views/SwitchView/SwitchView').default;
  },

  // NavigationEvents
  get NavigationEvents() {
    return require('./views/NavigationEvents').default;
  },

  // HOCs
  get withNavigation() {
    return require('./views/withNavigation').default;
  },
  get withNavigationFocus() {
    return require('./views/withNavigationFocus').default;
  },
  get withOrientation() {
    return require('./views/withOrientation').default;
  },
};
