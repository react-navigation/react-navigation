import * as React from 'react';
import { render } from 'react-native-testing-library';
import NavigationContainer from '../NavigationContainer';
import useNavigationBuilder from '../useNavigationBuilder';
import { Router } from '../types';
import Screen from '../Screen';

const MockRouter: Router<{ type: 'UPDATE' | 'NOOP' }> = {
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

  getStateForAction(state, action) {
    switch (action.type) {
      case 'UPDATE':
        return { ...state };

      case 'NOOP':
        return null;

      default:
        return state;
    }
  },

  actionCreators: {},
};

it('initializes state for a navigator on navigation', () => {
  expect.assertions(1);

  const TestNavigator = (props: any) => {
    const { navigation, descriptors } = useNavigationBuilder(MockRouter, props);

    return descriptors[
      navigation.state.routes[navigation.state.index].key
    ].render();
  };

  const FooScreen = (props: any) => {
    React.useEffect(() => {
      props.navigation.dispatch({ type: 'UPDATE' });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
  };

  const element = (
    <NavigationContainer
      onStateChange={state =>
        expect(state).toEqual({
          index: 0,
          key: 'root',
          names: ['foo', 'bar', 'baz'],
          routes: [
            { key: 'foo', name: 'foo' },
            { key: 'bar', name: 'bar' },
            { key: 'baz', name: 'baz' },
          ],
        })
      }
    >
      <TestNavigator initialRouteName="foo">
        <Screen name="foo" component={FooScreen} />
        <Screen name="bar" component={jest.fn()} />
        <Screen name="baz" component={jest.fn()} />
      </TestNavigator>
    </NavigationContainer>
  );

  render(element).update(element);
});

it('throws if muliple navigators rendered under one container', () => {
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
