// @flow
import { createTransition, bindTransition } from '../Transition/transitionHelpers';
import type {
  BoundTransition,
} from '../../TypeDefinition';

export function initTestTransition(
  prop: string, 
  inputRange: ?Array<number>, 
  outputRange: Array<*>, 
  filterRegex: RegExp = /foo/): BoundTransition {
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

type StyleInterpolation = {
  inputRange?: ?Array<number>,
  outputRange: Array<*>,
}

export function assertIoRanges(actual: StyleInterpolation, expected: StyleInterpolation) {
  expect(actual.inputRange).toEqual(expected.inputRange);
  expect(actual.outputRange).toEqual(expected.outputRange);
}

export function ioRanges(inputRange: Array<number>, outputRange: Array<*>) {
  return {inputRange, outputRange};
}

