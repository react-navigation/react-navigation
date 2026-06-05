import { expect, test } from '@jest/globals';
import {
  createNavigationContainerRef,
  NavigationRouteContext,
  type NavigatorScreenParams,
} from '@react-navigation/core';
import { act, render, screen } from '@testing-library/react-native';
import * as React from 'react';
import { Text } from 'react-native';

import { createStackNavigator } from '../__stubs__/createStackNavigator';
import { NavigationContainer } from '../NavigationContainer';
import { useRoutePath } from '../useRoutePath';

const config = {
  config: {
    screens: {
      a: {
        path: 'foo',
        screens: {
          b: 'bar/:id',
          c: {
            path: 'baz',
            exact: true,
          },
        },
      },
      b: 'qux',
    },
  },
  getInitialURL() {
    return null;
  },
};

const Test = () => {
  const route = React.use(NavigationRouteContext);
  const path = useRoutePath();

  return <Text>{`${route?.name}: ${path}`}</Text>;
};

test('throws when not rendered inside a screen', async () => {
  await expect(
    render(
      <NavigationContainer linking={config}>
        <Test />
      </NavigationContainer>
    )
  ).rejects.toThrow(
    "Couldn't find a state for the route object. Is your component inside a screen in a navigator?"
  );
});

test('gets path for route in root navigator screen', async () => {
  type RootStackParamList = {
    a: undefined;
    b: { count: number };
  };

  const Stack = createStackNavigator<RootStackParamList>();

  const navigation = createNavigationContainerRef<RootStackParamList>();

  await render(
    <NavigationContainer ref={navigation} linking={config}>
      <Stack.Navigator>
        <Stack.Screen name="a" component={Test} />
        <Stack.Screen name="b" component={Test} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  expect(screen).toMatchInlineSnapshot(`
<Text>
  a: /foo
</Text>
`);

  await act(() => navigation.navigate('b', { count: 42 }));

  expect(screen).toMatchInlineSnapshot(`
<Text>
  b: /qux?count=42
</Text>
`);
});

test('gets path for route in nested navigator screen', async () => {
  type AStackParamList = {
    a: NavigatorScreenParams<BStackParamList>;
  };

  type BStackParamList = {
    b: { id: string };
    c: undefined;
  };

  const StackA = createStackNavigator<AStackParamList>();
  const StackB = createStackNavigator<BStackParamList>();

  const navigation = createNavigationContainerRef<AStackParamList>();

  await render(
    <NavigationContainer ref={navigation} linking={config}>
      <StackA.Navigator>
        <StackA.Screen name="a">
          {() => (
            <StackB.Navigator>
              <StackB.Screen
                name="b"
                component={Test}
                initialParams={{ id: 'apple' }}
              />
              <StackB.Screen name="c" component={Test} />
            </StackB.Navigator>
          )}
        </StackA.Screen>
      </StackA.Navigator>
    </NavigationContainer>
  );

  expect(screen).toMatchInlineSnapshot(`
<Text>
  b: /foo/bar/apple
</Text>
`);

  await act(() => navigation.navigate('a', { screen: 'c' }));

  expect(screen).toMatchInlineSnapshot(`
<Text>
  c: /baz
</Text>
`);
});
