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
var _jsxFileName = 'src/routers/__tests__/TabRouter-test.js';
var _react = require('react');
var _react2 = _interopRequireDefault(_react);
var _TabRouter = require('../TabRouter');
var _TabRouter2 = _interopRequireDefault(_TabRouter);
var _StackRouter = require('../StackRouter');
var _StackRouter2 = _interopRequireDefault(_StackRouter);
var _NavigationActions = require('../../NavigationActions');
var _NavigationActions2 = _interopRequireDefault(_NavigationActions);
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
var INIT_ACTION = { type: _NavigationActions2.default.INIT };
var BareLeafRouteConfig = {
  screen: function screen() {
    return _react2.default.createElement('div', {
      __source: { fileName: _jsxFileName, lineNumber: 12 },
    });
  },
};
describe('TabRouter', function() {
  test('Handles basic tab logic', function() {
    var ScreenA = function ScreenA() {
      return _react2.default.createElement('div', {
        __source: { fileName: _jsxFileName, lineNumber: 17 },
      });
    };
    var ScreenB = function ScreenB() {
      return _react2.default.createElement('div', {
        __source: { fileName: _jsxFileName, lineNumber: 18 },
      });
    };
    var router = (0, _TabRouter2.default)({
      Foo: { screen: ScreenA },
      Bar: { screen: ScreenB },
    });
    var state = router.getStateForAction({
      type: _NavigationActions2.default.INIT,
    });
    var expectedState = {
      index: 0,
      routes: [
        { key: 'Foo', routeName: 'Foo' },
        { key: 'Bar', routeName: 'Bar' },
      ],
      isTransitioning: false,
    };
    expect(state).toEqual(expectedState);
    var state2 = router.getStateForAction(
      { type: _NavigationActions2.default.NAVIGATE, routeName: 'Bar' },
      state
    );
    var expectedState2 = {
      index: 1,
      routes: [
        { key: 'Foo', routeName: 'Foo' },
        { key: 'Bar', routeName: 'Bar' },
      ],
      isTransitioning: false,
    };
    expect(state2).toEqual(expectedState2);
    expect(router.getComponentForState(expectedState)).toEqual(ScreenA);
    expect(router.getComponentForState(expectedState2)).toEqual(ScreenB);
    var state3 = router.getStateForAction(
      { type: _NavigationActions2.default.NAVIGATE, routeName: 'Bar' },
      state2
    );
    expect(state3).toEqual(null);
  });
  test('Handles getScreen', function() {
    var ScreenA = function ScreenA() {
      return _react2.default.createElement('div', {
        __source: { fileName: _jsxFileName, lineNumber: 56 },
      });
    };
    var ScreenB = function ScreenB() {
      return _react2.default.createElement('div', {
        __source: { fileName: _jsxFileName, lineNumber: 57 },
      });
    };
    var router = (0, _TabRouter2.default)({
      Foo: {
        getScreen: function getScreen() {
          return ScreenA;
        },
      },
      Bar: {
        getScreen: function getScreen() {
          return ScreenB;
        },
      },
    });
    var state = router.getStateForAction({
      type: _NavigationActions2.default.INIT,
    });
    var expectedState = {
      index: 0,
      routes: [
        { key: 'Foo', routeName: 'Foo' },
        { key: 'Bar', routeName: 'Bar' },
      ],
      isTransitioning: false,
    };
    expect(state).toEqual(expectedState);
    var state2 = router.getStateForAction(
      { type: _NavigationActions2.default.NAVIGATE, routeName: 'Bar' },
      state
    );
    var expectedState2 = {
      index: 1,
      routes: [
        { key: 'Foo', routeName: 'Foo' },
        { key: 'Bar', routeName: 'Bar' },
      ],
      isTransitioning: false,
    };
    expect(state2).toEqual(expectedState2);
    expect(router.getComponentForState(expectedState)).toEqual(ScreenA);
    expect(router.getComponentForState(expectedState2)).toEqual(ScreenB);
    var state3 = router.getStateForAction(
      { type: _NavigationActions2.default.NAVIGATE, routeName: 'Bar' },
      state2
    );
    expect(state3).toEqual(null);
  });
  test('Can set the initial tab', function() {
    var router = (0, _TabRouter2.default)(
      { Foo: BareLeafRouteConfig, Bar: BareLeafRouteConfig },
      { initialRouteName: 'Bar' }
    );
    var state = router.getStateForAction({
      type: _NavigationActions2.default.INIT,
    });
    expect(state).toEqual({
      index: 1,
      routes: [
        { key: 'Foo', routeName: 'Foo' },
        { key: 'Bar', routeName: 'Bar' },
      ],
      isTransitioning: false,
    });
  });
  test('Can set the initial params', function() {
    var router = (0, _TabRouter2.default)(
      { Foo: BareLeafRouteConfig, Bar: BareLeafRouteConfig },
      { initialRouteName: 'Bar', initialRouteParams: { name: 'Qux' } }
    );
    var state = router.getStateForAction({
      type: _NavigationActions2.default.INIT,
    });
    expect(state).toEqual({
      index: 1,
      routes: [
        { key: 'Foo', routeName: 'Foo' },
        { key: 'Bar', routeName: 'Bar', params: { name: 'Qux' } },
      ],
      isTransitioning: false,
    });
  });
  test('Handles the SetParams action', function() {
    var router = (0, _TabRouter2.default)({
      Foo: {
        screen: function screen() {
          return _react2.default.createElement('div', {
            __source: { fileName: _jsxFileName, lineNumber: 129 },
          });
        },
      },
      Bar: {
        screen: function screen() {
          return _react2.default.createElement('div', {
            __source: { fileName: _jsxFileName, lineNumber: 132 },
          });
        },
      },
    });
    var state2 = router.getStateForAction({
      type: _NavigationActions2.default.SET_PARAMS,
      params: { name: 'Qux' },
      key: 'Foo',
    });
    expect(state2 && state2.routes[0].params).toEqual({ name: 'Qux' });
  });
  test('getStateForAction returns null when navigating to same tab', function() {
    var router = (0, _TabRouter2.default)(
      { Foo: BareLeafRouteConfig, Bar: BareLeafRouteConfig },
      { initialRouteName: 'Bar' }
    );
    var state = router.getStateForAction({
      type: _NavigationActions2.default.INIT,
    });
    var state2 = router.getStateForAction(
      { type: _NavigationActions2.default.NAVIGATE, routeName: 'Bar' },
      state
    );
    expect(state2).toEqual(null);
  });
  test('getStateForAction returns initial navigate', function() {
    var router = (0, _TabRouter2.default)({
      Foo: BareLeafRouteConfig,
      Bar: BareLeafRouteConfig,
    });
    var state = router.getStateForAction({
      type: _NavigationActions2.default.NAVIGATE,
      routeName: 'Foo',
    });
    expect(state && state.index).toEqual(0);
  });
  test('Handles nested tabs and nested actions', function() {
    var ChildTabNavigator = function ChildTabNavigator() {
      return _react2.default.createElement('div', {
        __source: { fileName: _jsxFileName, lineNumber: 169 },
      });
    };
    ChildTabNavigator.router = (0, _TabRouter2.default)({
      Foo: BareLeafRouteConfig,
      Bar: BareLeafRouteConfig,
    });
    var router = (0, _TabRouter2.default)({
      Foo: BareLeafRouteConfig,
      Baz: { screen: ChildTabNavigator },
      Boo: BareLeafRouteConfig,
    });
    var params = { foo: '42' };
    var action = router.getActionForPathAndParams('Baz/Bar', params);
    var navAction = {
      type: _NavigationActions2.default.NAVIGATE,
      routeName: 'Baz',
      action: {
        type: _NavigationActions2.default.NAVIGATE,
        routeName: 'Bar',
        params: { foo: '42' },
      },
    };
    expect(action).toEqual(navAction);
    var state = router.getStateForAction(navAction);
    expect(state).toEqual({
      index: 1,
      isTransitioning: false,
      routes: [
        { key: 'Foo', routeName: 'Foo' },
        {
          index: 1,
          isTransitioning: false,
          key: 'Baz',
          routeName: 'Baz',
          routes: [
            { key: 'Foo', routeName: 'Foo' },
            { key: 'Bar', routeName: 'Bar', params: params },
          ],
        },
        { key: 'Boo', routeName: 'Boo' },
      ],
    });
  });
  test('Handles passing params to nested tabs', function() {
    var ChildTabNavigator = function ChildTabNavigator() {
      return _react2.default.createElement('div', {
        __source: { fileName: _jsxFileName, lineNumber: 226 },
      });
    };
    ChildTabNavigator.router = (0, _TabRouter2.default)({
      Boo: BareLeafRouteConfig,
      Bar: BareLeafRouteConfig,
    });
    var router = (0, _TabRouter2.default)({
      Foo: BareLeafRouteConfig,
      Baz: { screen: ChildTabNavigator },
    });
    var navAction = {
      type: _NavigationActions2.default.NAVIGATE,
      routeName: 'Baz',
    };
    var state = router.getStateForAction(navAction);
    expect(state).toEqual({
      index: 1,
      isTransitioning: false,
      routes: [
        { key: 'Foo', routeName: 'Foo' },
        {
          index: 0,
          key: 'Baz',
          routeName: 'Baz',
          isTransitioning: false,
          routes: [
            { key: 'Boo', routeName: 'Boo' },
            { key: 'Bar', routeName: 'Bar' },
          ],
        },
      ],
    });
    state = router.getStateForAction(
      { type: _NavigationActions2.default.NAVIGATE, routeName: 'Bar' },
      state
    );
    state = router.getStateForAction(
      { type: _NavigationActions2.default.NAVIGATE, routeName: 'Boo' },
      state
    );
    expect(state && state.routes[1]).toEqual({
      index: 0,
      isTransitioning: false,
      key: 'Baz',
      routeName: 'Baz',
      routes: [
        { key: 'Boo', routeName: 'Boo' },
        { key: 'Bar', routeName: 'Bar' },
      ],
    });
  });
  test('Handles initial deep linking into nested tabs', function() {
    var ChildTabNavigator = function ChildTabNavigator() {
      return _react2.default.createElement('div', {
        __source: { fileName: _jsxFileName, lineNumber: 280 },
      });
    };
    ChildTabNavigator.router = (0, _TabRouter2.default)({
      Foo: BareLeafRouteConfig,
      Bar: BareLeafRouteConfig,
    });
    var router = (0, _TabRouter2.default)({
      Foo: BareLeafRouteConfig,
      Baz: { screen: ChildTabNavigator },
      Boo: BareLeafRouteConfig,
    });
    var state = router.getStateForAction({
      type: _NavigationActions2.default.NAVIGATE,
      routeName: 'Bar',
    });
    expect(state).toEqual({
      index: 1,
      isTransitioning: false,
      routes: [
        { key: 'Foo', routeName: 'Foo' },
        {
          index: 1,
          key: 'Baz',
          routeName: 'Baz',
          isTransitioning: false,
          routes: [
            { key: 'Foo', routeName: 'Foo' },
            { key: 'Bar', routeName: 'Bar' },
          ],
        },
        { key: 'Boo', routeName: 'Boo' },
      ],
    });
    var state2 = router.getStateForAction(
      { type: _NavigationActions2.default.NAVIGATE, routeName: 'Foo' },
      state
    );
    expect(state2).toEqual({
      index: 1,
      isTransitioning: false,
      routes: [
        { key: 'Foo', routeName: 'Foo' },
        {
          index: 0,
          key: 'Baz',
          routeName: 'Baz',
          isTransitioning: false,
          routes: [
            { key: 'Foo', routeName: 'Foo' },
            { key: 'Bar', routeName: 'Bar' },
          ],
        },
        { key: 'Boo', routeName: 'Boo' },
      ],
    });
    var state3 = router.getStateForAction(
      { type: _NavigationActions2.default.NAVIGATE, routeName: 'Foo' },
      state2
    );
    expect(state3).toEqual(null);
  });
  test('Handles linking across of deeply nested tabs', function() {
    var ChildNavigator0 = function ChildNavigator0() {
      return _react2.default.createElement('div', {
        __source: { fileName: _jsxFileName, lineNumber: 342 },
      });
    };
    ChildNavigator0.router = (0, _TabRouter2.default)({
      Boo: BareLeafRouteConfig,
      Baz: BareLeafRouteConfig,
    });
    var ChildNavigator1 = function ChildNavigator1() {
      return _react2.default.createElement('div', {
        __source: { fileName: _jsxFileName, lineNumber: 347 },
      });
    };
    ChildNavigator1.router = (0, _TabRouter2.default)({
      Zoo: BareLeafRouteConfig,
      Zap: BareLeafRouteConfig,
    });
    var MidNavigator = function MidNavigator() {
      return _react2.default.createElement('div', {
        __source: { fileName: _jsxFileName, lineNumber: 352 },
      });
    };
    MidNavigator.router = (0, _TabRouter2.default)({
      Foo: { screen: ChildNavigator0 },
      Bar: { screen: ChildNavigator1 },
    });
    var router = (0, _TabRouter2.default)({
      Foo: { screen: MidNavigator },
      Gah: BareLeafRouteConfig,
    });
    var state = router.getStateForAction(INIT_ACTION);
    expect(state).toEqual({
      index: 0,
      isTransitioning: false,
      routes: [
        {
          index: 0,
          key: 'Foo',
          routeName: 'Foo',
          isTransitioning: false,
          routes: [
            {
              index: 0,
              key: 'Foo',
              routeName: 'Foo',
              isTransitioning: false,
              routes: [
                { key: 'Boo', routeName: 'Boo' },
                { key: 'Baz', routeName: 'Baz' },
              ],
            },
            {
              index: 0,
              key: 'Bar',
              routeName: 'Bar',
              isTransitioning: false,
              routes: [
                { key: 'Zoo', routeName: 'Zoo' },
                { key: 'Zap', routeName: 'Zap' },
              ],
            },
          ],
        },
        { key: 'Gah', routeName: 'Gah' },
      ],
    });
    var state2 = router.getStateForAction(
      { type: _NavigationActions2.default.NAVIGATE, routeName: 'Zap' },
      state
    );
    expect(state2).toEqual({
      index: 0,
      isTransitioning: false,
      routes: [
        {
          index: 1,
          key: 'Foo',
          routeName: 'Foo',
          isTransitioning: false,
          routes: [
            {
              index: 0,
              key: 'Foo',
              routeName: 'Foo',
              isTransitioning: false,
              routes: [
                { key: 'Boo', routeName: 'Boo' },
                { key: 'Baz', routeName: 'Baz' },
              ],
            },
            {
              index: 1,
              key: 'Bar',
              routeName: 'Bar',
              isTransitioning: false,
              routes: [
                { key: 'Zoo', routeName: 'Zoo' },
                { key: 'Zap', routeName: 'Zap' },
              ],
            },
          ],
        },
        { key: 'Gah', routeName: 'Gah' },
      ],
    });
    var state3 = router.getStateForAction(
      { type: _NavigationActions2.default.NAVIGATE, routeName: 'Zap' },
      state2
    );
    expect(state3).toEqual(null);
    var state4 = router.getStateForAction({
      type: _NavigationActions2.default.NAVIGATE,
      routeName: 'Foo',
      action: {
        type: _NavigationActions2.default.NAVIGATE,
        routeName: 'Bar',
        action: {
          type: _NavigationActions2.default.NAVIGATE,
          routeName: 'Zap',
        },
      },
    });
    expect(state4).toEqual({
      index: 0,
      isTransitioning: false,
      routes: [
        {
          index: 1,
          key: 'Foo',
          routeName: 'Foo',
          isTransitioning: false,
          routes: [
            {
              index: 0,
              key: 'Foo',
              routeName: 'Foo',
              isTransitioning: false,
              routes: [
                { key: 'Boo', routeName: 'Boo' },
                { key: 'Baz', routeName: 'Baz' },
              ],
            },
            {
              index: 1,
              key: 'Bar',
              routeName: 'Bar',
              isTransitioning: false,
              routes: [
                { key: 'Zoo', routeName: 'Zoo' },
                { key: 'Zap', routeName: 'Zap' },
              ],
            },
          ],
        },
        { key: 'Gah', routeName: 'Gah' },
      ],
    });
  });
  test('Handles path configuration', function() {
    var ScreenA = function ScreenA() {
      return _react2.default.createElement('div', {
        __source: { fileName: _jsxFileName, lineNumber: 488 },
      });
    };
    var ScreenB = function ScreenB() {
      return _react2.default.createElement('div', {
        __source: { fileName: _jsxFileName, lineNumber: 489 },
      });
    };
    var router = (0, _TabRouter2.default)({
      Foo: { path: 'f', screen: ScreenA },
      Bar: { path: 'b', screen: ScreenB },
    });
    var params = { foo: '42' };
    var action = router.getActionForPathAndParams('b/anything', params);
    var expectedAction = {
      params: params,
      routeName: 'Bar',
      type: _NavigationActions2.default.NAVIGATE,
    };
    expect(action).toEqual(expectedAction);
    var state = router.getStateForAction({
      type: _NavigationActions2.default.INIT,
    });
    var expectedState = {
      index: 0,
      isTransitioning: false,
      routes: [
        { key: 'Foo', routeName: 'Foo' },
        { key: 'Bar', routeName: 'Bar' },
      ],
    };
    expect(state).toEqual(expectedState);
    var state2 = router.getStateForAction(expectedAction, state);
    var expectedState2 = {
      index: 1,
      isTransitioning: false,
      routes: [
        { key: 'Foo', routeName: 'Foo' },
        { key: 'Bar', routeName: 'Bar', params: params },
      ],
    };
    expect(state2).toEqual(expectedState2);
    expect(router.getComponentForState(expectedState)).toEqual(ScreenA);
    expect(router.getComponentForState(expectedState2)).toEqual(ScreenB);
    expect(router.getPathAndParamsForState(expectedState).path).toEqual('f');
    expect(router.getPathAndParamsForState(expectedState2).path).toEqual('b');
  });
  test('Handles default configuration', function() {
    var ScreenA = function ScreenA() {
      return _react2.default.createElement('div', {
        __source: { fileName: _jsxFileName, lineNumber: 536 },
      });
    };
    var ScreenB = function ScreenB() {
      return _react2.default.createElement('div', {
        __source: { fileName: _jsxFileName, lineNumber: 537 },
      });
    };
    var router = (0, _TabRouter2.default)({
      Foo: { path: '', screen: ScreenA },
      Bar: { path: 'b', screen: ScreenB },
    });
    var action = router.getActionForPathAndParams('', { foo: '42' });
    expect(action).toEqual({
      params: { foo: '42' },
      routeName: 'Foo',
      type: _NavigationActions2.default.NAVIGATE,
    });
  });
  test('Gets deep path', function() {
    var ScreenA = function ScreenA() {
      return _react2.default.createElement('div', {
        __source: { fileName: _jsxFileName, lineNumber: 559 },
      });
    };
    var ScreenB = function ScreenB() {
      return _react2.default.createElement('div', {
        __source: { fileName: _jsxFileName, lineNumber: 560 },
      });
    };
    ScreenA.router = (0, _TabRouter2.default)({
      Boo: { screen: ScreenB },
      Baz: { screen: ScreenB },
    });
    var router = (0, _TabRouter2.default)({
      Foo: { path: 'f', screen: ScreenA },
      Bar: { screen: ScreenB },
    });
    var state = {
      index: 0,
      isTransitioning: false,
      routes: [
        {
          index: 1,
          key: 'Foo',
          routeName: 'Foo',
          isTransitioning: false,
          routes: [
            { key: 'Boo', routeName: 'Boo' },
            { key: 'Baz', routeName: 'Baz' },
          ],
        },
        { key: 'Bar', routeName: 'Bar' },
      ],
    };
    var _router$getPathAndPar = router.getPathAndParamsForState(state),
      path = _router$getPathAndPar.path;
    expect(path).toEqual('f/Baz');
  });
  test('Maps old actions (uses "getStateForAction returns null when navigating to same tab" test)', function() {
    global.console.warn = jest.fn();
    var router = (0, _TabRouter2.default)(
      { Foo: BareLeafRouteConfig, Bar: BareLeafRouteConfig },
      { initialRouteName: 'Bar' }
    );
    var initAction = _NavigationActions2.default.mapDeprecatedActionAndWarn({
      type: 'Init',
    });
    var state = router.getStateForAction(initAction);
    var navigateAction = _NavigationActions2.default.mapDeprecatedActionAndWarn(
      { type: 'Navigate', routeName: 'Bar' }
    );
    var state2 = router.getStateForAction(navigateAction, state);
    expect(state2).toEqual(null);
    expect(console.warn).toBeCalledWith(
      expect.stringContaining(
        "The action type 'Init' has been renamed to 'Navigation/INIT'"
      )
    );
  });
  test('Can navigate to other tab (no router) with params', function() {
    var ScreenA = function ScreenA() {
      return _react2.default.createElement('div', {
        __source: { fileName: _jsxFileName, lineNumber: 620 },
      });
    };
    var ScreenB = function ScreenB() {
      return _react2.default.createElement('div', {
        __source: { fileName: _jsxFileName, lineNumber: 621 },
      });
    };
    var router = (0, _TabRouter2.default)({
      a: { screen: ScreenA },
      b: { screen: ScreenB },
    });
    var state0 = router.getStateForAction(INIT_ACTION);
    expect(state0).toEqual({
      index: 0,
      isTransitioning: false,
      routes: [{ key: 'a', routeName: 'a' }, { key: 'b', routeName: 'b' }],
    });
    var params = { key: 'value' };
    var state1 = router.getStateForAction(
      {
        type: _NavigationActions2.default.NAVIGATE,
        routeName: 'b',
        params: params,
      },
      state0
    );
    expect(state1).toEqual({
      index: 1,
      isTransitioning: false,
      routes: [
        { key: 'a', routeName: 'a' },
        { key: 'b', routeName: 'b', params: params },
      ],
    });
  });
  test('Back actions are not propagated to inactive children', function() {
    var ScreenA = function ScreenA() {
      return _react2.default.createElement('div', {
        __source: { fileName: _jsxFileName, lineNumber: 654 },
      });
    };
    var ScreenB = function ScreenB() {
      return _react2.default.createElement('div', {
        __source: { fileName: _jsxFileName, lineNumber: 655 },
      });
    };
    var ScreenC = function ScreenC() {
      return _react2.default.createElement('div', {
        __source: { fileName: _jsxFileName, lineNumber: 656 },
      });
    };
    var InnerNavigator = function InnerNavigator() {
      return _react2.default.createElement('div', {
        __source: { fileName: _jsxFileName, lineNumber: 657 },
      });
    };
    InnerNavigator.router = (0, _TabRouter2.default)({
      a: { screen: ScreenA },
      b: { screen: ScreenB },
    });
    var router = (0, _TabRouter2.default)(
      { inner: { screen: InnerNavigator }, c: { screen: ScreenC } },
      { backBehavior: 'none' }
    );
    var state0 = router.getStateForAction(INIT_ACTION);
    var state1 = router.getStateForAction(
      { type: _NavigationActions2.default.NAVIGATE, routeName: 'b' },
      state0
    );
    var state2 = router.getStateForAction(
      { type: _NavigationActions2.default.NAVIGATE, routeName: 'c' },
      state1
    );
    var state3 = router.getStateForAction(
      { type: _NavigationActions2.default.BACK },
      state2
    );
    expect(state3).toEqual(state2);
  });
  test('Back behavior initialRoute works', function() {
    var ScreenA = function ScreenA() {
      return _react2.default.createElement('div', {
        __source: { fileName: _jsxFileName, lineNumber: 694 },
      });
    };
    var ScreenB = function ScreenB() {
      return _react2.default.createElement('div', {
        __source: { fileName: _jsxFileName, lineNumber: 695 },
      });
    };
    var router = (0, _TabRouter2.default)({
      a: { screen: ScreenA },
      b: { screen: ScreenB },
    });
    var state0 = router.getStateForAction(INIT_ACTION);
    var state1 = router.getStateForAction(
      { type: _NavigationActions2.default.NAVIGATE, routeName: 'b' },
      state0
    );
    var state2 = router.getStateForAction(
      { type: _NavigationActions2.default.BACK },
      state1
    );
    expect(state2).toEqual(state0);
  });
  test('pop action works as expected', function() {
    var TestRouter = (0, _StackRouter2.default)({
      foo: {
        screen: function screen() {
          return _react2.default.createElement('div', {
            __source: { fileName: _jsxFileName, lineNumber: 718 },
          });
        },
      },
      bar: {
        screen: function screen() {
          return _react2.default.createElement('div', {
            __source: { fileName: _jsxFileName, lineNumber: 719 },
          });
        },
      },
    });
    var state = {
      index: 3,
      isTransitioning: false,
      routes: [
        { key: 'A', routeName: 'foo' },
        { key: 'B', routeName: 'bar', params: { bazId: '321' } },
        { key: 'C', routeName: 'foo' },
        { key: 'D', routeName: 'bar' },
      ],
    };
    var poppedState = TestRouter.getStateForAction(
      _NavigationActions2.default.pop(),
      state
    );
    expect(poppedState.routes.length).toBe(3);
    expect(poppedState.index).toBe(2);
    expect(poppedState.isTransitioning).toBe(true);
    var poppedState2 = TestRouter.getStateForAction(
      _NavigationActions2.default.pop({ n: 2, immediate: true }),
      state
    );
    expect(poppedState2.routes.length).toBe(2);
    expect(poppedState2.index).toBe(1);
    expect(poppedState2.isTransitioning).toBe(false);
    var poppedState3 = TestRouter.getStateForAction(
      _NavigationActions2.default.pop({ n: 5 }),
      state
    );
    expect(poppedState3.routes.length).toBe(1);
    expect(poppedState3.index).toBe(0);
    expect(poppedState3.isTransitioning).toBe(true);
  });
  test('Inner actions are only unpacked if the current tab matches', function() {
    var PlainScreen = function PlainScreen() {
      return _react2.default.createElement('div', {
        __source: { fileName: _jsxFileName, lineNumber: 758 },
      });
    };
    var ScreenA = function ScreenA() {
      return _react2.default.createElement('div', {
        __source: { fileName: _jsxFileName, lineNumber: 759 },
      });
    };
    var ScreenB = function ScreenB() {
      return _react2.default.createElement('div', {
        __source: { fileName: _jsxFileName, lineNumber: 760 },
      });
    };
    ScreenB.router = (0, _StackRouter2.default)({
      Baz: { screen: PlainScreen },
      Zoo: { screen: PlainScreen },
    });
    ScreenA.router = (0, _StackRouter2.default)({
      Bar: { screen: PlainScreen },
      Boo: { screen: ScreenB },
    });
    var router = (0, _TabRouter2.default)({ Foo: { screen: ScreenA } });
    var screenApreState = {
      index: 0,
      key: 'Init',
      isTransitioning: false,
      routeName: 'Foo',
      routes: [{ key: 'Init', routeName: 'Bar' }],
    };
    var preState = {
      index: 0,
      isTransitioning: false,
      routes: [screenApreState],
    };
    var comparable = function comparable(state) {
      var result = {};
      if (typeof state.routeName === 'string') {
        result = _extends({}, result, { routeName: state.routeName });
      }
      if (state.routes instanceof Array) {
        result = _extends({}, result, { routes: state.routes.map(comparable) });
      }
      return result;
    };
    var action = _NavigationActions2.default.navigate({
      routeName: 'Boo',
      action: _NavigationActions2.default.navigate({ routeName: 'Zoo' }),
    });
    var expectedState = ScreenA.router.getStateForAction(
      action,
      screenApreState
    );
    var state = router.getStateForAction(action, preState);
    var innerState = state ? state.routes[0] : state;
    expect(expectedState && comparable(expectedState)).toEqual(
      innerState && comparable(innerState)
    );
  });
});
