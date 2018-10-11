import invariant from '../utils/invariant';

import getScreenForRouteName from './getScreenForRouteName';
import validateScreenOptions from './validateScreenOptions';

function applyConfig(configurer, navigationOptions, configProps) {
  if (typeof configurer === 'function') {
    return {
      ...navigationOptions,
      ...configurer({
        ...configProps,
        navigationOptions,
      }),
    };
  }
  if (typeof configurer === 'object') {
    return {
      ...navigationOptions,
      ...configurer,
    };
  }
  return navigationOptions;
}

export default (routeConfigs, navigatorScreenConfig) => (
  navigation,
  screenProps
) => {
  const { state } = navigation;
  const route = state;

  invariant(
    route.routeName && typeof route.routeName === 'string',
    'Cannot get config because the route does not have a routeName.'
  );

  const Component = getScreenForRouteName(routeConfigs, route.routeName);

  const routeConfig = routeConfigs[route.routeName];

  const routeScreenConfig =
    routeConfig === Component ? null : routeConfig.navigationOptions;
  const componentScreenConfig = Component.navigationOptions;

  const configOptions = { navigation, screenProps: screenProps || {} };

  let outputConfig = applyConfig(navigatorScreenConfig, {}, configOptions);
  outputConfig = applyConfig(
    componentScreenConfig,
    outputConfig,
    configOptions
  );
  outputConfig = applyConfig(routeScreenConfig, outputConfig, configOptions);

  validateScreenOptions(outputConfig, route);

  return outputConfig;
};
