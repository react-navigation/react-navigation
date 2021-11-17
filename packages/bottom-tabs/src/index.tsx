/**
 * Navigators
 */
export { default as createBottomTabNavigator } from './navigators/createBottomTabNavigator';

/**
 * Views
 */
export { default as BottomTabBar } from './views/BottomTabBar';
export { default as BottomTabView } from './views/BottomTabView';
export { default as Badge } from './views/Badge';

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
  BottomTabHeaderProps,
  BottomTabNavigationOptions,
  BottomTabNavigationProp,
  BottomTabScreenProps,
} from './types';
