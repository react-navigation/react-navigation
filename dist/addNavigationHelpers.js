Object.defineProperty(exports, '__esModule', { value: true });
var _extends =
  Object.assign ||
  function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
exports.default = function(navigation) {
  return _extends({}, navigation, {
    goBack: function goBack(key) {
      var actualizedKey = key;
      if (key === undefined && navigation.state.key) {
        (0, _invariant2.default)(
          typeof navigation.state.key === 'string',
          'key should be a string'
        );
        actualizedKey = navigation.state.key;
      }
      return navigation.dispatch(
        _NavigationActions2.default.back({ key: actualizedKey })
      );
    },
    navigate: function navigate(navigateTo, params, action) {
      if (typeof navigateTo === 'string') {
        return navigation.dispatch(
          _NavigationActions2.default.navigate({
            routeName: navigateTo,
            params: params,
            action: action,
          })
        );
      }
      (0, _invariant2.default)(
        typeof navigateTo === 'object',
        'Must navigateTo an object or a string'
      );
      (0, _invariant2.default)(
        params == null,
        'Params must not be provided to .navigate() when specifying an object'
      );
      (0, _invariant2.default)(
        action == null,
        'Child action must not be provided to .navigate() when specifying an object'
      );
      return navigation.dispatch(
        _NavigationActions2.default.navigate(navigateTo)
      );
    },
    pop: function pop(n, params) {
      return navigation.dispatch(
        _NavigationActions2.default.pop({
          n: n,
          immediate: params && params.immediate,
        })
      );
    },
    popToTop: function popToTop(params) {
      return navigation.dispatch(
        _NavigationActions2.default.popToTop({
          immediate: params && params.immediate,
        })
      );
    },
    setParams: function setParams(params) {
      (0, _invariant2.default)(
        navigation.state.key && typeof navigation.state.key === 'string',
        'setParams cannot be called by root navigator'
      );
      var key = navigation.state.key;
      return navigation.dispatch(
        _NavigationActions2.default.setParams({ params: params, key: key })
      );
    },
    push: function push(routeName, params, action) {
      return navigation.dispatch(
        _NavigationActions2.default.push({
          routeName: routeName,
          params: params,
          action: action,
        })
      );
    },
  });
};
var _NavigationActions = require('./NavigationActions');
var _NavigationActions2 = _interopRequireDefault(_NavigationActions);
var _invariant = require('./utils/invariant');
var _invariant2 = _interopRequireDefault(_invariant);
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
