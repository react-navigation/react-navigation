/* @flow */
/* eslint-disable import/no-commonjs */

module.exports = {
  /**
   * Navigators
   */
  get createBottomTabNavigator() {
    return require('./navigators/createBottomTabNavigator').default;
  },
  get createMaterialTopTabNavigator() {
    return require('./navigators/createMaterialTopTabNavigator').default;
  },

  /**
   * Views
   */
  get BottomTabBar() {
    return require('./views/BottomTabBar').default;
  },
  get MaterialTopTabBar() {
    return require('./views/MaterialTopTabBar').default;
  },

  /**
   * Utils
   */
  get createTabNavigator() {
    return require('./utils/createTabNavigator').default;
  },
};
