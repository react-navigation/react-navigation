import { beforeEach, expect, jest, test } from '@jest/globals';
import type { NavigationState, ParamListBase } from '@react-navigation/routers';
import { act, render } from '@testing-library/react-native';
import { Text } from 'react-native';

import { BaseNavigationContainer } from '../BaseNavigationContainer';
import { createNavigationContainerRef } from '../createNavigationContainerRef';
import { Screen } from '../Screen';
import { useNavigationBuilder } from '../useNavigationBuilder';
import { MockRouter, MockRouterKey } from './__fixtures__/MockRouter';

beforeEach(() => {
  MockRouterKey.current = 0;
});

test('adds the listener even if container is mounted later', async () => {
  const ref = createNavigationContainerRef<ParamListBase>();
  const listener = jest.fn();

  ref.addListener('state', listener);

  const TestNavigator = (props: any) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder<
      NavigationState,
      any,
      {},
      { title?: string },
      any
    >(MockRouter, props);
    const route = state.routes[state.index];
    const descriptor = route == null ? undefined : descriptors[route.key];

    return (
      <NavigationContent>
        <main>
          <h1>
            <Text>{descriptor?.options.title}</Text>
          </h1>
          <div>{descriptor?.render()}</div>
        </main>
      </NavigationContent>
    );
  };

  const element = (
    <BaseNavigationContainer ref={ref}>
      <TestNavigator>
        <Screen name="foo">{() => null}</Screen>
        <Screen name="bar">{() => null}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await render(element);

  expect(listener).toHaveBeenCalledTimes(1);
});

test('removal of non-existing listener should not break updating ref', () => {
  const ref = createNavigationContainerRef<ParamListBase>();
  ref.removeListener('state', jest.fn());
  expect(() => {
    ref.current = createNavigationContainerRef<ParamListBase>();
  }).not.toThrow();
});

test("doesn't restore a removed pre-mount listener when re-attached", async () => {
  const ref = createNavigationContainerRef<ParamListBase>();
  const listener = jest.fn();

  ref.addListener('ready', listener);

  const TestNavigator = (props: any) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      MockRouter,
      props
    );

    const route = state.routes[state.index];

    if (route == null) {
      return null;
    }

    return (
      <NavigationContent>{descriptors[route.key]?.render()}</NavigationContent>
    );
  };

  const App = ({ id }: { id: string }) => (
    <BaseNavigationContainer key={id} ref={ref}>
      <TestNavigator>
        <Screen name="foo">{() => null}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  const root = await render(<App id="first" />);

  expect(listener).toHaveBeenCalledTimes(1);

  ref.removeListener('ready', listener);

  await root.rerender(<App id="second" />);

  expect(listener).toHaveBeenCalledTimes(1);
});

test('removes a pre-mount listener with its unsubscribe after the container is mounted', async () => {
  const ref = createNavigationContainerRef<ParamListBase>();
  const listener = jest.fn();

  const unsubscribe = ref.addListener('state', listener);

  const TestNavigator = (props: any) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      MockRouter,
      props
    );

    const route = state.routes[state.index];

    if (route == null) {
      return null;
    }

    return (
      <NavigationContent>{descriptors[route.key]?.render()}</NavigationContent>
    );
  };

  await render(
    <BaseNavigationContainer ref={ref}>
      <TestNavigator>
        <Screen name="foo">{() => null}</Screen>
        <Screen name="bar">{() => null}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  expect(listener).toHaveBeenCalledTimes(1);

  unsubscribe?.();

  await act(() => ref.navigate('bar'));

  expect(listener).toHaveBeenCalledTimes(1);
});
