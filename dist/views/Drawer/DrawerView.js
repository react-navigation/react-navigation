Object.defineProperty(exports, '__esModule', { value: true });
var _jsxFileName = 'src/views/Drawer/DrawerView.js';
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
var _react2 = _interopRequireDefault(_react);
var _reactNative = require('react-native');
var _reactNativeDrawerLayoutPolyfill = require('react-native-drawer-layout-polyfill');
var _reactNativeDrawerLayoutPolyfill2 = _interopRequireDefault(
  _reactNativeDrawerLayoutPolyfill
);
var _addNavigationHelpers = require('../../addNavigationHelpers');
var _addNavigationHelpers2 = _interopRequireDefault(_addNavigationHelpers);
var _DrawerSidebar = require('./DrawerSidebar');
var _DrawerSidebar2 = _interopRequireDefault(_DrawerSidebar);
var _getChildEventSubscriber = require('../../getChildEventSubscriber');
var _getChildEventSubscriber2 = _interopRequireDefault(
  _getChildEventSubscriber
);
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
var DrawerView = (function(_React$PureComponent) {
  _inherits(DrawerView, _React$PureComponent);
  function DrawerView() {
    var _ref;
    var _temp, _this, _ret;
    _classCallCheck(this, DrawerView);
    for (
      var _len = arguments.length, args = Array(_len), _key = 0;
      _key < _len;
      _key++
    ) {
      args[_key] = arguments[_key];
    }
    return (
      (_ret = ((_temp = ((_this = _possibleConstructorReturn(
        this,
        (_ref =
          DrawerView.__proto__ || Object.getPrototypeOf(DrawerView)).call.apply(
          _ref,
          [this].concat(args)
        )
      )),
      _this)),
      (_this.state = {
        drawerWidth:
          typeof _this.props.drawerWidth === 'function'
            ? _this.props.drawerWidth()
            : _this.props.drawerWidth,
      }),
      (_this._handleDrawerOpen = function() {
        var _this$props = _this.props,
          navigation = _this$props.navigation,
          drawerOpenRoute = _this$props.drawerOpenRoute;
        var _navigation$state = navigation.state,
          routes = _navigation$state.routes,
          index = _navigation$state.index;
        if (routes[index].routeName !== drawerOpenRoute) {
          _this.props.navigation.navigate(drawerOpenRoute);
        }
      }),
      (_this._handleDrawerClose = function() {
        var _this$props2 = _this.props,
          navigation = _this$props2.navigation,
          drawerCloseRoute = _this$props2.drawerCloseRoute;
        var _navigation$state2 = navigation.state,
          routes = _navigation$state2.routes,
          index = _navigation$state2.index;
        if (routes[index].routeName !== drawerCloseRoute) {
          _this.props.navigation.navigate(drawerCloseRoute);
        }
      }),
      (_this._updateScreenNavigation = function(navigation) {
        var drawerCloseRoute = _this.props.drawerCloseRoute;
        var navigationState = navigation.state.routes.find(function(route) {
          return route.routeName === drawerCloseRoute;
        });
        if (
          _this._screenNavigationProp &&
          _this._screenNavigationProp.state === navigationState
        ) {
          return;
        }
        _this._screenNavigationProp = (0, _addNavigationHelpers2.default)({
          dispatch: navigation.dispatch,
          state: navigationState,
          addListener: (0, _getChildEventSubscriber2.default)(
            navigation.addListener,
            navigationState.key
          ),
        });
      }),
      (_this._updateWidth = function() {
        var drawerWidth =
          typeof _this.props.drawerWidth === 'function'
            ? _this.props.drawerWidth()
            : _this.props.drawerWidth;
        if (_this.state.drawerWidth !== drawerWidth) {
          _this.setState({ drawerWidth: drawerWidth });
        }
      }),
      (_this._getNavigationState = function(navigation) {
        var drawerCloseRoute = _this.props.drawerCloseRoute;
        var navigationState = navigation.state.routes.find(function(route) {
          return route.routeName === drawerCloseRoute;
        });
        return navigationState;
      }),
      (_this._renderNavigationView = function() {
        return _react2.default.createElement(_DrawerSidebar2.default, {
          screenProps: _this.props.screenProps,
          navigation: _this._screenNavigationProp,
          router: _this.props.router,
          contentComponent: _this.props.contentComponent,
          contentOptions: _this.props.contentOptions,
          drawerPosition: _this.props.drawerPosition,
          style: _this.props.style,
          __source: { fileName: _jsxFileName, lineNumber: 112 },
        });
      }),
      _temp)),
      _possibleConstructorReturn(_this, _ret)
    );
  }
  _createClass(DrawerView, [
    {
      key: 'componentWillMount',
      value: function componentWillMount() {
        this._updateScreenNavigation(this.props.navigation);
        _reactNative.Dimensions.addEventListener('change', this._updateWidth);
      },
    },
    {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        _reactNative.Dimensions.removeEventListener(
          'change',
          this._updateWidth
        );
      },
    },
    {
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        if (
          this.props.navigation.state.index !== nextProps.navigation.state.index
        ) {
          var _props = this.props,
            drawerOpenRoute = _props.drawerOpenRoute,
            drawerCloseRoute = _props.drawerCloseRoute,
            drawerToggleRoute = _props.drawerToggleRoute;
          var _nextProps$navigation = nextProps.navigation.state,
            routes = _nextProps$navigation.routes,
            index = _nextProps$navigation.index;
          if (routes[index].routeName === drawerOpenRoute) {
            this._drawer.openDrawer();
          } else if (routes[index].routeName === drawerToggleRoute) {
            if (this.props.navigation.state.index === 0) {
              this.props.navigation.navigate(drawerOpenRoute);
            } else {
              this.props.navigation.navigate(drawerCloseRoute);
            }
          } else {
            this._drawer.closeDrawer();
          }
        }
        this._updateScreenNavigation(nextProps.navigation);
      },
    },
    {
      key: 'render',
      value: function render() {
        var _this2 = this;
        var DrawerScreen = this.props.router.getComponentForRouteName(
          this.props.drawerCloseRoute
        );
        var config = this.props.router.getScreenOptions(
          this._screenNavigationProp,
          this.props.screenProps
        );
        return _react2.default.createElement(
          _reactNativeDrawerLayoutPolyfill2.default,
          {
            ref: function ref(c) {
              _this2._drawer = c;
            },
            drawerLockMode:
              (this.props.screenProps &&
                this.props.screenProps.drawerLockMode) ||
              (config && config.drawerLockMode),
            drawerBackgroundColor: this.props.drawerBackgroundColor,
            drawerWidth: this.state.drawerWidth,
            onDrawerOpen: this._handleDrawerOpen,
            onDrawerClose: this._handleDrawerClose,
            useNativeAnimations: this.props.useNativeAnimations,
            renderNavigationView: this._renderNavigationView,
            drawerPosition:
              this.props.drawerPosition === 'right'
                ? _reactNativeDrawerLayoutPolyfill2.default.positions.Right
                : _reactNativeDrawerLayoutPolyfill2.default.positions.Left,
            __source: { fileName: _jsxFileName, lineNumber: 134 },
          },
          _react2.default.createElement(DrawerScreen, {
            screenProps: this.props.screenProps,
            navigation: this._screenNavigationProp,
            __source: { fileName: _jsxFileName, lineNumber: 154 },
          })
        );
      },
    },
  ]);
  return DrawerView;
})(_react2.default.PureComponent);
exports.default = DrawerView;
