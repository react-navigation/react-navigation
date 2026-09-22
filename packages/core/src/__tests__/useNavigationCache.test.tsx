import { beforeEach, expect, test } from '@jest/globals';
import { CommonActions, type ParamListBase } from '@react-navigation/routers';
import { act, render } from '@testing-library/react-native';
import * as React from 'react';

import { BaseNavigationContainer } from '../BaseNavigationContainer';
import { createNavigationContainerRef } from '../createNavigationContainerRef';
import { Screen } from '../Screen';
import type { NavigationProp, RouteProp } from '../types';
import { useNavigationBuilder } from '../useNavigationBuilder';
import { MockRouter, MockRouterKey } from './__fixtures__/MockRouter';

type ScreenProps = {
  navigation: NavigationProp<ParamListBase>;
  route: RouteProp<ParamListBase>;
};

const TestNavigator = (props: Parameters<typeof useNavigationBuilder>[1]) => {
  const { state, descriptors, render } = useNavigationBuilder(
    MockRouter,
    props
  );

  return render(state.routes.map((route) => descriptors[route.key]?.render()));
};

beforeEach(() => {
  MockRouterKey.current = 0;
});

test('returns correct value for isFocused', async () => {
  let navigation: any;

  const Test = (props: any) => {
    navigation = props.navigation;

    return null;
  };

  await render(
    <BaseNavigationContainer>
      <TestNavigator>
        <Screen name="first">{() => null}</Screen>
        <Screen name="second" component={Test} />
        <Screen name="third">{() => null}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  expect(navigation.isFocused()).toBe(false);

  await act(() => navigation.navigate('second'));

  expect(navigation.isFocused()).toBe(true);

  await act(() => navigation.navigate('third'));

  expect(navigation.isFocused()).toBe(false);

  await act(() => navigation.navigate('second'));

  expect(navigation.isFocused()).toBe(true);
});

test('returns correct value for isFocused after changing screens', async () => {
  const router: NonNullable<
    Parameters<typeof useNavigationBuilder>[1]['router']
  > = () => {
    return {
      getStateForRouteNamesChange(state, { routeNames }) {
        const routes = routeNames.map(
          (name) =>
            state.routes.find((r) => r.name === name) || {
              name,
              key: name,
            }
        );

        return {
          ...state,
          routeNames,
          routes,
          index: routes.length - 1,
        };
      },
    };
  };

  let navigation: any;

  const Test = (props: any) => {
    navigation = props.navigation;

    return null;
  };

  const root = await render(
    <BaseNavigationContainer>
      <TestNavigator router={router}>
        <Screen name="first">{() => null}</Screen>
        <Screen name="second" component={Test} />
        <Screen name="third">{() => null}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  expect(navigation.isFocused()).toBe(false);

  await root.rerender(
    <BaseNavigationContainer>
      <TestNavigator router={router}>
        <Screen name="first">{() => null}</Screen>
        <Screen name="third">{() => null}</Screen>
        <Screen name="second" component={Test} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  expect(navigation.isFocused()).toBe(true);

  await root.rerender(
    <BaseNavigationContainer>
      <TestNavigator router={router}>
        <Screen name="first">{() => null}</Screen>
        <Screen name="third">{() => null}</Screen>
        <Screen name="fourth">{() => null}</Screen>
        <Screen name="second" component={Test} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  expect(navigation.isFocused()).toBe(true);

  await root.rerender(
    <BaseNavigationContainer>
      <TestNavigator router={router}>
        <Screen name="first">{() => null}</Screen>
        <Screen name="third">{() => null}</Screen>
        <Screen name="second" component={Test} />
        <Screen name="fourth">{() => null}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  expect(navigation.isFocused()).toBe(false);
});

test('keeps navigation objects stable across re-renders', async () => {
  const screens: Record<string, ScreenProps> = {};

  const Test = (props: ScreenProps & { label: string }) => {
    screens[props.route.name] = props;

    return null;
  };

  const App = ({ label }: { label: string }) => (
    <BaseNavigationContainer
      initialState={{
        index: 1,
        routes: [{ name: 'First' }, { name: 'Second' }],
      }}
    >
      <TestNavigator>
        <Screen name="First">
          {(props) => <Test {...props} label={label} />}
        </Screen>
        <Screen name="Second">
          {(props) => <Test {...props} label={label} />}
        </Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  const root = await render(<App label="one" />);

  const first = screens.First;
  const second = screens.Second;

  await root.rerender(<App label="two" />);

  expect(screens.First?.navigation).toBe(first?.navigation);
  expect(screens.Second?.navigation).toBe(second?.navigation);
});

test('preserves existing navigation objects when adding and removing routes', async () => {
  const screens: Record<string, ScreenProps> = {};

  const Test = (props: ScreenProps) => {
    screens[props.route.name] = props;

    return null;
  };

  await render(
    <BaseNavigationContainer initialState={{ routes: [{ name: 'First' }] }}>
      <TestNavigator>
        <Screen name="First" component={Test} />
        <Screen name="Second" component={Test} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  const first = screens.First;

  await act(() => first?.navigation.navigate('Second'));

  expect(screens.First?.navigation).toBe(first?.navigation);

  await act(() =>
    first?.navigation.dispatch((state) =>
      CommonActions.reset({
        ...state,
        index: 0,
        routes: state.routes.filter((route) => route.name === 'First'),
      })
    )
  );

  expect(screens.First?.navigation).toBe(first?.navigation);
});

test('preserves navigation objects when route params change', async () => {
  const screens: Record<string, ScreenProps> = {};

  const Test = (props: ScreenProps) => {
    screens[props.route.name] = props;

    return null;
  };

  await render(
    <BaseNavigationContainer
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

  const first = screens.First;
  const second = screens.Second;

  await act(() => first?.navigation.setParams({ count: 1 }));

  expect(screens.First?.navigation).toBe(first?.navigation);
  expect(screens.Second?.navigation).toBe(second?.navigation);
});

test('preserves screen navigation objects while navigation is suspended', async () => {
  const { promise, resolve } = Promise.withResolvers<void>();

  const screens: Record<'First' | 'Second', ScreenProps[]> = {
    First: [],
    Second: [],
  };

  const Test = (props: ScreenProps) => {
    if (props.route.name === 'First') {
      screens.First.push(props);
    } else {
      screens.Second.push(props);
    }

    if (props.route.name === 'Second') {
      React.use(promise);
    }

    return null;
  };

  await render(
    <BaseNavigationContainer initialState={{ routes: [{ name: 'First' }] }}>
      <React.Suspense fallback={null}>
        <TestNavigator>
          <Screen name="First" component={Test} />
          <Screen name="Second" component={Test} />
        </TestNavigator>
      </React.Suspense>
    </BaseNavigationContainer>
  );

  const first = screens.First.at(-1);

  await act(() => first?.navigation.navigate('Second'));

  expect(screens.Second.length).toBeGreaterThan(0);

  await act(() => first?.navigation.setParams({ count: 1 }));

  expect(screens.First.length).toBeGreaterThan(1);

  await act(() => resolve());

  for (const props of screens.First) {
    expect(props.navigation).toBe(first?.navigation);
  }
});

test('preserves the second screen navigation prop when a suspended reset is cancelled', async () => {
  const { promise, resolve } = Promise.withResolvers<void>();

  const screens: Record<string, ScreenProps> = {};

  const navigation = createNavigationContainerRef<ParamListBase>();

  const Test = (props: ScreenProps) => {
    screens[props.route.name] = props;

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

  const initial = screens.Second?.navigation;

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

  expect(screens.First?.route.params).toEqual({ pending: true });

  await act(() => navigation.dispatch(CommonActions.reset(initialState)));

  await root.rerender(<App />);

  expect(screens.Second?.navigation).toBe(initial);

  await act(() => resolve());

  expect(screens.Second?.navigation).toBe(initial);
});
