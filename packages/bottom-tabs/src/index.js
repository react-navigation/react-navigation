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
  get createMaterialBottomTabNavigator() {
    return require('./navigators/createMaterialBottomTabNavigator').default;
  },

  /**
   * Views
   */
  get MaterialTopTabBar() {
    return require('./views/MaterialTopTabBar').default;
  },
  get BottomTabBar() {
    return require('./views/BottomTabBar').default;
  },
};
