import * as React from 'react';
import { render } from 'react-native-testing-library';
import Screen from '../Screen';
import NavigationContainer from '../NavigationContainer';
import useNavigationBuilder from '../useNavigationBuilder';
import MockRouter from './__fixtures__/MockRouter';

beforeEach(() => (MockRouter.key = 0));

it('throws if NAVIGATE dispatched with both key and name', () => {
  const TestNavigator = (props: any) => {
    const { state, descriptors } = useNavigationBuilder(MockRouter, props);

    return descriptors[state.routes[state.index].key].render();
  };

  const FooScreen = (props: any) => {
    React.useEffect(() => {
      props.navigation.navigate({ key: '1', name: '2' });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
  };

  const onStateChange = jest.fn();

  const element = (
    <NavigationContainer onStateChange={onStateChange}>
      <TestNavigator initialRouteName="foo">
        <Screen
          name="foo"
          component={FooScreen}
          initialParams={{ count: 10 }}
        />
      </TestNavigator>
    </NavigationContainer>
  );

  expect(() => render(element).update(element)).toThrowError(
    'While calling navigate you need to specify either name or key'
  );
});

it('throws if NAVIGATE dispatched neither both key nor name', () => {
  const TestNavigator = (props: any) => {
    const { state, descriptors } = useNavigationBuilder(MockRouter, props);

    return descriptors[state.routes[state.index].key].render();
  };

  const FooScreen = (props: any) => {
    React.useEffect(() => {
      props.navigation.navigate({});
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
  };

  const onStateChange = jest.fn();

  const element = (
    <NavigationContainer onStateChange={onStateChange}>
      <TestNavigator initialRouteName="foo">
        <Screen
          name="foo"
          component={FooScreen}
          initialParams={{ count: 10 }}
        />
      </TestNavigator>
    </NavigationContainer>
  );

  expect(() => render(element).update(element)).toThrowError(
    'While calling navigate you need to specify either name or key'
  );
});
