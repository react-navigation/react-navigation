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
  type BottomTabTypeBag,
  createBottomTabNavigator,
  createBottomTabScreen,
} from './navigators/createBottomTabNavigator';

/**
 * Views
 */
export { BottomTabBar } from './views/BottomTabBar';
export { BottomTabView } from './views/BottomTabView';

/**
 * Utilities
 */
export { TabBarLayoutCallbackContext } from './utils/TabBarLayoutCallbackContext';
export { TabBarLayoutContext } from './utils/TabBarLayoutContext';
export { useTabAnimation } from './utils/useTabAnimation';
export { useTabBarHeight } from './utils/useTabBarHeight';

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
  BottomTabNavigatorProps,
  BottomTabOptionsArgs,
  BottomTabScreenProps,
} from './types';
