import { expect, jest, test } from '@jest/globals';
import {
  createNavigationContainerRef,
  type NavigatorScreenParams,
} from '@react-navigation/core';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { useMemo } from 'react';
import { Platform, Text } from 'react-native';

import { createStackNavigator } from '../__stubs__/createStackNavigator';
import { Link } from '../Link';
import { NavigationContainer } from '../NavigationContainer';
import { useLinkBuilder } from '../useLinkBuilder';

type RootParamList = { Foo: undefined; Bar: { id: string } };

jest.replaceProperty(Platform, 'OS', 'web');

test('renders link with href on web', () => {
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
  href="/bar/42"
  onPress={[Function]}
  role="link"
  style={
    [
      {
        "color": "rgb(0, 122, 255)",
      },
      {
        "fontFamily": "System",
        "fontWeight": "400",
      },
      undefined,
    ]
  }
>
  Go to Bar
</Text>
`);

  const event = {
    defaultPrevented: false,
    preventDefault() {
      event.defaultPrevented = true;
    },
  };

  fireEvent.press(getByText('Go to Bar'), event);

  expect(toJSON()).toMatchInlineSnapshot(`
<Text
  href="/foo"
  onPress={[Function]}
  role="link"
  style={
    [
      {
        "color": "rgb(0, 122, 255)",
      },
      {
        "fontFamily": "System",
        "fontWeight": "400",
      },
      undefined,
    ]
  }
>
  Go to Foo
</Text>
`);
});

test("doesn't navigate if default was prevented", () => {
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
  href="/bar/42"
  onPress={[Function]}
  role="link"
  style={
    [
      {
        "color": "rgb(0, 122, 255)",
      },
      {
        "fontFamily": "System",
        "fontWeight": "400",
      },
      undefined,
    ]
  }
>
  Go to Bar
</Text>
`);

  const event = {
    defaultPrevented: false,
    preventDefault() {
      event.defaultPrevented = true;
    },
  };

  fireEvent.press(getByText('Go to Bar'), event);

  expect(toJSON()).toMatchInlineSnapshot(`
<Text
  href="/bar/42"
  onPress={[Function]}
  role="link"
  style={
    [
      {
        "color": "rgb(0, 122, 255)",
      },
      {
        "fontFamily": "System",
        "fontWeight": "400",
      },
      undefined,
    ]
  }
>
  Go to Bar
</Text>
`);
});

test('navigates to a nested screen again with the same params object', () => {
  type TabParamList = {
    First: undefined;
    Second: { id: string };
  };

  type ParentParamList = {
    Nested: NavigatorScreenParams<TabParamList>;
  };

  const navigation = createNavigationContainerRef<ParentParamList>();

  const Stack = createStackNavigator<ParentParamList>();
  const Tab = createStackNavigator<TabParamList>();

  const params: NavigatorScreenParams<TabParamList> = {
    screen: 'Second',
    params: { id: '42' },
  };

  render(
    <NavigationContainer ref={navigation}>
      <Stack.Navigator>
        <Stack.Screen name="Nested">
          {() => (
            <Tab.Navigator>
              <Tab.Screen name="First">
                {() => (
                  <Link<any> screen="Nested" params={params}>
                    Go to Second
                  </Link>
                )}
              </Tab.Screen>
              <Tab.Screen name="Second">
                {({ navigation }) => (
                  <Text onPress={() => navigation.navigate('First')}>
                    Go to First
                  </Text>
                )}
              </Tab.Screen>
            </Tab.Navigator>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );

  fireEvent.press(screen.getByText('Go to Second'), {
    defaultPrevented: false,
  });

  expect(navigation.getCurrentRoute()?.name).toBe('Second');

  fireEvent.press(screen.getByText('Go to First'));

  expect(navigation.getCurrentRoute()?.name).toBe('First');

  fireEvent.press(screen.getByText('Go to Second'), {
    defaultPrevented: false,
  });

  expect(navigation.getCurrentRoute()?.name).toBe('Second');
});

test('navigates to nested state again with the same params object', () => {
  type TabParamList = {
    First: undefined;
    Second: { id: string };
  };

  type ParentParamList = {
    Nested: NavigatorScreenParams<TabParamList>;
  };

  const navigation = createNavigationContainerRef<ParentParamList>();

  const Stack = createStackNavigator<ParentParamList>();
  const Tab = createStackNavigator<TabParamList>();

  const params: NavigatorScreenParams<TabParamList> = {
    state: {
      routes: [{ name: 'Second', params: { id: '42' } }],
    },
  };

  render(
    <NavigationContainer ref={navigation}>
      <Stack.Navigator>
        <Stack.Screen name="Nested">
          {() => (
            <Tab.Navigator>
              <Tab.Screen name="First">
                {() => (
                  <Link<any> screen="Nested" params={params}>
                    Go to Second
                  </Link>
                )}
              </Tab.Screen>
              <Tab.Screen name="Second">
                {({ navigation }) => (
                  <Text onPress={() => navigation.navigate('First')}>
                    Go to First
                  </Text>
                )}
              </Tab.Screen>
            </Tab.Navigator>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );

  fireEvent.press(screen.getByText('Go to Second'), {
    defaultPrevented: false,
  });

  expect(navigation.getCurrentRoute()?.name).toBe('Second');

  fireEvent.press(screen.getByText('Go to First'));

  expect(navigation.getCurrentRoute()?.name).toBe('First');

  fireEvent.press(screen.getByText('Go to Second'), {
    defaultPrevented: false,
  });

  expect(navigation.getCurrentRoute()?.name).toBe('Second');
});

test('navigates again with a memoized action built from an href', () => {
  type TabParamList = {
    First: undefined;
    Second: { id: string };
  };

  type ParentParamList = {
    Nested: NavigatorScreenParams<TabParamList>;
  };

  const navigation = createNavigationContainerRef<ParentParamList>();

  const Stack = createStackNavigator<ParentParamList>();
  const Tab = createStackNavigator<TabParamList>();

  const FirstScreen = () => {
    const { buildAction } = useLinkBuilder();
    const action = useMemo(() => buildAction('/second/42'), [buildAction]);

    return (
      <Link action={action} href="/second/42">
        Go to Second from href
      </Link>
    );
  };

  render(
    <NavigationContainer<ParentParamList>
      ref={navigation}
      linking={{
        prefixes: [],
        getInitialURL() {
          return null;
        },
        config: {
          screens: {
            Nested: {
              path: '',
              screens: {
                First: '',
                Second: 'second/:id',
              },
            },
          },
        },
      }}
    >
      <Stack.Navigator>
        <Stack.Screen name="Nested">
          {() => (
            <Tab.Navigator>
              <Tab.Screen name="First" component={FirstScreen} />
              <Tab.Screen name="Second">
                {({ navigation }) => (
                  <Text onPress={() => navigation.navigate('First')}>
                    Go to First
                  </Text>
                )}
              </Tab.Screen>
            </Tab.Navigator>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );

  fireEvent.press(screen.getByText('Go to Second from href'), {
    defaultPrevented: false,
  });

  expect(navigation.getCurrentRoute()?.name).toBe('Second');

  fireEvent.press(screen.getByText('Go to First'));

  expect(navigation.getCurrentRoute()?.name).toBe('First');

  fireEvent.press(screen.getByText('Go to Second from href'), {
    defaultPrevented: false,
  });

  expect(navigation.getCurrentRoute()?.name).toBe('Second');
});

test('navigates through multiple nested screens again with the same params objects', () => {
  type LeafParamList = {
    LeafFirst: undefined;
    LeafSecond: { id: string };
  };

  type TabParamList = {
    First: undefined;
    Deep: NavigatorScreenParams<LeafParamList>;
  };

  type ParentParamList = {
    Nested: NavigatorScreenParams<TabParamList>;
  };

  const navigation = createNavigationContainerRef<ParentParamList>();

  const Stack = createStackNavigator<ParentParamList>();
  const Tab = createStackNavigator<TabParamList>();
  const Leaf = createStackNavigator<LeafParamList>();

  const leafParams: NavigatorScreenParams<LeafParamList> = {
    screen: 'LeafSecond',
    params: { id: '42' },
  };

  const params: NavigatorScreenParams<TabParamList> = {
    screen: 'Deep',
    params: leafParams,
  };

  const FirstScreen = () => (
    <Link<any> screen="Nested" params={params}>
      Go to deep second
    </Link>
  );

  render(
    <NavigationContainer ref={navigation}>
      <Stack.Navigator>
        <Stack.Screen name="Nested">
          {() => (
            <Tab.Navigator>
              <Tab.Screen name="First" component={FirstScreen} />
              <Tab.Screen name="Deep">
                {() => (
                  <Leaf.Navigator>
                    <Leaf.Screen name="LeafFirst">{() => null}</Leaf.Screen>
                    <Leaf.Screen name="LeafSecond">
                      {() => (
                        <Text
                          onPress={() =>
                            navigation.navigate('Nested', { screen: 'First' })
                          }
                        >
                          Go to first
                        </Text>
                      )}
                    </Leaf.Screen>
                  </Leaf.Navigator>
                )}
              </Tab.Screen>
            </Tab.Navigator>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );

  fireEvent.press(screen.getByText('Go to deep second'), {
    defaultPrevented: false,
  });

  expect(navigation.getCurrentRoute()?.name).toBe('LeafSecond');

  fireEvent.press(screen.getByText('Go to first'));

  expect(navigation.getCurrentRoute()?.name).toBe('First');

  fireEvent.press(screen.getByText('Go to deep second'), {
    defaultPrevented: false,
  });

  expect(navigation.getCurrentRoute()?.name).toBe('LeafSecond');
});
