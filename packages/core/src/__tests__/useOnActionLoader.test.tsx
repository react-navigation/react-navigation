import { expect, jest, test } from '@jest/globals';
import type { ParamListBase } from '@react-navigation/routers';
import { CommonActions } from '@react-navigation/routers';
import { act, render, waitFor } from '@testing-library/react-native';
import type { ComponentType } from 'react';
import { Text } from 'react-native';

import { BaseNavigationContainer } from '../BaseNavigationContainer';
import { createNavigationContainerRef } from '../createNavigationContainerRef';
import { createNavigatorFactory } from '../createNavigatorFactory';
import { useIsFocused } from '../useIsFocused';
import { useNavigationBuilder } from '../useNavigationBuilder';
import { MockRouter } from './__fixtures__/MockRouter';

const TestNavigator = (props: any) => {
  const { state, descriptors, NavigationContent } = useNavigationBuilder(
    MockRouter,
    props
  );

  return (
    <NavigationContent>
      {(() => {
        const route = state.routes[state.index];
        const descriptor = route ? descriptors[route.key] : undefined;

        if (descriptor == null) {
          throw new Error('Missing descriptor for focused route.');
        }

        return descriptor.render();
      })()}
    </NavigationContent>
  );
};

const createTestNavigator = createNavigatorFactory(TestNavigator);

async function renderWithNavigation(
  Component: ComponentType,
  navigation: ReturnType<typeof createNavigationContainerRef<ParamListBase>>
) {
  await render(
    <BaseNavigationContainer ref={navigation}>
      <Component />
    </BaseNavigationContainer>
  );

  await waitFor(() => expect(navigation.isReady()).toBe(true));
}

const TestScreen = ({ route }: any) => {
  const isFocused = useIsFocused();

  return (
    <Text>
      Screen:{route.name}
      {isFocused ? '(focused)' : null}
    </Text>
  );
};

test('fires loader when an action navigates to a screen with UNSTABLE_loader', async () => {
  const fn = jest.fn(
    async (_options: {
      name: string;
      params: unknown;
      signal: AbortSignal;
    }) => {}
  );

  const Root = createTestNavigator({
    screens: {
      Home: TestScreen,
      Detail: {
        screen: TestScreen,
        UNSTABLE_loader: fn,
      },
    },
  });

  const Component = Root.getComponent();
  const navigation = createNavigationContainerRef<ParamListBase>();

  await renderWithNavigation(Component, navigation);

  expect(fn).toHaveBeenCalledTimes(0);

  await act(async () => {
    navigation.dispatch(CommonActions.navigate('Detail', { id: '42' }));
  });

  expect(fn).toHaveBeenCalledTimes(1);
  expect(fn).toHaveBeenCalledWith({
    name: 'Detail',
    params: { id: '42' },
    signal: expect.any(AbortSignal),
  });
});

test('does not fire any loader when navigating to a screen without UNSTABLE_loader', async () => {
  const fn = jest.fn(
    async (_options: {
      name: string;
      params: unknown;
      signal: AbortSignal;
    }) => {}
  );

  const Root = createTestNavigator({
    screens: {
      Home: {
        screen: TestScreen,
        UNSTABLE_loader: fn,
      },
      Detail: TestScreen,
    },
  });

  const Component = Root.getComponent();
  const navigation = createNavigationContainerRef<ParamListBase>();

  await renderWithNavigation(Component, navigation);

  await waitFor(() => expect(fn).toHaveBeenCalledTimes(1));

  await act(async () => {
    navigation.dispatch(CommonActions.navigate('Detail'));
  });

  expect(fn).toHaveBeenCalledTimes(1);
});

test('commits state immediately even when the loader is still pending', async () => {
  const loader = jest.fn(async () => {
    await new Promise<void>(() => {});
  });

  const Root = createTestNavigator({
    screens: {
      Home: TestScreen,
      Detail: {
        screen: TestScreen,
        UNSTABLE_loader: loader,
      },
    },
  });

  const Component = Root.getComponent();
  const navigation = createNavigationContainerRef<ParamListBase>();

  await renderWithNavigation(Component, navigation);

  await act(async () => {
    navigation.dispatch(CommonActions.navigate('Detail'));
  });

  expect(loader).toHaveBeenCalledTimes(1);
  expect(navigation.getCurrentRoute()?.name).toBe('Detail');
});

test('a second dispatch aborts the first loader signal', async () => {
  const signals: AbortSignal[] = [];
  const loader = jest.fn(async ({ signal }: { signal: AbortSignal }) => {
    signals.push(signal);
    return new Promise<void>(() => {});
  });

  const Root = createTestNavigator({
    screens: {
      Home: TestScreen,
      A: { screen: TestScreen, UNSTABLE_loader: loader },
      B: { screen: TestScreen, UNSTABLE_loader: loader },
    },
  });

  const Component = Root.getComponent();
  const navigation = createNavigationContainerRef<ParamListBase>();

  await renderWithNavigation(Component, navigation);

  await act(async () => {
    navigation.dispatch(CommonActions.navigate('A'));
  });
  expect(signals).toHaveLength(1);

  const firstSignal = signals[0];

  if (firstSignal == null) {
    throw new Error('Expected first loader signal.');
  }

  expect(firstSignal.aborted).toBe(false);

  await act(async () => {
    navigation.dispatch(CommonActions.navigate('B'));
  });
  expect(signals).toHaveLength(2);

  const secondSignal = signals[1];

  if (secondSignal == null) {
    throw new Error('Expected second loader signal.');
  }

  expect(firstSignal.aborted).toBe(true);
  expect(secondSignal.aborted).toBe(false);
});

test('fires the initial focused route loader on mount', async () => {
  const fn = jest.fn(
    async (_options: {
      name: string;
      params: unknown;
      signal: AbortSignal;
    }) => {}
  );

  const Root = createTestNavigator({
    screens: {
      Home: {
        screen: TestScreen,
        UNSTABLE_loader: fn,
      },
      Detail: TestScreen,
    },
  });

  const Component = Root.getComponent();

  await render(
    <BaseNavigationContainer>
      <Component />
    </BaseNavigationContainer>
  );

  await waitFor(() => expect(fn).toHaveBeenCalledTimes(1));
  expect(fn).toHaveBeenCalledWith({
    name: 'Home',
    params: undefined,
    signal: expect.any(AbortSignal),
  });
});

test('composes parent and nested loaders on dispatch', async () => {
  const parentFn = jest.fn(
    async (_options: {
      name: string;
      params: unknown;
      signal: AbortSignal;
    }) => {}
  );
  const childFn = jest.fn(
    async (_options: {
      name: string;
      params: unknown;
      signal: AbortSignal;
    }) => {}
  );

  const Child = createTestNavigator({
    screens: {
      Albums: {
        screen: TestScreen,
        UNSTABLE_loader: childFn,
      },
    },
  });

  const Root = createTestNavigator({
    screens: {
      Home: TestScreen,
      Nested: {
        screen: Child,
        UNSTABLE_loader: parentFn,
      },
    },
  });

  const Component = Root.getComponent();
  const navigation = createNavigationContainerRef<ParamListBase>();

  await renderWithNavigation(Component, navigation);

  await act(async () => {
    navigation.dispatch(CommonActions.navigate('Nested', { screen: 'Albums' }));
  });

  expect(parentFn).toHaveBeenCalledTimes(1);
  expect(childFn).toHaveBeenCalledTimes(1);
});
