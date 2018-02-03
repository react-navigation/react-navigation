Object.defineProperty(exports, '__esModule', { value: true });
exports.isOrientationLandscape = undefined;
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
var _jsxFileName = 'src/views/withOrientation.js';
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
exports.default = function(WrappedComponent) {
  var withOrientation = (function(_React$Component) {
    _inherits(withOrientation, _React$Component);
    function withOrientation() {
      _classCallCheck(this, withOrientation);
      var _this = _possibleConstructorReturn(
        this,
        (
          withOrientation.__proto__ || Object.getPrototypeOf(withOrientation)
        ).call(this)
      );
      _initialiseProps.call(_this);
      var isLandscape = isOrientationLandscape(
        _reactNative.Dimensions.get('window')
      );
      _this.state = { isLandscape: isLandscape };
      return _this;
    }
    _createClass(withOrientation, [
      {
        key: 'componentDidMount',
        value: function componentDidMount() {
          _reactNative.Dimensions.addEventListener(
            'change',
            this.handleOrientationChange
          );
        },
      },
      {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
          _reactNative.Dimensions.removeEventListener(
            'change',
            this.handleOrientationChange
          );
        },
      },
      {
        key: 'render',
        value: function render() {
          return _react2.default.createElement(
            WrappedComponent,
            _extends({}, this.props, this.state, {
              __source: { fileName: _jsxFileName, lineNumber: 30 },
            })
          );
        },
      },
    ]);
    return withOrientation;
  })(_react2.default.Component);
  var _initialiseProps = function _initialiseProps() {
    var _this2 = this;
    this.handleOrientationChange = function(_ref2) {
      var window = _ref2.window;
      var isLandscape = isOrientationLandscape(window);
      _this2.setState({ isLandscape: isLandscape });
    };
  };
  return (0, _hoistNonReactStatics2.default)(withOrientation, WrappedComponent);
};
var _react = require('react');
var _react2 = _interopRequireDefault(_react);
var _reactNative = require('react-native');
var _hoistNonReactStatics = require('hoist-non-react-statics');
var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);
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
var isOrientationLandscape = (exports.isOrientationLandscape = function isOrientationLandscape(
  _ref
) {
  var width = _ref.width,
    height = _ref.height;
  return width > height;
});
