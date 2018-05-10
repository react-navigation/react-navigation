import React from 'react';
import { View } from 'react-native';
import renderer from 'react-test-renderer';
import NavigationEvents from '../NavigationEvents';
import { NavigationProvider } from '../NavigationContext';

describe('NavigationEvents', () => {
  let onWillFocus;
  let onDidFocus;
  let onWillBlur;
  let onDidBlur;
  let navigation;
  let checkAddListenerCalled;
  let checkAddListenerCalledWith;
  let TestComponent;
  let TestComponentNoContext;

  // A little API to spy on subscription remove calls
  let RemoveCallsAPI = (() => {
    let removeCalls = [];
    return {
      reset: () => {
        removeCalls = [];
      },
      add: (name, handler) => {
        removeCalls.push({ name, handler });
      },
      expectCallNumber: count => {
        expect(removeCalls.length).toBe(count);
      },
      expectCall: (name, handler) => {
        expect(removeCalls).toContainEqual({ name, handler });
      },
    };
  })();

  const createListener = () => payload => {};
  const createNavigation = () => {
    return {
      addListener: jest.fn((name, handler) => {
        return {
          remove: () => RemoveCallsAPI.add(name, handler),
        };
      }),
    };
  };

  beforeEach(() => {
    RemoveCallsAPI.reset();
    onWillFocus = createListener();
    onDidFocus = createListener();
    onWillBlur = createListener();
    onDidBlur = createListener();
    navigation = createNavigation();
    checkAddListenerCalled = count => {
      expect(navigation.addListener).toHaveBeenCalledTimes(count);
    };
    checkAddListenerCalledWith = (eventName, handler) => {
      expect(navigation.addListener).toHaveBeenCalledWith(eventName, handler);
    };

    // eslint-disable-next-line react/display-name
    TestComponent = props => (
      <NavigationProvider value={navigation}>
        <NavigationEvents
          onWillFocus={onWillFocus}
          onDidFocus={onDidFocus}
          onWillBlur={onWillBlur}
          onDidBlur={onDidBlur}
          {...props}
        />
      </NavigationProvider>
    );

    // eslint-disable-next-line react/display-name
    TestComponentNoContext = props => (
      <View>
        <NavigationEvents
          onWillFocus={onWillFocus}
          onDidFocus={onDidFocus}
          onWillBlur={onWillBlur}
          onDidBlur={onDidBlur}
          {...props}
        />
      </View>
    );
  });

  it('attach all listeners with navigation prop', () => {
    const component = renderer.create(
      <TestComponentNoContext navigation={navigation} />
    );
    checkAddListenerCalled(4);
    checkAddListenerCalledWith('willBlur', onWillBlur);
    checkAddListenerCalledWith('willFocus', onWillFocus);
    checkAddListenerCalledWith('didBlur', onDidBlur);
    checkAddListenerCalledWith('didFocus', onDidFocus);
  });

  it('attach all listeners with navigation context', () => {
    const component = renderer.create(<TestComponent />);
    checkAddListenerCalled(4);
    checkAddListenerCalledWith('willBlur', onWillBlur);
    checkAddListenerCalledWith('willFocus', onWillFocus);
    checkAddListenerCalledWith('didBlur', onDidBlur);
    checkAddListenerCalledWith('didFocus', onDidFocus);
  });

  it('remove all listeners on unmount', () => {
    const component = renderer.create(<TestComponent />);
    RemoveCallsAPI.expectCallNumber(0);
    component.unmount();
    RemoveCallsAPI.expectCallNumber(4);
    checkAddListenerCalled(4);
    RemoveCallsAPI.expectCall('willBlur', onWillBlur);
    RemoveCallsAPI.expectCall('willFocus', onWillFocus);
    RemoveCallsAPI.expectCall('didBlur', onDidBlur);
    RemoveCallsAPI.expectCall('didFocus', onDidFocus);
  });

  it('attach a single listener', () => {
    const component = renderer.create(
      <TestComponent
        onWillBlur={undefined}
        onWillFocus={undefined}
        onDidBlur={undefined}
      />
    );
    checkAddListenerCalled(1);
    checkAddListenerCalledWith('didFocus', onDidFocus);
  });

  it('do not try to reattach stable listeners on update', () => {
    const component = renderer.create(<TestComponent />);
    component.update(<TestComponent />);
    checkAddListenerCalled(4);
    checkAddListenerCalledWith('willBlur', onWillBlur);
    checkAddListenerCalledWith('willFocus', onWillFocus);
    checkAddListenerCalledWith('didBlur', onDidBlur);
    checkAddListenerCalledWith('didFocus', onDidFocus);
  });

  it('detach and reattach updated listeners on update', () => {
    const component = renderer.create(<TestComponent />);
    checkAddListenerCalled(4);
    checkAddListenerCalledWith('willBlur', onWillBlur);
    checkAddListenerCalledWith('willFocus', onWillFocus);
    checkAddListenerCalledWith('didBlur', onDidBlur);
    checkAddListenerCalledWith('didFocus', onDidFocus);
    RemoveCallsAPI.expectCallNumber(0);

    const onWillFocus2 = createListener();
    const onDidFocus2 = createListener();
    component.update(
      <TestComponent onWillFocus={onWillFocus2} onDidFocus={onDidFocus2} />
    );
    checkAddListenerCalled(6);
    checkAddListenerCalledWith('willFocus', onWillFocus2);
    checkAddListenerCalledWith('didFocus', onDidFocus2);
    RemoveCallsAPI.expectCallNumber(2);
    RemoveCallsAPI.expectCall('willFocus', onWillFocus);
    RemoveCallsAPI.expectCall('didFocus', onDidFocus);
  });
});
