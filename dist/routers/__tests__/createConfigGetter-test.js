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
var _react = require('react');
var _createConfigGetter = require('../createConfigGetter');
var _createConfigGetter2 = _interopRequireDefault(_createConfigGetter);
var _addNavigationHelpers = require('../../addNavigationHelpers');
var _addNavigationHelpers2 = _interopRequireDefault(_addNavigationHelpers);
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
var dummyEventSubscriber = function dummyEventSubscriber(name, handler) {
  return { remove: function remove() {} };
};
test('should get config for screen', function() {
  var HomeScreen = (function(_Component) {
    _inherits(HomeScreen, _Component);
    function HomeScreen() {
      _classCallCheck(this, HomeScreen);
      return _possibleConstructorReturn(
        this,
        (HomeScreen.__proto__ || Object.getPrototypeOf(HomeScreen)).apply(
          this,
          arguments
        )
      );
    }
    _createClass(HomeScreen, [
      {
        key: 'render',
        value: function render() {
          return null;
        },
      },
    ]);
    return HomeScreen;
  })(_react.Component);
  HomeScreen.navigationOptions = function(_ref) {
    var navigation = _ref.navigation;
    return {
      title:
        'Welcome ' +
        (navigation.state.params ? navigation.state.params.user : 'anonymous'),
      gesturesEnabled: true,
    };
  };
  var SettingsScreen = (function(_Component2) {
    _inherits(SettingsScreen, _Component2);
    function SettingsScreen() {
      _classCallCheck(this, SettingsScreen);
      return _possibleConstructorReturn(
        this,
        (
          SettingsScreen.__proto__ || Object.getPrototypeOf(SettingsScreen)
        ).apply(this, arguments)
      );
    }
    _createClass(SettingsScreen, [
      {
        key: 'render',
        value: function render() {
          return null;
        },
      },
    ]);
    return SettingsScreen;
  })(_react.Component);
  SettingsScreen.navigationOptions = {
    title: 'Settings!!!',
    gesturesEnabled: false,
  };
  var NotificationScreen = (function(_Component3) {
    _inherits(NotificationScreen, _Component3);
    function NotificationScreen() {
      _classCallCheck(this, NotificationScreen);
      return _possibleConstructorReturn(
        this,
        (
          NotificationScreen.__proto__ ||
          Object.getPrototypeOf(NotificationScreen)
        ).apply(this, arguments)
      );
    }
    _createClass(NotificationScreen, [
      {
        key: 'render',
        value: function render() {
          return null;
        },
      },
    ]);
    return NotificationScreen;
  })(_react.Component);
  NotificationScreen.navigationOptions = function(_ref2) {
    var navigation = _ref2.navigation;
    return {
      title: '42',
      gesturesEnabled: navigation.state.params
        ? !navigation.state.params.fullscreen
        : true,
    };
  };
  var getScreenOptions = (0, _createConfigGetter2.default)({
    Home: { screen: HomeScreen },
    Settings: { screen: SettingsScreen },
    Notifications: {
      screen: NotificationScreen,
      navigationOptions: { title: '10 new notifications' },
    },
  });
  var routes = [
    { key: 'A', routeName: 'Home' },
    { key: 'B', routeName: 'Home', params: { user: 'jane' } },
    { key: 'C', routeName: 'Settings' },
    { key: 'D', routeName: 'Notifications' },
    { key: 'E', routeName: 'Notifications', params: { fullscreen: true } },
  ];
  expect(
    getScreenOptions(
      (0, _addNavigationHelpers2.default)({
        state: routes[0],
        dispatch: function dispatch() {
          return false;
        },
        addListener: dummyEventSubscriber,
      }),
      {}
    ).title
  ).toEqual('Welcome anonymous');
  expect(
    getScreenOptions(
      (0, _addNavigationHelpers2.default)({
        state: routes[1],
        dispatch: function dispatch() {
          return false;
        },
        addListener: dummyEventSubscriber,
      }),
      {}
    ).title
  ).toEqual('Welcome jane');
  expect(
    getScreenOptions(
      (0, _addNavigationHelpers2.default)({
        state: routes[0],
        dispatch: function dispatch() {
          return false;
        },
        addListener: dummyEventSubscriber,
      }),
      {}
    ).gesturesEnabled
  ).toEqual(true);
  expect(
    getScreenOptions(
      (0, _addNavigationHelpers2.default)({
        state: routes[2],
        dispatch: function dispatch() {
          return false;
        },
        addListener: dummyEventSubscriber,
      }),
      {}
    ).title
  ).toEqual('Settings!!!');
  expect(
    getScreenOptions(
      (0, _addNavigationHelpers2.default)({
        state: routes[2],
        dispatch: function dispatch() {
          return false;
        },
        addListener: dummyEventSubscriber,
      }),
      {}
    ).gesturesEnabled
  ).toEqual(false);
  expect(
    getScreenOptions(
      (0, _addNavigationHelpers2.default)({
        state: routes[3],
        dispatch: function dispatch() {
          return false;
        },
        addListener: dummyEventSubscriber,
      }),
      {}
    ).title
  ).toEqual('10 new notifications');
  expect(
    getScreenOptions(
      (0, _addNavigationHelpers2.default)({
        state: routes[3],
        dispatch: function dispatch() {
          return false;
        },
        addListener: dummyEventSubscriber,
      }),
      {}
    ).gesturesEnabled
  ).toEqual(true);
  expect(
    getScreenOptions(
      (0, _addNavigationHelpers2.default)({
        state: routes[4],
        dispatch: function dispatch() {
          return false;
        },
        addListener: dummyEventSubscriber,
      }),
      {}
    ).gesturesEnabled
  ).toEqual(false);
});
test('should throw if the route does not exist', function() {
  var HomeScreen = function HomeScreen() {
    return null;
  };
  HomeScreen.navigationOptions = {
    title: 'Home screen',
    gesturesEnabled: true,
  };
  var getScreenOptions = (0, _createConfigGetter2.default)({
    Home: { screen: HomeScreen },
  });
  var routes = [{ key: 'B', routeName: 'Settings' }];
  expect(function() {
    return getScreenOptions(
      (0, _addNavigationHelpers2.default)({
        state: routes[0],
        dispatch: function dispatch() {
          return false;
        },
        addListener: dummyEventSubscriber,
      }),
      {}
    );
  }).toThrowError(
    "There is no route defined for key Settings.\nMust be one of: 'Home'"
  );
});
test('should throw if the screen is not defined under the route config', function() {
  var getScreenOptions = (0, _createConfigGetter2.default)({ Home: {} });
  var routes = [{ key: 'B', routeName: 'Home' }];
  expect(function() {
    return getScreenOptions(
      (0, _addNavigationHelpers2.default)({
        state: routes[0],
        dispatch: function dispatch() {
          return false;
        },
        addListener: dummyEventSubscriber,
      })
    );
  }).toThrowError('Route Home must define a screen or a getScreen.');
});
