/**
 * @jest-environment jsdom
 * @jest-environment-options {"url":"https://example.com/details/42"}
 */

import { expect, jest, test } from '@jest/globals';
import {
  createNavigationContainerRef,
  createNavigatorFactory,
  type NavigatorScreenParams,
  StackRouter,
  TabRouter,
  useNavigationBuilder,
} from '@react-navigation/core';
import * as React from 'react';
import { act } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToPipeableStream } from 'react-dom/server';
import { PassThrough } from 'stream';
import { setImmediate } from 'timers';

import { NavigationContainer } from '../../NavigationContainer';
import type { LinkingOptions } from '../../types';

// We want to use the web version of useLinking
// eslint-disable-next-line import-x/extensions
jest.mock('../../useLinking', () => require('../../useLinking.tsx'));

globalThis.setImmediate = setImmediate;

type NavigatorProps = Parameters<typeof useNavigationBuilder>[1];

const createStackNavigator = createNavigatorFactory((props: NavigatorProps) => {
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
});

const createTabNavigator = createNavigatorFactory((props: NavigatorProps) => {
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
});

const render = (element: React.ReactNode) => {
  return new Promise<string>((resolve, reject) => {
    const stream = new PassThrough();
    let result = '';

    stream.setEncoding('utf8');
    stream.on('data', (chunk) => {
      result += chunk;
    });
    stream.on('end', () => resolve(result));
    stream.on('error', reject);

    const { pipe } = renderToPipeableStream(element, {
      onShellReady() {
        pipe(stream);
      },
      onError: reject,
      onShellError: reject,
    });
  });
};

const createHydrationContainer = async (element: React.ReactNode) => {
  const container = document.createElement('div');
  container.innerHTML = await render(element);
  document.body.append(container);

  return container;
};

const traverseHistory = async (callback: () => void) => {
  await act(
    () =>
      new Promise<void>((resolve) => {
        window.addEventListener('popstate', () => resolve(), { once: true });
        callback();
      })
  );
};

type InnerParamList = {
  Feed: undefined;
  Details: { id: string };
};

type RootParamList = {
  Home: NavigatorScreenParams<InnerParamList>;
};

const RootStack = createStackNavigator<RootParamList>();
const InnerStack = createStackNavigator<InnerParamList>();

const linking: LinkingOptions<RootParamList> = {
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

const PromiseContext = React.createContext<Promise<string> | undefined>(
  undefined
);

const NestedNavigator = () => {
  const promise = React.use(PromiseContext);

  if (promise === undefined) {
    throw new Error('PromiseContext is missing');
  }

  React.use(promise);

  return (
    <InnerStack.Navigator initialRouteName="Feed">
      <InnerStack.Screen name="Feed">{() => 'Feed'}</InnerStack.Screen>
      <InnerStack.Screen name="Details">{() => 'Details'}</InnerStack.Screen>
    </InnerStack.Navigator>
  );
};

type AppProps = {
  promise: Promise<string>;
  navigation?: ReturnType<typeof createNavigationContainerRef<RootParamList>>;
  onReady?: () => void;
};

const App = ({ promise, navigation, onReady }: AppProps) => {
  return (
    <PromiseContext value={promise}>
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
      </NavigationContainer>
    </PromiseContext>
  );
};

type DeepParamList = {
  Details: { id: string };
};

type MiddleParamList = {
  Content: NavigatorScreenParams<DeepParamList>;
};

type StagedRootParamList = {
  Home: NavigatorScreenParams<MiddleParamList>;
};

const StagedRootStack = createStackNavigator<StagedRootParamList>();
const MiddleStack = createStackNavigator<MiddleParamList>();
const DeepStack = createStackNavigator<DeepParamList>();

const stagedLinking: LinkingOptions<StagedRootParamList> = {
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

type StagedPromises = {
  middle: Promise<string>;
  inner: Promise<string>;
};

const StagedPromiseContext = React.createContext<StagedPromises | undefined>(
  undefined
);

const useStagedPromises = () => {
  const promises = React.use(StagedPromiseContext);

  if (promises === undefined) {
    throw new Error('StagedPromiseContext is missing');
  }

  return promises;
};

const DeepNavigator = () => {
  const { inner } = useStagedPromises();

  React.use(inner);

  return (
    <DeepStack.Navigator>
      <DeepStack.Screen name="Details">{() => 'Details'}</DeepStack.Screen>
    </DeepStack.Navigator>
  );
};

const MiddleNavigator = () => {
  const { middle } = useStagedPromises();

  React.use(middle);

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

type StagedAppProps = {
  promises: StagedPromises;
  navigation: ReturnType<
    typeof createNavigationContainerRef<StagedRootParamList>
  >;
  onReady: () => void;
};

const StagedApp = ({ promises, navigation, onReady }: StagedAppProps) => {
  return (
    <StagedPromiseContext value={promises}>
      <NavigationContainer
        linking={stagedLinking}
        onReady={onReady}
        ref={navigation}
      >
        <StagedRootStack.Navigator>
          <StagedRootStack.Screen
            name="Home"
            component={MiddleNavigator}
            layout={({ children }) => (
              <React.Suspense fallback="Loading middle">
                {children}
              </React.Suspense>
            )}
          />
        </StagedRootStack.Navigator>
      </NavigationContainer>
    </StagedPromiseContext>
  );
};

const linkedServerTree = (
  <div>
    <React.Suspense fallback="Loading">
      <div>Details</div>
    </React.Suspense>
  </div>
);

const stagedServerTree = (
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

const hydrateLinkedApp = async () => {
  const container = await createHydrationContainer(linkedServerTree);
  const navigation = createNavigationContainerRef<RootParamList>();
  const onReady = jest.fn();
  const recoverableErrors: unknown[] = [];
  const deferred = Promise.withResolvers<string>();

  const root = hydrateRoot(
    container,
    <App
      promise={deferred.promise}
      navigation={navigation}
      onReady={onReady}
    />,
    {
      onRecoverableError: (error) => recoverableErrors.push(error),
    }
  );

  await act(() => Promise.resolve());

  return {
    container,
    deferred,
    navigation,
    onReady,
    recoverableErrors,
    root,
  };
};

test('waits for a partially hydrated navigation tree before recording linked state', async () => {
  window.history.replaceState(null, '', '/details/42');

  const { container, deferred, navigation, onReady, recoverableErrors, root } =
    await hydrateLinkedApp();

  expect(container.textContent).toBe('Details');
  expect(navigation.current).not.toBeNull();
  expect(navigation.isReady()).toBe(false);
  expect(onReady).not.toHaveBeenCalled();
  expect(window.location.pathname).toBe('/details/42');
  expect(window.history.state).toBeNull();

  await act(async () => {
    deferred.resolve('Loaded');
    await deferred.promise;
  });

  expect(onReady).toHaveBeenCalledTimes(1);
  expect(navigation.isReady()).toBe(true);
  expect(navigation.getCurrentRoute()).toMatchObject({
    name: 'Details',
    params: { id: '42' },
  });
  expect(window.location.pathname).toBe('/details/42');
  expect(window.history.state).toEqual({ id: expect.any(String) });
  expect(recoverableErrors).toEqual([]);

  await act(() => root.unmount());
});

test('waits for every navigator in the focused route chain to hydrate', async () => {
  const container = await createHydrationContainer(stagedServerTree);
  window.history.replaceState(null, '', '/details/42');

  const navigation = createNavigationContainerRef<StagedRootParamList>();
  const onReady = jest.fn();
  const recoverableErrors: unknown[] = [];
  const middle = Promise.withResolvers<string>();
  const inner = Promise.withResolvers<string>();

  const root = hydrateRoot(
    container,
    <StagedApp
      promises={{ middle: middle.promise, inner: inner.promise }}
      navigation={navigation}
      onReady={onReady}
    />,
    {
      onRecoverableError: (error) => recoverableErrors.push(error),
    }
  );

  await act(() => Promise.resolve());

  expect(navigation.isReady()).toBe(false);
  expect(onReady).not.toHaveBeenCalled();
  expect(window.location.pathname).toBe('/details/42');
  expect(window.history.state).toBeNull();

  await act(async () => {
    middle.resolve('Middle loaded');
    await middle.promise;
  });

  expect(navigation.isReady()).toBe(false);
  expect(onReady).not.toHaveBeenCalled();
  expect(window.location.pathname).toBe('/details/42');
  expect(window.history.state).toBeNull();

  await act(async () => {
    inner.resolve('Inner loaded');
    await inner.promise;
  });

  expect(navigation.isReady()).toBe(true);
  expect(onReady).toHaveBeenCalledTimes(1);
  expect(navigation.getCurrentRoute()).toMatchObject({
    name: 'Details',
    params: { id: '42' },
  });
  expect(window.location.pathname).toBe('/details/42');
  expect(window.history.state).toEqual({ id: expect.any(String) });
  expect(recoverableErrors).toEqual([]);

  await act(() => root.unmount());
});

test('does not wait for an unfocused route to hydrate', async () => {
  type TabParamList = {
    Home: undefined;
    Deferred: undefined;
  };

  const Tab = createTabNavigator<TabParamList>();
  const linking: LinkingOptions<TabParamList> = {
    config: {
      screens: {
        Home: '',
        Deferred: 'deferred',
      },
    },
  };
  const deferred = Promise.withResolvers<string>();

  const DeferredScreen = () => {
    React.use(deferred.promise);

    return 'Deferred';
  };

  const container = await createHydrationContainer(
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
  const recoverableErrors: unknown[] = [];

  const root = hydrateRoot(
    container,
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
    {
      onRecoverableError: (error) => recoverableErrors.push(error),
    }
  );

  await act(() => Promise.resolve());

  expect(navigation.isReady()).toBe(true);
  expect(onReady).toHaveBeenCalledTimes(1);
  expect(navigation.getCurrentRoute()?.name).toBe('Home');
  expect(window.location.pathname).toBe('/');
  expect(window.history.state).toEqual({ id: expect.any(String) });

  await act(async () => {
    deferred.resolve('Loaded');
    await deferred.promise;
  });

  expect(onReady).toHaveBeenCalledTimes(1);
  expect(recoverableErrors).toEqual([]);

  await act(() => root.unmount());
});

test('syncs navigation and browser history after hydration completes', async () => {
  window.history.replaceState(null, '', '/details/42');

  const { deferred, navigation, root } = await hydrateLinkedApp();

  await act(async () => {
    deferred.resolve('Loaded');
    await deferred.promise;
  });

  const initialHistoryState = window.history.state;

  await act(() => navigation.navigate('Home', { screen: 'Feed' }));
  await act(() => Promise.resolve());

  expect(navigation.getCurrentRoute()?.name).toBe('Feed');
  expect(window.location.pathname).toBe('/feed');
  expect(window.history.state).toEqual({ id: expect.any(String) });
  expect(window.history.state).not.toEqual(initialHistoryState);

  await traverseHistory(() => window.history.back());

  expect(navigation.getCurrentRoute()).toMatchObject({
    name: 'Details',
    params: { id: '42' },
  });
  expect(window.location.pathname).toBe('/details/42');
  expect(window.history.state).toEqual(initialHistoryState);

  await act(() => root.unmount());
});

test('cleans up pending linking listeners when hydration is unmounted', async () => {
  window.history.replaceState(null, '', '/details/42');

  const { deferred, navigation, onReady, root } = await hydrateLinkedApp();

  expect(navigation.isReady()).toBe(false);

  await act(() => root.unmount());

  await act(async () => {
    deferred.resolve('Loaded');
    await deferred.promise;
  });

  expect(onReady).not.toHaveBeenCalled();
  expect(window.location.pathname).toBe('/details/42');
  expect(window.history.state).toBeNull();
});

test('handles browser back and forward while hydration is pending', async () => {
  window.history.replaceState(null, '', '/feed');
  window.history.pushState(null, '', '/details/42');

  const { deferred, navigation, onReady, root } = await hydrateLinkedApp();

  expect(navigation.isReady()).toBe(false);

  await traverseHistory(() => window.history.back());

  expect(navigation.isReady()).toBe(false);
  expect(onReady).not.toHaveBeenCalled();
  expect(window.location.pathname).toBe('/feed');
  expect(window.history.state).toBeNull();

  await traverseHistory(() => window.history.forward());

  expect(navigation.isReady()).toBe(false);
  expect(onReady).not.toHaveBeenCalled();
  expect(window.location.pathname).toBe('/details/42');
  expect(window.history.state).toBeNull();

  await act(async () => {
    deferred.resolve('Loaded');
    await deferred.promise;
  });

  expect(navigation.isReady()).toBe(true);
  expect(onReady).toHaveBeenCalledTimes(1);
  expect(navigation.getCurrentRoute()).toMatchObject({
    name: 'Details',
    params: { id: '42' },
  });
  expect(window.location.pathname).toBe('/details/42');
  expect(window.history.state).toEqual({ id: expect.any(String) });

  await act(() => root.unmount());
});
