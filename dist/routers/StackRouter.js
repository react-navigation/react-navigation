Object.defineProperty(exports, '__esModule', { value: true });
var _slicedToArray = (function() {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;
    try {
      for (
        var _i = arr[
            typeof Symbol === 'function' ? Symbol.iterator : '@@iterator'
          ](),
          _s;
        !(_n = (_s = _i.next()).done);
        _n = true
      ) {
        _arr.push(_s.value);
        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i['return']) _i['return']();
      } finally {
        if (_d) throw _e;
      }
    }
    return _arr;
  }
  return function(arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (
      (typeof Symbol === 'function' ? Symbol.iterator : '@@iterator') in
      Object(arr)
    ) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError(
        'Invalid attempt to destructure non-iterable instance'
      );
    }
  };
})();
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
var _pathToRegexp = require('path-to-regexp');
var _pathToRegexp2 = _interopRequireDefault(_pathToRegexp);
var _NavigationActions = require('../NavigationActions');
var _NavigationActions2 = _interopRequireDefault(_NavigationActions);
var _createConfigGetter = require('./createConfigGetter');
var _createConfigGetter2 = _interopRequireDefault(_createConfigGetter);
var _getScreenForRouteName = require('./getScreenForRouteName');
var _getScreenForRouteName2 = _interopRequireDefault(_getScreenForRouteName);
var _StateUtils = require('../StateUtils');
var _StateUtils2 = _interopRequireDefault(_StateUtils);
var _validateRouteConfigMap = require('./validateRouteConfigMap');
var _validateRouteConfigMap2 = _interopRequireDefault(_validateRouteConfigMap);
var _getScreenConfigDeprecated = require('./getScreenConfigDeprecated');
var _getScreenConfigDeprecated2 = _interopRequireDefault(
  _getScreenConfigDeprecated
);
var _invariant = require('../utils/invariant');
var _invariant2 = _interopRequireDefault(_invariant);
var _KeyGenerator = require('./KeyGenerator');
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  } else {
    return Array.from(arr);
  }
}
function isEmpty(obj) {
  if (!obj) return true;
  for (var key in obj) {
    return false;
  }
  return true;
}
function behavesLikePushAction(action) {
  return (
    action.type === _NavigationActions2.default.NAVIGATE ||
    action.type === _NavigationActions2.default.PUSH
  );
}
exports.default = function(routeConfigs) {
  var stackConfig =
    arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  (0, _validateRouteConfigMap2.default)(routeConfigs);
  var childRouters = {};
  var routeNames = Object.keys(routeConfigs);
  routeNames.forEach(function(routeName) {
    var screen = (0, _getScreenForRouteName2.default)(routeConfigs, routeName);
    if (screen && screen.router) {
      childRouters[routeName] = screen.router;
    } else {
      childRouters[routeName] = null;
    }
  });
  var initialRouteParams = stackConfig.initialRouteParams;
  var initialRouteName = stackConfig.initialRouteName || routeNames[0];
  var initialChildRouter = childRouters[initialRouteName];
  var pathsByRouteNames = _extends({}, stackConfig.paths) || {};
  var paths = [];
  routeNames.forEach(function(routeName) {
    var pathPattern =
      pathsByRouteNames[routeName] || routeConfigs[routeName].path;
    var matchExact = !!pathPattern && !childRouters[routeName];
    if (pathPattern === undefined) {
      pathPattern = routeName;
    }
    var keys = [];
    var re = void 0,
      toPath = void 0,
      priority = void 0;
    if (typeof pathPattern === 'string') {
      re = (0, _pathToRegexp2.default)(pathPattern, keys);
      toPath = _pathToRegexp2.default.compile(pathPattern);
      priority = 0;
    } else {
      re = (0, _pathToRegexp2.default)('*', keys);
      toPath = function toPath() {
        return '';
      };
      matchExact = true;
      priority = -1;
    }
    if (!matchExact) {
      var wildcardRe = (0, _pathToRegexp2.default)(pathPattern + '/*', keys);
      re = new RegExp('(?:' + re.source + ')|(?:' + wildcardRe.source + ')');
    }
    pathsByRouteNames[routeName] = {
      re: re,
      keys: keys,
      toPath: toPath,
      priority: priority,
    };
  });
  paths = Object.entries(pathsByRouteNames);
  paths.sort(function(a, b) {
    return b[1].priority - a[1].priority;
  });
  return {
    getComponentForState: function getComponentForState(state) {
      var activeChildRoute = state.routes[state.index];
      var routeName = activeChildRoute.routeName;
      if (childRouters[routeName]) {
        return childRouters[routeName].getComponentForState(activeChildRoute);
      }
      return (0, _getScreenForRouteName2.default)(routeConfigs, routeName);
    },
    getComponentForRouteName: function getComponentForRouteName(routeName) {
      return (0, _getScreenForRouteName2.default)(routeConfigs, routeName);
    },
    getStateForAction: function getStateForAction(action, state) {
      if (!state) {
        var route = {};
        if (
          behavesLikePushAction(action) &&
          childRouters[action.routeName] !== undefined
        ) {
          return {
            isTransitioning: false,
            index: 0,
            routes: [
              {
                routeName: action.routeName,
                params: action.params,
                type: undefined,
                key: 'Init-' + (0, _KeyGenerator.generateKey)(),
              },
            ],
          };
        }
        if (initialChildRouter) {
          route = initialChildRouter.getStateForAction(
            _NavigationActions2.default.navigate({
              routeName: initialRouteName,
              params: initialRouteParams,
            })
          );
        }
        var params =
          (route.params || action.params || initialRouteParams) &&
          _extends(
            {},
            route.params || {},
            action.params || {},
            initialRouteParams || {}
          );
        route = _extends(
          {},
          route,
          {
            routeName: initialRouteName,
            key: 'Init-' + (0, _KeyGenerator.generateKey)(),
          },
          params ? { params: params } : {}
        );
        state = { isTransitioning: false, index: 0, routes: [route] };
      }
      if (
        action.type !== _NavigationActions2.default.RESET ||
        action.key !== null
      ) {
        var keyIndex = action.key
          ? _StateUtils2.default.indexOf(state, action.key)
          : -1;
        var childIndex = keyIndex >= 0 ? keyIndex : state.index;
        var childRoute = state.routes[childIndex];
        (0, _invariant2.default)(
          childRoute,
          'StateUtils erroneously thought index ' + childIndex + ' exists'
        );
        var childRouter = childRouters[childRoute.routeName];
        if (childRouter) {
          var _route = childRouter.getStateForAction(action, childRoute);
          if (_route === null) {
            return state;
          }
          if (_route && _route !== childRoute) {
            return _StateUtils2.default.replaceAt(
              state,
              childRoute.key,
              _route
            );
          }
        }
      }
      if (action.type === _NavigationActions2.default.POP_TO_TOP) {
        if (state.index !== 0) {
          return {
            isTransitioning: action.immediate !== true,
            index: 0,
            routes: [state.routes[0]],
          };
        }
        return state;
      }
      if (
        behavesLikePushAction(action) &&
        childRouters[action.routeName] !== undefined
      ) {
        var _childRouter = childRouters[action.routeName];
        var _route2 = void 0;
        (0, _invariant2.default)(
          action.type !== _NavigationActions2.default.PUSH ||
            action.key == null,
          'StackRouter does not support key on the push action'
        );
        if (action.key) {
          var lastRouteIndex = state.routes.findIndex(function(r) {
            return r.key === action.key;
          });
          if (lastRouteIndex !== -1) {
            if (state.index === lastRouteIndex && !action.params) {
              return state;
            }
            var routes = [].concat(_toConsumableArray(state.routes));
            if (action.params) {
              var _route3 = state.routes.find(function(r) {
                return r.key === action.key;
              });
              routes[lastRouteIndex] = _extends({}, _route3, {
                params: _extends({}, _route3.params, action.params),
              });
            }
            return _extends({}, state, {
              isTransitioning:
                state.index !== lastRouteIndex
                  ? action.immediate !== true
                  : undefined,
              index: lastRouteIndex,
              routes: routes,
            });
          }
        }
        var key = action.key || (0, _KeyGenerator.generateKey)();
        if (_childRouter) {
          var childAction =
            action.action ||
            _NavigationActions2.default.init({ params: action.params });
          _route2 = _extends(
            { params: action.params },
            _childRouter.getStateForAction(childAction),
            { key: key, routeName: action.routeName }
          );
        } else {
          _route2 = {
            params: action.params,
            key: key,
            routeName: action.routeName,
          };
        }
        return _extends({}, _StateUtils2.default.push(state, _route2), {
          isTransitioning: action.immediate !== true,
        });
      }
      if (
        action.type === _NavigationActions2.default.COMPLETE_TRANSITION &&
        state.isTransitioning
      ) {
        return _extends({}, state, { isTransitioning: false });
      }
      if (behavesLikePushAction(action)) {
        var childRouterNames = Object.keys(childRouters);
        for (var i = 0; i < childRouterNames.length; i++) {
          var childRouterName = childRouterNames[i];
          var _childRouter2 = childRouters[childRouterName];
          if (_childRouter2) {
            var initChildRoute = _childRouter2.getStateForAction(
              _NavigationActions2.default.init()
            );
            var navigatedChildRoute = _childRouter2.getStateForAction(
              action,
              initChildRoute
            );
            var routeToPush = null;
            if (navigatedChildRoute === null) {
              routeToPush = initChildRoute;
            } else if (navigatedChildRoute !== initChildRoute) {
              routeToPush = navigatedChildRoute;
            }
            if (routeToPush) {
              return _StateUtils2.default.push(
                state,
                _extends({}, routeToPush, {
                  key: (0, _KeyGenerator.generateKey)(),
                  routeName: childRouterName,
                })
              );
            }
          }
        }
      }
      if (action.type === _NavigationActions2.default.SET_PARAMS) {
        var _key = action.key;
        var lastRoute = state.routes.find(function(route) {
          return route.key === _key;
        });
        if (lastRoute) {
          var _params = _extends({}, lastRoute.params, action.params);
          var _routes = [].concat(_toConsumableArray(state.routes));
          _routes[state.routes.indexOf(lastRoute)] = _extends({}, lastRoute, {
            params: _params,
          });
          return _extends({}, state, { routes: _routes });
        }
      }
      if (action.type === _NavigationActions2.default.RESET) {
        if (action.key != null && action.key != state.key) {
          return state;
        }
        var resetAction = action;
        return _extends({}, state, {
          routes: resetAction.actions.map(function(childAction) {
            var router = childRouters[childAction.routeName];
            if (router) {
              return _extends(
                {},
                childAction,
                router.getStateForAction(childAction),
                {
                  routeName: childAction.routeName,
                  key: (0, _KeyGenerator.generateKey)(),
                }
              );
            }
            var route = _extends({}, childAction, {
              key: (0, _KeyGenerator.generateKey)(),
            });
            delete route.type;
            return route;
          }),
          index: action.index,
        });
      }
      if (
        action.type === _NavigationActions2.default.BACK ||
        action.type === _NavigationActions2.default.POP
      ) {
        var _key2 = action.key,
          n = action.n,
          immediate = action.immediate;
        var backRouteIndex = state.index;
        if (action.type === _NavigationActions2.default.POP && n != null) {
          backRouteIndex = Math.max(1, state.index - n + 1);
        } else if (_key2) {
          var backRoute = state.routes.find(function(route) {
            return route.key === _key2;
          });
          backRouteIndex = state.routes.indexOf(backRoute);
        }
        if (backRouteIndex > 0) {
          return _extends({}, state, {
            routes: state.routes.slice(0, backRouteIndex),
            index: backRouteIndex - 1,
            isTransitioning: immediate !== true,
          });
        }
      }
      return state;
    },
    getPathAndParamsForState: function getPathAndParamsForState(state) {
      var route = state.routes[state.index];
      var routeName = route.routeName;
      var screen = (0, _getScreenForRouteName2.default)(
        routeConfigs,
        routeName
      );
      var subPath = pathsByRouteNames[routeName].toPath(route.params);
      var path = subPath;
      var params = route.params;
      if (screen && screen.router) {
        var stateRoute = route;
        var child = screen.router.getPathAndParamsForState(stateRoute);
        path = subPath ? subPath + '/' + child.path : child.path;
        params = child.params ? _extends({}, params, child.params) : params;
      }
      return { path: path, params: params };
    },
    getActionForPathAndParams: function getActionForPathAndParams(
      pathToResolve,
      inputParams
    ) {
      if (!pathToResolve) {
        return _NavigationActions2.default.navigate({
          routeName: initialRouteName,
        });
      }
      var _pathToResolve$split = pathToResolve.split('?'),
        _pathToResolve$split2 = _slicedToArray(_pathToResolve$split, 2),
        pathNameToResolve = _pathToResolve$split2[0],
        queryString = _pathToResolve$split2[1];
      var matchedRouteName = void 0;
      var pathMatch = void 0;
      var pathMatchKeys = void 0;
      for (
        var _iterator = paths,
          _isArray = Array.isArray(_iterator),
          _i = 0,
          _iterator = _isArray
            ? _iterator
            : _iterator[
                typeof Symbol === 'function' ? Symbol.iterator : '@@iterator'
              ]();
        ;

      ) {
        var _ref3;
        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref3 = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref3 = _i.value;
        }
        var _ref = _ref3;
        var _ref2 = _slicedToArray(_ref, 2);
        var routeName = _ref2[0];
        var path = _ref2[1];
        var re = path.re,
          keys = path.keys;
        pathMatch = re.exec(pathNameToResolve);
        if (pathMatch && pathMatch.length) {
          pathMatchKeys = keys;
          matchedRouteName = routeName;
          break;
        }
      }
      if (!matchedRouteName) {
        if (!pathToResolve) {
          return _NavigationActions2.default.navigate({
            routeName: initialRouteName,
          });
        }
        return null;
      }
      var nestedAction = void 0;
      var nestedQueryString = queryString ? '?' + queryString : '';
      if (childRouters[matchedRouteName]) {
        nestedAction = childRouters[matchedRouteName].getActionForPathAndParams(
          pathMatch.slice(pathMatchKeys.length).join('/') + nestedQueryString
        );
        if (!nestedAction) {
          return null;
        }
      }
      var queryParams = !isEmpty(inputParams)
        ? inputParams
        : (queryString || '').split('&').reduce(function(result, item) {
            if (item !== '') {
              var nextResult = result || {};
              var _item$split = item.split('='),
                _item$split2 = _slicedToArray(_item$split, 2),
                key = _item$split2[0],
                value = _item$split2[1];
              nextResult[key] = value;
              return nextResult;
            }
            return result;
          }, null);
      var params = pathMatch.slice(1).reduce(function(result, matchResult, i) {
        var key = pathMatchKeys[i];
        if (key.asterisk || !key) {
          return result;
        }
        var nextResult = result || {};
        var paramName = key.name;
        nextResult[paramName] = matchResult;
        return nextResult;
      }, queryParams);
      return _NavigationActions2.default.navigate(
        _extends(
          { routeName: matchedRouteName },
          params ? { params: params } : {},
          nestedAction ? { action: nestedAction } : {}
        )
      );
    },
    getScreenOptions: (0, _createConfigGetter2.default)(
      routeConfigs,
      stackConfig.navigationOptions
    ),
    getScreenConfig: _getScreenConfigDeprecated2.default,
  };
};
