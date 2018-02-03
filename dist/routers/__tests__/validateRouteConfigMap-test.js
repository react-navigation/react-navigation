var _jsxFileName = 'src/routers/__tests__/validateRouteConfigMap-test.js';
var _react = require('react');
var _react2 = _interopRequireDefault(_react);
var _validateRouteConfigMap = require('../validateRouteConfigMap');
var _validateRouteConfigMap2 = _interopRequireDefault(_validateRouteConfigMap);
var _StackRouter = require('../StackRouter');
var _StackRouter2 = _interopRequireDefault(_StackRouter);
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
var ListScreen = function ListScreen() {
  return _react2.default.createElement('div', {
    __source: { fileName: _jsxFileName, lineNumber: 6 },
  });
};
var ProfileNavigator = function ProfileNavigator() {
  return _react2.default.createElement('div', {
    __source: { fileName: _jsxFileName, lineNumber: 8 },
  });
};
ProfileNavigator.router = (0, _StackRouter2.default)({
  list: { screen: ListScreen },
});
describe('validateRouteConfigMap', function() {
  test('Fails on empty config', function() {
    var invalidMap = {};
    expect(function() {
      return (0, _validateRouteConfigMap2.default)(invalidMap);
    }).toThrow();
  });
  test('Fails on bad object', function() {
    var invalidMap = { Home: { foo: 'bar' } };
    expect(function() {
      return (0, _validateRouteConfigMap2.default)(invalidMap);
    }).toThrow();
  });
  test('Fails if both screen and getScreen are defined', function() {
    var invalidMap = {
      Home: {
        screen: ListScreen,
        getScreen: function getScreen() {
          return ListScreen;
        },
      },
    };
    expect(function() {
      return (0, _validateRouteConfigMap2.default)(invalidMap);
    }).toThrow();
  });
  test('Succeeds on a valid config', function() {
    var invalidMap = {
      Home: { screen: ProfileNavigator },
      Chat: { screen: ListScreen },
    };
    (0, _validateRouteConfigMap2.default)(invalidMap);
  });
});
