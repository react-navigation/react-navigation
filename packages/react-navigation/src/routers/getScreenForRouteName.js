/* @flow */

import invariant from 'fbjs/lib/invariant';

import type { NavigationRouteConfigMap } from '../TypeDefinition';

/**
 * Simple helper that gets a single screen (React component or navigator)
 * out of the navigator config.
 */
export default function getScreenForRouteName(
  routeConfigs: NavigationRouteConfigMap,
  routeName: string,
) {
  const routeConfig = routeConfigs[routeName];

  invariant(
    routeConfig,
    `There is no route defined for key ${routeName}.\n` +
    `Must be one of: ${Object.keys(routeConfigs).map(a => `'${a}'`).join(',')}`
  );

  if (routeConfig.screen) {
    return routeConfig.screen;
  }

  if (routeConfig.getScreen) {
    const screen = routeConfig.getScreen();
    invariant(
      typeof screen === 'function',
      `The getScreen defined for route '${routeName} didn't return a valid ` +
      `screen or navigator.\n\n` +
      'Please pass it like this:\n' +
      `${routeName}: {\n  getScreen: () => require('./MyScreen').default\n}`
    );
    return screen;
  }

  invariant(false, `Route ${routeName} must define a screen or a getScreen.`);
}
