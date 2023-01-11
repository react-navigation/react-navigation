import {
  createComponentForStaticNavigation,
  createPathConfigForStaticNavigation,
  ParamListBase,
  StaticNavigation,
} from '@react-navigation/core';
import * as React from 'react';

import NavigationContainer from './NavigationContainer';
import type { LinkingOptions } from './types';

type Props = Omit<
  React.ComponentProps<typeof NavigationContainer>,
  'linking' | 'children'
> & {
  linking?: Omit<LinkingOptions<ParamListBase>, 'config'>;
};

export default function createStaticNavigation(
  tree: StaticNavigation<any, any>
) {
  const Component = createComponentForStaticNavigation(tree);
  const linkingConfig = {
    screens: tree.config.screens
      ? createPathConfigForStaticNavigation(tree.config.screens)
      : {},
  };

  return function Navigation({ linking, ...rest }: Props) {
    return (
      <NavigationContainer
        {...rest}
        linking={linking ? { ...linking, config: linkingConfig } : undefined}
      >
        <Component />
      </NavigationContainer>
    );
  };
}
