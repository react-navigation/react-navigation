import React, { createRef } from 'react';
import { render, act } from '@testing-library/react-native';
import {
  useNavigationBuilder,
  TabRouter,
  createNavigatorFactory,
  NavigationHelpersContext,
  NavigationContainerRef,
} from '@react-navigation/core';
import NavigationContainer from '../NavigationContainer';

import useRedo from '../useRedo';

const createTabNavigator = createNavigatorFactory((props: any) => {
  const { navigation, state, descriptors } = useNavigationBuilder(
    TabRouter,
    props
  );

  return (
    <NavigationHelpersContext.Provider value={navigation}>
      {state.routes.map((route) => (
        <div key={route.key}>{descriptors[route.key].render()}</div>
      ))}
    </NavigationHelpersContext.Provider>
  );
});

beforeEach(() => {
  jest.resetModules();
});

it('runs effect when focused', () => {
  const Tab = createTabNavigator();

  const effect = jest.fn();

  const TestScreen = () => {
    useRedo(effect);

    return null;
  };

  const EmptyScreen = () => null;

  const navigation = createRef<NavigationContainerRef>();

  render(
    <NavigationContainer ref={navigation}>
      <Tab.Navigator initialRouteName="First">
        <Tab.Screen name="First" component={EmptyScreen} />
        <Tab.Screen name="Second" component={TestScreen} />
        <Tab.Screen name="Third" component={EmptyScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );

  expect(effect).not.toBeCalled();

  act(() => navigation.current?.navigate('Second'));

  expect(effect).toBeCalledTimes(1);

  act(() => navigation.current?.navigate('Third'));

  expect(effect).toBeCalledTimes(1);

  act(() => navigation.current?.navigate('Second'));

  expect(effect).toBeCalledTimes(2);
});

it('runs effect on resurfaced from background', () => {
  const effect = jest.fn();
  let capturedChangeCallback = jest.fn();

  const mockAddListener = jest.fn((event, callback) => {
    if (event === 'change') {
      capturedChangeCallback = callback;
    }
  });

  jest.doMock('react-native/Libraries/AppState/AppState', () => ({
    addEventListener: mockAddListener,
    removeEventListener: jest.fn(),
  }));

  const TestScreen = () => {
    useRedo(effect);

    return null;
  };

  const EmptyScreen = () => null;

  const navigation = createRef<NavigationContainerRef>();
  const Tab = createTabNavigator();

  render(
    <NavigationContainer ref={navigation}>
      <Tab.Navigator initialRouteName="First">
        <Tab.Screen name="First" component={EmptyScreen} />
        <Tab.Screen name="Second" component={TestScreen} />
        <Tab.Screen name="Third" component={EmptyScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );

  expect(effect).not.toBeCalled();

  capturedChangeCallback('active');

  expect(effect).toBeCalledTimes(1);

  capturedChangeCallback('background');

  expect(effect).toBeCalledTimes(1);

  capturedChangeCallback('inactive');

  expect(effect).toBeCalledTimes(1);
});
