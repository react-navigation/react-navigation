import { expect, test } from '@jest/globals';
import {
  CommonActions,
  type ParamListBase,
  StackRouter,
} from '@react-navigation/routers';
import { act, render } from '@testing-library/react-native';
import * as React from 'react';

import { BaseNavigationContainer } from '../BaseNavigationContainer';
import { createNavigationContainerRef } from '../createNavigationContainerRef';
import { getFocusedRouteNameFromRoute } from '../getFocusedRouteNameFromRoute';
import { Screen } from '../Screen';
import type { RouteProp } from '../types';
import { useNavigationBuilder } from '../useNavigationBuilder';

const TestNavigator = (props: Parameters<typeof useNavigationBuilder>[1]) => {
  const { state, descriptors, render } = useNavigationBuilder(
    StackRouter,
    props
  );

  return render(state.routes.map((route) => descriptors[route.key]?.render()));
};

test('keeps route objects stable across re-renders', async () => {
  const routes: RouteProp<ParamListBase>[] = [];

  const Test = ({
    route,
  }: {
    route: RouteProp<ParamListBase>;
    label: string;
  }) => {
    routes.push(route);

    return null;
  };

  const App = ({ label }: { label: string }) => (
    <BaseNavigationContainer>
      <TestNavigator>
        <Screen name="First">
          {(props) => <Test {...props} label={label} />}
        </Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  const root = await render(<App label="one" />);

  const initial = routes.at(-1);

  await root.rerender(<App label="two" />);

  expect(routes.at(-1)).toBe(initial);
});

test('preserves route objects when their order changes', async () => {
  const routes: Record<string, RouteProp<ParamListBase>> = {};

  const navigation = createNavigationContainerRef<ParamListBase>();

  const Test = ({ route }: { route: RouteProp<ParamListBase> }) => {
    routes[route.name] = route;

    return null;
  };

  await render(
    <BaseNavigationContainer
      ref={navigation}
      initialState={{
        index: 1,
        routes: [{ name: 'First' }, { name: 'Second' }],
      }}
    >
      <TestNavigator>
        <Screen name="First" component={Test} />
        <Screen name="Second" component={Test} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  const first = routes.First;
  const second = routes.Second;

  await act(() =>
    navigation.dispatch((state) =>
      CommonActions.reset({ ...state, routes: [...state.routes].reverse() })
    )
  );

  expect(routes.First).toBe(first);
  expect(routes.Second).toBe(second);
});

test('replaces the changed route object and preserves unaffected routes', async () => {
  const routes: Record<string, RouteProp<ParamListBase>> = {};

  const navigation = createNavigationContainerRef<ParamListBase>();

  const Test = ({ route }: { route: RouteProp<ParamListBase> }) => {
    routes[route.name] = route;

    return null;
  };

  await render(
    <BaseNavigationContainer
      ref={navigation}
      initialState={{
        index: 1,
        routes: [{ name: 'First', params: { count: 0 } }, { name: 'Second' }],
      }}
    >
      <TestNavigator>
        <Screen name="First" component={Test} />
        <Screen name="Second" component={Test} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  const first = routes.First;
  const second = routes.Second;

  await act(() =>
    navigation.dispatch({
      ...CommonActions.setParams({ count: 1 }),
      source: first?.key,
    })
  );

  expect(routes.First).not.toBe(first);
  expect(routes.Second).toBe(second);
});

test('preserves existing route objects when adding or removing routes', async () => {
  const routes: Record<string, RouteProp<ParamListBase>> = {};

  const navigation = createNavigationContainerRef<ParamListBase>();

  const Test = ({ route }: { route: RouteProp<ParamListBase> }) => {
    routes[route.name] = route;

    return null;
  };

  await render(
    <BaseNavigationContainer
      ref={navigation}
      initialState={{
        index: 1,
        routes: [{ name: 'First' }, { name: 'Second' }],
      }}
    >
      <TestNavigator>
        <Screen name="First" component={Test} />
        <Screen name="Second" component={Test} />
        <Screen name="Third" component={Test} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  const first = routes.First;
  const second = routes.Second;

  await act(() => navigation.navigate('Third'));

  expect(routes.First).toBe(first);
  expect(routes.Second).toBe(second);

  await act(() =>
    navigation.dispatch((state) =>
      CommonActions.reset({
        ...state,
        index: 0,
        routes: state.routes.filter((route) => route.name === 'Second'),
      })
    )
  );

  expect(routes.Second).toBe(second);
});

test('updates nested route information without replacing the route object', async () => {
  const routes: RouteProp<ParamListBase>[] = [];
  const navigation = createNavigationContainerRef<ParamListBase>();

  const Parent = ({
    route,
    nested,
  }: {
    route: RouteProp<ParamListBase>;
    nested: boolean;
  }) => {
    routes.push(route);

    return nested ? (
      <TestNavigator>
        <Screen name="First">{() => null}</Screen>
        <Screen name="Second">{() => null}</Screen>
      </TestNavigator>
    ) : null;
  };

  const App = ({ nested }: { nested: boolean }) => (
    <BaseNavigationContainer ref={navigation}>
      <TestNavigator>
        <Screen name="Parent">
          {(props) => <Parent {...props} nested={nested} />}
        </Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  const root = await render(<App nested={false} />);

  const initial = routes.at(-1);

  await root.rerender(<App nested />);

  expect(routes.at(-1)).toBe(initial);

  expect(getFocusedRouteNameFromRoute(initial ?? {})).toBe('First');

  await act(() => navigation.navigate('Second'));

  expect(routes.at(-1)).toBe(initial);

  expect(getFocusedRouteNameFromRoute(initial ?? {})).toBe('Second');

  await root.rerender(<App nested={false} />);

  expect(routes.at(-1)).toBe(initial);

  expect(getFocusedRouteNameFromRoute(initial ?? {})).toBeUndefined();
});

test('does not re-render the parent screen when navigating between nested screens', async () => {
  let renders = 0;

  const navigation = createNavigationContainerRef<ParamListBase>();

  const Parent = () => {
    renders++;

    return (
      <TestNavigator>
        <Screen name="First">{() => null}</Screen>
        <Screen name="Second">{() => null}</Screen>
      </TestNavigator>
    );
  };

  await render(
    <BaseNavigationContainer ref={navigation}>
      <TestNavigator>
        <Screen name="Parent" component={Parent} />
      </TestNavigator>
    </BaseNavigationContainer>
  );
  const initialRenders = renders;

  await act(() => navigation.navigate('Second'));

  expect(renders).toBe(initialRenders);

  await act(() => navigation.goBack());

  expect(renders).toBe(initialRenders);
});

test('does not re-render the parent screen while nested navigation suspends', async () => {
  const { promise, resolve } = Promise.withResolvers<void>();

  let renders = 0;
  let renderedSecond = false;

  const navigation = createNavigationContainerRef<ParamListBase>();

  const Second = () => {
    renderedSecond = true;

    React.use(promise);

    return null;
  };

  const Parent = () => {
    renders++;

    return (
      <TestNavigator>
        <Screen name="First">{() => null}</Screen>
        <Screen name="Second" component={Second} />
      </TestNavigator>
    );
  };

  await render(
    <BaseNavigationContainer
      ref={navigation}
      initialState={{
        routes: [{ name: 'Parent', state: { routes: [{ name: 'First' }] } }],
      }}
    >
      <React.Suspense fallback={null}>
        <TestNavigator>
          <Screen name="Parent" component={Parent} />
        </TestNavigator>
      </React.Suspense>
    </BaseNavigationContainer>
  );

  const initialRenders = renders;

  await act(() => navigation.navigate('Second'));

  expect(renderedSecond).toBe(true);

  expect(renders).toBe(initialRenders);

  await act(() => resolve());

  expect(renders).toBe(initialRenders);
});

test('preserves the first screen route prop when a suspended reset is cancelled', async () => {
  const { promise, resolve } = Promise.withResolvers<void>();

  const routes: Record<string, RouteProp<ParamListBase>> = {};
  const navigation = createNavigationContainerRef<ParamListBase>();

  const Test = (props: { route: RouteProp<ParamListBase> }) => {
    routes[props.route.name] = props.route;

    if (props.route.params && 'pending' in props.route.params) {
      React.use(promise);
    }

    return null;
  };

  const App = () => (
    <BaseNavigationContainer
      ref={navigation}
      initialState={{
        index: 1,
        routes: [{ name: 'First' }, { name: 'Second' }],
      }}
    >
      <React.Suspense fallback={null}>
        <TestNavigator>
          <Screen name="First">{(props) => <Test {...props} />}</Screen>
          <Screen name="Second">{(props) => <Test {...props} />}</Screen>
        </TestNavigator>
      </React.Suspense>
    </BaseNavigationContainer>
  );

  const root = await render(<App />);

  const initialState = navigation.getRootState();

  if (initialState === undefined) {
    throw new Error('Expected initialized navigation state');
  }

  const initial = routes.First;

  await act(() =>
    navigation.dispatch(
      CommonActions.reset({
        ...initialState,
        index: 0,
        routes: initialState.routes
          .filter((route) => route.name === 'First')
          .map((route) => ({ ...route, params: { pending: true } })),
      })
    )
  );

  expect(routes.First?.params).toEqual({ pending: true });

  await act(() => navigation.dispatch(CommonActions.reset(initialState)));

  await root.rerender(<App />);

  expect(routes.First).toBe(initial);

  await act(() => resolve());

  expect(routes.First).toBe(initial);
});
