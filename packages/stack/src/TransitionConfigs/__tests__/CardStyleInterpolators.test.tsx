import { expect, test } from '@jest/globals';
import { Animated } from 'react-native';

import { forFadeFromRightAndroid } from '../CardStyleInterpolators';

const readValue = (value: object | number | undefined): number => {
  if (typeof value === 'number') {
    return value;
  }

  if (
    value != null &&
    '__getValue' in value &&
    typeof value.__getValue === 'function'
  ) {
    const current = value.__getValue();

    if (typeof current === 'number') {
      return current;
    }
  }

  throw new Error('Expected an animated node holding a number');
};

const readTranslateX = (style: object, index: number): number => {
  if (!('transform' in style) || !Array.isArray(style.transform)) {
    throw new Error('Expected the card style to have transforms');
  }

  const entry = style.transform[index];

  if (typeof entry !== 'object' || entry === null || !('translateX' in entry)) {
    throw new Error(`Expected a translateX at transform[${index}]`);
  }

  return readValue(entry.translateX);
};

type Options = {
  progress: number;
  nextProgress?: number;
  closing?: boolean;
  inverted?: number;
};

const interpolate = ({
  progress,
  nextProgress,
  closing = false,
  inverted = 1,
}: Options) => {
  const { cardStyle } = forFadeFromRightAndroid({
    current: { progress: new Animated.Value(progress) },
    next:
      nextProgress === undefined
        ? undefined
        : { progress: new Animated.Value(nextProgress) },
    index: 1,
    closing: new Animated.Value(closing ? 1 : 0),
    swiping: new Animated.Value(0),
    inverted: new Animated.Value(inverted),
    layouts: { screen: { width: 400, height: 800 } },
    insets: { top: 0, right: 0, bottom: 0, left: 0 },
  });

  if (typeof cardStyle !== 'object' || cardStyle === null) {
    throw new Error('Expected a card style object');
  }

  if (!('transform' in cardStyle) || !Array.isArray(cardStyle.transform)) {
    throw new Error('Expected the card style to have transforms');
  }

  return {
    opacity: readValue(Reflect.get(cardStyle, 'opacity')),
    translateFocused: readTranslateX(cardStyle, 0),
    transformCount: cardStyle.transform.length,
  };
};

test('the incoming card fades in linearly with progress', () => {
  expect(interpolate({ progress: 0 }).opacity).toBe(0);
  expect(interpolate({ progress: 0.25 }).opacity).toBe(0.25);
  expect(interpolate({ progress: 0.5 }).opacity).toBe(0.5);
  expect(interpolate({ progress: 1 }).opacity).toBe(1);
});

test('the closing direction uses the same opacity ramp', () => {
  const options = { progress: 0.25, closing: true };

  expect(interpolate(options).opacity).toBe(0.25);
  expect(interpolate({ ...options, progress: 0.75 }).opacity).toBe(0.75);
});

test('the incoming card slides in from 96dp', () => {
  expect(interpolate({ progress: 0 }).translateFocused).toBe(96);
  expect(interpolate({ progress: 0.5 }).translateFocused).toBe(48);
  expect(interpolate({ progress: 1 }).translateFocused).toBe(0);
});

test('the card underneath never moves', () => {
  expect(interpolate({ progress: 1, nextProgress: 0.5 }).transformCount).toBe(
    1
  );
  expect(interpolate({ progress: 1, nextProgress: 1 }).transformCount).toBe(1);
  expect(interpolate({ progress: 1 }).transformCount).toBe(1);
});

// `getProgressFromGesture` doesn't clamp, so an over-drag pushes progress > 1.
test('the offset stays clamped when a gesture drags past either end', () => {
  expect(interpolate({ progress: 1.5 }).translateFocused).toBe(0);
  expect(interpolate({ progress: -0.5 }).translateFocused).toBe(96);
});

test('opacity clamps while closing but not while opening', () => {
  expect(interpolate({ progress: 1.5, closing: true }).opacity).toBe(1);
  expect(interpolate({ progress: 1.5 }).opacity).toBe(1.5);
});

test('a right-to-left direction flips the offset', () => {
  const rtl = interpolate({ progress: 0, nextProgress: 0.5, inverted: -1 });

  expect(rtl.translateFocused).toBe(-96);
});
