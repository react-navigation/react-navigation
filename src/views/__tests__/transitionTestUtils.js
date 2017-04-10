// @flow
import { Animated } from 'react-native';
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
          id1: {[prop]: {inputRange, outputRange,} },
        }
      }
    }
  });
  return bindTransition(transition, filterRegex);
}

type StyleInterpolation = {
  inputRange ?: ?Array < number >,
  outputRange: Array<*>,
}

export function assertIoRanges(actual: StyleInterpolation, expected: StyleInterpolation) {
  expect(actual.inputRange).toEqual(expected.inputRange);
  expect(actual.outputRange).toEqual(expected.outputRange);
}

export function ioRanges(inputRange: Array<number>, outputRange: Array<*>) {
  return {inputRange, outputRange};
}

export const stubTransitionSceneProps = {
  layout: {
    height: new Animated.Value(0),
    initHeight: 1,
    initWidth: 1,
    isMeasured: true,
    width: new Animated.Value(0),
  },
  navigationState: {
    index: 0,
    routes: [],
  },
  position: new Animated.Value(0),
  progress: new Animated.Value(0),
  scenes: [],
  scene: {
    index: 0,
    isActive: true,
    isStale: false,
    key: 'a',
    route: {
      key: 'k',
      routeName: 'route',
    },
  },
  index: 0,
  navigation: {
    state: { index: 0 },
    dispatch: () => true,
    goBack: () => true,
    navigate: () => true,
    setParams: () => true,
  },
};