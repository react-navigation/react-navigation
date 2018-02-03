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
var _invariant = require('../utils/invariant');
var _invariant2 = _interopRequireDefault(_invariant);
var _getScreenForRouteName = require('./getScreenForRouteName');
var _getScreenForRouteName2 = _interopRequireDefault(_getScreenForRouteName);
var _createConfigGetter = require('./createConfigGetter');
var _createConfigGetter2 = _interopRequireDefault(_createConfigGetter);
var _NavigationActions = require('../NavigationActions');
var _NavigationActions2 = _interopRequireDefault(_NavigationActions);
var _validateRouteConfigMap = require('./validateRouteConfigMap');
var _validateRouteConfigMap2 = _interopRequireDefault(_validateRouteConfigMap);
var _getScreenConfigDeprecated = require('./getScreenConfigDeprecated');
var _getScreenConfigDeprecated2 = _interopRequireDefault(
  _getScreenConfigDeprecated
);
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
exports.default = function(routeConfigs) {
  var config =
    arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  (0, _validateRouteConfigMap2.default)(routeConfigs);
  var order = config.order || Object.keys(routeConfigs);
  var paths = config.paths || {};
  var initialRouteParams = config.initialRouteParams;
  var initialRouteName = config.initialRouteName || order[0];
  var initialRouteIndex = order.indexOf(initialRouteName);
  var backBehavior = config.backBehavior || 'initialRoute';
  var shouldBackNavigateToInitialRoute = backBehavior === 'initialRoute';
  var tabRouters = {};
  order.forEach(function(routeName) {
    var routeConfig = routeConfigs[routeName];
    paths[routeName] =
      typeof routeConfig.path === 'string' ? routeConfig.path : routeName;
    tabRouters[routeName] = null;
    if (routeConfig.screen && routeConfig.screen.router) {
      tabRouters[routeName] = routeConfig.screen.router;
    }
  });
  if (initialRouteIndex === -1) {
    throw new Error(
      "Invalid initialRouteName '" +
        initialRouteName +
        "' for TabRouter. " +
        ('Should be one of ' +
          order
            .map(function(n) {
              return '"' + n + '"';
            })
            .join(', '))
    );
  }
  return {
    getStateForAction: function getStateForAction(action, inputState) {
      var state = inputState;
      if (!state) {
        var _routes = order.map(function(routeName) {
          var params =
            routeName === initialRouteName ? initialRouteParams : undefined;
          var tabRouter = tabRouters[routeName];
          if (tabRouter) {
            var childAction = _NavigationActions2.default.init();
            return _extends({}, tabRouter.getStateForAction(childAction), {
              key: routeName,
              routeName: routeName,
              params: params,
            });
          }
          return { key: routeName, routeName: routeName, params: params };
        });
        state = {
          routes: _routes,
          index: initialRouteIndex,
          isTransitioning: false,
        };
      }
      if (action.type === _NavigationActions2.default.INIT) {
        var params = action.params;
        if (params) {
          state.routes = state.routes.map(function(route) {
            return _extends({}, route, {
              params: _extends(
                {},
                route.params,
                params,
                route.routeName === initialRouteName ? initialRouteParams : null
              ),
            });
          });
        }
      }
      var activeTabLastState = state.routes[state.index];
      var activeTabRouter = tabRouters[order[state.index]];
      if (activeTabRouter) {
        var activeTabState = activeTabRouter.getStateForAction(
          action,
          activeTabLastState
        );
        if (!activeTabState && inputState) {
          return null;
        }
        if (activeTabState && activeTabState !== activeTabLastState) {
          var _routes2 = [].concat(_toConsumableArray(state.routes));
          _routes2[state.index] = activeTabState;
          return _extends({}, state, { routes: _routes2 });
        }
      }
      var activeTabIndex = state.index;
      var isBackEligible =
        action.key == null || action.key === activeTabLastState.key;
      if (action.type === _NavigationActions2.default.BACK) {
        if (isBackEligible && shouldBackNavigateToInitialRoute) {
          activeTabIndex = initialRouteIndex;
        } else {
          return state;
        }
      }
      var didNavigate = false;
      if (action.type === _NavigationActions2.default.NAVIGATE) {
        var navigateAction = action;
        didNavigate = !!order.find(function(tabId, i) {
          if (tabId === navigateAction.routeName) {
            activeTabIndex = i;
            return true;
          }
          return false;
        });
        if (didNavigate) {
          var childState = state.routes[activeTabIndex];
          var newChildState = void 0;
          var tabRouter = tabRouters[action.routeName];
          if (action.action) {
            newChildState = tabRouter
              ? tabRouter.getStateForAction(action.action, childState)
              : null;
          } else if (!tabRouter && action.params) {
            newChildState = _extends({}, childState, {
              params: _extends({}, childState.params || {}, action.params),
            });
          }
          if (newChildState && newChildState !== childState) {
            var _routes3 = [].concat(_toConsumableArray(state.routes));
            _routes3[activeTabIndex] = newChildState;
            return _extends({}, state, {
              routes: _routes3,
              index: activeTabIndex,
            });
          }
        }
      }
      if (action.type === _NavigationActions2.default.SET_PARAMS) {
        var key = action.key;
        var lastRoute = state.routes.find(function(route) {
          return route.key === key;
        });
        if (lastRoute) {
          var _params = _extends({}, lastRoute.params, action.params);
          var _routes4 = [].concat(_toConsumableArray(state.routes));
          _routes4[state.routes.indexOf(lastRoute)] = _extends({}, lastRoute, {
            params: _params,
          });
          return _extends({}, state, { routes: _routes4 });
        }
      }
      if (activeTabIndex !== state.index) {
        return _extends({}, state, { index: activeTabIndex });
      } else if (didNavigate && !inputState) {
        return state;
      } else if (didNavigate) {
        return null;
      }
      var index = state.index;
      var routes = state.routes;
      order.find(function(tabId, i) {
        var tabRouter = tabRouters[tabId];
        if (i === index) {
          return false;
        }
        var tabState = routes[i];
        if (tabRouter) {
          tabState = tabRouter.getStateForAction(action, tabState);
        }
        if (!tabState) {
          index = i;
          return true;
        }
        if (tabState !== routes[i]) {
          routes = [].concat(_toConsumableArray(routes));
          routes[i] = tabState;
          index = i;
          return true;
        }
        return false;
      });
      index =
        action.type === _NavigationActions2.default.SET_PARAMS
          ? state.index
          : index;
      if (index !== state.index || routes !== state.routes) {
        return _extends({}, state, { index: index, routes: routes });
      }
      return state;
    },
    getComponentForState: function getComponentForState(state) {
      var routeName = order[state.index];
      (0, _invariant2.default)(
        routeName,
        'There is no route defined for index ' +
          state.index +
          '. Check that\n        that you passed in a navigation state with a valid tab/screen index.'
      );
      var childRouter = tabRouters[routeName];
      if (childRouter) {
        return childRouter.getComponentForState(state.routes[state.index]);
      }
      return (0, _getScreenForRouteName2.default)(routeConfigs, routeName);
    },
    getComponentForRouteName: function getComponentForRouteName(routeName) {
      return (0, _getScreenForRouteName2.default)(routeConfigs, routeName);
    },
    getPathAndParamsForState: function getPathAndParamsForState(state) {
      var route = state.routes[state.index];
      var routeName = order[state.index];
      var subPath = paths[routeName];
      var screen = (0, _getScreenForRouteName2.default)(
        routeConfigs,
        routeName
      );
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
      path,
      params
    ) {
      return (
        order
          .map(function(tabId) {
            var parts = path.split('/');
            var pathToTest = paths[tabId];
            if (parts[0] === pathToTest) {
              var tabRouter = tabRouters[tabId];
              var action = _NavigationActions2.default.navigate({
                routeName: tabId,
              });
              if (tabRouter && tabRouter.getActionForPathAndParams) {
                action.action = tabRouter.getActionForPathAndParams(
                  parts.slice(1).join('/'),
                  params
                );
              } else if (params) {
                action.params = params;
              }
              return action;
            }
            return null;
          })
          .find(function(action) {
            return !!action;
          }) ||
        order
          .map(function(tabId) {
            var tabRouter = tabRouters[tabId];
            return (
              tabRouter && tabRouter.getActionForPathAndParams(path, params)
            );
          })
          .find(function(action) {
            return !!action;
          }) ||
        null
      );
    },
    getScreenOptions: (0, _createConfigGetter2.default)(
      routeConfigs,
      config.navigationOptions
    ),
    getScreenConfig: _getScreenConfigDeprecated2.default,
  };
};
