import * as React from 'react';
import renderer from 'react-test-renderer';
import NavigationEvents from '../NavigationEvents';
import NavigationContext from '../NavigationContext';

const createPropListener = () => jest.fn();

const EVENT_TO_PROP_NAME = {
  willFocus: 'onWillFocus',
  didFocus: 'onDidFocus',
  willBlur: 'onWillBlur',
  didBlur: 'onDidBlur',
};

// An easy way to create the 4 listeners prop
const createEventListenersProp = () => ({
  onWillFocus: createPropListener(),
  onDidFocus: createPropListener(),
  onWillBlur: createPropListener(),
  onDidBlur: createPropListener(),
});

const createTestNavigationAndHelpers = () => {
  const NavigationListenersAPI = (() => {
    let listeners = {
      willFocus: [],
      didFocus: [],
      willBlur: [],
      didBlur: [],
    };
    return {
      add: (eventName, handler) => {
        listeners[eventName].push(handler);
      },
      remove: (eventName, handler) => {
        listeners[eventName] = listeners[eventName].filter(
          (h) => h !== handler
        );
      },
      get: (eventName) => {
        return listeners[eventName];
      },
      call: (eventName) => {
        listeners[eventName].forEach((listener) => listener());
      },
    };
  })();

  const navigation = {
    addListener: jest.fn((eventName, handler) => {
      NavigationListenersAPI.add(eventName, handler);
      return {
        remove: () => NavigationListenersAPI.remove(eventName, handler),
      };
    }),
  };

  return {
    navigation,
    NavigationListenersAPI,
  };
};

describe('NavigationEvents', () => {
  it('add all listeners on mount and remove them on unmount, even without any event prop provided (see #5058)', () => {
    const {
      navigation,
      NavigationListenersAPI,
    } = createTestNavigationAndHelpers();

    const component = renderer.create(
      <NavigationEvents navigation={navigation} />
    );
    expect(NavigationListenersAPI.get('willFocus').length).toBe(1);
    expect(NavigationListenersAPI.get('didFocus').length).toBe(1);
    expect(NavigationListenersAPI.get('willBlur').length).toBe(1);
    expect(NavigationListenersAPI.get('didBlur').length).toBe(1);

    component.unmount();
    expect(NavigationListenersAPI.get('willFocus').length).toBe(0);
    expect(NavigationListenersAPI.get('didFocus').length).toBe(0);
    expect(NavigationListenersAPI.get('willBlur').length).toBe(0);
    expect(NavigationListenersAPI.get('didBlur').length).toBe(0);
  });

  it('support context-provided navigation', () => {
    const {
      navigation,
      NavigationListenersAPI,
    } = createTestNavigationAndHelpers();
    const component = renderer.create(
      <NavigationContext.Provider value={navigation}>
        <NavigationEvents />
      </NavigationContext.Provider>
    );

    expect(NavigationListenersAPI.get('willFocus').length).toBe(1);
    expect(NavigationListenersAPI.get('didFocus').length).toBe(1);
    expect(NavigationListenersAPI.get('willBlur').length).toBe(1);
    expect(NavigationListenersAPI.get('didBlur').length).toBe(1);

    component.unmount();
    expect(NavigationListenersAPI.get('willFocus').length).toBe(0);
    expect(NavigationListenersAPI.get('didFocus').length).toBe(0);
    expect(NavigationListenersAPI.get('willBlur').length).toBe(0);
    expect(NavigationListenersAPI.get('didBlur').length).toBe(0);
  });

  it('wire props listeners to navigation listeners', () => {
    const {
      navigation,
      NavigationListenersAPI,
    } = createTestNavigationAndHelpers();

    const eventListenerProps = createEventListenersProp();
    renderer.create(
      <NavigationEvents navigation={navigation} {...eventListenerProps} />
    );

    const checkPropListenerIsCalled = (eventName, propName) => {
      expect(eventListenerProps[propName]).toHaveBeenCalledTimes(0);
      NavigationListenersAPI.call(eventName);
      expect(eventListenerProps[propName]).toHaveBeenCalledTimes(1);
    };

    checkPropListenerIsCalled('willFocus', 'onWillFocus');
    checkPropListenerIsCalled('didFocus', 'onDidFocus');
    checkPropListenerIsCalled('willBlur', 'onWillBlur');
    checkPropListenerIsCalled('didBlur', 'onDidBlur');
  });

  it('wires props listeners to latest navigation updates', () => {
    const {
      navigation,
      NavigationListenersAPI,
    } = createTestNavigationAndHelpers();
    const {
      navigation: nextNavigation,
      NavigationListenersAPI: nextNavigationListenersAPI,
    } = createTestNavigationAndHelpers();

    const eventListenerProps = createEventListenersProp();
    const component = renderer.create(
      <NavigationEvents navigation={navigation} {...eventListenerProps} />
    );

    Object.entries(EVENT_TO_PROP_NAME).forEach(([eventName, propName]) => {
      expect(eventListenerProps[propName]).toHaveBeenCalledTimes(0);
      NavigationListenersAPI.call(eventName);
      expect(eventListenerProps[propName]).toHaveBeenCalledTimes(1);
    });

    component.update(
      <NavigationEvents navigation={nextNavigation} {...eventListenerProps} />
    );

    Object.entries(EVENT_TO_PROP_NAME).forEach(([eventName, propName]) => {
      NavigationListenersAPI.call(eventName);
      expect(eventListenerProps[propName]).toHaveBeenCalledTimes(1);
      nextNavigationListenersAPI.call(eventName);
      expect(eventListenerProps[propName]).toHaveBeenCalledTimes(2);
    });
  });

  it('wire latest props listener to navigation listeners on updates (support closure/arrow functions update)', () => {
    const {
      navigation,
      NavigationListenersAPI,
    } = createTestNavigationAndHelpers();

    const component = renderer.create(
      <NavigationEvents
        navigation={navigation}
        {...createEventListenersProp()}
      />
    );

    component.update(
      <NavigationEvents
        navigation={navigation}
        onWillBlur={() => {
          throw new Error('should not be called');
        }}
        onDidFocus={() => {
          throw new Error('should not be called');
        }}
      />
    );

    component.update(
      <NavigationEvents
        navigation={navigation}
        {...createEventListenersProp()}
      />
    );

    const latestEventListenerProps = createEventListenersProp();
    component.update(
      <NavigationEvents navigation={navigation} {...latestEventListenerProps} />
    );

    const checkLatestPropListenerCalled = (eventName, propName) => {
      expect(latestEventListenerProps[propName]).toHaveBeenCalledTimes(0);
      NavigationListenersAPI.call(eventName);
      expect(latestEventListenerProps[propName]).toHaveBeenCalledTimes(1);
    };

    checkLatestPropListenerCalled('willFocus', 'onWillFocus');
    checkLatestPropListenerCalled('didFocus', 'onDidFocus');
    checkLatestPropListenerCalled('willBlur', 'onWillBlur');
    checkLatestPropListenerCalled('didBlur', 'onDidBlur');
  });
});
