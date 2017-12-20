/* @flow */

import NavigationActions from '../NavigationActions';
import addNavigationHelpers from '../addNavigationHelpers';

describe('addNavigationHelpers', () => {
  it('handles Back action', () => {
    const mockedDispatch = jest
      .fn(() => false)
      .mockImplementationOnce(() => true);
    expect(
      addNavigationHelpers({
        state: { key: 'A', routeName: 'Home' },
        dispatch: mockedDispatch,
      }).goBack('A')
    ).toEqual(true);
    expect(mockedDispatch).toBeCalledWith({
      type: NavigationActions.BACK,
      key: 'A',
    });
    expect(mockedDispatch.mock.calls.length).toBe(1);
  });

  it('handles Back action when the key is not defined', () => {
    const mockedDispatch = jest
      .fn(() => false)
      .mockImplementationOnce(() => true);
    expect(
      addNavigationHelpers({
        state: { routeName: 'Home' },
        dispatch: mockedDispatch,
      }).goBack()
    ).toEqual(true);
    expect(mockedDispatch).toBeCalledWith({ type: NavigationActions.BACK });
    expect(mockedDispatch.mock.calls.length).toBe(1);
  });

  it('handles Navigate action', () => {
    const mockedDispatch = jest
      .fn(() => false)
      .mockImplementationOnce(() => true);
    expect(
      addNavigationHelpers({
        state: { routeName: 'Home' },
        dispatch: mockedDispatch,
      }).navigate('Profile', { name: 'Matt' })
    ).toEqual(true);
    expect(mockedDispatch).toBeCalledWith({
      type: NavigationActions.NAVIGATE,
      params: { name: 'Matt' },
      routeName: 'Profile',
    });
    expect(mockedDispatch.mock.calls.length).toBe(1);
  });

  it('handles SetParams action', () => {
    const mockedDispatch = jest
      .fn(() => false)
      .mockImplementationOnce(() => true);
    expect(
      addNavigationHelpers({
        state: { key: 'B', routeName: 'Settings' },
        dispatch: mockedDispatch,
      }).setParams({ notificationsEnabled: 'yes' })
    ).toEqual(true);
    expect(mockedDispatch).toBeCalledWith({
      type: NavigationActions.SET_PARAMS,
      key: 'B',
      params: { notificationsEnabled: 'yes' },
    });
    expect(mockedDispatch.mock.calls.length).toBe(1);
  });

  it('handles Pop action', () => {
    const mockedDispatch = jest
      .fn(() => false)
      .mockImplementationOnce(() => true);

    expect(
      addNavigationHelpers({
        state: { key: 'A', routeName: 'Home' },
        dispatch: mockedDispatch,
      }).pop(1)
    ).toEqual(true);
    expect(mockedDispatch).toBeCalledWith({
      type: NavigationActions.POP,
      numberOfScreens: 1,
    });
    expect(mockedDispatch.mock.calls.length).toBe(1);
  });

  it('handles Pop action when the number of screens is not defined', () => {
    const mockedDispatch = jest
      .fn(() => false)
      .mockImplementationOnce(() => true);

    expect(
      addNavigationHelpers({
        state: { key: 'A', routeName: 'Home' },
        dispatch: mockedDispatch,
      }).pop()
    ).toEqual(true);
    expect(mockedDispatch).toBeCalledWith({
      type: NavigationActions.POP,
    });
    expect(mockedDispatch.mock.calls.length).toBe(1);
  });

  it('handles PopToTop action', () => {
    const mockedDispatch = jest
      .fn(() => false)
      .mockImplementationOnce(() => true);

    expect(
      addNavigationHelpers({
        state: { key: 'A', routeName: 'Home' },
        dispatch: mockedDispatch,
      }).popToTop()
    ).toEqual(true);
    expect(mockedDispatch).toBeCalledWith({
      type: NavigationActions.POP_TO_TOP,
    });
    expect(mockedDispatch.mock.calls.length).toBe(1);
  });
});
