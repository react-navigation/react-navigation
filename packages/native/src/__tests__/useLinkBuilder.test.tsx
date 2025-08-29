import { expect, test } from '@jest/globals';
import { NavigationRouteContext } from '@react-navigation/core';
import { render } from '@testing-library/react-native';

import { createStackNavigator } from '../__stubs__/createStackNavigator';
import { NavigationContainer } from '../NavigationContainer';
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

test('builds href outside of a navigator', () => {
  expect.assertions(1);

  const Root = () => {
    const { buildHref } = useLinkBuilder();

    const href = buildHref('Foo');

    expect(href).toBe('/foo');

    return null;
  };

  render(
    <NavigationContainer linking={config}>
      <Root />
    </NavigationContainer>
  );
});

test('builds href in navigator layout', () => {
  expect.assertions(1);

  const Test = ({ children }: { children: React.ReactNode }) => {
    const { buildHref } = useLinkBuilder();

    const href = buildHref('Foo');

    expect(href).toBe('/foo');

    return children;
  };

  const Stack = createStackNavigator<{ Foo: undefined }>();

  render(
    <NavigationContainer linking={config}>
      <Stack.Navigator layout={({ children }) => <Test>{children}</Test>}>
        <Stack.Screen name="Foo">{() => null}</Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
});

test('builds href in route context', () => {
  expect.assertions(1);

  const Test = () => {
    const { buildHref } = useLinkBuilder();

    const href = buildHref('Foo');

    expect(href).toBe('/foo');

    return null;
  };

  const Stack = createStackNavigator<{ Foo: undefined }>();

  render(
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

test('builds href in stack navigator screen', () => {
  expect.assertions(1);

  const Test = () => {
    const { buildHref } = useLinkBuilder();

    const href = buildHref('Foo');

    expect(href).toBe('/foo');

    return null;
  };

  const StackA = createStackNavigator<{ Foo: undefined }>();

  render(
    <NavigationContainer linking={config}>
      <StackA.Navigator>
        <StackA.Screen name="Foo" component={Test} />
      </StackA.Navigator>
    </NavigationContainer>
  );
});

test('builds href in nested navigator layout', () => {
  expect.assertions(1);

  const Test = ({ children }: { children: React.ReactNode }) => {
    const { buildHref } = useLinkBuilder();

    const href = buildHref('Bar', { id: '42' });

    expect(href).toBe('/foo/bar/42');

    return children;
  };

  const StackA = createStackNavigator<{ Foo: undefined }>();
  const StackB = createStackNavigator<{ Bar: { id: string } }>();

  render(
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

test('builds href in nested route context', () => {
  expect.assertions(1);

  const Test = () => {
    const { buildHref } = useLinkBuilder();

    const href = buildHref('Bar', { id: '42' });

    expect(href).toBe('/foo/bar/42');

    return null;
  };

  const StackA = createStackNavigator<{ Foo: undefined }>();
  const StackB = createStackNavigator<{ Bar: { id: string } }>();

  render(
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

test('builds href in nested navigator screen', () => {
  expect.assertions(1);

  const Test = () => {
    const { buildHref } = useLinkBuilder();

    const href = buildHref('Bar', { id: '42' });

    expect(href).toBe('/foo/bar/42');

    return null;
  };

  const StackA = createStackNavigator<{ Foo: undefined }>();
  const StackB = createStackNavigator<{ Bar: { id: string } }>();

  render(
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

test('builds action from href outside of a navigator', () => {
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

  render(
    <NavigationContainer linking={config}>
      <Test />
    </NavigationContainer>
  );
});

test('builds action from href in navigator screen', () => {
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

  render(
    <NavigationContainer linking={config}>
      <Stack.Navigator>
        <Stack.Screen name="Foo" component={Test} />
      </Stack.Navigator>
    </NavigationContainer>
  );
});

test('builds action from href in nested navigator', () => {
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

  render(
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

test('builds action from href for URL with scheme and host', () => {
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

  render(
    <NavigationContainer linking={config}>
      <Root />
    </NavigationContainer>
  );
});

test('builds action from href for URL with custom prefixes', () => {
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

  render(
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

test('throws for invalid hrefs', () => {
  // expect.assertions(2);

  const Root = () => {
    const { buildAction } = useLinkBuilder();

    expect(() => buildAction('foo/bar/42')).toThrow(
      "Got invalid href 'foo/bar/42'. It must start with '/' or match one of the prefixes: '*'."
    );

    return null;
  };

  render(
    <NavigationContainer linking={config}>
      <Root />
    </NavigationContainer>
  );
});

test('throws if no prefixes are defined', () => {
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

  render(
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

test('throws for hrefs that do not match the filter', () => {
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

  render(
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
