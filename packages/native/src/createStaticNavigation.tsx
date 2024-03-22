import {
  createComponentForStaticNavigation,
  createPathConfigForStaticNavigation,
  type NavigationContainerRef,
  type ParamListBase,
  type StaticNavigation,
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
  linking?: Omit<LinkingOptions<ParamListBase>, 'config'> & {
    /**
     * Configure automatic linking for the screens in the tree.
     * When 'auto' is specified, all leaf screens will automatically have a path.
     * The generated path will be a kebab-case version of the screen name.
     * This can be overridden for specific screens by specifying `linking` for the screen.
     */
    config?: 'auto';
  };
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

  function Navigation(
    { linking, ...rest }: Props,
    ref: React.Ref<NavigationContainerRef<ParamListBase>>
  ) {
    const screens = React.useMemo(() => {
      if (tree.config.screens) {
        return createPathConfigForStaticNavigation(
          tree,
          linking?.config === 'auto',
          true
        );
      }

      return undefined;
    }, [linking?.config]);

    if (linking?.enabled && screens == null) {
      throw new Error(
        'Linking is enabled but no linking configuration was found for the screens.\n\n' +
          'To solve this:\n' +
          "- Specify a 'linking' property for the screens you want to link to.\n" +
          "- Or set 'linking.config' to 'auto' to generate paths automatically.\n\n" +
          'See usage guide: https://reactnavigation.org/docs/7.x/static-configuration#linking'
      );
    }

    return (
      <NavigationContainer
        {...rest}
        ref={ref}
        linking={
          linking
            ? {
                ...linking,
                enabled:
                  typeof linking.enabled === 'boolean'
                    ? linking.enabled
                    : screens != null,
                config: screens ? { screens } : undefined,
              }
            : undefined
        }
      >
        <Component />
      </NavigationContainer>
    );
  }

  return React.forwardRef(Navigation);
}
