/* @flow */

import actions from '../actions';

describe('actions', () => {
  const data = { foo: 'bar' };

  it('exports back action and type', () => {
    expect(actions.back()).toEqual({ type: actions.BACK });
    expect(actions.back(data)).toEqual({ type: actions.BACK, ...data });
  });

  it('exports init action and type', () => {
    expect(actions.init()).toEqual({ type: actions.INIT });
    expect(actions.init(data)).toEqual({ type: actions.INIT, ...data });
  });

  it('exports navigate action and type', () => {
    expect(actions.navigate()).toEqual({ type: actions.NAVIGATE });
    expect(actions.navigate(data)).toEqual({ type: actions.NAVIGATE, ...data });
  });

  it('exports reset action and type', () => {
    expect(actions.reset()).toEqual({ type: actions.RESET });
    expect(actions.reset(data)).toEqual({ type: actions.RESET, ...data });
  });

  it('exports setParams action and type', () => {
    expect(actions.setParams()).toEqual({ type: actions.SET_PARAMS });
    expect(actions.setParams(data)).toEqual({ type: actions.SET_PARAMS, ...data });
  });

  it('exports uri action and type', () => {
    expect(actions.uri()).toEqual({ type: actions.URI });
    expect(actions.uri(data)).toEqual({ type: actions.URI, ...data });
  });
});
