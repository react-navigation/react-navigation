/**
 * Navigators
 */
export { default as createBottomTabNavigator } from './navigators/createBottomTabNavigator';

/**
 * Views
 */
export { default as BottomTabBar } from './views/BottomTabBar';
export { default as BottomTabView } from './views/BottomTabView';

/**
 * Utilities
 */
export { default as BottomTabBarHeightContext } from './utils/BottomTabBarHeightContext';
export { default as useBottomTabBarHeight } from './utils/useBottomTabBarHeight';

/**
 * Types
 */
export type {
  BottomTabBarButtonProps,
  BottomTabBarProps,
  BottomTabNavigationOptions,
  BottomTabNavigationProp,
  BottomTabScreenProps,
} from './types';
