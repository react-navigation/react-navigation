import invariant from '../utils/invariant';

/**
 * Make sure the config passed e.g. to StackRouter, TabRouter has
 * the correct format, and throw a clear error if it doesn't.
 */
function validateRouteConfigMap(routeConfigs) {
  const routeNames = Object.keys(routeConfigs);
  invariant(
    routeNames.length > 0,
    'Please specify at least one route when configuring a navigator.'
  );

  routeNames.forEach(routeName => {
    const routeConfig = routeConfigs[routeName];
    const screenComponent = getScreenComponent(routeConfig);

    if (
      !screenComponent ||
      (typeof screenComponent !== 'function' &&
        typeof screenComponent !== 'string' &&
        !routeConfig.getScreen)
    ) {
      throw new Error(
        `The component for route '${routeName}' must be a ` +
          'React component. For example:\n\n' +
          "import MyScreen from './MyScreen';\n" +
          '...\n' +
          `${routeName}: MyScreen,\n` +
          '}\n\n' +
          'You can also use a navigator:\n\n' +
          "import MyNavigator from './MyNavigator';\n" +
          '...\n' +
          `${routeName}: MyNavigator,\n` +
          '}'
      );
    }

    if (routeConfig.screen && routeConfig.getScreen) {
      throw new Error(
        `Route '${routeName}' should declare a screen or ` +
          'a getScreen, not both.'
      );
    }
  });
}

function getScreenComponent(routeConfig) {
  if (!routeConfig) {
    return null;
  }

  return routeConfig.screen ? routeConfig.screen : routeConfig;
}

export default validateRouteConfigMap;
