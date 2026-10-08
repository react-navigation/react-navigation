import { beforeEach, expect, jest, test } from '@jest/globals';
import { type ParamListBase, StackRouter } from '@react-navigation/routers';
import { act, render } from '@testing-library/react-native';
import * as React from 'react';
import { Text } from 'react-native';

import { BaseNavigationContainer } from '../BaseNavigationContainer';
import { createNavigationContainerRef } from '../createNavigationContainerRef';
import { NavigationIndependentTree } from '../NavigationIndependentTree';
import { Screen } from '../Screen';
import { useFocusEffect } from '../useFocusEffect';
import { useIsFocused } from '../useIsFocused';
import { useNavigationBuilder } from '../useNavigationBuilder';
import { MockRouter, MockRouterKey } from './__fixtures__/MockRouter';

beforeEach(() => {
  jest.useFakeTimers();
  MockRouterKey.current = 0;
});

test('runs focus effect on focus change', async () => {
  const TestNavigator = (props: any): any => {
    const { state, descriptors, render } = useNavigationBuilder(
      MockRouter,
      props
    );

    return render(
      state.routes.map((route) => descriptors[route.key]?.render())
    );
  };

  const focusEffect = jest.fn();
  const focusEffectCleanup = jest.fn();

  const Test = () => {
    const onFocus = React.useCallback(() => {
      focusEffect();

      return focusEffectCleanup;
    }, []);

    useFocusEffect(onFocus);

    return null;
  };

  const navigation = React.createRef<any>();

  const element = (
    <BaseNavigationContainer ref={navigation}>
      <TestNavigator>
        <Screen name="first">{() => null}</Screen>
        <Screen name="second" component={Test} />
        <Screen name="third">{() => null}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await render(element);

  jest.runAllTimers();
  expect(focusEffect).not.toHaveBeenCalled();
  expect(focusEffectCleanup).not.toHaveBeenCalled();

  await act(() => navigation.current.navigate('second'));

  jest.runAllTimers();
  expect(focusEffect).toHaveBeenCalledTimes(1);
  expect(focusEffectCleanup).not.toHaveBeenCalled();

  await act(() => navigation.current.navigate('third'));

  jest.runAllTimers();
  expect(focusEffect).toHaveBeenCalledTimes(1);
  expect(focusEffectCleanup).toHaveBeenCalledTimes(1);

  await act(() => navigation.current.navigate('second'));

  jest.runAllTimers();
  expect(focusEffect).toHaveBeenCalledTimes(2);
  expect(focusEffectCleanup).toHaveBeenCalledTimes(1);
});

test('runs focus effect on deps change', async () => {
  const TestNavigator = (props: any): any => {
    const { state, descriptors, render } = useNavigationBuilder(
      MockRouter,
      props
    );

    const route = state.routes[state.index];

    if (route == null) {
      return null;
    }

    return render(descriptors[route.key]?.render());
  };

  const focusEffect = jest.fn();
  const focusEffectCleanup = jest.fn();

  const Test = ({ count }: { count: number }) => {
    const onFocus = React.useCallback(() => {
      focusEffect(count);

      return focusEffectCleanup;
    }, [count]);

    useFocusEffect(onFocus);

    return null;
  };

  const App = ({ count }: { count: number }) => (
    <BaseNavigationContainer>
      <TestNavigator>
        <Screen name="first">{() => <Test count={count} />}</Screen>
        <Screen name="second">{() => null}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  const root = await render(<App count={1} />);

  expect(focusEffect).toHaveBeenCalledTimes(1);
  expect(focusEffectCleanup).not.toHaveBeenCalled();

  await root.rerender(<App count={2} />);

  expect(focusEffectCleanup).toHaveBeenCalledTimes(1);
  expect(focusEffect).toHaveBeenCalledTimes(2);
});

test('runs focus effect when initial state is given', async () => {
  const TestNavigator = (props: any): any => {
    const { state, descriptors, render } = useNavigationBuilder(
      MockRouter,
      props
    );

    return render(
      state.routes.map((route) => descriptors[route.key]?.render())
    );
  };

  const focusEffect = jest.fn();
  const focusEffectCleanup = jest.fn();

  const Test = () => {
    useFocusEffect(() => {
      focusEffect();

      return focusEffectCleanup;
    });

    return null;
  };

  const initialState = {
    index: 2,
    routes: [
      { key: 'first', name: 'first' },
      { key: 'second', name: 'second' },
      { key: 'third', name: 'third' },
    ],
  };

  const navigation = React.createRef<any>();

  const element = (
    <BaseNavigationContainer ref={navigation} initialState={initialState}>
      <TestNavigator>
        <Screen name="first">{() => null}</Screen>
        <Screen name="second">{() => null}</Screen>
        <Screen name="third" component={Test} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await render(element);

  expect(focusEffect).toHaveBeenCalledTimes(1);
  expect(focusEffectCleanup).not.toHaveBeenCalled();

  await act(() => navigation.current.navigate('first'));

  jest.runAllTimers();
  expect(focusEffect).toHaveBeenCalledTimes(1);
  expect(focusEffectCleanup).toHaveBeenCalledTimes(1);
});

test('runs focus effect when only focused route is rendered', async () => {
  const TestNavigator = (props: any): any => {
    const { state, descriptors, render } = useNavigationBuilder(
      MockRouter,
      props
    );

    const route = state.routes[state.index];

    if (route == null) {
      return null;
    }

    return render(descriptors[route.key]?.render());
  };

  const focusEffect = jest.fn();
  const focusEffectCleanup = jest.fn();

  const Test = () => {
    useFocusEffect(() => {
      focusEffect();

      return focusEffectCleanup;
    });

    return null;
  };

  const navigation = React.createRef<any>();

  const element = (
    <BaseNavigationContainer ref={navigation}>
      <TestNavigator>
        <Screen name="first" component={Test} />
        <Screen name="second">{() => null}</Screen>
        <Screen name="third">{() => null}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await render(element);

  expect(focusEffect).toHaveBeenCalledTimes(1);
  expect(focusEffectCleanup).not.toHaveBeenCalled();

  await act(() => navigation.current.navigate('second'));

  jest.runAllTimers();
  expect(focusEffect).toHaveBeenCalledTimes(1);
  expect(focusEffectCleanup).toHaveBeenCalledTimes(1);
});

test('runs cleanup when component is unmounted', async () => {
  const TestNavigator = (props: any): any => {
    const { state, descriptors, render } = useNavigationBuilder(
      MockRouter,
      props
    );

    const route = state.routes[state.index];

    if (route == null) {
      return null;
    }

    return render(descriptors[route.key]?.render());
  };

  const focusEffect = jest.fn();
  const focusEffectCleanup = jest.fn();

  const TestA = () => {
    useFocusEffect(() => {
      focusEffect();

      return focusEffectCleanup;
    });

    return null;
  };

  const TestB = () => null;

  const App = ({ mounted }: { mounted: boolean }) => (
    <BaseNavigationContainer>
      <TestNavigator>
        <Screen name="first" component={mounted ? TestA : TestB} />
        <Screen name="second">{() => null}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  const root = await render(<App mounted />);

  expect(focusEffect).toHaveBeenCalledTimes(1);
  expect(focusEffectCleanup).not.toHaveBeenCalled();

  await root.rerender(<App mounted={false} />);

  jest.runAllTimers();
  expect(focusEffect).toHaveBeenCalledTimes(1);
  expect(focusEffectCleanup).toHaveBeenCalledTimes(1);
});

test('prints error when a dependency array is passed', async () => {
  const TestNavigator = (props: any): any => {
    const { state, descriptors, render } = useNavigationBuilder(
      MockRouter,
      props
    );

    const route = state.routes[state.index];

    if (route == null) {
      return null;
    }

    return render(descriptors[route.key]?.render());
  };

  const Test = () => {
    // @ts-expect-error testing incorrect usage
    useFocusEffect(() => {}, []);

    return null;
  };

  const App = () => (
    <BaseNavigationContainer>
      <TestNavigator>
        <Screen name="test" component={Test} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

  await render(<App />);

  expect(spy.mock.calls[0]?.[0]).toMatch(
    "You passed a second argument to 'useFocusEffect', but it only accepts one argument."
  );

  spy.mockRestore();
});

test('prints error when the effect returns a value', async () => {
  const TestNavigator = (props: any): any => {
    const { state, descriptors, render } = useNavigationBuilder(
      MockRouter,
      props
    );

    const route = state.routes[state.index];

    if (route == null) {
      return null;
    }

    return render(descriptors[route.key]?.render());
  };

  const Test = () => {
    // @ts-expect-error testing incorrect usage
    useFocusEffect(() => 42);

    return null;
  };

  const App = () => (
    <BaseNavigationContainer>
      <TestNavigator>
        <Screen name="test" component={Test} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

  await render(<App />);

  expect(spy.mock.calls[0]?.[0]).toMatch(
    "An effect function must not return anything besides a function, which is used for clean-up. You returned '42'."
  );

  spy.mockRestore();
});

test('prints error when the effect returns null', async () => {
  const TestNavigator = (props: any): any => {
    const { state, descriptors, render } = useNavigationBuilder(
      MockRouter,
      props
    );

    const route = state.routes[state.index];

    if (route == null) {
      return null;
    }

    return render(descriptors[route.key]?.render());
  };

  const Test = () => {
    // @ts-expect-error testing incorrect usage
    useFocusEffect(() => null);

    return null;
  };

  const App = () => (
    <BaseNavigationContainer>
      <TestNavigator>
        <Screen name="test" component={Test} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

  await render(<App />);

  expect(spy.mock.calls[0]?.[0]).toMatch(
    "An effect function must not return anything besides a function, which is used for clean-up. You returned 'null'. If your effect does not require clean-up, return 'undefined' (or nothing)."
  );

  spy.mockRestore();
});

test('prints error when the effect is an async function', async () => {
  const TestNavigator = (props: any): any => {
    const { state, descriptors, render } = useNavigationBuilder(
      MockRouter,
      props
    );

    const route = state.routes[state.index];

    if (route == null) {
      return null;
    }

    return render(descriptors[route.key]?.render());
  };

  const Test = () => {
    // @ts-expect-error testing incorrect usage
    useFocusEffect(async () => {});

    return null;
  };

  const App = () => (
    <BaseNavigationContainer>
      <TestNavigator>
        <Screen name="test" component={Test} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

  await render(<App />);

  expect(spy.mock.calls[0]?.[0]).toMatch(
    "An effect function must not return anything besides a function, which is used for clean-up.\n\nIt looks like you wrote 'useFocusEffect(async () => ...)' or returned a Promise."
  );

  spy.mockRestore();
});

test('restarts the focused effect when dependencies change during cancelled navigation', async () => {
  const { promise, resolve } = Promise.withResolvers<void>();

  const navigation = createNavigationContainerRef<ParamListBase>();

  const events: string[] = [];

  let update: () => void;

  const TestNavigator = (props: Parameters<typeof useNavigationBuilder>[1]) => {
    const { state, descriptors, render } = useNavigationBuilder(
      StackRouter,
      props
    );

    return render(
      state.routes.map((route) => descriptors[route.key]?.render())
    );
  };

  const First = () => {
    const [count, setCount] = React.useState(0);

    update = () => setCount((value) => value + 1);

    useFocusEffect(
      React.useCallback(() => {
        events.push(`start ${count}`);

        return () => {
          events.push(`stop ${count}`);
        };
      }, [count])
    );

    return <Text>First: {count}</Text>;
  };

  const Second = () => {
    React.use(promise);

    return <Text>Second</Text>;
  };

  const root = await render(
    <BaseNavigationContainer ref={navigation}>
      <React.Suspense fallback={null}>
        <TestNavigator>
          <Screen name="First" component={First} />
          <Screen name="Second" component={Second} />
        </TestNavigator>
      </React.Suspense>
    </BaseNavigationContainer>
  );

  await act(() => navigation.navigate('Second'));

  expect(navigation.getCurrentRoute()?.name).toBe('Second');

  expect(root.getByText('First: 0')).toBeVisible();
  expect(root.queryByText('Second')).toBeNull();

  await act(() => update());

  expect(events).toEqual(['start 0', 'stop 0', 'start 1']);

  expect(root.getByText('First: 1')).toBeVisible();

  await act(() => navigation.goBack());
  await act(() => resolve());

  expect(events).toEqual(['start 0', 'stop 0', 'start 1']);
});

test('starts the pending screen effect only after suspended navigation commits', async () => {
  const { promise, resolve } = Promise.withResolvers<void>();

  const navigation = createNavigationContainerRef<ParamListBase>();

  const events: string[] = [];

  let update: () => void;

  const TestNavigator = (props: Parameters<typeof useNavigationBuilder>[1]) => {
    const { state, descriptors, render } = useNavigationBuilder(
      MockRouter,
      props
    );

    return render(
      state.routes.map((route) => descriptors[route.key]?.render())
    );
  };

  const First = () => {
    useFocusEffect(
      React.useCallback(() => {
        events.push('start First');

        return () => {
          events.push('stop First');
        };
      }, [])
    );

    return <Text>First</Text>;
  };

  const Second = () => {
    const isFocused = useIsFocused();
    const [count, setCount] = React.useState(0);

    update = () => setCount((value) => value + 1);

    useFocusEffect(
      React.useCallback(() => {
        events.push(`start Second ${count}`);

        return () => {
          events.push(`stop Second ${count}`);
        };
      }, [count])
    );

    if (isFocused) {
      React.use(promise);
    }

    return (
      <Text>
        Second: {count}, {isFocused ? 'focused' : 'unfocused'}
      </Text>
    );
  };

  const root = await render(
    <BaseNavigationContainer ref={navigation}>
      <React.Suspense fallback={null}>
        <TestNavigator>
          <Screen name="First" component={First} />
          <Screen name="Second" component={Second} />
        </TestNavigator>
      </React.Suspense>
    </BaseNavigationContainer>
  );

  expect(events).toEqual(['start First']);

  await act(() => navigation.navigate('Second'));

  expect(navigation.getCurrentRoute()?.name).toBe('Second');

  expect(root.getByText('First')).toBeVisible();
  expect(root.getByText('Second: 0, unfocused')).toBeVisible();
  expect(root.queryByText('Second: 0, focused')).toBeNull();

  expect(events).toEqual(['start First']);

  await act(() => update());

  expect(events).toEqual(['start First']);

  expect(root.getByText('Second: 1, unfocused')).toBeVisible();

  await act(() => resolve());

  expect(events).toEqual(['start First', 'stop First', 'start Second 1']);

  expect(root.getByText('Second: 1, focused')).toBeVisible();

  await act(() => navigation.navigate('First'));

  expect(events).toEqual([
    'start First',
    'stop First',
    'start Second 1',
    'stop Second 1',
    'start First',
  ]);
});

test('runs focus effects without re-rendering the screen on focus changes', async () => {
  const navigation = createNavigationContainerRef<ParamListBase>();

  const events: string[] = [];

  let renders = 0;

  const TestNavigator = (props: Parameters<typeof useNavigationBuilder>[1]) => {
    const { state, descriptors, render } = useNavigationBuilder(
      MockRouter,
      props
    );

    return render(
      state.routes.map((route) => descriptors[route.key]?.render())
    );
  };

  const First = () => {
    renders++;

    useFocusEffect(
      React.useCallback(() => {
        events.push('focus');

        return () => {
          events.push('blur');
        };
      }, [])
    );

    return null;
  };

  await render(
    <BaseNavigationContainer ref={navigation}>
      <TestNavigator>
        <Screen name="First" component={First} />
        <Screen name="Second">{() => null}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  const initialRenders = renders;

  await act(() => navigation.navigate('Second'));

  expect(renders).toBe(initialRenders);

  expect(events).toEqual(['focus', 'blur']);

  await act(() => navigation.navigate('First'));

  expect(renders).toBe(initialRenders);

  expect(events).toEqual(['focus', 'blur', 'focus']);
});

test('runs focus effects in an independent container inside an unfocused screen', async () => {
  const effect = jest.fn<() => void>();

  const TestNavigator = (props: Parameters<typeof useNavigationBuilder>[1]) => {
    const { state, descriptors, render } = useNavigationBuilder(
      MockRouter,
      props
    );

    return render(
      state.routes.map((route) => descriptors[route.key]?.render())
    );
  };

  const Observer = () => {
    useFocusEffect(effect);

    return null;
  };

  const Independent = () => (
    <NavigationIndependentTree>
      <BaseNavigationContainer>
        <Observer />
        <TestNavigator>
          <Screen name="Inner">{() => null}</Screen>
        </TestNavigator>
      </BaseNavigationContainer>
    </NavigationIndependentTree>
  );

  await render(
    <BaseNavigationContainer>
      <TestNavigator>
        <Screen name="First">{() => null}</Screen>
        <Screen name="Second" component={Independent} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  expect(effect).toHaveBeenCalledTimes(1);
});

test('updates nested focus effects while parent navigation is suspended', async () => {
  const { promise, resolve } = Promise.withResolvers<void>();

  const navigation = createNavigationContainerRef<ParamListBase>();

  const events: string[] = [];

  let update: () => void;

  let renders = 0;

  const RootNavigator = (props: Parameters<typeof useNavigationBuilder>[1]) => {
    const { state, descriptors, render } = useNavigationBuilder(
      StackRouter,
      props
    );

    return render(
      state.routes.map((route) => descriptors[route.key]?.render())
    );
  };

  const NestedNavigator = (
    props: Parameters<typeof useNavigationBuilder>[1]
  ) => {
    const { state, descriptors, render } = useNavigationBuilder(MockRouter, {
      ...props,
      router: () => ({
        getStateForRouteNamesChange(state, { routeNames }) {
          return { ...state, routeNames, index: 1 };
        },
      }),
    });

    return render(
      state.routes.map((route) => descriptors[route.key]?.render())
    );
  };

  const Child = ({ route }: { route: { name: string } }) => {
    renders++;

    useFocusEffect(
      React.useCallback(() => {
        events.push(`start ${route.name}`);

        return () => {
          events.push(`stop ${route.name}`);
        };
      }, [route.name])
    );

    return <Text>{route.name}</Text>;
  };

  const Parent = () => {
    const [swap, setSwap] = React.useState(false);

    update = () => setSwap(true);

    return (
      <NestedNavigator>
        {(swap ? ['B', 'A'] : ['A', 'B']).map((name) => (
          <Screen key={name} name={name} component={Child} />
        ))}
      </NestedNavigator>
    );
  };

  const Pending = () => {
    React.use(promise);

    return <Text>Pending</Text>;
  };

  const root = await render(
    <BaseNavigationContainer ref={navigation}>
      <React.Suspense fallback={null}>
        <RootNavigator>
          <Screen name="Parent" component={Parent} />
          <Screen name="Pending" component={Pending} />
        </RootNavigator>
      </React.Suspense>
    </BaseNavigationContainer>
  );

  await act(() => navigation.navigate('Pending'));

  expect(navigation.getCurrentRoute()?.name).toBe('Pending');

  expect(root.getByText('A')).toBeVisible();
  expect(root.getByText('B')).toBeVisible();
  expect(root.queryByText('Pending')).toBeNull();

  renders = 0;

  await act(() => update());

  expect(events).toEqual(['start A', 'stop A', 'start B']);

  expect(renders).toBe(0);

  await act(() => navigation.goBack());
  await act(() => resolve());

  expect(events).toEqual(['start A', 'stop A', 'start B']);
});
