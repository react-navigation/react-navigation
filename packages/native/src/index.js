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

  get createNavigationFactory() {
    return require('./throwIfWrongVersion').default;
  },
  get useNavigationBuilder() {
    return require('./throwIfWrongVersion').default;
  },
  get useNavigation() {
    return require('./throwIfWrongVersion').default;
  },
  get useRoute() {
    return require('./throwIfWrongVersion').default;
  },
  get useFocusEffect() {
    return require('./throwIfWrongVersion').default;
  },
  get useIsFocused() {
    return require('./throwIfWrongVersion').default;
  },
  get useNavigationState() {
    return require('./throwIfWrongVersion').default;
  },
  get NavigationContainer() {
    return require('./throwIfWrongVersion').default;
  },
};
