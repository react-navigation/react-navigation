import NavigationActions from '../NavigationActions';

describe('generic navigation actions', () => {
  const params = { foo: 'bar' };
  const navigateAction = NavigationActions.navigate({ routeName: 'another' });

  it('exports back action and type', () => {
    expect(NavigationActions.back()).toEqual({ type: NavigationActions.BACK });
    expect(NavigationActions.back({ key: 'test' })).toEqual({
      type: NavigationActions.BACK,
      key: 'test',
    });
  });

  it('exports init action and type', () => {
    expect(NavigationActions.init()).toEqual({ type: NavigationActions.INIT });
    expect(NavigationActions.init({ params })).toEqual({
      type: NavigationActions.INIT,
      params,
    });
  });

  it('exports navigate action and type', () => {
    expect(NavigationActions.navigate({ routeName: 'test' })).toEqual({
      type: NavigationActions.NAVIGATE,
      routeName: 'test',
    });
    expect(
      NavigationActions.navigate({
        routeName: 'test',
        params,
        action: navigateAction,
      })
    ).toEqual({
      type: NavigationActions.NAVIGATE,
      routeName: 'test',
      params,
      action: {
        type: NavigationActions.NAVIGATE,
        routeName: 'another',
      },
    });
  });

  it('exports setParams action and type', () => {
    expect(
      NavigationActions.setParams({
        key: 'test',
        params,
      })
    ).toEqual({
      type: NavigationActions.SET_PARAMS,
      key: 'test',
      params,
    });
  });
});
