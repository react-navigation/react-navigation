import * as CardStyleInterpolators from './TransitionConfigs/CardStyleInterpolators';
import * as HeaderStyleInterpolators from './TransitionConfigs/HeaderStyleInterpolators';
import * as TransitionPresets from './TransitionConfigs/TransitionPresets';
import * as TransitionSpecs from './TransitionConfigs/TransitionSpecs';

/**
 * Navigators
 */
export { default as createStackNavigator } from './navigators/createStackNavigator';

/**
 * Views
 */
export { default as Header } from './views/Header/Header';
export { default as StackView } from './views/Stack/StackView';

/**
 * Transition presets
 */
export {
  CardStyleInterpolators,
  HeaderStyleInterpolators,
  TransitionPresets,
  TransitionSpecs,
};

/**
 * Utilities
 */
export { default as CardAnimationContext } from './utils/CardAnimationContext';
export { default as GestureHandlerRefContext } from './utils/GestureHandlerRefContext';
export { default as useCardAnimation } from './utils/useCardAnimation';
export { default as useGestureHandlerRef } from './utils/useGestureHandlerRef';

/**
 * Types
 */
export type {
  StackCardInterpolatedStyle,
  StackCardInterpolationProps,
  StackCardStyleInterpolator,
  StackHeaderInterpolatedStyle,
  StackHeaderInterpolationProps,
  StackHeaderProps,
  StackHeaderStyleInterpolator,
  StackNavigationEventMap,
  StackNavigationOptions,
  StackNavigationProp,
  StackScreenProps,
  TransitionPreset,
} from './types';
