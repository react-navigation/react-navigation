import * as React from 'react';
import { render } from 'react-native-testing-library';
import Screen from '../Screen';
import NavigationContainer from '../NavigationContainer';
import useNavigationBuilder from '../useNavigationBuilder';
import MockRouter, { MockRouterKey } from './__fixtures__/MockRouter';

beforeEach(() => (MockRouterKey.current = 0));

it('throws if NAVIGATE dispatched neither key nor name', () => {
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
    'While calling navigate with an object as the argument, you need to specify name or key'
  );
});
