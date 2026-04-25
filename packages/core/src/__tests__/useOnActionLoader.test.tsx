import { expect, jest, test } from '@jest/globals';
import type { ParamListBase } from '@react-navigation/routers';
import { CommonActions } from '@react-navigation/routers';
import { act, render } from '@testing-library/react-native';

import { BaseNavigationContainer } from '../BaseNavigationContainer';
import { createNavigationContainerRef } from '../createNavigationContainerRef';
import { createNavigatorFactory } from '../createNavigatorFactory';
import { createComponentForStaticNavigation } from '../StaticNavigation';
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
      {descriptors[state.routes[state.index].key].render()}
    </NavigationContent>
  );
};

const createTestNavigator = createNavigatorFactory(TestNavigator);

const TestScreen = ({ route }: any) => {
  const isFocused = useIsFocused();

  return (
    <>
      Screen:{route.name}
      {isFocused ? '(focused)' : null}
    </>
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

  const Component = createComponentForStaticNavigation(Root, 'RootNavigator');
  const navigation = createNavigationContainerRef<ParamListBase>();

  render(
    <BaseNavigationContainer ref={navigation}>
      <Component />
    </BaseNavigationContainer>
  );

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

  const Component = createComponentForStaticNavigation(Root, 'RootNavigator');
  const navigation = createNavigationContainerRef<ParamListBase>();

  render(
    <BaseNavigationContainer ref={navigation}>
      <Component />
    </BaseNavigationContainer>
  );

  expect(fn).toHaveBeenCalledTimes(1);

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

  const Component = createComponentForStaticNavigation(Root, 'RootNavigator');
  const navigation = createNavigationContainerRef<ParamListBase>();

  render(
    <BaseNavigationContainer ref={navigation}>
      <Component />
    </BaseNavigationContainer>
  );

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

  const Component = createComponentForStaticNavigation(Root, 'RootNavigator');
  const navigation = createNavigationContainerRef<ParamListBase>();

  render(
    <BaseNavigationContainer ref={navigation}>
      <Component />
    </BaseNavigationContainer>
  );

  await act(async () => {
    navigation.dispatch(CommonActions.navigate('A'));
  });
  expect(signals).toHaveLength(1);
  expect(signals[0].aborted).toBe(false);

  await act(async () => {
    navigation.dispatch(CommonActions.navigate('B'));
  });
  expect(signals).toHaveLength(2);
  expect(signals[0].aborted).toBe(true);
  expect(signals[1].aborted).toBe(false);
});

test('fires the initial focused route loader on mount', () => {
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

  const Component = createComponentForStaticNavigation(Root, 'RootNavigator');

  render(
    <BaseNavigationContainer>
      <Component />
    </BaseNavigationContainer>
  );

  expect(fn).toHaveBeenCalledTimes(1);
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

  const Component = createComponentForStaticNavigation(Root, 'RootNavigator');
  const navigation = createNavigationContainerRef<ParamListBase>();

  render(
    <BaseNavigationContainer ref={navigation}>
      <Component />
    </BaseNavigationContainer>
  );

  await act(async () => {
    navigation.dispatch(CommonActions.navigate('Nested', { screen: 'Albums' }));
  });

  expect(parentFn).toHaveBeenCalledTimes(1);
  expect(childFn).toHaveBeenCalledTimes(1);
});
