import { afterEach, beforeEach, expect, jest, test } from '@jest/globals';
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

afterEach(() => {
  jest.restoreAllMocks();
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
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      CurrentRouter,
      props
    );

    return (
      <NavigationContent>
        {descriptors[state.routes[state.index].key].render()}
      </NavigationContent>
    );
  };

  const ChildNavigator = (props: any) => {
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
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      CurrentChildRouter,
      props
    );

    return (
      <NavigationContent>
        {descriptors[state.routes[state.index].key].render()}
      </NavigationContent>
    );
  };

  const ParentNavigator = (props: any) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      CurrentParentRouter,
      props
    );

    return (
      <NavigationContent>
        {state.routes.map((route) => descriptors[route.key].render())}
      </NavigationContent>
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
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      MockRouter,
      props
    );

    return (
      <NavigationContent>
        {state.routes.map((route) => descriptors[route.key].render())}
      </NavigationContent>
    );
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
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      CurrentTestRouter,
      props
    );

    return (
      <NavigationContent>
        {state.routes.map((route) => descriptors[route.key].render())}
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
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      CurrentTestRouter,
      props
    );

    return (
      <NavigationContent>
        {state.routes.map((route) => descriptors[route.key].render())}
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
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      CurrentChildRouter,
      props
    );

    return (
      <NavigationContent>
        {descriptors[state.routes[state.index].key].render()}
      </NavigationContent>
    );
  };

  const ParentNavigator = (props: any) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      CurrentParentRouter,
      props
    );

    return (
      <NavigationContent>
        {state.routes.map((route) => descriptors[route.key].render())}
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

  render(element).update(element);

  expect(onStateChange).not.toHaveBeenCalled();
});

test('logs error if no navigator handled the action', () => {
  const TestRouter = MockRouter;

  const TestNavigator = (props: any) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      TestRouter,
      props
    );

    return (
      <NavigationContent>
        {state.routes.map((route) => descriptors[route.key].render())}
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

  render(element).update(element);

  expect(spy).toHaveBeenCalledTimes(1);
  expect(spy).toHaveBeenCalledWith(
    expect.stringContaining(
      "The action 'UNKNOWN' was not handled by any navigator."
    )
  );

  spy.mockRestore();
});

test("prevents removing a screen with 'beforeRemove' event", () => {
  const TestNavigator = (props: any) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      StackRouter,
      props
    );

    return (
      <NavigationContent>
        {state.routes.map((route) => descriptors[route.key].render())}
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
      { key: 'bar-5', name: 'bar' },
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
      { key: 'bar-5', name: 'bar' },
      {
        key: 'baz-6',
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
      { key: 'bar-5', name: 'bar' },
      { key: 'baz-6', name: 'baz' },
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
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      StackRouter,
      props
    );

    return (
      <NavigationContent>
        {state.routes.map((route) => descriptors[route.key].render())}
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
      { key: 'bar-5', name: 'bar' },
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
      { key: 'bar-5', name: 'bar' },
      {
        key: 'baz-6',
        name: 'baz',
        state: {
          index: 0,
          key: 'stack-8',
          preloadedRoutes: [],
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
      { key: 'bar-5', name: 'bar' },
      {
        key: 'baz-6',
        name: 'baz',
        state: {
          index: 0,
          key: 'stack-8',
          preloadedRoutes: [],
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
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      StackRouter,
      props
    );

    return (
      <NavigationContent>
        {state.routes.map((route) => descriptors[route.key].render())}
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
      { key: 'bar-5', name: 'bar' },
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
      { key: 'bar-5', name: 'bar' },
      {
        key: 'baz-6',
        name: 'baz',
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
                key: 'stack-12',
                preloadedRoutes: [],
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
      { key: 'bar-5', name: 'bar' },
      {
        key: 'baz-6',
        name: 'baz',
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
                key: 'stack-12',
                preloadedRoutes: [],
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
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      StackRouter,
      props
    );

    return (
      <NavigationContent>
        {state.routes.map((route) => descriptors[route.key].render())}
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
      { key: 'bar-5', name: 'bar' },
      { key: 'baz-6', name: 'baz' },
      {
        key: 'bax-7',
        name: 'bax',
        state: {
          index: 0,
          key: 'stack-9',
          preloadedRoutes: [],
          routeNames: ['qux'],
          routes: [
            {
              key: 'qux-10',
              name: 'qux',
              state: {
                index: 0,
                key: 'stack-13',
                preloadedRoutes: [],
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
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      StackRouter,
      props
    );

    return (
      <NavigationContent>
        {state.routes.map((route) => descriptors[route.key].render())}
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

test('handles action dispatched immediately after a reset with partial state', () => {
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

  const navigation = createNavigationContainerRef<ParamListBase>();

  render(
    <BaseNavigationContainer ref={navigation}>
      <TestNavigator>
        <Screen name="foo">{() => null}</Screen>
        <Screen name="bar">{() => null}</Screen>
        <Screen name="baz">{() => null}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  act(() => {
    navigation.dispatch(
      CommonActions.reset({ index: 0, routes: [{ name: 'bar' }] })
    );

    navigation.dispatch(CommonActions.navigate('baz'));
  });

  expect(navigation.getRootState()).toEqual({
    stale: false,
    type: 'test',
    index: 1,
    key: '2',
    routeNames: ['foo', 'bar', 'baz'],
    routes: [
      { key: 'bar-1', name: 'bar' },
      { key: 'baz-3', name: 'baz' },
    ],
  });
});

test('reflects reset with partial state when state is read immediately after', () => {
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

  const navigation = createNavigationContainerRef<ParamListBase>();

  render(
    <BaseNavigationContainer ref={navigation}>
      <TestNavigator>
        <Screen name="foo">{() => null}</Screen>
        <Screen name="bar">{() => null}</Screen>
        <Screen name="baz">{() => null}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  let state: NavigationState | undefined;

  act(() => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'bar' }, { name: 'baz' }],
      })
    );

    state = navigation.getRootState();
  });

  expect(state).toEqual({
    stale: false,
    type: 'test',
    index: 0,
    key: '3',
    routeNames: ['foo', 'bar', 'baz'],
    routes: [
      { key: 'bar-1', name: 'bar' },
      { key: 'baz-2', name: 'baz' },
    ],
  });
});

test('handles navigating to a newly added screen from a layout effect', () => {
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

  const TestScreen = ({ navigation, signal }: any) => {
    React.useLayoutEffect(() => {
      if (signal) {
        navigation.navigate('qux');
      }
    }, [navigation, signal]);

    return null;
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  const Test = ({ condition }: { condition: boolean }) => (
    <BaseNavigationContainer ref={navigation}>
      <TestNavigator>
        <Screen name="foo">
          {(props: any) => <TestScreen {...props} signal={condition} />}
        </Screen>
        <Screen name="bar">{() => null}</Screen>
        {condition ? <Screen name="qux">{() => null}</Screen> : null}
      </TestNavigator>
    </BaseNavigationContainer>
  );

  const root = render(<Test condition={false} />);

  root.rerender(<Test condition />);

  expect(navigation.getRootState()).toEqual({
    stale: false,
    type: 'test',
    index: 2,
    key: '0',
    routeNames: ['foo', 'bar', 'qux'],
    routes: [
      { key: 'foo', name: 'foo' },
      { key: 'bar', name: 'bar' },
      { key: 'qux-1', name: 'qux' },
    ],
  });
});

test("doesn't lose navigation from a layout effect when screens change in the same update", () => {
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

  const TestScreen = ({ navigation, signal }: any) => {
    React.useLayoutEffect(() => {
      if (signal) {
        navigation.navigate('bar');
      }
    }, [navigation, signal]);

    return null;
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  const Test = ({ condition }: { condition: boolean }) => (
    <BaseNavigationContainer ref={navigation}>
      <TestNavigator>
        <Screen name="foo">
          {(props: any) => <TestScreen {...props} signal={condition} />}
        </Screen>
        <Screen name="bar">{() => null}</Screen>
        {condition ? null : <Screen name="baz">{() => null}</Screen>}
      </TestNavigator>
    </BaseNavigationContainer>
  );

  const root = render(<Test condition={false} />);

  root.rerender(<Test condition />);

  expect(navigation.getRootState()).toEqual({
    stale: false,
    type: 'test',
    index: 1,
    key: '0',
    routeNames: ['foo', 'bar'],
    routes: [
      { key: 'foo', name: 'foo' },
      { key: 'bar', name: 'bar' },
    ],
  });
});

test("doesn't lose changes from an action dispatched in a 'beforeRemove' listener", () => {
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

  let dispatched = false;

  const TestScreen = (props: any) => {
    React.useEffect(
      () =>
        props.navigation.addListener('beforeRemove', () => {
          onBeforeRemove();

          if (!dispatched) {
            dispatched = true;

            props.navigation.dispatch({
              ...CommonActions.setParams({ answer: 42 }),
              source: props.navigation.getState().routes[0].key,
            });
          }
        }),
      [props.navigation]
    );

    return null;
  };

  const ref = createNavigationContainerRef<ParamListBase>();

  render(
    <BaseNavigationContainer
      ref={ref}
      initialState={{
        index: 2,
        routes: [{ name: 'foo' }, { name: 'bar' }, { name: 'baz' }],
      }}
    >
      <TestNavigator>
        <Screen name="foo">{() => null}</Screen>
        <Screen name="bar">{() => null}</Screen>
        <Screen name="baz" component={TestScreen} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  act(() => ref.current?.goBack());

  expect(onBeforeRemove).toHaveBeenCalledTimes(2);

  const state = ref.current?.getRootState();

  expect(state?.routes.map((route) => route.name)).toEqual(['foo', 'bar']);
  expect(state?.routes[0]?.params).toEqual({ answer: 42 });
  expect(state?.index).toBe(1);
});

test("keeps state from a 'beforeRemove' listener when the original action no longer applies", () => {
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

  let dispatched = false;

  const TestScreen = (props: any) => {
    React.useEffect(
      () =>
        props.navigation.addListener('beforeRemove', () => {
          onBeforeRemove();

          if (!dispatched) {
            dispatched = true;
            props.navigation.dispatch(StackActions.popToTop());
          }
        }),
      [props.navigation]
    );

    return null;
  };

  const ref = createNavigationContainerRef<ParamListBase>();

  render(
    <BaseNavigationContainer
      ref={ref}
      initialState={{
        index: 2,
        routes: [{ name: 'foo' }, { name: 'bar' }, { name: 'baz' }],
      }}
    >
      <TestNavigator>
        <Screen name="foo">{() => null}</Screen>
        <Screen name="bar">{() => null}</Screen>
        <Screen name="baz" component={TestScreen} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

  act(() => ref.current?.goBack());

  expect(onBeforeRemove).toHaveBeenCalledTimes(2);
  expect(spy).toHaveBeenCalledWith(
    expect.stringContaining("The action 'GO_BACK' was not handled")
  );

  const state = ref.current?.getRootState();

  expect(state?.routes.map((route) => route.name)).toEqual(['foo']);
  expect(state?.index).toBe(0);
});

test.each(['reset action', 'resetRoot'])(
  "emits 'beforeRemove' for removed and updated routes in reverse order from %s",
  (action) => {
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

    render(
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

    act(() =>
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
  (action) => {
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

    render(
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

    act(() =>
      action === 'reset action'
        ? ref.current?.dispatch(CommonActions.reset(nextState))
        : ref.current?.resetRoot(nextState)
    );

    expect(onBeforeRemove).toHaveBeenCalledTimes(1);

    expect(ref.current?.getRootState()).toEqual(state);

    shouldPrevent = false;

    act(() =>
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
  (action) => {
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

    render(
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

    act(() =>
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
  (action) => {
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

    render(
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

    act(() => ref.current?.navigate('tabB'));

    act(() =>
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
  (action) => {
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

    render(
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

    act(() =>
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
  (action) => {
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

    render(
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

    act(() =>
      action === 'reset action'
        ? ref.current?.dispatch(CommonActions.reset(nextState))
        : ref.current?.resetRoot(nextState)
    );

    expect(onBeforeRemove.lex2).toHaveBeenCalledTimes(1);
    expect(onBeforeRemove.lex1).not.toHaveBeenCalled();

    expect(ref.current?.getRootState()).toEqual(state);

    shouldPrevent.lex2 = false;

    act(() =>
      action === 'reset action'
        ? ref.current?.dispatch(CommonActions.reset(nextState))
        : ref.current?.resetRoot(nextState)
    );

    expect(onBeforeRemove.lex2).toHaveBeenCalledTimes(2);
    expect(onBeforeRemove.lex1).toHaveBeenCalledTimes(1);

    expect(ref.current?.getRootState()).toEqual(state);

    shouldPrevent.lex1 = false;

    act(() =>
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
  (action) => {
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

    render(
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

    act(() =>
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
  (action) => {
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

    render(
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

    act(() =>
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
  (action) => {
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

    render(
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

    act(() =>
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
  (action) => {
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

    render(
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

    act(() =>
      action === 'reset action'
        ? ref.current?.dispatch(CommonActions.reset(nextState))
        : ref.current?.resetRoot(nextState)
    );

    expect(onBeforeRemove).toHaveBeenCalledTimes(1);

    expect(ref.current?.getRootState()).toEqual(state);

    shouldContinue = true;

    act(() =>
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
  (action) => {
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

    render(
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

    act(() =>
      action === 'reset action'
        ? ref.current?.dispatch(CommonActions.reset(nextState))
        : ref.current?.resetRoot(nextState)
    );

    expect(onBeforeRemove).toHaveBeenCalledTimes(1);

    expect(ref.current?.getRootState()).toEqual(state);

    shouldContinue = true;

    act(() =>
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
  (action) => {
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

    render(
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

    act(() =>
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
  (action) => {
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

    render(
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

    act(() =>
      action === 'reset action'
        ? ref.current?.dispatch(CommonActions.reset(nextState))
        : ref.current?.resetRoot(nextState)
    );

    expect(onBeforeRemove).toHaveBeenCalledTimes(1);

    expect(ref.current?.getRootState()).toEqual(state);
  }
);
