import {
  createComponentForStaticNavigation,
  createPathConfigForStaticNavigation,
  ParamListBase,
  StaticNavigation,
} from '@react-navigation/core';
import * as React from 'react';

import { NavigationContainer } from './NavigationContainer';
import type { LinkingOptions } from './types';

type Props = Omit<
  React.ComponentProps<typeof NavigationContainer>,
  'linking' | 'children'
> & {
  /**
   * Options for deep linking.
   */
  linking?: Omit<LinkingOptions<ParamListBase>, 'config'>;
};

/**
 * Create a navigation component from a static navigation config.
 * The returned component is a wrapper around `NavigationContainer`.
 *
 * @param tree Static navigation config.
 * @returns Navigation component to use in your app.
 */
export function createStaticNavigation(tree: StaticNavigation<any, any, any>) {
  const Component = createComponentForStaticNavigation(tree, 'RootNavigator');
  const linkingConfig = {
    screens: tree.config.screens
      ? createPathConfigForStaticNavigation(tree)
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
