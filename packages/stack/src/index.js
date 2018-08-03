/* eslint-disable import/no-commonjs */

module.exports = {
  /**
   * Navigators
   */
  get createStackNavigator() {
    return require('./navigators/createContainedStackNavigator').default;
  },
  // note(brentvatne): in the future this will be default export, when we require
  // people to add their own provider at root in 3.0
  get createUncontainedStackNavigator() {
    return require('./navigators/createStackNavigator').default;
  },

  /**
   * Router
   */
  get StackRouter() {
    return require('./routers/StackRouter').default;
  },
  get StackActions() {
    return require('./routers/StackActions').default;
  },

  /**
   * Views
   */
  get Header() {
    return require('./views/Header/Header').default;
  },
  get HeaderBackButton() {
    return require('./views/Header/HeaderBackButton').default;
  },
  get HeaderTitle() {
    return require('./views/Header/HeaderTitle').default;
  },
  get HeaderStyleInterpolator() {
    return require('./views/Header/HeaderStyleInterpolator').default;
  },
  get StackView() {
    return require('./views/StackView/StackView').default;
  },
  get StackViewCard() {
    return require('./views/StackView/StackViewCard').default;
  },
  get StackViewLayout() {
    return require('./views/StackView/StackViewLayout').default;
  },
  get StackViewStyleInterpolator() {
    return require('./views/StackView/StackViewStyleInterpolator').default;
  },
  get StackViewTransitionConfigs() {
    return require('./views/StackView/StackViewTransitionConfigs').default;
  },
  get createPointerEventsContainer() {
    return require('./views/StackView/createPointerEventsContainer').default;
  },
  get Transitioner() {
    return require('./views/Transitioner').default;
  },
  get ScenesReducer() {
    return require('./views/ScenesReducer').default;
  },
};
