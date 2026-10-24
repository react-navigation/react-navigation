import { expect, jest, test } from '@jest/globals';
import {
  CommonActions,
  DrawerActions,
  DrawerRouter,
  type ParamListBase,
  StackRouter,
  TabRouter,
} from '@react-navigation/routers';
import { act, render, screen } from '@testing-library/react-native';
import * as React from 'react';
import { Text } from 'react-native';

import { BaseNavigationContainer } from '../BaseNavigationContainer';
import { createNavigationContainerRef } from '../createNavigationContainerRef';
import { NavigationIndependentTree } from '../NavigationIndependentTree';
import { NavigationProvider } from '../NavigationProvider';
import { Screen } from '../Screen';
import { useCanGoBack } from '../useCanGoBack';
import { useNavigationBuilder } from '../useNavigationBuilder';
import { useNavigationState } from '../useNavigationState';
import { useRoute } from '../useRoute';

const TestNavigator = (props: Parameters<typeof useNavigationBuilder>[1]) => {
  const { state, descriptors, render } = useNavigationBuilder(
    StackRouter,
    props
  );

  return render(state.routes.map((route) => descriptors[route.key]?.render()));
};

const TestScreen = () => {
  const route = useRoute();
  const canGoBack = useCanGoBack();

  return <Text>{`${route.name}: ${canGoBack}`}</Text>;
};

test("throws if navigation state isn't available", async () => {
  expect.assertions(1);

  const Test = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    expect(() => useCanGoBack()).toThrow(
      "Couldn't determine whether the screen can go back. Is your component inside a screen in a navigator?"
    );

    return null;
  };

  await render(<Test />);
});

test('returns whether each screen can go back', async () => {
  const navigation = createNavigationContainerRef<ParamListBase>();

  await render(
    <BaseNavigationContainer ref={navigation}>
      <TestNavigator>
        <Screen name="First" component={TestScreen} />
        <Screen name="Second" component={TestScreen} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  expect(screen.getByText('First: false')).toBeOnTheScreen();

  await act(() => navigation.navigate('Second'));

  expect(screen.getByText('First: false')).toBeOnTheScreen();
  expect(screen.getByText('Second: true')).toBeOnTheScreen();

  await act(() => navigation.goBack());

  expect(screen.getByText('First: false')).toBeOnTheScreen();
  expect(screen.queryByText('Second: true')).toBeNull();
});

test('updates when the parent can go back', async () => {
  const navigation = createNavigationContainerRef<ParamListBase>();

  await render(
    <BaseNavigationContainer
      ref={navigation}
      initialState={{
        index: 1,
        routes: [{ name: 'Home' }, { name: 'Parent' }],
      }}
    >
      <TestNavigator>
        <Screen name="Home">{() => null}</Screen>
        <Screen name="Parent">
          {() => (
            <TestNavigator>
              <Screen name="Child" component={TestScreen} />
            </TestNavigator>
          )}
        </Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  expect(screen.getByText('Child: true')).toBeOnTheScreen();

  const initialState = navigation.getRootState();

  if (initialState === undefined) {
    throw new Error('Expected the navigation state to be initialized.');
  }

  await act(() =>
    navigation.resetRoot({
      routes: initialState.routes.filter((route) => route.name === 'Parent'),
    })
  );

  expect(screen.getByText('Child: false')).toBeOnTheScreen();

  await act(() => navigation.resetRoot(initialState));

  expect(screen.getByText('Child: true')).toBeOnTheScreen();
});

test('can go back when the parent cannot go back', async () => {
  const navigation = createNavigationContainerRef<ParamListBase>();

  await render(
    <BaseNavigationContainer ref={navigation}>
      <TestNavigator>
        <Screen name="Parent">
          {() => (
            <TestNavigator>
              <Screen name="First" component={TestScreen} />
              <Screen name="Second" component={TestScreen} />
            </TestNavigator>
          )}
        </Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  expect(screen.getByText('First: false')).toBeOnTheScreen();

  await act(() => navigation.navigate('Parent', { screen: 'Second' }));

  expect(screen.getByText('First: false')).toBeOnTheScreen();
  expect(screen.getByText('Second: true')).toBeOnTheScreen();
});

test('ignores the parent in an independent navigation tree', async () => {
  await render(
    <BaseNavigationContainer
      initialState={{
        routes: [{ name: 'Home' }, { name: 'Parent' }],
        index: 1,
      }}
    >
      <TestNavigator>
        <Screen name="Home">{() => null}</Screen>
        <Screen name="Parent">
          {() => (
            <>
              <TestScreen />
              <NavigationIndependentTree>
                <BaseNavigationContainer>
                  <TestNavigator>
                    <Screen name="Child" component={TestScreen} />
                  </TestNavigator>
                </BaseNavigationContainer>
              </NavigationIndependentTree>
            </>
          )}
        </Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  expect(screen.getByText('Parent: true')).toBeOnTheScreen();
  expect(screen.getByText('Child: false')).toBeOnTheScreen();
});

test('returns correct state after conditional rendering', async () => {
  const mismatches: boolean[] = [];

  const Test = () => {
    const canGoBack = useCanGoBack();
    const hasPreviousScreen = useNavigationState((state) => state.index > 0);

    if (canGoBack !== hasPreviousScreen) {
      mismatches.push(canGoBack);
    }

    return <Text>{`Second: ${canGoBack}`}</Text>;
  };

  const App = ({ includeFirst }: { includeFirst: boolean }) => (
    <BaseNavigationContainer
      initialState={{
        routes: [{ name: 'First' }, { name: 'Second' }],
        index: 1,
      }}
    >
      <TestNavigator>
        {includeFirst ? <Screen name="First">{() => null}</Screen> : null}
        <Screen name="Second" component={Test} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  const root = await render(<App includeFirst />);

  expect(screen.getByText('Second: true')).toBeOnTheScreen();

  await root.rerender(<App includeFirst={false} />);

  expect(screen.getByText('Second: false')).toBeOnTheScreen();
  expect(mismatches).toEqual([]);
});

test('skips re-renders for unchanged results after the first update', async () => {
  const onRender = jest.fn();
  const navigation = createNavigationContainerRef<ParamListBase>();

  const Test = React.memo(function Test() {
    const canGoBack = useCanGoBack();

    onRender();

    return <Text>{`First: ${canGoBack}`}</Text>;
  });

  await render(
    <BaseNavigationContainer ref={navigation}>
      <TestNavigator>
        <Screen name="First">{() => <Test />}</Screen>
        <Screen name="Second" component={TestScreen} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  expect(onRender).toHaveBeenCalledTimes(1);

  await act(() => navigation.dispatch(CommonActions.setParams({ answer: 42 })));

  expect(onRender).toHaveBeenCalledTimes(2);

  await act(() => navigation.navigate('Second'));
  await act(() => navigation.goBack());

  expect(onRender).toHaveBeenCalledTimes(2);

  await act(() =>
    navigation.dispatch(CommonActions.pushParams({ answer: 43 }))
  );

  expect(screen.getByText('First: true')).toBeOnTheScreen();
  expect(onRender).toHaveBeenCalledTimes(3);

  await act(() => navigation.dispatch(CommonActions.setParams({ answer: 44 })));

  expect(onRender).toHaveBeenCalledTimes(3);

  await act(() => navigation.goBack());

  expect(screen.getByText('First: false')).toBeOnTheScreen();
  expect(onRender).toHaveBeenCalledTimes(4);
});

test('keeps the previous state while navigation suspends', async () => {
  const { promise, resolve } = Promise.withResolvers<void>();
  const navigation = createNavigationContainerRef<ParamListBase>();
  let update: (tick: number) => void;

  const Test = ({ tick }: { tick: number }) => {
    const canGoBack = useCanGoBack();

    if (canGoBack) {
      React.use(promise);
    }

    return <Text>{`${canGoBack}: ${tick}`}</Text>;
  };

  const App = () => {
    const [tick, setTick] = React.useState(0);

    update = setTick;

    return (
      <React.Suspense fallback={<Text>Loading</Text>}>
        <BaseNavigationContainer ref={navigation}>
          <TestNavigator>
            <Screen name="First">{() => <Test tick={tick} />}</Screen>
          </TestNavigator>
        </BaseNavigationContainer>
      </React.Suspense>
    );
  };

  await render(<App />);

  await act(() =>
    navigation.dispatch(CommonActions.pushParams({ answer: 42 }))
  );

  expect(screen.getByText('false: 0')).toBeOnTheScreen();
  expect(screen.queryByText('Loading')).toBeNull();

  await act(() => update(1));

  expect(screen.getByText('false: 1')).toBeOnTheScreen();
  expect(screen.queryByText('Loading')).toBeNull();

  await act(() => resolve());

  expect(screen.getByText('true: 1')).toBeOnTheScreen();
});

test('keeps the latest state when a pending navigation is canceled', async () => {
  const { promise, resolve } = Promise.withResolvers<void>();
  const navigation = createNavigationContainerRef<ParamListBase>();
  const committed: boolean[] = [];

  const Test = () => {
    const canGoBack = useCanGoBack();

    React.useEffect(() => {
      committed.push(canGoBack);
    }, [canGoBack]);

    if (canGoBack) {
      React.use(promise);
    }

    return <Text>{`First: ${canGoBack}`}</Text>;
  };

  await render(
    <React.Suspense fallback={<Text>Loading</Text>}>
      <BaseNavigationContainer ref={navigation}>
        <TestNavigator>
          <Screen name="First" component={Test} />
        </TestNavigator>
      </BaseNavigationContainer>
    </React.Suspense>
  );

  await act(() =>
    navigation.dispatch(CommonActions.pushParams({ answer: 42 }))
  );

  expect(screen.getByText('First: false')).toBeOnTheScreen();
  expect(screen.queryByText('Loading')).toBeNull();

  await act(() => navigation.goBack());
  await act(() => resolve());

  expect(screen.getByText('First: false')).toBeOnTheScreen();
  expect(screen.queryByText('Loading')).toBeNull();
  expect(committed).toEqual([false]);
});

test('uses local history after the parent can no longer go back', async () => {
  const navigation = createNavigationContainerRef<ParamListBase>();
  const onRender = jest.fn();

  const Test = React.memo(function Test() {
    const canGoBack = useCanGoBack();

    onRender(canGoBack);

    return <Text>{`Child: ${canGoBack}`}</Text>;
  });

  await render(
    <BaseNavigationContainer
      ref={navigation}
      initialState={{
        routes: [{ name: 'Home' }, { name: 'Parent' }],
        index: 1,
      }}
    >
      <TestNavigator>
        <Screen name="Home">{() => null}</Screen>
        <Screen name="Parent">
          {() => (
            <TestNavigator>
              <Screen name="Child">{() => <Test />}</Screen>
            </TestNavigator>
          )}
        </Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  expect(screen.getByText('Child: true')).toBeOnTheScreen();
  expect(onRender).toHaveBeenCalledWith(true);

  await act(() => navigation.dispatch(CommonActions.setParams({ answer: 0 })));

  expect(onRender).toHaveBeenCalledTimes(2);

  await act(() =>
    navigation.dispatch(CommonActions.pushParams({ answer: 42 }))
  );

  const state = navigation.getRootState();

  expect(onRender).toHaveBeenCalledTimes(2);

  if (state === undefined) {
    throw new Error('Expected the navigation state to be initialized.');
  }

  await act(() =>
    navigation.resetRoot({
      ...state,
      index: 0,
      routes: state.routes.filter((route) => route.name === 'Parent'),
    })
  );

  expect(screen.getByText('Child: true')).toBeOnTheScreen();
  expect(onRender).not.toHaveBeenCalledWith(false);

  await act(() => navigation.goBack());

  expect(screen.getByText('Child: false')).toBeOnTheScreen();
  expect(onRender).toHaveBeenLastCalledWith(false);
});

test('does not re-render the header when another screen updates its params', async () => {
  const navigation = createNavigationContainerRef<ParamListBase>();
  const onRender = jest.fn();

  const Header = () => {
    const canGoBack = useCanGoBack();

    return <Text>{`Header: ${canGoBack}`}</Text>;
  };

  const Navigator = (props: Parameters<typeof useNavigationBuilder>[1]) => {
    const { state, descriptors, render } = useNavigationBuilder(
      StackRouter,
      props
    );
    const descriptor = Object.values(descriptors).find(
      ({ route }) => route.name === 'Second'
    );

    const header = React.useMemo(
      () =>
        descriptor ? (
          <React.Profiler id="header" onRender={onRender}>
            <NavigationProvider
              navigation={descriptor.navigation}
              route={descriptor.route}
            >
              <Header />
            </NavigationProvider>
          </React.Profiler>
        ) : null,
      [descriptor]
    );

    return render(
      <>
        {header}
        {state.routes.map((route) => descriptors[route.key]?.render())}
      </>
    );
  };

  await render(
    <BaseNavigationContainer
      ref={navigation}
      initialState={{
        routes: [{ name: 'First' }, { name: 'Second' }],
        index: 1,
      }}
    >
      <Navigator>
        <Screen name="First" component={TestScreen} />
        <Screen name="Second" component={TestScreen} />
      </Navigator>
    </BaseNavigationContainer>
  );

  expect(screen.getByText('Header: true')).toBeOnTheScreen();
  expect(onRender).toHaveBeenCalledTimes(1);

  const source = navigation.getRootState()?.routes[0]?.key;

  expect(source).toBeDefined();

  await act(() =>
    navigation.dispatch({ ...CommonActions.setParams({ answer: 42 }), source })
  );
  await act(() =>
    navigation.dispatch({ ...CommonActions.setParams({ answer: 43 }), source })
  );

  expect(screen.getByText('Header: true')).toBeOnTheScreen();
  expect(onRender).toHaveBeenCalledTimes(1);
});

test('updates when tab history changes', async () => {
  const navigation = createNavigationContainerRef<ParamListBase>();

  const Navigator = (props: Parameters<typeof useNavigationBuilder>[1]) => {
    const { state, descriptors, render } = useNavigationBuilder(TabRouter, {
      ...props,
      backBehavior: 'history',
    });

    return render(
      state.routes.map((route) => descriptors[route.key]?.render())
    );
  };

  await render(
    <BaseNavigationContainer ref={navigation}>
      <Navigator>
        <Screen name="First" component={TestScreen} />
        <Screen name="Second" component={TestScreen} />
      </Navigator>
    </BaseNavigationContainer>
  );

  expect(screen.getByText('First: false')).toBeOnTheScreen();
  expect(screen.getByText('Second: false')).toBeOnTheScreen();

  await act(() => navigation.navigate('Second'));

  expect(screen.getByText('First: false')).toBeOnTheScreen();
  expect(screen.getByText('Second: true')).toBeOnTheScreen();

  await act(() => navigation.navigate('First'));

  expect(screen.getByText('First: true')).toBeOnTheScreen();
  expect(screen.getByText('Second: false')).toBeOnTheScreen();

  await act(() => navigation.goBack());

  expect(screen.getByText('First: false')).toBeOnTheScreen();
  expect(screen.getByText('Second: false')).toBeOnTheScreen();
});

test('updates when the drawer opens or closes', async () => {
  const navigation = createNavigationContainerRef<ParamListBase>();

  const Navigator = (props: Parameters<typeof useNavigationBuilder>[1]) => {
    const { state, descriptors, render } = useNavigationBuilder(
      DrawerRouter,
      props
    );

    return render(
      state.routes.map((route) => descriptors[route.key]?.render())
    );
  };

  await render(
    <BaseNavigationContainer ref={navigation}>
      <Navigator>
        <Screen name="First" component={TestScreen} />
      </Navigator>
    </BaseNavigationContainer>
  );

  expect(screen.getByText('First: false')).toBeOnTheScreen();

  await act(() => navigation.dispatch(DrawerActions.openDrawer()));

  expect(screen.getByText('First: true')).toBeOnTheScreen();

  await act(() => navigation.dispatch(DrawerActions.closeDrawer()));

  expect(screen.getByText('First: false')).toBeOnTheScreen();

  await act(() => navigation.dispatch(DrawerActions.openDrawer()));
  await act(() => navigation.goBack());

  expect(screen.getByText('First: false')).toBeOnTheScreen();
});

test('only checks screens that use the hook and shares the result', async () => {
  const navigation = createNavigationContainerRef<ParamListBase>();
  const onCheck = jest.fn();
  let show: (visible: boolean) => void;

  const Test = () => {
    const [visible, setVisible] = React.useState(false);

    show = setVisible;

    return visible ? (
      <>
        <TestScreen />
        <TestScreen />
      </>
    ) : null;
  };

  await render(
    <BaseNavigationContainer ref={navigation}>
      <TestNavigator
        router={(router) => ({
          getStateForAction(state, action, options) {
            if (action.type === 'GO_BACK') {
              onCheck(action.source);
            }

            return router.getStateForAction(state, action, options);
          },
        })}
      >
        <Screen name="First" component={Test} />
        <Screen name="Second">{() => null}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await act(() => navigation.dispatch(CommonActions.setParams({ answer: 1 })));

  expect(onCheck).not.toHaveBeenCalled();

  await act(() => show(true));

  expect(screen.getAllByText('First: false')).toHaveLength(2);
  expect(onCheck).toHaveBeenCalledTimes(1);

  await act(() => navigation.navigate('Second'));

  expect(onCheck).toHaveBeenCalledTimes(2);
  expect(onCheck).toHaveBeenLastCalledWith(
    navigation.getRootState()?.routes[0]?.key
  );

  await act(() => show(false));
  await act(() => navigation.dispatch(CommonActions.setParams({ answer: 2 })));

  expect(onCheck).toHaveBeenCalledTimes(2);
});

test('skips local checks when the parent can go back', async () => {
  const navigation = createNavigationContainerRef<ParamListBase>();
  const onCheck = jest.fn();

  await render(
    <BaseNavigationContainer
      ref={navigation}
      initialState={{
        index: 1,
        routes: [{ name: 'Home' }, { name: 'Parent' }],
      }}
    >
      <TestNavigator>
        <Screen name="Home">{() => null}</Screen>
        <Screen name="Parent">
          {() => (
            <TestNavigator
              router={(router) => ({
                getStateForAction(state, action, options) {
                  if (action.type === 'GO_BACK') {
                    onCheck();
                  }

                  return router.getStateForAction(state, action, options);
                },
              })}
            >
              <Screen name="Child" component={TestScreen} />
            </TestNavigator>
          )}
        </Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await act(() => navigation.dispatch(CommonActions.pushParams({ answer: 1 })));

  expect(screen.getByText('Child: true')).toBeOnTheScreen();
  expect(onCheck).not.toHaveBeenCalled();

  const state = navigation.getRootState();

  if (state === undefined) {
    throw new Error('Expected the navigation state to be initialized.');
  }

  await act(() =>
    navigation.resetRoot({
      ...state,
      index: 0,
      routes: state.routes.filter((route) => route.name === 'Parent'),
    })
  );

  expect(screen.getByText('Child: true')).toBeOnTheScreen();
  expect(onCheck).toHaveBeenCalled();
});

test('keeps the previous parent state while navigation suspends', async () => {
  const { promise, resolve } = Promise.withResolvers<void>();
  const navigation = createNavigationContainerRef<ParamListBase>();
  const TickContext = React.createContext(0);
  let update: (tick: number) => void;

  const Test = () => {
    const canGoBack = useCanGoBack();
    const tick = React.use(TickContext);

    return <Text>{`${canGoBack}: ${tick}`}</Text>;
  };

  const Parent = () => {
    const hasHistory = useNavigationState((state) =>
      Boolean(state.routes[0]?.history?.length)
    );

    if (hasHistory) {
      React.use(promise);
    }

    return (
      <TestNavigator>
        <Screen name="Child" component={Test} />
      </TestNavigator>
    );
  };

  const content = (
    <React.Suspense fallback={<Text>Loading</Text>}>
      <BaseNavigationContainer ref={navigation}>
        <TestNavigator>
          <Screen name="Parent" component={Parent} />
        </TestNavigator>
      </BaseNavigationContainer>
    </React.Suspense>
  );

  const App = () => {
    const [tick, setTick] = React.useState(0);

    update = setTick;

    return <TickContext.Provider value={tick}>{content}</TickContext.Provider>;
  };

  await render(<App />);
  await act(() => navigation.dispatch(CommonActions.setParams({ answer: 0 })));

  const state = navigation.getRootState();

  if (state === undefined) {
    throw new Error('Expected the navigation state to be initialized.');
  }

  await act(() =>
    navigation.dispatch({
      ...CommonActions.pushParams({ answer: 1 }),
      target: state.key,
      source: state.routes[0]?.key,
    })
  );

  expect(screen.getByText('false: 0')).toBeOnTheScreen();

  await act(() => update(1));

  expect(screen.getByText('false: 1')).toBeOnTheScreen();
  expect(screen.queryByText('Loading')).toBeNull();

  await act(() => resolve());

  expect(screen.getByText('true: 1')).toBeOnTheScreen();
});

test('updates when local history is removed during a pending parent navigation', async () => {
  const { promise, resolve } = Promise.withResolvers<void>();
  const navigation = createNavigationContainerRef<ParamListBase>();
  let removeFirst: () => void;

  const ParentStatus = () => {
    const hasHistory = useNavigationState((state) =>
      Boolean(state.routes[0]?.history?.length)
    );

    if (hasHistory) {
      React.use(promise);
    }

    return null;
  };

  const ChildNavigator = () => {
    const [includeFirst, setIncludeFirst] = React.useState(true);

    removeFirst = () => setIncludeFirst(false);

    return (
      <TestNavigator>
        {includeFirst ? <Screen name="First">{() => null}</Screen> : null}
        <Screen name="Second" component={TestScreen} />
      </TestNavigator>
    );
  };

  await render(
    <React.Suspense fallback={<Text>Loading</Text>}>
      <BaseNavigationContainer
        ref={navigation}
        initialState={{
          routes: [
            {
              name: 'Parent',
              state: {
                index: 1,
                routes: [{ name: 'First' }, { name: 'Second' }],
              },
            },
          ],
        }}
      >
        <TestNavigator>
          <Screen name="Parent">
            {() => (
              <>
                <ParentStatus />
                <ChildNavigator />
              </>
            )}
          </Screen>
        </TestNavigator>
      </BaseNavigationContainer>
    </React.Suspense>
  );

  await act(() => navigation.dispatch(CommonActions.setParams({ answer: 0 })));

  const state = navigation.getRootState();

  if (state === undefined) {
    throw new Error('Expected the navigation state to be initialized.');
  }

  await act(() =>
    navigation.dispatch({
      ...CommonActions.pushParams({ answer: 1 }),
      target: state.key,
      source: state.routes[0]?.key,
    })
  );

  expect(screen.getByText('Second: true')).toBeOnTheScreen();

  await act(() => removeFirst());

  expect(
    screen.getByText('Second: false', { includeHiddenElements: true })
  ).toBeOnTheScreen();
  expect(screen.getByText('Loading')).toBeOnTheScreen();

  await act(() => resolve());

  expect(screen.getByText('Second: true')).toBeOnTheScreen();
});

test('uses the current state when parent and child history change together', async () => {
  const navigation = createNavigationContainerRef<ParamListBase>();
  const mismatches: boolean[] = [];
  const ParentHistoryContext = React.createContext(false);

  const Test = React.memo(function Test() {
    const canGoBack = useCanGoBack();
    const parentCanGoBack = React.use(ParentHistoryContext);
    const childCanGoBack = useNavigationState((state) => state.index > 0);

    if (canGoBack !== (parentCanGoBack || childCanGoBack)) {
      mismatches.push(canGoBack);
    }

    return <Text>{`Child: ${canGoBack}`}</Text>;
  });

  const Parent = () => {
    const canGoBack = useNavigationState((state) =>
      Boolean(state.routes[0]?.history?.length)
    );

    return (
      <ParentHistoryContext.Provider value={canGoBack}>
        <TestNavigator>
          <Screen name="First">{() => null}</Screen>
          <Screen name="Second">{() => <Test />}</Screen>
        </TestNavigator>
      </ParentHistoryContext.Provider>
    );
  };

  await render(
    <BaseNavigationContainer
      ref={navigation}
      initialState={{
        routes: [
          {
            name: 'Parent',
            state: {
              index: 1,
              routes: [{ name: 'First' }, { name: 'Second' }],
            },
          },
        ],
      }}
    >
      <TestNavigator>
        <Screen name="Parent" component={Parent} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await act(() => navigation.dispatch(CommonActions.setParams({ answer: 0 })));

  const state = navigation.getRootState();
  const parent = state?.routes[0];
  const child = parent?.state;

  if (!state || !parent || !child || child.stale !== false) {
    throw new Error('Expected the navigation state to be initialized.');
  }

  await act(() =>
    navigation.resetRoot({
      ...state,
      routes: [
        {
          ...parent,
          history: [{ type: 'params', params: {} }],
          state: {
            ...child,
            index: 0,
            routes: child.routes.filter((route) => route.name === 'Second'),
          },
        },
      ],
    })
  );

  expect(screen.getByText('Child: true')).toBeOnTheScreen();
  expect(mismatches).toEqual([]);
});
