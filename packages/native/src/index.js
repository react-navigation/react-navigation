/* eslint-disable import/no-commonjs */

module.exports = {
  get createAppContainer() {
    return require('./createAppContainer').default;
  },

  get createKeyboardAwareNavigator() {
    return require('./createKeyboardAwareNavigator').default;
  },

  get createNavigationAwareScrollable() {
    return require('./createNavigationAwareScrollable').default;
  },

  get withOrientation() {
    return require('./withOrientation').default;
  },

  get ResourceSavingSceneView() {
    return require('./ResourceSavingSceneView').default;
  },

  get SafeAreaView() {
    return require('react-native-safe-area-view').default;
  },

  get ScrollView() {
    return require('./Scrollables').ScrollView;
  },

  get FlatList() {
    return require('./Scrollables').FlatList;
  },

  get SectionList() {
    return require('./Scrollables').SectionList;
  },
  get Themed() {
    return require('./Themed').default;
  },
};
