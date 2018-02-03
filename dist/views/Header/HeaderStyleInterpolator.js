Object.defineProperty(exports, '__esModule', { value: true });
var _reactNative = require('react-native');
var _getSceneIndicesForInterpolationInputRange = require('../../utils/getSceneIndicesForInterpolationInputRange');
var _getSceneIndicesForInterpolationInputRange2 = _interopRequireDefault(
  _getSceneIndicesForInterpolationInputRange
);
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
function forLeft(props) {
  var position = props.position,
    scene = props.scene,
    scenes = props.scenes;
  var interpolate = (0, _getSceneIndicesForInterpolationInputRange2.default)(
    props
  );
  if (!interpolate) return { opacity: 0 };
  var first = interpolate.first,
    last = interpolate.last;
  var index = scene.index;
  return {
    opacity: position.interpolate({
      inputRange: [
        first,
        first + Math.abs(index - first) / 2,
        index,
        last - Math.abs(last - index) / 2,
        last,
      ],
      outputRange: [0, 0, 1, 0, 0],
    }),
  };
}
function forCenter(props) {
  var position = props.position,
    scene = props.scene;
  var interpolate = (0, _getSceneIndicesForInterpolationInputRange2.default)(
    props
  );
  if (!interpolate) return { opacity: 0 };
  var first = interpolate.first,
    last = interpolate.last;
  var index = scene.index;
  var inputRange = [first, index, last];
  return {
    opacity: position.interpolate({
      inputRange: inputRange,
      outputRange: [0, 1, 0],
    }),
    transform: [
      {
        translateX: position.interpolate({
          inputRange: inputRange,
          outputRange: _reactNative.I18nManager.isRTL
            ? [-200, 0, 200]
            : [200, 0, -200],
        }),
      },
    ],
  };
}
function forRight(props) {
  var position = props.position,
    scene = props.scene;
  var interpolate = (0, _getSceneIndicesForInterpolationInputRange2.default)(
    props
  );
  if (!interpolate) return { opacity: 0 };
  var first = interpolate.first,
    last = interpolate.last;
  var index = scene.index;
  return {
    opacity: position.interpolate({
      inputRange: [first, index, last],
      outputRange: [0, 1, 0],
    }),
  };
}
exports.default = {
  forLeft: forLeft,
  forCenter: forCenter,
  forRight: forRight,
};
