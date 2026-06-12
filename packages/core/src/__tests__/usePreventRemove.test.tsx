import { beforeEach, expect, jest, test } from '@jest/globals';
import {
  type NavigationState,
  type ParamListBase,
  type PartialState,
  StackActions,
  type StackNavigationState,
  StackRouter,
  type TabNavigationState,
  TabRouter,
} from '@react-navigation/routers';
import { act, render } from '@testing-library/react-native';
import * as React from 'react';

import { BaseNavigationContainer } from '../BaseNavigationContainer';
import { createNavigationContainerRef } from '../createNavigationContainerRef';
import { Screen } from '../Screen';
import { useNavigation } from '../useNavigation';
import { useNavigationBuilder } from '../useNavigationBuilder';
import { usePreventRemove } from '../usePreventRemove';
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

  const ref = createNavigationContainerRef<ParamListBase>();

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

test("prevents removing a nested screen with 'usePreventRemove' hook with 'resetRoot' when route keys are unchanged", async () => {
  const TestNavigator = (props: { children: React.ReactNode }) => {
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

  let shouldContinue = false;

  const TestScreen = () => {
    const navigation = useNavigation();

    usePreventRemove(true, ({ data }) => {
      if (shouldContinue) {
        navigation.dispatch(data.action);
      }
    });

    return null;
  };

  const ref = createNavigationContainerRef<ParamListBase>();

  const element = (
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

  await render(element);

  const initialBazState: StackNavigationState<ParamListBase> = {
    stale: false,
    type: 'stack',
    key: 'stack-9',
    index: 1,
    routeNames: ['qux', 'lex'],
    routes: [
      { name: 'qux', key: 'qux-7' },
      { name: 'lex', key: 'lex-8' },
    ],
    retainedRouteKeys: [],
  };

  const initialState: StackNavigationState<ParamListBase> = {
    stale: false,
    type: 'stack',
    key: 'stack-4',
    index: 1,
    routeNames: ['foo', 'baz'],
    routes: [
      { name: 'foo', key: 'foo-2' },
      { name: 'baz', key: 'baz-3', state: initialBazState },
    ],
    retainedRouteKeys: [],
  };

  const recordedBazState: StackNavigationState<ParamListBase> = {
    stale: false,
    type: 'stack',
    key: 'stack-9',
    index: 0,
    routeNames: ['qux', 'lex'],
    routes: [{ name: 'qux', key: 'qux-7' }],
    retainedRouteKeys: [],
  };

  const recordedState: StackNavigationState<ParamListBase> = {
    stale: false,
    type: 'stack',
    key: 'stack-4',
    index: 1,
    routeNames: ['foo', 'baz'],
    routes: [
      { name: 'foo', key: 'foo-2' },
      { name: 'baz', key: 'baz-3', state: recordedBazState },
    ],
    retainedRouteKeys: [],
  };

  await act(() => ref.current?.resetRoot(recordedState));

  expect(ref.current?.getRootState()).toEqual(initialState);

  shouldContinue = true;

  await act(() => ref.current?.resetRoot(recordedState));

  expect(ref.current?.getRootState()).toEqual(recordedState);
});

test("doesn't prevent 'resetRoot' when the nested screen with 'usePreventRemove' hook is kept", async () => {
  const TestNavigator = (props: { children: React.ReactNode }) => {
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

  const TestScreen = () => {
    usePreventRemove(true, () => {});

    return null;
  };

  const ref = createNavigationContainerRef<ParamListBase>();

  const element = (
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

  await render(element);

  const recordedBazState: StackNavigationState<ParamListBase> = {
    stale: false,
    type: 'stack',
    key: 'stack-9',
    index: 0,
    routeNames: ['qux', 'lex'],
    routes: [{ name: 'qux', key: 'qux-7' }],
    retainedRouteKeys: [],
  };

  const recordedState: StackNavigationState<ParamListBase> = {
    stale: false,
    type: 'stack',
    key: 'stack-4',
    index: 1,
    routeNames: ['foo', 'baz'],
    routes: [
      { name: 'foo', key: 'foo-2' },
      { name: 'baz', key: 'baz-3', state: recordedBazState },
    ],
    retainedRouteKeys: [],
  };

  await act(() => ref.current?.resetRoot(recordedState));

  expect(ref.current?.getRootState()).toEqual(recordedState);
});

test("prevents removing by multiple nested screens with 'usePreventRemove' hook with 'resetRoot'", async () => {
  const TestNavigator = (props: { children: React.ReactNode }) => {
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

  let shouldContinue = false;

  const PreventScreen = () => {
    const navigation = useNavigation();

    usePreventRemove(true, ({ data }) => {
      if (shouldContinue) {
        navigation.dispatch(data.action);
      }
    });

    return null;
  };

  const ref = createNavigationContainerRef<ParamListBase>();

  const element = (
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
              <Screen name="lex1" component={PreventScreen} />
            </TestNavigator>
          )}
        </Screen>
        <Screen name="baz2">
          {() => (
            <TestNavigator>
              <Screen name="qux2">{() => null}</Screen>
              <Screen name="lex2" component={PreventScreen} />
            </TestNavigator>
          )}
        </Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await render(element);

  const initialBaz1State: StackNavigationState<ParamListBase> = {
    stale: false,
    type: 'stack',
    key: 'stack-10',
    index: 1,
    routeNames: ['qux1', 'lex1'],
    routes: [
      { name: 'qux1', key: 'qux1-8' },
      { name: 'lex1', key: 'lex1-9' },
    ],
    retainedRouteKeys: [],
  };

  const initialBaz2State: StackNavigationState<ParamListBase> = {
    stale: false,
    type: 'stack',
    key: 'stack-16',
    index: 1,
    routeNames: ['qux2', 'lex2'],
    routes: [
      { name: 'qux2', key: 'qux2-14' },
      { name: 'lex2', key: 'lex2-15' },
    ],
    retainedRouteKeys: [],
  };

  const initialState: StackNavigationState<ParamListBase> = {
    stale: false,
    type: 'stack',
    key: 'stack-5',
    index: 2,
    routeNames: ['foo', 'baz1', 'baz2'],
    routes: [
      { name: 'foo', key: 'foo-2' },
      { name: 'baz1', key: 'baz1-3', state: initialBaz1State },
      { name: 'baz2', key: 'baz2-4', state: initialBaz2State },
    ],
    retainedRouteKeys: [],
  };

  const recordedBaz1State: StackNavigationState<ParamListBase> = {
    stale: false,
    type: 'stack',
    key: 'stack-10',
    index: 0,
    routeNames: ['qux1', 'lex1'],
    routes: [{ name: 'qux1', key: 'qux1-8' }],
    retainedRouteKeys: [],
  };

  const recordedBaz2State: StackNavigationState<ParamListBase> = {
    stale: false,
    type: 'stack',
    key: 'stack-16',
    index: 0,
    routeNames: ['qux2', 'lex2'],
    routes: [{ name: 'qux2', key: 'qux2-14' }],
    retainedRouteKeys: [],
  };

  const recordedState: StackNavigationState<ParamListBase> = {
    stale: false,
    type: 'stack',
    key: 'stack-5',
    index: 2,
    routeNames: ['foo', 'baz1', 'baz2'],
    routes: [
      { name: 'foo', key: 'foo-2' },
      { name: 'baz1', key: 'baz1-3', state: recordedBaz1State },
      { name: 'baz2', key: 'baz2-4', state: recordedBaz2State },
    ],
    retainedRouteKeys: [],
  };

  await act(() => ref.current?.resetRoot(recordedState));

  expect(ref.current?.getRootState()).toEqual(initialState);

  shouldContinue = true;

  await act(() => ref.current?.resetRoot(recordedState));

  expect(ref.current?.getRootState()).toEqual(recordedState);
});

test("prevents removing a grand child screen with 'usePreventRemove' hook with 'resetRoot' when route keys are unchanged", async () => {
  const TestNavigator = (props: { children: React.ReactNode }) => {
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

  const TestScreen = () => {
    usePreventRemove(true, () => {});

    return null;
  };

  const ref = createNavigationContainerRef<ParamListBase>();

  const element = (
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

  await render(element);

  const initialQuxState: StackNavigationState<ParamListBase> = {
    stale: false,
    type: 'stack',
    key: 'stack-13',
    index: 1,
    routeNames: ['lex', 'pax'],
    routes: [
      { name: 'lex', key: 'lex-11' },
      { name: 'pax', key: 'pax-12' },
    ],
    retainedRouteKeys: [],
  };

  const initialBazState: StackNavigationState<ParamListBase> = {
    stale: false,
    type: 'stack',
    key: 'stack-8',
    index: 0,
    routeNames: ['qux'],
    routes: [{ name: 'qux', key: 'qux-7', state: initialQuxState }],
    retainedRouteKeys: [],
  };

  const initialState: StackNavigationState<ParamListBase> = {
    stale: false,
    type: 'stack',
    key: 'stack-4',
    index: 1,
    routeNames: ['foo', 'baz'],
    routes: [
      { name: 'foo', key: 'foo-2' },
      { name: 'baz', key: 'baz-3', state: initialBazState },
    ],
    retainedRouteKeys: [],
  };

  const recordedQuxState: StackNavigationState<ParamListBase> = {
    stale: false,
    type: 'stack',
    key: 'stack-13',
    index: 0,
    routeNames: ['lex', 'pax'],
    routes: [{ name: 'lex', key: 'lex-11' }],
    retainedRouteKeys: [],
  };

  const recordedBazState: StackNavigationState<ParamListBase> = {
    stale: false,
    type: 'stack',
    key: 'stack-8',
    index: 0,
    routeNames: ['qux'],
    routes: [{ name: 'qux', key: 'qux-7', state: recordedQuxState }],
    retainedRouteKeys: [],
  };

  const recordedState: StackNavigationState<ParamListBase> = {
    stale: false,
    type: 'stack',
    key: 'stack-4',
    index: 1,
    routeNames: ['foo', 'baz'],
    routes: [
      { name: 'foo', key: 'foo-2' },
      { name: 'baz', key: 'baz-3', state: recordedBazState },
    ],
    retainedRouteKeys: [],
  };

  await act(() => ref.current?.resetRoot(recordedState));

  expect(ref.current?.getRootState()).toEqual(initialState);
});

test("doesn't prevent changing the nested navigator's index with 'resetRoot'", async () => {
  const TestNavigator = (props: { children: React.ReactNode }) => {
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

  const TestTabNavigator = (props: { children: React.ReactNode }) => {
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

  const TestScreen = () => {
    usePreventRemove(true, () => {});

    return null;
  };

  const ref = createNavigationContainerRef<ParamListBase>();

  const element = (
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

  await render(element);

  const recordedBazState: TabNavigationState<ParamListBase> = {
    stale: false,
    type: 'tab',
    key: 'tab-9',
    index: 0,
    routeNames: ['tabA', 'tabB'],
    history: [{ type: 'route', key: 'tabA-7' }],
    routes: [
      { name: 'tabA', key: 'tabA-7' },
      { name: 'tabB', key: 'tabB-8' },
    ],
    preloadedRouteKeys: [],
  };

  const recordedState: StackNavigationState<ParamListBase> = {
    stale: false,
    type: 'stack',
    key: 'stack-4',
    index: 1,
    routeNames: ['foo', 'baz'],
    routes: [
      { name: 'foo', key: 'foo-2' },
      { name: 'baz', key: 'baz-3', state: recordedBazState },
    ],
    retainedRouteKeys: [],
  };

  await act(() => ref.current?.navigate('tabB'));

  await act(() => ref.current?.resetRoot(recordedState));

  expect(ref.current?.getRootState()).toEqual(recordedState);
});

test("prevents removing a nested screen with 'usePreventRemove' hook with a stale 'resetRoot' state", async () => {
  const TestNavigator = (props: { children: React.ReactNode }) => {
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

  const TestScreen = () => {
    usePreventRemove(true, () => {});

    return null;
  };

  const ref = createNavigationContainerRef<ParamListBase>();

  const element = (
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

  await render(element);

  const initialBazState: StackNavigationState<ParamListBase> = {
    stale: false,
    type: 'stack',
    key: 'stack-9',
    index: 1,
    routeNames: ['qux', 'lex'],
    routes: [
      { name: 'qux', key: 'qux-7' },
      { name: 'lex', key: 'lex-8' },
    ],
    retainedRouteKeys: [],
  };

  const initialState: StackNavigationState<ParamListBase> = {
    stale: false,
    type: 'stack',
    key: 'stack-4',
    index: 1,
    routeNames: ['foo', 'baz'],
    routes: [
      { name: 'foo', key: 'foo-2' },
      { name: 'baz', key: 'baz-3', state: initialBazState },
    ],
    retainedRouteKeys: [],
  };

  const recordedState: PartialState<NavigationState> = {
    index: 1,
    routes: [
      { name: 'foo', key: 'foo-2' },
      {
        name: 'baz',
        key: 'baz-3',
        state: { stale: true, routes: [{ name: 'qux' }] },
      },
    ],
  };

  await act(() => ref.current?.resetRoot(recordedState));

  expect(ref.current?.getRootState()).toEqual(initialState);
});
