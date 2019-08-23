/* eslint-disable import/no-commonjs */

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
  get NavigationContext() {
    return require('./views/NavigationContext').default;
  },
  get NavigationProvider() {
    return require('./views/NavigationContext').default.Provider;
  },
  get NavigationConsumer() {
    return require('./views/NavigationContext').default.Consumer;
  },
  get createSwitchNavigator() {
    return require('./navigators/createSwitchNavigator').default;
  },

  // Themes
  get ThemeContext() {
    return require('./views/ThemeContext').default;
  },
  get ThemeProvider() {
    return require('./views/ThemeContext').default.Provider;
  },
  get ThemeConsumer() {
    return require('./views/ThemeContext').default.Consumer;
  },
  get ThemeColors() {
    return require('./ThemeColors').default;
  },
  get useTheme() {
    return require('./useTheme').default;
  },

  // Actions
  get NavigationActions() {
    return require('./NavigationActions');
  },
  get StackActions() {
    return require('./routers/StackActions');
  },
  get SwitchActions() {
    return require('./routers/SwitchActions');
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
    return require('./routers/pathUtils');
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
