import { StyleProp, ViewStyle } from 'react-native';
import { StackNavigationOptions, StackNavigationConfig } from '../vendor/types';

type Validation = {
  message: string;
  compat?: (
    c: Record<string, any>,
    o: StackNavigationOptions
  ) => StackNavigationOptions;
};

const shownWarnings: string[] = [];

const validations: Record<string, Validation> = {
  transparentCard: {
    message: `'transparentCard' is removed in favor of 'cardStyle: { backgroundColor: 'transparent' }' in 'navigationOptions'. Specify it in 'defaultNavigationOptions' to keep the same behaviour.`,
    compat: (c, o) =>
      c.transparentCard
        ? {
            ...o,
            cardStyle: [
              { backgroundColor: 'transparent' },
              o.cardStyle,
            ] as StyleProp<ViewStyle>,
          }
        : o,
  },
  headerLayoutPreset: {
    message: `'headerLayoutPreset' is renamed to 'headerTitleAlign' and moved to 'navigationOptions'. Specify it in 'defaultNavigationOptions' to keep the same behaviour.`,
    compat: (c, o) => ({ ...o, headerTitleAlign: c.headerLayoutPreset }),
  },
  headerTransitionPreset: {
    message: `'headerTransitionPreset' is removed in favor of the new animation APIs`,
  },
  transitionConfig: {
    message: `'transitionConfig' is removed in favor of the new animation APIs`,
  },
  ...[
    'cardShadowEnabled',
    'cardOverlayEnabled',
    'cardStyle',
    'headerBackTitleVisible',
    'onTransitionStart',
    'onTransitionEnd',
  ].reduce<Record<string, Validation>>((acc, name) => {
    acc[name] = {
      message: `'${name}' is moved to 'navigationOptions'. Specify it in 'defaultNavigationOptions' to keep the same behaviour.`,
      compat: (c, o) => ({ ...o, [name]: () => c[name] }),
    };

    return acc;
  }, {}),
};

export default function validateDeprecatedConfig(
  config: StackNavigationConfig,
  options: StackNavigationOptions
) {
  let result = options;

  Object.keys(validations).forEach((name) => {
    if (name in config) {
      const { compat, message } = validations[name];

      result = compat ? compat(config, result) : result;

      if (process.env.NODE_ENV !== 'production') {
        if (shownWarnings.includes(message)) {
          return;
        }

        console.warn(`Deprecation in 'createStackNavigator':\n${message}`);
        shownWarnings.push(message);
      }
    }
  });

  return result;
}
