/* eslint disable import/no-commonjs */

module.exports = {
  get createAppContainer() {
    return require('./createAppContainer').default;
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
