/*
 * @noflow - get/set properties not yet supported by flow. also `...require(x)` is broken #6560135
 */

module.exports = {

  // Core
  get createNavigationContainer() { return require('./createNavigationContainer').default; },
  get StateUtils() { return require('./StateUtils').default; },
  get PropTypes() { return require('./PropTypes').default; },
  get addNavigationHelpers() { return require('./addNavigationHelpers').default; },
  get NavigationActions() { return require('./NavigationActions').default; },

  // Navigators
  get createNavigator() { return require('./navigators/createNavigator').default; },
  get StackNavigator() { return require('./navigators/StackNavigator').default; },
  get TabNavigator() { return require('./navigators/TabNavigator').default; },
  get DrawerNavigator() { return require('./navigators/DrawerNavigator').default; },

  // Routers
  get StackRouter() { return require('./routers/StackRouter').default; },
  get TabRouter() { return require('./routers/TabRouter').default; },

  // Views
  get Transitioner() { return require('./views/Transitioner').default; },
  get CardStack() { return require('./views/CardStack').default; },
  get DrawerView() { return require('./views/Drawer/DrawerView').default; },
  get TabView() { return require('./views/TabView/TabView').default; },

  // HOCs
  get withNavigation() { return require('./views/withNavigation').default; },
};
