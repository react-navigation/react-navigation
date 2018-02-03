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
var _createClass = (function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ('value' in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();
var _jsxFileName = 'src/routers/__tests__/StackRouter-test.js';
var _react = require('react');
var _react2 = _interopRequireDefault(_react);
var _StackRouter = require('../StackRouter');
var _StackRouter2 = _interopRequireDefault(_StackRouter);
var _TabRouter = require('../TabRouter');
var _TabRouter2 = _interopRequireDefault(_TabRouter);
var _KeyGenerator = require('../KeyGenerator');
var _NavigationActions = require('../../NavigationActions');
var _NavigationActions2 = _interopRequireDefault(_NavigationActions);
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}
function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    );
  }
  return call && (typeof call === 'object' || typeof call === 'function')
    ? call
    : self;
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError(
      'Super expression must either be null or a function, not ' +
        typeof superClass
    );
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true,
    },
  });
  if (superClass)
    Object.setPrototypeOf
      ? Object.setPrototypeOf(subClass, superClass)
      : (subClass.__proto__ = superClass);
}
beforeEach(function() {
  (0, _KeyGenerator._TESTING_ONLY_normalize_keys)();
});
var ListScreen = function ListScreen() {
  return _react2.default.createElement('div', {
    __source: { fileName: _jsxFileName, lineNumber: 15 },
  });
};
var ProfileNavigator = function ProfileNavigator() {
  return _react2.default.createElement('div', {
    __source: { fileName: _jsxFileName, lineNumber: 17 },
  });
};
ProfileNavigator.router = (0, _StackRouter2.default)({
  list: { path: 'list/:id', screen: ListScreen },
});
var MainNavigator = function MainNavigator() {
  return _react2.default.createElement('div', {
    __source: { fileName: _jsxFileName, lineNumber: 25 },
  });
};
MainNavigator.router = (0, _StackRouter2.default)({
  profile: { path: 'p/:id', screen: ProfileNavigator },
});
var LoginScreen = function LoginScreen() {
  return _react2.default.createElement('div', {
    __source: { fileName: _jsxFileName, lineNumber: 33 },
  });
};
var AuthNavigator = function AuthNavigator() {
  return _react2.default.createElement('div', {
    __source: { fileName: _jsxFileName, lineNumber: 35 },
  });
};
AuthNavigator.router = (0, _StackRouter2.default)({
  login: { screen: LoginScreen },
});
var BarScreen = function BarScreen() {
  return _react2.default.createElement('div', {
    __source: { fileName: _jsxFileName, lineNumber: 42 },
  });
};
var FooNavigator = (function(_React$Component) {
  _inherits(FooNavigator, _React$Component);
  function FooNavigator() {
    _classCallCheck(this, FooNavigator);
    return _possibleConstructorReturn(
      this,
      (FooNavigator.__proto__ || Object.getPrototypeOf(FooNavigator)).apply(
        this,
        arguments
      )
    );
  }
  _createClass(FooNavigator, [
    {
      key: 'render',
      value: function render() {
        return _react2.default.createElement('div', {
          __source: { fileName: _jsxFileName, lineNumber: 52 },
        });
      },
    },
  ]);
  return FooNavigator;
})(_react2.default.Component);
FooNavigator.router = (0, _StackRouter2.default)({
  bar: { path: 'b/:barThing', screen: BarScreen },
});
var PersonScreen = function PersonScreen() {
  return _react2.default.createElement('div', {
    __source: { fileName: _jsxFileName, lineNumber: 56 },
  });
};
var TestStackRouter = (0, _StackRouter2.default)({
  main: { screen: MainNavigator },
  baz: { path: null, screen: FooNavigator },
  auth: { screen: AuthNavigator },
  person: { path: 'people/:id', screen: PersonScreen },
  foo: { path: 'fo/:fooThing', screen: FooNavigator },
});
describe('StackRouter', function() {
  test('Gets the active screen for a given state', function() {
    var FooScreen = function FooScreen() {
      return _react2.default.createElement('div', {
        __source: { fileName: _jsxFileName, lineNumber: 81 },
      });
    };
    var BarScreen = function BarScreen() {
      return _react2.default.createElement('div', {
        __source: { fileName: _jsxFileName, lineNumber: 82 },
      });
    };
    var router = (0, _StackRouter2.default)({
      foo: { screen: FooScreen },
      bar: { screen: BarScreen },
    });
    expect(
      router.getComponentForState({
        index: 0,
        isTransitioning: false,
        routes: [
          { key: 'a', routeName: 'foo' },
          { key: 'b', routeName: 'bar' },
          { key: 'c', routeName: 'foo' },
        ],
      })
    ).toBe(FooScreen);
    expect(
      router.getComponentForState({
        index: 1,
        isTransitioning: false,
        routes: [
          { key: 'a', routeName: 'foo' },
          { key: 'b', routeName: 'bar' },
        ],
      })
    ).toBe(BarScreen);
  });
  test('Handles getScreen in getComponentForState', function() {
    var FooScreen = function FooScreen() {
      return _react2.default.createElement('div', {
        __source: { fileName: _jsxFileName, lineNumber: 116 },
      });
    };
    var BarScreen = function BarScreen() {
      return _react2.default.createElement('div', {
        __source: { fileName: _jsxFileName, lineNumber: 117 },
      });
    };
    var router = (0, _StackRouter2.default)({
      foo: {
        getScreen: function getScreen() {
          return FooScreen;
        },
      },
      bar: {
        getScreen: function getScreen() {
          return BarScreen;
        },
      },
    });
    expect(
      router.getComponentForState({
        index: 0,
        isTransitioning: false,
        routes: [
          { key: 'a', routeName: 'foo' },
          { key: 'b', routeName: 'bar' },
          { key: 'c', routeName: 'foo' },
        ],
      })
    ).toBe(FooScreen);
    expect(
      router.getComponentForState({
        index: 1,
        isTransitioning: false,
        routes: [
          { key: 'a', routeName: 'foo' },
          { key: 'b', routeName: 'bar' },
        ],
      })
    ).toBe(BarScreen);
  });
  test('Gets the screen for given route', function() {
    var FooScreen = function FooScreen() {
      return _react2.default.createElement('div', {
        __source: { fileName: _jsxFileName, lineNumber: 151 },
      });
    };
    var BarScreen = (function(_React$Component2) {
      _inherits(BarScreen, _React$Component2);
      function BarScreen() {
        _classCallCheck(this, BarScreen);
        return _possibleConstructorReturn(
          this,
          (BarScreen.__proto__ || Object.getPrototypeOf(BarScreen)).apply(
            this,
            arguments
          )
        );
      }
      _createClass(BarScreen, [
        {
          key: 'render',
          value: function render() {
            return _react2.default.createElement('div', {
              __source: { fileName: _jsxFileName, lineNumber: 154 },
            });
          },
        },
      ]);
      return BarScreen;
    })(_react2.default.Component);
    var BazScreen = (function(_React$Component3) {
      _inherits(BazScreen, _React$Component3);
      function BazScreen() {
        _classCallCheck(this, BazScreen);
        return _possibleConstructorReturn(
          this,
          (BazScreen.__proto__ || Object.getPrototypeOf(BazScreen)).apply(
            this,
            arguments
          )
        );
      }
      _createClass(BazScreen, [
        {
          key: 'render',
          value: function render() {
            return _react2.default.createElement('div', {
              __source: { fileName: _jsxFileName, lineNumber: 159 },
            });
          },
        },
      ]);
      return BazScreen;
    })(_react2.default.Component);
    var router = (0, _StackRouter2.default)({
      foo: { screen: FooScreen },
      bar: { screen: BarScreen },
      baz: { screen: BazScreen },
    });
    expect(router.getComponentForRouteName('foo')).toBe(FooScreen);
    expect(router.getComponentForRouteName('bar')).toBe(BarScreen);
    expect(router.getComponentForRouteName('baz')).toBe(BazScreen);
  });
  test('Handles getScreen in getComponent', function() {
    var FooScreen = function FooScreen() {
      return _react2.default.createElement('div', {
        __source: { fileName: _jsxFileName, lineNumber: 180 },
      });
    };
    var BarScreen = (function(_React$Component4) {
      _inherits(BarScreen, _React$Component4);
      function BarScreen() {
        _classCallCheck(this, BarScreen);
        return _possibleConstructorReturn(
          this,
          (BarScreen.__proto__ || Object.getPrototypeOf(BarScreen)).apply(
            this,
            arguments
          )
        );
      }
      _createClass(BarScreen, [
        {
          key: 'render',
          value: function render() {
            return _react2.default.createElement('div', {
              __source: { fileName: _jsxFileName, lineNumber: 183 },
            });
          },
        },
      ]);
      return BarScreen;
    })(_react2.default.Component);
    var BazScreen = (function(_React$Component5) {
      _inherits(BazScreen, _React$Component5);
      function BazScreen() {
        _classCallCheck(this, BazScreen);
        return _possibleConstructorReturn(
          this,
          (BazScreen.__proto__ || Object.getPrototypeOf(BazScreen)).apply(
            this,
            arguments
          )
        );
      }
      _createClass(BazScreen, [
        {
          key: 'render',
          value: function render() {
            return _react2.default.createElement('div', {
              __source: { fileName: _jsxFileName, lineNumber: 188 },
            });
          },
        },
      ]);
      return BazScreen;
    })(_react2.default.Component);
    var router = (0, _StackRouter2.default)({
      foo: {
        getScreen: function getScreen() {
          return FooScreen;
        },
      },
      bar: {
        getScreen: function getScreen() {
          return BarScreen;
        },
      },
      baz: {
        getScreen: function getScreen() {
          return BazScreen;
        },
      },
    });
    expect(router.getComponentForRouteName('foo')).toBe(FooScreen);
    expect(router.getComponentForRouteName('bar')).toBe(BarScreen);
    expect(router.getComponentForRouteName('baz')).toBe(BazScreen);
  });
  test('Parses simple paths', function() {
    expect(AuthNavigator.router.getActionForPathAndParams('login')).toEqual({
      type: _NavigationActions2.default.NAVIGATE,
      routeName: 'login',
    });
  });
  test('Parses paths with a param', function() {
    expect(TestStackRouter.getActionForPathAndParams('people/foo')).toEqual({
      type: _NavigationActions2.default.NAVIGATE,
      routeName: 'person',
      params: { id: 'foo' },
    });
  });
  test('Parses paths with a query', function() {
    expect(
      TestStackRouter.getActionForPathAndParams('people/foo?code=test&foo=bar')
    ).toEqual({
      type: _NavigationActions2.default.NAVIGATE,
      routeName: 'person',
      params: { id: 'foo', code: 'test', foo: 'bar' },
    });
  });
  test('Parses paths with an empty query value', function() {
    expect(
      TestStackRouter.getActionForPathAndParams('people/foo?code=&foo=bar')
    ).toEqual({
      type: _NavigationActions2.default.NAVIGATE,
      routeName: 'person',
      params: { id: 'foo', code: '', foo: 'bar' },
    });
  });
  test('Correctly parses a path without arguments into an action chain', function() {
    var uri = 'auth/login';
    var action = TestStackRouter.getActionForPathAndParams(uri);
    expect(action).toEqual({
      type: _NavigationActions2.default.NAVIGATE,
      routeName: 'auth',
      action: {
        type: _NavigationActions2.default.NAVIGATE,
        routeName: 'login',
      },
    });
  });
  test('Correctly parses a path with arguments into an action chain', function() {
    var uri = 'main/p/4/list/10259959195';
    var action = TestStackRouter.getActionForPathAndParams(uri);
    expect(action).toEqual({
      type: _NavigationActions2.default.NAVIGATE,
      routeName: 'main',
      action: {
        type: _NavigationActions2.default.NAVIGATE,
        routeName: 'profile',
        params: { id: '4' },
        action: {
          type: _NavigationActions2.default.NAVIGATE,
          routeName: 'list',
          params: { id: '10259959195' },
        },
      },
    });
  });
  test('Correctly parses a path to the router connected to another router through a pure wildcard route into an action chain', function() {
    var uri = 'b/123';
    var action = TestStackRouter.getActionForPathAndParams(uri);
    expect(action).toEqual({
      type: _NavigationActions2.default.NAVIGATE,
      routeName: 'baz',
      action: {
        type: _NavigationActions2.default.NAVIGATE,
        routeName: 'bar',
        params: { barThing: '123' },
      },
    });
  });
  test('Correctly returns null action for non-existent path', function() {
    var uri = 'asdf/1234';
    var action = TestStackRouter.getActionForPathAndParams(uri);
    expect(action).toEqual(null);
  });
  test('Correctly returns action chain for partially matched path', function() {
    var uri = 'auth/login/2';
    var action = TestStackRouter.getActionForPathAndParams(uri);
    expect(action).toEqual({
      type: _NavigationActions2.default.NAVIGATE,
      routeName: 'auth',
      action: {
        type: _NavigationActions2.default.NAVIGATE,
        routeName: 'login',
      },
    });
  });
  test('Correctly returns action for path with multiple parameters', function() {
    var path = 'fo/22/b/hello';
    var action = TestStackRouter.getActionForPathAndParams(path);
    expect(action).toEqual({
      type: _NavigationActions2.default.NAVIGATE,
      routeName: 'foo',
      params: { fooThing: '22' },
      action: {
        type: _NavigationActions2.default.NAVIGATE,
        routeName: 'bar',
        params: { barThing: 'hello' },
      },
    });
  });
  test('Pushes other navigators when navigating to an unopened route name', function() {
    var Bar = function Bar() {
      return _react2.default.createElement('div', {
        __source: { fileName: _jsxFileName, lineNumber: 344 },
      });
    };
    Bar.router = (0, _StackRouter2.default)({
      baz: {
        screen: function screen() {
          return _react2.default.createElement('div', {
            __source: { fileName: _jsxFileName, lineNumber: 346 },
          });
        },
      },
      qux: {
        screen: function screen() {
          return _react2.default.createElement('div', {
            __source: { fileName: _jsxFileName, lineNumber: 347 },
          });
        },
      },
    });
    var TestRouter = (0, _StackRouter2.default)({
      foo: {
        screen: function screen() {
          return _react2.default.createElement('div', {
            __source: { fileName: _jsxFileName, lineNumber: 350 },
          });
        },
      },
      bar: { screen: Bar },
    });
    var initState = TestRouter.getStateForAction(
      _NavigationActions2.default.init()
    );
    expect(initState).toEqual({
      index: 0,
      isTransitioning: false,
      routes: [{ key: 'Init-id-0', routeName: 'foo' }],
    });
    var pushedState = TestRouter.getStateForAction(
      _NavigationActions2.default.navigate({ routeName: 'qux' }),
      initState
    );
    expect(pushedState.index).toEqual(1);
    expect(pushedState.routes[1].index).toEqual(1);
    expect(pushedState.routes[1].routes[1].routeName).toEqual('qux');
  });
  test('popToTop works as expected', function() {
    var TestRouter = (0, _StackRouter2.default)({
      foo: {
        screen: function screen() {
          return _react2.default.createElement('div', {
            __source: { fileName: _jsxFileName, lineNumber: 370 },
          });
        },
      },
      bar: {
        screen: function screen() {
          return _react2.default.createElement('div', {
            __source: { fileName: _jsxFileName, lineNumber: 371 },
          });
        },
      },
    });
    var state = {
      index: 2,
      isTransitioning: false,
      routes: [
        { key: 'A', routeName: 'foo' },
        { key: 'B', routeName: 'bar', params: { bazId: '321' } },
        { key: 'C', routeName: 'foo' },
      ],
    };
    var poppedState = TestRouter.getStateForAction(
      _NavigationActions2.default.popToTop(),
      state
    );
    expect(poppedState.routes.length).toBe(1);
    expect(poppedState.index).toBe(0);
    expect(poppedState.isTransitioning).toBe(true);
    var poppedState2 = TestRouter.getStateForAction(
      _NavigationActions2.default.popToTop(),
      poppedState
    );
    expect(poppedState).toEqual(poppedState2);
    var poppedImmediatelyState = TestRouter.getStateForAction(
      _NavigationActions2.default.popToTop({ immediate: true }),
      state
    );
    expect(poppedImmediatelyState.routes.length).toBe(1);
    expect(poppedImmediatelyState.index).toBe(0);
    expect(poppedImmediatelyState.isTransitioning).toBe(false);
  });
  test('Navigate Pushes duplicate routeName', function() {
    var TestRouter = (0, _StackRouter2.default)({
      foo: {
        screen: function screen() {
          return _react2.default.createElement('div', {
            __source: { fileName: _jsxFileName, lineNumber: 406 },
          });
        },
      },
      bar: {
        screen: function screen() {
          return _react2.default.createElement('div', {
            __source: { fileName: _jsxFileName, lineNumber: 407 },
          });
        },
      },
    });
    var initState = TestRouter.getStateForAction(
      _NavigationActions2.default.init()
    );
    var pushedState = TestRouter.getStateForAction(
      _NavigationActions2.default.navigate({ routeName: 'bar' }),
      initState
    );
    expect(pushedState.index).toEqual(1);
    expect(pushedState.routes[1].routeName).toEqual('bar');
    var pushedTwiceState = TestRouter.getStateForAction(
      _NavigationActions2.default.navigate({ routeName: 'bar' }),
      pushedState
    );
    expect(pushedTwiceState.index).toEqual(2);
    expect(pushedTwiceState.routes[2].routeName).toEqual('bar');
  });
  test('Navigate with key is idempotent', function() {
    var TestRouter = (0, _StackRouter2.default)({
      foo: {
        screen: function screen() {
          return _react2.default.createElement('div', {
            __source: { fileName: _jsxFileName, lineNumber: 426 },
          });
        },
      },
      bar: {
        screen: function screen() {
          return _react2.default.createElement('div', {
            __source: { fileName: _jsxFileName, lineNumber: 427 },
          });
        },
      },
    });
    var initState = TestRouter.getStateForAction(
      _NavigationActions2.default.init()
    );
    var pushedState = TestRouter.getStateForAction(
      _NavigationActions2.default.navigate({ routeName: 'bar', key: 'a' }),
      initState
    );
    expect(pushedState.index).toEqual(1);
    expect(pushedState.routes[1].routeName).toEqual('bar');
    var pushedTwiceState = TestRouter.getStateForAction(
      _NavigationActions2.default.navigate({ routeName: 'bar', key: 'a' }),
      pushedState
    );
    expect(pushedTwiceState.index).toEqual(1);
    expect(pushedTwiceState.routes[1].routeName).toEqual('bar');
  });
  test('Push behaves like navigate, except for key', function() {
    var TestRouter = (0, _StackRouter2.default)({
      foo: {
        screen: function screen() {
          return _react2.default.createElement('div', {
            __source: { fileName: _jsxFileName, lineNumber: 446 },
          });
        },
      },
      bar: {
        screen: function screen() {
          return _react2.default.createElement('div', {
            __source: { fileName: _jsxFileName, lineNumber: 447 },
          });
        },
      },
    });
    var initState = TestRouter.getStateForAction(
      _NavigationActions2.default.init()
    );
    var pushedState = TestRouter.getStateForAction(
      _NavigationActions2.default.push({ routeName: 'bar' }),
      initState
    );
    expect(pushedState.index).toEqual(1);
    expect(pushedState.routes[1].routeName).toEqual('bar');
    expect(function() {
      TestRouter.getStateForAction(
        { type: _NavigationActions2.default.PUSH, routeName: 'bar', key: 'a' },
        pushedState
      );
    }).toThrow();
  });
  test('Handle basic stack logic for plain components', function() {
    var FooScreen = function FooScreen() {
      return _react2.default.createElement('div', {
        __source: { fileName: _jsxFileName, lineNumber: 465 },
      });
    };
    var BarScreen = function BarScreen() {
      return _react2.default.createElement('div', {
        __source: { fileName: _jsxFileName, lineNumber: 466 },
      });
    };
    var router = (0, _StackRouter2.default)({
      Foo: { screen: FooScreen },
      Bar: { screen: BarScreen },
    });
    var state = router.getStateForAction({
      type: _NavigationActions2.default.INIT,
    });
    expect(state).toEqual({
      index: 0,
      isTransitioning: false,
      routes: [{ key: 'Init-id-0', routeName: 'Foo' }],
    });
    var state2 = router.getStateForAction(
      {
        type: _NavigationActions2.default.NAVIGATE,
        routeName: 'Bar',
        params: { name: 'Zoom' },
        immediate: true,
      },
      state
    );
    expect(state2 && state2.index).toEqual(1);
    expect(state2 && state2.routes[1].routeName).toEqual('Bar');
    expect(state2 && state2.routes[1].params).toEqual({ name: 'Zoom' });
    expect(state2 && state2.routes.length).toEqual(2);
    var state3 = router.getStateForAction(
      { type: _NavigationActions2.default.BACK, immediate: true },
      state2
    );
    expect(state3).toEqual({
      index: 0,
      isTransitioning: false,
      routes: [{ key: 'Init-id-0', routeName: 'Foo' }],
    });
  });
  test('Handles push transition logic with completion action', function() {
    var FooScreen = function FooScreen() {
      return _react2.default.createElement('div', {
        __source: { fileName: _jsxFileName, lineNumber: 516 },
      });
    };
    var BarScreen = function BarScreen() {
      return _react2.default.createElement('div', {
        __source: { fileName: _jsxFileName, lineNumber: 517 },
      });
    };
    var router = (0, _StackRouter2.default)({
      Foo: { screen: FooScreen },
      Bar: { screen: BarScreen },
    });
    var state = router.getStateForAction({
      type: _NavigationActions2.default.INIT,
    });
    var state2 = router.getStateForAction(
      {
        type: _NavigationActions2.default.NAVIGATE,
        routeName: 'Bar',
        params: { name: 'Zoom' },
      },
      state
    );
    expect(state2 && state2.index).toEqual(1);
    expect(state2 && state2.isTransitioning).toEqual(true);
    var state3 = router.getStateForAction(
      { type: _NavigationActions2.default.COMPLETE_TRANSITION },
      state2
    );
    expect(state3 && state3.index).toEqual(1);
    expect(state3 && state3.isTransitioning).toEqual(false);
  });
  test('Handle basic stack logic for components with router', function() {
    var FooScreen = function FooScreen() {
      return _react2.default.createElement('div', {
        __source: { fileName: _jsxFileName, lineNumber: 548 },
      });
    };
    var BarScreen = function BarScreen() {
      return _react2.default.createElement('div', {
        __source: { fileName: _jsxFileName, lineNumber: 549 },
      });
    };
    BarScreen.router = (0, _StackRouter2.default)({
      Xyz: {
        screen: function screen() {
          return null;
        },
      },
    });
    var router = (0, _StackRouter2.default)({
      Foo: { screen: FooScreen },
      Bar: { screen: BarScreen },
    });
    var state = router.getStateForAction({
      type: _NavigationActions2.default.INIT,
    });
    expect(state).toEqual({
      index: 0,
      isTransitioning: false,
      routes: [{ key: 'Init-id-0', routeName: 'Foo' }],
    });
    var state2 = router.getStateForAction(
      {
        type: _NavigationActions2.default.NAVIGATE,
        routeName: 'Bar',
        params: { name: 'Zoom' },
        immediate: true,
      },
      state
    );
    expect(state2 && state2.index).toEqual(1);
    expect(state2 && state2.routes[1].routeName).toEqual('Bar');
    expect(state2 && state2.routes[1].params).toEqual({ name: 'Zoom' });
    expect(state2 && state2.routes.length).toEqual(2);
    var state3 = router.getStateForAction(
      { type: _NavigationActions2.default.BACK, immediate: true },
      state2
    );
    expect(state3).toEqual({
      index: 0,
      isTransitioning: false,
      routes: [{ key: 'Init-id-0', routeName: 'Foo' }],
    });
  });
  test('Handle goBack identified by key', function() {
    var FooScreen = function FooScreen() {
      return _react2.default.createElement('div', {
        __source: { fileName: _jsxFileName, lineNumber: 604 },
      });
    };
    var BarScreen = function BarScreen() {
      return _react2.default.createElement('div', {
        __source: { fileName: _jsxFileName, lineNumber: 605 },
      });
    };
    var router = (0, _StackRouter2.default)({
      Foo: { screen: FooScreen },
      Bar: { screen: BarScreen },
    });
    var state = router.getStateForAction({
      type: _NavigationActions2.default.INIT,
    });
    var state2 = router.getStateForAction(
      {
        type: _NavigationActions2.default.NAVIGATE,
        routeName: 'Bar',
        immediate: true,
        params: { name: 'Zoom' },
      },
      state
    );
    var state3 = router.getStateForAction(
      {
        type: _NavigationActions2.default.NAVIGATE,
        routeName: 'Bar',
        immediate: true,
        params: { name: 'Foo' },
      },
      state2
    );
    var state4 = router.getStateForAction(
      { type: _NavigationActions2.default.BACK, key: 'wrongKey' },
      state3
    );
    expect(state3).toEqual(state4);
    var state5 = router.getStateForAction(
      {
        type: _NavigationActions2.default.BACK,
        key: state3 && state3.routes[1].key,
        immediate: true,
      },
      state4
    );
    expect(state5).toEqual(state);
  });
  test('Handle initial route navigation', function() {
    var FooScreen = function FooScreen() {
      return _react2.default.createElement('div', {
        __source: { fileName: _jsxFileName, lineNumber: 650 },
      });
    };
    var BarScreen = function BarScreen() {
      return _react2.default.createElement('div', {
        __source: { fileName: _jsxFileName, lineNumber: 651 },
      });
    };
    var router = (0, _StackRouter2.default)(
      { Foo: { screen: FooScreen }, Bar: { screen: BarScreen } },
      { initialRouteName: 'Bar' }
    );
    var state = router.getStateForAction({
      type: _NavigationActions2.default.INIT,
    });
    expect(state).toEqual({
      index: 0,
      isTransitioning: false,
      routes: [{ key: 'Init-id-0', routeName: 'Bar' }],
    });
  });
  test('Initial route params appear in nav state', function() {
    var FooScreen = function FooScreen() {
      return _react2.default.createElement('div', {
        __source: { fileName: _jsxFileName, lineNumber: 677 },
      });
    };
    var router = (0, _StackRouter2.default)(
      { Foo: { screen: FooScreen } },
      { initialRouteName: 'Bar', initialRouteParams: { foo: 'bar' } }
    );
    var state = router.getStateForAction({
      type: _NavigationActions2.default.INIT,
    });
    expect(state).toEqual({
      index: 0,
      isTransitioning: false,
      routes: [
        {
          key: state && state.routes[0].key,
          routeName: 'Bar',
          params: { foo: 'bar' },
        },
      ],
    });
  });
  test('Action params appear in nav state', function() {
    var FooScreen = function FooScreen() {
      return _react2.default.createElement('div', {
        __source: { fileName: _jsxFileName, lineNumber: 701 },
      });
    };
    var BarScreen = function BarScreen() {
      return _react2.default.createElement('div', {
        __source: { fileName: _jsxFileName, lineNumber: 702 },
      });
    };
    var router = (0, _StackRouter2.default)({
      Foo: { screen: FooScreen },
      Bar: { screen: BarScreen },
    });
    var state = router.getStateForAction({
      type: _NavigationActions2.default.INIT,
    });
    var state2 = router.getStateForAction(
      {
        type: _NavigationActions2.default.NAVIGATE,
        routeName: 'Bar',
        params: { bar: '42' },
        immediate: true,
      },
      state
    );
    expect(state2).not.toBeNull();
    expect(state2 && state2.index).toEqual(1);
    expect(state2 && state2.routes[1].params).toEqual({ bar: '42' });
  });
  test('Handles the SetParams action', function() {
    var router = (0, _StackRouter2.default)(
      {
        Foo: {
          screen: function screen() {
            return _react2.default.createElement('div', {
              __source: { fileName: _jsxFileName, lineNumber: 730 },
            });
          },
        },
        Bar: {
          screen: function screen() {
            return _react2.default.createElement('div', {
              __source: { fileName: _jsxFileName, lineNumber: 733 },
            });
          },
        },
      },
      { initialRouteName: 'Bar', initialRouteParams: { name: 'Zoo' } }
    );
    var state = router.getStateForAction({
      type: _NavigationActions2.default.INIT,
    });
    var key = state && state.routes[0].key;
    var state2 =
      key &&
      router.getStateForAction(
        {
          type: _NavigationActions2.default.SET_PARAMS,
          params: { name: 'Qux' },
          key: key,
        },
        state
      );
    expect(state2 && state2.index).toEqual(0);
    expect(state2 && state2.routes[0].params).toEqual({ name: 'Qux' });
  });
  test('Handles the setParams action with nested routers', function() {
    var ChildNavigator = function ChildNavigator() {
      return _react2.default.createElement('div', {
        __source: { fileName: _jsxFileName, lineNumber: 758 },
      });
    };
    var GrandChildNavigator = function GrandChildNavigator() {
      return _react2.default.createElement('div', {
        __source: { fileName: _jsxFileName, lineNumber: 759 },
      });
    };
    GrandChildNavigator.router = (0, _StackRouter2.default)({
      Quux: {
        screen: function screen() {
          return _react2.default.createElement('div', {
            __source: { fileName: _jsxFileName, lineNumber: 761 },
          });
        },
      },
      Corge: {
        screen: function screen() {
          return _react2.default.createElement('div', {
            __source: { fileName: _jsxFileName, lineNumber: 762 },
          });
        },
      },
    });
    ChildNavigator.router = (0, _TabRouter2.default)({
      Baz: { screen: GrandChildNavigator },
      Qux: {
        screen: function screen() {
          return _react2.default.createElement('div', {
            __source: { fileName: _jsxFileName, lineNumber: 766 },
          });
        },
      },
    });
    var router = (0, _StackRouter2.default)({
      Foo: { screen: ChildNavigator },
      Bar: {
        screen: function screen() {
          return _react2.default.createElement('div', {
            __source: { fileName: _jsxFileName, lineNumber: 770 },
          });
        },
      },
    });
    var state = router.getStateForAction({
      type: _NavigationActions2.default.INIT,
    });
    var state2 = router.getStateForAction(
      {
        type: _NavigationActions2.default.SET_PARAMS,
        params: { name: 'foobar' },
        key: 'Init-id-0',
      },
      state
    );
    expect(state2 && state2.index).toEqual(0);
    expect(state2 && state2.routes[0].routes[0].routes).toEqual([
      { key: 'Init-id-0', routeName: 'Quux', params: { name: 'foobar' } },
    ]);
  });
  test('Handles the reset action', function() {
    var router = (0, _StackRouter2.default)({
      Foo: {
        screen: function screen() {
          return _react2.default.createElement('div', {
            __source: { fileName: _jsxFileName, lineNumber: 794 },
          });
        },
      },
      Bar: {
        screen: function screen() {
          return _react2.default.createElement('div', {
            __source: { fileName: _jsxFileName, lineNumber: 797 },
          });
        },
      },
    });
    var state = router.getStateForAction({
      type: _NavigationActions2.default.INIT,
    });
    var state2 = router.getStateForAction(
      {
        type: _NavigationActions2.default.RESET,
        actions: [
          {
            type: _NavigationActions2.default.NAVIGATE,
            routeName: 'Foo',
            params: { bar: '42' },
            immediate: true,
          },
          {
            type: _NavigationActions2.default.NAVIGATE,
            routeName: 'Bar',
            immediate: true,
          },
        ],
        index: 1,
      },
      state
    );
    expect(state2 && state2.index).toEqual(1);
    expect(state2 && state2.routes[0].params).toEqual({ bar: '42' });
    expect(state2 && state2.routes[0].routeName).toEqual('Foo');
    expect(state2 && state2.routes[1].routeName).toEqual('Bar');
  });
  test('Handles the reset action only with correct key set', function() {
    var router = (0, _StackRouter2.default)({
      Foo: {
        screen: function screen() {
          return _react2.default.createElement('div', {
            __source: { fileName: _jsxFileName, lineNumber: 830 },
          });
        },
      },
      Bar: {
        screen: function screen() {
          return _react2.default.createElement('div', {
            __source: { fileName: _jsxFileName, lineNumber: 833 },
          });
        },
      },
    });
    var state1 = router.getStateForAction({
      type: _NavigationActions2.default.INIT,
    });
    var resetAction = {
      type: _NavigationActions2.default.RESET,
      key: 'Bad Key',
      actions: [
        {
          type: _NavigationActions2.default.NAVIGATE,
          routeName: 'Foo',
          params: { bar: '42' },
          immediate: true,
        },
        {
          type: _NavigationActions2.default.NAVIGATE,
          routeName: 'Bar',
          immediate: true,
        },
      ],
      index: 1,
    };
    var state2 = router.getStateForAction(resetAction, state1);
    expect(state2).toEqual(state1);
    var state3 = router.getStateForAction(
      _extends({}, resetAction, { key: state2.key }),
      state2
    );
    expect(state3 && state3.index).toEqual(1);
    expect(state3 && state3.routes[0].params).toEqual({ bar: '42' });
    expect(state3 && state3.routes[0].routeName).toEqual('Foo');
    expect(state3 && state3.routes[1].routeName).toEqual('Bar');
  });
  test('Handles the reset action with nested Router', function() {
    var ChildRouter = (0, _TabRouter2.default)({
      baz: {
        screen: function screen() {
          return _react2.default.createElement('div', {
            __source: { fileName: _jsxFileName, lineNumber: 873 },
          });
        },
      },
    });
    var ChildNavigator = function ChildNavigator() {
      return _react2.default.createElement('div', {
        __source: { fileName: _jsxFileName, lineNumber: 877 },
      });
    };
    ChildNavigator.router = ChildRouter;
    var router = (0, _StackRouter2.default)({
      Foo: { screen: ChildNavigator },
      Bar: {
        screen: function screen() {
          return _react2.default.createElement('div', {
            __source: { fileName: _jsxFileName, lineNumber: 885 },
          });
        },
      },
    });
    var state = router.getStateForAction({
      type: _NavigationActions2.default.INIT,
    });
    var state2 = router.getStateForAction(
      {
        type: _NavigationActions2.default.RESET,
        actions: [
          {
            type: _NavigationActions2.default.NAVIGATE,
            routeName: 'Foo',
            immediate: true,
          },
        ],
        index: 0,
      },
      state
    );
    expect(state2 && state2.index).toEqual(0);
    expect(state2 && state2.routes[0].routeName).toEqual('Foo');
    expect(state2 && state2.routes[0].routes[0].routeName).toEqual('baz');
  });
  test('Handles the reset action with a key', function() {
    var ChildRouter = (0, _StackRouter2.default)({
      baz: {
        screen: function screen() {
          return _react2.default.createElement('div', {
            __source: { fileName: _jsxFileName, lineNumber: 912 },
          });
        },
      },
    });
    var ChildNavigator = function ChildNavigator() {
      return _react2.default.createElement('div', {
        __source: { fileName: _jsxFileName, lineNumber: 916 },
      });
    };
    ChildNavigator.router = ChildRouter;
    var router = (0, _StackRouter2.default)({
      Foo: { screen: ChildNavigator },
      Bar: {
        screen: function screen() {
          return _react2.default.createElement('div', {
            __source: { fileName: _jsxFileName, lineNumber: 924 },
          });
        },
      },
    });
    var state = router.getStateForAction({
      type: _NavigationActions2.default.INIT,
    });
    var state2 = router.getStateForAction(
      {
        type: _NavigationActions2.default.NAVIGATE,
        routeName: 'Foo',
        immediate: true,
        action: {
          type: _NavigationActions2.default.NAVIGATE,
          routeName: 'baz',
          immediate: true,
        },
      },
      state
    );
    var state3 = router.getStateForAction(
      {
        type: _NavigationActions2.default.RESET,
        key: 'Init',
        actions: [
          {
            type: _NavigationActions2.default.NAVIGATE,
            routeName: 'Foo',
            immediate: true,
          },
        ],
        index: 0,
      },
      state2
    );
    var state4 = router.getStateForAction(
      {
        type: _NavigationActions2.default.RESET,
        key: null,
        actions: [
          {
            type: _NavigationActions2.default.NAVIGATE,
            routeName: 'Bar',
            immediate: true,
          },
        ],
        index: 0,
      },
      state3
    );
    expect(state4 && state4.index).toEqual(0);
    expect(state4 && state4.routes[0].routeName).toEqual('Bar');
  });
  test('Handles the navigate action with params and nested StackRouter', function() {
    var ChildNavigator = function ChildNavigator() {
      return _react2.default.createElement('div', {
        __source: { fileName: _jsxFileName, lineNumber: 977 },
      });
    };
    ChildNavigator.router = (0, _StackRouter2.default)({
      Baz: {
        screen: function screen() {
          return _react2.default.createElement('div', {
            __source: { fileName: _jsxFileName, lineNumber: 978 },
          });
        },
      },
    });
    var router = (0, _StackRouter2.default)({
      Foo: {
        screen: function screen() {
          return _react2.default.createElement('div', {
            __source: { fileName: _jsxFileName, lineNumber: 981 },
          });
        },
      },
      Bar: { screen: ChildNavigator },
    });
    var state = router.getStateForAction({
      type: _NavigationActions2.default.INIT,
    });
    var state2 = router.getStateForAction(
      {
        type: _NavigationActions2.default.NAVIGATE,
        immediate: true,
        routeName: 'Bar',
        params: { foo: '42' },
      },
      state
    );
    expect(state2 && state2.routes[1].params).toEqual({ foo: '42' });
    expect(state2 && state2.routes[1].routes).toEqual([
      expect.objectContaining({ routeName: 'Baz', params: { foo: '42' } }),
    ]);
  });
  test('Handles the navigate action with params and nested TabRouter', function() {
    var ChildNavigator = function ChildNavigator() {
      return _react2.default.createElement('div', {
        __source: { fileName: _jsxFileName, lineNumber: 1004 },
      });
    };
    ChildNavigator.router = (0, _TabRouter2.default)({
      Baz: {
        screen: function screen() {
          return _react2.default.createElement('div', {
            __source: { fileName: _jsxFileName, lineNumber: 1006 },
          });
        },
      },
      Boo: {
        screen: function screen() {
          return _react2.default.createElement('div', {
            __source: { fileName: _jsxFileName, lineNumber: 1007 },
          });
        },
      },
    });
    var router = (0, _StackRouter2.default)({
      Foo: {
        screen: function screen() {
          return _react2.default.createElement('div', {
            __source: { fileName: _jsxFileName, lineNumber: 1011 },
          });
        },
      },
      Bar: { screen: ChildNavigator },
    });
    var state = router.getStateForAction({
      type: _NavigationActions2.default.INIT,
    });
    var state2 = router.getStateForAction(
      {
        type: _NavigationActions2.default.NAVIGATE,
        immediate: true,
        routeName: 'Bar',
        params: { foo: '42' },
      },
      state
    );
    expect(state2 && state2.routes[1].params).toEqual({ foo: '42' });
    expect(state2 && state2.routes[1].routes).toEqual([
      { key: 'Baz', routeName: 'Baz', params: { foo: '42' } },
      { key: 'Boo', routeName: 'Boo', params: { foo: '42' } },
    ]);
  });
  test('Handles empty URIs', function() {
    var router = (0, _StackRouter2.default)(
      {
        Foo: {
          screen: function screen() {
            return _react2.default.createElement('div', {
              __source: { fileName: _jsxFileName, lineNumber: 1043 },
            });
          },
        },
        Bar: {
          screen: function screen() {
            return _react2.default.createElement('div', {
              __source: { fileName: _jsxFileName, lineNumber: 1046 },
            });
          },
        },
      },
      { initialRouteName: 'Bar' }
    );
    var action = router.getActionForPathAndParams('');
    expect(action).toEqual({
      type: _NavigationActions2.default.NAVIGATE,
      routeName: 'Bar',
    });
    var state = null;
    if (action) {
      state = router.getStateForAction(action);
    }
    expect(state && state.index).toEqual(0);
    expect(state && state.routes[0]).toEqual(
      expect.objectContaining({ routeName: 'Bar', type: undefined })
    );
  });
  test('Gets deep path', function() {
    var ScreenA = function ScreenA() {
      return _react2.default.createElement('div', {
        __source: { fileName: _jsxFileName, lineNumber: 1070 },
      });
    };
    var ScreenB = function ScreenB() {
      return _react2.default.createElement('div', {
        __source: { fileName: _jsxFileName, lineNumber: 1071 },
      });
    };
    ScreenA.router = (0, _StackRouter2.default)({
      Boo: { path: 'boo', screen: ScreenB },
      Baz: { path: 'baz/:bazId', screen: ScreenB },
    });
    var router = (0, _StackRouter2.default)({
      Foo: { path: 'f/:id', screen: ScreenA },
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
          params: { id: '123' },
          routes: [
            { key: 'Boo', routeName: 'Boo' },
            { key: 'Baz', routeName: 'Baz', params: { bazId: '321' } },
          ],
        },
        { key: 'Bar', routeName: 'Bar' },
      ],
    };
    var _router$getPathAndPar = router.getPathAndParamsForState(state),
      path = _router$getPathAndPar.path,
      params = _router$getPathAndPar.params;
    expect(path).toEqual('f/123/baz/321');
    expect(params.id).toEqual('123');
    expect(params.bazId).toEqual('321');
  });
  test('Gets deep path with pure wildcard match', function() {
    var ScreenA = function ScreenA() {
      return _react2.default.createElement('div', {
        __source: { fileName: _jsxFileName, lineNumber: 1112 },
      });
    };
    var ScreenB = function ScreenB() {
      return _react2.default.createElement('div', {
        __source: { fileName: _jsxFileName, lineNumber: 1113 },
      });
    };
    var ScreenC = function ScreenC() {
      return _react2.default.createElement('div', {
        __source: { fileName: _jsxFileName, lineNumber: 1114 },
      });
    };
    ScreenA.router = (0, _StackRouter2.default)({
      Boo: { path: 'boo', screen: ScreenC },
      Baz: { path: 'baz/:bazId', screen: ScreenB },
    });
    ScreenC.router = (0, _StackRouter2.default)({
      Boo2: { path: '', screen: ScreenB },
    });
    var router = (0, _StackRouter2.default)({
      Foo: { path: null, screen: ScreenA },
      Bar: { screen: ScreenB },
    });
    {
      var state = {
        index: 0,
        routes: [
          {
            index: 1,
            key: 'Foo',
            routeName: 'Foo',
            params: { id: '123' },
            routes: [
              {
                index: 0,
                key: 'Boo',
                routeName: 'Boo',
                routes: [{ key: 'Boo2', routeName: 'Boo2' }],
              },
              { key: 'Baz', routeName: 'Baz', params: { bazId: '321' } },
            ],
          },
          { key: 'Bar', routeName: 'Bar' },
        ],
      };
      var _router$getPathAndPar2 = router.getPathAndParamsForState(state),
        path = _router$getPathAndPar2.path,
        params = _router$getPathAndPar2.params;
      expect(path).toEqual('baz/321');
      expect(params.id).toEqual('123');
      expect(params.bazId).toEqual('321');
    }
    {
      var _state = {
        index: 0,
        routes: [
          {
            index: 0,
            key: 'Foo',
            routeName: 'Foo',
            params: { id: '123' },
            routes: [
              {
                index: 0,
                key: 'Boo',
                routeName: 'Boo',
                routes: [{ key: 'Boo2', routeName: 'Boo2' }],
              },
              { key: 'Baz', routeName: 'Baz', params: { bazId: '321' } },
            ],
          },
          { key: 'Bar', routeName: 'Bar' },
        ],
      };
      var _router$getPathAndPar3 = router.getPathAndParamsForState(_state),
        _path = _router$getPathAndPar3.path,
        _params = _router$getPathAndPar3.params;
      expect(_path).toEqual('boo/');
      expect(_params).toEqual({ id: '123' });
    }
  });
  test('Maps old actions (uses "Handles the reset action" test)', function() {
    global.console.warn = jest.fn();
    var router = (0, _StackRouter2.default)({
      Foo: {
        screen: function screen() {
          return _react2.default.createElement('div', {
            __source: { fileName: _jsxFileName, lineNumber: 1198 },
          });
        },
      },
      Bar: {
        screen: function screen() {
          return _react2.default.createElement('div', {
            __source: { fileName: _jsxFileName, lineNumber: 1201 },
          });
        },
      },
    });
    var initAction = _NavigationActions2.default.mapDeprecatedActionAndWarn({
      type: 'Init',
    });
    var state = router.getStateForAction(initAction);
    var resetAction = _NavigationActions2.default.mapDeprecatedActionAndWarn({
      type: 'Reset',
      actions: [
        { type: 'Navigate', routeName: 'Foo', params: { bar: '42' } },
        { type: 'Navigate', routeName: 'Bar' },
      ],
      index: 1,
    });
    var state2 = router.getStateForAction(resetAction, state);
    expect(state2 && state2.index).toEqual(1);
    expect(state2 && state2.routes[0].params).toEqual({ bar: '42' });
    expect(state2 && state2.routes[0].routeName).toEqual('Foo');
    expect(state2 && state2.routes[1].routeName).toEqual('Bar');
    expect(console.warn).toBeCalledWith(
      expect.stringContaining(
        "The action type 'Init' has been renamed to 'Navigation/INIT'"
      )
    );
  });
  test('Querystring params get passed to nested deep link', function() {
    var uri = 'main/p/4/list/10259959195?code=test&foo=bar';
    var action = TestStackRouter.getActionForPathAndParams(uri);
    expect(action).toEqual({
      type: _NavigationActions2.default.NAVIGATE,
      routeName: 'main',
      params: { code: 'test', foo: 'bar' },
      action: {
        type: _NavigationActions2.default.NAVIGATE,
        routeName: 'profile',
        params: { id: '4', code: 'test', foo: 'bar' },
        action: {
          type: _NavigationActions2.default.NAVIGATE,
          routeName: 'list',
          params: { id: '10259959195', code: 'test', foo: 'bar' },
        },
      },
    });
    var uri2 = 'main/p/4/list/10259959195?code=&foo=bar';
    var action2 = TestStackRouter.getActionForPathAndParams(uri2);
    expect(action2).toEqual({
      type: _NavigationActions2.default.NAVIGATE,
      routeName: 'main',
      params: { code: '', foo: 'bar' },
      action: {
        type: _NavigationActions2.default.NAVIGATE,
        routeName: 'profile',
        params: { id: '4', code: '', foo: 'bar' },
        action: {
          type: _NavigationActions2.default.NAVIGATE,
          routeName: 'list',
          params: { id: '10259959195', code: '', foo: 'bar' },
        },
      },
    });
  });
});
test('Handles deep navigate completion action', function() {
  var LeafScreen = function LeafScreen() {
    return _react2.default.createElement('div', {
      __source: { fileName: _jsxFileName, lineNumber: 1292 },
    });
  };
  var FooScreen = function FooScreen() {
    return _react2.default.createElement('div', {
      __source: { fileName: _jsxFileName, lineNumber: 1293 },
    });
  };
  FooScreen.router = (0, _StackRouter2.default)({
    Boo: { path: 'boo', screen: LeafScreen },
    Baz: { path: 'baz/:bazId', screen: LeafScreen },
  });
  var router = (0, _StackRouter2.default)({
    Foo: { screen: FooScreen },
    Bar: { screen: LeafScreen },
  });
  var state = router.getStateForAction({
    type: _NavigationActions2.default.INIT,
  });
  expect(state && state.index).toEqual(0);
  expect(state && state.routes[0].routeName).toEqual('Foo');
  var key = state && state.routes[0].key;
  var state2 = router.getStateForAction(
    { type: _NavigationActions2.default.NAVIGATE, routeName: 'Baz' },
    state
  );
  expect(state2 && state2.index).toEqual(0);
  expect(state2 && state2.isTransitioning).toEqual(false);
  expect(state2 && state2.routes[0].index).toEqual(1);
  expect(state2 && state2.routes[0].isTransitioning).toEqual(true);
  expect(!!key).toEqual(true);
  var state3 = router.getStateForAction(
    { type: _NavigationActions2.default.COMPLETE_TRANSITION },
    state2
  );
  expect(state3 && state3.index).toEqual(0);
  expect(state3 && state3.isTransitioning).toEqual(false);
  expect(state3 && state3.routes[0].index).toEqual(1);
  expect(state3 && state3.routes[0].isTransitioning).toEqual(false);
});
