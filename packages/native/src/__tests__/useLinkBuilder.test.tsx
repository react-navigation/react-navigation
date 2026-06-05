import { expect, test } from '@jest/globals';
import {
  createNavigationContainerRef,
  NavigationRouteContext,
  type NavigatorScreenParams,
} from '@react-navigation/core';
import { act, render } from '@testing-library/react-native';

import { createStackNavigator } from '../__stubs__/createStackNavigator';
import { NavigationContainer } from '../NavigationContainer';
import type { LinkingOptions } from '../types';
import { useLinkBuilder } from '../useLinkBuilder';

const config = {
  config: {
    screens: {
      Foo: {
        path: 'foo',
        screens: {
          Bar: 'bar/:id',
        },
      },
    },
  },
  getInitialURL() {
    return null;
  },
};

test('builds href outside of a navigator', async () => {
  expect.assertions(1);

  const Root = () => {
    const { buildHref } = useLinkBuilder();

    const href = buildHref('Foo');

    expect(href).toBe('/foo');

    return null;
  };

  await render(
    <NavigationContainer linking={config}>
      <Root />
    </NavigationContainer>
  );
});

test('builds href in navigator layout', async () => {
  expect.assertions(1);

  const Test = ({ children }: { children: React.ReactNode }) => {
    const { buildHref } = useLinkBuilder();

    const href = buildHref('Foo');

    expect(href).toBe('/foo');

    return children;
  };

  const Stack = createStackNavigator<{ Foo: undefined }>();

  await render(
    <NavigationContainer linking={config}>
      <Stack.Navigator layout={({ children }) => <Test>{children}</Test>}>
        <Stack.Screen name="Foo">{() => null}</Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
});

test('builds href in route context', async () => {
  expect.assertions(1);

  const Test = () => {
    const { buildHref } = useLinkBuilder();

    const href = buildHref('Foo');

    expect(href).toBe('/foo');

    return null;
  };

  const Stack = createStackNavigator<{ Foo: undefined }>();

  await render(
    <NavigationContainer linking={config}>
      <Stack.Navigator
        layout={({ state }) => (
          <NavigationRouteContext.Provider
            value={state.routes.find((r) => r.name === 'Foo')}
          >
            <Test />
          </NavigationRouteContext.Provider>
        )}
      >
        <Stack.Screen name="Foo">{() => null}</Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
});

test('builds href in stack navigator screen', async () => {
  expect.assertions(1);

  const Test = () => {
    const { buildHref } = useLinkBuilder();

    const href = buildHref('Foo');

    expect(href).toBe('/foo');

    return null;
  };

  const StackA = createStackNavigator<{ Foo: undefined }>();

  await render(
    <NavigationContainer linking={config}>
      <StackA.Navigator>
        <StackA.Screen name="Foo" component={Test} />
      </StackA.Navigator>
    </NavigationContainer>
  );
});

test('builds href in nested navigator layout', async () => {
  expect.assertions(1);

  const Test = ({ children }: { children: React.ReactNode }) => {
    const { buildHref } = useLinkBuilder();

    const href = buildHref('Bar', { id: '42' });

    expect(href).toBe('/foo/bar/42');

    return children;
  };

  const StackA = createStackNavigator<{ Foo: undefined }>();
  const StackB = createStackNavigator<{ Bar: { id: string } }>();

  await render(
    <NavigationContainer linking={config}>
      <StackA.Navigator>
        <StackA.Screen name="Foo">
          {() => (
            <StackB.Navigator
              layout={({ children }) => <Test>{children}</Test>}
            >
              <StackB.Screen name="Bar">{() => null}</StackB.Screen>
            </StackB.Navigator>
          )}
        </StackA.Screen>
      </StackA.Navigator>
    </NavigationContainer>
  );
});

test('builds href in nested route context', async () => {
  expect.assertions(1);

  const Test = () => {
    const { buildHref } = useLinkBuilder();

    const href = buildHref('Bar', { id: '42' });

    expect(href).toBe('/foo/bar/42');

    return null;
  };

  const StackA = createStackNavigator<{ Foo: undefined }>();
  const StackB = createStackNavigator<{ Bar: { id: string } }>();

  await render(
    <NavigationContainer linking={config}>
      <StackA.Navigator>
        <StackA.Screen name="Foo">
          {() => (
            <StackB.Navigator
              layout={({ state }) => (
                <NavigationRouteContext.Provider
                  value={state.routes.find((r) => r.name === 'Bar')}
                >
                  <Test />
                </NavigationRouteContext.Provider>
              )}
            >
              <StackB.Screen name="Bar">{() => null}</StackB.Screen>
            </StackB.Navigator>
          )}
        </StackA.Screen>
      </StackA.Navigator>
    </NavigationContainer>
  );
});

test('builds href in nested navigator screen', async () => {
  expect.assertions(1);

  const Test = () => {
    const { buildHref } = useLinkBuilder();

    const href = buildHref('Bar', { id: '42' });

    expect(href).toBe('/foo/bar/42');

    return null;
  };

  const StackA = createStackNavigator<{ Foo: undefined }>();
  const StackB = createStackNavigator<{ Bar: { id: string } }>();

  await render(
    <NavigationContainer linking={config}>
      <StackA.Navigator>
        <StackA.Screen name="Foo">
          {() => (
            <StackB.Navigator>
              <StackB.Screen name="Bar" component={Test} />
            </StackB.Navigator>
          )}
        </StackA.Screen>
      </StackA.Navigator>
    </NavigationContainer>
  );
});

test('builds action from href outside of a navigator', async () => {
  expect.assertions(1);

  const Test = () => {
    const { buildAction } = useLinkBuilder();

    const action = buildAction('/foo');

    expect(action).toEqual({
      type: 'NAVIGATE',
      payload: {
        name: 'Foo',
        path: '/foo',
        params: {},
        pop: true,
      },
    });

    return null;
  };

  await render(
    <NavigationContainer linking={config}>
      <Test />
    </NavigationContainer>
  );
});

test('builds action from href in navigator screen', async () => {
  expect.assertions(1);

  const Test = () => {
    const { buildAction } = useLinkBuilder();

    const action = buildAction('/foo');

    expect(action).toEqual({
      type: 'NAVIGATE',
      payload: {
        name: 'Foo',
        path: '/foo',
        params: {},
        pop: true,
      },
    });

    return null;
  };

  const Stack = createStackNavigator<{ Foo: undefined }>();

  await render(
    <NavigationContainer linking={config}>
      <Stack.Navigator>
        <Stack.Screen name="Foo" component={Test} />
      </Stack.Navigator>
    </NavigationContainer>
  );
});

test('builds action from href in nested navigator', async () => {
  expect.assertions(1);

  const Test = () => {
    const { buildAction } = useLinkBuilder();

    const action = buildAction('/foo/bar/42');

    expect(action).toEqual({
      type: 'NAVIGATE',
      payload: {
        name: 'Foo',
        params: {
          initial: true,
          screen: 'Bar',
          params: { id: '42' },
          path: '/foo/bar/42',
        },
        pop: true,
      },
    });

    return null;
  };

  const StackA = createStackNavigator<{ Foo: undefined }>();
  const StackB = createStackNavigator<{ Bar: { id: string } }>();

  await render(
    <NavigationContainer linking={config}>
      <StackA.Navigator>
        <StackA.Screen name="Foo">
          {() => (
            <StackB.Navigator>
              <StackB.Screen name="Bar" component={Test} />
            </StackB.Navigator>
          )}
        </StackA.Screen>
      </StackA.Navigator>
    </NavigationContainer>
  );
});

test('builds action from href for URL with scheme and host', async () => {
  expect.assertions(2);

  const Root = () => {
    const { buildAction } = useLinkBuilder();

    expect(buildAction('myapp://foo/bar/42')).toEqual({
      type: 'NAVIGATE',
      payload: {
        name: 'Foo',
        params: {
          initial: true,
          screen: 'Bar',
          params: { id: '42' },
          path: '/foo/bar/42',
        },
        pop: true,
      },
    });

    expect(buildAction('http://myapp.org/foo/bar/42')).toEqual({
      type: 'NAVIGATE',
      payload: {
        name: 'Foo',
        params: {
          initial: true,
          screen: 'Bar',
          params: { id: '42' },
          path: '/foo/bar/42',
        },
        pop: true,
      },
    });

    return null;
  };

  await render(
    <NavigationContainer linking={config}>
      <Root />
    </NavigationContainer>
  );
});

test('builds action from href for URL with custom prefixes', async () => {
  // expect.assertions(2);

  const Root = () => {
    const { buildAction } = useLinkBuilder();

    expect(buildAction('foo://foo/bar/42')).toEqual({
      type: 'NAVIGATE',
      payload: {
        name: 'Foo',
        params: {
          initial: true,
          screen: 'Bar',
          params: { id: '42' },
          path: '/foo/bar/42',
        },
        pop: true,
      },
    });

    expect(buildAction('https://foo.example.com/foo/bar/42')).toEqual({
      type: 'NAVIGATE',
      payload: {
        name: 'Foo',
        params: {
          initial: true,
          screen: 'Bar',
          params: { id: '42' },
          path: '/foo/bar/42',
        },
        pop: true,
      },
    });

    expect(buildAction('https://test.myapp.com/foo/bar/42')).toEqual({
      type: 'NAVIGATE',
      payload: {
        name: 'Foo',
        params: {
          initial: true,
          screen: 'Bar',
          params: { id: '42' },
          path: '/foo/bar/42',
        },
        pop: true,
      },
    });

    expect(() => buildAction('otherscheme://foo/bar/42')).toThrow(
      "Got invalid href 'otherscheme://foo/bar/42'. It must start with '/' or match one of the prefixes: 'foo://', 'https://foo.example.com', 'https://*.myapp.com'."
    );

    expect(() =>
      buildAction('https://test.otherdomain.com/foo/bar/42')
    ).toThrow(
      "Got invalid href 'https://test.otherdomain.com/foo/bar/42'. It must start with '/' or match one of the prefixes: 'foo://', 'https://foo.example.com', 'https://*.myapp.com'."
    );

    return null;
  };

  await render(
    <NavigationContainer
      linking={{
        ...config,
        prefixes: ['foo://', 'https://foo.example.com', 'https://*.myapp.com'],
      }}
    >
      <Root />
    </NavigationContainer>
  );
});

test('throws for invalid hrefs', async () => {
  // expect.assertions(2);

  const Root = () => {
    const { buildAction } = useLinkBuilder();

    expect(() => buildAction('foo/bar/42')).toThrow(
      "Got invalid href 'foo/bar/42'. It must start with '/' or match one of the prefixes: '*'."
    );

    return null;
  };

  await render(
    <NavigationContainer linking={config}>
      <Root />
    </NavigationContainer>
  );
});

test('builds action for shared path in the current tab', async () => {
  type HomeStackParamList = {
    Home: undefined;
    Profile: { id: string };
  };

  type SearchStackParamList = {
    Search: undefined;
    Profile: { id: string };
  };

  type RootStackParamList = {
    HomeBranch: NavigatorScreenParams<HomeStackParamList>;
    SearchBranch: NavigatorScreenParams<SearchStackParamList>;
  };

  const linking: LinkingOptions<RootStackParamList> = {
    config: {
      screens: {
        HomeBranch: {
          initialRouteName: 'Home',
          screens: {
            Home: '',
            Profile: {
              path: 'profile/:id',
              shared: true,
            },
          },
        },
        SearchBranch: {
          initialRouteName: 'Search',
          screens: {
            Search: 'search',
            Profile: {
              path: 'profile/:id',
              shared: true,
            },
          },
        },
      },
    },
    getInitialURL() {
      return null;
    },
  };

  let buildAction: ReturnType<typeof useLinkBuilder>['buildAction'] | undefined;

  const Test = () => {
    buildAction = useLinkBuilder().buildAction;
    return null;
  };

  const RootStack = createStackNavigator<RootStackParamList>();
  const HomeStack = createStackNavigator<HomeStackParamList>();
  const SearchStack = createStackNavigator<SearchStackParamList>();

  const navigation = createNavigationContainerRef<RootStackParamList>();

  await render(
    <NavigationContainer
      ref={navigation}
      linking={linking}
      initialState={{
        routes: [
          {
            name: 'SearchBranch',
            state: {
              routes: [{ name: 'Search' }],
            },
          },
        ],
      }}
    >
      <RootStack.Navigator>
        <RootStack.Screen name="HomeBranch">
          {() => (
            <HomeStack.Navigator>
              <HomeStack.Screen name="Home">{() => null}</HomeStack.Screen>
              <HomeStack.Screen name="Profile">{() => null}</HomeStack.Screen>
            </HomeStack.Navigator>
          )}
        </RootStack.Screen>
        <RootStack.Screen name="SearchBranch">
          {() => (
            <SearchStack.Navigator>
              <SearchStack.Screen name="Search" component={Test} />
              <SearchStack.Screen name="Profile">
                {() => null}
              </SearchStack.Screen>
            </SearchStack.Navigator>
          )}
        </RootStack.Screen>
      </RootStack.Navigator>
    </NavigationContainer>
  );

  expect(buildAction?.('/profile/123')).toEqual({
    type: 'NAVIGATE',
    payload: {
      name: 'SearchBranch',
      params: {
        initial: false,
        screen: 'Profile',
        params: { id: '123' },
        path: '/profile/123',
      },
      pop: true,
    },
  });

  await act(() => {
    navigation.navigate('HomeBranch', { screen: 'Home' });
  });

  expect(buildAction?.('/profile/123')).toEqual({
    type: 'NAVIGATE',
    payload: {
      name: 'HomeBranch',
      params: {
        initial: false,
        screen: 'Profile',
        params: { id: '123' },
        path: '/profile/123',
      },
      pop: true,
    },
  });
});

test('throws if no prefixes are defined', async () => {
  expect.assertions(3);

  const Root = () => {
    const { buildAction } = useLinkBuilder();

    expect(() => buildAction('myapp://foo/bar/42')).toThrow(
      "Failed to parse href 'myapp://foo/bar/42'. It doesn't start with '/' and no prefixes are defined in linking config."
    );

    expect(() => buildAction('https://myapp.org/foo/bar/42')).toThrow(
      "Failed to parse href 'https://myapp.org/foo/bar/42'. It doesn't start with '/' and no prefixes are defined in linking config."
    );

    expect(() => buildAction('foo/bar/42')).toThrow(
      "Failed to parse href 'foo/bar/42'. It doesn't start with '/' and no prefixes are defined in linking config."
    );

    return null;
  };

  await render(
    <NavigationContainer
      linking={{
        ...config,
        prefixes: [],
      }}
    >
      <Root />
    </NavigationContainer>
  );
});

test('throws for hrefs that do not match the filter', async () => {
  expect.assertions(2);

  const Root = () => {
    const { buildAction } = useLinkBuilder();

    expect(() => buildAction('https://myapp.org/foo/bar/42')).not.toThrow(
      "Failed to parse href 'https://myapp.org/foo/bar/42'. It doesn't match the filter specified in linking config."
    );

    expect(() => buildAction('https://myapp.org/foo/bar/42+skip-this')).toThrow(
      "Failed to parse href 'https://myapp.org/foo/bar/42+skip-this'. It doesn't match the filter specified in linking config."
    );

    return null;
  };

  await render(
    <NavigationContainer
      linking={{
        ...config,
        filter: (href) => !href.includes('+skip-this'),
      }}
    >
      <Root />
    </NavigationContainer>
  );
});
