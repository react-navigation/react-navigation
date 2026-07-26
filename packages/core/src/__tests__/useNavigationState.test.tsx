import { afterEach, beforeEach, expect, jest, test } from '@jest/globals';
import type { NavigationState, ParamListBase } from '@react-navigation/routers';
import { CommonActions } from '@react-navigation/routers';
import { act, render, screen } from '@testing-library/react-native';
import * as React from 'react';
import { Text } from 'react-native';

import { BaseNavigationContainer } from '../BaseNavigationContainer';
import { createNavigationContainerRef } from '../createNavigationContainerRef';
import { Screen } from '../Screen';
import { useNavigation } from '../useNavigation';
import { useNavigationBuilder } from '../useNavigationBuilder';
import { useNavigationState } from '../useNavigationState';
import { MockRouter, MockRouterKey } from './__fixtures__/MockRouter';

type TestNavigatorProps = Parameters<typeof useNavigationBuilder>[1] & {
  mode?: 'all' | 'focused' | 'none';
};

const TestNavigator = ({ mode = 'all', ...props }: TestNavigatorProps) => {
  const { state, descriptors, NavigationContent } = useNavigationBuilder(
    MockRouter,
    props
  );

  const routes =
    mode === 'all'
      ? state.routes
      : mode === 'focused'
        ? state.routes.slice(state.index, state.index + 1)
        : [];

  return (
    <NavigationContent>
      {routes.map((route) => descriptors[route.key]?.render())}
    </NavigationContent>
  );
};

beforeEach(() => {
  MockRouterKey.current = 0;
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('gets the current navigation state', async () => {
  const Test = () => {
    const index = useNavigationState((state) => state.index);
    const params = useNavigationState(
      (state) => state.routes[state.index]?.params
    );

    return (
      <>
        <Text>index-{index}</Text>
        <Text>params-{JSON.stringify(params)}</Text>
      </>
    );
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  await render(
    <BaseNavigationContainer ref={navigation}>
      <TestNavigator>
        <Screen name="first" component={Test} />
        <Screen name="second">{() => null}</Screen>
        <Screen name="third">{() => null}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  expect(screen.getByText('index-0')).toBeOnTheScreen();
  expect(screen.getByText('params-')).toBeOnTheScreen();

  await act(() => navigation.navigate('third'));

  expect(screen.getByText('index-2')).toBeOnTheScreen();
  expect(screen.getByText('params-')).toBeOnTheScreen();

  await act(() => navigation.navigate('second', { answer: 42 }));

  expect(screen.getByText('index-1')).toBeOnTheScreen();
  expect(screen.getByText('params-{"answer":42}')).toBeOnTheScreen();
});

test('gets the current navigation state at navigator level', async () => {
  const Test = () => {
    const index = useNavigationState((state) => state.index);
    const routes = useNavigationState((state) => state.routes);

    const names = routes.map((route) => route.name).join(',');

    return (
      <Text>
        {index}-{names}
      </Text>
    );
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  await render(
    <BaseNavigationContainer ref={navigation}>
      <TestNavigator mode="none" layout={() => <Test />}>
        <Screen name="first">{() => null}</Screen>
        <Screen name="second">{() => null}</Screen>
        <Screen name="third">{() => null}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  expect(screen.getByText('0-first,second,third')).toBeOnTheScreen();

  await act(() => navigation.navigate('second'));

  expect(screen.getByText('1-first,second,third')).toBeOnTheScreen();

  await act(() => navigation.navigate('third'));

  expect(screen.getByText('2-first,second,third')).toBeOnTheScreen();
});

test('returns the value selected by the new selector', async () => {
  const Test = ({
    selector,
  }: {
    selector: (state: NavigationState) => any;
  }) => {
    const result = useNavigationState(selector);

    return <Text>{JSON.stringify(result)}</Text>;
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  const App = ({ selector }: { selector: (state: NavigationState) => any }) => {
    return (
      <BaseNavigationContainer ref={navigation}>
        <TestNavigator>
          <Screen name="first">{() => <Test selector={selector} />}</Screen>
          <Screen name="second">{() => null}</Screen>
        </TestNavigator>
      </BaseNavigationContainer>
    );
  };

  const root = await render(<App selector={(state) => state.routes.length} />);

  expect(screen.getByText('2')).toBeOnTheScreen();

  await root.rerender(<App selector={(state) => state.index} />);

  expect(screen.getByText('0')).toBeOnTheScreen();

  await act(() => navigation.navigate('second'));

  expect(screen.getByText('1')).toBeOnTheScreen();

  await act(() => navigation.navigate('second', { answer: 42 }));

  await root.rerender(
    <App selector={(state) => state.routes[state.index]?.params} />
  );

  expect(screen.getByText('{"answer":42}')).toBeOnTheScreen();
});

test('uses the latest selector for subsequent state updates', async () => {
  const mismatches: string[] = [];

  const Test = ({
    state,
    selector,
  }: {
    state: NavigationState;
    selector: (state: NavigationState) => unknown;
  }) => {
    const selected = useNavigationState(selector);

    if (!Object.is(selected, selector(state))) {
      mismatches.push(
        `rendered ${String(selected)} for ${String(selector(state))}`
      );
    }

    return <Text>[selected-{String(selected)}]</Text>;
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  const App = ({
    selector,
  }: {
    selector: (state: NavigationState) => unknown;
  }) => (
    <BaseNavigationContainer ref={navigation}>
      <TestNavigator
        mode="none"
        layout={({ state }) => <Test state={state} selector={selector} />}
      >
        <Screen name="first">{() => null}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  const root = await render(<App selector={(state) => state.index} />);

  await root.rerender(
    <App
      selector={(state) =>
        state.routes[state.index]?.params == null ? undefined : state.index
      }
    />
  );

  expect(screen.getByText('[selected-undefined]')).toBeOnTheScreen();

  await act(() => navigation.navigate('first', { answer: 42 }));

  expect(mismatches).toEqual([]);

  expect(screen.getByText('[selected-0]')).toBeOnTheScreen();
});

test('gets navigation state for the given route name', async () => {
  const Test = () => {
    const child = useNavigationState(
      // @ts-expect-error for test purposes
      'child',
      (state: any) => state.routes[state.index]?.name
    );

    const parent = useNavigationState(
      // @ts-expect-error for test purposes
      'parent',
      (state: any) => state.routes[state.index]?.name
    );

    const grandparent = useNavigationState(
      // @ts-expect-error for test purposes
      'grandparent',
      (state: any) => state.routes[state.index]?.name
    );

    const params = useNavigationState(
      // @ts-expect-error for test purposes
      'child',
      (state: any) => state.routes[state.index]?.params
    );

    return (
      <>
        <Text>
          child-{String(child)}-{JSON.stringify(params)}
        </Text>
        <Text>parent-{String(parent)}</Text>
        <Text>grandparent-{String(grandparent)}</Text>
      </>
    );
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  await render(
    <BaseNavigationContainer ref={navigation}>
      <TestNavigator>
        <Screen name="grandparent">
          {() => (
            <TestNavigator>
              <Screen name="parent">
                {() => (
                  <TestNavigator>
                    <Screen name="child" component={Test} />
                    <Screen name="second">{() => null}</Screen>
                  </TestNavigator>
                )}
              </Screen>
              <Screen name="third">{() => null}</Screen>
            </TestNavigator>
          )}
        </Screen>
        <Screen name="fourth">{() => null}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  expect(screen.getByText('child-child-')).toBeOnTheScreen();
  expect(screen.getByText('parent-parent')).toBeOnTheScreen();
  expect(screen.getByText('grandparent-grandparent')).toBeOnTheScreen();

  await act(() => navigation.navigate('child', { answer: 42 }));

  expect(screen.getByText('child-child-{"answer":42}')).toBeOnTheScreen();

  await act(() => navigation.navigate('second'));

  expect(screen.getByText('child-second-')).toBeOnTheScreen();
  expect(screen.getByText('parent-parent')).toBeOnTheScreen();

  await act(() => navigation.navigate('third'));

  expect(screen.getByText('parent-third')).toBeOnTheScreen();

  await act(() => navigation.navigate('fourth'));

  expect(screen.getByText('grandparent-fourth')).toBeOnTheScreen();
});

test('uses the state of the new navigator when the route name changes', async () => {
  const Test = ({ target }: { target: 'parent' | 'child' }) => {
    const name = useNavigationState(
      // @ts-expect-error for test purposes
      target,
      target === 'child'
        ? (state: any) =>
            `${state.routes[2].name}-${state.routes[state.index].name}`
        : (state: any) => state.routes[0].name
    );

    return <Text>[name-{name}]</Text>;
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  const App = ({ target }: { target: 'parent' | 'child' }) => (
    <BaseNavigationContainer ref={navigation}>
      <TestNavigator>
        <Screen name="parent">
          {() => (
            <TestNavigator>
              <Screen name="child">{() => <Test target={target} />}</Screen>
              <Screen name="second">{() => null}</Screen>
              <Screen name="third">{() => null}</Screen>
            </TestNavigator>
          )}
        </Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  const root = await render(<App target="parent" />);

  expect(screen.getByText('[name-parent]')).toBeOnTheScreen();

  await root.rerender(<App target="child" />);

  expect(screen.queryByText('[name-parent]')).not.toBeOnTheScreen();
  expect(screen.getByText('[name-third-child]')).toBeOnTheScreen();

  await act(() => navigation.navigate('second'));

  expect(screen.getByText('[name-third-second]')).toBeOnTheScreen();
});

test('switches between the current and named navigation state', async () => {
  const Test = ({ target }: { target: 'current' | 'parent' }) => {
    const selector = (state: NavigationState) =>
      state.routes[state.index]?.name;

    /* eslint-disable react-hooks/rules-of-hooks -- the same hook is called once in both branches */
    const name =
      target === 'current'
        ? useNavigationState(selector)
        : useNavigationState(
            // @ts-expect-error for test purposes
            'parent',
            selector
          );
    /* eslint-enable react-hooks/rules-of-hooks */

    return <Text>[name-{name}]</Text>;
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  const App = ({ target }: { target: 'current' | 'parent' }) => (
    <BaseNavigationContainer ref={navigation}>
      <TestNavigator>
        <Screen name="parent">
          {() => (
            <TestNavigator>
              <Screen name="child">{() => <Test target={target} />}</Screen>
              <Screen name="second">{() => null}</Screen>
            </TestNavigator>
          )}
        </Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  const root = await render(<App target="current" />);

  expect(screen.getByText('[name-child]')).toBeOnTheScreen();

  await root.rerender(<App target="parent" />);

  expect(screen.getByText('[name-parent]')).toBeOnTheScreen();

  await act(() => navigation.navigate('second'));

  await root.rerender(<App target="current" />);

  expect(screen.getByText('[name-second]')).toBeOnTheScreen();
});

test('uses the closest navigator when route names are duplicated', async () => {
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});

  const Test = () => {
    const value = useNavigationState(
      // @ts-expect-error for test purposes
      'shared',
      (state: NavigationState) =>
        `${state.index}-${state.routes.map((route) => route.name).join(',')}`
    );

    return <Text>[state-{value}]</Text>;
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  await render(
    <BaseNavigationContainer ref={navigation}>
      <TestNavigator>
        <Screen name="shared">
          {() => (
            <TestNavigator>
              <Screen name="shared" component={Test} />
              <Screen name="inner-second">{() => null}</Screen>
            </TestNavigator>
          )}
        </Screen>
        <Screen name="outer-second">{() => null}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  expect(warn).toHaveBeenCalledWith(
    expect.stringContaining('Found screens with the same name nested')
  );

  warn.mockRestore();

  expect(screen.getByText('[state-0-shared,inner-second]')).toBeOnTheScreen();

  await act(() => navigation.navigate('inner-second'));

  expect(screen.getByText('[state-1-shared,inner-second]')).toBeOnTheScreen();
});

test('keeps the parent state consistent while child navigation is pending', async () => {
  const { promise, resolve } = Promise.withResolvers<void>();

  const StateContext = React.createContext<NavigationState | null>(null);

  const mismatches: string[] = [];

  const ParentIndex = () => {
    const state = React.use(StateContext);
    // @ts-expect-error for test purposes
    const index = useNavigationState('parent', (state: any) => state.index);

    if (state != null && state.index !== index) {
      mismatches.push(`rendered ${index} for state ${state.index}`);
    }

    return <Text>[parent-{index}]</Text>;
  };

  const Suspends = () => {
    React.use(promise);

    return <Text>[inner-b]</Text>;
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  await render(
    <BaseNavigationContainer ref={navigation}>
      <TestNavigator
        mode="focused"
        layout={({ state, children }) => (
          <StateContext.Provider value={state}>
            {children}
          </StateContext.Provider>
        )}
      >
        <Screen name="parent">
          {() => (
            <TestNavigator
              mode="focused"
              layout={({ children }) => (
                <React.Suspense fallback={<Text>[fallback]</Text>}>
                  {children}
                </React.Suspense>
              )}
            >
              <Screen name="inner-a">
                {() => (
                  <>
                    <ParentIndex />
                    <Text>[inner-a]</Text>
                  </>
                )}
              </Screen>
              <Screen name="inner-b" component={Suspends} />
            </TestNavigator>
          )}
        </Screen>
        <Screen name="other">{() => <Text>[other]</Text>}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await act(() => navigation.navigate('inner-b'));

  expect(screen.getByText('[parent-0]')).toBeOnTheScreen();
  expect(screen.getByText('[inner-a]')).toBeOnTheScreen();
  expect(screen.queryByText('[inner-b]')).not.toBeOnTheScreen();
  expect(screen.queryByText('[fallback]')).not.toBeOnTheScreen();

  await act(() => resolve());

  expect(mismatches).toEqual([]);

  expect(screen.queryByText('[inner-a]')).not.toBeOnTheScreen();
  expect(screen.getByText('[inner-b]')).toBeOnTheScreen();
});

test('throws when used outside a navigator', async () => {
  expect.assertions(1);

  const Test = () => {
    expect(() =>
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useNavigationState((state) => state.index)
    ).toThrow(
      "Couldn't get the navigation state. Is your component inside a navigator?"
    );

    return null;
  };

  await render(<Test />);
});

test('throws when a selector is not provided', async () => {
  expect.assertions(1);

  const Test = () => {
    expect(() =>
      // @ts-expect-error a selector is required, testing the runtime guard
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useNavigationState()
    ).toThrow('A selector function must be provided (got undefined).');

    return null;
  };

  await render(
    <BaseNavigationContainer>
      <TestNavigator>
        <Screen name="first" component={Test} />
      </TestNavigator>
    </BaseNavigationContainer>
  );
});

test('surfaces an error thrown by a selector', async () => {
  const Test = () => {
    const index = useNavigationState((state: NavigationState) => {
      if (state.index === 1) {
        throw new Error('Selector failed');
      }

      return state.index;
    });

    return <Text>[index-{index}]</Text>;
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  await render(
    <BaseNavigationContainer ref={navigation}>
      <TestNavigator mode="none" layout={() => <Test />}>
        <Screen name="first">{() => null}</Screen>
        <Screen name="second">{() => null}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await expect(async () => {
    await act(() => navigation.navigate('second'));
  }).rejects.toThrow(/^Selector failed$/);
});

test('does not re-render when the selected value is unchanged', async () => {
  const onRender = jest.fn();

  const Index = React.memo(function Index() {
    const index = useNavigationState((state: NavigationState) => state.index);

    onRender();

    return <Text>[index-{index}]</Text>;
  });

  const navigation = createNavigationContainerRef<ParamListBase>();

  await render(
    <BaseNavigationContainer ref={navigation}>
      <TestNavigator mode="none" layout={() => <Index />}>
        <Screen name="first">{() => null}</Screen>
        <Screen name="second">{() => null}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  expect(onRender).toHaveBeenCalledTimes(1);

  await act(() => navigation.navigate('first', { answer: 42 }));

  expect(onRender).toHaveBeenCalledTimes(1);

  await act(() => navigation.navigate('second'));

  expect(onRender).toHaveBeenCalledTimes(2);

  expect(screen.getByText('[index-1]')).toBeOnTheScreen();
});

test('keeps the latest state when a pending navigation is superseded', async () => {
  const { promise, resolve } = Promise.withResolvers<void>();

  const mismatches: string[] = [];
  const committed: number[] = [];

  const Details = ({ state }: { state: NavigationState }) => {
    const index = useNavigationState((state: NavigationState) => state.index);

    if (state.index !== index) {
      mismatches.push(`rendered ${index} for state ${state.index}`);
    }

    return <Text>[details-{index}]</Text>;
  };

  // Memoized so it only re-renders from its own state updates
  const Index = React.memo(function Index() {
    const index = useNavigationState((state: NavigationState) => state.index);

    React.useEffect(() => {
      committed.push(index);
    });

    return <Text>[index-{index}]</Text>;
  });

  const ScreenB = () => {
    React.use(promise);

    return <Text>[screen-b]</Text>;
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  await render(
    <BaseNavigationContainer ref={navigation}>
      <TestNavigator
        mode="focused"
        layout={({ state, children }) => (
          <>
            <Details state={state} />
            <Index />
            <React.Suspense fallback={<Text>[fallback]</Text>}>
              {children}
            </React.Suspense>
          </>
        )}
      >
        <Screen name="first">{() => <Text>[screen-a]</Text>}</Screen>
        <Screen name="second" component={ScreenB} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await act(() => navigation.navigate('second'));

  await act(() => navigation.navigate('first'));

  await act(() => resolve());

  expect(mismatches).toEqual([]);
  expect(committed).toEqual([0]);

  expect(screen.getByText('[details-0]')).toBeOnTheScreen();
  expect(screen.getByText('[index-0]')).toBeOnTheScreen();
  expect(screen.getByText('[screen-a]')).toBeOnTheScreen();
  expect(screen.queryByText('[screen-b]')).not.toBeOnTheScreen();
  expect(screen.queryByText('[fallback]')).not.toBeOnTheScreen();
});

test('returns the latest state on the initial render of a screen', async () => {
  const SecondScreen = () => {
    const [index] = React.useState(
      useNavigationState((state: NavigationState) => state.index)
    );

    return <Text>{index}</Text>;
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  await render(
    <BaseNavigationContainer ref={navigation}>
      <TestNavigator mode="focused">
        <Screen name="first">{() => null}</Screen>
        <Screen name="second" component={SecondScreen} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await act(() => navigation.navigate('second'));

  expect(screen.getByText('1')).toBeOnTheScreen();
});

test('returns the latest state when navigation changes during mount', async () => {
  const Navigate = () => {
    const navigation: any = useNavigation();

    React.useLayoutEffect(() => {
      navigation.navigate('second');
    }, [navigation]);

    return null;
  };

  // Memoized so it doesn't re-render with the navigator and catch up that way
  const Index = React.memo(function Index() {
    const index = useNavigationState((state: NavigationState) => state.index);

    return <Text>[index-{index}]</Text>;
  });

  await render(
    <BaseNavigationContainer>
      <TestNavigator
        mode="none"
        layout={() => (
          <>
            <Navigate />
            <Index />
          </>
        )}
      >
        <Screen name="first">{() => null}</Screen>
        <Screen name="second">{() => null}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  expect(screen.getByText('[index-1]')).toBeOnTheScreen();
});

test('matches the visible screen when mounting during a pending navigation', async () => {
  const { promise, resolve } = Promise.withResolvers<void>();

  // Memoized so it only converges through the commit notification
  const Index = React.memo(function Index() {
    const index = useNavigationState((state: NavigationState) => state.index);

    return <Text>[index-{index}]</Text>;
  });

  const ScreenB = () => {
    React.use(promise);

    return <Text>[screen-b]</Text>;
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  const App = ({ mounted }: { mounted: boolean }) => (
    <BaseNavigationContainer ref={navigation}>
      <TestNavigator
        mode="focused"
        layout={({ children }) => (
          <>
            {mounted ? <Index /> : null}
            {children}
          </>
        )}
      >
        <Screen name="first">{() => <Text>[screen-a]</Text>}</Screen>
        <Screen name="second" component={ScreenB} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  const root = await render(<App mounted={false} />);

  await act(() => navigation.navigate('second'));

  await root.rerender(<App mounted={true} />);

  expect(screen.getByText('[index-0]')).toBeOnTheScreen();
  expect(screen.getByText('[screen-a]')).toBeOnTheScreen();
  expect(screen.queryByText('[screen-b]')).not.toBeOnTheScreen();

  await act(() => resolve());

  expect(screen.getByText('[index-1]')).toBeOnTheScreen();
  expect(screen.queryByText('[screen-a]')).not.toBeOnTheScreen();
  expect(screen.getByText('[screen-b]')).toBeOnTheScreen();
});

test('matches the visible screen when re-rendering during a pending navigation', async () => {
  const { promise, resolve } = Promise.withResolvers<void>();

  let refresh: (() => void) | undefined;

  const RouteName = () => {
    const [count, setCount] = React.useState(0);

    const name = useNavigationState(
      (state: NavigationState) => state.routes[state.index]?.name
    );

    refresh = () => setCount((count) => count + 1);

    return (
      <Text>
        [name-{name}-{count}]
      </Text>
    );
  };

  const ScreenB = () => {
    React.use(promise);

    return <Text>[screen-b]</Text>;
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  await render(
    <BaseNavigationContainer ref={navigation}>
      <TestNavigator
        mode="focused"
        layout={({ children }) => (
          <>
            <RouteName />
            {children}
          </>
        )}
      >
        <Screen name="first">{() => <Text>[screen-a]</Text>}</Screen>
        <Screen name="second" component={ScreenB} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await act(() => navigation.navigate('second'));

  expect(screen.getByText('[name-first-0]')).toBeOnTheScreen();
  expect(screen.getByText('[screen-a]')).toBeOnTheScreen();

  await act(() => refresh?.());

  expect(screen.getByText('[name-first-1]')).toBeOnTheScreen();
  expect(screen.getByText('[screen-a]')).toBeOnTheScreen();

  await act(() => resolve());

  expect(screen.getByText('[name-second-1]')).toBeOnTheScreen();
  expect(screen.getByText('[screen-b]')).toBeOnTheScreen();
  expect(screen.queryByText('[screen-a]')).not.toBeOnTheScreen();
});

test('keeps the previous content visible when a component using the selected value suspends', async () => {
  const { promise, resolve } = Promise.withResolvers<void>();

  const Details = () => {
    const index = useNavigationState((state: NavigationState) => state.index);

    if (index === 1) {
      React.use(promise);
    }

    return <Text>[details-{index}]</Text>;
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  await render(
    <BaseNavigationContainer ref={navigation}>
      <TestNavigator
        mode="focused"
        layout={({ children }) => (
          <>
            <React.Suspense fallback={<Text>[fallback]</Text>}>
              <Details />
            </React.Suspense>
            {children}
          </>
        )}
      >
        <Screen name="first">{() => <Text>[screen-a]</Text>}</Screen>
        <Screen name="second">{() => <Text>[screen-b]</Text>}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  expect(screen.getByText('[details-0]')).toBeOnTheScreen();
  expect(screen.getByText('[screen-a]')).toBeOnTheScreen();
  expect(screen.queryByText('[screen-b]')).not.toBeOnTheScreen();

  await act(() => navigation.navigate('second'));

  expect(screen.getByText('[details-0]')).toBeOnTheScreen();
  expect(screen.getByText('[screen-a]')).toBeOnTheScreen();
  expect(screen.queryByText('[screen-b]')).not.toBeOnTheScreen();
  expect(screen.queryByText('[fallback]')).not.toBeOnTheScreen();

  await act(() => resolve());

  expect(screen.getByText('[details-1]')).toBeOnTheScreen();
  expect(screen.queryByText('[screen-a]')).not.toBeOnTheScreen();
  expect(screen.getByText('[screen-b]')).toBeOnTheScreen();
});

test('keeps the selected value consistent when the selector changes during a pending navigation', async () => {
  const { promise, resolve } = Promise.withResolvers<void>();

  const Params = ({
    selector,
  }: {
    selector: (state: NavigationState) => any;
  }) => {
    const result = useNavigationState(selector);

    return <Text>[selected-{JSON.stringify(result)}]</Text>;
  };

  const Content = ({ contentId }: { contentId: number }) => {
    if (contentId !== 0) {
      React.use(promise);
    }

    return <Text>[content-{contentId}]</Text>;
  };

  const TestScreen = (props: any) => (
    <Content contentId={props.route.params?.contentId ?? 0} />
  );

  const navigation = createNavigationContainerRef<ParamListBase>();

  const App = ({ selector }: { selector: (state: NavigationState) => any }) => (
    <BaseNavigationContainer ref={navigation}>
      <TestNavigator
        layout={({ children }) => (
          <>
            <Params selector={selector} />
            {children}
          </>
        )}
      >
        <Screen name="first" component={TestScreen} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  const root = await render(<App selector={(state) => state.index} />);

  expect(screen.getByText('[selected-0]')).toBeOnTheScreen();
  expect(screen.getByText('[content-0]')).toBeOnTheScreen();

  await act(() =>
    navigation.dispatch(CommonActions.setParams({ contentId: 42 }))
  );

  expect(screen.getByText('[selected-0]')).toBeOnTheScreen();
  expect(screen.getByText('[content-0]')).toBeOnTheScreen();

  await root.rerender(
    <App selector={(state) => state.routes[state.index]?.params} />
  );

  expect(screen.getByText('[selected-]')).toBeOnTheScreen();
  expect(screen.getByText('[content-0]')).toBeOnTheScreen();

  await act(() => resolve());

  expect(screen.getByText('[selected-{"contentId":42}]')).toBeOnTheScreen();
  expect(screen.getByText('[content-42]')).toBeOnTheScreen();
  expect(screen.queryByText('[content-0]')).not.toBeOnTheScreen();
});

test('reads the latest state when the selector changes after an update with an unchanged selection', async () => {
  const Test = ({
    selector,
  }: {
    selector: (state: NavigationState) => any;
  }) => {
    const result = useNavigationState(selector);

    return <Text>{JSON.stringify(result)}</Text>;
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  const App = ({ selector }: { selector: (state: NavigationState) => any }) => (
    <BaseNavigationContainer ref={navigation}>
      <TestNavigator mode="none" layout={() => <Test selector={selector} />}>
        <Screen name="first">{() => null}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  const root = await render(<App selector={(state) => state.index} />);

  expect(screen.getByText('0')).toBeOnTheScreen();

  await act(() => navigation.navigate('first', { answer: 42 }));

  expect(screen.getByText('0')).toBeOnTheScreen();

  await root.rerender(
    <App selector={(state) => state.routes[state.index]!.params} />
  );

  expect(screen.getByText('{"answer":42}')).toBeOnTheScreen();
});

test('keeps the selected value consistent when an urgent update supersedes a transition', async () => {
  const { promise, resolve } = Promise.withResolvers<void>();

  const mismatches: string[] = [];

  const Details = ({ state }: { state: NavigationState }) => {
    const index = useNavigationState((state: NavigationState) => state.index);

    if (state.index !== index) {
      mismatches.push(`rendered ${index} for state ${state.index}`);
    }

    return <Text>[details-{index}]</Text>;
  };

  const ScreenB = () => {
    React.use(promise);

    return <Text>[screen-b]</Text>;
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  await render(
    <BaseNavigationContainer ref={navigation}>
      <TestNavigator
        mode="focused"
        layout={({ state, children }) => (
          <>
            <Details state={state} />
            <React.Suspense fallback={<Text>[fallback]</Text>}>
              {children}
            </React.Suspense>
          </>
        )}
      >
        <Screen name="first">{() => <Text>[screen-a]</Text>}</Screen>
        <Screen name="second" component={ScreenB} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await act(() => navigation.navigate('second'));

  // Use `resetRoot` to perform a navigation without a transition
  await act(() =>
    navigation.resetRoot({ index: 0, routes: [{ name: 'first' }] })
  );

  expect(screen.getByText('[details-0]')).toBeOnTheScreen();
  expect(screen.getByText('[screen-a]')).toBeOnTheScreen();
  expect(screen.queryByText('[screen-b]')).not.toBeOnTheScreen();
  expect(screen.queryByText('[fallback]')).not.toBeOnTheScreen();

  await act(() => resolve());

  expect(mismatches).toEqual([]);

  expect(screen.getByText('[details-0]')).toBeOnTheScreen();
  expect(screen.getByText('[screen-a]')).toBeOnTheScreen();
  expect(screen.queryByText('[screen-b]')).not.toBeOnTheScreen();
  expect(screen.queryByText('[fallback]')).not.toBeOnTheScreen();
});

test('returns the latest state after becoming visible in an Activity', async () => {
  const mismatches: string[] = [];

  const Index = ({ state }: { state: NavigationState }) => {
    const index = useNavigationState((state: NavigationState) => state.index);

    if (state.index !== index) {
      mismatches.push(`rendered ${index} for state ${state.index}`);
    }

    return <Text>[index-{index}]</Text>;
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  const App = ({ mode }: { mode: 'visible' | 'hidden' }) => (
    <BaseNavigationContainer ref={navigation}>
      <TestNavigator
        mode="focused"
        layout={({ state, children }) => (
          <>
            <React.Activity mode={mode}>
              <Index state={state} />
            </React.Activity>
            {children}
          </>
        )}
      >
        <Screen name="first">{() => <Text>[screen-a]</Text>}</Screen>
        <Screen name="second">{() => <Text>[screen-b]</Text>}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  const root = await render(<App mode="visible" />);

  await root.rerender(<App mode="hidden" />);

  await act(() => navigation.navigate('second'));

  await root.rerender(<App mode="visible" />);

  expect(mismatches).toEqual([]);

  expect(screen.getByText('[index-1]')).toBeOnTheScreen();
  expect(screen.getByText('[screen-b]')).toBeOnTheScreen();
});

test('continues updating mounted consumers after another consumer unmounts', async () => {
  const firstSelect = jest.fn((state: NavigationState) => state.index);
  const secondSelect = jest.fn((state: NavigationState) => state.index);

  const First = React.memo(function First() {
    const index = useNavigationState(firstSelect);

    return <Text>[first-{index}]</Text>;
  });

  const Second = React.memo(function Second() {
    const index = useNavigationState(secondSelect);

    return <Text>[second-{index}]</Text>;
  });

  const navigation = createNavigationContainerRef<ParamListBase>();

  const App = ({ mounted }: { mounted: boolean }) => (
    <BaseNavigationContainer ref={navigation}>
      <TestNavigator
        mode="none"
        layout={() => (
          <>
            {mounted ? <First /> : null}
            <Second />
          </>
        )}
      >
        <Screen name="first">{() => null}</Screen>
        <Screen name="second">{() => null}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  const root = await render(<App mounted />);

  await root.rerender(<App mounted={false} />);

  firstSelect.mockClear();
  secondSelect.mockClear();

  await act(() => navigation.navigate('second'));

  expect(firstSelect).not.toHaveBeenCalled();
  expect(secondSelect).toHaveBeenCalled();
  expect(screen.queryByText(/first-/)).not.toBeOnTheScreen();
  expect(screen.getByText('[second-1]')).toBeOnTheScreen();
});

test('stops calling the selector after its consumer unmounts in Strict Mode', async () => {
  const onSelect = jest.fn();

  const Index = () => {
    const index = useNavigationState((state: NavigationState) => {
      onSelect();

      return state.index;
    });

    return <Text>[index-{index}]</Text>;
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  const App = ({ mounted }: { mounted: boolean }) => (
    <React.StrictMode>
      <BaseNavigationContainer ref={navigation}>
        <TestNavigator
          mode="focused"
          layout={({ children }) => (
            <>
              {mounted ? <Index /> : null}
              {children}
            </>
          )}
        >
          <Screen name="first">{() => <Text>[screen-a]</Text>}</Screen>
          <Screen name="second">{() => <Text>[screen-b]</Text>}</Screen>
        </TestNavigator>
      </BaseNavigationContainer>
    </React.StrictMode>
  );

  const root = await render(<App mounted />);

  await act(() => navigation.navigate('second'));

  expect(screen.getByText('[index-1]')).toBeOnTheScreen();
  expect(screen.getByText('[screen-b]')).toBeOnTheScreen();

  await root.rerender(<App mounted={false} />);

  onSelect.mockClear();

  await act(() => navigation.navigate('first'));

  expect(onSelect).not.toHaveBeenCalled();

  expect(screen.queryByText(/index/)).not.toBeOnTheScreen();
  expect(screen.getByText('[screen-a]')).toBeOnTheScreen();
});
