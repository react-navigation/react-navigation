import { beforeEach, expect, jest, test } from '@jest/globals';
import {
  type DefaultRouterOptions,
  type NavigationState,
  type ParamListBase,
  type Router,
  StackActions,
  StackRouter,
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

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('nanoid/non-secure').__key = 0;
});

test("lets parent handle the action if child didn't", () => {
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
    const { state, descriptors } = useNavigationBuilder(CurrentRouter, props);

    return descriptors[state.routes[state.index].key].render();
  };

  const ChildNavigator = (props: any) => {
    const { state, descriptors } = useNavigationBuilder(MockRouter, props);

    return descriptors[state.routes[state.index].key].render();
  };

  const TestScreen = (props: any) => {
    React.useEffect(() => {
      props.navigation.dispatch({ type: 'REVERSE' });

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
  };

  const onStateChange = jest.fn();

  render(
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

test("lets children handle the action if parent didn't with navigationInChildEnabled", () => {
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
    const { state, descriptors } = useNavigationBuilder(
      CurrentChildRouter,
      props
    );

    return descriptors[state.routes[state.index].key].render();
  };

  const ParentNavigator = (props: any) => {
    const { state, descriptors } = useNavigationBuilder(
      CurrentParentRouter,
      props
    );

    return (
      <React.Fragment>
        {state.routes.map((route) => descriptors[route.key].render())}
      </React.Fragment>
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
    <BaseNavigationContainer
      navigationInChildEnabled
      initialState={initialState}
      onStateChange={onStateChange}
    >
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

  render(element).update(element);

  expect(onStateChange).toHaveBeenCalledTimes(1);
  expect(onStateChange).toHaveBeenLastCalledWith({
    stale: false,
    type: 'test',
    index: 0,
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
    ],
  });
});

test("lets children handle the action if parent didn't with NAVIGATE_DEPRECATED", () => {
  const TestNavigator = (props: any) => {
    const { state, descriptors } = useNavigationBuilder(MockRouter, props);

    return <>{state.routes.map((route) => descriptors[route.key].render())}</>;
  };

  const TestScreen = () => null;

  const onStateChange = jest.fn();
  const onUnhandledAction = jest.fn();

  const navigation = createNavigationContainerRef<ParamListBase>();

  const element = (
    <BaseNavigationContainer
      ref={navigation}
      onStateChange={onStateChange}
      onUnhandledAction={onUnhandledAction}
    >
      <TestNavigator>
        <Screen name="foo" component={TestScreen} />
        <Screen name="bar" component={TestScreen} />
        <Screen name="baz">
          {() => (
            <TestNavigator>
              <Screen name="qux" component={TestScreen} />
              <Screen name="lex" component={TestScreen} />
            </TestNavigator>
          )}
        </Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  render(element);

  act(() => navigation.navigate('lex'));

  expect(onStateChange).not.toHaveBeenCalled();
  expect(onUnhandledAction).toHaveBeenCalledTimes(1);
  expect(onUnhandledAction).toHaveBeenCalledWith(
    expect.objectContaining({
      type: 'NAVIGATE',
      payload: { name: 'lex' },
    })
  );

  expect(navigation.getCurrentRoute()?.name).toBe('foo');

  act(() => navigation.navigateDeprecated('lex'));

  expect(onStateChange).toHaveBeenCalledTimes(1);
  expect(onUnhandledAction).toHaveBeenCalledTimes(1);

  expect(navigation.getCurrentRoute()?.name).toBe('lex');
});

test('action goes to correct parent navigator if target is specified', () => {
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
    const { state, descriptors } = useNavigationBuilder(
      CurrentTestRouter,
      props
    );

    return (
      <React.Fragment>
        {state.routes.map((route) => descriptors[route.key].render())}
      </React.Fragment>
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

  render(element).update(element);

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

test('action goes to correct child navigator if target is specified', () => {
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
    const { state, descriptors } = useNavigationBuilder(
      CurrentTestRouter,
      props
    );

    return (
      <React.Fragment>
        {state.routes.map((route) => descriptors[route.key].render())}
      </React.Fragment>
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

  render(element).update(element);

  act(() => {
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

test("action doesn't bubble if target is specified", () => {
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
    const { state, descriptors } = useNavigationBuilder(
      CurrentChildRouter,
      props
    );

    return descriptors[state.routes[state.index].key].render();
  };

  const ParentNavigator = (props: any) => {
    const { state, descriptors } = useNavigationBuilder(
      CurrentParentRouter,
      props
    );

    return (
      <React.Fragment>
        {state.routes.map((route) => descriptors[route.key].render())}
      </React.Fragment>
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

  render(element).update(element);

  expect(onStateChange).not.toHaveBeenCalled();
});

test('logs error if no navigator handled the action', () => {
  const TestRouter = MockRouter;

  const TestNavigator = (props: any) => {
    const { state, descriptors } = useNavigationBuilder(TestRouter, props);

    return (
      <React.Fragment>
        {state.routes.map((route) => descriptors[route.key].render())}
      </React.Fragment>
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

  render(element).update(element);

  expect(spy.mock.calls[0][0]).toMatch(
    "The action 'UNKNOWN' was not handled by any navigator."
  );

  spy.mockRestore();
});

test("prevents removing a screen with 'beforeRemove' event", () => {
  const TestNavigator = (props: any) => {
    const { state, descriptors } = useNavigationBuilder(StackRouter, props);

    return (
      <React.Fragment>
        {state.routes.map((route) => descriptors[route.key].render())}
      </React.Fragment>
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

  render(element);

  act(() => ref.current?.navigate('bar'));

  expect(onStateChange).toHaveBeenCalledTimes(1);
  expect(onStateChange).toHaveBeenCalledWith({
    index: 1,
    key: 'stack-2',
    preloadedRoutes: [],
    routeNames: ['foo', 'bar', 'baz'],
    routes: [
      { key: 'foo-3', name: 'foo' },
      { key: 'bar-4', name: 'bar' },
    ],
    stale: false,
    type: 'stack',
  });

  act(() => ref.current?.navigate('baz'));

  expect(onStateChange).toHaveBeenCalledTimes(2);
  expect(onStateChange).toHaveBeenCalledWith({
    index: 2,
    key: 'stack-2',
    preloadedRoutes: [],
    routeNames: ['foo', 'bar', 'baz'],
    routes: [
      { key: 'foo-3', name: 'foo' },
      { key: 'bar-4', name: 'bar' },
      {
        key: 'baz-5',
        name: 'baz',
      },
    ],
    stale: false,
    type: 'stack',
  });

  act(() => ref.current?.dispatch(StackActions.popTo('foo')));

  expect(onStateChange).toHaveBeenCalledTimes(2);
  expect(onBeforeRemove).toHaveBeenCalledTimes(1);

  expect(ref.current?.getRootState()).toEqual({
    index: 2,
    key: 'stack-2',
    preloadedRoutes: [],
    routeNames: ['foo', 'bar', 'baz'],
    routes: [
      { key: 'foo-3', name: 'foo' },
      { key: 'bar-4', name: 'bar' },
      { key: 'baz-5', name: 'baz' },
    ],
    stale: false,
    type: 'stack',
  });

  shouldPrevent = false;

  act(() => ref.current?.dispatch(StackActions.popTo('foo')));

  expect(onStateChange).toHaveBeenCalledTimes(3);
  expect(onStateChange).toHaveBeenCalledWith({
    index: 0,
    key: 'stack-2',
    preloadedRoutes: [],
    routeNames: ['foo', 'bar', 'baz'],
    routes: [{ key: 'foo-3', name: 'foo' }],
    stale: false,
    type: 'stack',
  });

  shouldPrevent = true;
  shouldContinue = true;

  act(() => ref.current?.navigate('bar'));
  act(() => ref.current?.navigate('foo'));

  expect(onStateChange).toHaveBeenCalledTimes(5);
  expect(onStateChange).toHaveBeenCalledWith({
    index: 0,
    key: 'stack-2',
    preloadedRoutes: [],
    routeNames: ['foo', 'bar', 'baz'],
    routes: [{ key: 'foo-3', name: 'foo' }],
    stale: false,
    type: 'stack',
  });
});

test("prevents removing a child screen with 'beforeRemove' event", () => {
  const TestNavigator = (props: any) => {
    const { state, descriptors } = useNavigationBuilder(StackRouter, props);

    return (
      <React.Fragment>
        {state.routes.map((route) => descriptors[route.key].render())}
      </React.Fragment>
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

  render(element);

  act(() => ref.current?.navigate('bar'));

  expect(onStateChange).toHaveBeenCalledTimes(1);
  expect(onStateChange).toHaveBeenCalledWith({
    index: 1,
    key: 'stack-2',
    preloadedRoutes: [],
    routeNames: ['foo', 'bar', 'baz'],
    routes: [
      { key: 'foo-3', name: 'foo' },
      { key: 'bar-4', name: 'bar' },
    ],
    stale: false,
    type: 'stack',
  });

  act(() => ref.current?.navigate('baz'));

  expect(onStateChange).toHaveBeenCalledTimes(2);
  expect(onStateChange).toHaveBeenCalledWith({
    index: 2,
    key: 'stack-2',
    preloadedRoutes: [],
    routeNames: ['foo', 'bar', 'baz'],
    routes: [
      { key: 'foo-3', name: 'foo' },
      { key: 'bar-4', name: 'bar' },
      {
        key: 'baz-5',
        name: 'baz',
        state: {
          index: 0,
          key: 'stack-7',
          preloadedRoutes: [],
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

  act(() => ref.current?.dispatch(StackActions.popTo('foo')));

  expect(onStateChange).toHaveBeenCalledTimes(2);
  expect(onBeforeRemove).toHaveBeenCalledTimes(1);

  expect(ref.current?.getRootState()).toEqual({
    index: 2,
    key: 'stack-2',
    preloadedRoutes: [],
    routeNames: ['foo', 'bar', 'baz'],
    routes: [
      { key: 'foo-3', name: 'foo' },
      { key: 'bar-4', name: 'bar' },
      {
        key: 'baz-5',
        name: 'baz',
        state: {
          index: 0,
          key: 'stack-7',
          preloadedRoutes: [],
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

  act(() => ref.current?.dispatch(StackActions.popTo('foo')));

  expect(onStateChange).toHaveBeenCalledTimes(3);
  expect(onStateChange).toHaveBeenCalledWith({
    index: 0,
    key: 'stack-2',
    preloadedRoutes: [],
    routeNames: ['foo', 'bar', 'baz'],
    routes: [{ key: 'foo-3', name: 'foo' }],
    stale: false,
    type: 'stack',
  });

  shouldPrevent = true;
  shouldContinue = true;

  act(() => ref.current?.navigate('bar'));
  act(() => ref.current?.navigate('foo'));

  expect(onStateChange).toHaveBeenCalledTimes(5);
  expect(onStateChange).toHaveBeenCalledWith({
    index: 0,
    key: 'stack-2',
    preloadedRoutes: [],
    routeNames: ['foo', 'bar', 'baz'],
    routes: [{ key: 'foo-3', name: 'foo' }],
    stale: false,
    type: 'stack',
  });
});

test("prevents removing a grand child screen with 'beforeRemove' event", () => {
  const TestNavigator = (props: any) => {
    const { state, descriptors } = useNavigationBuilder(StackRouter, props);

    return (
      <React.Fragment>
        {state.routes.map((route) => descriptors[route.key].render())}
      </React.Fragment>
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

  render(element);

  act(() => ref.current?.navigate('bar'));

  expect(onStateChange).toHaveBeenCalledTimes(1);
  expect(onStateChange).toHaveBeenCalledWith({
    index: 1,
    key: 'stack-2',
    preloadedRoutes: [],
    routeNames: ['foo', 'bar', 'baz'],
    routes: [
      { key: 'foo-3', name: 'foo' },
      { key: 'bar-4', name: 'bar' },
    ],
    stale: false,
    type: 'stack',
  });

  act(() => ref.current?.navigate('baz'));

  expect(onStateChange).toHaveBeenCalledTimes(2);
  expect(onStateChange).toHaveBeenCalledWith({
    index: 2,
    key: 'stack-2',
    preloadedRoutes: [],
    routeNames: ['foo', 'bar', 'baz'],
    routes: [
      { key: 'foo-3', name: 'foo' },
      { key: 'bar-4', name: 'bar' },
      {
        key: 'baz-5',
        name: 'baz',
        state: {
          index: 0,
          key: 'stack-7',
          preloadedRoutes: [],
          routeNames: ['qux'],
          routes: [
            {
              key: 'qux-8',
              name: 'qux',
              state: {
                index: 0,
                key: 'stack-10',
                preloadedRoutes: [],
                routeNames: ['lex'],
                routes: [{ key: 'lex-11', name: 'lex' }],
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

  act(() => ref.current?.dispatch(StackActions.popTo('foo')));

  expect(onStateChange).toHaveBeenCalledTimes(2);
  expect(onBeforeRemove).toHaveBeenCalledTimes(1);

  expect(ref.current?.getRootState()).toEqual({
    index: 2,
    key: 'stack-2',
    preloadedRoutes: [],
    routeNames: ['foo', 'bar', 'baz'],
    routes: [
      { key: 'foo-3', name: 'foo' },
      { key: 'bar-4', name: 'bar' },
      {
        key: 'baz-5',
        name: 'baz',
        state: {
          index: 0,
          key: 'stack-7',
          preloadedRoutes: [],
          routeNames: ['qux'],
          routes: [
            {
              key: 'qux-8',
              name: 'qux',
              state: {
                index: 0,
                key: 'stack-10',
                preloadedRoutes: [],
                routeNames: ['lex'],
                routes: [{ key: 'lex-11', name: 'lex' }],
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

  act(() => ref.current?.dispatch(StackActions.popTo('foo')));

  expect(onStateChange).toHaveBeenCalledTimes(3);
  expect(onStateChange).toHaveBeenCalledWith({
    index: 0,
    key: 'stack-2',
    preloadedRoutes: [],
    routeNames: ['foo', 'bar', 'baz'],
    routes: [{ key: 'foo-3', name: 'foo' }],
    stale: false,
    type: 'stack',
  });

  shouldPrevent = true;
  shouldContinue = true;

  act(() => ref.current?.navigate('bar'));
  act(() => ref.current?.navigate('foo'));

  expect(onStateChange).toHaveBeenCalledTimes(5);
  expect(onStateChange).toHaveBeenCalledWith({
    index: 0,
    key: 'stack-2',
    preloadedRoutes: [],
    routeNames: ['foo', 'bar', 'baz'],
    routes: [{ key: 'foo-3', name: 'foo' }],
    stale: false,
    type: 'stack',
  });
});

test("prevents removing by multiple screens with 'beforeRemove' event", () => {
  const TestNavigator = (props: any) => {
    const { state, descriptors } = useNavigationBuilder(StackRouter, props);

    return (
      <React.Fragment>
        {state.routes.map((route) => descriptors[route.key].render())}
      </React.Fragment>
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

  render(element);

  act(() => {
    ref.current?.navigate('bar');
    ref.current?.navigate('baz');
    ref.current?.navigate('bax');
  });

  const preventedState = {
    index: 3,
    key: 'stack-2',
    preloadedRoutes: [],
    routeNames: ['foo', 'bar', 'baz', 'bax'],
    routes: [
      { key: 'foo-3', name: 'foo' },
      { key: 'bar-4', name: 'bar' },
      { key: 'baz-5', name: 'baz' },
      {
        key: 'bax-6',
        name: 'bax',
        state: {
          index: 0,
          key: 'stack-8',
          preloadedRoutes: [],
          routeNames: ['qux'],
          routes: [
            {
              key: 'qux-9',
              name: 'qux',
              state: {
                index: 0,
                key: 'stack-11',
                preloadedRoutes: [],
                routeNames: ['lex'],
                routes: [{ key: 'lex-12', name: 'lex' }],
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

  act(() => ref.current?.dispatch(StackActions.popTo('foo')));

  expect(onStateChange).toHaveBeenCalledTimes(1);
  expect(onBeforeRemove.lex).toHaveBeenCalledTimes(1);

  expect(ref.current?.getRootState()).toEqual(preventedState);

  shouldPrevent.lex = false;

  act(() => ref.current?.dispatch(StackActions.popTo('foo')));

  expect(onStateChange).toHaveBeenCalledTimes(1);
  expect(onBeforeRemove.baz).toHaveBeenCalledTimes(1);

  expect(ref.current?.getRootState()).toEqual(preventedState);

  shouldPrevent.baz = false;

  act(() => ref.current?.dispatch(StackActions.popTo('foo')));

  expect(onStateChange).toHaveBeenCalledTimes(1);
  expect(onBeforeRemove.bar).toHaveBeenCalledTimes(1);

  expect(ref.current?.getRootState()).toEqual(preventedState);

  shouldPrevent.bar = false;

  act(() => ref.current?.dispatch(StackActions.popTo('foo')));

  expect(onStateChange).toHaveBeenCalledTimes(2);
  expect(onStateChange).toHaveBeenCalledWith({
    index: 0,
    key: 'stack-2',
    preloadedRoutes: [],
    routeNames: ['foo', 'bar', 'baz', 'bax'],
    routes: [{ key: 'foo-3', name: 'foo' }],
    stale: false,
    type: 'stack',
  });
});

test("prevents removing a child screen with 'beforeRemove' event with 'resetRoot'", () => {
  const TestNavigator = (props: any) => {
    const { state, descriptors } = useNavigationBuilder(StackRouter, props);

    return (
      <React.Fragment>
        {state.routes.map((route) => descriptors[route.key].render())}
      </React.Fragment>
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

  render(element);

  act(() => ref.current?.navigate('baz'));

  expect(onStateChange).toHaveBeenCalledTimes(1);
  expect(onStateChange).toHaveBeenCalledWith({
    index: 1,
    key: 'stack-2',
    preloadedRoutes: [],
    routeNames: ['foo', 'bar', 'baz'],
    routes: [
      { key: 'foo-3', name: 'foo' },
      {
        key: 'baz-4',
        name: 'baz',
        state: {
          index: 0,
          key: 'stack-6',
          preloadedRoutes: [],
          routeNames: ['qux', 'lex'],
          routes: [{ key: 'qux-7', name: 'qux' }],
          stale: false,
          type: 'stack',
        },
      },
    ],
    stale: false,
    type: 'stack',
  });

  act(() =>
    ref.current?.resetRoot({
      index: 0,
      key: 'stack-2',
      routeNames: ['foo', 'bar', 'baz'],
      routes: [{ key: 'foo-3', name: 'foo' }],
      stale: false,
      type: 'stack',
    })
  );

  expect(onStateChange).toHaveBeenCalledTimes(1);
  expect(onBeforeRemove).toHaveBeenCalledTimes(1);

  expect(ref.current?.getRootState()).toEqual({
    index: 1,
    key: 'stack-2',
    preloadedRoutes: [],
    routeNames: ['foo', 'bar', 'baz'],
    routes: [
      { key: 'foo-3', name: 'foo' },
      {
        key: 'baz-4',
        name: 'baz',
        state: {
          index: 0,
          key: 'stack-6',
          preloadedRoutes: [],
          routeNames: ['qux', 'lex'],
          routes: [{ key: 'qux-7', name: 'qux' }],
          stale: false,
          type: 'stack',
        },
      },
    ],
    stale: false,
    type: 'stack',
  });

  shouldPrevent = false;

  act(() =>
    ref.current?.resetRoot({
      index: 0,
      key: 'stack-2',
      routeNames: ['foo', 'bar', 'baz'],
      routes: [{ key: 'foo-3', name: 'foo' }],
      stale: false,
      type: 'stack',
    })
  );

  expect(onStateChange).toHaveBeenCalledTimes(2);
  expect(onStateChange).toHaveBeenCalledWith({
    index: 0,
    key: 'stack-2',
    routeNames: ['foo', 'bar', 'baz'],
    routes: [{ key: 'foo-3', name: 'foo' }],
    stale: false,
    type: 'stack',
  });
});
