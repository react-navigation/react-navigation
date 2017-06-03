/* @flow */

import NavigationActions from '../NavigationActions';

describe('actions', () => {
  const data = { foo: 'bar' };

  it('exports back action and type', () => {
    expect(NavigationActions.back()).toEqual({ type: NavigationActions.BACK });
    expect(NavigationActions.back(data)).toEqual({
      type: NavigationActions.BACK,
      ...data,
    });
  });

  it('exports init action and type', () => {
    expect(NavigationActions.init()).toEqual({ type: NavigationActions.INIT });
    expect(NavigationActions.init(data)).toEqual({
      type: NavigationActions.INIT,
      ...data,
    });
  });

  it('exports navigate action and type', () => {
    expect(NavigationActions.navigate()).toEqual({
      type: NavigationActions.NAVIGATE,
    });
    expect(NavigationActions.navigate(data)).toEqual({
      type: NavigationActions.NAVIGATE,
      ...data,
    });
  });

  it('exports reset action and type', () => {
    expect(NavigationActions.reset()).toEqual({
      type: NavigationActions.RESET,
    });
    expect(NavigationActions.reset(data)).toEqual({
      type: NavigationActions.RESET,
      ...data,
    });
  });

  it('exports setParams action and type', () => {
    expect(NavigationActions.setParams()).toEqual({
      type: NavigationActions.SET_PARAMS,
    });
    expect(NavigationActions.setParams(data)).toEqual({
      type: NavigationActions.SET_PARAMS,
      ...data,
    });
  });

  it('exports uri action and type', () => {
    expect(NavigationActions.uri()).toEqual({ type: NavigationActions.URI });
    expect(NavigationActions.uri(data)).toEqual({
      type: NavigationActions.URI,
      ...data,
    });
  });
});
