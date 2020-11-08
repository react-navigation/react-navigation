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
 * Utilities
 */
export { default as BottomTabBarHeightContext } from './utils/BottomTabBarHeightContext';

export { default as useBottomTabBarHeight } from './utils/useBottomTabBarHeight';

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
