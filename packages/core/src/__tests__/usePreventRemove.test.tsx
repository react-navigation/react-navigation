import { beforeEach, expect, jest, test } from '@jest/globals';
import {
  type NavigationAction,
  type ParamListBase,
  StackActions,
  StackRouter,
} from '@react-navigation/routers';
import { act, render } from '@testing-library/react-native';
import * as React from 'react';

import { BaseNavigationContainer } from '../BaseNavigationContainer';
import { createNavigationContainerRef } from '../createNavigationContainerRef';
import type { PreventedRoutes } from '../PreventRemoveContext';
import { Screen } from '../Screen';
import { useNavigationBuilder } from '../useNavigationBuilder';
import { usePreventRemove } from '../usePreventRemove';
import { usePreventRemoveContext } from '../usePreventRemoveContext';
import { MockRouterKey } from './__fixtures__/MockRouter';

jest.mock('nanoid/non-secure', () => {
  const m = { nanoid: () => String(++m.__key), __key: 0 };

  return m;
});

beforeEach(() => {
  MockRouterKey.current = 0;

  require('nanoid/non-secure').__key = 0;
});

test("prevents removing a screen with 'usePreventRemove' hook", async () => {
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

  const onPreventRemove = jest.fn();

  let shouldContinue = false;

  const TestScreen = (props: any) => {
    usePreventRemove(true, ({ data }) => {
      onPreventRemove();
      if (shouldContinue) {
        props.navigation.dispatch(data.action);
      }
    });

    return null;
  };

  const onStateChange = jest.fn();

  const ref = createNavigationContainerRef<ParamListBase, NavigationAction>();

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
      { key: 'baz-7', name: 'baz' },
    ],
    stale: false,
    type: 'stack',
  });

  await act(() => ref.current?.dispatch(StackActions.popTo('foo')));

  expect(onStateChange).toHaveBeenCalledTimes(2);
  expect(onPreventRemove).toHaveBeenCalledTimes(1);

  expect(ref.current?.getRootState()).toEqual({
    index: 2,
    key: 'stack-2',
    retainedRouteKeys: [],
    routeNames: ['foo', 'bar', 'baz'],
    routes: [
      { key: 'foo-3', name: 'foo' },
      { key: 'bar-5', name: 'bar' },
      { key: 'baz-7', name: 'baz' },
    ],
    stale: false,
    type: 'stack',
  });

  shouldContinue = true;

  await act(() => ref.current?.navigate('bar'));
  await act(() => ref.current?.dispatch(StackActions.popTo('foo')));

  expect(onStateChange).toHaveBeenCalledTimes(4);
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

test("prevents removing a screen when 'usePreventRemove' hook is called multiple times", async () => {
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

  const onPreventRemove = jest.fn();

  let shouldContinue = false;

  const TestScreen = (props: any) => {
    usePreventRemove(false, () => {});
    usePreventRemove(true, ({ data }) => {
      onPreventRemove();
      if (shouldContinue) {
        props.navigation.dispatch(data.action);
      }
    });
    usePreventRemove(false, () => {});

    return null;
  };

  const onStateChange = jest.fn();

  const ref = createNavigationContainerRef<ParamListBase, NavigationAction>();

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
      { key: 'baz-9', name: 'baz' },
    ],
    stale: false,
    type: 'stack',
  });

  await act(() => ref.current?.dispatch(StackActions.popTo('foo')));

  expect(onStateChange).toHaveBeenCalledTimes(2);
  expect(onPreventRemove).toHaveBeenCalledTimes(1);

  expect(ref.current?.getRootState()).toEqual({
    index: 2,
    key: 'stack-2',
    retainedRouteKeys: [],
    routeNames: ['foo', 'bar', 'baz'],
    routes: [
      { key: 'foo-3', name: 'foo' },
      { key: 'bar-5', name: 'bar' },
      { key: 'baz-9', name: 'baz' },
    ],
    stale: false,
    type: 'stack',
  });

  shouldContinue = true;

  await act(() => ref.current?.navigate('bar'));
  await act(() => ref.current?.dispatch(StackActions.popTo('foo')));

  expect(onStateChange).toHaveBeenCalledTimes(4);
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

test("doesn't prevent retaining a screen in inactive routes", async () => {
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

  const onPreventRemove = jest.fn();

  const TestScreen = () => {
    usePreventRemove(true, onPreventRemove);

    return null;
  };

  const ref = createNavigationContainerRef<ParamListBase, NavigationAction>();

  await render(
    <BaseNavigationContainer ref={ref}>
      <TestNavigator>
        <Screen name="foo">{() => null}</Screen>
        <Screen name="bar" component={TestScreen} />
        <Screen name="baz">{() => null}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await act(() => ref.current?.navigate('bar'));
  await act(() => ref.current?.dispatch(StackActions.retain(true)));
  await act(() => ref.current?.navigate('baz'));
  await act(() => ref.current?.dispatch(StackActions.popTo('foo')));

  expect(onPreventRemove).not.toHaveBeenCalled();

  expect(ref.current?.getRootState()).toEqual(
    expect.objectContaining({
      index: 0,
      routes: [
        { key: 'foo-3', name: 'foo' },
        { key: 'bar-5', name: 'bar' },
      ],
      retainedRouteKeys: ['bar-5'],
    })
  );
});

test("should have no effect when 'usePreventRemove' hook is set to false", async () => {
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

  const onPreventRemove = jest.fn();

  const TestScreen = () => {
    usePreventRemove(false, () => {
      onPreventRemove();
    });

    return null;
  };

  const onStateChange = jest.fn();

  const ref = createNavigationContainerRef<ParamListBase, NavigationAction>();

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
      { key: 'baz-7', name: 'baz' },
    ],
    stale: false,
    type: 'stack',
  });

  await act(() => ref.current?.dispatch(StackActions.popTo('foo')));

  expect(onStateChange).toHaveBeenCalledTimes(3);

  expect(ref.current?.getRootState()).toEqual({
    index: 0,
    key: 'stack-2',
    retainedRouteKeys: [],
    routeNames: ['foo', 'bar', 'baz'],
    routes: [{ key: 'foo-3', name: 'foo' }],
    stale: false,
    type: 'stack',
  });

  await act(() => ref.current?.navigate('bar'));
  await act(() => ref.current?.dispatch(StackActions.popTo('foo')));

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

  expect(onPreventRemove).toHaveBeenCalledTimes(0);
});

test("prevents removing a child screen with 'usePreventRemove' hook", async () => {
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

  const onPreventRemove = jest.fn();

  let shouldContinue = false;

  const TestScreen = (props: any) => {
    usePreventRemove(true, ({ data }) => {
      onPreventRemove();
      if (shouldContinue) {
        props.navigation.dispatch(data.action);
      }
    });

    return null;
  };
  const onStateChange = jest.fn();

  const ref = createNavigationContainerRef<ParamListBase, NavigationAction>();

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
  expect(onPreventRemove).toHaveBeenCalledTimes(1);

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

  await act(() => ref.current?.dispatch(StackActions.popTo('foo')));

  expect(onStateChange).toHaveBeenCalledTimes(2);
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

  shouldContinue = true;

  await act(() => ref.current?.navigate('bar'));
  await act(() => ref.current?.dispatch(StackActions.popTo('foo')));

  expect(onStateChange).toHaveBeenCalledTimes(4);
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

test("prevents removing a hidden screen with 'usePreventRemove' hook", async () => {
  const TestNavigator = (props: any) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      StackRouter,
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

  const onPreventRemove = jest.fn();

  const TestScreen = () => {
    usePreventRemove(true, () => {
      onPreventRemove();
    });

    return null;
  };

  const onStateChange = jest.fn();

  const ref = createNavigationContainerRef<ParamListBase>();

  await render(
    <BaseNavigationContainer ref={ref} onStateChange={onStateChange}>
      <TestNavigator>
        <Screen name="foo" component={TestScreen} />
        <Screen name="bar">{() => null}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await act(() => ref.current?.navigate('bar'));

  const state = ref.current?.getRootState();

  await act(() => {
    ref.current?.resetRoot({
      index: 0,
      routes: [{ name: 'bar' }],
    });
  });

  expect(onPreventRemove).toHaveBeenCalledTimes(1);
  expect(ref.current?.getRootState()).toEqual(state);
});

test("prevents removing a grand child screen with 'usePreventRemove' hook", async () => {
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

  const onPreventRemove = jest.fn();

  let shouldContinue = false;

  const TestScreen = (props: any) => {
    usePreventRemove(true, ({ data }) => {
      onPreventRemove();
      if (shouldContinue) {
        props.navigation.dispatch(data.action);
      }
    });

    return null;
  };

  const onStateChange = jest.fn();

  const ref = createNavigationContainerRef<ParamListBase, NavigationAction>();

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
  expect(onPreventRemove).toHaveBeenCalledTimes(1);

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

  shouldContinue = true;

  await act(() => ref.current?.navigate('bar'));
  await act(() => ref.current?.dispatch(StackActions.popTo('foo')));

  expect(onStateChange).toHaveBeenCalledTimes(4);
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

test("prevents removing by multiple screens with 'usePreventRemove' hook", async () => {
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

  const onPreventRemove = {
    bar: jest.fn(),
    baz: jest.fn(),
    lex: jest.fn(),
  };

  const shouldContinue = {
    bar: true,
    baz: true,
    lex: true,
  };

  const TestScreen = (props: any) => {
    usePreventRemove(true, ({ data }) => {
      // @ts-expect-error: we should have the required mocks
      onPreventRemove[props.route.name]();

      // @ts-expect-error: we should have the required properties
      if (!shouldContinue[props.route.name]) {
        props.navigation.dispatch(data.action);
      }
    });

    return null;
  };

  const onStateChange = jest.fn();

  const ref = createNavigationContainerRef<ParamListBase, NavigationAction>();

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
          key: 'stack-11',
          retainedRouteKeys: [],
          routeNames: ['qux'],
          routes: [
            {
              key: 'qux-12',
              name: 'qux',
              state: {
                index: 0,
                key: 'stack-15',
                retainedRouteKeys: [],
                routeNames: ['lex'],
                routes: [{ key: 'lex-16', name: 'lex' }],
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
  expect(onPreventRemove.lex).toHaveBeenCalledTimes(1);

  expect(ref.current?.getRootState()).toEqual(preventedState);

  shouldContinue.lex = false;

  await act(() => ref.current?.dispatch(StackActions.popTo('foo')));

  expect(onStateChange).toHaveBeenCalledTimes(1);
  expect(onPreventRemove.baz).toHaveBeenCalledTimes(1);

  expect(ref.current?.getRootState()).toEqual(preventedState);

  shouldContinue.baz = false;

  await act(() => ref.current?.dispatch(StackActions.popTo('foo')));

  expect(onStateChange).toHaveBeenCalledTimes(1);
  expect(onPreventRemove.bar).toHaveBeenCalledTimes(1);

  expect(ref.current?.getRootState()).toEqual(preventedState);

  shouldContinue.bar = false;

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

test("prevents removing a child screen with 'usePreventRemove' hook with 'resetRoot'", async () => {
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

  const shouldContinue = false;

  const TestScreen = (props: any) => {
    usePreventRemove(true, ({ data }) => {
      if (shouldContinue) {
        props.navigation.dispatch(data.action);
      }
    });

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
});

test('keeps preventing removal while the screen is hidden with an activity', async () => {
  let preventedRoutes: PreventedRoutes = {};

  const PreventedRoutesProbe = () => {
    preventedRoutes = usePreventRemoveContext().preventedRoutes;

    return null;
  };

  const TestNavigator = (props: any) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      StackRouter,
      props
    );

    return (
      <NavigationContent>
        <PreventedRoutesProbe />
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

  const onPreventRemove = jest.fn();

  const TestScreen = () => {
    usePreventRemove(true, onPreventRemove);

    return null;
  };

  const ref = createNavigationContainerRef<ParamListBase, NavigationAction>();

  const element = (
    <BaseNavigationContainer ref={ref}>
      <TestNavigator>
        <Screen name="foo">{() => null}</Screen>
        <Screen name="bar" component={TestScreen} />
        <Screen name="baz">{() => null}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await render(element);

  await act(() => ref.current?.navigate('bar'));
  await act(() => ref.current?.navigate('baz'));

  const barKey = ref.current
    ?.getRootState()
    .routes.find((route) => route.name === 'bar')?.key;

  if (barKey == null) {
    throw new Error("Couldn't find the route for 'bar'");
  }

  expect(preventedRoutes[barKey]).toEqual({ preventRemove: true });

  await act(() => ref.current?.dispatch(StackActions.popTo('foo')));

  expect(onPreventRemove).toHaveBeenCalledTimes(1);

  expect(ref.current?.getRootState()).toMatchObject({
    routes: [{ name: 'foo' }, { name: 'bar' }, { name: 'baz' }],
  });

  expect(preventedRoutes[barKey]).toEqual({ preventRemove: true });
});

test('stops preventing removal when a hidden screen is removed', async () => {
  let preventedRoutes: PreventedRoutes = {};

  const PreventedRoutesProbe = () => {
    preventedRoutes = usePreventRemoveContext().preventedRoutes;

    return null;
  };

  const TestNavigator = (props: any) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      StackRouter,
      props
    );

    return (
      <NavigationContent>
        <PreventedRoutesProbe />
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

  const TestScreen = (props: any) => {
    usePreventRemove(true, ({ data }) => {
      props.navigation.dispatch(data.action);
    });

    return null;
  };

  const ref = createNavigationContainerRef<ParamListBase, NavigationAction>();

  const element = (
    <BaseNavigationContainer ref={ref}>
      <TestNavigator>
        <Screen name="foo">{() => null}</Screen>
        <Screen name="bar" component={TestScreen} />
        <Screen name="baz">{() => null}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await render(element);

  await act(() => ref.current?.navigate('bar'));
  await act(() => ref.current?.navigate('baz'));

  await act(() => ref.current?.dispatch(StackActions.popTo('foo')));

  expect(ref.current?.getRootState()).toMatchObject({
    routes: [{ name: 'foo' }],
  });

  expect(preventedRoutes).toEqual({});
});

test('keeps preventing removal for hidden screens in strict mode', async () => {
  let preventedRoutes: PreventedRoutes = {};

  const PreventedRoutesProbe = () => {
    preventedRoutes = usePreventRemoveContext().preventedRoutes;

    return null;
  };

  const TestNavigator = (props: any) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      StackRouter,
      props
    );

    return (
      <NavigationContent>
        <PreventedRoutesProbe />
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

  const onPreventRemove = jest.fn();

  const TestScreen = () => {
    usePreventRemove(true, onPreventRemove);

    return null;
  };

  const ref = createNavigationContainerRef<ParamListBase, NavigationAction>();

  const element = (
    <React.StrictMode>
      <BaseNavigationContainer ref={ref}>
        <TestNavigator>
          <Screen name="foo">{() => null}</Screen>
          <Screen name="bar" component={TestScreen} />
          <Screen name="baz">{() => null}</Screen>
        </TestNavigator>
      </BaseNavigationContainer>
    </React.StrictMode>
  );

  await render(element);

  await act(() => ref.current?.navigate('bar'));
  await act(() => ref.current?.navigate('baz'));

  const barKey = ref.current
    ?.getRootState()
    .routes.find((route) => route.name === 'bar')?.key;

  if (barKey == null) {
    throw new Error("Couldn't find the route for 'bar'");
  }

  expect(preventedRoutes[barKey]).toEqual({ preventRemove: true });

  await act(() => ref.current?.dispatch(StackActions.popTo('foo')));

  expect(onPreventRemove).toHaveBeenCalledTimes(1);

  expect(ref.current?.getRootState()).toMatchObject({
    routes: [{ name: 'foo' }, { name: 'bar' }, { name: 'baz' }],
  });
});

test('keeps parent prevention when a nested navigator is hidden with an activity', async () => {
  let preventedRoutes: PreventedRoutes = {};

  const PreventedRoutesProbe = () => {
    preventedRoutes = usePreventRemoveContext().preventedRoutes;

    return null;
  };

  const ParentNavigator = (props: any) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      StackRouter,
      props
    );

    return (
      <NavigationContent>
        <PreventedRoutesProbe />
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

  const NestedNavigator = (props: any) => {
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

  const onPreventRemove = jest.fn();

  const InnerScreen = () => {
    usePreventRemove(true, onPreventRemove);

    return null;
  };

  const NestedScreen = () => (
    <NestedNavigator>
      <Screen name="inner" component={InnerScreen} />
    </NestedNavigator>
  );

  const ref = createNavigationContainerRef<ParamListBase, NavigationAction>();

  const element = (
    <BaseNavigationContainer ref={ref}>
      <ParentNavigator>
        <Screen name="home">{() => null}</Screen>
        <Screen name="nested" component={NestedScreen} />
        <Screen name="other">{() => null}</Screen>
      </ParentNavigator>
    </BaseNavigationContainer>
  );

  await render(element);

  await act(() => ref.current?.navigate('nested'));
  await act(() => ref.current?.navigate('other'));

  const nestedKey = ref.current
    ?.getRootState()
    .routes.find((route) => route.name === 'nested')?.key;

  if (nestedKey == null) {
    throw new Error("Couldn't find the route for 'nested'");
  }

  expect(preventedRoutes[nestedKey]).toEqual({ preventRemove: true });

  await act(() => ref.current?.dispatch(StackActions.popTo('home')));

  expect(onPreventRemove).toHaveBeenCalledTimes(1);

  expect(ref.current?.getRootState()).toMatchObject({
    routes: [{ name: 'home' }, { name: 'nested' }, { name: 'other' }],
  });

  expect(preventedRoutes[nestedKey]).toEqual({ preventRemove: true });
});
