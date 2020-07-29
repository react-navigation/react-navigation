/**
 * Navigators
 */
export { default as createBottomTabNavigator } from './navigators/createBottomTabNavigator';

/**
 * Views
 */
export { default as BottomTabView } from './views/BottomTabView';
export { default as BottomTabBar } from './views/BottomTabBar';

/**
 * Types
 */
export type {
  BottomTabNavigationOptions,
  BottomTabNavigationProp,
  BottomTabScreenProps,
  BottomTabBarProps,
  BottomTabBarOptions,
  BottomTabBarButtonProps,
} from './types';
