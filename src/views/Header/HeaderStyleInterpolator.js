import { Dimensions, I18nManager } from 'react-native';
import getSceneIndicesForInterpolationInputRange from '../../utils/getSceneIndicesForInterpolationInputRange';

const SCREEN_WIDTH = Dimensions.get('window').width;
const TITLE_OFFSET_IOS = SCREEN_WIDTH - 140 - 89;

/**
 * Utility that builds the style for the navigation header.
 *
 * +-------------+-------------+-------------+
 * |             |             |             |
 * |    Left     |   Title     |   Right     |
 * |  Component  |  Component  | Component   |
 * |             |             |             |
 * +-------------+-------------+-------------+
 */

function forLeftButton(props) {
  const { position, scene, scenes } = props;
  const interpolate = getSceneIndicesForInterpolationInputRange(props);

  if (!interpolate) return { opacity: 0 };

  const { first, last } = interpolate;
  const index = scene.index;

  return {
    opacity: position.interpolate({
      inputRange: [
        first,
        first + Math.abs(index - first) / 2,
        index,
        last - Math.abs(last - index) / 2,
        last,
      ],
      outputRange: [0, 0.5, 1, 0.5, 0],
    }),
  };
}

function forLeftLabel(props) {
  const { position, scene, scenes } = props;
  const interpolate = getSceneIndicesForInterpolationInputRange(props);

  if (!interpolate) return { opacity: 0 };

  const { first, last } = interpolate;
  const index = scene.index;

  const offset = 100;

  return {
    opacity: position.interpolate({
      inputRange: [first, first + Math.abs(index - first) / 2, index, last],
      outputRange: [0, 0, 1, 0],
    }),
    transform: [
      {
        translateX: position.interpolate({
          inputRange: [first, index, last],
          outputRange: I18nManager.isRTL
            ? [-offset, 0, offset]
            : [offset, 0, -offset],
        }),
      },
    ],
  };
}

function forLeft(props) {
  const { position, scene, scenes } = props;
  const interpolate = getSceneIndicesForInterpolationInputRange(props);

  if (!interpolate) return { opacity: 0 };

  const { first, last } = interpolate;
  const index = scene.index;

  return {
    opacity: position.interpolate({
      inputRange: [
        first,
        first + Math.abs(index - first) / 2,
        index,
        last - Math.abs(last - index) / 2,
        last,
      ],
      outputRange: [0, 0.5, 1, 0.5, 0],
    }),
  };
}

function forCenter(props) {
  const { position, scene } = props;
  const interpolate = getSceneIndicesForInterpolationInputRange(props);

  if (!interpolate) return { opacity: 0 };

  const { first, last } = interpolate;
  const index = scene.index;
  const inputRange = [first, index - 0.5, index, index + 0.5, last];

  const offset = TITLE_OFFSET_IOS;

  return {
    opacity: position.interpolate({
      inputRange: [first, index - 0.5, index, index + 0.7, last],
      outputRange: [0, 0, 1, 0, 0],
    }),
    transform: [
      {
        translateX: position.interpolate({
          inputRange: [first, index, last],
          outputRange: I18nManager.isRTL
            ? [-offset, 0, offset]
            : [offset * 1.5, 0, -offset],
        }),
      },
    ],
  };
}

function forRight(props) {
  const { position, scene } = props;
  const interpolate = getSceneIndicesForInterpolationInputRange(props);

  if (!interpolate) return { opacity: 0 };
  const { first, last } = interpolate;
  const index = scene.index;

  return {
    opacity: position.interpolate({
      inputRange: [first, index, last],
      outputRange: [0, 1, 0],
    }),
  };
}

export default {
  forLeft,
  forLeftButton,
  forLeftLabel,
  forCenter,
  forRight,
};
