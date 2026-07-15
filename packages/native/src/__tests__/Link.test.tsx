import { expect, jest, test } from '@jest/globals';
import {
  CommonActions,
  createNavigationContainerRef,
  createNavigatorFactory,
  type NavigatorScreenParams,
  StackActions,
  TabActions,
  TabRouter,
  useNavigationBuilder,
} from '@react-navigation/core';
import { render, screen, userEvent } from '@testing-library/react-native';
import { Fragment, useMemo } from 'react';
import { Platform, Text } from 'react-native';

import { createStackNavigator } from '../__stubs__/createStackNavigator';
import { Link } from '../Link';
import { NavigationContainer } from '../NavigationContainer';

type RootParamList = { Foo: undefined; Bar: { id: string } };

const OS = jest.replaceProperty(Platform, 'OS', 'web');

test('navigates on native', async () => {
  OS.replaceValue('android');

  try {
    const user = userEvent.setup();

    const Stack = createStackNavigator<RootParamList>();

    const FooScreen = () => (
      <Link<RootParamList> screen="Bar" params={{ id: '42' }}>
        Go to Bar
      </Link>
    );

    await render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Foo" component={FooScreen} />
          <Stack.Screen name="Bar">
            {() => <Text>Bar Screen</Text>}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    );

    const link = screen.getByRole('link', { name: 'Go to Bar' });

    expect(link).not.toHaveProp('href');

    await user.press(link);

    expect(await screen.findByText('Bar Screen')).toBeOnTheScreen();
  } finally {
    OS.replaceValue('web');
  }
});

test('renders link with href on web', async () => {
  const user = userEvent.setup();

  const config = {
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
      <Link<RootParamList> screen="Bar" params={{ id: '42' }}>
        Go to Bar
      </Link>
    );
  };

  const BarScreen = () => {
    return <Link<RootParamList> screen="Foo">Go to Foo</Link>;
  };

  await render(
    <NavigationContainer linking={config}>
      <Stack.Navigator>
        <Stack.Screen name="Foo" component={FooScreen} />
        <Stack.Screen name="Bar" component={BarScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  const link = screen.getByRole('link', { name: 'Go to Bar' });

  expect(link).toHaveProp('href', '/bar/42');

  await user.press(link);

  expect(screen.getByRole('link', { name: 'Go to Foo' })).toHaveProp(
    'href',
    '/foo'
  );
});

test('uses an explicit href and still navigates to the screen', async () => {
  const user = userEvent.setup();

  const Stack = createStackNavigator<RootParamList>();

  const FooScreen = () => (
    <Link<RootParamList> href="/custom-bar" screen="Bar" params={{ id: '42' }}>
      Go to Bar
    </Link>
  );

  await render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Foo" component={FooScreen} />
        <Stack.Screen name="Bar">{() => <Text>Bar Screen</Text>}</Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );

  const link = screen.getByRole('link', { name: 'Go to Bar' });

  expect(link).toHaveProp('href', '/custom-bar');

  await user.press(link);

  expect(await screen.findByText('Bar Screen')).toBeOnTheScreen();
});

test('uses the configured getPathFromState', async () => {
  const Stack = createStackNavigator<RootParamList>();

  const FooScreen = () => (
    <Link<RootParamList> screen="Bar" params={{ id: '42' }}>
      Go to Bar
    </Link>
  );

  await render(
    <NavigationContainer
      linking={{
        config: {
          screens: {
            Foo: 'foo',
            Bar: 'bar/:id',
          },
        },
        getPathFromState: () => '/custom-path',
      }}
    >
      <Stack.Navigator>
        <Stack.Screen name="Foo" component={FooScreen} />
        <Stack.Screen name="Bar">{() => null}</Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );

  expect(screen.getByRole('link', { name: 'Go to Bar' })).toHaveProp(
    'href',
    '/custom-path'
  );
});

test('handles custom onPress and disabled links', async () => {
  const user = userEvent.setup();

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

  await render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Foo" component={FooScreen} />
        <Stack.Screen name="Bar">{() => <Text>Bar Screen</Text>}</Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );

  const disabledLink = screen.getByRole('link', { name: 'Disabled Bar' });

  expect(disabledLink).toBeDisabled();

  await user.press(disabledLink);

  expect(onPressDisabled).not.toHaveBeenCalled();
  expect(screen.queryByText('Bar Screen')).not.toBeOnTheScreen();

  await user.press(screen.getByRole('link', { name: 'Enabled Bar' }));

  expect(onPressEnabled).toHaveBeenCalled();
  expect(await screen.findByText('Bar Screen')).toBeOnTheScreen();
});

test.each([
  ['CommonActions.navigate', CommonActions.navigate],
  ['StackActions.push', StackActions.push],
  ['StackActions.replace', StackActions.replace],
  ['StackActions.popTo', StackActions.popTo],
  ['TabActions.jumpTo', TabActions.jumpTo],
])(
  'renders link with href from %s when only action is specified',
  async (_, actionCreator) => {
    const config = {
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
        <Link<RootParamList> action={actionCreator('Bar', { id: '42' })}>
          Go to Bar
        </Link>
      );
    };

    const BarScreen = () => {
      return <Link<RootParamList> screen="Foo">Go to Foo</Link>;
    };

    await render(
      <NavigationContainer linking={config}>
        <Stack.Navigator>
          <Stack.Screen name="Foo" component={FooScreen} />
          <Stack.Screen name="Bar" component={BarScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    expect(screen.getByRole('link', { name: 'Go to Bar' })).toHaveProp(
      'href',
      '/bar/42'
    );
  }
);

test('uses screen for href and action for navigation', async () => {
  const user = userEvent.setup();

  type ParamList = {
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

  await render(
    <NavigationContainer
      linking={{
        config: {
          screens: {
            Foo: 'foo',
            Bar: 'bar/:id',
            Baz: 'baz',
          },
        },
      }}
    >
      <Stack.Navigator>
        <Stack.Screen name="Foo" component={FooScreen} />
        <Stack.Screen name="Bar">{() => <Text>Bar Screen</Text>}</Stack.Screen>
        <Stack.Screen name="Baz">{() => <Text>Baz Screen</Text>}</Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );

  const link = screen.getByRole('link', { name: 'Go to Bar' });

  expect(link).toHaveProp('href', '/bar/42');

  await user.press(link);

  expect(await screen.findByText('Baz Screen')).toBeOnTheScreen();
  expect(screen.queryByText('Bar Screen')).not.toBeOnTheScreen();
});

test('does not render link with href from action when no linking config is present', async () => {
  const Stack = createStackNavigator<RootParamList>();

  const FooScreen = () => {
    return (
      <Link<RootParamList> action={CommonActions.navigate('Bar', { id: '42' })}>
        Go to Bar
      </Link>
    );
  };

  const BarScreen = () => {
    return <Link<RootParamList> screen="Foo">Go to Foo</Link>;
  };

  await render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Foo" component={FooScreen} />
        <Stack.Screen name="Bar" component={BarScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  expect(screen.getByRole('link', { name: 'Go to Bar' })).not.toHaveProp(
    'href'
  );
});

test('does not render link with href from action when screen is not in linking config', async () => {
  const config = {
    config: {
      screens: {
        Foo: 'foo',
      },
    },
    getInitialURL() {
      return null;
    },
  };

  const Stack = createStackNavigator<RootParamList>();

  const FooScreen = () => {
    return (
      <Link<RootParamList> action={CommonActions.navigate('Bar', { id: '42' })}>
        Go to Bar
      </Link>
    );
  };

  const BarScreen = () => {
    return <Link<RootParamList> screen="Foo">Go to Foo</Link>;
  };

  await render(
    <NavigationContainer linking={config}>
      <Stack.Navigator>
        <Stack.Screen name="Foo" component={FooScreen} />
        <Stack.Screen name="Bar" component={BarScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  expect(screen.getByRole('link', { name: 'Go to Bar' })).not.toHaveProp(
    'href'
  );
});

test('does not infer href from an unsupported custom action', async () => {
  const Stack = createStackNavigator<RootParamList>();

  const action = {
    type: 'CUSTOM_ACTION',
    payload: { name: 'Bar', params: { id: '42' } },
  };

  const FooScreen = () => (
    <Link<RootParamList> action={action}>Custom action</Link>
  );

  await render(
    <NavigationContainer
      linking={{
        config: {
          screens: {
            Foo: 'foo',
            Bar: 'bar/:id',
          },
        },
      }}
    >
      <Stack.Navigator>
        <Stack.Screen name="Foo" component={FooScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  expect(screen.getByRole('link', { name: 'Custom action' })).not.toHaveProp(
    'href'
  );
});

test('navigates to a nested screen again with the same params object', async () => {
  const user = userEvent.setup();

  type TabParamList = {
    First: undefined;
    Second: { id: string };
  };

  type ParentParamList = {
    Nested: NavigatorScreenParams<TabParamList>;
  };

  const createTabNavigator = createNavigatorFactory((props: any) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      TabRouter,
      props
    );

    return (
      <NavigationContent>
        {state.routes.map((route) => (
          <Fragment key={route.key}>
            {descriptors[route.key]?.render()}
          </Fragment>
        ))}
      </NavigationContent>
    );
  });

  const navigation = createNavigationContainerRef<ParentParamList>();

  const Stack = createStackNavigator<ParentParamList>();
  const Tab = createTabNavigator<TabParamList>();

  const params: NavigatorScreenParams<TabParamList> = {
    screen: 'Second',
    params: { id: '42' },
  };

  await render(
    <NavigationContainer ref={navigation}>
      <Stack.Navigator>
        <Stack.Screen name="Nested">
          {() => (
            <Tab.Navigator>
              <Tab.Screen name="First">
                {() => (
                  <Link<ParentParamList> screen="Nested" params={params}>
                    Go to Second
                  </Link>
                )}
              </Tab.Screen>
              <Tab.Screen name="Second">
                {({ navigation }) => (
                  <Text
                    role="button"
                    onPress={() => navigation.navigate('First')}
                  >
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

  await user.press(screen.getByRole('link', { name: 'Go to Second' }));

  expect(navigation.getCurrentRoute()?.name).toBe('Second');

  await user.press(screen.getByRole('button', { name: 'Go to First' }));

  expect(navigation.getCurrentRoute()?.name).toBe('First');

  await user.press(screen.getByRole('link', { name: 'Go to Second' }));

  expect(navigation.getCurrentRoute()?.name).toBe('Second');
});

test('navigates to nested state again with the same params object', async () => {
  const user = userEvent.setup();

  type TabParamList = {
    First: undefined;
    Second: { id: string };
  };

  type ParentParamList = {
    Nested: NavigatorScreenParams<TabParamList>;
  };

  const createTabNavigator = createNavigatorFactory((props: any) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      TabRouter,
      props
    );

    return (
      <NavigationContent>
        {state.routes.map((route) => (
          <Fragment key={route.key}>
            {descriptors[route.key]?.render()}
          </Fragment>
        ))}
      </NavigationContent>
    );
  });

  const navigation = createNavigationContainerRef<ParentParamList>();

  const Stack = createStackNavigator<ParentParamList>();
  const Tab = createTabNavigator<TabParamList>();

  const params: NavigatorScreenParams<TabParamList> = {
    state: {
      routes: [{ name: 'Second', params: { id: '42' } }],
    },
  };

  await render(
    <NavigationContainer ref={navigation}>
      <Stack.Navigator>
        <Stack.Screen name="Nested">
          {() => (
            <Tab.Navigator>
              <Tab.Screen name="First">
                {() => (
                  <Link<ParentParamList> screen="Nested" params={params}>
                    Go to Second
                  </Link>
                )}
              </Tab.Screen>
              <Tab.Screen name="Second">
                {({ navigation }) => (
                  <Text
                    role="button"
                    onPress={() => navigation.navigate('First')}
                  >
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

  await user.press(screen.getByRole('link', { name: 'Go to Second' }));

  expect(navigation.getCurrentRoute()?.name).toBe('Second');

  await user.press(screen.getByRole('button', { name: 'Go to First' }));

  expect(navigation.getCurrentRoute()?.name).toBe('First');

  await user.press(screen.getByRole('link', { name: 'Go to Second' }));

  expect(navigation.getCurrentRoute()?.name).toBe('Second');
});

test('navigates again with a memoized action', async () => {
  const user = userEvent.setup();

  type TabParamList = {
    First: undefined;
    Second: { id: string };
  };

  type ParentParamList = {
    Nested: NavigatorScreenParams<TabParamList>;
  };

  const createTabNavigator = createNavigatorFactory((props: any) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      TabRouter,
      props
    );

    return (
      <NavigationContent>
        {state.routes.map((route) => (
          <Fragment key={route.key}>
            {descriptors[route.key]?.render()}
          </Fragment>
        ))}
      </NavigationContent>
    );
  });

  const navigation = createNavigationContainerRef<ParentParamList>();

  const Stack = createStackNavigator<ParentParamList>();
  const Tab = createTabNavigator<TabParamList>();

  const FirstScreen = () => {
    const action = useMemo(
      () =>
        CommonActions.navigate('Nested', {
          screen: 'Second',
          params: { id: '42' },
        }),
      []
    );

    return (
      <Link action={action} href="/second/42">
        Go to Second
      </Link>
    );
  };

  await render(
    <NavigationContainer<ParentParamList>
      ref={navigation}
      linking={{
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
                  <Text
                    role="button"
                    onPress={() => navigation.navigate('First')}
                  >
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

  await user.press(screen.getByRole('link', { name: 'Go to Second' }));

  expect(navigation.getCurrentRoute()?.name).toBe('Second');

  await user.press(screen.getByRole('button', { name: 'Go to First' }));

  expect(navigation.getCurrentRoute()?.name).toBe('First');

  await user.press(screen.getByRole('link', { name: 'Go to Second' }));

  expect(navigation.getCurrentRoute()?.name).toBe('Second');
});

test('navigates through multiple nested screens again with the same params objects', async () => {
  const user = userEvent.setup();

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

  const createTabNavigator = createNavigatorFactory((props: any) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      TabRouter,
      props
    );

    return (
      <NavigationContent>
        {state.routes.map((route) => (
          <Fragment key={route.key}>
            {descriptors[route.key]?.render()}
          </Fragment>
        ))}
      </NavigationContent>
    );
  });

  const navigation = createNavigationContainerRef<ParentParamList>();

  const Stack = createStackNavigator<ParentParamList>();
  const Tab = createTabNavigator<TabParamList>();
  const Leaf = createTabNavigator<LeafParamList>();

  const leafParams: NavigatorScreenParams<LeafParamList> = {
    screen: 'LeafSecond',
    params: { id: '42' },
  };

  const params: NavigatorScreenParams<TabParamList> = {
    screen: 'Deep',
    params: leafParams,
  };

  const FirstScreen = () => (
    <Link<ParentParamList> screen="Nested" params={params}>
      Go to deep second
    </Link>
  );

  await render(
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
                      {({ navigation }) => (
                        <Text
                          role="button"
                          onPress={() => navigation.navigate('LeafFirst')}
                        >
                          Go to leaf first
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

  await user.press(screen.getByRole('link', { name: 'Go to deep second' }));

  expect(navigation.getCurrentRoute()?.name).toBe('LeafSecond');

  await user.press(screen.getByRole('button', { name: 'Go to leaf first' }));

  expect(navigation.getCurrentRoute()?.name).toBe('LeafFirst');

  await user.press(screen.getByRole('link', { name: 'Go to deep second' }));

  expect(navigation.getCurrentRoute()?.name).toBe('LeafSecond');
});

test('uses the container ref when rendered outside a navigator', async () => {
  const user = userEvent.setup();

  const Stack = createStackNavigator<RootParamList>();

  await render(
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

  await user.press(screen.getByRole('link', { name: 'Go to Bar' }));

  expect(await screen.findByText('Bar Screen')).toBeOnTheScreen();
});

test('dispatches custom actions on the nearest navigator from outside screens', async () => {
  const user = userEvent.setup();

  type ArticleStackParamList = {
    Article: undefined;
    Settings: undefined;
  };

  type RootStackParamList = {
    Articles: NavigatorScreenParams<ArticleStackParamList>;
    Settings: undefined;
  };

  const RootStack = createStackNavigator<RootStackParamList>();
  const ArticleStack = createStackNavigator<ArticleStackParamList>();

  const ArticlesScreen = () => {
    return (
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
  };

  await render(
    <NavigationContainer>
      <RootStack.Navigator>
        <RootStack.Screen name="Articles" component={ArticlesScreen} />
        <RootStack.Screen name="Settings">
          {() => <Text>Root Settings Screen</Text>}
        </RootStack.Screen>
      </RootStack.Navigator>
    </NavigationContainer>
  );

  await user.press(screen.getByRole('link', { name: 'Settings' }));

  expect(await screen.findByText('Nested Settings Screen')).toBeOnTheScreen();
  expect(screen.queryByText('Root Settings Screen')).not.toBeOnTheScreen();
});

test('throws while rendering outside a navigation container', async () => {
  await expect(
    render(<Link<RootParamList> screen="Foo">Foo</Link>)
  ).rejects.toThrow(
    "Couldn't find a navigation object. Is your component inside NavigationContainer?"
  );
});
