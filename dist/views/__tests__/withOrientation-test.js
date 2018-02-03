var _jsxFileName = 'src/views/__tests__/withOrientation-test.js';
var _react = require('react');
var _react2 = _interopRequireDefault(_react);
var _reactNative = require('react-native');
var _reactTestRenderer = require('react-test-renderer');
var _reactTestRenderer2 = _interopRequireDefault(_reactTestRenderer);
var _withOrientation = require('../withOrientation');
var _withOrientation2 = _interopRequireDefault(_withOrientation);
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
test('it adds isLandscape to props', function() {
  var WrappedComponent = (0, _withOrientation2.default)(_reactNative.View);
  var rendered = _reactTestRenderer2.default
    .create(
      _react2.default.createElement(WrappedComponent, {
        __source: { fileName: _jsxFileName, lineNumber: 8 },
      })
    )
    .toJSON();
  expect(rendered).toMatchSnapshot();
});
test('calculates orientation correctly', function() {
  var isLandscape = (0, _withOrientation.isOrientationLandscape)({
    width: 10,
    height: 1,
  });
  expect(isLandscape).toBeTruthy();
});
