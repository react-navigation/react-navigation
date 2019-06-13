import * as React from 'react';
import { render } from 'react-native-testing-library';
import NavigationContainer from '../NavigationContainer';
import useNavigationBuilder from '../useNavigationBuilder';
import { Router } from '../types';
import Screen from '../Screen';

const MockRouter: Router = {
  getInitialState({ screens, initialRouteName }) {
    const routeNames = Object.keys(screens);

    return {
      key: 'root',
      names: routeNames,
      index: routeNames.indexOf(initialRouteName || routeNames[0]),
      routes: routeNames.map(name => ({
        key: name,
        name,
      })),
    };
  },

  getStateForAction() {
    return null;
  },

  getStateForChildUpdate(state) {
    return state;
  },

  shouldActionPropagateToChildren() {
    return false;
  },

  shouldActionChangeFocus() {
    return false;
  },

  actionCreators: {},
};

it('initializes state with router', () => {
  expect.assertions(1);

  const TestNavigator = (props: any) => {
    useNavigationBuilder(MockRouter, props);
    return null;
  };

  const element = (
    <NavigationContainer
      onStateChange={state => expect(state).toMatchSnapshot()}
    >
      <TestNavigator initialRouteName="bar">
        <Screen name="foo" component={jest.fn()} />
        <Screen name="bar" component={jest.fn()} />
        <Screen name="baz" component={jest.fn()} />
      </TestNavigator>
    </NavigationContainer>
  );

  render(element).update(element);
});

it('throws if muliple navigators rendered under one container', async () => {
  expect.assertions(1);

  const TestNavigator = (props: any) => {
    useNavigationBuilder(MockRouter, props);
    return null;
  };

  const element = (
    <NavigationContainer>
      <TestNavigator>
        <Screen name="foo" component={jest.fn()} />
      </TestNavigator>
      <TestNavigator>
        <Screen name="foo" component={jest.fn()} />
      </TestNavigator>
    </NavigationContainer>
  );

  expect(() => render(element).update(element)).toThrowError(
    'Another navigator is already registered for this container'
  );
});
