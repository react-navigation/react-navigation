export * from '@react-navigation/core';
export * from '@react-navigation/native';

// Export each item individually so that they can be evaluated lazily
// https://babeljs.io/docs/en/babel-plugin-transform-modules-commonjs#lazy
export {
  createNavigationContainer,
  createStackNavigator,
  createBottomTabNavigator,
  createMaterialTopTabNavigator,
  createDrawerNavigator,
  StackGestureContext,
  DrawerGestureContext,
  DrawerRouter,
  DrawerActions,
  Transitioner,
  StackView,
  StackViewCard,
  StackViewTransitionConfigs,
  Header,
  HeaderTitle,
  HeaderBackButton,
  HeaderStyleInterpolator,
  DrawerView,
  DrawerItems,
  DrawerSidebar,
  BottomTabBar,
  MaterialTopTabBar,
} from './deprecations';
