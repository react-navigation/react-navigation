var _jsxFileName = 'src/views/__tests__/TabView-test.js';
var _react = require('react');
var _react2 = _interopRequireDefault(_react);
var _reactNative = require('react-native');
var _reactTestRenderer = require('react-test-renderer');
var _reactTestRenderer2 = _interopRequireDefault(_reactTestRenderer);
var _TabRouter = require('../../routers/TabRouter');
var _TabRouter2 = _interopRequireDefault(_TabRouter);
var _TabView = require('../TabView/TabView');
var _TabView2 = _interopRequireDefault(_TabView);
var _TabBarBottom = require('../TabView/TabBarBottom');
var _TabBarBottom2 = _interopRequireDefault(_TabBarBottom);
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
var dummyEventSubscriber = function dummyEventSubscriber(name, handler) {
  return { remove: function remove() {} };
};
describe('TabBarBottom', function() {
  it('renders successfully', function() {
    var navigation = {
      state: { index: 0, routes: [{ key: 's1', routeName: 's1' }] },
      addListener: dummyEventSubscriber,
    };
    var router = (0, _TabRouter2.default)({
      s1: { screen: _reactNative.View },
    });
    var rendered = _reactTestRenderer2.default
      .create(
        _react2.default.createElement(_TabView2.default, {
          tabBarComponent: _TabBarBottom2.default,
          navigation: navigation,
          router: router,
          __source: { fileName: _jsxFileName, lineNumber: 26 },
        })
      )
      .toJSON();
    expect(rendered).toMatchSnapshot();
  });
});
