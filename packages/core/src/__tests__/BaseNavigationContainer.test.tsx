import { beforeEach, expect, jest, test } from '@jest/globals';
import {
  type DefaultRouterOptions,
  type NavigationState,
  type ParamListBase,
  type Router,
  StackActions,
  StackRouter,
  TabRouter,
} from '@react-navigation/routers';
import { act, render } from '@testing-library/react-native';
import * as React from 'react';

import { BaseNavigationContainer } from '../BaseNavigationContainer';
import { createNavigationContainerRef } from '../createNavigationContainerRef';
import { NavigationIndependentTree } from '../NavigationIndependentTree';
import { NavigationStateContext } from '../NavigationStateContext';
import { Screen } from '../Screen';
import type {
  DefaultNavigatorOptions,
  EventListenerCallback,
  EventMapBase,
  NavigationContainerEventMap,
} from '../types';
import { useNavigationBuilder } from '../useNavigationBuilder';
import {
  type MockActions,
  MockRouter,
  MockRouterKey,
} from './__fixtures__/MockRouter';

beforeEach(() => {
  MockRouterKey.current = 0;
});

type TestNavigatorProps = DefaultNavigatorOptions<
  ParamListBase,
  NavigationState,
  {},
  EventMapBase,
  unknown
>;

test('throws when getState is accessed without a container', async () => {
  expect.assertions(1);

  const Test = () => {
    const { getState } = React.use(NavigationStateContext);

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    getState;

    return null;
  };

  const element = <Test />;

  await expect(render(element)).rejects.toThrow(
    "Couldn't find a navigation context. Have you wrapped your app with 'NavigationContainer'?"
  );
});

test('throws when setState is accessed without a container', async () => {
  expect.assertions(1);

  const Test = () => {
    const { setState } = React.use(NavigationStateContext);

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    setState;

    return null;
  };

  const element = <Test />;

  await expect(render(element)).rejects.toThrow(
    "Couldn't find a navigation context. Have you wrapped your app with 'NavigationContainer'?"
  );
});

test('throws when nesting containers', async () => {
  await expect(
    render(
      <BaseNavigationContainer>
        <BaseNavigationContainer>
          <React.Fragment />
        </BaseNavigationContainer>
      </BaseNavigationContainer>
    )
  ).rejects.toThrow(
    "Looks like you have nested a 'NavigationContainer' inside another."
  );

  await expect(
    render(
      <BaseNavigationContainer>
        <NavigationIndependentTree>
          <BaseNavigationContainer>
            <React.Fragment />
          </BaseNavigationContainer>
        </NavigationIndependentTree>
      </BaseNavigationContainer>
    )
  ).resolves.toBeDefined();
});

test('handle dispatching with ref', async () => {
  function CurrentRootRouter(options: DefaultRouterOptions) {
    const CurrentMockRouter = MockRouter(options);
    const RootRouter: Router<
      NavigationState,
      MockActions | { type: 'REVERSE' }
    > = {
      ...CurrentMockRouter,

      shouldActionChangeFocus() {
        return true;
      },

      getStateForAction(state, action, options) {
        if (action.type === 'REVERSE') {
          return {
            ...state,
            routes: state.routes.slice().reverse(),
          };
        }
        return CurrentMockRouter.getStateForAction(state, action, options);
      },
    };
    return RootRouter;
  }

  const RootNavigator = (props: any) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      CurrentRootRouter,
      props
    );

    return (
      <NavigationContent>
        {state.routes.map((route) => descriptors[route.key]?.render())}
      </NavigationContent>
    );
  };

  const ref = createNavigationContainerRef<ParamListBase>();

  const onStateChange = jest.fn();

  const initialState = {
    index: 1,
    routes: [
      { key: 'baz', name: 'baz' },
      { key: 'bar', name: 'bar' },
    ],
  };

  const element = (
    <BaseNavigationContainer
      ref={ref}
      initialState={initialState}
      onStateChange={onStateChange}
    >
      <RootNavigator>
        <Screen name="foo">{() => null}</Screen>
        <Screen name="foo2">{() => null}</Screen>
        <Screen name="bar">{() => null}</Screen>
        <Screen name="baz">{() => null}</Screen>
      </RootNavigator>
    </BaseNavigationContainer>
  );

  await render(element);

  await act(() => {
    ref.current?.dispatch({ type: 'REVERSE' });
  });

  expect(onStateChange).toHaveBeenCalledTimes(1);
  expect(onStateChange).toHaveBeenLastCalledWith({
    stale: false,
    type: 'test',
    index: 1,
    key: '0',
    routeNames: ['foo', 'foo2', 'bar', 'baz'],
    routes: [
      { key: 'bar', name: 'bar' },
      { key: 'baz', name: 'baz' },
    ],
  });
});

test('handle resetting state with ref', async () => {
  const TestNavigator = (props: any) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      MockRouter,
      props
    );

    return (
      <NavigationContent>
        {state.routes.map((route) => descriptors[route.key]?.render())}
      </NavigationContent>
    );
  };

  const ref = createNavigationContainerRef<ParamListBase>();

  const onStateChange = jest.fn();

  const element = (
    <BaseNavigationContainer ref={ref} onStateChange={onStateChange}>
      <TestNavigator>
        <Screen name="foo">{() => null}</Screen>
        <Screen name="foo2">
          {() => (
            <TestNavigator>
              <Screen name="qux1">{() => null}</Screen>
              <Screen name="lex1">{() => null}</Screen>
            </TestNavigator>
          )}
        </Screen>
        <Screen name="bar">{() => null}</Screen>
        <Screen name="baz">
          {() => (
            <TestNavigator>
              <Screen name="qux2">{() => null}</Screen>
              <Screen name="lex2">{() => null}</Screen>
            </TestNavigator>
          )}
        </Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await render(element);

  const state = {
    index: 1,
    routes: [
      {
        key: 'baz',
        name: 'baz',
        state: {
          index: 0,
          key: '4',
          routeNames: ['qux2', 'lex2'],
          routes: [
            { key: 'qux2', name: 'qux2' },
            { key: 'lex2', name: 'lex2' },
          ],
        },
      },
      { key: 'bar', name: 'bar' },
    ],
  };

  await act(() => {
    ref.current?.resetRoot(state);
  });

  expect(onStateChange).toHaveBeenCalledTimes(1);
  expect(onStateChange).toHaveBeenLastCalledWith({
    index: 1,
    key: '3',
    routeNames: ['foo', 'foo2', 'bar', 'baz'],
    routes: [
      {
        key: 'baz',
        name: 'baz',
        state: {
          index: 0,
          key: '4',
          routeNames: ['qux2', 'lex2'],
          routes: [
            { key: 'qux2', name: 'qux2' },
            { key: 'lex2', name: 'lex2' },
          ],
          stale: false,
          type: 'test',
        },
      },
      { key: 'bar', name: 'bar' },
    ],
    stale: false,
    type: 'test',
  });
});

test('returns whether the root navigation can go back', async () => {
  const ref = createNavigationContainerRef<ParamListBase>();

  const TestNavigator = (props: TestNavigatorProps) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      MockRouter,
      props
    );

    return (
      <NavigationContent>
        {state.routes.map((route) => descriptors[route.key]?.render())}
      </NavigationContent>
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

  expect(ref.current?.canGoBack()).toBe(false);

  await act(() => ref.current?.navigate('bar'));

  expect(ref.current?.canGoBack()).toBe(true);
});

test('handles getRootState', async () => {
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

  const ref = createNavigationContainerRef<ParamListBase>();

  const element = (
    <BaseNavigationContainer ref={ref}>
      <TestNavigator initialRouteName="foo">
        <Screen name="foo">
          {() => (
            <TestNavigator>
              <Screen name="qux">{() => null}</Screen>
              <Screen name="lex">{() => null}</Screen>
            </TestNavigator>
          )}
        </Screen>
        <Screen name="bar">{() => null}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await render(element);

  let state;
  if (ref.current) {
    state = ref.current.getRootState();
  }
  expect(state).toEqual({
    index: 0,
    key: '0',
    routeNames: ['foo', 'bar'],
    routes: [
      {
        key: 'foo',
        name: 'foo',
        state: {
          index: 0,
          key: '1',
          routeNames: ['qux', 'lex'],
          routes: [
            { key: 'qux', name: 'qux' },
            { key: 'lex', name: 'lex' },
          ],
          stale: false,
          type: 'test',
        },
      },
      { key: 'bar', name: 'bar' },
    ],
    stale: false,
    type: 'test',
  });
});

test('emits ready event when the container is ready with synchronous content', async () => {
  const TestNavigator = (props: any) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      MockRouter,
      props
    );
    return (
      <NavigationContent>
        {state.routes.map((route) => descriptors[route.key]?.render())}
      </NavigationContent>
    );
  };

  const ref = createNavigationContainerRef<ParamListBase>();

  const listener = jest.fn();

  ref.addListener('ready', () => {
    listener(ref.isReady(), ref.getCurrentRoute()?.name);
  });

  expect(listener).not.toHaveBeenCalled();

  await render(
    <BaseNavigationContainer ref={ref}>
      <TestNavigator>
        <Screen name="foo">{() => null}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  expect(listener).toHaveBeenCalledTimes(1);
  expect(listener).toHaveBeenCalledWith(true, 'foo');
});

test('emits ready event when the container is ready with asynchronous content', async () => {
  const TestNavigator = (props: any) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      MockRouter,
      props
    );
    return (
      <NavigationContent>
        {state.routes.map((route) => descriptors[route.key]?.render())}
      </NavigationContent>
    );
  };

  const ref = createNavigationContainerRef<ParamListBase>();

  const listener = jest.fn();

  ref.addListener('ready', () => {
    listener(ref.isReady(), ref.getCurrentRoute()?.name);
  });

  const wrapper = await render(
    <BaseNavigationContainer ref={ref}>{null}</BaseNavigationContainer>
  );

  expect(listener).not.toHaveBeenCalled();

  await Promise.resolve();

  await wrapper.rerender(
    <BaseNavigationContainer ref={ref}>
      <TestNavigator>
        <Screen name="foo">{() => null}</Screen>
        <Screen name="bar">{() => null}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  expect(listener).toHaveBeenCalledTimes(1);
  expect(listener).toHaveBeenCalledWith(true, 'foo');
});

test('emits state events when the state changes', async () => {
  const TestNavigator = (props: any) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      MockRouter,
      props
    );

    return (
      <NavigationContent>
        {state.routes.map((route) => descriptors[route.key]?.render())}
      </NavigationContent>
    );
  };

  const ref = createNavigationContainerRef<ParamListBase>();

  const element = (
    <BaseNavigationContainer ref={ref}>
      <TestNavigator>
        <Screen name="foo">{() => null}</Screen>
        <Screen name="bar">{() => null}</Screen>
        <Screen name="baz">{() => null}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await render(element);

  const listener =
    jest.fn<EventListenerCallback<NavigationContainerEventMap, 'state'>>();

  ref.current?.addListener('state', listener);

  expect(listener).not.toHaveBeenCalled();

  await act(() => {
    ref.current?.navigate('bar');
  });

  expect(listener).toHaveBeenCalledTimes(1);
  expect(listener.mock.calls[0]?.[0]?.data.state).toEqual({
    type: 'test',
    stale: false,
    index: 1,
    key: '0',
    routeNames: ['foo', 'bar', 'baz'],
    routes: [
      { key: 'foo', name: 'foo' },
      { key: 'bar', name: 'bar' },
      { key: 'baz', name: 'baz' },
    ],
  });

  await act(() => {
    ref.current?.navigate('baz', { answer: 42 });
  });

  expect(listener).toHaveBeenCalledTimes(2);
  expect(listener.mock.calls[1]?.[0]?.data.state).toEqual({
    type: 'test',
    stale: false,
    index: 2,
    key: '0',
    routeNames: ['foo', 'bar', 'baz'],
    routes: [
      { key: 'foo', name: 'foo' },
      { key: 'bar', name: 'bar' },
      { key: 'baz', name: 'baz', params: { answer: 42 } },
    ],
  });
});

test('emits state events when new navigator mounts', async () => {
  jest.useFakeTimers();

  const TestNavigator = (props: any) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      MockRouter,
      props
    );

    return (
      <NavigationContent>
        {state.routes.map((route) => descriptors[route.key]?.render())}
      </NavigationContent>
    );
  };

  const ref = createNavigationContainerRef<ParamListBase>();

  const NestedNavigator = () => {
    const [isRendered, setIsRendered] = React.useState(false);

    React.useEffect(() => {
      const timer = setTimeout(() => setIsRendered(true), 100);

      return () => clearTimeout(timer);
    }, []);

    if (!isRendered) {
      return null;
    }

    return (
      <TestNavigator>
        <Screen name="baz">{() => null}</Screen>
        <Screen name="bax">{() => null}</Screen>
      </TestNavigator>
    );
  };

  const onStateChange = jest.fn();

  const element = (
    <BaseNavigationContainer ref={ref} onStateChange={onStateChange}>
      <TestNavigator>
        <Screen name="foo">{() => null}</Screen>
        <Screen name="bar" component={NestedNavigator} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await render(element);

  const listener =
    jest.fn<EventListenerCallback<NavigationContainerEventMap, 'state'>>();

  ref.current?.addListener('state', listener);

  expect(listener).not.toHaveBeenCalled();
  expect(onStateChange).not.toHaveBeenCalled();

  await act(() => {
    jest.runAllTimers();
  });

  const resultState = {
    stale: false,
    type: 'test',
    index: 0,
    key: '0',
    routeNames: ['foo', 'bar'],
    routes: [
      { key: 'foo', name: 'foo' },
      {
        key: 'bar',
        name: 'bar',
        state: {
          stale: false,
          type: 'test',
          index: 0,
          key: '1',
          routeNames: ['baz', 'bax'],
          routes: [
            { key: 'baz', name: 'baz' },
            { key: 'bax', name: 'bax' },
          ],
        },
      },
    ],
  };

  expect(listener).toHaveBeenCalledTimes(1);
  expect(listener.mock.calls[0]?.[0]?.data.state).toEqual(resultState);

  expect(onStateChange).toHaveBeenCalledTimes(1);
  expect(onStateChange).toHaveBeenLastCalledWith(resultState);
});

test('emits state events when a screen with a nested navigator mounts later', async () => {
  const TestNavigator = ({ show, ...props }: any) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      MockRouter,
      props
    );

    return (
      <NavigationContent>
        {show
          ? state.routes.map((route) => descriptors[route.key]?.render())
          : null}
      </NavigationContent>
    );
  };

  const ref = createNavigationContainerRef<ParamListBase>();
  const onStateChange = jest.fn();

  const Test = ({ show }: { show: boolean }) => (
    <BaseNavigationContainer ref={ref} onStateChange={onStateChange}>
      <TestNavigator show={show}>
        <Screen name="foo">
          {() => (
            <TestNavigator>
              <Screen name="bar">{() => null}</Screen>
            </TestNavigator>
          )}
        </Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  const root = await render(<Test show={false} />);

  const listener =
    jest.fn<EventListenerCallback<NavigationContainerEventMap, 'state'>>();

  ref.current?.addListener('state', listener);

  expect(listener).not.toHaveBeenCalled();
  expect(onStateChange).not.toHaveBeenCalled();

  await root.rerender(<Test show />);

  const resultState = {
    stale: false,
    type: 'test',
    index: 0,
    key: '0',
    routeNames: ['foo'],
    routes: [
      {
        key: 'foo',
        name: 'foo',
        state: {
          stale: false,
          type: 'test',
          index: 0,
          key: '1',
          routeNames: ['bar'],
          routes: [{ key: 'bar', name: 'bar' }],
        },
      },
    ],
  };

  expect(listener).toHaveBeenCalledTimes(1);
  expect(listener.mock.calls[0]?.[0].data.state).toEqual(resultState);

  expect(onStateChange).toHaveBeenCalledTimes(1);
  expect(onStateChange).toHaveBeenLastCalledWith(resultState);
});

test("emits '__unsafe_action__' with noop false when action updates state", async () => {
  const TestNavigator = (props: any) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      StackRouter,
      props
    );

    return (
      <NavigationContent>
        {state.routes.map((route) => descriptors[route.key]?.render())}
      </NavigationContent>
    );
  };

  const ref = createNavigationContainerRef<ParamListBase>();

  const events: NavigationContainerEventMap['__unsafe_action__']['data'][] = [];

  await render(
    <BaseNavigationContainer ref={ref}>
      <TestNavigator>
        <Screen name="foo">{() => null}</Screen>
        <Screen name="bar">{() => null}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  ref.current?.addListener('__unsafe_action__', (e) => {
    events.push(e.data);
  });

  await act(() => ref.current?.navigate('bar'));

  expect(events).toEqual([
    expect.objectContaining({
      action: expect.objectContaining({ type: 'NAVIGATE' }),
      noop: false,
    }),
  ]);
});

test("emits '__unsafe_action__' with noop true when action is handled without changing state", async () => {
  const TestNavigator = (props: any) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      StackRouter,
      props
    );

    return (
      <NavigationContent>
        {state.routes.map((route) => descriptors[route.key]?.render())}
      </NavigationContent>
    );
  };

  const ref = createNavigationContainerRef<ParamListBase>();

  const events: NavigationContainerEventMap['__unsafe_action__']['data'][] = [];

  await render(
    <BaseNavigationContainer ref={ref}>
      <TestNavigator>
        <Screen name="foo">{() => null}</Screen>
        <Screen name="bar">{() => null}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  ref.current?.addListener('__unsafe_action__', (e) => {
    events.push(e.data);
  });

  const target = ref.current?.getRootState().key;

  await act(() =>
    ref.current?.dispatch({
      type: 'UNKNOWN',
      target,
    })
  );

  expect(events).toEqual([
    expect.objectContaining({
      action: expect.objectContaining({ type: 'UNKNOWN' }),
      noop: true,
    }),
  ]);
});

test("doesn't emit '__unsafe_action__' when action isn't handled", async () => {
  const TestNavigator = (props: any) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      StackRouter,
      props
    );

    return (
      <NavigationContent>
        {state.routes.map((route) => descriptors[route.key]?.render())}
      </NavigationContent>
    );
  };

  const ref = createNavigationContainerRef<ParamListBase>();

  const listener =
    jest.fn<
      EventListenerCallback<NavigationContainerEventMap, '__unsafe_action__'>
    >();

  const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

  await render(
    <BaseNavigationContainer ref={ref}>
      <TestNavigator>
        <Screen name="foo">{() => null}</Screen>
        <Screen name="bar">{() => null}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  ref.current?.addListener('__unsafe_action__', listener);

  await act(() =>
    ref.current?.dispatch({
      type: 'UNKNOWN',
    })
  );

  expect(listener).not.toHaveBeenCalled();

  expect(spy).toHaveBeenCalledTimes(1);
  expect(spy.mock.calls[0]?.[0]).toMatch(
    "The action 'UNKNOWN' was not handled by any navigator."
  );

  spy.mockRestore();
});

test("emits '__unsafe_action__' with noop false when beforeRemove doesn't prevent removal", async () => {
  const TestNavigator = (props: any) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      StackRouter,
      props
    );

    return (
      <NavigationContent>
        {state.routes.map((route) => descriptors[route.key]?.render())}
      </NavigationContent>
    );
  };

  const ref = createNavigationContainerRef<ParamListBase>();

  const events: string[] = [];

  const actionEvents: NavigationContainerEventMap['__unsafe_action__']['data'][] =
    [];
  const beforeRemoveEvents: NavigationContainerEventMap['__unsafe_event__']['data'][] =
    [];

  const TestScreen = (props: any) => {
    React.useEffect(
      () =>
        props.navigation.addListener('beforeRemove', () => {
          events.push('beforeRemove listener');
        }),
      [props.navigation]
    );

    return null;
  };

  await render(
    <BaseNavigationContainer ref={ref}>
      <TestNavigator initialRouteName="bar">
        <Screen name="foo">{() => null}</Screen>
        <Screen name="bar" component={TestScreen} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  ref.current?.addListener('__unsafe_event__', (e) => {
    if (e.data.type === 'beforeRemove') {
      events.push('unsafe event');
      beforeRemoveEvents.push(e.data);
    }
  });

  ref.current?.addListener('__unsafe_action__', (e) => {
    events.push('unsafe action');
    actionEvents.push(e.data);
  });

  await act(() => ref.current?.dispatch(StackActions.popTo('foo')));

  expect(events).toEqual([
    'beforeRemove listener',
    'unsafe event',
    'unsafe action',
  ]);

  expect(beforeRemoveEvents).toEqual([
    expect.objectContaining({
      type: 'beforeRemove',
      defaultPrevented: false,
    }),
  ]);

  expect(actionEvents).toEqual([
    expect.objectContaining({
      action: expect.objectContaining({ type: 'POP_TO' }),
      noop: false,
    }),
  ]);

  expect(ref.current?.getRootState().routes).toEqual([
    expect.objectContaining({ name: 'foo' }),
  ]);
});

test("emits '__unsafe_event__' before noop true '__unsafe_action__' when beforeRemove prevents removal", async () => {
  const TestNavigator = (props: any) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      StackRouter,
      props
    );

    return (
      <NavigationContent>
        {state.routes.map((route) => descriptors[route.key]?.render())}
      </NavigationContent>
    );
  };

  const ref = createNavigationContainerRef<ParamListBase>();

  const actionEvents: NavigationContainerEventMap['__unsafe_action__']['data'][] =
    [];

  const calls: string[] = [];

  const TestScreen = (props: any) => {
    React.useEffect(
      () =>
        props.navigation.addListener('beforeRemove', (e: any) => {
          calls.push('navigation listener');
          e.preventDefault();
        }),
      [props.navigation]
    );

    return null;
  };

  const unsafeEventListener = jest.fn<
    EventListenerCallback<NavigationContainerEventMap, '__unsafe_event__'>
  >((e) => {
    calls.push('unsafe event');

    expect(e.data.type).toBe('beforeRemove');
    expect(e.data.defaultPrevented).toBe(true);
  });

  const unsafeActionListener = jest.fn<
    EventListenerCallback<NavigationContainerEventMap, '__unsafe_action__'>
  >((e) => {
    calls.push('unsafe action');
    actionEvents.push(e.data);
  });

  await render(
    <BaseNavigationContainer ref={ref}>
      <TestNavigator initialRouteName="bar">
        <Screen name="foo">{() => null}</Screen>
        <Screen
          name="bar"
          component={TestScreen}
          listeners={{
            beforeRemove: () => {
              calls.push('screen listener');
            },
          }}
        />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  ref.current?.addListener('__unsafe_event__', unsafeEventListener);
  ref.current?.addListener('__unsafe_action__', unsafeActionListener);

  await act(() => ref.current?.dispatch(StackActions.popTo('foo')));

  expect(unsafeEventListener).toHaveBeenCalledTimes(1);
  expect(unsafeActionListener).toHaveBeenCalledTimes(1);

  expect(calls).toEqual([
    'screen listener',
    'navigation listener',
    'unsafe event',
    'unsafe action',
  ]);

  expect(actionEvents).toEqual([
    expect.objectContaining({
      action: expect.objectContaining({ type: 'POP_TO' }),
      noop: true,
    }),
  ]);

  expect(ref.current?.getRootState().routes).toEqual([
    expect.objectContaining({ name: 'bar' }),
  ]);
});

test('emits option events when options change with tab router', async () => {
  const TestNavigator = (props: any) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      TabRouter,
      props
    );

    return (
      <NavigationContent>
        {state.routes.map((route) => descriptors[route.key]?.render())}
      </NavigationContent>
    );
  };

  const ref = createNavigationContainerRef<ParamListBase>();

  const element = (
    <BaseNavigationContainer ref={ref}>
      <TestNavigator>
        <Screen name="foo" options={{ x: 1 }}>
          {() => null}
        </Screen>
        <Screen name="bar" options={{ y: 2 }}>
          {() => null}
        </Screen>
        <Screen name="baz" options={{ v: 3 }}>
          {() => (
            <TestNavigator>
              <Screen name="qux" options={{ g: 5 }}>
                {() => null}
              </Screen>
              <Screen name="quxx" options={{ h: 9 }}>
                {() => null}
              </Screen>
            </TestNavigator>
          )}
        </Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  const listener =
    jest.fn<EventListenerCallback<NavigationContainerEventMap, 'options'>>();

  await render(element);
  ref.current?.addListener('options', listener);

  await act(() => {
    ref.current?.navigate('bar');
  });

  expect(listener).toHaveBeenCalledTimes(1);
  expect(listener.mock.calls[0]?.[0]?.data.options).toEqual({ y: 2 });
  expect(ref.current?.getCurrentOptions()).toEqual({ y: 2 });

  ref.current?.removeListener('options', listener);

  const listener2 =
    jest.fn<EventListenerCallback<NavigationContainerEventMap, 'options'>>();

  ref.current?.addListener('options', listener2);

  await act(() => {
    ref.current?.navigate('baz');
  });

  expect(listener2).toHaveBeenCalledTimes(1);
  expect(listener2.mock.calls[0]?.[0]?.data.options).toEqual({ g: 5 });
  expect(ref.current?.getCurrentOptions()).toEqual({ g: 5 });

  await act(() => {
    ref.current?.navigate('quxx');
  });

  expect(listener2).toHaveBeenCalledTimes(2);
  expect(listener2.mock.calls[1]?.[0]?.data.options).toEqual({ h: 9 });
  expect(ref.current?.getCurrentOptions()).toEqual({ h: 9 });
});

test('emits option events when options change with stack router', async () => {
  const TestNavigator = (props: any) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      StackRouter,
      props
    );

    return (
      <NavigationContent>
        {state.routes.map((route) => descriptors[route.key]?.render())}
      </NavigationContent>
    );
  };

  const ref = createNavigationContainerRef<ParamListBase>();

  const element = (
    <BaseNavigationContainer ref={ref}>
      <TestNavigator>
        <Screen name="foo" options={{ x: 1 }}>
          {() => null}
        </Screen>
        <Screen name="bar" options={{ y: 2 }}>
          {() => null}
        </Screen>
        <Screen name="baz" options={{ v: 3 }}>
          {() => (
            <TestNavigator>
              <Screen name="qux" options={{ g: 5 }}>
                {() => null}
              </Screen>
              <Screen name="quxx" options={{ h: 9 }}>
                {() => null}
              </Screen>
            </TestNavigator>
          )}
        </Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  const listener =
    jest.fn<EventListenerCallback<NavigationContainerEventMap, 'options'>>();

  await render(element);
  ref.current?.addListener('options', listener);

  await act(() => {
    ref.current?.navigate('bar');
  });

  expect(listener).toHaveBeenCalledTimes(1);
  expect(listener.mock.calls[0]?.[0]?.data.options).toEqual({ y: 2 });
  expect(ref.current?.getCurrentOptions()).toEqual({ y: 2 });

  ref.current?.removeListener('options', listener);

  const listener2 =
    jest.fn<EventListenerCallback<NavigationContainerEventMap, 'options'>>();

  ref.current?.addListener('options', listener2);

  await act(() => {
    ref.current?.navigate('baz');
  });

  expect(listener2).toHaveBeenCalledTimes(1);
  expect(listener2.mock.calls[0]?.[0]?.data.options).toEqual({ g: 5 });
  expect(ref.current?.getCurrentOptions()).toEqual({ g: 5 });

  await act(() => {
    ref.current?.navigate('quxx');
  });

  expect(listener2).toHaveBeenCalledTimes(2);
  expect(listener2.mock.calls[1]?.[0]?.data.options).toEqual({ h: 9 });
  expect(ref.current?.getCurrentOptions()).toEqual({ h: 9 });
});

test('throws if there is no navigator rendered', async () => {
  expect.assertions(5);

  const ref = createNavigationContainerRef<ParamListBase>();

  const element = (
    <BaseNavigationContainer ref={ref}>{null}</BaseNavigationContainer>
  );

  await render(element);

  const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

  ref.current?.dispatch({ type: 'WHATEVER' });
  ref.current?.resetRoot({ routes: [] });

  expect(spy.mock.calls[0]?.[0]).toMatch(
    "The 'navigation' object hasn't been initialized yet."
  );
  expect(spy.mock.calls[1]?.[0]).toMatch(
    "The 'navigation' object hasn't been initialized yet."
  );

  expect(ref.current?.canGoBack()).toBe(false);
  expect(ref.current?.getCurrentRoute()).toBeUndefined();
  expect(ref.current?.isFocused()).toBe(true);

  spy.mockRestore();
});

test('warns for non-serializable values in navigation state', async () => {
  const TestNavigator = (props: TestNavigatorProps) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      MockRouter,
      props
    );

    return (
      <NavigationContent>
        {state.routes.map((route) => descriptors[route.key]?.render())}
      </NavigationContent>
    );
  };

  const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});

  await render(
    <BaseNavigationContainer>
      <TestNavigator>
        <Screen name="foo" initialParams={{ callback: () => null }}>
          {() => null}
        </Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  expect(spy.mock.calls[0]?.[0]).toMatch(
    'Non-serializable values were found in the navigation state.'
  );
  expect(spy.mock.calls[0]?.[0]).toMatch('foo > params.callback');

  spy.mockRestore();
});

test('warns for unhandled go back action', async () => {
  const ref = createNavigationContainerRef<ParamListBase>();

  const TestNavigator = (props: TestNavigatorProps) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      MockRouter,
      props
    );

    return (
      <NavigationContent>
        {state.routes.map((route) => descriptors[route.key]?.render())}
      </NavigationContent>
    );
  };

  const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

  await render(
    <BaseNavigationContainer ref={ref}>
      <TestNavigator>
        <Screen name="foo">{() => null}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await act(() => ref.current?.goBack());

  expect(spy.mock.calls[0]?.[0]).toMatch(
    "The action 'GO_BACK' was not handled by any navigator."
  );
  expect(spy.mock.calls[0]?.[0]).toMatch('Is there any screen to go back to?');

  spy.mockRestore();
});

test('warns for unhandled navigate action without a screen name', async () => {
  const ref = createNavigationContainerRef<ParamListBase>();

  const TestNavigator = (props: TestNavigatorProps) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      MockRouter,
      props
    );

    return (
      <NavigationContent>
        {state.routes.map((route) => descriptors[route.key]?.render())}
      </NavigationContent>
    );
  };

  const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

  await render(
    <BaseNavigationContainer ref={ref}>
      <TestNavigator>
        <Screen name="foo">{() => null}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await act(() => ref.current?.dispatch({ type: 'NAVIGATE', payload: {} }));

  expect(spy.mock.calls[0]?.[0]).toMatch(
    "The action 'NAVIGATE' with payload {} was not handled by any navigator."
  );
  expect(spy.mock.calls[0]?.[0]).toMatch(
    'You need to pass the name of the screen to navigate to.'
  );

  spy.mockRestore();
});

test('warns for unhandled drawer actions', async () => {
  const ref = createNavigationContainerRef<ParamListBase>();

  const TestNavigator = (props: TestNavigatorProps) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      MockRouter,
      props
    );

    return (
      <NavigationContent>
        {state.routes.map((route) => descriptors[route.key]?.render())}
      </NavigationContent>
    );
  };

  const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

  await render(
    <BaseNavigationContainer ref={ref}>
      <TestNavigator>
        <Screen name="foo">{() => null}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await act(() => ref.current?.dispatch({ type: 'OPEN_DRAWER' }));

  expect(spy.mock.calls[0]?.[0]).toMatch(
    "The action 'OPEN_DRAWER' was not handled by any navigator."
  );
  expect(spy.mock.calls[0]?.[0]).toMatch(
    'Is your screen inside a Drawer navigator?'
  );

  spy.mockRestore();
});

test("throws if the ref hasn't finished initializing", async () => {
  expect.assertions(1);

  const ref = createNavigationContainerRef<ParamListBase>();

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

  const TestScreen = () => {
    React.useInsertionEffect(() => {
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

      ref.dispatch({ type: 'WHATEVER' });

      expect(spy.mock.calls[0]?.[0]).toMatch(
        "The 'navigation' object hasn't been initialized yet."
      );

      spy.mockRestore();
    }, []);

    return null;
  };

  const element = (
    <BaseNavigationContainer ref={ref}>
      <TestNavigator>
        <Screen name="foo" component={TestScreen} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await render(element);
});

test('handles action dispatched on the ref after navigator is rendered', async () => {
  function CurrentRouter(options: DefaultRouterOptions) {
    const CurrentMockRouter = MockRouter(options);
    const RootRouter: Router<
      NavigationState,
      MockActions | { type: 'REVERSE' }
    > = {
      ...CurrentMockRouter,

      getStateForAction(state, action, options) {
        if (action.type === 'REVERSE') {
          return {
            ...state,
            routes: state.routes.slice().reverse(),
          };
        }

        return CurrentMockRouter.getStateForAction(state, action, options);
      },
    };

    return RootRouter;
  }

  const ref = createNavigationContainerRef<ParamListBase>();
  const onStateChange = jest.fn();

  const TestNavigator = (props: any) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      CurrentRouter,
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

  const TestScreen = () => {
    React.useEffect(() => {
      ref.current?.dispatch({ type: 'REVERSE' });
    }, []);

    return null;
  };

  const element = (
    <BaseNavigationContainer ref={ref} onStateChange={onStateChange}>
      <TestNavigator>
        <Screen name="foo" component={TestScreen} />
        <Screen name="bar">{() => null}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await render(element);

  expect(onStateChange).toHaveBeenCalledWith({
    index: 0,
    key: '0',
    routeNames: ['foo', 'bar'],
    routes: [
      { key: 'bar', name: 'bar' },
      { key: 'foo', name: 'foo' },
    ],
    stale: false,
    type: 'test',
  });
});

test('fires onReady after navigator is rendered', async () => {
  const ref = createNavigationContainerRef<ParamListBase>();

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

  const onReady = jest.fn();

  const element = (
    <BaseNavigationContainer ref={ref} onReady={onReady}>
      {null}
    </BaseNavigationContainer>
  );

  const root = await render(element);

  expect(onReady).not.toHaveBeenCalled();
  expect(ref.current?.isReady()).toBe(false);

  await root.rerender(
    <BaseNavigationContainer ref={ref} onReady={onReady}>
      <TestNavigator>
        <Screen name="foo">{() => null}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  expect(onReady).toHaveBeenCalledTimes(1);
  expect(ref.current?.isReady()).toBe(true);
});

test('invokes the unhandled action listener with the unhandled action', async () => {
  const ref = createNavigationContainerRef<ParamListBase>();
  const fn = jest.fn();

  const TestNavigator = (props: any) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      MockRouter,
      props
    );

    return (
      <NavigationContent>
        {state.routes.map((route) => descriptors[route.key]?.render())}
      </NavigationContent>
    );
  };

  const TestScreen = () => <></>;

  await render(
    <BaseNavigationContainer ref={ref} onUnhandledAction={fn}>
      <TestNavigator>
        <Screen name="foo" component={TestScreen} />
        <Screen name="bar" component={TestScreen} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await act(() => ref.current!.navigate('bar'));
  await act(() => ref.current!.navigate('baz'));

  expect(fn).toHaveBeenCalledWith({
    payload: {
      name: 'baz',
    },
    type: 'NAVIGATE',
  });
});

test('works with state change events in independent nested container', async () => {
  const TestNavigator = (props: any) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      MockRouter,
      props
    );

    return (
      <NavigationContent>
        {state.routes.map((route) => descriptors[route.key]?.render())}
      </NavigationContent>
    );
  };

  const ref = createNavigationContainerRef<ParamListBase>();

  const onStateChange = jest.fn();

  await render(
    <BaseNavigationContainer>
      <TestNavigator>
        <Screen name="foo">
          {() => (
            <NavigationIndependentTree>
              <BaseNavigationContainer ref={ref} onStateChange={onStateChange}>
                <TestNavigator>
                  <Screen name="qux">{() => null}</Screen>
                  <Screen name="lex">{() => null}</Screen>
                </TestNavigator>
              </BaseNavigationContainer>
            </NavigationIndependentTree>
          )}
        </Screen>
        <Screen name="bar">{() => null}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await act(() => ref.current?.navigate('lex'));

  expect(onStateChange).toHaveBeenCalledWith({
    index: 1,
    key: '1',
    routeNames: ['qux', 'lex'],
    routes: [
      { key: 'qux', name: 'qux' },
      { key: 'lex', name: 'lex' },
    ],
    stale: false,
    type: 'test',
  });

  expect(ref.current?.getRootState()).toEqual({
    index: 1,
    key: '1',
    routeNames: ['qux', 'lex'],
    routes: [
      { key: 'qux', name: 'qux' },
      { key: 'lex', name: 'lex' },
    ],
    stale: false,
    type: 'test',
  });
});

test('applies updates from parent and child navigators scheduled in the same phase', async () => {
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

  const ref = createNavigationContainerRef<ParamListBase>();

  const Test = ({ expanded }: { expanded: boolean }) => (
    <BaseNavigationContainer ref={ref}>
      <TestNavigator>
        <Screen name="parent-a">
          {() => (
            <TestNavigator>
              <Screen name="child-a">{() => null}</Screen>
              {expanded ? <Screen name="child-b">{() => null}</Screen> : null}
            </TestNavigator>
          )}
        </Screen>
        {expanded ? <Screen name="parent-b">{() => null}</Screen> : null}
      </TestNavigator>
    </BaseNavigationContainer>
  );

  const root = await render(<Test expanded={false} />);

  expect(ref.current?.getRootState()).toMatchObject({
    routeNames: ['parent-a'],
    routes: [{ name: 'parent-a', state: { routeNames: ['child-a'] } }],
  });

  await root.rerender(<Test expanded={true} />);

  expect(ref.current?.getRootState()).toMatchObject({
    routeNames: ['parent-a', 'parent-b'],
    routes: [
      { name: 'parent-a', state: { routeNames: ['child-a', 'child-b'] } },
    ],
  });
});

test('warns for duplicate route names nested inside each other', async () => {
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

  const TestScreen = () => <></>;

  const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});

  await render(
    <BaseNavigationContainer>
      <TestNavigator>
        <Screen name="foo">
          {() => (
            <TestNavigator>
              <Screen name="foo" component={TestScreen} />
              <Screen name="baz" component={TestScreen} />
            </TestNavigator>
          )}
        </Screen>
        <Screen name="bar" component={TestScreen} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  expect(spy.mock.calls[0]?.[0]).toMatch(
    'Found screens with the same name nested inside one another.'
  );

  await render(
    <BaseNavigationContainer>
      <TestNavigator>
        <Screen name="qux">
          {() => (
            <TestNavigator>
              <Screen name="foo">
                {() => (
                  <TestNavigator>
                    <Screen name="foo" component={TestScreen} />
                    <Screen name="baz" component={TestScreen} />
                  </TestNavigator>
                )}
              </Screen>
              <Screen name="bar" component={TestScreen} />
            </TestNavigator>
          )}
        </Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  expect(spy.mock.calls[1]?.[0]).toMatch(
    'Found screens with the same name nested inside one another.'
  );

  await render(
    <BaseNavigationContainer>
      <TestNavigator initialRouteName="bar">
        <Screen name="foo" component={TestScreen} />
        <Screen name="bar">
          {() => (
            <TestNavigator>
              <Screen name="foo" component={TestScreen} />
              <Screen name="baz" component={TestScreen} />
            </TestNavigator>
          )}
        </Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  expect(spy).toHaveBeenCalledTimes(2);

  spy.mockRestore();
});
