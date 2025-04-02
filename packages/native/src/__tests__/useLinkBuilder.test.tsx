import { expect, test } from '@jest/globals';
import { NavigationRouteContext } from '@react-navigation/core';
import type { NavigationState } from '@react-navigation/routers';
import { render } from '@testing-library/react-native';

import { createStackNavigator } from '../__stubs__/createStackNavigator';
import { NavigationContainer } from '../NavigationContainer';
import { useLinkBuilder } from '../useLinkBuilder';

test('builds href from name and params', () => {
  expect.assertions(7);

  const config = {
    prefixes: ['https://example.com'],
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

  const Root = () => {
    const { buildHref } = useLinkBuilder();

    const href = buildHref('Foo');

    expect(href).toBe('/foo');

    return null;
  };

  let element = render(
    <NavigationContainer linking={config}>
      <Root />
    </NavigationContainer>
  );

  element.unmount();

  const AContextChild = () => {
    const { buildHref } = useLinkBuilder();

    const href = buildHref('Foo');

    expect(href).toBe('/foo');

    return null;
  };

  const ALayout = ({
    state,
    children,
  }: {
    state: NavigationState;
    children: React.ReactNode;
  }) => {
    const { buildHref } = useLinkBuilder();

    const href = buildHref('Foo');

    expect(href).toBe('/foo');

    return (
      <>
        <NavigationRouteContext.Provider
          value={state.routes.find((r) => r.name === 'Foo')}
        >
          <AContextChild />
        </NavigationRouteContext.Provider>
        {children}
      </>
    );
  };

  const AScreen = () => {
    const { buildHref } = useLinkBuilder();

    const href = buildHref('Foo');

    expect(href).toBe('/foo');

    return null;
  };

  const StackA = createStackNavigator<{ Foo: undefined }>();

  element = render(
    <NavigationContainer linking={config}>
      <StackA.Navigator
        layout={({ state, children }) => (
          <ALayout state={state}>{children}</ALayout>
        )}
      >
        <StackA.Screen name="Foo" component={AScreen} />
      </StackA.Navigator>
    </NavigationContainer>
  );

  element.unmount();

  const BContextChild = () => {
    const { buildHref } = useLinkBuilder();

    const href = buildHref('Bar', { id: '42' });

    expect(href).toBe('/foo/bar/42');

    return null;
  };

  const BLayout = ({
    state,
    children,
  }: {
    state: NavigationState;
    children: React.ReactNode;
  }) => {
    const { buildHref } = useLinkBuilder();

    const href = buildHref('Bar', { id: '42' });

    expect(href).toBe('/foo/bar/42');

    return (
      <>
        <NavigationRouteContext.Provider
          value={state.routes.find((r) => r.name === 'Bar')}
        >
          <BContextChild />
        </NavigationRouteContext.Provider>
        {children}
      </>
    );
  };

  const BScreen = () => {
    const { buildHref } = useLinkBuilder();

    const href = buildHref('Bar', { id: '42' });

    expect(href).toBe('/foo/bar/42');

    return null;
  };

  const StackB = createStackNavigator<{ Bar: { id: string } }>();

  element = render(
    <NavigationContainer linking={config}>
      <StackA.Navigator>
        <StackA.Screen name="Foo">
          {() => (
            <StackB.Navigator
              layout={({ state, children }) => (
                <BLayout state={state}>{children}</BLayout>
              )}
            >
              <StackB.Screen name="Bar" component={BScreen} />
            </StackB.Navigator>
          )}
        </StackA.Screen>
      </StackA.Navigator>
    </NavigationContainer>
  );

  element.unmount();
});

test('builds action from href', () => {
  expect.assertions(3);

  const config = {
    prefixes: ['https://example.com'],
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

  const A = () => {
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

  let element = render(
    <NavigationContainer linking={config}>
      <A />
    </NavigationContainer>
  );

  element.unmount();

  const StackA = createStackNavigator<{ Foo: undefined }>();

  element = render(
    <NavigationContainer linking={config}>
      <StackA.Navigator>
        <StackA.Screen name="Foo" component={A} />
      </StackA.Navigator>
    </NavigationContainer>
  );

  element.unmount();

  const B = () => {
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

  const StackB = createStackNavigator<{ Bar: { id: string } }>();

  element = render(
    <NavigationContainer linking={config}>
      <StackA.Navigator>
        <StackA.Screen name="Foo">
          {() => (
            <StackB.Navigator>
              <StackB.Screen name="Bar" component={B} />
            </StackB.Navigator>
          )}
        </StackA.Screen>
      </StackA.Navigator>
    </NavigationContainer>
  );

  element.unmount();
});
