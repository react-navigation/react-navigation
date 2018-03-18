/* eslint global-require: 0 */

module.exports = {
  // Core
  get createNavigationContainer() {
    return require('./createNavigationContainer').default;
  },
  get StateUtils() {
    return require('./StateUtils').default;
  },
  get addNavigationHelpers() {
    return require('./addNavigationHelpers').default;
  },
  get NavigationActions() {
    return require('./NavigationActions').default;
  },

  // Navigators
  get createNavigator() {
    return require('./navigators/createNavigator').default;
  },
  get createStackNavigator() {
    return require('./navigators/createStackNavigator').default;
  },
  get StackNavigator() {
    console.warn(
      'The StackNavigator function name is deprecated, please use createStackNavigator instead'
    );
    return require('./navigators/createStackNavigator').default;
  },
  get createSwitchNavigator() {
    return require('./navigators/createSwitchNavigator').default;
  },
  get SwitchNavigator() {
    console.warn(
      'The SwitchNavigator function name is deprecated, please use createSwitchNavigator instead'
    );
    return require('./navigators/createSwitchNavigator').default;
  },
  get createDrawerNavigator() {
    return require('./navigators/createDrawerNavigator').default;
  },
  get DrawerNavigator() {
    console.warn(
      'The DrawerNavigator function name is deprecated, please use createDrawerNavigator instead'
    );
    return require('./navigators/createDrawerNavigator').default;
  },
  get createTabNavigator() {
    console.warn(
      'TabNavigator is deprecated. Please use the createBottomTabNavigator or createMaterialTopNavigator instead.'
    );
    return require('react-navigation-deprecated-tab-navigator')
      .createTabNavigator;
  },
  get TabNavigator() {
    console.warn(
      'TabNavigator is deprecated. Please use the createBottomTabNavigator or createMaterialTopNavigator instead.'
    );
    return require('react-navigation-deprecated-tab-navigator').default;
  },
  get createBottomTabNavigator() {
    return require('react-navigation-tabs').createBottomTabNavigator;
  },
  get createMaterialBottomTabNavigator() {
    return require('react-navigation-tabs').createMaterialBottomTabNavigator;
  },
  get createMaterialTopTabNavigator() {
    return require('react-navigation-tabs').createMaterialTopTabNavigator;
  },

  // Routers
  get StackRouter() {
    return require('./routers/StackRouter').default;
  },
  get TabRouter() {
    return require('./routers/TabRouter').default;
  },
  get SwitchRouter() {
    return require('./routers/SwitchRouter').default;
  },

  // Views
  get Transitioner() {
    return require('./views/Transitioner').default;
  },
  get StackView() {
    return require('./views/StackView/StackView').default;
  },
  get StackViewCard() {
    return require('./views/StackView/StackViewCard').default;
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
    return require('./views/Header/Header').default;
  },
  get HeaderTitle() {
    return require('./views/Header/HeaderTitle').default;
  },
  get HeaderBackButton() {
    return require('./views/Header/HeaderBackButton').default;
  },

  // DrawerView
  get DrawerView() {
    return require('./views/Drawer/DrawerView').default;
  },
  get DrawerItems() {
    return require('./views/Drawer/DrawerNavigatorItems').default;
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
