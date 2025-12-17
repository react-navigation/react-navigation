import * as SceneStyleInterpolators from './TransitionConfigs/SceneStyleInterpolators';
import * as TransitionPresets from './TransitionConfigs/TransitionPresets';
import * as TransitionSpecs from './TransitionConfigs/TransitionSpecs';

/**
 * Transition Presets
 */
export { SceneStyleInterpolators, TransitionPresets, TransitionSpecs };

/**
 * Navigators
 */
export {
  createBottomTabNavigator,
  createBottomTabScreen,
} from './navigators/createBottomTabNavigator';

/**
 * Views
 */
export { BottomTabBar } from './views/BottomTabBar';
export { BottomTabView } from './views/BottomTabViewCommon';

/**
 * Utilities
 */
export { BottomTabBarHeightCallbackContext } from './utils/BottomTabBarHeightCallbackContext';
export { BottomTabBarHeightContext } from './utils/BottomTabBarHeightContext';
export { useBottomTabAnimation } from './utils/useBottomTabAnimation';
export { useBottomTabBarHeight } from './utils/useBottomTabBarHeight';

/**
 * Types
 */
export type {
  BottomTabBarButtonProps,
  BottomTabBarProps,
  BottomTabHeaderProps,
  BottomTabIcon,
  BottomTabNavigationEventMap,
  BottomTabNavigationOptions,
  BottomTabNavigationProp,
  BottomTabNavigatorProps,
  BottomTabOptionsArgs,
  BottomTabScreenProps,
} from './types';
