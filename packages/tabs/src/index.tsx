/**
 * Navigators
 */
export {
  default as createBottomTabNavigator,
} from './navigators/createBottomTabNavigator';
export {
  default as createMaterialTopTabNavigator,
} from './navigators/createMaterialTopTabNavigator';

/**
 * Views
 */
export { default as BottomTabBar } from './views/BottomTabBar';
export { default as MaterialTopTabBar } from './views/MaterialTopTabBar';

/**
 * Utils
 */
export { default as createTabNavigator } from './utils/createTabNavigator';

/**
 * Types
 */
export {
  BottomTabBarProps,
  NavigationTabState,
  NavigationTabProp,
  NavigationTabScreenProps,
  NavigationBottomTabOptions,
  NavigationMaterialTabOptions,
  NavigationBottomTabScreenComponent,
  NavigationMaterialTabScreenComponent,
} from './types';
