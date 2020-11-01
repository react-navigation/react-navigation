import React, { createRef } from 'react';
import { render, act } from '@testing-library/react-native';
import useNavigationBuilder from '../useNavigationBuilder';
import useRedo from '../useRedo';
import BaseNavigationContainer from '../BaseNavigationContainer';
import Screen from '../Screen';
import MockRouter from './__fixtures__/MockRouter';

const TestNavigator = (props: any): any => {
  const { state, descriptors } = useNavigationBuilder(MockRouter, props);

  return state.routes.map((route) => descriptors[route.key].render());
};

beforeEach(() => {
  jest.resetModules();
});

it('runs effect when focused', () => {
  const effect = jest.fn();

  const Test = () => {
    useRedo(effect);

    return null;
  };

  const navigation = createRef<any>();

  const element = (
    <BaseNavigationContainer ref={navigation}>
      <TestNavigator>
        <Screen name="first">{() => null}</Screen>
        <Screen name="second" component={Test} />
        <Screen name="third">{() => null}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  render(element);

  expect(effect).not.toBeCalled();

  act(() => navigation.current.navigate('second'));

  expect(effect).toBeCalledTimes(1);

  act(() => navigation.current.navigate('third'));

  expect(effect).toBeCalledTimes(1);

  act(() => navigation.current.navigate('second'));

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

  const Test = () => {
    useRedo(effect);

    return null;
  };

  const navigation = createRef<any>();

  const element = (
    <BaseNavigationContainer ref={navigation}>
      <TestNavigator>
        <Screen name="first">{() => null}</Screen>
        <Screen name="second" component={Test} />
        <Screen name="third">{() => null}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  render(element);

  expect(effect).not.toBeCalled();

  capturedChangeCallback('active');

  expect(effect).toBeCalledTimes(1);

  capturedChangeCallback('background');

  expect(effect).toBeCalledTimes(1);

  capturedChangeCallback('inactive');

  expect(effect).toBeCalledTimes(1);
});
