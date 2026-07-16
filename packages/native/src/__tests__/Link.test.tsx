import { expect, jest, test } from '@jest/globals';
import {
  CommonActions,
  createNavigationContainerRef,
  type NavigatorScreenParams,
  type ParamListBase,
  StackActions,
} from '@react-navigation/core';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { useMemo } from 'react';
import { Platform, Text } from 'react-native';

import { createStackNavigator } from '../__stubs__/createStackNavigator';
import { Link } from '../Link';
import { NavigationContainer } from '../NavigationContainer';
import { useLinkBuilder } from '../useLinkBuilder';

type RootParamList = ReactNavigation.RootParamList &
  ParamListBase & {
    Foo: undefined;
    Bar: { id: string };
  };

const OS = jest.replaceProperty(Platform, 'OS', 'web');

const createPressEvent = () => {
  const event = {
    defaultPrevented: false,
    preventDefault() {
      event.defaultPrevented = true;
    },
    stopPropagation() {},
  };

  return event;
};

test('navigates on native', () => {
  OS.replaceValue('android');

  try {
    const Stack = createStackNavigator<RootParamList>();

    const FooScreen = () => (
      <Link<RootParamList> screen="Bar" params={{ id: '42' }}>
        Go to Bar
      </Link>
    );

    render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Foo" component={FooScreen} />
          <Stack.Screen name="Bar">
            {() => <Text>Bar Screen</Text>}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    );

    const link = screen.getByText('Go to Bar');

    expect(link).not.toHaveProp('href');

    fireEvent.press(link, createPressEvent());

    expect(screen.getByText('Bar Screen')).toBeOnTheScreen();
  } finally {
    OS.replaceValue('web');
  }
});

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

test('uses an explicit href and still navigates to the screen', () => {
  const Stack = createStackNavigator<RootParamList>();

  const FooScreen = () => (
    <Link<RootParamList> href="/custom-bar" screen="Bar" params={{ id: '42' }}>
      Go to Bar
    </Link>
  );

  render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Foo" component={FooScreen} />
        <Stack.Screen name="Bar">{() => <Text>Bar Screen</Text>}</Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );

  const link = screen.getByText('Go to Bar');

  expect(link).toHaveProp('href', '/custom-bar');

  fireEvent.press(link, createPressEvent());

  expect(screen.getByText('Bar Screen')).toBeOnTheScreen();
});

test('uses the configured getPathFromState', () => {
  const Stack = createStackNavigator<RootParamList>();

  const FooScreen = () => (
    <Link<RootParamList> screen="Bar" params={{ id: '42' }}>
      Go to Bar
    </Link>
  );

  render(
    <NavigationContainer
      linking={{
        prefixes: [],
        config: {
          screens: {
            Foo: 'foo',
            Bar: 'bar/:id',
          },
        },
        getPathFromState: () => '/custom-path',
        getInitialURL: () => null,
      }}
    >
      <Stack.Navigator>
        <Stack.Screen name="Foo" component={FooScreen} />
        <Stack.Screen name="Bar">{() => null}</Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );

  expect(screen.getByText('Go to Bar')).toHaveProp('href', '/custom-path');
});

test('handles custom onPress and disabled links', () => {
  const Stack = createStackNavigator<RootParamList>();
  const onPressDisabled = jest.fn();
  const onPressEnabled = jest.fn();

  const FooScreen = () => (
    <>
      <Link<RootParamList>
        disabled
        screen="Bar"
        params={{ id: 'disabled' }}
        onPress={onPressDisabled}
      >
        Disabled Bar
      </Link>
      <Link<RootParamList>
        screen="Bar"
        params={{ id: '42' }}
        onPress={onPressEnabled}
      >
        Enabled Bar
      </Link>
    </>
  );

  render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Foo" component={FooScreen} />
        <Stack.Screen name="Bar">{() => <Text>Bar Screen</Text>}</Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );

  const disabledLink = screen.getByText('Disabled Bar');

  fireEvent.press(disabledLink, createPressEvent());

  expect(onPressDisabled).not.toHaveBeenCalled();
  expect(screen.queryByText('Bar Screen')).not.toBeOnTheScreen();

  fireEvent.press(screen.getByText('Enabled Bar'), createPressEvent());

  expect(onPressEnabled).toHaveBeenCalled();
  expect(screen.getByText('Bar Screen')).toBeOnTheScreen();
});

test.each([
  ['CommonActions.navigate', CommonActions.navigate],
  ['StackActions.push', StackActions.push],
  ['StackActions.replace', StackActions.replace],
  ['StackActions.popTo', StackActions.popTo],
])(
  'renders link with href from %s when only action is specified',
  (_, actionCreator) => {
    const Stack = createStackNavigator<RootParamList>();

    const FooScreen = () => (
      <Link<RootParamList> action={actionCreator('Bar', { id: '42' })}>
        Go to Bar
      </Link>
    );

    render(
      <NavigationContainer
        linking={{
          prefixes: [],
          config: {
            screens: {
              Foo: 'foo',
              Bar: 'bar/:id',
            },
          },
          getInitialURL: () => null,
        }}
      >
        <Stack.Navigator>
          <Stack.Screen name="Foo" component={FooScreen} />
          <Stack.Screen name="Bar">{() => null}</Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    );

    expect(screen.getByText('Go to Bar')).toHaveProp('href', '/bar/42');
  }
);

test('uses screen for href and action for navigation', () => {
  type ParamList = ReactNavigation.RootParamList &
    ParamListBase & {
      Foo: undefined;
      Bar: { id: string };
      Baz: undefined;
    };

  const Stack = createStackNavigator<ParamList>();

  const FooScreen = () => (
    <Link<ParamList>
      screen="Bar"
      params={{ id: '42' }}
      action={StackActions.replace('Baz')}
    >
      Go to Bar
    </Link>
  );

  render(
    <NavigationContainer
      linking={{
        prefixes: [],
        config: {
          screens: {
            Foo: 'foo',
            Bar: 'bar/:id',
            Baz: 'baz',
          },
        },
        getInitialURL: () => null,
      }}
    >
      <Stack.Navigator>
        <Stack.Screen name="Foo" component={FooScreen} />
        <Stack.Screen name="Bar">{() => <Text>Bar Screen</Text>}</Stack.Screen>
        <Stack.Screen name="Baz">{() => <Text>Baz Screen</Text>}</Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );

  const link = screen.getByText('Go to Bar');

  expect(link).toHaveProp('href', '/bar/42');

  fireEvent.press(link, createPressEvent());

  expect(screen.getByText('Baz Screen')).toBeOnTheScreen();
  expect(screen.queryByText('Bar Screen')).not.toBeOnTheScreen();
});

test('does not render an href from an action without a linking config', () => {
  const Stack = createStackNavigator<RootParamList>();
  const FooScreen = () => (
    <Link<RootParamList> action={CommonActions.navigate('Bar', { id: '42' })}>
      Go to Bar
    </Link>
  );

  render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Foo" component={FooScreen} />
        <Stack.Screen name="Bar">{() => null}</Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );

  expect(screen.getByText('Go to Bar')).not.toHaveProp('href');
});

test('does not render an href when the action screen is not linked', () => {
  const Stack = createStackNavigator<RootParamList>();
  const FooScreen = () => (
    <Link<RootParamList> action={CommonActions.navigate('Bar', { id: '42' })}>
      Go to Bar
    </Link>
  );

  render(
    <NavigationContainer
      linking={{
        prefixes: [],
        config: { screens: { Foo: 'foo' } },
        getInitialURL: () => null,
      }}
    >
      <Stack.Navigator>
        <Stack.Screen name="Foo" component={FooScreen} />
        <Stack.Screen name="Bar">{() => null}</Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );

  expect(screen.getByText('Go to Bar')).not.toHaveProp('href');
});

test('does not infer an href from an unsupported custom action', () => {
  const Stack = createStackNavigator<RootParamList>();
  const FooScreen = () => (
    <Link<RootParamList>
      action={{
        type: 'CUSTOM_ACTION',
        payload: { name: 'Bar', params: { id: '42' } },
      }}
    >
      Custom action
    </Link>
  );

  render(
    <NavigationContainer
      linking={{
        prefixes: [],
        config: { screens: { Foo: 'foo', Bar: 'bar/:id' } },
        getInitialURL: () => null,
      }}
    >
      <Stack.Navigator>
        <Stack.Screen name="Foo" component={FooScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  expect(screen.getByText('Custom action')).not.toHaveProp('href');
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

  fireEvent.press(screen.getByText('Go to Second'), createPressEvent());

  expect(navigation.getCurrentRoute()?.name).toBe('Second');

  fireEvent.press(screen.getByText('Go to First'));

  expect(navigation.getCurrentRoute()?.name).toBe('First');

  fireEvent.press(screen.getByText('Go to Second'), createPressEvent());

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

  fireEvent.press(screen.getByText('Go to Second'), createPressEvent());

  expect(navigation.getCurrentRoute()?.name).toBe('Second');

  fireEvent.press(screen.getByText('Go to First'));

  expect(navigation.getCurrentRoute()?.name).toBe('First');

  fireEvent.press(screen.getByText('Go to Second'), createPressEvent());

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

  fireEvent.press(
    screen.getByText('Go to Second from href'),
    createPressEvent()
  );

  expect(navigation.getCurrentRoute()?.name).toBe('Second');

  fireEvent.press(screen.getByText('Go to First'));

  expect(navigation.getCurrentRoute()?.name).toBe('First');

  fireEvent.press(
    screen.getByText('Go to Second from href'),
    createPressEvent()
  );

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

  fireEvent.press(screen.getByText('Go to deep second'), createPressEvent());

  expect(navigation.getCurrentRoute()?.name).toBe('LeafSecond');

  fireEvent.press(screen.getByText('Go to first'));

  expect(navigation.getCurrentRoute()?.name).toBe('First');

  fireEvent.press(screen.getByText('Go to deep second'), createPressEvent());

  expect(navigation.getCurrentRoute()?.name).toBe('LeafSecond');
});

test('uses the container ref when rendered outside a navigator', () => {
  const Stack = createStackNavigator<RootParamList>();

  render(
    <NavigationContainer>
      <>
        <Link<RootParamList> screen="Bar" params={{ id: '42' }}>
          Go to Bar
        </Link>
        <Stack.Navigator>
          <Stack.Screen name="Foo">
            {() => <Text>Foo Screen</Text>}
          </Stack.Screen>
          <Stack.Screen name="Bar">
            {() => <Text>Bar Screen</Text>}
          </Stack.Screen>
        </Stack.Navigator>
      </>
    </NavigationContainer>
  );

  fireEvent.press(screen.getByText('Go to Bar'), createPressEvent());

  expect(screen.getByText('Bar Screen')).toBeOnTheScreen();
});

test('dispatches custom actions on the nearest navigator from outside screens', () => {
  type ArticleStackParamList = {
    Article: undefined;
    Settings: undefined;
  };

  type RootStackParamList = ReactNavigation.RootParamList &
    ParamListBase & {
      Articles: NavigatorScreenParams<ArticleStackParamList>;
      Settings: undefined;
    };

  const RootStack = createStackNavigator<RootStackParamList>();
  const ArticleStack = createStackNavigator<ArticleStackParamList>();

  const ArticlesScreen = () => (
    <ArticleStack.Navigator
      layout={({ children }) => (
        <>
          <Link<RootStackParamList> action={StackActions.replace('Settings')}>
            Settings
          </Link>
          {children}
        </>
      )}
    >
      <ArticleStack.Screen name="Article">{() => null}</ArticleStack.Screen>
      <ArticleStack.Screen name="Settings">
        {() => <Text>Nested Settings Screen</Text>}
      </ArticleStack.Screen>
    </ArticleStack.Navigator>
  );

  render(
    <NavigationContainer>
      <RootStack.Navigator>
        <RootStack.Screen name="Articles" component={ArticlesScreen} />
        <RootStack.Screen name="Settings">
          {() => <Text>Root Settings Screen</Text>}
        </RootStack.Screen>
      </RootStack.Navigator>
    </NavigationContainer>
  );

  fireEvent.press(screen.getByText('Settings'), createPressEvent());

  expect(screen.getByText('Nested Settings Screen')).toBeOnTheScreen();
  expect(screen.queryByText('Root Settings Screen')).not.toBeOnTheScreen();
});

test('throws while rendering outside a navigation container', () => {
  expect(() => render(<Link<RootParamList> screen="Foo">Foo</Link>)).toThrow(
    "Couldn't find a navigation object. Is your component inside NavigationContainer?"
  );
});
