/* @flow */

import NavigationStateUtils from '../StateUtils';

const routeName = 'Anything';

describe('StateUtils', () => {
  // Getters
  it('gets route', () => {
    const state = { index: 0, routes: [{ key: 'a', routeName }] };
    expect(NavigationStateUtils.get(state, 'a')).toEqual({
      key: 'a',
      routeName,
    });
    expect(NavigationStateUtils.get(state, 'b')).toBe(null);
  });

  it('gets route index', () => {
    const state = {
      index: 1,
      routes: [{ key: 'a', routeName }, { key: 'b', routeName }],
    };
    expect(NavigationStateUtils.indexOf(state, 'a')).toBe(0);
    expect(NavigationStateUtils.indexOf(state, 'b')).toBe(1);
    expect(NavigationStateUtils.indexOf(state, 'c')).toBe(-1);
  });

  it('has a route', () => {
    const state = {
      index: 0,
      routes: [{ key: 'a', routeName }, { key: 'b', routeName }],
    };
    expect(NavigationStateUtils.has(state, 'b')).toBe(true);
    expect(NavigationStateUtils.has(state, 'c')).toBe(false);
  });

  // Push
  it('pushes a route', () => {
    const state = { index: 0, routes: [{ key: 'a', routeName }] };
    const newState = {
      index: 1,
      routes: [{ key: 'a', routeName }, { key: 'b', routeName }],
    };
    expect(NavigationStateUtils.push(state, { key: 'b', routeName })).toEqual(
      newState
    );
  });

  it('does not push duplicated route', () => {
    const state = { index: 0, routes: [{ key: 'a', routeName }] };
    expect(() =>
      NavigationStateUtils.push(state, { key: 'a', routeName })
    ).toThrow();
  });

  // Pop
  it('pops route', () => {
    const state = {
      index: 1,
      routes: [{ key: 'a', routeName }, { key: 'b', routeName }],
    };
    const newState = { index: 0, routes: [{ key: 'a', routeName }] };
    expect(NavigationStateUtils.pop(state)).toEqual(newState);
  });

  it('does not pop route if not applicable', () => {
    const state = { index: 0, routes: [{ key: 'a', routeName }] };
    expect(NavigationStateUtils.pop(state)).toBe(state);
  });

  // Jump
  it('jumps to new index', () => {
    const state = {
      index: 0,
      routes: [{ key: 'a', routeName }, { key: 'b', routeName }],
    };
    const newState = {
      index: 1,
      routes: [{ key: 'a', routeName }, { key: 'b', routeName }],
    };
    expect(NavigationStateUtils.jumpToIndex(state, 0)).toBe(state);
    expect(NavigationStateUtils.jumpToIndex(state, 1)).toEqual(newState);
  });

  it('throws if jumps to invalid index', () => {
    const state = {
      index: 0,
      routes: [{ key: 'a', routeName }, { key: 'b', routeName }],
    };
    expect(() => NavigationStateUtils.jumpToIndex(state, 2)).toThrow();
  });

  it('jumps to new key', () => {
    const state = {
      index: 0,
      routes: [{ key: 'a', routeName }, { key: 'b', routeName }],
    };
    const newState = {
      index: 1,
      routes: [{ key: 'a', routeName }, { key: 'b', routeName }],
    };
    expect(NavigationStateUtils.jumpTo(state, 'a')).toBe(state);
    expect(NavigationStateUtils.jumpTo(state, 'b')).toEqual(newState);
  });

  it('throws if jumps to invalid key', () => {
    const state = {
      index: 0,
      routes: [{ key: 'a', routeName }, { key: 'b', routeName }],
    };
    expect(() => NavigationStateUtils.jumpTo(state, 'c')).toThrow();
  });

  it('move backwards', () => {
    const state = {
      index: 1,
      routes: [{ key: 'a', routeName }, { key: 'b', routeName }],
    };
    const newState = {
      index: 0,
      routes: [{ key: 'a', routeName }, { key: 'b', routeName }],
    };
    expect(NavigationStateUtils.back(state)).toEqual(newState);
    expect(NavigationStateUtils.back(newState)).toBe(newState);
  });

  it('move forwards', () => {
    const state = {
      index: 0,
      routes: [{ key: 'a', routeName }, { key: 'b', routeName }],
    };
    const newState = {
      index: 1,
      routes: [{ key: 'a', routeName }, { key: 'b', routeName }],
    };
    expect(NavigationStateUtils.forward(state)).toEqual(newState);
    expect(NavigationStateUtils.forward(newState)).toBe(newState);
  });

  // Replace
  it('Replaces by key', () => {
    const state = {
      index: 0,
      routes: [{ key: 'a', routeName }, { key: 'b', routeName }],
    };
    const newState = {
      index: 1,
      routes: [{ key: 'a', routeName }, { key: 'c', routeName }],
    };
    expect(
      NavigationStateUtils.replaceAt(state, 'b', { key: 'c', routeName })
    ).toEqual(newState);
  });

  it('Replaces by index', () => {
    const state = {
      index: 0,
      routes: [{ key: 'a', routeName }, { key: 'b', routeName }],
    };
    const newState = {
      index: 1,
      routes: [{ key: 'a', routeName }, { key: 'c', routeName }],
    };
    expect(
      NavigationStateUtils.replaceAtIndex(state, 1, { key: 'c', routeName })
    ).toEqual(newState);
  });

  it('Returns the state if index matches the route', () => {
    const state = {
      index: 0,
      routes: [{ key: 'a', routeName }, { key: 'b', routeName }],
    };
    expect(
      NavigationStateUtils.replaceAtIndex(state, 1, state.routes[1])
    ).toEqual(state);
  });

  // Reset
  it('Resets routes', () => {
    const state = {
      index: 0,
      routes: [{ key: 'a', routeName }, { key: 'b', routeName }],
    };
    const newState = {
      index: 1,
      routes: [{ key: 'x', routeName }, { key: 'y', routeName }],
    };
    expect(
      NavigationStateUtils.reset(state, [
        { key: 'x', routeName },
        { key: 'y', routeName },
      ])
    ).toEqual(newState);

    expect(() => {
      NavigationStateUtils.reset(state, []);
    }).toThrow();
  });

  it('Resets routes with index', () => {
    const state = {
      index: 0,
      routes: [{ key: 'a', routeName }, { key: 'b', routeName }],
    };
    const newState = {
      index: 0,
      routes: [{ key: 'x', routeName }, { key: 'y', routeName }],
    };
    expect(
      NavigationStateUtils.reset(
        state,
        [{ key: 'x', routeName }, { key: 'y', routeName }],
        0
      )
    ).toEqual(newState);

    expect(() => {
      NavigationStateUtils.reset(
        state,
        [{ key: 'x', routeName }, { key: 'y', routeName }],
        100
      );
    }).toThrow();
  });
});
