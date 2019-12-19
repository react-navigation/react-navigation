import * as CardStyleInterpolators from './TransitionConfigs/CardStyleInterpolators';
import * as HeaderStyleInterpolators from './TransitionConfigs/HeaderStyleInterpolators';
import * as TransitionSpecs from './TransitionConfigs/TransitionSpecs';
import * as TransitionPresets from './TransitionConfigs/TransitionPresets';

/**
 * Navigators
 */
export { default as createStackNavigator } from './navigators/createStackNavigator';

export const Assets = [
  // eslint-disable-next-line import/no-commonjs
  require('./views/assets/back-icon.png'),
  // eslint-disable-next-line import/no-commonjs
  require('./views/assets/back-icon-mask.png'),
];

/**
 * Views
 */
export { default as StackView } from './views/Stack/StackView';
export { default as Header } from './views/Header/Header';
export { default as HeaderTitle } from './views/Header/HeaderTitle';
export { default as HeaderBackButton } from './views/Header/HeaderBackButton';

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
export { default as StackGestureContext } from './utils/StackGestureContext';
export { default as StackCardAnimationContext } from './utils/StackCardAnimationContext';

/**
 * Types
 */
export {
  StackNavigationOptions,
  StackNavigationProp,
  StackHeaderProps,
  StackHeaderLeftButtonProps,
  StackHeaderTitleProps,
  StackCardInterpolatedStyle,
  StackCardInterpolationProps,
  StackCardStyleInterpolator,
  StackHeaderInterpolatedStyle,
  StackHeaderInterpolationProps,
  StackHeaderStyleInterpolator,
} from './types';
