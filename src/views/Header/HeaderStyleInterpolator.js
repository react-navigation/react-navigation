import { Dimensions, I18nManager } from 'react-native';
import getSceneIndicesForInterpolationInputRange from '../../utils/getSceneIndicesForInterpolationInputRange';

function hasHeader(scene) {
  if (!scene) {
    return true;
  }
  const { descriptor } = scene;
  return descriptor.options.header !== null;
}

const crossFadeInterpolation = (scenes, first, index, last) => ({
  inputRange: [
    first,
    first + 0.001,
    index - 0.9,
    index - 0.2,
    index,
    last - 0.001,
    last,
  ],
  outputRange: [
    0,
    hasHeader(scenes[first]) ? 0 : 1,
    hasHeader(scenes[first]) ? 0 : 1,
    hasHeader(scenes[first]) ? 0.3 : 1,
    hasHeader(scenes[index]) ? 1 : 0,
    hasHeader(scenes[last]) ? 0 : 1,
    0,
  ],
});

/**
 * Utilities that build the style for the navigation header.
 *
 * +-------------+-------------+-------------+
 * |             |             |             |
 * |    Left     |   Title     |   Right     |
 * |  Component  |  Component  | Component   |
 * |             |             |             |
 * +-------------+-------------+-------------+
 */

function isGoingBack(scenes) {
  const lastSceneIndexInScenes = scenes.length - 1;
  return !scenes[lastSceneIndexInScenes].isActive;
}

function forLayout(props) {
  const { layout, position, scene, scenes, mode } = props;
  if (mode !== 'float') {
    return {};
  }
  const isBack = isGoingBack(scenes);

  const interpolate = getSceneIndicesForInterpolationInputRange(props);
  if (!interpolate) return {};

  const { first, last } = interpolate;
  const index = scene.index;
  const width = layout.initWidth;

  // Make sure the header stays hidden when transitioning between 2 screens
  // with no header.
  if (
    (isBack && !hasHeader(scenes[index]) && !hasHeader(scenes[last])) ||
    (!isBack && !hasHeader(scenes[first]) && !hasHeader(scenes[index]))
  ) {
    return {
      transform: [{ translateX: width }],
    };
  }

  const rtlMult = I18nManager.isRTL ? -1 : 1;
  const translateX = position.interpolate({
    inputRange: [first, index, last],
    outputRange: [
      rtlMult * (hasHeader(scenes[first]) ? 0 : width),
      rtlMult * (hasHeader(scenes[index]) ? 0 : isBack ? width : -width),
      rtlMult * (hasHeader(scenes[last]) ? 0 : -width),
    ],
  });

  return {
    transform: [{ translateX }],
  };
}

function forLeft(props) {
  const { position, scene, scenes } = props;
  const interpolate = getSceneIndicesForInterpolationInputRange(props);

  if (!interpolate) return { opacity: 0 };

  const { first, last } = interpolate;
  const index = scene.index;

  return {
    opacity: position.interpolate(
      crossFadeInterpolation(scenes, first, index, last)
    ),
  };
}

function forCenter(props) {
  const { position, scene, scenes } = props;
  const interpolate = getSceneIndicesForInterpolationInputRange(props);

  if (!interpolate) return { opacity: 0 };

  const { first, last } = interpolate;
  const index = scene.index;

  return {
    opacity: position.interpolate(
      crossFadeInterpolation(scenes, first, index, last)
    ),
  };
}

function forRight(props) {
  const { position, scene, scenes } = props;
  const interpolate = getSceneIndicesForInterpolationInputRange(props);

  if (!interpolate) return { opacity: 0 };
  const { first, last } = interpolate;
  const index = scene.index;

  return {
    opacity: position.interpolate(
      crossFadeInterpolation(scenes, first, index, last)
    ),
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

  // The gist of what we're doing here is animating the left button _normally_ (fast fade)
  // when both scenes in transition have headers. When the current, next, or previous scene _don't_
  // have a header, we don't fade the button, and only set it's opacity to 0 at the last moment
  // of the transition.
  const inputRange = [
    first,
    first + 0.001,
    first + Math.abs(index - first) / 2,
    index,
    last - Math.abs(last - index) / 2,
    last - 0.001,
    last,
  ];
  const outputRange = [
    0,
    hasHeader(scenes[first]) ? 0 : 1,
    hasHeader(scenes[first]) ? 0.1 : 1,
    hasHeader(scenes[index]) ? 1 : 0,
    hasHeader(scenes[last]) ? 0.1 : 1,
    hasHeader(scenes[last]) ? 0 : 1,
    0,
  ];

  return {
    opacity: position.interpolate({
      inputRange,
      outputRange,
    }),
  };
}

/*
 * NOTE: this offset calculation is an approximation that gives us
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

  // Similarly to the animation of the left label, when animating to or from a scene without
  // a header, we keep the label at full opacity and in the same position for as long as possible.
  return {
    // For now we fade out the label before fading in the title, so the
    // differences between the label and title position can be hopefully not so
    // noticable to the user
    opacity: position.interpolate({
      inputRange: [
        first,
        first + 0.001,
        index - 0.35,
        index,
        index + 0.5,
        last - 0.001,
        last,
      ],
      outputRange: [
        0,
        hasHeader(scenes[first]) ? 0 : 1,
        hasHeader(scenes[first]) ? 0 : 1,
        hasHeader(scenes[index]) ? 1 : 0,
        hasHeader(scenes[last]) ? 0.5 : 1,
        hasHeader(scenes[last]) ? 0 : 1,
        0,
      ],
    }),
    transform: [
      {
        translateX: position.interpolate({
          inputRange: [first, first + 0.001, index, last - 0.001, last],
          outputRange: I18nManager.isRTL
            ? [
                -offset * 1.5,
                hasHeader(scenes[first]) ? -offset * 1.5 : 0,
                0,
                hasHeader(scenes[last]) ? offset : 0,
                offset,
              ]
            : [
                offset,
                hasHeader(scenes[first]) ? offset : 0,
                0,
                hasHeader(scenes[last]) ? -offset * 1.5 : 0,
                -offset * 1.5,
              ],
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
  const { position, scene, scenes } = props;
  const interpolate = getSceneIndicesForInterpolationInputRange(props);

  if (!interpolate) return { opacity: 0 };

  const { first, last } = interpolate;
  const index = scene.index;
  const inputRange = [first, index - 0.5, index, index + 0.5, last];
  const offset = TITLE_OFFSET_IOS;

  return {
    opacity: position.interpolate({
      inputRange: [
        first,
        first + 0.001,
        index - 0.5,
        index,
        index + 0.7,
        last - 0.001,
        last,
      ],
      outputRange: [
        0,
        hasHeader(scenes[first]) ? 0 : 1,
        hasHeader(scenes[first]) ? 0 : 1,
        hasHeader(scenes[index]) ? 1 : 0,
        hasHeader(scenes[last]) ? 0 : 1,
        hasHeader(scenes[last]) ? 0 : 1,
        0,
      ],
    }),
    transform: [
      {
        translateX: position.interpolate({
          inputRange: [first, first + 0.001, index, last - 0.001, last],
          outputRange: I18nManager.isRTL
            ? [
                -offset,
                hasHeader(scenes[first]) ? -offset : 0,
                0,
                hasHeader(scenes[last]) ? offset : 0,
                offset,
              ]
            : [
                offset,
                hasHeader(scenes[first]) ? offset : 0,
                0,
                hasHeader(scenes[last]) ? -offset : 0,
                -offset,
              ],
        }),
      },
    ],
  };
}

export default {
  forLayout,
  forLeft,
  forLeftButton,
  forLeftLabel,
  forCenterFromLeft,
  forCenter,
  forRight,
};
