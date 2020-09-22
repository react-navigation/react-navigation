import NavigationStateUtils from '../StateUtils';

const routeName = 'Anything';

describe('StateUtils', () => {
  describe('get', () => {
    it('gets route', () => {
      const state = {
        index: 0,
        routes: [{ key: 'a', routeName }],
        isTransitioning: false,
      };
      expect(NavigationStateUtils.get(state, 'a')).toEqual({
        key: 'a',
        routeName,
      });
    });

    it('returns null when getting an unknown route', () => {
      const state = {
        index: 0,
        routes: [{ key: 'a', routeName }],
        isTransitioning: false,
      };
      expect(NavigationStateUtils.get(state, 'b')).toBe(null);
    });
  });

  describe('indexOf', () => {
    it('gets route index', () => {
      const state = {
        index: 1,
        routes: [
          { key: 'a', routeName },
          { key: 'b', routeName },
        ],
        isTransitioning: false,
      };
      expect(NavigationStateUtils.indexOf(state, 'a')).toBe(0);
      expect(NavigationStateUtils.indexOf(state, 'b')).toBe(1);
    });

    it('returns -1 when getting an unknown route index', () => {
      const state = {
        index: 1,
        routes: [{ key: 'a', routeName }],
        isTransitioning: false,
      };
      expect(NavigationStateUtils.indexOf(state, 'b')).toBe(-1);
    });
  });

  it('has a route', () => {
    const state = {
      index: 0,
      routes: [
        { key: 'a', routeName },
        { key: 'b', routeName },
      ],
      isTransitioning: false,
    };
    expect(NavigationStateUtils.has(state, 'b')).toBe(true);
    expect(NavigationStateUtils.has(state, 'c')).toBe(false);
  });

  describe('push', () => {
    it('pushes a route', () => {
      const state = {
        index: 0,
        routes: [{ key: 'a', routeName }],
        isTransitioning: false,
      };
      const newState = {
        index: 1,
        isTransitioning: false,
        routes: [
          { key: 'a', routeName },
          { key: 'b', routeName },
        ],
      };
      expect(NavigationStateUtils.push(state, { key: 'b', routeName })).toEqual(
        newState
      );
    });

    it('does not push duplicated route', () => {
      const state = {
        index: 0,
        routes: [{ key: 'a', routeName }],
        isTransitioning: false,
      };
      expect(() =>
        NavigationStateUtils.push(state, { key: 'a', routeName })
      ).toThrow('should not push route with duplicated key a');
    });
  });

  describe('pop', () => {
    it('pops route', () => {
      const state = {
        index: 1,
        routes: [
          { key: 'a', routeName },
          { key: 'b', routeName },
        ],
        isTransitioning: false,
      };
      const newState = {
        index: 0,
        routes: [{ key: 'a', routeName }],
        isTransitioning: false,
      };
      expect(NavigationStateUtils.pop(state)).toEqual(newState);
    });

    it('does not pop route if not applicable with single route config', () => {
      const state = {
        index: 0,
        routes: [{ key: 'a', routeName }],
        isTransitioning: false,
      };
      expect(NavigationStateUtils.pop(state)).toBe(state);
    });

    it('does not pop route if not applicable with multiple route config', () => {
      const state = {
        index: 0,
        routes: [
          { key: 'a', routeName },
          { key: 'b', routeName },
        ],
        isTransitioning: false,
      };
      expect(NavigationStateUtils.pop(state)).toBe(state);
    });
  });

  describe('jumpToIndex', () => {
    it('jumps to new index', () => {
      const state = {
        index: 0,
        routes: [
          { key: 'a', routeName },
          { key: 'b', routeName },
        ],
        isTransitioning: false,
      };
      const newState = {
        index: 1,
        routes: [
          { key: 'a', routeName },
          { key: 'b', routeName },
        ],
        isTransitioning: false,
      };
      expect(NavigationStateUtils.jumpToIndex(state, 0)).toBe(state);
      expect(NavigationStateUtils.jumpToIndex(state, 1)).toEqual(newState);
    });

    it('throws if jumps to invalid index', () => {
      const state = {
        index: 0,
        routes: [
          { key: 'a', routeName },
          { key: 'b', routeName },
        ],
        isTransitioning: false,
      };
      expect(() => NavigationStateUtils.jumpToIndex(state, 2)).toThrow(
        'invalid index 2 to jump to'
      );
    });
  });

  describe('jumpTo', () => {
    it('jumps to the current key', () => {
      const state = {
        index: 0,
        routes: [
          { key: 'a', routeName },
          { key: 'b', routeName },
        ],
        isTransitioning: false,
      };
      expect(NavigationStateUtils.jumpTo(state, 'a')).toBe(state);
    });

    it('jumps to new key', () => {
      const state = {
        index: 0,
        routes: [
          { key: 'a', routeName },
          { key: 'b', routeName },
        ],
        isTransitioning: false,
      };
      const newState = {
        index: 1,
        routes: [
          { key: 'a', routeName },
          { key: 'b', routeName },
        ],
        isTransitioning: false,
      };
      expect(NavigationStateUtils.jumpTo(state, 'b')).toEqual(newState);
    });

    it('throws if jumps to invalid key', () => {
      const state = {
        index: 0,
        routes: [
          { key: 'a', routeName },
          { key: 'b', routeName },
        ],
        isTransitioning: false,
      };
      expect(() => NavigationStateUtils.jumpTo(state, 'c')).toThrow(
        'attempt to jump to unknown key "c"'
      );
    });
  });

  describe('back', () => {
    it('move backwards', () => {
      const state = {
        index: 1,
        routes: [
          { key: 'a', routeName },
          { key: 'b', routeName },
        ],
        isTransitioning: false,
      };
      const newState = {
        index: 0,
        routes: [
          { key: 'a', routeName },
          { key: 'b', routeName },
        ],
        isTransitioning: false,
      };
      expect(NavigationStateUtils.back(state)).toEqual(newState);
    });

    it('does not move backwards when the active route is the first', () => {
      const state = {
        index: 0,
        routes: [
          { key: 'a', routeName },
          { key: 'b', routeName },
        ],
        isTransitioning: false,
      };
      expect(NavigationStateUtils.back(state)).toBe(state);
    });
  });

  describe('forward', () => {
    it('move forwards', () => {
      const state = {
        index: 0,
        routes: [
          { key: 'a', routeName },
          { key: 'b', routeName },
        ],
        isTransitioning: false,
      };
      const newState = {
        index: 1,
        routes: [
          { key: 'a', routeName },
          { key: 'b', routeName },
        ],
        isTransitioning: false,
      };
      expect(NavigationStateUtils.forward(state)).toEqual(newState);
    });

    it('does not move forward when active route is already the top-most', () => {
      const state = {
        index: 1,
        routes: [
          { key: 'a', routeName },
          { key: 'b', routeName },
        ],
        isTransitioning: false,
      };
      expect(NavigationStateUtils.forward(state)).toEqual(state);
    });
  });

  describe('replace', () => {
    it('Replaces by key', () => {
      const state = {
        index: 0,
        routes: [
          { key: 'a', routeName },
          { key: 'b', routeName },
        ],
        isTransitioning: false,
      };
      const newState = {
        index: 1,
        routes: [
          { key: 'a', routeName },
          { key: 'c', routeName },
        ],
        isTransitioning: false,
      };
      expect(
        NavigationStateUtils.replaceAt(state, 'b', { key: 'c', routeName })
      ).toEqual(newState);
    });

    it('Replaces by index', () => {
      const state = {
        index: 0,
        routes: [
          { key: 'a', routeName },
          { key: 'b', routeName },
        ],
        isTransitioning: false,
      };
      const newState = {
        index: 1,
        routes: [
          { key: 'a', routeName },
          { key: 'c', routeName },
        ],
        isTransitioning: false,
      };
      expect(
        NavigationStateUtils.replaceAtIndex(state, 1, { key: 'c', routeName })
      ).toEqual(newState);
    });

    it('Returns the state with updated index if route is unchanged but index changes', () => {
      const state = {
        index: 0,
        routes: [
          { key: 'a', routeName },
          { key: 'b', routeName },
        ],
        isTransitioning: false,
      };
      expect(
        NavigationStateUtils.replaceAtIndex(state, 1, state.routes[1])
      ).toEqual({ ...state, index: 1 });
    });
  });

  describe('reset', () => {
    it('Resets routes', () => {
      const state = {
        index: 0,
        routes: [
          { key: 'a', routeName },
          { key: 'b', routeName },
        ],
        isTransitioning: false,
      };
      const newState = {
        index: 1,
        routes: [
          { key: 'x', routeName },
          { key: 'y', routeName },
        ],
        isTransitioning: false,
      };
      expect(
        NavigationStateUtils.reset(state, [
          { key: 'x', routeName },
          { key: 'y', routeName },
        ])
      ).toEqual(newState);
    });

    it('throws when attempting to set empty state', () => {
      const state = {
        index: 0,
        routes: [
          { key: 'a', routeName },
          { key: 'b', routeName },
        ],
        isTransitioning: false,
      };
      expect(() => {
        NavigationStateUtils.reset(state, []);
      }).toThrow('invalid routes to replace');
    });

    it('Resets routes with index', () => {
      const state = {
        index: 0,
        routes: [
          { key: 'a', routeName },
          { key: 'b', routeName },
        ],
        isTransitioning: false,
      };
      const newState = {
        index: 0,
        routes: [
          { key: 'x', routeName },
          { key: 'y', routeName },
        ],
        isTransitioning: false,
      };
      expect(
        NavigationStateUtils.reset(
          state,
          [
            { key: 'x', routeName },
            { key: 'y', routeName },
          ],
          0
        )
      ).toEqual(newState);

      expect(() => {
        NavigationStateUtils.reset(
          state,
          [
            { key: 'x', routeName },
            { key: 'y', routeName },
          ],
          100
        );
      }).toThrow('invalid index 100 to reset');
    });

    it('throws when attempting to set an out of range route index', () => {
      const state = {
        index: 0,
        routes: [
          { key: 'a', routeName },
          { key: 'b', routeName },
        ],
        isTransitioning: false,
      };
      expect(() => {
        NavigationStateUtils.reset(
          state,
          [
            { key: 'x', routeName },
            { key: 'y', routeName },
          ],
          100
        );
      }).toThrow('invalid index 100 to reset');
    });
  });
});
