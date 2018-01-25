import NavigationActions from '../NavigationActions';
import addNavigationHelpers from '../addNavigationHelpers';

const dummyEventSubscriber = (name: string, handler: (*) => void) => ({
  remove: () => {},
});

describe('addNavigationHelpers', () => {
  it('handles Back action', () => {
    const mockedDispatch = jest
      .fn(() => false)
      .mockImplementationOnce(() => true);
    expect(
      addNavigationHelpers({
        state: { key: 'A', routeName: 'Home' },
        dispatch: mockedDispatch,
        addListener: dummyEventSubscriber,
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
        addListener: dummyEventSubscriber,
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
        addListener: dummyEventSubscriber,
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
        addListener: dummyEventSubscriber,
      }).setParams({ notificationsEnabled: 'yes' })
    ).toEqual(true);
    expect(mockedDispatch).toBeCalledWith({
      type: NavigationActions.SET_PARAMS,
      key: 'B',
      params: { notificationsEnabled: 'yes' },
    });
    expect(mockedDispatch.mock.calls.length).toBe(1);
  });
});
