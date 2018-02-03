var _jsxFileName = 'src/navigators/__tests__/TabNavigator-test.js';
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
var _reactTestRenderer = require('react-test-renderer');
var _reactTestRenderer2 = _interopRequireDefault(_reactTestRenderer);
var _TabNavigator = require('../TabNavigator');
var _TabNavigator2 = _interopRequireDefault(_TabNavigator);
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
var routeConfig = { Home: { screen: HomeScreen } };
describe('TabNavigator', function() {
  it('renders successfully', function() {
    var MyTabNavigator = (0, _TabNavigator2.default)(routeConfig);
    var rendered = _reactTestRenderer2.default
      .create(
        _react2.default.createElement(MyTabNavigator, {
          __source: { fileName: _jsxFileName, lineNumber: 29 },
        })
      )
      .toJSON();
    expect(rendered).toMatchSnapshot();
  });
});
