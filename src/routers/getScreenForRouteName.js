import { isValidElementType } from 'react-is';
import invariant from '../utils/invariant';

/**
 * Simple helper that gets a single screen (React component or navigator)
 * out of the navigator config.
 */
export default function getScreenForRouteName(routeConfigs, routeName) {
  const routeConfig = routeConfigs[routeName];

  if (!routeConfig) {
    throw new Error(
      `There is no route defined for key ${routeName}.\n` +
        `Must be one of: ${Object.keys(routeConfigs)
          .map(a => `'${a}'`)
          .join(',')}`
    );
  }

  if (routeConfig.screen) {
    return routeConfig.screen;
  }

  if (typeof routeConfig.getScreen === 'function') {
    const screen = routeConfig.getScreen();
    invariant(
      isValidElementType(screen),
      `The getScreen defined for route '${routeName} didn't return a valid ` +
        'screen or navigator.\n\n' +
        'Please pass it like this:\n' +
        `${routeName}: {\n  getScreen: () => require('./MyScreen').default\n}`
    );
    return screen;
  }

  return routeConfig;
}
