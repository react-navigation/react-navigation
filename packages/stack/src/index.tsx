import * as CardStyleInterpolators from './vendor/TransitionConfigs/CardStyleInterpolators';
import * as HeaderStyleInterpolators from './vendor/TransitionConfigs/HeaderStyleInterpolators';
import * as TransitionSpecs from './vendor/TransitionConfigs/TransitionSpecs';
import * as TransitionPresets from './vendor/TransitionConfigs/TransitionPresets';

/**
 * Navigators
 */
export { default as createStackNavigator } from './navigators/createStackNavigator';

export const Assets = [
  // eslint-disable-next-line import/no-commonjs
  require('./vendor/views/assets/back-icon.png'),
  // eslint-disable-next-line import/no-commonjs
  require('./vendor/views/assets/back-icon-mask.png'),
];

/**
 * Views
 */
export { default as StackView } from './views/StackView';
export { default as Header } from './vendor/views/Header/Header';
export { default as HeaderTitle } from './vendor/views/Header/HeaderTitle';
export { default as HeaderBackButton } from './vendor/views/Header/HeaderBackButton';

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
export { default as StackGestureContext } from './vendor/utils/StackGestureContext';
export { default as StackCardAnimationContext } from './vendor/utils/StackCardAnimationContext';

/**
 * Types
 */
export {
  NavigationStackState,
  StackNavigationProp as NavigationStackProp,
  StackNavigationOptions as NavigationStackOptions,
  StackNavigationConfig as NavigationStackConfig,
  StackHeaderProps,
  StackHeaderLeftButtonProps,
  StackHeaderTitleProps,
  TransitionPreset,
  StackCardStyleInterpolator,
  StackHeaderStyleInterpolator,
} from './vendor/types';

export {
  NavigationStackScreenComponent,
  NavigationStackScreenProps,
} from './types';
