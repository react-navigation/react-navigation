// @flow
import { createTransition, bindTransition } from '../Transition/transitionHelpers';

export function initTestTransition(prop, inputRange, outputRange, filterRegex = /foo/) {
  const transition = createTransition({
    getStyleMap() {
      return {
        from: {
          id1: { [prop]: {inputRange, outputRange,} },
        }
      }
    }
  });
  return bindTransition(transition, filterRegex);
}

export function assertIoRanges(actual, expected) {
  expect(actual.inputRange).toEqual(expected.inputRange);
  expect(actual.outputRange).toEqual(expected.outputRange);
}

export function ioRanges(inputRange, outputRange) {
  return {inputRange, outputRange};
}

