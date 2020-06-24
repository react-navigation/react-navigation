import * as React from 'react';
import validateDeprecatedOptions from '../utils/validateDeprecatedOptions';
import validateDeprecatedConfig from '../utils/validateDeprecatedConfig';
import StackViewBase from '../vendor/views/Stack/StackView';
import type {
  StackNavigationHelpers,
  StackNavigationConfig,
  StackDescriptorMap,
} from '../vendor/types';

type Props = {
  navigation: StackNavigationHelpers;
  descriptors: StackDescriptorMap;
  navigationConfig: StackNavigationConfig;
  screenProps: unknown;
};

export default function StackView({
  navigation,
  descriptors: originalDescriptors,
  navigationConfig,
  ...rest
}: Props) {
  const descriptors = Object.keys(originalDescriptors).reduce<
    StackDescriptorMap
  >((acc, key) => {
    const options = validateDeprecatedConfig(
      navigationConfig,
      validateDeprecatedOptions(originalDescriptors[key].options)
    );

    acc[key] = {
      ...originalDescriptors[key],
      options,
    };

    return acc;
  }, {});

  return (
    <StackViewBase
      state={navigation.state}
      descriptors={descriptors}
      navigation={navigation}
      {...navigationConfig}
      {...rest}
    />
  );
}
