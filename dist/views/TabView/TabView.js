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
var _jsxFileName = 'src/views/TabView/TabView.js';
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
var _reactNativeTabView = require('react-native-tab-view');
var _SceneView = require('../SceneView');
var _SceneView2 = _interopRequireDefault(_SceneView);
var _withCachedChildNavigation = require('../../withCachedChildNavigation');
var _withCachedChildNavigation2 = _interopRequireDefault(
  _withCachedChildNavigation
);
var _SafeAreaView = require('../SafeAreaView');
var _SafeAreaView2 = _interopRequireDefault(_SafeAreaView);
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
var TabView = (function(_React$PureComponent) {
  _inherits(TabView, _React$PureComponent);
  function TabView() {
    var _ref;
    var _temp, _this, _ret;
    _classCallCheck(this, TabView);
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
        (_ref = TabView.__proto__ || Object.getPrototypeOf(TabView)).call.apply(
          _ref,
          [this].concat(args)
        )
      )),
      _this)),
      (_this._handlePageChanged = function(index) {
        var navigation = _this.props.navigation;
        navigation.navigate(navigation.state.routes[index].routeName);
      }),
      (_this._renderScene = function(_ref2) {
        var route = _ref2.route;
        var screenProps = _this.props.screenProps;
        var childNavigation = _this.props.childNavigationProps[route.key];
        var TabComponent = _this.props.router.getComponentForRouteName(
          route.routeName
        );
        return _react2.default.createElement(
          _reactNative.View,
          {
            style: styles.page,
            __source: { fileName: _jsxFileName, lineNumber: 29 },
          },
          _react2.default.createElement(_SceneView2.default, {
            screenProps: screenProps,
            component: TabComponent,
            navigation: childNavigation,
            __source: { fileName: _jsxFileName, lineNumber: 30 },
          })
        );
      }),
      (_this._getLabel = function(_ref3) {
        var route = _ref3.route,
          tintColor = _ref3.tintColor,
          focused = _ref3.focused;
        var options = _this.props.router.getScreenOptions(
          _this.props.childNavigationProps[route.key],
          _this.props.screenProps || {}
        );
        if (options.tabBarLabel) {
          return typeof options.tabBarLabel === 'function'
            ? options.tabBarLabel({ tintColor: tintColor, focused: focused })
            : options.tabBarLabel;
        }
        if (typeof options.title === 'string') {
          return options.title;
        }
        return route.routeName;
      }),
      (_this._getOnPress = function(previousScene, _ref4) {
        var route = _ref4.route;
        var options = _this.props.router.getScreenOptions(
          _this.props.childNavigationProps[route.key],
          _this.props.screenProps || {}
        );
        return options.tabBarOnPress;
      }),
      (_this._getTestIDProps = function(_ref5) {
        var route = _ref5.route,
          focused = _ref5.focused;
        var options = _this.props.router.getScreenOptions(
          _this.props.childNavigationProps[route.key],
          _this.props.screenProps || {}
        );
        return typeof options.tabBarTestIDProps === 'function'
          ? options.tabBarTestIDProps({ focused: focused })
          : options.tabBarTestIDProps;
      }),
      (_this._renderIcon = function(_ref6) {
        var focused = _ref6.focused,
          route = _ref6.route,
          tintColor = _ref6.tintColor;
        var options = _this.props.router.getScreenOptions(
          _this.props.childNavigationProps[route.key],
          _this.props.screenProps || {}
        );
        if (options.tabBarIcon) {
          return typeof options.tabBarIcon === 'function'
            ? options.tabBarIcon({ tintColor: tintColor, focused: focused })
            : options.tabBarIcon;
        }
        return null;
      }),
      (_this._renderTabBar = function(props) {
        var _this$props = _this.props,
          tabBarOptions = _this$props.tabBarOptions,
          TabBarComponent = _this$props.tabBarComponent,
          animationEnabled = _this$props.animationEnabled;
        if (typeof TabBarComponent === 'undefined') {
          return null;
        }
        return _react2.default.createElement(
          TabBarComponent,
          _extends({}, props, tabBarOptions, {
            tabBarPosition: _this.props.tabBarPosition,
            screenProps: _this.props.screenProps,
            navigation: _this.props.navigation,
            getLabel: _this._getLabel,
            getTestIDProps: _this._getTestIDProps,
            getOnPress: _this._getOnPress,
            renderIcon: _this._renderIcon,
            animationEnabled: animationEnabled,
            __source: { fileName: _jsxFileName, lineNumber: 102 },
          })
        );
      }),
      (_this._renderPager = function(props) {
        return _react2.default.createElement(
          _reactNativeTabView.TabViewPagerPan,
          _extends({}, props, {
            __source: { fileName: _jsxFileName, lineNumber: 117 },
          })
        );
      }),
      _temp)),
      _possibleConstructorReturn(_this, _ret)
    );
  }
  _createClass(TabView, [
    {
      key: 'render',
      value: function render() {
        var _props = this.props,
          router = _props.router,
          tabBarComponent = _props.tabBarComponent,
          tabBarPosition = _props.tabBarPosition,
          animationEnabled = _props.animationEnabled,
          configureTransition = _props.configureTransition,
          initialLayout = _props.initialLayout,
          screenProps = _props.screenProps;
        var renderHeader = void 0;
        var renderFooter = void 0;
        var renderPager = void 0;
        var state = this.props.navigation.state;
        var options = router.getScreenOptions(
          this.props.childNavigationProps[state.routes[state.index].key],
          screenProps || {}
        );
        var tabBarVisible =
          options.tabBarVisible == null ? true : options.tabBarVisible;
        var swipeEnabled =
          options.swipeEnabled == null
            ? this.props.swipeEnabled
            : options.swipeEnabled;
        if (tabBarComponent !== undefined && tabBarVisible) {
          if (tabBarPosition === 'bottom') {
            renderFooter = this._renderTabBar;
          } else {
            renderHeader = this._renderTabBar;
          }
        }
        if (
          (animationEnabled === false && swipeEnabled === false) ||
          typeof configureTransition === 'function'
        ) {
          renderPager = this._renderPager;
        }
        var props = {
          initialLayout: initialLayout,
          animationEnabled: animationEnabled,
          configureTransition: configureTransition,
          swipeEnabled: swipeEnabled,
          renderPager: renderPager,
          renderHeader: renderHeader,
          renderFooter: renderFooter,
          renderScene: this._renderScene,
          onIndexChange: this._handlePageChanged,
          navigationState: this.props.navigation.state,
          screenProps: this.props.screenProps,
          style: styles.container,
        };
        return _react2.default.createElement(
          _reactNativeTabView.TabViewAnimated,
          _extends({}, props, {
            __source: { fileName: _jsxFileName, lineNumber: 178 },
          })
        );
      },
    },
  ]);
  return TabView;
})(_react2.default.PureComponent);
TabView.defaultProps = {
  initialLayout: _reactNative.Platform.select({
    android: { width: 1, height: 0 },
  }),
};
exports.default = (0, _withCachedChildNavigation2.default)(TabView);
var styles = _reactNative.StyleSheet.create({
  container: { flex: 1 },
  page: { flex: 1, overflow: 'hidden' },
});
