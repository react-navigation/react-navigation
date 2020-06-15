import getFocusedRouteNameFromRoute from '../getFocusedRouteNameFromRoute';

it('gets undefined if there is no nested state', () => {
  expect(getFocusedRouteNameFromRoute({ name: 'Home' })).toBe(undefined);
});

it('gets focused route name from nested state', () => {
  expect(
    getFocusedRouteNameFromRoute({
      name: 'Home',
      state: {
        routes: [{ name: 'Article' }],
      },
    })
  ).toBe('Article');

  expect(
    getFocusedRouteNameFromRoute({
      name: 'Home',
      state: {
        index: 1,
        routes: [{ name: 'Article' }, { name: 'Chat' }, { name: 'Album' }],
      },
    })
  ).toBe('Chat');

  expect(
    getFocusedRouteNameFromRoute({
      name: 'Home',
      state: {
        routes: [{ name: 'Article' }, { name: 'Chat' }],
      },
    })
  ).toBe('Chat');

  expect(
    getFocusedRouteNameFromRoute({
      name: 'Home',
      state: {
        type: 'tab',
        routes: [{ name: 'Article' }, { name: 'Chat' }],
      },
    })
  ).toBe('Article');
});

it('gets nested screen in params if present', () => {
  expect(
    getFocusedRouteNameFromRoute({
      name: 'Home',
      params: { screen: 'Chat' },
    })
  ).toBe('Chat');

  expect(
    getFocusedRouteNameFromRoute({
      name: 'Home',
      params: { screen: 'Chat', initial: false },
    })
  ).toBe('Chat');

  expect(
    getFocusedRouteNameFromRoute({
      name: 'Home',
      params: { screen: {} },
    })
  ).toBe(undefined);
});
