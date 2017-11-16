/* @flow */

import NavigationActions from '../NavigationActions';

describe('actions', () => {
  const params = { foo: 'bar' };
  const navigateAction = NavigationActions.navigate({ routeName: 'another' });

  it('exports back action and type', () => {
    expect(NavigationActions.back.toString()).toEqual(NavigationActions.BACK);
    expect(NavigationActions.back()).toEqual({ type: NavigationActions.BACK });
    expect(NavigationActions.back({ key: 'test' })).toEqual({
      type: NavigationActions.BACK,
      key: 'test',
    });
  });

  it('exports init action and type', () => {
    expect(NavigationActions.init.toString()).toEqual(NavigationActions.INIT);
    expect(NavigationActions.init()).toEqual({ type: NavigationActions.INIT });
    expect(NavigationActions.init({ params })).toEqual({
      type: NavigationActions.INIT,
      params,
    });
  });

  it('exports navigate action and type', () => {
    expect(NavigationActions.navigate.toString()).toEqual(
      NavigationActions.NAVIGATE
    );
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

  it('exports reset action and type', () => {
    expect(NavigationActions.reset.toString()).toEqual(NavigationActions.RESET);
    expect(NavigationActions.reset({ index: 0, actions: [] })).toEqual({
      type: NavigationActions.RESET,
      index: 0,
      actions: [],
    });
    expect(
      NavigationActions.reset({
        index: 0,
        key: 'test',
        actions: [navigateAction],
      })
    ).toEqual({
      type: NavigationActions.RESET,
      index: 0,
      key: 'test',
      actions: [
        {
          type: NavigationActions.NAVIGATE,
          routeName: 'another',
        },
      ],
    });
  });

  it('exports setParams action and type', () => {
    expect(NavigationActions.setParams.toString()).toEqual(
      NavigationActions.SET_PARAMS
    );
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

  it('exports uri action and type', () => {
    expect(NavigationActions.uri.toString()).toEqual(NavigationActions.URI);
    expect(NavigationActions.uri({ uri: 'http://google.com' })).toEqual({
      type: NavigationActions.URI,
      uri: 'http://google.com',
    });
  });
});
