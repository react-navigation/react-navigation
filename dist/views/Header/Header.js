Object.defineProperty(exports, '__esModule', { value: true });
var _jsxFileName = 'src/views/Header/Header.js';
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
var _react = require('react');
var _react2 = _interopRequireDefault(_react);
var _reactNative = require('react-native');
var _HeaderTitle = require('./HeaderTitle');
var _HeaderTitle2 = _interopRequireDefault(_HeaderTitle);
var _HeaderBackButton = require('./HeaderBackButton');
var _HeaderBackButton2 = _interopRequireDefault(_HeaderBackButton);
var _HeaderStyleInterpolator = require('./HeaderStyleInterpolator');
var _HeaderStyleInterpolator2 = _interopRequireDefault(
  _HeaderStyleInterpolator
);
var _SafeAreaView = require('../SafeAreaView');
var _SafeAreaView2 = _interopRequireDefault(_SafeAreaView);
var _withOrientation = require('../withOrientation');
var _withOrientation2 = _interopRequireDefault(_withOrientation);
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
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
var APPBAR_HEIGHT = _reactNative.Platform.OS === 'ios' ? 44 : 56;
var STATUSBAR_HEIGHT = _reactNative.Platform.OS === 'ios' ? 20 : 0;
var TITLE_OFFSET = _reactNative.Platform.OS === 'ios' ? 70 : 56;
var Header = (function(_React$PureComponent) {
  _inherits(Header, _React$PureComponent);
  function Header() {
    var _ref;
    var _temp, _this, _ret;
    _classCallCheck(this, Header);
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
        (_ref = Header.__proto__ || Object.getPrototypeOf(Header)).call.apply(
          _ref,
          [this].concat(args)
        )
      )),
      _this)),
      (_this.state = { widths: {} }),
      (_this._navigateBack = function() {
        requestAnimationFrame(function() {
          _this.props.navigation.goBack(_this.props.scene.route.key);
        });
      }),
      (_this._renderTitleComponent = function(props) {
        var details = _this.props.getScreenDetails(props.scene);
        var headerTitle = details.options.headerTitle;
        if (_react2.default.isValidElement(headerTitle)) {
          return headerTitle;
        }
        var titleString = _this._getHeaderTitleString(props.scene);
        var titleStyle = details.options.headerTitleStyle;
        var color = details.options.headerTintColor;
        var allowFontScaling = details.options.headerTitleAllowFontScaling;
        var onLayoutIOS =
          _reactNative.Platform.OS === 'ios'
            ? function(e) {
                _this.setState({
                  widths: _extends(
                    {},
                    _this.state.widths,
                    _defineProperty(
                      {},
                      props.scene.key,
                      e.nativeEvent.layout.width
                    )
                  ),
                });
              }
            : undefined;
        var RenderedHeaderTitle =
          headerTitle && typeof headerTitle !== 'string'
            ? headerTitle
            : _HeaderTitle2.default;
        return _react2.default.createElement(
          RenderedHeaderTitle,
          {
            onLayout: onLayoutIOS,
            allowFontScaling:
              allowFontScaling == null ? true : allowFontScaling,
            style: [color ? { color: color } : null, titleStyle],
            __source: { fileName: _jsxFileName, lineNumber: 110 },
          },
          titleString
        );
      }),
      (_this._renderLeftComponent = function(props) {
        var _this$props$getScreen = _this.props.getScreenDetails(props.scene),
          options = _this$props$getScreen.options;
        if (
          _react2.default.isValidElement(options.headerLeft) ||
          options.headerLeft === null
        ) {
          return options.headerLeft;
        }
        if (props.scene.index === 0) {
          return null;
        }
        var backButtonTitle = _this._getBackButtonTitleString(props.scene);
        var truncatedBackButtonTitle = _this._getTruncatedBackButtonTitle(
          props.scene
        );
        var width = _this.state.widths[props.scene.key]
          ? (_this.props.layout.initWidth -
              _this.state.widths[props.scene.key]) /
            2
          : undefined;
        var RenderedLeftComponent =
          options.headerLeft || _HeaderBackButton2.default;
        return _react2.default.createElement(RenderedLeftComponent, {
          onPress: _this._navigateBack,
          pressColorAndroid: options.headerPressColorAndroid,
          tintColor: options.headerTintColor,
          buttonImage: options.headerBackImage,
          title: backButtonTitle,
          truncatedTitle: truncatedBackButtonTitle,
          titleStyle: options.headerBackTitleStyle,
          width: width,
          __source: { fileName: _jsxFileName, lineNumber: 140 },
        });
      }),
      (_this._renderRightComponent = function(props) {
        var details = _this.props.getScreenDetails(props.scene);
        var headerRight = details.options.headerRight;
        return headerRight || null;
      }),
      _temp)),
      _possibleConstructorReturn(_this, _ret)
    );
  }
  _createClass(
    Header,
    [
      {
        key: '_getHeaderTitleString',
        value: function _getHeaderTitleString(scene) {
          var sceneOptions = this.props.getScreenDetails(scene).options;
          if (typeof sceneOptions.headerTitle === 'string') {
            return sceneOptions.headerTitle;
          }
          return sceneOptions.title;
        },
      },
      {
        key: '_getLastScene',
        value: function _getLastScene(scene) {
          return this.props.scenes.find(function(s) {
            return s.index === scene.index - 1;
          });
        },
      },
      {
        key: '_getBackButtonTitleString',
        value: function _getBackButtonTitleString(scene) {
          var lastScene = this._getLastScene(scene);
          if (!lastScene) {
            return null;
          }
          var headerBackTitle = this.props.getScreenDetails(lastScene).options
            .headerBackTitle;
          if (headerBackTitle || headerBackTitle === null) {
            return headerBackTitle;
          }
          return this._getHeaderTitleString(lastScene);
        },
      },
      {
        key: '_getTruncatedBackButtonTitle',
        value: function _getTruncatedBackButtonTitle(scene) {
          var lastScene = this._getLastScene(scene);
          if (!lastScene) {
            return null;
          }
          return this.props.getScreenDetails(lastScene).options
            .headerTruncatedBackTitle;
        },
      },
      {
        key: '_renderLeft',
        value: function _renderLeft(props) {
          return this._renderSubView(
            props,
            'left',
            this._renderLeftComponent,
            this.props.leftInterpolator
          );
        },
      },
      {
        key: '_renderTitle',
        value: function _renderTitle(props, options) {
          var style = {};
          if (_reactNative.Platform.OS === 'android') {
            if (!options.hasLeftComponent) {
              style.left = 0;
            }
            if (!options.hasRightComponent) {
              style.right = 0;
            }
          } else if (
            _reactNative.Platform.OS === 'ios' &&
            !options.hasLeftComponent &&
            !options.hasRightComponent
          ) {
            style.left = 0;
            style.right = 0;
          }
          return this._renderSubView(
            _extends({}, props, { style: style }),
            'title',
            this._renderTitleComponent,
            this.props.titleInterpolator
          );
        },
      },
      {
        key: '_renderRight',
        value: function _renderRight(props) {
          return this._renderSubView(
            props,
            'right',
            this._renderRightComponent,
            this.props.rightInterpolator
          );
        },
      },
      {
        key: '_renderSubView',
        value: function _renderSubView(
          props,
          name,
          renderer,
          styleInterpolator
        ) {
          var scene = props.scene;
          var index = scene.index,
            isStale = scene.isStale,
            key = scene.key;
          var offset = this.props.navigation.state.index - index;
          if (Math.abs(offset) > 2) {
            return null;
          }
          var subView = renderer(props);
          if (subView == null) {
            return null;
          }
          var pointerEvents = offset !== 0 || isStale ? 'none' : 'box-none';
          return _react2.default.createElement(
            _reactNative.Animated.View,
            {
              pointerEvents: pointerEvents,
              key: name + '_' + key,
              style: [
                styles.item,
                styles[name],
                props.style,
                styleInterpolator(_extends({}, this.props, props)),
              ],
              __source: { fileName: _jsxFileName, lineNumber: 225 },
            },
            subView
          );
        },
      },
      {
        key: '_renderHeader',
        value: function _renderHeader(props) {
          var left = this._renderLeft(props);
          var right = this._renderRight(props);
          var title = this._renderTitle(props, {
            hasLeftComponent: !!left,
            hasRightComponent: !!right,
          });
          return _react2.default.createElement(
            _reactNative.View,
            {
              style: [_reactNative.StyleSheet.absoluteFill, styles.header],
              key: 'scene_' + props.scene.key,
              __source: { fileName: _jsxFileName, lineNumber: 253 },
            },
            title,
            left,
            right
          );
        },
      },
      {
        key: 'render',
        value: function render() {
          var _this2 = this;
          var appBar = void 0;
          if (this.props.mode === 'float') {
            var scenesProps = this.props.scenes.map(function(scene) {
              return {
                position: _this2.props.position,
                progress: _this2.props.progress,
                scene: scene,
              };
            });
            appBar = scenesProps.map(this._renderHeader, this);
          } else {
            appBar = this._renderHeader({
              position: new _reactNative.Animated.Value(this.props.scene.index),
              progress: new _reactNative.Animated.Value(0),
              scene: this.props.scene,
            });
          }
          var _props = this.props,
            scenes = _props.scenes,
            scene = _props.scene,
            position = _props.position,
            screenProps = _props.screenProps,
            progress = _props.progress,
            isLandscape = _props.isLandscape,
            rest = _objectWithoutProperties(_props, [
              'scenes',
              'scene',
              'position',
              'screenProps',
              'progress',
              'isLandscape',
            ]);
          var _props$getScreenDetai = this.props.getScreenDetails(scene),
            options = _props$getScreenDetai.options;
          var headerStyle = options.headerStyle;
          var appBarHeight =
            _reactNative.Platform.OS === 'ios' ? (isLandscape ? 32 : 44) : 56;
          var containerStyles = [
            styles.container,
            { height: appBarHeight },
            headerStyle,
          ];
          return _react2.default.createElement(
            _reactNative.Animated.View,
            _extends({}, rest, {
              __source: { fileName: _jsxFileName, lineNumber: 305 },
            }),
            _react2.default.createElement(
              _SafeAreaView2.default,
              {
                style: containerStyles,
                forceInset: { top: 'always', bottom: 'never' },
                __source: { fileName: _jsxFileName, lineNumber: 306 },
              },
              _react2.default.createElement(
                _reactNative.View,
                {
                  style: styles.appBar,
                  __source: { fileName: _jsxFileName, lineNumber: 310 },
                },
                appBar
              )
            )
          );
        },
      },
    ],
    [
      {
        key: 'HEIGHT',
        get: function get() {
          console.warn(
            'Header.HEIGHT is deprecated and will be removed before react-navigation comes out of beta.'
          );
          return APPBAR_HEIGHT + STATUSBAR_HEIGHT;
        },
      },
    ]
  );
  return Header;
})(_react2.default.PureComponent);
Header.defaultProps = {
  leftInterpolator: _HeaderStyleInterpolator2.default.forLeft,
  titleInterpolator: _HeaderStyleInterpolator2.default.forCenter,
  rightInterpolator: _HeaderStyleInterpolator2.default.forRight,
};
var platformContainerStyles = void 0;
if (_reactNative.Platform.OS === 'ios') {
  platformContainerStyles = {
    borderBottomWidth: _reactNative.StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0, 0, 0, .3)',
  };
} else {
  platformContainerStyles = {
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowRadius: _reactNative.StyleSheet.hairlineWidth,
    shadowOffset: { height: _reactNative.StyleSheet.hairlineWidth },
    elevation: 4,
  };
}
var styles = _reactNative.StyleSheet.create({
  container: _extends(
    {
      backgroundColor: _reactNative.Platform.OS === 'ios' ? '#F7F7F7' : '#FFF',
    },
    platformContainerStyles
  ),
  appBar: { flex: 1 },
  header: { flexDirection: 'row' },
  item: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  title: {
    bottom: 0,
    left: TITLE_OFFSET,
    right: TITLE_OFFSET,
    top: 0,
    position: 'absolute',
    alignItems: _reactNative.Platform.OS === 'ios' ? 'center' : 'flex-start',
  },
  left: { left: 0, bottom: 0, top: 0, position: 'absolute' },
  right: { right: 0, bottom: 0, top: 0, position: 'absolute' },
});
exports.default = (0, _withOrientation2.default)(Header);
