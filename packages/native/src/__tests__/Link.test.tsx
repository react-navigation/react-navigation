import { fireEvent, render } from '@testing-library/react-native';
import * as React from 'react';

import createStackNavigator from '../__mocks__/createStackNavigator';
import Link from '../Link';
import NavigationContainer from '../NavigationContainer';

type RootParamList = { Foo: undefined; Bar: { id: string } };

jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  ...jest.requireActual('react-native/Libraries/Utilities/Platform'),
  OS: 'web',
}));

it('renders link with href on web', () => {
  const config = {
    prefixes: ['https://example.com'],
    config: {
      screens: {
        Foo: 'foo',
        Bar: 'bar/:id',
      },
    },
    getInitialURL() {
      return null;
    },
  };

  const Stack = createStackNavigator<RootParamList>();

  const FooScreen = () => {
    return (
      <Link<any> screen="Bar" params={{ id: '42' }}>
        Go to Bar
      </Link>
    );
  };

  const BarScreen = () => {
    return <Link<any> screen="Foo">Go to Foo</Link>;
  };

  const { getByText, toJSON } = render(
    <NavigationContainer linking={config}>
      <Stack.Navigator>
        <Stack.Screen name="Foo" component={FooScreen} />
        <Stack.Screen name="Bar" component={BarScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  expect(toJSON()).toMatchInlineSnapshot(`
    <Text
      accessibilityRole="link"
      href="/bar/42"
      onPress={[Function]}
    >
      Go to Bar
    </Text>
  `);

  fireEvent.press(getByText('Go to Bar'), {
    defaultPrevented: false,
    preventDefault() {
      this.defaultPrevented = true;
    },
  });

  expect(toJSON()).toMatchInlineSnapshot(`
    <Text
      accessibilityRole="link"
      href="/foo"
      onPress={[Function]}
    >
      Go to Foo
    </Text>
  `);
});

it("doesn't navigate if default was prevented", () => {
  const config = {
    prefixes: ['https://example.com'],
    config: {
      screens: {
        Foo: 'foo',
        Bar: 'bar/:id',
      },
    },
    getInitialURL() {
      return null;
    },
  };

  const Stack = createStackNavigator<RootParamList>();

  const FooScreen = () => {
    return (
      <Link<any>
        screen="Bar"
        params={{ id: '42' }}
        onPress={(e) => e.preventDefault()}
      >
        Go to Bar
      </Link>
    );
  };

  const BarScreen = () => {
    return <Link<any> screen="Foo">Go to Foo</Link>;
  };

  const { getByText, toJSON } = render(
    <NavigationContainer linking={config}>
      <Stack.Navigator>
        <Stack.Screen name="Foo" component={FooScreen} />
        <Stack.Screen name="Bar" component={BarScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  expect(toJSON()).toMatchInlineSnapshot(`
    <Text
      accessibilityRole="link"
      href="/bar/42"
      onPress={[Function]}
    >
      Go to Bar
    </Text>
  `);

  fireEvent.press(getByText('Go to Bar'), {
    defaultPrevented: false,
    preventDefault() {
      this.defaultPrevented = true;
    },
  });

  expect(toJSON()).toMatchInlineSnapshot(`
    <Text
      accessibilityRole="link"
      href="/bar/42"
      onPress={[Function]}
    >
      Go to Bar
    </Text>
  `);
});
