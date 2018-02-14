import { Dimensions, I18nManager } from 'react-native';
import getSceneIndicesForInterpolationInputRange from '../../utils/getSceneIndicesForInterpolationInputRange';

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

  return {
    opacity: position.interpolate({
      inputRange: [first, index - 0.5, index, index + 0.5, last],
      outputRange: [0, 0, 1, 0, 0],
    }),
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

/**
 * iOS UINavigationController style interpolators
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

/* 
 * NOTE: this offset calculation is a an approximation that gives us
 * decent results in many cases, but it is ultimately a poor substitute
 * for text measurement. We want the back button label to transition
 * smoothly into the title text and to do this we need to understand
 * where the title is positioned within the title container (since it is
 * centered).
 */
const TITLE_OFFSET_IOS = Dimensions.get('window').width - 50;
function forCenterFromLeft(props) {
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
            ? [-offset / 2, 0, offset * 1.5]
            : [offset / 2, 0, -offset / 2],
        }),
      },
    ],
  };
}

export default {
  forLeft,
  forLeftButton,
  forLeftLabel,
  forCenterFromLeft,
  forCenter,
  forRight,
};
