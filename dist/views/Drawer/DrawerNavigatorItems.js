Object.defineProperty(exports, '__esModule', { value: true });
var _jsxFileName = 'src/views/Drawer/DrawerNavigatorItems.js';
var _react = require('react');
var _react2 = _interopRequireDefault(_react);
var _reactNative = require('react-native');
var _SafeAreaView = require('../SafeAreaView');
var _SafeAreaView2 = _interopRequireDefault(_SafeAreaView);
var _TouchableItem = require('../TouchableItem');
var _TouchableItem2 = _interopRequireDefault(_TouchableItem);
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
var DrawerNavigatorItems = function DrawerNavigatorItems(_ref) {
  var _ref$navigation = _ref.navigation,
    state = _ref$navigation.state,
    navigate = _ref$navigation.navigate,
    items = _ref.items,
    activeItemKey = _ref.activeItemKey,
    activeTintColor = _ref.activeTintColor,
    activeBackgroundColor = _ref.activeBackgroundColor,
    inactiveTintColor = _ref.inactiveTintColor,
    inactiveBackgroundColor = _ref.inactiveBackgroundColor,
    getLabel = _ref.getLabel,
    renderIcon = _ref.renderIcon,
    onItemPress = _ref.onItemPress,
    itemsContainerStyle = _ref.itemsContainerStyle,
    itemStyle = _ref.itemStyle,
    labelStyle = _ref.labelStyle,
    iconContainerStyle = _ref.iconContainerStyle,
    drawerPosition = _ref.drawerPosition;
  return _react2.default.createElement(
    _reactNative.View,
    {
      style: [styles.container, itemsContainerStyle],
      __source: { fileName: _jsxFileName, lineNumber: 27 },
    },
    items.map(function(route, index) {
      var _ref2;
      var focused = activeItemKey === route.key;
      var color = focused ? activeTintColor : inactiveTintColor;
      var backgroundColor = focused
        ? activeBackgroundColor
        : inactiveBackgroundColor;
      var scene = {
        route: route,
        index: index,
        focused: focused,
        tintColor: color,
      };
      var icon = renderIcon(scene);
      var label = getLabel(scene);
      return _react2.default.createElement(
        _TouchableItem2.default,
        {
          key: route.key,
          onPress: function onPress() {
            onItemPress({ route: route, focused: focused });
          },
          delayPressIn: 0,
          __source: { fileName: _jsxFileName, lineNumber: 38 },
        },
        _react2.default.createElement(
          _SafeAreaView2.default,
          {
            style: { backgroundColor: backgroundColor },
            forceInset: ((_ref2 = {}),
            _defineProperty(_ref2, drawerPosition, 'always'),
            _defineProperty(
              _ref2,
              drawerPosition === 'left' ? 'right' : 'left',
              'never'
            ),
            _defineProperty(_ref2, 'vertical', 'never'),
            _ref2),
            __source: { fileName: _jsxFileName, lineNumber: 45 },
          },
          _react2.default.createElement(
            _reactNative.View,
            {
              style: [styles.item, itemStyle],
              __source: { fileName: _jsxFileName, lineNumber: 53 },
            },
            icon
              ? _react2.default.createElement(
                  _reactNative.View,
                  {
                    style: [
                      styles.icon,
                      focused ? null : styles.inactiveIcon,
                      iconContainerStyle,
                    ],
                    __source: { fileName: _jsxFileName, lineNumber: 55 },
                  },
                  icon
                )
              : null,
            typeof label === 'string'
              ? _react2.default.createElement(
                  _reactNative.Text,
                  {
                    style: [styles.label, { color: color }, labelStyle],
                    __source: { fileName: _jsxFileName, lineNumber: 66 },
                  },
                  label
                )
              : label
          )
        )
      );
    })
  );
};
DrawerNavigatorItems.defaultProps = {
  activeTintColor: '#2196f3',
  activeBackgroundColor: 'rgba(0, 0, 0, .04)',
  inactiveTintColor: 'rgba(0, 0, 0, .87)',
  inactiveBackgroundColor: 'transparent',
};
var styles = _reactNative.StyleSheet.create({
  container: { paddingVertical: 4 },
  item: { flexDirection: 'row', alignItems: 'center' },
  icon: { marginHorizontal: 16, width: 24, alignItems: 'center' },
  inactiveIcon: { opacity: 0.62 },
  label: { margin: 16, fontWeight: 'bold' },
});
exports.default = DrawerNavigatorItems;
