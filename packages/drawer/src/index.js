/* eslint-disable import/no-commonjs */

module.exports = {
  /**
   * Navigators
   */
  get createDrawerNavigator() {
    return require('./navigators/createDrawerNavigator').default;
  },

  /**
   * Router
   */
  get DrawerRouter() {
    return require('./routers/DrawerRouter').default;
  },
  get DrawerActions() {
    return require('./routers/DrawerActions').default;
  },

  /**
   * Views
   */
  get DrawerNavigatorItems() {
    return require('./views/DrawerNavigatorItems').default;
  },
  get DrawerSidebar() {
    return require('./views/DrawerSidebar').default;
  },
  get DrawerView() {
    return require('./views/DrawerView').default;
  },

  get DrawerGestureContext() {
    return require('./utils/DrawerGestureContext').default;
  },
};
