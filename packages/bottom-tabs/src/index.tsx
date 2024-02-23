import * as SceneStyleInterpolator from './TransitionConfigs/SceneStyleInterpolators';
import * as TransitionPresets from './TransitionConfigs/TransitionPresets';
import * as TransitionSpecs from './TransitionConfigs/TransitionSpecs';

/**
 * Transition Presets
 */
export { SceneStyleInterpolator, TransitionPresets, TransitionSpecs };

/**
 * Navigators
 */
export { createBottomTabNavigator } from './navigators/createBottomTabNavigator';

/**
 * Views
 */
export { BottomTabBar } from './views/BottomTabBar';
export { BottomTabView } from './views/BottomTabView';

/**
 * Utilities
 */
export { BottomTabBarHeightCallbackContext } from './utils/BottomTabBarHeightCallbackContext';
export { BottomTabBarHeightContext } from './utils/BottomTabBarHeightContext';
export { useBottomTabBarHeight } from './utils/useBottomTabBarHeight';

/**
 * Types
 */
export type {
  BottomTabBarButtonProps,
  BottomTabBarProps,
  BottomTabHeaderProps,
  BottomTabNavigationEventMap,
  BottomTabNavigationOptions,
  BottomTabNavigationProp,
  BottomTabScreenProps,
} from './types';
