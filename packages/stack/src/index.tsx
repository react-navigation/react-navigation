import * as CardStyleInterpolators from './TransitionConfigs/CardStyleInterpolators';
import * as HeaderStyleInterpolators from './TransitionConfigs/HeaderStyleInterpolators';
import * as TransitionSpecs from './TransitionConfigs/TransitionSpecs';
import * as TransitionPresets from './TransitionConfigs/TransitionPresets';

/**
 * Navigators
 */
export { default as createStackNavigator } from './navigators/createStackNavigator';

/**
 * Views
 */
export { default as StackView } from './views/Stack/StackView';
export { default as Header } from './views/Header/Header';

/**
 * Transition presets
 */
export {
  CardStyleInterpolators,
  HeaderStyleInterpolators,
  TransitionSpecs,
  TransitionPresets,
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
  StackNavigationOptions,
  StackNavigationProp,
  StackScreenProps,
  StackHeaderProps,
  StackCardInterpolatedStyle,
  StackCardInterpolationProps,
  StackCardStyleInterpolator,
  StackHeaderInterpolatedStyle,
  StackHeaderInterpolationProps,
  StackHeaderStyleInterpolator,
  TransitionPreset,
} from './types';
