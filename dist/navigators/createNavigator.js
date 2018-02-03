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
var _jsxFileName = 'src/navigators/createNavigator.js';
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
exports.default = createNavigator;
var _react = require('react');
var _react2 = _interopRequireDefault(_react);
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
function createNavigator(router, routeConfigs, navigatorConfig) {
  return function(NavigationView) {
    var Navigator = (function(_React$Component) {
      _inherits(Navigator, _React$Component);
      function Navigator() {
        _classCallCheck(this, Navigator);
        return _possibleConstructorReturn(
          this,
          (Navigator.__proto__ || Object.getPrototypeOf(Navigator)).apply(
            this,
            arguments
          )
        );
      }
      _createClass(Navigator, [
        {
          key: 'render',
          value: function render() {
            return _react2.default.createElement(
              NavigationView,
              _extends({}, this.props, {
                router: router,
                __source: { fileName: _jsxFileName, lineNumber: 13 },
              })
            );
          },
        },
      ]);
      return Navigator;
    })(_react2.default.Component);
    Navigator.router = router;
    Navigator.navigationOptions = null;
    return Navigator;
  };
}
