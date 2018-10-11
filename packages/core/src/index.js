/* eslint global-require: 0 */

module.exports = {
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

  get createSwitchNavigator() {
    return require('./navigators/createSwitchNavigator').default;
  },

  // Actions
  get NavigationActions() {
    return require('./NavigationActions').default;
  },
  get StackActions() {
    return require('./routers/StackActions').default;
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

  get SceneView() {
    return require('./views/SceneView').default;
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
};
