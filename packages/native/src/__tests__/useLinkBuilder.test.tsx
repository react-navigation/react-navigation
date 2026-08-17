import { expect, test } from '@jest/globals';
import {
  createNavigationContainerRef,
  type NavigationProp,
  NavigationRouteContext,
  type NavigatorScreenParams,
  type ParamListBase,
  useNavigation,
} from '@react-navigation/core';
import { act, render } from '@testing-library/react-native';

import { createStackNavigator } from '../__stubs__/createStackNavigator';
import { NavigationContainer } from '../NavigationContainer';
import { useLinkBuilder } from '../useLinkBuilder';

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

  let buildAction: ReturnType<typeof useLinkBuilder>['buildAction'] | undefined;

  const Test = () => {
    buildAction = useLinkBuilder().buildAction;

    return null;
  };

  render(
    <NavigationContainer linking={config}>
      <Test />
    </NavigationContainer>
  );

  expect(buildAction?.('/foo')).toEqual({
    type: 'NAVIGATE',
    payload: {
      name: 'Foo',
      path: '/foo',
      params: {},
      pop: true,
    },
  });
});

test('builds action from href in navigator screen', () => {
  expect.assertions(1);

  let buildAction: ReturnType<typeof useLinkBuilder>['buildAction'] | undefined;

  const Test = () => {
    buildAction = useLinkBuilder().buildAction;

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

  expect(buildAction?.('/foo')).toEqual({
    type: 'NAVIGATE',
    target: expect.any(String),
    payload: {
      name: 'Foo',
      path: '/foo',
      params: {},
      pop: true,
    },
  });
});

test('builds action from href in nested navigator', () => {
  expect.assertions(1);

  let buildAction: ReturnType<typeof useLinkBuilder>['buildAction'] | undefined;

  const Test = () => {
    buildAction = useLinkBuilder().buildAction;

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

  expect(buildAction?.('/foo/bar/42')).toEqual({
    type: 'NAVIGATE',
    target: expect.any(String),
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
});

test('handles the built action in the root navigator', () => {
  type NestedParamList = {
    Home: undefined;
    Target: undefined;
  };

  type RootParamList = {
    Nested: NavigatorScreenParams<NestedParamList>;
    Target: undefined;
  };

  const RootStack = createStackNavigator<RootParamList>();
  const NestedStack = createStackNavigator<NestedParamList>();
  const rootNavigation = createNavigationContainerRef<RootParamList>();

  let childNavigation: NavigationProp<ParamListBase> | undefined;
  let buildAction: ReturnType<typeof useLinkBuilder>['buildAction'] | undefined;

  const HomeScreen = () => {
    childNavigation = useNavigation<NavigationProp<ParamListBase>>();
    buildAction = useLinkBuilder().buildAction;

    return null;
  };

  render(
    <NavigationContainer
      ref={rootNavigation}
      linking={{
        prefixes: [],
        config: {
          screens: {
            Nested: {
              screens: {
                Home: '',
                Target: 'nested-target',
              },
            },
            Target: 'target',
          },
        },
        getInitialURL: () => null,
      }}
    >
      <RootStack.Navigator>
        <RootStack.Screen name="Nested">
          {() => (
            <NestedStack.Navigator>
              <NestedStack.Screen name="Home" component={HomeScreen} />
              <NestedStack.Screen name="Target">
                {() => null}
              </NestedStack.Screen>
            </NestedStack.Navigator>
          )}
        </RootStack.Screen>
        <RootStack.Screen name="Target">{() => null}</RootStack.Screen>
      </RootStack.Navigator>
    </NavigationContainer>
  );

  const navigation = childNavigation;

  if (navigation == null || buildAction == null) {
    throw new Error('Expected linking helpers to be ready');
  }

  const action = buildAction('/target');

  act(() => navigation.dispatch(action));

  const rootState = rootNavigation.getRootState();

  expect(rootState?.routes[rootState.index].name).toBe('Target');
});

test('handles the built reset action in the root navigator', () => {
  type NestedParamList = {
    Home: undefined;
    Target: undefined;
  };

  type RootParamList = {
    Nested: NavigatorScreenParams<NestedParamList>;
    Target: undefined;
  };

  const RootStack = createStackNavigator<RootParamList>();
  const NestedStack = createStackNavigator<NestedParamList>();
  const rootNavigation = createNavigationContainerRef<RootParamList>();

  let childNavigation: NavigationProp<ParamListBase> | undefined;
  let buildAction: ReturnType<typeof useLinkBuilder>['buildAction'] | undefined;

  const HomeScreen = () => {
    childNavigation = useNavigation<NavigationProp<ParamListBase>>();
    buildAction = useLinkBuilder().buildAction;

    return null;
  };

  render(
    <NavigationContainer
      ref={rootNavigation}
      linking={{
        prefixes: [],
        config: {
          screens: {
            Nested: {
              screens: {
                Home: '',
                Target: 'nested-target',
              },
            },
            Target: 'target',
          },
        },
        getActionFromState: () => undefined,
        getInitialURL: () => null,
      }}
    >
      <RootStack.Navigator>
        <RootStack.Screen name="Nested">
          {() => (
            <NestedStack.Navigator>
              <NestedStack.Screen name="Home" component={HomeScreen} />
              <NestedStack.Screen name="Target">
                {() => null}
              </NestedStack.Screen>
            </NestedStack.Navigator>
          )}
        </RootStack.Screen>
        <RootStack.Screen name="Target">{() => null}</RootStack.Screen>
      </RootStack.Navigator>
    </NavigationContainer>
  );

  const navigation = childNavigation;

  if (navigation == null || buildAction == null) {
    throw new Error('Expected linking helpers to be ready');
  }

  const action = buildAction('/target');

  act(() => navigation.dispatch(action));

  expect(rootNavigation.getRootState()?.routes).toEqual([
    expect.objectContaining({ name: 'Target' }),
  ]);
});
