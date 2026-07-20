/**
 * @jest-environment jsdom
 * @jest-environment-options {"url":"https://example.com"}
 */

import { expect, jest, test } from '@jest/globals';
import {
  createNavigationContainerRef,
  createNavigatorFactory,
  type EventMapBase,
  type NavigatorScreenParams,
  type ParamListBase,
  type StackNavigationState,
  StackRouter,
  type TabNavigationState,
  TabRouter,
  type TypedNavigator,
  useNavigationBuilder,
} from '@react-navigation/core';
import * as React from 'react';
import { act } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';

import { NavigationContainer } from '../NavigationContainer';
import type { LinkingOptions } from '../types';

// We want to use the web version of useLinking
// eslint-disable-next-line import-x/extensions
jest.mock('../useLinking', () => require('../useLinking.tsx'));

type NavigatorProps = Parameters<typeof useNavigationBuilder>[1];

const StackNavigator = (props: NavigatorProps) => {
  const { state, descriptors, NavigationContent } = useNavigationBuilder(
    StackRouter,
    props
  );

  const route = state.routes[state.index];

  return (
    <NavigationContent>
      <div>{route ? descriptors[route.key]?.render() : null}</div>
    </NavigationContent>
  );
};

const TabNavigator = (props: NavigatorProps) => {
  const { state, descriptors, NavigationContent } = useNavigationBuilder(
    TabRouter,
    props
  );

  return (
    <NavigationContent>
      {state.routes.map((route) => (
        <div key={route.key}>{descriptors[route.key]?.render()}</div>
      ))}
    </NavigationContent>
  );
};

type TestNavigatorTypeBag<
  ParamList extends ParamListBase,
  State extends StackNavigationState<ParamList> | TabNavigationState<ParamList>,
  Navigator extends React.ComponentType<NavigatorProps>,
> = {
  ParamList: ParamList;
  NavigatorID: string | undefined;
  State: State;
  ScreenOptions: {};
  EventMap: EventMapBase;
  NavigationList: {
    [RouteName in keyof ParamList]: unknown;
  };
  Navigator: Navigator;
};

function createStackNavigator<
  const ParamList extends ParamListBase,
>(): TypedNavigator<
  TestNavigatorTypeBag<
    ParamList,
    StackNavigationState<ParamList>,
    typeof StackNavigator
  >,
  undefined
> {
  return createNavigatorFactory(StackNavigator)();
}

function createTabNavigator<
  const ParamList extends ParamListBase,
>(): TypedNavigator<
  TestNavigatorTypeBag<
    ParamList,
    TabNavigationState<ParamList>,
    typeof TabNavigator
  >,
  undefined
> {
  return createNavigatorFactory(TabNavigator)();
}

const hydrate = (
  element: React.ReactNode,
  options?: Parameters<typeof hydrateRoot>[2]
) => {
  const root = hydrateRoot(document.body, element, options);

  const unmount = () => {
    act(() => root.unmount());
  };

  return { unmount, [Symbol.dispose]: unmount };
};

const waitForPath = (path: string) =>
  act(
    () =>
      new Promise<void>((resolve, reject) => {
        if (window.location.pathname === path) {
          resolve();
        } else {
          const listener = () => {
            if (window.location.pathname === path) {
              resolve();
            } else {
              reject(
                new Error(
                  `Expected path to be ${path}, but got ${window.location.pathname}`
                )
              );
            }
          };

          window.addEventListener('popstate', listener, { once: true });
        }
      })
  );

test('preserves the linked path while a nested navigator hydrates', async () => {
  type InnerParamList = {
    Feed: undefined;
    Details: { id: string };
  };

  type RootParamList = {
    Home: NavigatorScreenParams<InnerParamList>;
  };

  const RootStack = createStackNavigator<RootParamList>();
  const InnerStack = createStackNavigator<InnerParamList>();

  const { promise, resolve } = Promise.withResolvers<void>();

  const NestedNavigator = () => {
    React.use(promise);

    return (
      <InnerStack.Navigator initialRouteName="Feed">
        <InnerStack.Screen name="Feed">{() => 'Feed'}</InnerStack.Screen>
        <InnerStack.Screen name="Details">{() => 'Details'}</InnerStack.Screen>
      </InnerStack.Navigator>
    );
  };

  const linking: LinkingOptions<RootParamList> = {
    prefixes: [],
    config: {
      screens: {
        Home: {
          path: '',
          screens: {
            Feed: 'feed',
            Details: 'details/:id',
          },
        },
      },
    },
  };

  document.body.innerHTML = renderToString(
    <div>
      <React.Suspense fallback="Loading">
        <div>Details</div>
      </React.Suspense>
    </div>
  );

  window.history.replaceState(null, '', '/details/42');

  const navigation = createNavigationContainerRef<RootParamList>();

  const onReady = jest.fn();
  const onRecoverableError = jest.fn();

  using _ = hydrate(
    <NavigationContainer linking={linking} onReady={onReady} ref={navigation}>
      <RootStack.Navigator>
        <RootStack.Screen
          name="Home"
          component={NestedNavigator}
          layout={({ children }) => (
            <React.Suspense fallback="Loading">{children}</React.Suspense>
          )}
        />
      </RootStack.Navigator>
    </NavigationContainer>,
    { onRecoverableError }
  );

  await act(() => Promise.resolve());

  expect(document.body.textContent).toBe('Details');

  expect(onReady).toHaveBeenCalledTimes(1);
  expect(navigation.isReady()).toBe(true);

  expect(navigation.getRootState().routes[0]?.state).toBeUndefined();
  expect(navigation.getState().routes[0]?.state).toBeDefined();

  expect(window.location.pathname).toBe('/details/42');

  await act(async () => {
    resolve();

    await promise;
  });

  expect(onReady).toHaveBeenCalledTimes(1);

  expect(navigation.getCurrentRoute()).toMatchObject({
    name: 'Details',
    params: { id: '42' },
  });

  expect(window.location.pathname).toBe('/details/42');

  expect(onRecoverableError).not.toHaveBeenCalled();
});

test('updates the path when navigating away before hydration completes', async () => {
  type InnerParamList = {
    Feed: undefined;
    Details: { id: string };
  };

  type RootParamList = {
    Home: NavigatorScreenParams<InnerParamList>;
    Settings: undefined;
  };

  const RootStack = createStackNavigator<RootParamList>();
  const InnerStack = createStackNavigator<InnerParamList>();

  const { promise, resolve } = Promise.withResolvers<void>();

  const NestedNavigator = () => {
    React.use(promise);

    return (
      <InnerStack.Navigator initialRouteName="Feed">
        <InnerStack.Screen name="Feed">{() => 'Feed'}</InnerStack.Screen>
        <InnerStack.Screen name="Details">{() => 'Details'}</InnerStack.Screen>
      </InnerStack.Navigator>
    );
  };

  const linking: LinkingOptions<RootParamList> = {
    prefixes: [],
    config: {
      screens: {
        Home: {
          path: '',
          screens: {
            Feed: 'feed',
            Details: 'details/:id',
          },
        },
        Settings: 'settings',
      },
    },
  };

  document.body.innerHTML = renderToString(
    <div>
      <React.Suspense fallback="Loading">
        <div>Details</div>
      </React.Suspense>
    </div>
  );

  window.history.replaceState(null, '', '/details/42');

  const navigation = createNavigationContainerRef<RootParamList>();

  const onReady = jest.fn();
  const onRecoverableError = jest.fn();

  using _ = hydrate(
    <NavigationContainer linking={linking} onReady={onReady} ref={navigation}>
      <RootStack.Navigator>
        <RootStack.Screen
          name="Home"
          component={NestedNavigator}
          layout={({ children }) => (
            <React.Suspense fallback="Loading">{children}</React.Suspense>
          )}
        />
        <RootStack.Screen name="Settings">{() => 'Settings'}</RootStack.Screen>
      </RootStack.Navigator>
    </NavigationContainer>,
    { onRecoverableError }
  );

  await act(() => Promise.resolve());

  expect(onReady).toHaveBeenCalledTimes(1);
  expect(navigation.isReady()).toBe(true);

  act(() => navigation.navigate('Settings'));

  await act(() => Promise.resolve());

  expect(navigation.getCurrentRoute()?.name).toBe('Settings');

  expect(window.location.pathname).toBe('/settings');

  await act(async () => {
    resolve();

    await promise;
  });

  expect(onReady).toHaveBeenCalledTimes(1);

  expect(navigation.getCurrentRoute()?.name).toBe('Settings');

  expect(window.location.pathname).toBe('/settings');

  expect(onRecoverableError).not.toHaveBeenCalled();
});

test('preserves the linked path while the focused route chain hydrates', async () => {
  type DeepParamList = {
    Details: { id: string };
  };

  type MiddleParamList = {
    Content: NavigatorScreenParams<DeepParamList>;
  };

  type RootParamList = {
    Home: NavigatorScreenParams<MiddleParamList>;
  };

  const RootStack = createStackNavigator<RootParamList>();
  const MiddleStack = createStackNavigator<MiddleParamList>();
  const DeepStack = createStackNavigator<DeepParamList>();

  const { promise: middlePromise, resolve: resolveMiddle } =
    Promise.withResolvers<void>();
  const { promise: innerPromise, resolve: resolveInner } =
    Promise.withResolvers<void>();

  const DeepNavigator = () => {
    React.use(innerPromise);

    return (
      <DeepStack.Navigator>
        <DeepStack.Screen name="Details">{() => 'Details'}</DeepStack.Screen>
      </DeepStack.Navigator>
    );
  };

  const MiddleNavigator = () => {
    React.use(middlePromise);

    return (
      <MiddleStack.Navigator>
        <MiddleStack.Screen
          name="Content"
          component={DeepNavigator}
          layout={({ children }) => (
            <React.Suspense fallback="Loading inner">{children}</React.Suspense>
          )}
        />
      </MiddleStack.Navigator>
    );
  };

  const linking: LinkingOptions<RootParamList> = {
    prefixes: [],
    config: {
      screens: {
        Home: {
          path: '',
          screens: {
            Content: {
              path: '',
              screens: {
                Details: 'details/:id',
              },
            },
          },
        },
      },
    },
  };

  document.body.innerHTML = renderToString(
    <div>
      <React.Suspense fallback="Loading middle">
        <div>
          <React.Suspense fallback="Loading inner">
            <div>Details</div>
          </React.Suspense>
        </div>
      </React.Suspense>
    </div>
  );

  window.history.replaceState(null, '', '/details/42');

  const navigation = createNavigationContainerRef<RootParamList>();

  const onReady = jest.fn();
  const onRecoverableError = jest.fn();

  using _ = hydrate(
    <NavigationContainer linking={linking} onReady={onReady} ref={navigation}>
      <RootStack.Navigator>
        <RootStack.Screen
          name="Home"
          component={MiddleNavigator}
          layout={({ children }) => (
            <React.Suspense fallback="Loading middle">
              {children}
            </React.Suspense>
          )}
        />
      </RootStack.Navigator>
    </NavigationContainer>,
    { onRecoverableError }
  );

  await act(() => Promise.resolve());

  expect(onReady).toHaveBeenCalledTimes(1);
  expect(navigation.isReady()).toBe(true);

  expect(navigation.getRootState().routes[0]?.state).toBeUndefined();

  expect(window.location.pathname).toBe('/details/42');

  await act(async () => {
    resolveMiddle();

    await middlePromise;
  });

  expect(onReady).toHaveBeenCalledTimes(1);

  expect(window.location.pathname).toBe('/details/42');

  await act(async () => {
    resolveInner();

    await innerPromise;
  });

  expect(onReady).toHaveBeenCalledTimes(1);

  expect(navigation.getCurrentRoute()).toMatchObject({
    name: 'Details',
    params: { id: '42' },
  });

  expect(window.location.pathname).toBe('/details/42');

  expect(onRecoverableError).not.toHaveBeenCalled();
});

test('does not wait for an unfocused route to hydrate', async () => {
  type TabParamList = {
    Home: undefined;
    Deferred: undefined;
  };

  const Tab = createTabNavigator<TabParamList>();

  const linking: LinkingOptions<TabParamList> = {
    prefixes: [],
    config: {
      screens: {
        Home: '',
        Deferred: 'deferred',
      },
    },
  };

  const { promise, resolve } = Promise.withResolvers<void>();

  const DeferredScreen = () => {
    React.use(promise);

    return 'Deferred';
  };

  document.body.innerHTML = renderToString(
    <>
      <div>Home</div>
      <div>
        <React.Suspense fallback="Loading">Deferred</React.Suspense>
      </div>
    </>
  );

  window.history.replaceState(null, '', '/');

  const navigation = createNavigationContainerRef<TabParamList>();

  const onReady = jest.fn();
  const onRecoverableError = jest.fn();

  using _ = hydrate(
    <NavigationContainer linking={linking} onReady={onReady} ref={navigation}>
      <Tab.Navigator>
        <Tab.Screen name="Home">{() => 'Home'}</Tab.Screen>
        <Tab.Screen
          name="Deferred"
          component={DeferredScreen}
          layout={({ children }) => (
            <React.Suspense fallback="Loading">{children}</React.Suspense>
          )}
        />
      </Tab.Navigator>
    </NavigationContainer>,
    { onRecoverableError }
  );

  await act(() => Promise.resolve());

  expect(onReady).toHaveBeenCalledTimes(1);
  expect(navigation.isReady()).toBe(true);

  expect(navigation.getCurrentRoute()?.name).toBe('Home');

  expect(window.location.pathname).toBe('/');

  await act(async () => {
    resolve();

    await promise;
  });

  expect(onReady).toHaveBeenCalledTimes(1);

  expect(document.body.textContent).toBe('HomeDeferred');

  expect(onRecoverableError).not.toHaveBeenCalled();
});

test('syncs navigation and browser history after hydration completes', async () => {
  type InnerParamList = {
    Feed: undefined;
    Details: { id: string };
  };

  type RootParamList = {
    Home: NavigatorScreenParams<InnerParamList>;
  };

  const RootStack = createStackNavigator<RootParamList>();
  const InnerStack = createStackNavigator<InnerParamList>();

  const { promise, resolve } = Promise.withResolvers<void>();

  const NestedNavigator = () => {
    React.use(promise);

    return (
      <InnerStack.Navigator initialRouteName="Feed">
        <InnerStack.Screen name="Feed">{() => 'Feed'}</InnerStack.Screen>
        <InnerStack.Screen name="Details">{() => 'Details'}</InnerStack.Screen>
      </InnerStack.Navigator>
    );
  };

  const linking: LinkingOptions<RootParamList> = {
    prefixes: [],
    config: {
      screens: {
        Home: {
          path: '',
          screens: {
            Feed: 'feed',
            Details: 'details/:id',
          },
        },
      },
    },
  };

  document.body.innerHTML = renderToString(
    <div>
      <React.Suspense fallback="Loading">
        <div>Details</div>
      </React.Suspense>
    </div>
  );

  window.history.replaceState(null, '', '/details/42');

  const navigation = createNavigationContainerRef<RootParamList>();

  const onReady = jest.fn();
  const onRecoverableError = jest.fn();

  using _ = hydrate(
    <NavigationContainer linking={linking} onReady={onReady} ref={navigation}>
      <RootStack.Navigator>
        <RootStack.Screen
          name="Home"
          component={NestedNavigator}
          layout={({ children }) => (
            <React.Suspense fallback="Loading">{children}</React.Suspense>
          )}
        />
      </RootStack.Navigator>
    </NavigationContainer>,
    { onRecoverableError }
  );

  await act(() => Promise.resolve());

  expect(onReady).toHaveBeenCalledTimes(1);
  expect(navigation.isReady()).toBe(true);

  await act(async () => {
    resolve();

    await promise;
  });

  const initialHistoryState = window.history.state;

  await act(() => navigation.navigate('Home', { screen: 'Feed' }));

  expect(navigation.getCurrentRoute()?.name).toBe('Feed');

  expect(window.location.pathname).toBe('/feed');
  expect(window.history.state).not.toEqual(initialHistoryState);

  window.history.back();

  await waitForPath('/details/42');

  expect(window.history.state).toEqual(initialHistoryState);

  expect(navigation.getCurrentRoute()).toMatchObject({
    name: 'Details',
    params: { id: '42' },
  });

  expect(onRecoverableError).not.toHaveBeenCalled();
});

test('does not sync a navigator that hydrates after unmounting', async () => {
  type InnerParamList = {
    Feed: undefined;
    Details: { id: string };
  };

  type RootParamList = {
    Home: NavigatorScreenParams<InnerParamList>;
  };

  const RootStack = createStackNavigator<RootParamList>();
  const InnerStack = createStackNavigator<InnerParamList>();

  const { promise, resolve } = Promise.withResolvers<void>();

  const NestedNavigator = () => {
    React.use(promise);

    return (
      <InnerStack.Navigator initialRouteName="Feed">
        <InnerStack.Screen name="Feed">{() => 'Feed'}</InnerStack.Screen>
        <InnerStack.Screen name="Details">{() => 'Details'}</InnerStack.Screen>
      </InnerStack.Navigator>
    );
  };

  const linking: LinkingOptions<RootParamList> = {
    prefixes: [],
    config: {
      screens: {
        Home: {
          path: '',
          screens: {
            Feed: 'feed',
            Details: 'details/:id',
          },
        },
      },
    },
  };

  document.body.innerHTML = renderToString(
    <div>
      <React.Suspense fallback="Loading">
        <div>Details</div>
      </React.Suspense>
    </div>
  );

  window.history.replaceState(null, '', '/details/42');

  const navigation = createNavigationContainerRef<RootParamList>();

  const onReady = jest.fn();
  const onRecoverableError = jest.fn();

  using root = hydrate(
    <NavigationContainer linking={linking} onReady={onReady} ref={navigation}>
      <RootStack.Navigator>
        <RootStack.Screen
          name="Home"
          component={NestedNavigator}
          layout={({ children }) => (
            <React.Suspense fallback="Loading">{children}</React.Suspense>
          )}
        />
      </RootStack.Navigator>
    </NavigationContainer>,
    { onRecoverableError }
  );

  await act(() => Promise.resolve());

  expect(onReady).toHaveBeenCalledTimes(1);
  expect(navigation.isReady()).toBe(true);

  const initialHistoryState = window.history.state;

  root.unmount();

  await act(async () => {
    resolve();

    await promise;
  });

  expect(onReady).toHaveBeenCalledTimes(1);

  expect(window.location.pathname).toBe('/details/42');
  expect(window.history.state).toEqual(initialHistoryState);

  expect(onRecoverableError).not.toHaveBeenCalled();
});

test('handles browser back and forward while hydration is pending', async () => {
  type InnerParamList = {
    Feed: undefined;
    Details: { id: string };
  };

  type RootParamList = {
    Home: NavigatorScreenParams<InnerParamList>;
  };

  const RootStack = createStackNavigator<RootParamList>();
  const InnerStack = createStackNavigator<InnerParamList>();

  const { promise, resolve } = Promise.withResolvers<void>();

  const NestedNavigator = () => {
    React.use(promise);

    return (
      <InnerStack.Navigator initialRouteName="Feed">
        <InnerStack.Screen name="Feed">{() => 'Feed'}</InnerStack.Screen>
        <InnerStack.Screen name="Details">{() => 'Details'}</InnerStack.Screen>
      </InnerStack.Navigator>
    );
  };

  const linking: LinkingOptions<RootParamList> = {
    prefixes: [],
    config: {
      screens: {
        Home: {
          path: '',
          screens: {
            Feed: 'feed',
            Details: 'details/:id',
          },
        },
      },
    },
  };

  document.body.innerHTML = renderToString(
    <div>
      <React.Suspense fallback="Loading">
        <div>Details</div>
      </React.Suspense>
    </div>
  );

  window.history.replaceState(null, '', '/feed');
  window.history.pushState(null, '', '/details/42');

  const navigation = createNavigationContainerRef<RootParamList>();

  const onReady = jest.fn();
  const onRecoverableError = jest.fn();

  using _ = hydrate(
    <NavigationContainer linking={linking} onReady={onReady} ref={navigation}>
      <RootStack.Navigator>
        <RootStack.Screen
          name="Home"
          component={NestedNavigator}
          layout={({ children }) => (
            <React.Suspense fallback="Loading">{children}</React.Suspense>
          )}
        />
      </RootStack.Navigator>
    </NavigationContainer>,
    { onRecoverableError }
  );

  await act(() => Promise.resolve());

  expect(onReady).toHaveBeenCalledTimes(1);
  expect(navigation.isReady()).toBe(true);

  window.history.back();

  await waitForPath('/feed');

  expect(onReady).toHaveBeenCalledTimes(1);

  window.history.forward();

  await waitForPath('/details/42');

  expect(onReady).toHaveBeenCalledTimes(1);

  await act(async () => {
    resolve();

    await promise;
  });

  expect(onReady).toHaveBeenCalledTimes(1);

  expect(navigation.getCurrentRoute()).toMatchObject({
    name: 'Details',
    params: { id: '42' },
  });

  expect(window.location.pathname).toBe('/details/42');

  expect(onRecoverableError).not.toHaveBeenCalled();
});
