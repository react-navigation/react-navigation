/* @flow */
/* eslint-disable import/no-commonjs */

module.exports = {
  get createBottomTabNavigator() {
    return require('./navigators/createBottomTabNavigator').default;
  },
  get createMaterialTopTabNavigator() {
    return require('./navigators/createMaterialTopTabNavigator').default;
  },
  get createMaterialBottomTabNavigator() {
    return require('./navigators/createMaterialBottomTabNavigator').default;
  },
};
