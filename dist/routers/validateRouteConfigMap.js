Object.defineProperty(exports, '__esModule', { value: true });
var _invariant = require('../utils/invariant');
var _invariant2 = _interopRequireDefault(_invariant);
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
function validateRouteConfigMap(routeConfigs) {
  var routeNames = Object.keys(routeConfigs);
  (0, _invariant2.default)(
    routeNames.length > 0,
    'Please specify at least one route when configuring a navigator.'
  );
  routeNames.forEach(function(routeName) {
    var routeConfig = routeConfigs[routeName];
    if (!routeConfig.screen && !routeConfig.getScreen) {
      throw new Error(
        "Route '" +
          routeName +
          "' should declare a screen. " +
          'For example:\n\n' +
          "import MyScreen from './MyScreen';\n" +
          '...\n' +
          (routeName + ': {\n') +
          '  screen: MyScreen,\n' +
          '}'
      );
    } else if (routeConfig.screen && routeConfig.getScreen) {
      throw new Error(
        "Route '" +
          routeName +
          "' should declare a screen or " +
          'a getScreen, not both.'
      );
    }
    if (
      routeConfig.screen &&
      typeof routeConfig.screen !== 'function' &&
      typeof routeConfig.screen !== 'string'
    ) {
      throw new Error(
        "The component for route '" +
          routeName +
          "' must be a " +
          'React component. For example:\n\n' +
          "import MyScreen from './MyScreen';\n" +
          '...\n' +
          (routeName + ': {\n') +
          '  screen: MyScreen,\n' +
          '}\n\n' +
          'You can also use a navigator:\n\n' +
          "import MyNavigator from './MyNavigator';\n" +
          '...\n' +
          (routeName + ': {\n') +
          '  screen: MyNavigator,\n' +
          '}'
      );
    }
  });
}
exports.default = validateRouteConfigMap;
