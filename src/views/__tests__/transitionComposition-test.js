// @flow

import { together, sequence } from '../Transition/composition';
import { createTransition, bindTransition } from '../Transition/transitionHelpers';
import { initTestTransition, assertIoRanges, ioRanges } from './transitionTestUtils';

describe('together', () => {
  it('accepts the union of ids that are accepted by all composed transitions', () => {
    const dummy = createTransition({});
    const t1 = bindTransition(dummy, /foo/);
    const t2 = bindTransition(dummy, /bar/);
    const composed = together(t1(), t2());
    expect(composed.filter('foo')).toBe(true);
    expect(composed.filter('bar')).toBe(true);
    expect(composed.filter('blue2')).toBe(false);
  });
  it('only passes matching items to a child transition');
  it('styleMap: [A(0.1), B(0.5)]', () => {
    const a1 = 100, a2 = 200, b1 = 1000, b2 = 2000;
    const A = initTestTransition('a', null, [a1, a2]);
    const B = initTestTransition('b', null, [b1, b2]);
    const combined = together(A(0.1), B(0.5));
    const styleMap = combined.getStyleMap([], []);
    const { from: {id1: {a, b}}} = styleMap;
    assertIoRanges(a, {inputRange: [0, 0.1], outputRange: [a1, a2]});
    assertIoRanges(b, {inputRange: [0, 0.5], outputRange: [b1, b2]});
  });
});

describe('sequence', () => {
  it('A(0.1) => B(0.2)', () => {
    const a1 = 100, a2 = 200, b1 = 1000, b2 = 2000;
    const A = initTestTransition('a', null, [a1, a2]);
    const B = initTestTransition('b', null, [b1, b2]);
    const combined = sequence(A(0.1), B(0.2));
    const styleMap = combined.getStyleMap([], []);
    const { from: {id1: {a, b}}} = styleMap;
    assertIoRanges(a, {inputRange: [0, 0.1], outputRange: [a1, a2]});
    assertIoRanges(b, {inputRange: [0.1, 0.3], outputRange: [b1, b2]});
  });  
  it('A(0.1) => B(0.2) => C(0.4)', () => {
    const a1 = 100, a2 = 200, b1 = 1000, b2 = 2000, c1 = 10000, c2 = 20000;
    const A = initTestTransition('a', null, [a1, a2]);
    const B = initTestTransition('b', null, [b1, b2]);
    const C = initTestTransition('c', null, [c1, c2]);
    const combined = sequence(A(0.1), B(0.2), C(0.3));
    const styleMap = combined.getStyleMap([], []);
    const { from: {id1: {a, b, c}}} = styleMap;
    assertIoRanges(a, {inputRange: [0, 0.1], outputRange: [a1, a2]});
    assertIoRanges(b, {inputRange: [0.1, 0.3], outputRange: [b1, b2]});
    assertIoRanges(c, {inputRange: [0.3, 0.6], outputRange: [c1, c2]});
  });
  it('A(0.1) => (B(0.2) => C(0.4))', () => {
    const a1 = 100, a2 = 200, b1 = 1000, b2 = 2000, c1 = 10000, c2 = 20000;
    const A = initTestTransition('a', null, [a1, a2]);
    const B = initTestTransition('b', null, [b1, b2]);
    const C = initTestTransition('c', null, [c1, c2]);
    const combined = sequence(A(0.1), sequence(B(0.2), C(0.3)));
    const styleMap = combined.getStyleMap([], []);
    const { from: {id1: {a, b, c}}} = styleMap;
    assertIoRanges(a, {inputRange: [0, 0.1], outputRange: [a1, a2]});
    assertIoRanges(b, {inputRange: [0.1, 0.3], outputRange: [b1, b2]});
    assertIoRanges(c, {inputRange: [0.3, 0.6], outputRange: [c1, c2]});
  });
  it('A(0.1) => A2(0.2)');
  it('A(0.1) => (B(0.2) => A2(0.4))');
  it('A() => B()');
  it('A(0.1) => B(0.2) => A2(0.4)');
  it('A(0.5) => B(0.9)');
  it('customized inputRange');
});

describe('Mixing together and sequence', () => {
  it('A(0.1) => [B(0.2), C(0.4)]', () => {
    const a1 = 100, a2 = 200, b1 = 1000, b2 = 2000, c1 = 10000, c2 = 20000;
    const A = initTestTransition('a', null, [a1, a2]);
    const B = initTestTransition('b', null, [b1, b2]);
    const C = initTestTransition('c', null, [c1, c2]);
    const combined = sequence(A(0.1), together(B(0.2), C(0.4)));
    const styleMap = combined.getStyleMap([], []);
    const { from: {id1: {a, b, c}}} = styleMap;
    assertIoRanges(a, {inputRange: [0, 0.1], outputRange: [a1, a2]});
    assertIoRanges(b, {inputRange: [0.1, 0.3], outputRange: [b1, b2]});
    assertIoRanges(c, {inputRange: [0.1, 0.5], outputRange: [c1, c2]});
  });
  it('[A(0.1), B(0.2)] => C(0.4)', () => {
    const a1 = 100, a2 = 200, b1 = 1000, b2 = 2000, c1 = 10000, c2 = 20000;
    const A = initTestTransition('a', null, [a1, a2]);
    const B = initTestTransition('b', null, [b1, b2]);
    const C = initTestTransition('c', null, [c1, c2]);
    const combined = sequence(together(A(0.1), B(0.2)), C(0.4));
    const styleMap = combined.getStyleMap([], []);
    const { from: {id1: {a, b, c}}} = styleMap;
    assertIoRanges(a, {inputRange: [0, 0.1], outputRange: [a1, a2]});
    assertIoRanges(b, {inputRange: [0, 0.2], outputRange: [b1, b2]});
    assertIoRanges(c, {inputRange: [0.2, 0.6], outputRange: [c1, c2]});
  });
});

/*

A => { a: [a1, a2] }
B => { b: [b1, b2] }
A2 => { a: [a3, a4] }

====== [A(), B()]
A(): {
  duration: 1,
  style: {
    a: { outputRange: [a1, a2] }
  }
}
B(): {
  duration: 1,
  style: {
    b: { outputRange: [b1, b2] }
  }
}
[A(), B()]: {
  duration: 1,
  style: {
    a: { outputRange: [a1, a2]},
    b: { outputRange: [b1, b2]},
  }
}

a = position.interpolate({
  inputRange: [pos, pos + delta],
  outputRange: [a1, a2]
})
b = position.interpolate({
  inputRange: [pos, pos + delta],
  outputRange: [b1, b2]
})

====== A(0.1) => B(0.2)
A(0.1): {
  duration: 0.1,
  style:...
}
B(0.2): {
  duration: 0.2,
  style:...
}
A(0.1) => B(0.2): {
  duration: [0.1, 0.2]
}

==

{
  from: {
    id1: {
      a: { inputRange: [0, 0.1], outputRange: [a1, a2]},
      b: { inputRange: [0.1, 0.3], outputRange: [b1, b2]}
    }
  }
}

==

a = position.interpolate({
  inputRange: [pos, pos + 0.1 * delta],
  outputRange: [a1, a2]
})

b = position.interpolate({
  inputRange: [pos, pos + 0.1 * delta, pos + 0.3 * delta],
  outputRange: [b1, b1, b2]
})

====== [A(), A2()]
a = position.interpolate({
  inputRange: [pos, pos + delta],
  outputRange: [a3, a4]
})

====== A() => A2()
a = position.interpolate({
  inputRange: [pos, pos + 0.4999 * delta, pos + 0.5*delta, pos + delta],
  outputRange: [a1, a2, a3, a4]
})

====== I(0.8) => A()
I() => {}
a = position.interpolate({
  inputRange: [pos, pos + 0.8 * delta, pos + delta],
  outputRange: [a1, a1, a2]
})

====== A1() => A2() => A3()
A1() => { a: [a1, a2] }
A2() => { a: [a2, a3] }
A3() => { a: [a3, a4] }

a = position.interpolate({
  inputRange: [pos, pos + 0.33 * delta, pos + 0.66 * delta, pos + delta],
  outputRange: [a1, a2, a3, a4]
})

====== [A(), 0.9 => B())]

A() => { a: [a1, a2] }
B() => { b: [b1, b2] }

a = position.interpolate({
  inputRange: [pos, pos + delta],
  outputRange: [a1, a2],
})

b = position.interpolate({
  inputRange: [pos, pos + 0.9 * delta, pos + delta],
  outputRange: [b1, b1, b2]
})

====== [ AB(), 0.5 => B() ]
AB() => { a: [a1, a2], b: [b1, b2]}
B() => { b: [b3, b4] }

a = ...
b = position.interpolate({
  inputRange: [pos, pos + delta* 0.4999, pos + delta * 0.5, pos + delta],
  outputRange: [b1, b2, b3, b4]
})

// TODO: How to combine multiple easing functions?
*/