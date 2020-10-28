import getChildrenNavigationCache from '../getChildrenNavigationCache';

it('should return empty table if navigation arg not provided', () => {
  expect(getChildrenNavigationCache()._childrenNavigation).toBeUndefined();
});

it('should populate navigation._childrenNavigation as a side-effect', () => {
  const navigation = {
    state: {
      routes: [{ key: 'one' }],
    },
  };
  const result = getChildrenNavigationCache(navigation);
  expect(result).toBeDefined();
  expect(navigation._childrenNavigation).toBe(result);
});

it('should delete children cache keys that are no longer valid', () => {
  const navigation = {
    state: {
      routes: [{ key: 'one' }, { key: 'two' }, { key: 'three' }],
    },
    _childrenNavigation: {
      one: {},
      two: {},
      three: {},
      four: {},
    },
  };

  const result = getChildrenNavigationCache(navigation);
  expect(result).toEqual({
    one: {},
    two: {},
    three: {},
  });
});

it('should not delete children cache keys if in transitioning state', () => {
  const navigation = {
    state: {
      routes: [{ key: 'one' }, { key: 'two' }, { key: 'three' }],
      isTransitioning: true,
    },
    _childrenNavigation: {
      one: {},
      two: {},
      three: {},
      four: {},
    },
  };

  const result = getChildrenNavigationCache(navigation);
  expect(result).toEqual({
    one: {},
    two: {},
    three: {},
    four: {},
  });
});
