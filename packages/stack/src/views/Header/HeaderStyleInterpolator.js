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
  extrapolate: 'clamp',
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

  // We really shouldn't render the scene at all until we know the width of the
  // stack. That said, in every case that I have ever seen, this has just been
  // the full width of the window. This won't continue to be true if we support
  // layouts like iPad master-detail. For now, in order to solve
  // https://github.com/react-navigation/react-navigation/issues/4264, I have
  // opted for the heuristic that we will use the window width until we have
  // measured (and they will usually be the same).
  const width = layout.initWidth || Dimensions.get('window').width;

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
    extrapolate: 'clamp',
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
    hasHeader(scenes[first]) ? 0.3 : 1,
    hasHeader(scenes[index]) ? 1 : 0,
    hasHeader(scenes[last]) ? 0.3 : 1,
    hasHeader(scenes[last]) ? 0 : 1,
    0,
  ];

  return {
    opacity: position.interpolate({
      inputRange,
      outputRange,
      extrapolate: 'clamp',
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
      extrapolate: 'clamp',
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
          extrapolate: 'clamp',
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
      extrapolate: 'clamp',
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
          extrapolate: 'clamp',
        }),
      },
    ],
  };
}

// Fade in background of header while transitioning
function forBackgroundWithFade(props) {
  const { position, scene } = props;
  const sceneRange = getSceneIndicesForInterpolationInputRange(props);
  if (!sceneRange) return { opacity: 0 };
  return {
    opacity: position.interpolate({
      inputRange: [sceneRange.first, scene.index, sceneRange.last],
      outputRange: [0, 1, 0],
      extrapolate: 'clamp',
    }),
  };
}

const VISIBLE = { opacity: 1 };
const HIDDEN = { opacity: 0 };

// Toggle visibility of header without fading
function forBackgroundWithInactiveHidden({ navigation, scene }) {
  return navigation.state.index === scene.index ? VISIBLE : HIDDEN;
}

// Translate the background with the card
const BACKGROUND_OFFSET = Dimensions.get('window').width;
function forBackgroundWithTranslation(props) {
  const { position, scene } = props;
  const interpolate = getSceneIndicesForInterpolationInputRange(props);
  if (!interpolate) return { opacity: 0 };
  const { first, last } = interpolate;
  const index = scene.index;
  const offset = BACKGROUND_OFFSET;
  const outputRange = [offset, 0, -offset];
  return {
    transform: [
      {
        translateX: position.interpolate({
          inputRange: [first, index, last],
          outputRange: I18nManager.isRTL ? outputRange.reverse() : outputRange,
          extrapolate: 'clamp',
        }),
      },
    ],
  };
}

// Default to fade transition
const forBackground = forBackgroundWithInactiveHidden;

export default {
  forLayout,
  forLeft,
  forLeftButton,
  forLeftLabel,
  forCenterFromLeft,
  forCenter,
  forRight,
  forBackground,
  forBackgroundWithInactiveHidden,
  forBackgroundWithFade,
  forBackgroundWithTranslation,
};
