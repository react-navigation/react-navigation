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
    return require('./navigators/createStackNavigator').default;
  },
  get createSwitchNavigator() {
    return require('./navigators/createSwitchNavigator').default;
  },
  get SwitchNavigator() {
    return require('./navigators/createSwitchNavigator').default;
  },
  get createTabNavigator() {
    return require('./navigators/createTabNavigator').default;
  },
  get TabNavigator() {
    return require('./navigators/createTabNavigator').default;
  },
  get createDrawerNavigator() {
    return require('./navigators/createDrawerNavigator').default;
  },
  get DrawerNavigator() {
    return require('./navigators/createDrawerNavigator').default;
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
    return require('./views/TabView/TabView').default;
  },
  get TabBarTop() {
    return require('./views/TabView/TabBarTop').default;
  },
  get TabBarBottom() {
    return require('./views/TabView/TabBarBottom').default;
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
};
