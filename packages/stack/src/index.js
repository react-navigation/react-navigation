/* eslint-disable import/no-commonjs */
import { Platform } from 'react-native';

module.exports = {
  /**
   * Navigators
   */
  get createStackNavigator() {
    return require('./navigators/createStackNavigator').default;
  },

  /**
   * Views
   */
  get Assets() {
    return Platform.select({
      ios: [
        require('./views/assets/back-icon.png'),
        require('./views/assets/back-icon-mask.png'),
      ],
      default: [require('./views/assets/back-icon.png')],
    });
  },
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
  get StackGestureContext() {
    return require('./utils/StackGestureContext').default;
  },
};
