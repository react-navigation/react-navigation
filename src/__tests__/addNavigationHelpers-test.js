/* @flow */

import NavigationActions from '../NavigationActions';
import addNavigationHelpers from '../addNavigationHelpers';

describe('addNavigationHelpers', () => {
  it('handles Back action', () => {
    const mockedDispatch = jest.fn(() => false).mockImplementationOnce(() => true);
    expect(addNavigationHelpers({
      state: { key: 'A', routeName: 'Home' },
      dispatch: mockedDispatch,
    }).goBack('A')).toEqual(true);
    expect(mockedDispatch).toBeCalledWith({ type: NavigationActions.BACK, key: 'A' });
    expect(mockedDispatch.mock.calls.length).toBe(1);
  });

  it('handles Back action when the key is not defined', () => {
    const mockedDispatch = jest.fn(() => false).mockImplementationOnce(() => true);
    expect(addNavigationHelpers({
      state: {},
      dispatch: mockedDispatch,
    }).goBack()).toEqual(true);
    expect(mockedDispatch).toBeCalledWith({ type: NavigationActions.BACK });
    expect(mockedDispatch.mock.calls.length).toBe(1);
  });

  it('handles Navigate action', () => {
    const mockedDispatch = jest.fn(() => false).mockImplementationOnce(() => true);
    expect(addNavigationHelpers({
      state: {},
      dispatch: mockedDispatch,
    }).navigate('Profile', { name: 'Matt' })).toEqual(true);
    expect(mockedDispatch).toBeCalledWith({
      type: NavigationActions.NAVIGATE,
      params: { name: 'Matt' },
      routeName: 'Profile',
    });
    expect(mockedDispatch.mock.calls.length).toBe(1);
  });

  it('handles SetParams action', () => {
    const mockedDispatch = jest.fn(() => false).mockImplementationOnce(() => true);
    expect(addNavigationHelpers({
      state: { key: 'B', routeName: 'Settings' },
      dispatch: mockedDispatch,
    }).setParams({ notificationsEnabled: true })).toEqual(true);
    expect(mockedDispatch).toBeCalledWith({
      type: NavigationActions.SET_PARAMS,
      key: 'B',
      params: { notificationsEnabled: true },
    });
    expect(mockedDispatch.mock.calls.length).toBe(1);
  });
});
