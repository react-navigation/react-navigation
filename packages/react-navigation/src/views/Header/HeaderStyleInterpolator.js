import { Dimensions, I18nManager } from 'react-native';
import getSceneIndicesForInterpolationInputRange from '../../utils/getSceneIndicesForInterpolationInputRange';

const crossFadeInterpolation = (first, index, last) => ({
  inputRange: [first, index - 0.9, index - 0.2, index, last],
  outputRange: [0, 0, 0.3, 1, 0],
});

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
    opacity: position.interpolate(crossFadeInterpolation(first, index, last)),
  };
}

function forCenter(props) {
  const { position, scene } = props;
  const interpolate = getSceneIndicesForInterpolationInputRange(props);

  if (!interpolate) return { opacity: 0 };

  const { first, last } = interpolate;
  const index = scene.index;

  return {
    opacity: position.interpolate(crossFadeInterpolation(first, index, last)),
  };
}

function forRight(props) {
  const { position, scene } = props;
  const interpolate = getSceneIndicesForInterpolationInputRange(props);

  if (!interpolate) return { opacity: 0 };
  const { first, last } = interpolate;
  const index = scene.index;

  return {
    opacity: position.interpolate(crossFadeInterpolation(first, index, last)),
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

/* 
 * NOTE: this offset calculation is a an approximation that gives us
 * decent results in many cases, but it is ultimately a poor substitute
 * for text measurement. See the comment on title for more information.
 * 
 * - 70 is the width of the left button area.
 * - 25 is the width of the left button icon (to account for label offset)
 */
const LEFT_LABEL_OFFSET = Dimensions.get('window').width / 2 - 70 - 25;
function forLeftLabel(props) {
  const { position, scene, scenes } = props;
  const interpolate = getSceneIndicesForInterpolationInputRange(props);

  if (!interpolate) return { opacity: 0 };

  const { first, last } = interpolate;
  const index = scene.index;

  const offset = LEFT_LABEL_OFFSET;

  return {
    // For now we fade out the label before fading in the title, so the
    // differences between the label and title position can be hopefully not so
    // noticable to the user
    opacity: position.interpolate({
      inputRange: [first, index - 0.35, index, index + 0.5, last],
      outputRange: [0, 0, 1, 0.5, 0],
    }),
    transform: [
      {
        translateX: position.interpolate({
          inputRange: [first, index, last],
          outputRange: I18nManager.isRTL
            ? [-offset, 0, offset]
            : [offset, 0, -offset * 1.5],
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
 * 
 * - 70 is the width of the left button area.
 * - 25 is the width of the left button icon (to account for label offset)
 */
const TITLE_OFFSET_IOS = Dimensions.get('window').width / 2 - 70 + 25;
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
            ? [-offset, 0, offset]
            : [offset, 0, -offset],
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
