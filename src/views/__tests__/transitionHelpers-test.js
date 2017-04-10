// @flow

import { createTransition, bindTransition, convertStyleMap } from '../Transition/transitionHelpers';
import { initTestTransition, assertIoRanges, ioRanges } from './transitionTestUtils';

describe('createTransition', () => {
  it('returns styleMap based on duration: A(0.1)', () => {
    const A = initTestTransition('a', [0, 1], [100, 200]);
    const styleMap = A(0.1).getStyleMap([], []);
    const { from: { id1: { a } } } = styleMap;
    assertIoRanges(a, ioRanges([0, 0.1], [100, 200]));
  });
});

describe('convertStyleMap', () => {
  it('properly handles transform', () => {
    const styleMap = {
      from: { id1: { scale: { outputRange: [0, 1] }, translateX: { outputRange: [10, 20] } } }
    };
    const identity = (styleValue) => styleValue;
    const resultMap = convertStyleMap(styleMap, identity, 'processTransform');
    expect(resultMap.from.id1).toEqual({
      transform: [
        { scale: { outputRange: [0, 1], inputRange: [0, 1] } },
        { translateX: { outputRange: [10, 20], inputRange: [0, 1] } }]
    });
  });
  it('does not process transforms when told not to do so', () => {
    const styleMap = {
      from: { id1: { scale: { outputRange: [0, 1] }, translateX: { outputRange: [10, 20] } } }
    };
    const identity = (styleValue) => styleValue;
    const resultMap = convertStyleMap(styleMap, identity);
    expect(resultMap.from.id1).toEqual({
      scale: { outputRange: [0, 1], inputRange: [0, 1] },
      translateX: { outputRange: [10, 20], inputRange: [0, 1] }
    });
  })
})