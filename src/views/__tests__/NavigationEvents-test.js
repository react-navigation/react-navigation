import React from 'react';
import { View } from 'react-native';
import renderer from 'react-test-renderer';
import NavigationEvents from '../NavigationEvents';
import { NavigationProvider } from '../NavigationContext';

const createListener = () => payload => {};

// An easy way to create the 4 listeners prop
const createEventListenersProp = () => ({
  onWillFocus: createListener(),
  onDidFocus: createListener(),
  onWillBlur: createListener(),
  onDidBlur: createListener(),
});

const createNavigationAndHelpers = () => {
  // A little API to spy on subscription remove calls that are performed during the tests
  const removeCallsAPI = (() => {
    let removeCalls = [];
    return {
      reset: () => {
        removeCalls = [];
      },
      add: (name, handler) => {
        removeCalls.push({ name, handler });
      },
      checkRemoveCalled: count => {
        expect(removeCalls.length).toBe(count);
      },
      checkRemoveCalledWith: (name, handler) => {
        expect(removeCalls).toContainEqual({ name, handler });
      },
    };
  })();

  const navigation = {
    addListener: jest.fn((name, handler) => {
      return {
        remove: () => removeCallsAPI.add(name, handler),
      };
    }),
  };

  const checkAddListenerCalled = count => {
    expect(navigation.addListener).toHaveBeenCalledTimes(count);
  };
  const checkAddListenerCalledWith = (eventName, handler) => {
    expect(navigation.addListener).toHaveBeenCalledWith(eventName, handler);
  };
  const checkRemoveCalled = count => {
    removeCallsAPI.checkRemoveCalled(count);
  };
  const checkRemoveCalledWith = (eventName, handler) => {
    removeCallsAPI.checkRemoveCalledWith(eventName, handler);
  };

  return {
    navigation,
    removeCallsAPI,
    checkAddListenerCalled,
    checkAddListenerCalledWith,
    checkRemoveCalled,
    checkRemoveCalledWith,
  };
};

// We test 2 distinct ways to provide the navigation to the NavigationEvents (prop/context)
const NavigationEventsTestComp = ({
  withContext = true,
  navigation,
  ...props
}) => {
  if (withContext) {
    return (
      <NavigationProvider value={navigation}>
        <NavigationEvents {...props} />
      </NavigationProvider>
    );
  } else {
    return <NavigationEvents navigation={navigation} {...props} />;
  }
};

describe('NavigationEvents', () => {
  it('add all listeners with navigation prop', () => {
    const {
      navigation,
      checkAddListenerCalled,
      checkAddListenerCalledWith,
    } = createNavigationAndHelpers();
    const eventListenerProps = createEventListenersProp();
    const component = renderer.create(
      <NavigationEventsTestComp
        withContext={false}
        navigation={navigation}
        {...eventListenerProps}
      />
    );
    checkAddListenerCalled(4);
    checkAddListenerCalledWith('willBlur', eventListenerProps.onWillBlur);
    checkAddListenerCalledWith('willFocus', eventListenerProps.onWillFocus);
    checkAddListenerCalledWith('didBlur', eventListenerProps.onDidBlur);
    checkAddListenerCalledWith('didFocus', eventListenerProps.onDidFocus);
  });

  it('add all listeners with navigation context', () => {
    const {
      navigation,
      checkAddListenerCalled,
      checkAddListenerCalledWith,
    } = createNavigationAndHelpers();
    const eventListenerProps = createEventListenersProp();
    const component = renderer.create(
      <NavigationEventsTestComp
        withContext={true}
        navigation={navigation}
        {...eventListenerProps}
      />
    );
    checkAddListenerCalled(4);
    checkAddListenerCalledWith('willBlur', eventListenerProps.onWillBlur);
    checkAddListenerCalledWith('willFocus', eventListenerProps.onWillFocus);
    checkAddListenerCalledWith('didBlur', eventListenerProps.onDidBlur);
    checkAddListenerCalledWith('didFocus', eventListenerProps.onDidFocus);
  });

  it('remove all listeners on unmount', () => {
    const {
      navigation,
      checkRemoveCalled,
      checkRemoveCalledWith,
    } = createNavigationAndHelpers();
    const eventListenerProps = createEventListenersProp();

    const component = renderer.create(
      <NavigationEventsTestComp
        navigation={navigation}
        {...eventListenerProps}
      />
    );
    checkRemoveCalled(0);
    component.unmount();
    checkRemoveCalled(4);
    checkRemoveCalledWith('willBlur', eventListenerProps.onWillBlur);
    checkRemoveCalledWith('willFocus', eventListenerProps.onWillFocus);
    checkRemoveCalledWith('didBlur', eventListenerProps.onDidBlur);
    checkRemoveCalledWith('didFocus', eventListenerProps.onDidFocus);
  });

  it('add a single listener', () => {
    const {
      navigation,
      checkAddListenerCalled,
      checkAddListenerCalledWith,
    } = createNavigationAndHelpers();
    const listener = createListener();
    const component = renderer.create(
      <NavigationEventsTestComp navigation={navigation} onDidFocus={listener} />
    );
    checkAddListenerCalled(1);
    checkAddListenerCalledWith('didFocus', listener);
  });

  it('do not attempt to add/remove stable listeners on update', () => {
    const {
      navigation,
      checkAddListenerCalled,
      checkAddListenerCalledWith,
    } = createNavigationAndHelpers();
    const eventListenerProps = createEventListenersProp();
    const component = renderer.create(
      <NavigationEventsTestComp
        navigation={navigation}
        {...eventListenerProps}
      />
    );
    component.update(
      <NavigationEventsTestComp
        navigation={navigation}
        {...eventListenerProps}
      />
    );
    component.update(
      <NavigationEventsTestComp
        navigation={navigation}
        {...eventListenerProps}
      />
    );
    checkAddListenerCalled(4);
    checkAddListenerCalledWith('willBlur', eventListenerProps.onWillBlur);
    checkAddListenerCalledWith('willFocus', eventListenerProps.onWillFocus);
    checkAddListenerCalledWith('didBlur', eventListenerProps.onDidBlur);
    checkAddListenerCalledWith('didFocus', eventListenerProps.onDidFocus);
  });

  it('add, remove and replace (remove+add) listeners on complex updates', () => {
    const {
      navigation,
      checkAddListenerCalled,
      checkAddListenerCalledWith,
      checkRemoveCalled,
      checkRemoveCalledWith,
    } = createNavigationAndHelpers();
    const eventListenerProps = createEventListenersProp();

    const component = renderer.create(
      <NavigationEventsTestComp
        navigation={navigation}
        {...eventListenerProps}
      />
    );

    checkAddListenerCalled(4);
    checkAddListenerCalledWith('willBlur', eventListenerProps.onWillBlur);
    checkAddListenerCalledWith('willFocus', eventListenerProps.onWillFocus);
    checkAddListenerCalledWith('didBlur', eventListenerProps.onDidBlur);
    checkAddListenerCalledWith('didFocus', eventListenerProps.onDidFocus);
    checkRemoveCalled(0);

    const onWillFocus2 = createListener();
    const onDidFocus2 = createListener();

    component.update(
      <NavigationEventsTestComp
        navigation={navigation}
        onWillBlur={eventListenerProps.onWillBlur}
        onDidBlur={undefined}
        onWillFocus={onWillFocus2}
        onDidFocus={onDidFocus2}
      />
    );
    checkAddListenerCalled(6);
    checkAddListenerCalledWith('willFocus', onWillFocus2);
    checkAddListenerCalledWith('didFocus', onDidFocus2);
    checkRemoveCalled(3);
    checkRemoveCalledWith('didBlur', eventListenerProps.onDidBlur);
    checkRemoveCalledWith('willFocus', eventListenerProps.onWillFocus);
    checkRemoveCalledWith('didFocus', eventListenerProps.onDidFocus);
  });
});
