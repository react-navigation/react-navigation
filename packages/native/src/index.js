/* eslint global-require: 0 */

module.exports = {
  get createNavigationContainer() {
    return require('./createNavigationContainer').default;
  },
  get createKeyboardAwareNavigator() {
    return require('./createKeyboardAwareNavigator').default;
  },

  get ResourceSavingSceneView() {
    return require('./ResourceSavingSceneView').default;
  },

  get withOrientation() {
    return require('./withOrientation').default;
  },
};
