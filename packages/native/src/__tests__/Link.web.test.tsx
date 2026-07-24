import '@testing-library/jest-dom/jest-globals';

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
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Fragment, useMemo } from 'react';

import { createStackNavigator } from '../__stubs__/createStackNavigator';
import { Link } from '../Link';
import { NavigationContainer } from '../NavigationContainer';

type RootParamList = { Foo: undefined; Bar: { id: string } };

test('renders link with href from linking config', async () => {
  const user = userEvent.setup();

  const config = {
    config: {
      screens: {
        Foo: 'foo',
        Bar: 'bar/:id',
      },
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

  render(
    <NavigationContainer linking={config}>
      <Stack.Navigator>
        <Stack.Screen name="Foo" component={FooScreen} />
        <Stack.Screen name="Bar" component={BarScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  const link = screen.getByRole('link', { name: 'Go to Bar' });

  expect(link).toHaveAttribute('href', '/bar/42');

  await user.click(link);

  expect(screen.getByRole('link', { name: 'Go to Foo' })).toHaveAttribute(
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

  render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Foo" component={FooScreen} />
        <Stack.Screen name="Bar">{() => <span>Bar Screen</span>}</Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );

  const link = screen.getByRole('link', { name: 'Go to Bar' });

  expect(link).toHaveAttribute('href', '/custom-bar');

  await user.click(link);

  expect(await screen.findByText('Bar Screen')).toBeInTheDocument();
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

  expect(screen.getByRole('link', { name: 'Go to Bar' })).toHaveAttribute(
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

  render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Foo" component={FooScreen} />
        <Stack.Screen name="Bar">{() => <span>Bar Screen</span>}</Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );

  const disabledLink = screen.getByRole('link', { name: 'Disabled Bar' });

  expect(disabledLink).toHaveAttribute('aria-disabled', 'true');

  await user.click(disabledLink);

  expect(onPressDisabled).not.toHaveBeenCalled();
  expect(screen.queryByText('Bar Screen')).not.toBeInTheDocument();

  await user.click(screen.getByRole('link', { name: 'Enabled Bar' }));

  expect(onPressEnabled).toHaveBeenCalled();
  expect(await screen.findByText('Bar Screen')).toBeInTheDocument();
});

test('does not navigate when onPress prevents the default', async () => {
  const user = userEvent.setup();
  const Stack = createStackNavigator<RootParamList>();

  render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Foo">
          {() => (
            <Link<RootParamList>
              screen="Bar"
              params={{ id: '42' }}
              onPress={(event) => event.preventDefault()}
            >
              Go to Bar
            </Link>
          )}
        </Stack.Screen>
        <Stack.Screen name="Bar">{() => <span>Bar Screen</span>}</Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );

  await user.click(screen.getByRole('link', { name: 'Go to Bar' }));

  expect(screen.queryByText('Bar Screen')).not.toBeInTheDocument();
});

test.each([
  ['CommonActions.navigate', CommonActions.navigate],
  ['StackActions.push', StackActions.push],
  ['StackActions.replace', StackActions.replace],
  ['StackActions.popTo', StackActions.popTo],
  ['TabActions.jumpTo', TabActions.jumpTo],
])(
  'renders link with href from %s when only action is specified',
  (_, actionCreator) => {
    const config = {
      config: {
        screens: {
          Foo: 'foo',
          Bar: 'bar/:id',
        },
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

    render(
      <NavigationContainer linking={config}>
        <Stack.Navigator>
          <Stack.Screen name="Foo" component={FooScreen} />
          <Stack.Screen name="Bar" component={BarScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    expect(screen.getByRole('link', { name: 'Go to Bar' })).toHaveAttribute(
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

  render(
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
        <Stack.Screen name="Bar">{() => <span>Bar Screen</span>}</Stack.Screen>
        <Stack.Screen name="Baz">{() => <span>Baz Screen</span>}</Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );

  const link = screen.getByRole('link', { name: 'Go to Bar' });

  expect(link).toHaveAttribute('href', '/bar/42');

  await user.click(link);

  expect(await screen.findByText('Baz Screen')).toBeInTheDocument();
  expect(screen.queryByText('Bar Screen')).not.toBeInTheDocument();
});

test('does not render link with href from action when no linking config is present', () => {
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

  render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Foo" component={FooScreen} />
        <Stack.Screen name="Bar" component={BarScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  expect(screen.getByRole('link', { name: 'Go to Bar' })).not.toHaveAttribute(
    'href'
  );
});

test('does not render link with href from action when screen is not in linking config', () => {
  const config = {
    config: {
      screens: {
        Foo: 'foo',
      },
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

  render(
    <NavigationContainer linking={config}>
      <Stack.Navigator>
        <Stack.Screen name="Foo" component={FooScreen} />
        <Stack.Screen name="Bar" component={BarScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  expect(screen.getByRole('link', { name: 'Go to Bar' })).not.toHaveAttribute(
    'href'
  );
});

test('does not infer href from an unsupported custom action', () => {
  const Stack = createStackNavigator<RootParamList>();

  const action = {
    type: 'CUSTOM_ACTION',
    payload: { name: 'Bar', params: { id: '42' } },
  };

  const FooScreen = () => (
    <Link<RootParamList> action={action}>Custom action</Link>
  );

  render(
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

  expect(
    screen.getByRole('link', { name: 'Custom action' })
  ).not.toHaveAttribute('href');
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

  render(
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
                  <button
                    type="button"
                    onClick={() => navigation.navigate('First')}
                  >
                    Go to First
                  </button>
                )}
              </Tab.Screen>
            </Tab.Navigator>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );

  await user.click(screen.getByRole('link', { name: 'Go to Second' }));

  expect(navigation.getCurrentRoute()?.name).toBe('Second');

  await user.click(screen.getByRole('button', { name: 'Go to First' }));

  expect(navigation.getCurrentRoute()?.name).toBe('First');

  await user.click(screen.getByRole('link', { name: 'Go to Second' }));

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

  render(
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
                  <button
                    type="button"
                    onClick={() => navigation.navigate('First')}
                  >
                    Go to First
                  </button>
                )}
              </Tab.Screen>
            </Tab.Navigator>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );

  await user.click(screen.getByRole('link', { name: 'Go to Second' }));

  expect(navigation.getCurrentRoute()?.name).toBe('Second');

  await user.click(screen.getByRole('button', { name: 'Go to First' }));

  expect(navigation.getCurrentRoute()?.name).toBe('First');

  await user.click(screen.getByRole('link', { name: 'Go to Second' }));

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

  render(
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
                  <button
                    type="button"
                    onClick={() => navigation.navigate('First')}
                  >
                    Go to First
                  </button>
                )}
              </Tab.Screen>
            </Tab.Navigator>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );

  await user.click(screen.getByRole('link', { name: 'Go to Second' }));

  expect(navigation.getCurrentRoute()?.name).toBe('Second');

  await user.click(screen.getByRole('button', { name: 'Go to First' }));

  expect(navigation.getCurrentRoute()?.name).toBe('First');

  await user.click(screen.getByRole('link', { name: 'Go to Second' }));

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
                      {({ navigation }) => (
                        <button
                          type="button"
                          onClick={() => navigation.navigate('LeafFirst')}
                        >
                          Go to leaf first
                        </button>
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

  await user.click(screen.getByRole('link', { name: 'Go to deep second' }));

  expect(navigation.getCurrentRoute()?.name).toBe('LeafSecond');

  await user.click(screen.getByRole('button', { name: 'Go to leaf first' }));

  expect(navigation.getCurrentRoute()?.name).toBe('LeafFirst');

  await user.click(screen.getByRole('link', { name: 'Go to deep second' }));

  expect(navigation.getCurrentRoute()?.name).toBe('LeafSecond');
});

test('renders hrefs with in for current, parent, and root navigators', () => {
  type FeedStackParamList = {
    ArticleList: undefined;
    ArticleDetails: { id: string };
  };

  type HomeTabParamList = {
    Feed: NavigatorScreenParams<FeedStackParamList>;
    Profile: { id: string };
  };

  type RootStackParamList = {
    Home: NavigatorScreenParams<HomeTabParamList>;
    Settings: undefined;
  };

  const RootStack = createStackNavigator<RootStackParamList>();
  const HomeTabs = createStackNavigator<HomeTabParamList>();
  const FeedStack = createStackNavigator<FeedStackParamList>();

  const config = {
    config: {
      screens: {
        Home: {
          path: 'home',
          screens: {
            Feed: {
              path: 'feed',
              screens: {
                ArticleList: 'articles',
                ArticleDetails: 'articles/:id',
              },
            },
            Profile: 'profile/:id',
          },
        },
        Settings: 'settings',
      },
    },
  };

  const ArticleListScreen = () => {
    return (
      <>
        <Link<RootStackParamList>
          in="ArticleList"
          screen="ArticleDetails"
          params={{ id: '1' }}
        >
          Article
        </Link>
        <Link<RootStackParamList>
          in="Feed"
          screen="Profile"
          params={{ id: '2' }}
        >
          Profile
        </Link>
        <Link<RootStackParamList> in="Home" screen="Settings">
          Settings
        </Link>
        <Link<RootStackParamList> screen="Settings">Root Settings</Link>
      </>
    );
  };

  const FeedScreen = () => {
    return (
      <FeedStack.Navigator>
        <FeedStack.Screen name="ArticleList" component={ArticleListScreen} />
        <FeedStack.Screen name="ArticleDetails">
          {() => <>Article Details</>}
        </FeedStack.Screen>
      </FeedStack.Navigator>
    );
  };

  const HomeScreen = () => {
    return (
      <HomeTabs.Navigator>
        <HomeTabs.Screen name="Feed" component={FeedScreen} />
        <HomeTabs.Screen name="Profile">{() => <>Profile</>}</HomeTabs.Screen>
      </HomeTabs.Navigator>
    );
  };

  render(
    <NavigationContainer linking={config}>
      <RootStack.Navigator>
        <RootStack.Screen name="Home" component={HomeScreen} />
        <RootStack.Screen name="Settings">
          {() => <span>Settings Screen</span>}
        </RootStack.Screen>
      </RootStack.Navigator>
    </NavigationContainer>
  );

  expect(screen.getByRole('link', { name: 'Article' })).toHaveAttribute(
    'href',
    '/home/feed/articles/1'
  );
  expect(screen.getByRole('link', { name: 'Profile' })).toHaveAttribute(
    'href',
    '/home/profile/2'
  );
  expect(screen.getByRole('link', { name: 'Settings' })).toHaveAttribute(
    'href',
    '/settings'
  );
  expect(screen.getByRole('link', { name: 'Root Settings' })).toHaveAttribute(
    'href',
    '/settings'
  );
});

test('updates href when focused route params change', async () => {
  const user = userEvent.setup();

  type HomeTabParamList = {
    Feed: undefined;
    Profile: undefined;
  };

  type RootStackParamList = {
    Home: NavigatorScreenParams<HomeTabParamList> & { section: string };
  };

  const RootStack = createStackNavigator<RootStackParamList>();
  const HomeTabs = createStackNavigator<HomeTabParamList>();

  render(
    <NavigationContainer<RootStackParamList>
      linking={{
        config: {
          screens: {
            Home: {
              path: 'home/:section',
              screens: {
                Feed: 'feed',
                Profile: 'profile',
              },
            },
          },
        },
      }}
    >
      <RootStack.Navigator>
        <RootStack.Screen
          name="Home"
          initialParams={{ section: 'one', screen: 'Feed' }}
        >
          {({ navigation }) => (
            <HomeTabs.Navigator>
              <HomeTabs.Screen name="Feed">
                {() => (
                  <>
                    <Link<RootStackParamList> in="Feed" screen="Profile">
                      Go to Profile
                    </Link>
                    <button
                      type="button"
                      onClick={() => navigation.setParams({ section: 'two' })}
                    >
                      Change section
                    </button>
                  </>
                )}
              </HomeTabs.Screen>
              <HomeTabs.Screen name="Profile">{() => null}</HomeTabs.Screen>
            </HomeTabs.Navigator>
          )}
        </RootStack.Screen>
      </RootStack.Navigator>
    </NavigationContainer>
  );

  const link = screen.getByRole('link', { name: 'Go to Profile' });

  expect(link).toHaveAttribute('href', '/home/one/profile');

  await user.click(screen.getByRole('button', { name: 'Change section' }));

  expect(link).toHaveAttribute('href', '/home/two/profile');
});

test('navigates with in for a root navigator', async () => {
  const user = userEvent.setup();

  type RootStackParamList = {
    Home: undefined;
    Settings: undefined;
  };

  const RootStack = createStackNavigator<RootStackParamList>();

  const HomeScreen = () => {
    return (
      <Link<RootStackParamList> in="Home" screen="Settings">
        Settings
      </Link>
    );
  };

  render(
    <NavigationContainer>
      <RootStack.Navigator>
        <RootStack.Screen name="Home" component={HomeScreen} />
        <RootStack.Screen name="Settings">
          {() => <span>Settings Screen</span>}
        </RootStack.Screen>
      </RootStack.Navigator>
    </NavigationContainer>
  );

  await user.click(screen.getByRole('link', { name: 'Settings' }));

  expect(await screen.findByText('Settings Screen')).toBeInTheDocument();
});

test('navigates with in for an intermediate navigator', async () => {
  const user = userEvent.setup();

  type HomeTabParamList = {
    Feed: undefined;
    Profile: { id: string };
  };

  type RootStackParamList = {
    Home: NavigatorScreenParams<HomeTabParamList>;
  };

  const RootStack = createStackNavigator<RootStackParamList>();
  const HomeTabs = createStackNavigator<HomeTabParamList>();

  const FeedScreen = () => (
    <Link<RootStackParamList> in="Feed" screen="Profile" params={{ id: '42' }}>
      Go to Profile
    </Link>
  );

  const HomeScreen = () => (
    <HomeTabs.Navigator>
      <HomeTabs.Screen name="Feed" component={FeedScreen} />
      <HomeTabs.Screen name="Profile">
        {() => <span>Profile Screen</span>}
      </HomeTabs.Screen>
    </HomeTabs.Navigator>
  );

  render(
    <NavigationContainer>
      <RootStack.Navigator>
        <RootStack.Screen name="Home" component={HomeScreen} />
      </RootStack.Navigator>
    </NavigationContainer>
  );

  await user.click(screen.getByRole('link', { name: 'Go to Profile' }));

  expect(await screen.findByText('Profile Screen')).toBeInTheDocument();
});

test('navigates to root when in is not specified', async () => {
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

  const ArticleScreen = () => {
    return <Link<RootStackParamList> screen="Settings">Settings</Link>;
  };

  const ArticlesScreen = () => {
    return (
      <ArticleStack.Navigator>
        <ArticleStack.Screen name="Article" component={ArticleScreen} />
        <ArticleStack.Screen name="Settings">
          {() => <span>Nested Settings Screen</span>}
        </ArticleStack.Screen>
      </ArticleStack.Navigator>
    );
  };

  render(
    <NavigationContainer>
      <RootStack.Navigator>
        <RootStack.Screen name="Articles" component={ArticlesScreen} />
        <RootStack.Screen name="Settings">
          {() => <span>Settings Screen</span>}
        </RootStack.Screen>
      </RootStack.Navigator>
    </NavigationContainer>
  );

  await user.click(screen.getByRole('link', { name: 'Settings' }));

  expect(await screen.findByText('Settings Screen')).toBeInTheDocument();
  expect(screen.queryByText('Nested Settings Screen')).not.toBeInTheDocument();
});

test('uses the container ref when rendered outside a navigator', async () => {
  const user = userEvent.setup();

  const Stack = createStackNavigator<RootParamList>();

  render(
    <NavigationContainer>
      <>
        <Link<RootParamList> screen="Bar" params={{ id: '42' }}>
          Go to Bar
        </Link>
        <Stack.Navigator>
          <Stack.Screen name="Foo">
            {() => <span>Foo Screen</span>}
          </Stack.Screen>
          <Stack.Screen name="Bar">
            {() => <span>Bar Screen</span>}
          </Stack.Screen>
        </Stack.Navigator>
      </>
    </NavigationContainer>
  );

  await user.click(screen.getByRole('link', { name: 'Go to Bar' }));

  expect(await screen.findByText('Bar Screen')).toBeInTheDocument();
});

test('dispatches custom actions on current navigation when in is not specified', async () => {
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

  const ArticleScreen = () => {
    return (
      <Link<RootStackParamList> action={StackActions.replace('Settings')}>
        Settings
      </Link>
    );
  };

  const ArticlesScreen = () => {
    return (
      <ArticleStack.Navigator>
        <ArticleStack.Screen name="Article" component={ArticleScreen} />
        <ArticleStack.Screen name="Settings">
          {() => <span>Nested Settings Screen</span>}
        </ArticleStack.Screen>
      </ArticleStack.Navigator>
    );
  };

  render(
    <NavigationContainer>
      <RootStack.Navigator>
        <RootStack.Screen name="Articles" component={ArticlesScreen} />
        <RootStack.Screen name="Settings">
          {() => <span>Root Settings Screen</span>}
        </RootStack.Screen>
      </RootStack.Navigator>
    </NavigationContainer>
  );

  await user.click(screen.getByRole('link', { name: 'Settings' }));

  expect(await screen.findByText('Nested Settings Screen')).toBeInTheDocument();
  expect(screen.queryByText('Root Settings Screen')).not.toBeInTheDocument();
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
          {() => <span>Nested Settings Screen</span>}
        </ArticleStack.Screen>
      </ArticleStack.Navigator>
    );
  };

  render(
    <NavigationContainer>
      <RootStack.Navigator>
        <RootStack.Screen name="Articles" component={ArticlesScreen} />
        <RootStack.Screen name="Settings">
          {() => <span>Root Settings Screen</span>}
        </RootStack.Screen>
      </RootStack.Navigator>
    </NavigationContainer>
  );

  await user.click(screen.getByRole('link', { name: 'Settings' }));

  expect(await screen.findByText('Nested Settings Screen')).toBeInTheDocument();
  expect(screen.queryByText('Root Settings Screen')).not.toBeInTheDocument();
});

test('uses in to dispatch an action when screen is specified', async () => {
  const user = userEvent.setup();

  type ArticleStackParamList = {
    Article: undefined;
  };

  type RootStackParamList = {
    Articles: NavigatorScreenParams<ArticleStackParamList>;
    Settings: undefined;
  };

  const RootStack = createStackNavigator<RootStackParamList>();
  const ArticleStack = createStackNavigator<ArticleStackParamList>();

  const ArticlesScreen = () => (
    <ArticleStack.Navigator>
      <ArticleStack.Screen name="Article">
        {() => (
          <Link<RootStackParamList>
            in="Articles"
            screen="Settings"
            action={StackActions.replace('Settings')}
          >
            Settings
          </Link>
        )}
      </ArticleStack.Screen>
    </ArticleStack.Navigator>
  );

  render(
    <NavigationContainer<RootStackParamList>
      linking={{
        config: {
          screens: {
            Articles: {
              path: 'articles',
              screens: {
                Article: 'article',
              },
            },
            Settings: 'settings',
          },
        },
      }}
    >
      <RootStack.Navigator>
        <RootStack.Screen name="Articles" component={ArticlesScreen} />
        <RootStack.Screen name="Settings">
          {() => <span>Root Settings Screen</span>}
        </RootStack.Screen>
      </RootStack.Navigator>
    </NavigationContainer>
  );

  const link = screen.getByRole('link', { name: 'Settings' });

  expect(link).toHaveAttribute('href', '/settings');

  await user.click(link);

  expect(await screen.findByText('Root Settings Screen')).toBeInTheDocument();
});

test('throws while rendering when in does not match current or parent screens', () => {
  type RootStackParamList = {
    Home: undefined;
    Settings: undefined;
  };

  const RootStack = createStackNavigator<RootStackParamList>();

  const HomeScreen = () => {
    return (
      <Link<RootStackParamList>
        // @ts-expect-error Testing runtime error for invalid parent screen.
        in="Missing"
        screen="Settings"
      >
        Settings
      </Link>
    );
  };

  expect(() =>
    render(
      <NavigationContainer>
        <RootStack.Navigator>
          <RootStack.Screen name="Home" component={HomeScreen} />
          <RootStack.Screen name="Settings">
            {() => <span>Settings Screen</span>}
          </RootStack.Screen>
        </RootStack.Navigator>
      </NavigationContainer>
    )
  ).toThrow(
    "Couldn't find a navigation object for 'Missing' in current or any parent screens. Is your component inside the correct screen?"
  );
});

test('throws while rendering outside a navigation container', () => {
  expect(() => render(<Link<RootParamList> screen="Foo">Foo</Link>)).toThrow(
    "Couldn't find a navigation object. Is your component inside NavigationContainer?"
  );
});

test('resolves in to the closest matching screen for href and navigation', async () => {
  const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});

  const user = userEvent.setup();

  type NestedStackParamList = {
    Home: undefined;
    Details: { id: string };
  };

  type RootStackParamList = {
    Home: NavigatorScreenParams<NestedStackParamList>;
    Details: undefined;
  };

  const RootStack = createStackNavigator<RootStackParamList>();
  const NestedStack = createStackNavigator<NestedStackParamList>();

  const config = {
    config: {
      screens: {
        Home: {
          path: 'home',
          screens: {
            Home: '',
            Details: 'details/:id',
          },
        },
        Details: 'details',
      },
    },
  };

  const NestedHomeScreen = () => {
    return (
      <Link<RootStackParamList> in="Home" screen="Details" params={{ id: '1' }}>
        Go to Details
      </Link>
    );
  };

  const HomeScreen = () => {
    return (
      <NestedStack.Navigator>
        <NestedStack.Screen name="Home" component={NestedHomeScreen} />
        <NestedStack.Screen name="Details">
          {() => <span>Nested Details Screen</span>}
        </NestedStack.Screen>
      </NestedStack.Navigator>
    );
  };

  render(
    <NavigationContainer linking={config}>
      <RootStack.Navigator>
        <RootStack.Screen name="Home" component={HomeScreen} />
        <RootStack.Screen name="Details">
          {() => <span>Root Details Screen</span>}
        </RootStack.Screen>
      </RootStack.Navigator>
    </NavigationContainer>
  );

  expect(spy).toHaveBeenCalledTimes(1);
  expect(spy).toHaveBeenCalledWith(
    expect.stringContaining(
      'Found screens with the same name nested inside one another'
    )
  );

  spy.mockRestore();

  const link = screen.getByRole('link', { name: 'Go to Details' });

  expect(link).toHaveAttribute('href', '/home/details/1');

  await user.click(link);

  expect(await screen.findByText('Nested Details Screen')).toBeInTheDocument();
  expect(screen.queryByText('Root Details Screen')).not.toBeInTheDocument();
});
