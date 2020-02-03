/* eslint-disable getter-return, import/no-commonjs */

const throwError = (message, page) => {
  throw new Error(
    `${message}. See https://reactnavigation.org/docs/4.x/${page}.html for more details.`
  );
};

module.exports = {
  get createNavigationContainer() {
    throw new Error(
      '`createNavigationContainer()` has been removed. Use `createAppContainer()` instead. You can also import createAppContainer directly from `@react-navigation/native`.'
    );
  },

  get createStackNavigator() {
    throwError(
      '`createStackNavigator()` has been moved to `react-navigation-stack`',
      'stack-navigator'
    );
  },

  get createBottomTabNavigator() {
    throwError(
      '`createBottomTabNavigator()` has been moved to `react-navigation-tabs`',
      'bottom-tab-navigator'
    );
  },

  get createMaterialTopTabNavigator() {
    throwError(
      '`createMaterialTopTabNavigator()` has been moved to `react-navigation-tabs`',
      'material-top-tab-navigator'
    );
  },

  get createDrawerNavigator() {
    throwError(
      '`createDrawerNavigator()` has been moved to `react-navigation-drawer`',
      'drawer-navigator'
    );
  },

  // Gesture contexts

  get StackGestureContext() {
    throwError(
      '`StackGestureContext` has been moved to `react-navigation-stack`',
      'stack-navigator'
    );
  },

  get DrawerGestureContext() {
    throwError(
      '`DrawerGestureContext` has been moved to `react-navigation-drawer`',
      'stack-navigator'
    );
  },

  // Routers and Actions

  get DrawerRouter() {
    throwError(
      '`DrawerRouter` has been moved to `react-navigation-drawer`',
      'drawer-navigator'
    );
  },

  get DrawerActions() {
    throwError(
      '`DrawerActions` has been moved to `react-navigation-drawer`',
      'drawer-navigator'
    );
  },

  // Views
  get Transitioner() {
    throwError('`Transitioner` has been removed.', 'stack-navigator');
  },

  get StackView() {
    throwError('`StackView` has been removed', 'stack-navigator');
  },

  get StackViewCard() {
    throwError('`StackViewCard` has been removed', 'stack-navigator');
  },

  get StackViewTransitionConfigs() {
    throwError(
      '`StackViewTransitionConfigs` has been removed',
      'stack-navigator'
    );
  },

  // Header
  get Header() {
    throwError(
      '`Header` has been moved to `react-navigation-stack`',
      'stack-navigator'
    );
  },

  get HeaderTitle() {
    throwError(
      '`HeaderTitle` has been moved to `react-navigation-stack`',
      'stack-navigator'
    );
  },

  get HeaderBackButton() {
    throwError(
      '`HeaderBackButton` has been moved to `react-navigation-stack`',
      'stack-navigator'
    );
  },

  get HeaderStyleInterpolator() {
    throwError('`HeaderStyleInterpolator` has been removed', 'stack-navigator');
  },

  // DrawerView
  get DrawerView() {
    throwError(
      '`createStackNavigator()` has been moved to `react-navigation-drawer`',
      'stack-navigator'
    );
  },

  get DrawerItems() {
    throwError(
      '`DrawerItems` has been moved to `react-navigation-drawer`',
      'drawer-navigator'
    );
  },

  get DrawerSidebar() {
    throwError(
      '`DrawerSidebar` has been moved to `react-navigation-drawer`',
      'drawer-navigator'
    );
  },

  // Tabs
  get BottomTabBar() {
    throwError(
      '`BottomTabBar` has been moved to `react-navigation-tabs`',
      'bottom-tab-navigator'
    );
  },

  get MaterialTopTabBar() {
    throwError(
      '`MaterialTopTabBar` has been moved to `react-navigation-tabs`',
      'material-top-tab-navigator'
    );
  },
};
