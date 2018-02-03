module.exports = {
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
  get StackRouter() {
    return require('./routers/StackRouter').default;
  },
  get TabRouter() {
    return require('./routers/TabRouter').default;
  },
  get Transitioner() {
    return require('./views/Transitioner').default;
  },
  get CardStackTransitioner() {
    return require('./views/CardStack/CardStackTransitioner').default;
  },
  get CardStack() {
    return require('./views/CardStack/CardStack').default;
  },
  get Card() {
    return require('./views/CardStack/Card').default;
  },
  get SafeAreaView() {
    return require('./views/SafeAreaView').default;
  },
  get Header() {
    return require('./views/Header/Header').default;
  },
  get HeaderTitle() {
    return require('./views/Header/HeaderTitle').default;
  },
  get HeaderBackButton() {
    return require('./views/Header/HeaderBackButton').default;
  },
  get DrawerView() {
    return require('./views/Drawer/DrawerView').default;
  },
  get DrawerItems() {
    return require('./views/Drawer/DrawerNavigatorItems').default;
  },
  get TabView() {
    return require('./views/TabView/TabView').default;
  },
  get TabBarTop() {
    return require('./views/TabView/TabBarTop').default;
  },
  get TabBarBottom() {
    return require('./views/TabView/TabBarBottom').default;
  },
  get withNavigation() {
    return require('./views/withNavigation').default;
  },
};
