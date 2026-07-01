import { beforeEach, expect, jest, test } from '@jest/globals';
import {
  CommonActions,
  type DefaultRouterOptions,
  type NavigationState,
  type ParamListBase,
  type PartialState,
  type Router,
  StackActions,
  StackRouter,
  TabRouter,
} from '@react-navigation/routers';
import { act, render } from '@testing-library/react-native';
import * as React from 'react';

import { BaseNavigationContainer } from '../BaseNavigationContainer';
import { createNavigationContainerRef } from '../createNavigationContainerRef';
import { Screen } from '../Screen';
import { useNavigationBuilder } from '../useNavigationBuilder';
import {
  type MockActions,
  MockRouter,
  MockRouterKey,
} from './__fixtures__/MockRouter';

jest.mock('nanoid/non-secure', () => {
  const m = { nanoid: () => String(++m.__key), __key: 0 };

  return m;
});

beforeEach(() => {
  MockRouterKey.current = 0;

  require('nanoid/non-secure').__key = 0;
});

test("lets parent handle the action if child didn't", async () => {
  function CurrentRouter(options: DefaultRouterOptions) {
    const CurrentMockRouter = MockRouter(options);
    const ParentRouter: Router<
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
    return ParentRouter;
  }
  const ParentNavigator = (props: any) => {
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

  const ChildNavigator = (props: any) => {
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

  const TestScreen = (props: any) => {
    React.useEffect(() => {
      props.navigation.dispatch({ type: 'REVERSE' });

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
  };

  const onStateChange = jest.fn();

  await render(
    <BaseNavigationContainer onStateChange={onStateChange}>
      <ParentNavigator initialRouteName="baz">
        <Screen name="foo">{() => null}</Screen>
        <Screen name="bar">{() => null}</Screen>
        <Screen name="baz">
          {() => (
            <ChildNavigator>
              <Screen name="qux" component={TestScreen} />
            </ChildNavigator>
          )}
        </Screen>
      </ParentNavigator>
    </BaseNavigationContainer>
  );

  expect(onStateChange).toHaveBeenCalledTimes(1);
  expect(onStateChange).toHaveBeenLastCalledWith({
    stale: false,
    type: 'test',
    index: 2,
    key: '0',
    routeNames: ['foo', 'bar', 'baz'],
    routes: [
      { key: 'baz', name: 'baz' },
      { key: 'bar', name: 'bar' },
      { key: 'foo', name: 'foo' },
    ],
  });
});

test('action goes to hidden nested navigator if target is specified', async () => {
  const ParentNavigator = (props: any) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      MockRouter,
      props
    );

    return (
      <NavigationContent>
        {state.routes.map((route, index) => (
          <React.Activity
            key={route.key}
            mode={index === state.index ? 'visible' : 'hidden'}
          >
            {descriptors[route.key]?.render()}
          </React.Activity>
        ))}
      </NavigationContent>
    );
  };

  const ChildNavigator = (props: any) => {
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

  const navigation = createNavigationContainerRef<ParamListBase>();

  await render(
    <BaseNavigationContainer ref={navigation}>
      <ParentNavigator>
        <Screen name="parent-a">
          {() => (
            <ChildNavigator>
              <Screen name="child-a">{() => null}</Screen>
              <Screen name="child-b">{() => null}</Screen>
            </ChildNavigator>
          )}
        </Screen>
        <Screen name="parent-b">{() => null}</Screen>
      </ParentNavigator>
    </BaseNavigationContainer>
  );

  const childKey = navigation.getRootState().routes[0]?.state?.key;

  await act(() => navigation.navigate('parent-b'));

  await act(() =>
    navigation.dispatch({
      ...CommonActions.navigate('child-b'),
      target: childKey,
    })
  );

  expect(navigation.getRootState()).toEqual({
    stale: false,
    type: 'test',
    index: 0,
    key: '0',
    routeNames: ['parent-a', 'parent-b'],
    routes: [
      {
        key: 'parent-a',
        name: 'parent-a',
        state: {
          stale: false,
          type: 'test',
          index: 1,
          key: '1',
          routeNames: ['child-a', 'child-b'],
          routes: [
            { key: 'child-a', name: 'child-a' },
            { key: 'child-b', name: 'child-b' },
          ],
        },
      },
      { key: 'parent-b', name: 'parent-b' },
    ],
  });
});

test('action goes to correct parent navigator if target is specified', async () => {
  function CurrentTestRouter(options: DefaultRouterOptions) {
    const CurrentMockRouter = MockRouter(options);
    const TestRouter: Router<
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
    return TestRouter;
  }

  const TestNavigator = (props: any) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      CurrentTestRouter,
      props
    );

    return (
      <NavigationContent>
        {state.routes.map((route) => descriptors[route.key]?.render())}
      </NavigationContent>
    );
  };

  const TestScreen = (props: any) => {
    React.useEffect(() => {
      props.navigation.dispatch({ type: 'REVERSE', target: '0' });
    }, [props.navigation]);

    return null;
  };

  const initialState = {
    stale: false,
    type: 'test',
    index: 1,
    key: '0',
    routeNames: ['foo', 'bar', 'baz'],
    routes: [
      {
        key: 'baz',
        name: 'baz',
        state: {
          stale: false,
          type: 'test',
          index: 0,
          key: '1',
          routeNames: ['qux', 'lex'],
          routes: [
            { key: 'lex', name: 'lex' },
            { key: 'qux', name: 'qux' },
          ],
        },
      },
      { key: 'bar', name: 'bar' },
      { key: 'foo', name: 'foo' },
    ],
  };

  const onStateChange = jest.fn();

  const element = (
    <BaseNavigationContainer
      initialState={initialState}
      onStateChange={onStateChange}
    >
      <TestNavigator>
        <Screen name="foo">{() => null}</Screen>
        <Screen name="bar">{() => null}</Screen>
        <Screen name="baz">
          {() => (
            <TestNavigator>
              <Screen name="qux">{() => null}</Screen>
              <Screen name="lex" component={TestScreen} />
            </TestNavigator>
          )}
        </Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await render(element);

  expect(onStateChange).toHaveBeenCalledTimes(1);
  expect(onStateChange).toHaveBeenCalledWith({
    stale: false,
    type: 'test',
    index: 1,
    key: '0',
    routeNames: ['foo', 'bar', 'baz'],
    routes: [
      { key: 'foo', name: 'foo' },
      { key: 'bar', name: 'bar' },
      {
        key: 'baz',
        name: 'baz',
        state: {
          stale: false,
          type: 'test',
          index: 0,
          key: '1',
          routeNames: ['qux', 'lex'],
          routes: [
            { key: 'lex', name: 'lex' },
            { key: 'qux', name: 'qux' },
          ],
        },
      },
    ],
  });
});

test('action goes to correct child navigator if target is specified', async () => {
  function CurrentTestRouter(options: DefaultRouterOptions) {
    const CurrentMockRouter = MockRouter(options);
    const TestRouter: Router<
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
    return TestRouter;
  }

  const TestNavigator = (props: any) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      CurrentTestRouter,
      props
    );

    return (
      <NavigationContent>
        {state.routes.map((route) => descriptors[route.key]?.render())}
      </NavigationContent>
    );
  };

  const initialState = {
    stale: false,
    type: 'test',
    index: 0,
    key: '0',
    routeNames: ['foo', 'bar', 'baz'],
    routes: [
      { key: 'foo', name: 'foo' },
      { key: 'bar', name: 'bar' },
      {
        key: 'baz',
        name: 'baz',
        state: {
          stale: false,
          type: 'test',
          index: 0,
          key: '1',
          routeNames: ['qux', 'lex'],
          routes: [
            { key: 'qux', name: 'qux' },
            { key: 'lex', name: 'lex' },
          ],
        },
      },
    ],
  };

  const onStateChange = jest.fn();

  const ref = createNavigationContainerRef<ParamListBase>();

  const element = (
    <BaseNavigationContainer
      ref={ref}
      initialState={initialState}
      onStateChange={onStateChange}
    >
      <TestNavigator>
        <Screen name="foo">{() => null}</Screen>
        <Screen name="bar">{() => null}</Screen>
        <Screen name="baz">
          {() => (
            <TestNavigator>
              <Screen name="qux">{() => null}</Screen>
              <Screen name="lex">{() => null}</Screen>
            </TestNavigator>
          )}
        </Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await render(element);

  await act(() => {
    ref.dispatch({ type: 'REVERSE', target: '1' });
  });

  expect(onStateChange).toHaveBeenCalledTimes(1);
  expect(onStateChange).toHaveBeenCalledWith({
    stale: false,
    type: 'test',
    index: 2,
    key: '0',
    routeNames: ['foo', 'bar', 'baz'],
    routes: [
      { key: 'foo', name: 'foo' },
      { key: 'bar', name: 'bar' },
      {
        key: 'baz',
        name: 'baz',
        state: {
          stale: false,
          type: 'test',
          index: 0,
          key: '1',
          routeNames: ['qux', 'lex'],
          routes: [
            { key: 'lex', name: 'lex' },
            { key: 'qux', name: 'qux' },
          ],
        },
      },
    ],
  });
});

test("action doesn't bubble if target is specified", async () => {
  const CurrentParentRouter = MockRouter;

  function CurrentChildRouter(options: DefaultRouterOptions) {
    const CurrentMockRouter = MockRouter(options);
    const ChildRouter: Router<
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
    return ChildRouter;
  }

  const ChildNavigator = (props: any) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      CurrentChildRouter,
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

  const ParentNavigator = (props: any) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      CurrentParentRouter,
      props
    );

    return (
      <NavigationContent>
        {state.routes.map((route) => descriptors[route.key]?.render())}
      </NavigationContent>
    );
  };

  const TestScreen = (props: any) => {
    React.useEffect(() => {
      props.navigation.dispatch({ type: 'REVERSE', target: '0' });

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
  };

  const onStateChange = jest.fn();

  const element = (
    <BaseNavigationContainer onStateChange={onStateChange}>
      <ParentNavigator>
        <Screen name="foo">{() => null}</Screen>
        <Screen name="bar" component={TestScreen} />
        <Screen name="baz">
          {() => (
            <ChildNavigator>
              <Screen name="qux">{() => null}</Screen>
              <Screen name="lex">{() => null}</Screen>
            </ChildNavigator>
          )}
        </Screen>
      </ParentNavigator>
    </BaseNavigationContainer>
  );

  await render(element);

  expect(onStateChange).not.toHaveBeenCalled();
});

test('logs error if no navigator handled the action', async () => {
  const TestRouter = MockRouter;

  const TestNavigator = (props: any) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      TestRouter,
      props
    );

    return (
      <NavigationContent>
        {state.routes.map((route) => descriptors[route.key]?.render())}
      </NavigationContent>
    );
  };

  const TestScreen = (props: any) => {
    React.useEffect(() => {
      props.navigation.dispatch({ type: 'UNKNOWN' });

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
  };

  const initialState = {
    index: 1,
    routes: [
      {
        key: 'baz',
        name: 'baz',
        state: {
          index: 0,
          key: '4',
          routeNames: ['qux', 'lex'],
          routes: [
            { key: 'qux', name: 'qux' },
            { key: 'lex', name: 'lex' },
          ],
        },
      },
      { key: 'bar', name: 'bar' },
    ],
  };

  const element = (
    <BaseNavigationContainer initialState={initialState}>
      <TestNavigator>
        <Screen name="foo">{() => null}</Screen>
        <Screen name="bar" component={TestScreen} />
        <Screen name="baz">
          {() => (
            <TestNavigator>
              <Screen name="qux">{() => null}</Screen>
              <Screen name="lex">{() => null}</Screen>
            </TestNavigator>
          )}
        </Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

  await render(element);

  expect(spy).toHaveBeenCalledTimes(1);
  expect(spy).toHaveBeenCalledWith(
    expect.stringContaining(
      "The action 'UNKNOWN' was not handled by any navigator."
    )
  );

  spy.mockRestore();
});

test("emits 'beforeRemove' when removing a screen", async () => {
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

  const onBeforeRemove = jest.fn();

  let shouldPrevent = true;
  let shouldContinue = false;

  const TestScreen = (props: any) => {
    React.useEffect(
      () =>
        props.navigation.addListener('beforeRemove', (e: any) => {
          onBeforeRemove();

          if (shouldPrevent) {
            e.preventDefault();

            if (shouldContinue) {
              props.navigation.dispatch(e.data.action);
            }
          }
        }),
      [props.navigation]
    );

    return null;
  };

  const onStateChange = jest.fn();

  const ref = createNavigationContainerRef<ParamListBase>();

  const element = (
    <BaseNavigationContainer ref={ref} onStateChange={onStateChange}>
      <TestNavigator>
        <Screen name="foo">{() => null}</Screen>
        <Screen name="bar" component={TestScreen} />
        <Screen name="baz">{() => null}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await render(element);

  await act(() => ref.current?.navigate('bar'));

  expect(onStateChange).toHaveBeenCalledTimes(1);
  expect(onStateChange).toHaveBeenCalledWith({
    index: 1,
    key: 'stack-2',
    retainedRouteKeys: [],
    routeNames: ['foo', 'bar', 'baz'],
    routes: [
      { key: 'foo-3', name: 'foo' },
      { key: 'bar-5', name: 'bar' },
    ],
    stale: false,
    type: 'stack',
  });

  await act(() => ref.current?.navigate('baz'));

  expect(onStateChange).toHaveBeenCalledTimes(2);
  expect(onStateChange).toHaveBeenCalledWith({
    index: 2,
    key: 'stack-2',
    retainedRouteKeys: [],
    routeNames: ['foo', 'bar', 'baz'],
    routes: [
      { key: 'foo-3', name: 'foo' },
      { key: 'bar-5', name: 'bar' },
      {
        key: 'baz-6',
        name: 'baz',
      },
    ],
    stale: false,
    type: 'stack',
  });

  await act(() => ref.current?.dispatch(StackActions.popTo('foo')));

  expect(onStateChange).toHaveBeenCalledTimes(2);
  expect(onBeforeRemove).toHaveBeenCalledTimes(1);

  expect(ref.current?.getRootState()).toEqual({
    index: 2,
    key: 'stack-2',
    retainedRouteKeys: [],
    routeNames: ['foo', 'bar', 'baz'],
    routes: [
      { key: 'foo-3', name: 'foo' },
      { key: 'bar-5', name: 'bar' },
      { key: 'baz-6', name: 'baz' },
    ],
    stale: false,
    type: 'stack',
  });

  shouldPrevent = false;

  await act(() => ref.current?.dispatch(StackActions.popTo('foo')));

  expect(onStateChange).toHaveBeenCalledTimes(3);
  expect(onStateChange).toHaveBeenCalledWith({
    index: 0,
    key: 'stack-2',
    retainedRouteKeys: [],
    routeNames: ['foo', 'bar', 'baz'],
    routes: [{ key: 'foo-3', name: 'foo' }],
    stale: false,
    type: 'stack',
  });

  shouldPrevent = true;
  shouldContinue = true;

  await act(() => ref.current?.navigate('bar'));
  await act(() => ref.current?.navigate('foo'));

  expect(onStateChange).toHaveBeenCalledTimes(5);
  expect(onStateChange).toHaveBeenCalledWith({
    index: 0,
    key: 'stack-2',
    retainedRouteKeys: [],
    routeNames: ['foo', 'bar', 'baz'],
    routes: [{ key: 'foo-3', name: 'foo' }],
    stale: false,
    type: 'stack',
  });
});

test("emits 'beforeRemove' when removing a child screen", async () => {
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

  const onBeforeRemove = jest.fn();

  let shouldPrevent = true;
  let shouldContinue = false;

  const TestScreen = (props: any) => {
    React.useEffect(
      () =>
        props.navigation.addListener('beforeRemove', (e: any) => {
          onBeforeRemove();

          if (shouldPrevent) {
            e.preventDefault();

            if (shouldContinue) {
              props.navigation.dispatch(e.data.action);
            }
          }
        }),
      [props.navigation]
    );

    return null;
  };

  const onStateChange = jest.fn();

  const ref = createNavigationContainerRef<ParamListBase>();

  const element = (
    <BaseNavigationContainer ref={ref} onStateChange={onStateChange}>
      <TestNavigator>
        <Screen name="foo">{() => null}</Screen>
        <Screen name="bar">{() => null}</Screen>
        <Screen name="baz">
          {() => (
            <TestNavigator>
              <Screen name="qux" component={TestScreen} />
              <Screen name="lex">{() => null}</Screen>
            </TestNavigator>
          )}
        </Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await render(element);

  await act(() => ref.current?.navigate('bar'));

  expect(onStateChange).toHaveBeenCalledTimes(1);
  expect(onStateChange).toHaveBeenCalledWith({
    index: 1,
    key: 'stack-2',
    retainedRouteKeys: [],
    routeNames: ['foo', 'bar', 'baz'],
    routes: [
      { key: 'foo-3', name: 'foo' },
      { key: 'bar-5', name: 'bar' },
    ],
    stale: false,
    type: 'stack',
  });

  await act(() => ref.current?.navigate('baz'));

  expect(onStateChange).toHaveBeenCalledTimes(2);
  expect(onStateChange).toHaveBeenCalledWith({
    index: 2,
    key: 'stack-2',
    retainedRouteKeys: [],
    routeNames: ['foo', 'bar', 'baz'],
    routes: [
      { key: 'foo-3', name: 'foo' },
      { key: 'bar-5', name: 'bar' },
      {
        key: 'baz-6',
        name: 'baz',
        state: {
          index: 0,
          key: 'stack-8',
          retainedRouteKeys: [],
          routeNames: ['qux', 'lex'],
          routes: [{ key: 'qux-9', name: 'qux' }],
          stale: false,
          type: 'stack',
        },
      },
    ],
    stale: false,
    type: 'stack',
  });

  await act(() => ref.current?.dispatch(StackActions.popTo('foo')));

  expect(onStateChange).toHaveBeenCalledTimes(2);
  expect(onBeforeRemove).toHaveBeenCalledTimes(1);

  expect(ref.current?.getRootState()).toEqual({
    index: 2,
    key: 'stack-2',
    retainedRouteKeys: [],
    routeNames: ['foo', 'bar', 'baz'],
    routes: [
      { key: 'foo-3', name: 'foo' },
      { key: 'bar-5', name: 'bar' },
      {
        key: 'baz-6',
        name: 'baz',
        state: {
          index: 0,
          key: 'stack-8',
          retainedRouteKeys: [],
          routeNames: ['qux', 'lex'],
          routes: [{ key: 'qux-9', name: 'qux' }],
          stale: false,
          type: 'stack',
        },
      },
    ],
    stale: false,
    type: 'stack',
  });

  shouldPrevent = false;

  await act(() => ref.current?.dispatch(StackActions.popTo('foo')));

  expect(onStateChange).toHaveBeenCalledTimes(3);
  expect(onStateChange).toHaveBeenCalledWith({
    index: 0,
    key: 'stack-2',
    retainedRouteKeys: [],
    routeNames: ['foo', 'bar', 'baz'],
    routes: [{ key: 'foo-3', name: 'foo' }],
    stale: false,
    type: 'stack',
  });

  shouldPrevent = true;
  shouldContinue = true;

  await act(() => ref.current?.navigate('bar'));
  await act(() => ref.current?.navigate('foo'));

  expect(onStateChange).toHaveBeenCalledTimes(5);
  expect(onStateChange).toHaveBeenCalledWith({
    index: 0,
    key: 'stack-2',
    retainedRouteKeys: [],
    routeNames: ['foo', 'bar', 'baz'],
    routes: [{ key: 'foo-3', name: 'foo' }],
    stale: false,
    type: 'stack',
  });
});

test("emits 'beforeRemove' when removing a grand child screen", async () => {
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

  const onBeforeRemove = jest.fn();

  let shouldPrevent = true;
  let shouldContinue = false;

  const TestScreen = (props: any) => {
    React.useEffect(
      () =>
        props.navigation.addListener('beforeRemove', (e: any) => {
          onBeforeRemove();

          if (shouldPrevent) {
            e.preventDefault();

            if (shouldContinue) {
              props.navigation.dispatch(e.data.action);
            }
          }
        }),
      [props.navigation]
    );

    return null;
  };

  const onStateChange = jest.fn();

  const ref = createNavigationContainerRef<ParamListBase>();

  const element = (
    <BaseNavigationContainer ref={ref} onStateChange={onStateChange}>
      <TestNavigator>
        <Screen name="foo">{() => null}</Screen>
        <Screen name="bar">{() => null}</Screen>
        <Screen name="baz">
          {() => (
            <TestNavigator>
              <Screen name="qux">
                {() => (
                  <TestNavigator>
                    <Screen name="lex" component={TestScreen} />
                  </TestNavigator>
                )}
              </Screen>
            </TestNavigator>
          )}
        </Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await render(element);

  await act(() => ref.current?.navigate('bar'));

  expect(onStateChange).toHaveBeenCalledTimes(1);
  expect(onStateChange).toHaveBeenCalledWith({
    index: 1,
    key: 'stack-2',
    retainedRouteKeys: [],
    routeNames: ['foo', 'bar', 'baz'],
    routes: [
      { key: 'foo-3', name: 'foo' },
      { key: 'bar-5', name: 'bar' },
    ],
    stale: false,
    type: 'stack',
  });

  await act(() => ref.current?.navigate('baz'));

  expect(onStateChange).toHaveBeenCalledTimes(2);
  expect(onStateChange).toHaveBeenCalledWith({
    index: 2,
    key: 'stack-2',
    retainedRouteKeys: [],
    routeNames: ['foo', 'bar', 'baz'],
    routes: [
      { key: 'foo-3', name: 'foo' },
      { key: 'bar-5', name: 'bar' },
      {
        key: 'baz-6',
        name: 'baz',
        state: {
          index: 0,
          key: 'stack-8',
          retainedRouteKeys: [],
          routeNames: ['qux'],
          routes: [
            {
              key: 'qux-9',
              name: 'qux',
              state: {
                index: 0,
                key: 'stack-12',
                retainedRouteKeys: [],
                routeNames: ['lex'],
                routes: [{ key: 'lex-13', name: 'lex' }],
                stale: false,
                type: 'stack',
              },
            },
          ],
          stale: false,
          type: 'stack',
        },
      },
    ],
    stale: false,
    type: 'stack',
  });

  await act(() => ref.current?.dispatch(StackActions.popTo('foo')));

  expect(onStateChange).toHaveBeenCalledTimes(2);
  expect(onBeforeRemove).toHaveBeenCalledTimes(1);

  expect(ref.current?.getRootState()).toEqual({
    index: 2,
    key: 'stack-2',
    retainedRouteKeys: [],
    routeNames: ['foo', 'bar', 'baz'],
    routes: [
      { key: 'foo-3', name: 'foo' },
      { key: 'bar-5', name: 'bar' },
      {
        key: 'baz-6',
        name: 'baz',
        state: {
          index: 0,
          key: 'stack-8',
          retainedRouteKeys: [],
          routeNames: ['qux'],
          routes: [
            {
              key: 'qux-9',
              name: 'qux',
              state: {
                index: 0,
                key: 'stack-12',
                retainedRouteKeys: [],
                routeNames: ['lex'],
                routes: [{ key: 'lex-13', name: 'lex' }],
                stale: false,
                type: 'stack',
              },
            },
          ],
          stale: false,
          type: 'stack',
        },
      },
    ],
    stale: false,
    type: 'stack',
  });

  shouldPrevent = false;

  await act(() => ref.current?.dispatch(StackActions.popTo('foo')));

  expect(onStateChange).toHaveBeenCalledTimes(3);
  expect(onStateChange).toHaveBeenCalledWith({
    index: 0,
    key: 'stack-2',
    retainedRouteKeys: [],
    routeNames: ['foo', 'bar', 'baz'],
    routes: [{ key: 'foo-3', name: 'foo' }],
    stale: false,
    type: 'stack',
  });

  shouldPrevent = true;
  shouldContinue = true;

  await act(() => ref.current?.navigate('bar'));
  await act(() => ref.current?.navigate('foo'));

  expect(onStateChange).toHaveBeenCalledTimes(5);
  expect(onStateChange).toHaveBeenCalledWith({
    index: 0,
    key: 'stack-2',
    retainedRouteKeys: [],
    routeNames: ['foo', 'bar', 'baz'],
    routes: [{ key: 'foo-3', name: 'foo' }],
    stale: false,
    type: 'stack',
  });
});

test("emits 'beforeRemove' for multiple removed screens in reverse order", async () => {
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

  const onBeforeRemove = {
    bar: jest.fn(),
    baz: jest.fn(),
    lex: jest.fn(),
  };

  const shouldPrevent = {
    bar: true,
    baz: true,
    lex: true,
  };

  const TestScreen = (props: any) => {
    React.useEffect(
      () =>
        props.navigation.addListener('beforeRemove', (e: any) => {
          // @ts-expect-error: we should have the required mocks
          onBeforeRemove[props.route.name]();
          e.preventDefault();

          // @ts-expect-error: we should have the required properties
          if (!shouldPrevent[props.route.name]) {
            props.navigation.dispatch(e.data.action);
          }
        }),
      [props.navigation, props.route.name]
    );

    return null;
  };

  const onStateChange = jest.fn();

  const ref = createNavigationContainerRef<ParamListBase>();

  const element = (
    <BaseNavigationContainer ref={ref} onStateChange={onStateChange}>
      <TestNavigator>
        <Screen name="foo">{() => null}</Screen>
        <Screen name="bar" component={TestScreen} />
        <Screen name="baz" component={TestScreen} />
        <Screen name="bax">
          {() => (
            <TestNavigator>
              <Screen name="qux">
                {() => (
                  <TestNavigator>
                    <Screen name="lex" component={TestScreen} />
                  </TestNavigator>
                )}
              </Screen>
            </TestNavigator>
          )}
        </Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await render(element);

  await act(() => {
    ref.current?.navigate('bar');
    ref.current?.navigate('baz');
    ref.current?.navigate('bax');
  });

  const preventedState = {
    index: 3,
    key: 'stack-2',
    retainedRouteKeys: [],
    routeNames: ['foo', 'bar', 'baz', 'bax'],
    routes: [
      { key: 'foo-3', name: 'foo' },
      { key: 'bar-5', name: 'bar' },
      { key: 'baz-6', name: 'baz' },
      {
        key: 'bax-7',
        name: 'bax',
        state: {
          index: 0,
          key: 'stack-9',
          retainedRouteKeys: [],
          routeNames: ['qux'],
          routes: [
            {
              key: 'qux-10',
              name: 'qux',
              state: {
                index: 0,
                key: 'stack-13',
                retainedRouteKeys: [],
                routeNames: ['lex'],
                routes: [{ key: 'lex-14', name: 'lex' }],
                stale: false,
                type: 'stack',
              },
            },
          ],
          stale: false,
          type: 'stack',
        },
      },
    ],
    stale: false,
    type: 'stack',
  };

  expect(onStateChange).toHaveBeenCalledTimes(1);
  expect(onStateChange).toHaveBeenCalledWith(preventedState);

  await act(() => ref.current?.dispatch(StackActions.popTo('foo')));

  expect(onStateChange).toHaveBeenCalledTimes(1);
  expect(onBeforeRemove.lex).toHaveBeenCalledTimes(1);

  expect(ref.current?.getRootState()).toEqual(preventedState);

  shouldPrevent.lex = false;

  await act(() => ref.current?.dispatch(StackActions.popTo('foo')));

  expect(onStateChange).toHaveBeenCalledTimes(1);
  expect(onBeforeRemove.baz).toHaveBeenCalledTimes(1);

  expect(ref.current?.getRootState()).toEqual(preventedState);

  shouldPrevent.baz = false;

  await act(() => ref.current?.dispatch(StackActions.popTo('foo')));

  expect(onStateChange).toHaveBeenCalledTimes(1);
  expect(onBeforeRemove.bar).toHaveBeenCalledTimes(1);

  expect(ref.current?.getRootState()).toEqual(preventedState);

  shouldPrevent.bar = false;

  await act(() => ref.current?.dispatch(StackActions.popTo('foo')));

  expect(onStateChange).toHaveBeenCalledTimes(2);
  expect(onStateChange).toHaveBeenCalledWith({
    index: 0,
    key: 'stack-2',
    retainedRouteKeys: [],
    routeNames: ['foo', 'bar', 'baz', 'bax'],
    routes: [{ key: 'foo-3', name: 'foo' }],
    stale: false,
    type: 'stack',
  });
});

test("emits 'beforeRemove' when resetRoot removes a child screen", async () => {
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

  const onBeforeRemove = jest.fn();

  let shouldPrevent = true;

  const shouldContinue = false;

  const TestScreen = (props: any) => {
    React.useEffect(
      () =>
        props.navigation.addListener('beforeRemove', (e: any) => {
          onBeforeRemove();

          if (shouldPrevent) {
            e.preventDefault();

            if (shouldContinue) {
              props.navigation.dispatch(e.data.action);
            }
          }
        }),
      [props.navigation]
    );

    return null;
  };

  const onStateChange = jest.fn();

  const ref = createNavigationContainerRef<ParamListBase>();

  const element = (
    <BaseNavigationContainer ref={ref} onStateChange={onStateChange}>
      <TestNavigator>
        <Screen name="foo">{() => null}</Screen>
        <Screen name="bar">{() => null}</Screen>
        <Screen name="baz">
          {() => (
            <TestNavigator>
              <Screen name="qux" component={TestScreen} />
              <Screen name="lex">{() => null}</Screen>
            </TestNavigator>
          )}
        </Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await render(element);

  await act(() => ref.current?.navigate('baz'));

  expect(onStateChange).toHaveBeenCalledTimes(1);
  expect(onStateChange).toHaveBeenCalledWith({
    index: 1,
    key: 'stack-2',
    retainedRouteKeys: [],
    routeNames: ['foo', 'bar', 'baz'],
    routes: [
      { key: 'foo-3', name: 'foo' },
      {
        key: 'baz-5',
        name: 'baz',
        state: {
          index: 0,
          key: 'stack-7',
          retainedRouteKeys: [],
          routeNames: ['qux', 'lex'],
          routes: [{ key: 'qux-8', name: 'qux' }],
          stale: false,
          type: 'stack',
        },
      },
    ],
    stale: false,
    type: 'stack',
  });

  await act(() => {
    const state = {
      index: 0,
      key: 'stack-2',
      routeNames: ['foo', 'bar', 'baz'],
      routes: [{ key: 'foo-3', name: 'foo' }],
      retainedRouteKeys: [],
      stale: false,
      type: 'stack',
    };

    ref.current?.resetRoot(state);
  });

  expect(onStateChange).toHaveBeenCalledTimes(1);
  expect(onBeforeRemove).toHaveBeenCalledTimes(1);

  expect(ref.current?.getRootState()).toEqual({
    index: 1,
    key: 'stack-2',
    retainedRouteKeys: [],
    routeNames: ['foo', 'bar', 'baz'],
    routes: [
      { key: 'foo-3', name: 'foo' },
      {
        key: 'baz-5',
        name: 'baz',
        state: {
          index: 0,
          key: 'stack-7',
          retainedRouteKeys: [],
          routeNames: ['qux', 'lex'],
          routes: [{ key: 'qux-8', name: 'qux' }],
          stale: false,
          type: 'stack',
        },
      },
    ],
    stale: false,
    type: 'stack',
  });

  shouldPrevent = false;

  await act(() => {
    const state = {
      index: 0,
      key: 'stack-2',
      routeNames: ['foo', 'bar', 'baz'],
      routes: [{ key: 'foo-3', name: 'foo' }],
      retainedRouteKeys: [],
      stale: false,
      type: 'stack',
    };

    ref.current?.resetRoot(state);
  });

  expect(onStateChange).toHaveBeenCalledTimes(2);
  expect(onStateChange).toHaveBeenCalledWith({
    index: 0,
    key: 'stack-2',
    routeNames: ['foo', 'bar', 'baz'],
    routes: [{ key: 'foo-3', name: 'foo' }],
    retainedRouteKeys: [],
    stale: false,
    type: 'stack',
  });
});

test.each(['reset action', 'resetRoot'])(
  "emits 'beforeRemove' for removed and updated routes in reverse order from %s",
  async (action) => {
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

    const calls: string[] = [];

    const TestScreen = (props: any) => {
      React.useEffect(
        () =>
          props.navigation.addListener('beforeRemove', () => {
            calls.push(props.route.name);
          }),
        [props.navigation, props.route.name]
      );

      return null;
    };

    const ref = createNavigationContainerRef<ParamListBase>();

    await render(
      <BaseNavigationContainer
        ref={ref}
        initialState={{
          index: 2,
          routes: [
            { name: 'foo' },
            { name: 'bar' },
            {
              name: 'baz',
              state: { index: 1, routes: [{ name: 'qux' }, { name: 'lex' }] },
            },
          ],
        }}
      >
        <TestNavigator>
          <Screen name="foo">{() => null}</Screen>
          <Screen name="bar" component={TestScreen} />
          <Screen name="baz">
            {() => (
              <TestNavigator>
                <Screen name="qux">{() => null}</Screen>
                <Screen name="lex" component={TestScreen} />
              </TestNavigator>
            )}
          </Screen>
        </TestNavigator>
      </BaseNavigationContainer>
    );

    const state = ref.current?.getRootState();

    if (state == null) {
      throw new Error('Expected navigation state to be available.');
    }

    const nextState = {
      ...state,
      index: 1,
      routes: state.routes
        .filter((route) => route.name !== 'bar')
        .map((route) =>
          route.name === 'baz'
            ? {
                ...route,
                state:
                  route.state && route.state.stale === false
                    ? {
                        ...route.state,
                        index: 0,
                        routes: route.state.routes.filter(
                          (r) => r.name !== 'lex'
                        ),
                      }
                    : undefined,
              }
            : route
        ),
    };

    await act(() =>
      action === 'reset action'
        ? ref.current?.dispatch(CommonActions.reset(nextState))
        : ref.current?.resetRoot(nextState)
    );

    expect(calls).toEqual(['lex', 'bar']);

    expect(ref.current?.getRootState()).toEqual(nextState);
  }
);

test.each(['reset action', 'resetRoot'])(
  "emits 'beforeRemove' for a nested route removed by %s when parent route key is the same",
  async (action) => {
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

    const onBeforeRemove = jest.fn();
    let shouldPrevent = true;

    const TestScreen = (props: any) => {
      React.useEffect(
        () =>
          props.navigation.addListener('beforeRemove', (e: any) => {
            onBeforeRemove();

            if (shouldPrevent) {
              e.preventDefault();
            }
          }),
        [props.navigation]
      );

      return null;
    };

    const ref = createNavigationContainerRef<ParamListBase>();

    await render(
      <BaseNavigationContainer
        ref={ref}
        initialState={{
          index: 1,
          routes: [
            { name: 'foo' },
            {
              name: 'baz',
              state: { index: 1, routes: [{ name: 'qux' }, { name: 'lex' }] },
            },
          ],
        }}
      >
        <TestNavigator>
          <Screen name="foo">{() => null}</Screen>
          <Screen name="baz">
            {() => (
              <TestNavigator>
                <Screen name="qux">{() => null}</Screen>
                <Screen name="lex" component={TestScreen} />
              </TestNavigator>
            )}
          </Screen>
        </TestNavigator>
      </BaseNavigationContainer>
    );

    const state = ref.current?.getRootState();

    if (state == null) {
      throw new Error('Expected navigation state to be available.');
    }

    const nextState: NavigationState = {
      ...state,
      routes: state.routes.map((route) =>
        route.name === 'baz'
          ? {
              ...route,
              state:
                route.state && route.state.stale === false
                  ? {
                      ...route.state,
                      index: 0,
                      routes: route.state.routes.filter(
                        (r) => r.name !== 'lex'
                      ),
                    }
                  : undefined,
            }
          : route
      ),
    };

    await act(() =>
      action === 'reset action'
        ? ref.current?.dispatch(CommonActions.reset(nextState))
        : ref.current?.resetRoot(nextState)
    );

    expect(onBeforeRemove).toHaveBeenCalledTimes(1);

    expect(ref.current?.getRootState()).toEqual(state);

    shouldPrevent = false;

    await act(() =>
      action === 'reset action'
        ? ref.current?.dispatch(CommonActions.reset(nextState))
        : ref.current?.resetRoot(nextState)
    );

    expect(onBeforeRemove).toHaveBeenCalledTimes(2);

    expect(ref.current?.getRootState()).toEqual(nextState);
  }
);

test.each(['reset action', 'resetRoot'])(
  "doesn't emit 'beforeRemove' when %s keeps the nested screen",
  async (action) => {
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

    const onBeforeRemove = jest.fn();

    const TestScreen = (props: any) => {
      React.useEffect(
        () =>
          props.navigation.addListener('beforeRemove', (e: any) => {
            onBeforeRemove();
            e.preventDefault();
          }),
        [props.navigation]
      );

      return null;
    };

    const ref = createNavigationContainerRef<ParamListBase>();

    await render(
      <BaseNavigationContainer
        ref={ref}
        initialState={{
          index: 1,
          routes: [
            { name: 'foo' },
            {
              name: 'baz',
              state: { index: 1, routes: [{ name: 'qux' }, { name: 'lex' }] },
            },
          ],
        }}
      >
        <TestNavigator>
          <Screen name="foo">{() => null}</Screen>
          <Screen name="baz">
            {() => (
              <TestNavigator>
                <Screen name="qux" component={TestScreen} />
                <Screen name="lex">{() => null}</Screen>
              </TestNavigator>
            )}
          </Screen>
        </TestNavigator>
      </BaseNavigationContainer>
    );

    const state = ref.current?.getRootState();

    if (state == null) {
      throw new Error('Expected navigation state to be available.');
    }

    const nextState: NavigationState = {
      ...state,
      routes: state.routes.map((route) =>
        route.name === 'baz'
          ? {
              ...route,
              state:
                route.state && route.state.stale === false
                  ? {
                      ...route.state,
                      index: 0,
                      routes: route.state.routes.filter(
                        (r) => r.name !== 'lex'
                      ),
                    }
                  : undefined,
            }
          : route
      ),
    };

    await act(() =>
      action === 'reset action'
        ? ref.current?.dispatch(CommonActions.reset(nextState))
        : ref.current?.resetRoot(nextState)
    );

    expect(onBeforeRemove).not.toHaveBeenCalled();

    expect(ref.current?.getRootState()).toEqual(nextState);
  }
);

test.each(['reset action', 'resetRoot'])(
  "doesn't emit 'beforeRemove' when %s changes nested index without removing the route",
  async (action) => {
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

    const TestTabNavigator = (props: any) => {
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

    const onBeforeRemove = jest.fn();

    const TestScreen = (props: any) => {
      React.useEffect(
        () =>
          props.navigation.addListener('beforeRemove', (e: any) => {
            onBeforeRemove();
            e.preventDefault();
          }),
        [props.navigation]
      );

      return null;
    };

    const ref = createNavigationContainerRef<ParamListBase>();

    await render(
      <BaseNavigationContainer
        ref={ref}
        initialState={{
          index: 1,
          routes: [
            { name: 'foo' },
            {
              name: 'baz',
              state: { index: 0, routes: [{ name: 'tabA' }, { name: 'tabB' }] },
            },
          ],
        }}
      >
        <TestNavigator>
          <Screen name="foo">{() => null}</Screen>
          <Screen name="baz">
            {() => (
              <TestTabNavigator>
                <Screen name="tabA" component={TestScreen} />
                <Screen name="tabB">{() => null}</Screen>
              </TestTabNavigator>
            )}
          </Screen>
        </TestNavigator>
      </BaseNavigationContainer>
    );

    const nextState = ref.current?.getRootState();

    if (nextState == null) {
      throw new Error('Expected navigation state to be available.');
    }

    await act(() => ref.current?.navigate('tabB'));

    await act(() =>
      action === 'reset action'
        ? ref.current?.dispatch(CommonActions.reset(nextState))
        : ref.current?.resetRoot(nextState)
    );

    expect(onBeforeRemove).not.toHaveBeenCalled();

    expect(ref.current?.getRootState()).toEqual(nextState);
  }
);

test.each(['reset action', 'resetRoot'])(
  "emits 'beforeRemove' for a deeply nested route removed from nested state by %s",
  async (action) => {
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

    const onBeforeRemove = jest.fn();

    const TestScreen = (props: any) => {
      React.useEffect(
        () =>
          props.navigation.addListener('beforeRemove', (e: any) => {
            onBeforeRemove();
            e.preventDefault();
          }),
        [props.navigation]
      );

      return null;
    };

    const ref = createNavigationContainerRef<ParamListBase>();

    await render(
      <BaseNavigationContainer
        ref={ref}
        initialState={{
          index: 1,
          routes: [
            { name: 'foo' },
            {
              name: 'baz',
              state: {
                index: 0,
                routes: [
                  {
                    name: 'qux',
                    state: {
                      index: 1,
                      routes: [{ name: 'lex' }, { name: 'pax' }],
                    },
                  },
                ],
              },
            },
          ],
        }}
      >
        <TestNavigator>
          <Screen name="foo">{() => null}</Screen>
          <Screen name="baz">
            {() => (
              <TestNavigator>
                <Screen name="qux">
                  {() => (
                    <TestNavigator>
                      <Screen name="lex">{() => null}</Screen>
                      <Screen name="pax" component={TestScreen} />
                    </TestNavigator>
                  )}
                </Screen>
              </TestNavigator>
            )}
          </Screen>
        </TestNavigator>
      </BaseNavigationContainer>
    );

    const state = ref.current?.getRootState();

    if (state == null) {
      throw new Error('Expected navigation state to be available.');
    }

    const nextState: NavigationState = {
      ...state,
      routes: state.routes.map((route) =>
        route.name === 'baz'
          ? {
              ...route,
              state:
                route.state && route.state.stale === false
                  ? {
                      ...route.state,
                      routes: route.state.routes.map((r) =>
                        r.name === 'qux'
                          ? {
                              ...r,
                              state:
                                r.state && r.state.stale === false
                                  ? {
                                      ...r.state,
                                      index: 0,
                                      routes: r.state.routes.filter(
                                        (child) => child.name !== 'pax'
                                      ),
                                    }
                                  : undefined,
                            }
                          : r
                      ),
                    }
                  : undefined,
            }
          : route
      ),
    };

    await act(() =>
      action === 'reset action'
        ? ref.current?.dispatch(CommonActions.reset(nextState))
        : ref.current?.resetRoot(nextState)
    );

    expect(onBeforeRemove).toHaveBeenCalledTimes(1);

    expect(ref.current?.getRootState()).toEqual(state);
  }
);

test.each(['reset action', 'resetRoot'])(
  "emits 'beforeRemove' for multiple nested routes removed from nested state by %s",
  async (action) => {
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

    const onBeforeRemove = {
      lex1: jest.fn(),
      lex2: jest.fn(),
    };

    const shouldPrevent = {
      lex1: true,
      lex2: true,
    };

    const TestScreen = (props: any) => {
      React.useEffect(
        () =>
          props.navigation.addListener('beforeRemove', (e: any) => {
            if (props.route.name === 'lex1') {
              onBeforeRemove.lex1();

              if (shouldPrevent.lex1) {
                e.preventDefault();
              }
            }

            if (props.route.name === 'lex2') {
              onBeforeRemove.lex2();

              if (shouldPrevent.lex2) {
                e.preventDefault();
              }
            }
          }),
        [props.navigation, props.route.name]
      );

      return null;
    };

    const ref = createNavigationContainerRef<ParamListBase>();

    await render(
      <BaseNavigationContainer
        ref={ref}
        initialState={{
          index: 2,
          routes: [
            { name: 'foo' },
            {
              name: 'baz1',
              state: { index: 1, routes: [{ name: 'qux1' }, { name: 'lex1' }] },
            },
            {
              name: 'baz2',
              state: { index: 1, routes: [{ name: 'qux2' }, { name: 'lex2' }] },
            },
          ],
        }}
      >
        <TestNavigator>
          <Screen name="foo">{() => null}</Screen>
          <Screen name="baz1">
            {() => (
              <TestNavigator>
                <Screen name="qux1">{() => null}</Screen>
                <Screen name="lex1" component={TestScreen} />
              </TestNavigator>
            )}
          </Screen>
          <Screen name="baz2">
            {() => (
              <TestNavigator>
                <Screen name="qux2">{() => null}</Screen>
                <Screen name="lex2" component={TestScreen} />
              </TestNavigator>
            )}
          </Screen>
        </TestNavigator>
      </BaseNavigationContainer>
    );

    const state = ref.current?.getRootState();

    if (state == null) {
      throw new Error('Expected navigation state to be available.');
    }

    const nextState: NavigationState = {
      ...state,
      routes: state.routes.map((route) => {
        if (route.state?.stale !== false) {
          return route;
        }

        return {
          ...route,
          state: {
            ...route.state,
            index: 0,
            routes: route.state.routes.filter(
              (child) => child.name !== 'lex1' && child.name !== 'lex2'
            ),
          },
        };
      }),
    };

    await act(() =>
      action === 'reset action'
        ? ref.current?.dispatch(CommonActions.reset(nextState))
        : ref.current?.resetRoot(nextState)
    );

    expect(onBeforeRemove.lex2).toHaveBeenCalledTimes(1);
    expect(onBeforeRemove.lex1).not.toHaveBeenCalled();

    expect(ref.current?.getRootState()).toEqual(state);

    shouldPrevent.lex2 = false;

    await act(() =>
      action === 'reset action'
        ? ref.current?.dispatch(CommonActions.reset(nextState))
        : ref.current?.resetRoot(nextState)
    );

    expect(onBeforeRemove.lex2).toHaveBeenCalledTimes(2);
    expect(onBeforeRemove.lex1).toHaveBeenCalledTimes(1);

    expect(ref.current?.getRootState()).toEqual(state);

    shouldPrevent.lex1 = false;

    await act(() =>
      action === 'reset action'
        ? ref.current?.dispatch(CommonActions.reset(nextState))
        : ref.current?.resetRoot(nextState)
    );

    expect(onBeforeRemove.lex2).toHaveBeenCalledTimes(3);
    expect(onBeforeRemove.lex1).toHaveBeenCalledTimes(2);

    expect(ref.current?.getRootState()).toEqual(nextState);
  }
);

test.each(['reset action', 'resetRoot'])(
  "emits 'beforeRemove' with stale state from %s when route key is omitted",
  async (action) => {
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

    const onBeforeRemove = jest.fn();

    const TestScreen = (props: any) => {
      React.useEffect(
        () =>
          props.navigation.addListener('beforeRemove', (e: any) => {
            onBeforeRemove();
            e.preventDefault();
          }),
        [props.navigation]
      );

      return null;
    };

    const ref = createNavigationContainerRef<ParamListBase>();

    await render(
      <BaseNavigationContainer
        ref={ref}
        initialState={{
          index: 1,
          routes: [
            { name: 'foo' },
            {
              name: 'baz',
              state: { index: 1, routes: [{ name: 'qux' }, { name: 'lex' }] },
            },
          ],
        }}
      >
        <TestNavigator>
          <Screen name="foo">{() => null}</Screen>
          <Screen name="baz">
            {() => (
              <TestNavigator>
                <Screen name="qux" component={TestScreen} />
                <Screen name="lex">{() => null}</Screen>
              </TestNavigator>
            )}
          </Screen>
        </TestNavigator>
      </BaseNavigationContainer>
    );

    const state = ref.current?.getRootState();

    if (state == null) {
      throw new Error('Expected navigation state to be available.');
    }

    const nextState: PartialState<NavigationState> = {
      index: state.index,
      routes: state.routes.map((route) =>
        route.name === 'baz'
          ? {
              name: route.name,
              key: route.key,
              state: {
                stale: true,
                index: 0,
                routes: [{ name: 'qux' }],
              },
            }
          : { name: route.name, key: route.key }
      ),
    };

    await act(() =>
      action === 'reset action'
        ? ref.current?.dispatch(CommonActions.reset(nextState))
        : ref.current?.resetRoot(nextState)
    );

    expect(onBeforeRemove).toHaveBeenCalledTimes(1);

    expect(ref.current?.getRootState()).toEqual(state);
  }
);

test.each(['reset action', 'resetRoot'])(
  "doesn't emit 'beforeRemove' with stale state from %s when the route keeps the same key",
  async (action) => {
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

    const onBeforeRemove = jest.fn();

    const TestScreen = (props: any) => {
      React.useEffect(
        () =>
          props.navigation.addListener('beforeRemove', (e: any) => {
            onBeforeRemove();
            e.preventDefault();
          }),
        [props.navigation]
      );

      return null;
    };

    const ref = createNavigationContainerRef<ParamListBase>();

    await render(
      <BaseNavigationContainer
        ref={ref}
        initialState={{
          index: 1,
          routes: [
            { name: 'foo' },
            {
              name: 'baz',
              state: { index: 1, routes: [{ name: 'qux' }, { name: 'lex' }] },
            },
          ],
        }}
      >
        <TestNavigator>
          <Screen name="foo">{() => null}</Screen>
          <Screen name="baz">
            {() => (
              <TestNavigator>
                <Screen name="qux" component={TestScreen} />
                <Screen name="lex">{() => null}</Screen>
              </TestNavigator>
            )}
          </Screen>
        </TestNavigator>
      </BaseNavigationContainer>
    );

    const state = ref.current?.getRootState();

    if (state == null) {
      throw new Error('Expected navigation state to be available.');
    }

    const nextState: PartialState<NavigationState> = {
      index: state.index,
      routes: state.routes.map((route) =>
        route.name === 'baz'
          ? {
              name: route.name,
              key: route.key,
              state: {
                stale: true,
                index: 0,
                routes:
                  route.state && route.state.stale === false
                    ? route.state.routes
                        .filter((r) => r.name === 'qux')
                        .map((r) => ({ name: r.name, key: r.key }))
                    : [],
              },
            }
          : { name: route.name, key: route.key }
      ),
    };

    await act(() =>
      action === 'reset action'
        ? ref.current?.dispatch(CommonActions.reset(nextState))
        : ref.current?.resetRoot(nextState)
    );

    expect(onBeforeRemove).not.toHaveBeenCalled();

    expect(
      ref.current?.getRootState().routes.find((route) => route.name === 'baz')
        ?.state?.routes
    ).toEqual(
      nextState.routes.find((route) => route.name === 'baz')?.state?.routes
    );
  }
);

test.each(['reset action', 'resetRoot'])(
  "emits 'beforeRemove' with stale state from %s when route is omitted",
  async (action) => {
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

    const onBeforeRemove = jest.fn();

    const TestScreen = (props: any) => {
      React.useEffect(
        () =>
          props.navigation.addListener('beforeRemove', (e: any) => {
            onBeforeRemove();
            e.preventDefault();
          }),
        [props.navigation]
      );

      return null;
    };

    const ref = createNavigationContainerRef<ParamListBase>();

    await render(
      <BaseNavigationContainer
        ref={ref}
        initialState={{
          index: 1,
          routes: [
            { name: 'foo' },
            {
              name: 'baz',
              state: { index: 1, routes: [{ name: 'qux' }, { name: 'lex' }] },
            },
          ],
        }}
      >
        <TestNavigator>
          <Screen name="foo">{() => null}</Screen>
          <Screen name="baz">
            {() => (
              <TestNavigator>
                <Screen name="qux">{() => null}</Screen>
                <Screen name="lex" component={TestScreen} />
              </TestNavigator>
            )}
          </Screen>
        </TestNavigator>
      </BaseNavigationContainer>
    );

    const state = ref.current?.getRootState();

    if (state == null) {
      throw new Error('Expected navigation state to be available.');
    }

    const nextState: PartialState<NavigationState> = {
      index: state.index,
      routes: state.routes.map((route) =>
        route.name === 'baz'
          ? {
              name: route.name,
              key: route.key,
              state: {
                stale: true,
                index: 0,
                routes:
                  route.state && route.state.stale === false
                    ? route.state.routes
                        .filter((r) => r.name === 'qux')
                        .map((r) => ({ name: r.name, key: r.key }))
                    : [],
              },
            }
          : { name: route.name, key: route.key }
      ),
    };

    await act(() =>
      action === 'reset action'
        ? ref.current?.dispatch(CommonActions.reset(nextState))
        : ref.current?.resetRoot(nextState)
    );

    expect(onBeforeRemove).toHaveBeenCalledTimes(1);

    expect(ref.current?.getRootState()).toEqual(state);
  }
);

test.each(['reset action', 'resetRoot'])(
  "emits 'beforeRemove' and applies %s when prevented action is re-dispatched",
  async (action) => {
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

    const onBeforeRemove = jest.fn();

    let shouldContinue = false;

    const TestScreen = (props: any) => {
      React.useEffect(
        () =>
          props.navigation.addListener('beforeRemove', (e: any) => {
            onBeforeRemove();
            e.preventDefault();

            if (shouldContinue) {
              props.navigation.dispatch(e.data.action);
            }
          }),
        [props.navigation]
      );

      return null;
    };

    const ref = createNavigationContainerRef<ParamListBase>();

    await render(
      <BaseNavigationContainer
        ref={ref}
        initialState={{
          index: 1,
          routes: [
            { name: 'foo' },
            {
              name: 'baz',
              state: { index: 1, routes: [{ name: 'qux' }, { name: 'lex' }] },
            },
          ],
        }}
      >
        <TestNavigator>
          <Screen name="foo">{() => null}</Screen>
          <Screen name="baz">
            {() => (
              <TestNavigator>
                <Screen name="qux">{() => null}</Screen>
                <Screen name="lex" component={TestScreen} />
              </TestNavigator>
            )}
          </Screen>
        </TestNavigator>
      </BaseNavigationContainer>
    );

    const state = ref.current?.getRootState();

    if (state == null) {
      throw new Error('Expected navigation state to be available.');
    }

    const nextState: NavigationState = {
      ...state,
      routes: state.routes.map((route) =>
        route.name === 'baz'
          ? {
              ...route,
              state:
                route.state && route.state.stale === false
                  ? {
                      ...route.state,
                      index: 0,
                      routes: route.state.routes.filter(
                        (r) => r.name !== 'lex'
                      ),
                    }
                  : undefined,
            }
          : route
      ),
    };

    await act(() =>
      action === 'reset action'
        ? ref.current?.dispatch(CommonActions.reset(nextState))
        : ref.current?.resetRoot(nextState)
    );

    expect(onBeforeRemove).toHaveBeenCalledTimes(1);

    expect(ref.current?.getRootState()).toEqual(state);

    shouldContinue = true;

    await act(() =>
      action === 'reset action'
        ? ref.current?.dispatch(CommonActions.reset(nextState))
        : ref.current?.resetRoot(nextState)
    );

    expect(onBeforeRemove).toHaveBeenCalledTimes(2);

    expect(ref.current?.getRootState()).toEqual(nextState);
  }
);

test.each(['reset action', 'resetRoot'])(
  "emits 'beforeRemove' and applies stale %s when prevented action is re-dispatched",
  async (action) => {
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

    const onBeforeRemove = jest.fn();

    let shouldContinue = false;

    const TestScreen = (props: any) => {
      React.useEffect(
        () =>
          props.navigation.addListener('beforeRemove', (e: any) => {
            onBeforeRemove();
            e.preventDefault();

            if (shouldContinue) {
              props.navigation.dispatch(e.data.action);
            }
          }),
        [props.navigation]
      );

      return null;
    };

    const ref = createNavigationContainerRef<ParamListBase>();

    await render(
      <BaseNavigationContainer
        ref={ref}
        initialState={{
          index: 1,
          routes: [
            { name: 'foo' },
            {
              name: 'baz',
              state: { index: 1, routes: [{ name: 'qux' }, { name: 'lex' }] },
            },
          ],
        }}
      >
        <TestNavigator>
          <Screen name="foo">{() => null}</Screen>
          <Screen name="baz">
            {() => (
              <TestNavigator>
                <Screen name="qux" component={TestScreen} />
                <Screen name="lex">{() => null}</Screen>
              </TestNavigator>
            )}
          </Screen>
        </TestNavigator>
      </BaseNavigationContainer>
    );

    const state = ref.current?.getRootState();

    if (state == null) {
      throw new Error('Expected navigation state to be available.');
    }

    const nextState: PartialState<NavigationState> = {
      index: state.index,
      routes: state.routes.map((route) =>
        route.name === 'baz'
          ? {
              name: route.name,
              key: route.key,
              state: {
                stale: true,
                index: 0,
                routes: [{ name: 'lex' }],
              },
            }
          : { name: route.name, key: route.key }
      ),
    };

    await act(() =>
      action === 'reset action'
        ? ref.current?.dispatch(CommonActions.reset(nextState))
        : ref.current?.resetRoot(nextState)
    );

    expect(onBeforeRemove).toHaveBeenCalledTimes(1);

    expect(ref.current?.getRootState()).toEqual(state);

    shouldContinue = true;

    await act(() =>
      action === 'reset action'
        ? ref.current?.dispatch(CommonActions.reset(nextState))
        : ref.current?.resetRoot(nextState)
    );

    expect(onBeforeRemove).toHaveBeenCalledTimes(2);

    expect(
      ref.current
        ?.getRootState()
        .routes.find((route) => route.name === 'baz')
        ?.state?.routes.map((route) => route.name)
    ).toEqual(['lex']);
  }
);

test.each(['reset action', 'resetRoot'])(
  "emits 'beforeRemove' when %s replaces a route with the same name and a different key",
  async (action) => {
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

    const onBeforeRemove = jest.fn();

    const TestScreen = (props: any) => {
      React.useEffect(
        () =>
          props.navigation.addListener('beforeRemove', (e: any) => {
            onBeforeRemove();
            e.preventDefault();
          }),
        [props.navigation]
      );

      return null;
    };

    const ref = createNavigationContainerRef<ParamListBase>();

    await render(
      <BaseNavigationContainer
        ref={ref}
        initialState={{
          index: 1,
          routes: [
            { name: 'foo' },
            {
              name: 'baz',
              state: { index: 0, routes: [{ name: 'qux' }] },
            },
          ],
        }}
      >
        <TestNavigator>
          <Screen name="foo">{() => null}</Screen>
          <Screen name="baz">
            {() => (
              <TestNavigator>
                <Screen name="qux" component={TestScreen} />
              </TestNavigator>
            )}
          </Screen>
        </TestNavigator>
      </BaseNavigationContainer>
    );

    const state = ref.current?.getRootState();

    if (state == null) {
      throw new Error('Expected navigation state to be available.');
    }

    const nextState: NavigationState = {
      ...state,
      routes: state.routes.map((route) =>
        route.name === 'baz'
          ? {
              ...route,
              state:
                route.state && route.state.stale === false
                  ? {
                      ...route.state,
                      routes: route.state.routes.map((r) =>
                        r.name === 'qux'
                          ? { ...r, key: `${r.key}-replacement` }
                          : r
                      ),
                    }
                  : undefined,
            }
          : route
      ),
    };

    await act(() =>
      action === 'reset action'
        ? ref.current?.dispatch(CommonActions.reset(nextState))
        : ref.current?.resetRoot(nextState)
    );

    expect(onBeforeRemove).toHaveBeenCalledTimes(1);

    expect(ref.current?.getRootState()).toEqual(state);
  }
);

test.each(['reset action', 'resetRoot'])(
  "emits 'beforeRemove' when %s omits nested state for a kept route",
  async (action) => {
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

    const onBeforeRemove = jest.fn();

    const TestScreen = (props: any) => {
      React.useEffect(
        () =>
          props.navigation.addListener('beforeRemove', (e: any) => {
            onBeforeRemove();
            e.preventDefault();
          }),
        [props.navigation]
      );

      return null;
    };

    const ref = createNavigationContainerRef<ParamListBase>();

    await render(
      <BaseNavigationContainer
        ref={ref}
        initialState={{
          index: 1,
          routes: [
            { name: 'foo' },
            {
              name: 'baz',
              state: { index: 0, routes: [{ name: 'qux' }] },
            },
          ],
        }}
      >
        <TestNavigator>
          <Screen name="foo">{() => null}</Screen>
          <Screen name="baz">
            {() => (
              <TestNavigator>
                <Screen name="qux" component={TestScreen} />
              </TestNavigator>
            )}
          </Screen>
        </TestNavigator>
      </BaseNavigationContainer>
    );

    const state = ref.current?.getRootState();

    if (state == null) {
      throw new Error('Expected navigation state to be available.');
    }

    const nextState: NavigationState = {
      ...state,
      routes: state.routes.map((route) =>
        route.name === 'baz'
          ? {
              key: route.key,
              name: route.name,
            }
          : route
      ),
    };

    await act(() =>
      action === 'reset action'
        ? ref.current?.dispatch(CommonActions.reset(nextState))
        : ref.current?.resetRoot(nextState)
    );

    expect(onBeforeRemove).toHaveBeenCalledTimes(1);

    expect(ref.current?.getRootState()).toEqual(state);
  }
);
