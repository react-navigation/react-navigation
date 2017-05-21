/*
 * @noflow - get/set properties not yet supported by flow. also `...require(x)` is broken #6560135
 */

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
  get StackNavigator() {
    return require('./navigators/StackNavigator').default;
  },
  get TabNavigator() {
    return require('./navigators/TabNavigator').default;
  },
  get DrawerNavigator() {
    return require('./navigators/DrawerNavigator').default;
  },

  // Routers
  get StackRouter() {
    return require('./routers/StackRouter').default;
  },
  get TabRouter() {
    return require('./routers/TabRouter').default;
  },

  // Views
  get Transitioner() {
    return require('./views/Transitioner').default;
  },
  get CardStack() {
    return require('./views/CardStack').default;
  },
  get Card() {
    return require('./views/Card').default;
  },

  // Header
  get Header() {
    return require('./views/Header').default;
  },
  get HeaderTitle() {
    return require('./views/HeaderTitle').default;
  },
  get HeaderBackButton() {
    return require('./views/HeaderBackButton').default;
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

  // HOCs
  get withNavigation() {
    return require('./views/withNavigation').default;
  },
};
