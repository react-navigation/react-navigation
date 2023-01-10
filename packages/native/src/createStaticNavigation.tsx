import {
  createComponentForStaticNavigation,
  StaticNavigation,
} from '@react-navigation/core';
import * as React from 'react';

import NavigationContainer from './NavigationContainer';

type Props = Omit<
  React.ComponentProps<typeof NavigationContainer>,
  'linking' | 'children'
> & {
  linking?: {
    prefixes: string[];
    enabled?: boolean;
  };
};

export default function createStaticNavigation(
  tree: StaticNavigation<any, any>
) {
  const Component = createComponentForStaticNavigation(tree);

  return function Navigation({ linking, ...rest }: Props) {
    return (
      <NavigationContainer
        {...rest}
        linking={
          // TODO: get linking config from static tree
          linking
        }
      >
        <Component />
      </NavigationContainer>
    );
  };
}
