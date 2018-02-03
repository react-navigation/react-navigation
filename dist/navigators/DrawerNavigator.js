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
var _jsxFileName = 'src/navigators/DrawerNavigator.js';
var _react = require('react');
var _react2 = _interopRequireDefault(_react);
var _reactNative = require('react-native');
var _createNavigator = require('./createNavigator');
var _createNavigator2 = _interopRequireDefault(_createNavigator);
var _createNavigationContainer = require('../createNavigationContainer');
var _createNavigationContainer2 = _interopRequireDefault(
  _createNavigationContainer
);
var _TabRouter2 = require('../routers/TabRouter');
var _TabRouter3 = _interopRequireDefault(_TabRouter2);
var _DrawerScreen = require('../views/Drawer/DrawerScreen');
var _DrawerScreen2 = _interopRequireDefault(_DrawerScreen);
var _DrawerView = require('../views/Drawer/DrawerView');
var _DrawerView2 = _interopRequireDefault(_DrawerView);
var _DrawerNavigatorItems = require('../views/Drawer/DrawerNavigatorItems');
var _DrawerNavigatorItems2 = _interopRequireDefault(_DrawerNavigatorItems);
var _SafeAreaView = require('../views/SafeAreaView');
var _SafeAreaView2 = _interopRequireDefault(_SafeAreaView);
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _objectWithoutProperties(obj, keys) {
  var target = {};
  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }
  return target;
}
var defaultContentComponent = function defaultContentComponent(props) {
  return _react2.default.createElement(
    _reactNative.ScrollView,
    {
      alwaysBounceVertical: false,
      __source: { fileName: _jsxFileName, lineNumber: 17 },
    },
    _react2.default.createElement(
      _SafeAreaView2.default,
      {
        forceInset: { top: 'always', horizontal: 'never' },
        __source: { fileName: _jsxFileName, lineNumber: 18 },
      },
      _react2.default.createElement(
        _DrawerNavigatorItems2.default,
        _extends({}, props, {
          __source: { fileName: _jsxFileName, lineNumber: 19 },
        })
      )
    )
  );
};
var DefaultDrawerConfig = {
  drawerWidth: function drawerWidth() {
    var _Dimensions$get = _reactNative.Dimensions.get('window'),
      height = _Dimensions$get.height,
      width = _Dimensions$get.width;
    var smallerAxisSize = Math.min(height, width);
    var isLandscape = width > height;
    var isTablet = smallerAxisSize >= 600;
    var appBarHeight =
      _reactNative.Platform.OS === 'ios' ? (isLandscape ? 32 : 44) : 56;
    var maxWidth = isTablet ? 320 : 280;
    return Math.min(smallerAxisSize - appBarHeight, maxWidth);
  },
  contentComponent: defaultContentComponent,
  drawerOpenRoute: 'DrawerOpen',
  drawerCloseRoute: 'DrawerClose',
  drawerToggleRoute: 'DrawerToggle',
  drawerPosition: 'left',
  drawerBackgroundColor: 'white',
  useNativeAnimations: true,
};
var DrawerNavigator = function DrawerNavigator(routeConfigs) {
  var _TabRouter;
  var config =
    arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var mergedConfig = _extends({}, DefaultDrawerConfig, config);
  var containerConfig = mergedConfig.containerConfig,
    drawerWidth = mergedConfig.drawerWidth,
    drawerLockMode = mergedConfig.drawerLockMode,
    contentComponent = mergedConfig.contentComponent,
    contentOptions = mergedConfig.contentOptions,
    drawerPosition = mergedConfig.drawerPosition,
    useNativeAnimations = mergedConfig.useNativeAnimations,
    drawerBackgroundColor = mergedConfig.drawerBackgroundColor,
    drawerOpenRoute = mergedConfig.drawerOpenRoute,
    drawerCloseRoute = mergedConfig.drawerCloseRoute,
    drawerToggleRoute = mergedConfig.drawerToggleRoute,
    tabsConfig = _objectWithoutProperties(mergedConfig, [
      'containerConfig',
      'drawerWidth',
      'drawerLockMode',
      'contentComponent',
      'contentOptions',
      'drawerPosition',
      'useNativeAnimations',
      'drawerBackgroundColor',
      'drawerOpenRoute',
      'drawerCloseRoute',
      'drawerToggleRoute',
    ]);
  var contentRouter = (0, _TabRouter3.default)(routeConfigs, tabsConfig);
  var drawerRouter = (0, _TabRouter3.default)(
    ((_TabRouter = {}),
    _defineProperty(_TabRouter, drawerCloseRoute, {
      screen: (0, _createNavigator2.default)(
        contentRouter,
        routeConfigs,
        config
      )(function(props) {
        return _react2.default.createElement(
          _DrawerScreen2.default,
          _extends({}, props, {
            __source: { fileName: _jsxFileName, lineNumber: 71 },
          })
        );
      }),
    }),
    _defineProperty(_TabRouter, drawerOpenRoute, {
      screen: function screen() {
        return null;
      },
    }),
    _defineProperty(_TabRouter, drawerToggleRoute, {
      screen: function screen() {
        return null;
      },
    }),
    _TabRouter),
    { initialRouteName: drawerCloseRoute }
  );
  var navigator = (0, _createNavigator2.default)(
    drawerRouter,
    routeConfigs,
    config
  )(function(props) {
    return _react2.default.createElement(
      _DrawerView2.default,
      _extends({}, props, {
        drawerBackgroundColor: drawerBackgroundColor,
        drawerLockMode: drawerLockMode,
        useNativeAnimations: useNativeAnimations,
        drawerWidth: drawerWidth,
        contentComponent: contentComponent,
        contentOptions: contentOptions,
        drawerPosition: drawerPosition,
        drawerOpenRoute: drawerOpenRoute,
        drawerCloseRoute: drawerCloseRoute,
        drawerToggleRoute: drawerToggleRoute,
        __source: { fileName: _jsxFileName, lineNumber: 88 },
      })
    );
  });
  return (0, _createNavigationContainer2.default)(navigator);
};
exports.default = DrawerNavigator;
