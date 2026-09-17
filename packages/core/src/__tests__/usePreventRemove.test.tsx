import { beforeEach, expect, jest, test } from '@jest/globals';
import {
  CommonActions,
  type ParamListBase,
  StackActions,
  StackRouter,
} from '@react-navigation/routers';
import { act, render } from '@testing-library/react-native';
import * as React from 'react';
import { Text } from 'react-native';

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

  // eslint-disable-next-line import-x/no-extraneous-dependencies
  require('nanoid/non-secure').__key = 0;
});

test("prevents removing a screen with 'usePreventRemove' hook", async () => {
  const TestNavigator = (props: any) => {
    const { state, descriptors, render } = useNavigationBuilder(
      StackRouter,
      props
    );

    return render(
      state.routes.map((route) => descriptors[route.key]?.render())
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

  const navigation = createNavigationContainerRef<ParamListBase>();

  const element = (
    <BaseNavigationContainer ref={navigation} onStateChange={onStateChange}>
      <TestNavigator>
        <Screen name="foo">{() => null}</Screen>
        <Screen name="bar" component={TestScreen} />
        <Screen name="baz">{() => null}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await render(element);

  await act(() => navigation.navigate('bar'));

  expect(onStateChange).toHaveBeenCalledTimes(1);
  expect(onStateChange).toHaveBeenCalledWith({
    index: 1,
    key: 'stack-1',
    retainedRouteKeys: [],
    routeNames: ['foo', 'bar', 'baz'],
    routes: [
      { key: 'foo-2', name: 'foo' },
      { key: 'bar-3', name: 'bar' },
    ],
    stale: false,
    type: 'stack',
  });

  await act(() => navigation.navigate('baz'));

  expect(onStateChange).toHaveBeenCalledTimes(2);
  expect(onStateChange).toHaveBeenCalledWith({
    index: 2,
    key: 'stack-1',
    retainedRouteKeys: [],
    routeNames: ['foo', 'bar', 'baz'],
    routes: [
      { key: 'foo-2', name: 'foo' },
      { key: 'bar-3', name: 'bar' },
      { key: 'baz-4', name: 'baz' },
    ],
    stale: false,
    type: 'stack',
  });

  await act(() => navigation.dispatch(StackActions.popTo('foo')));

  expect(onStateChange).toHaveBeenCalledTimes(2);
  expect(onPreventRemove).toHaveBeenCalledTimes(1);

  expect(navigation.getRootState()).toEqual({
    index: 2,
    key: 'stack-1',
    retainedRouteKeys: [],
    routeNames: ['foo', 'bar', 'baz'],
    routes: [
      { key: 'foo-2', name: 'foo' },
      { key: 'bar-3', name: 'bar' },
      { key: 'baz-4', name: 'baz' },
    ],
    stale: false,
    type: 'stack',
  });

  shouldContinue = true;

  await act(() => navigation.navigate('bar'));
  await act(() => navigation.dispatch(StackActions.popTo('foo')));

  expect(onStateChange).toHaveBeenCalledTimes(4);
  expect(onStateChange).toHaveBeenCalledWith({
    index: 0,
    key: 'stack-1',
    retainedRouteKeys: [],
    routeNames: ['foo', 'bar', 'baz'],
    routes: [{ key: 'foo-2', name: 'foo' }],
    stale: false,
    type: 'stack',
  });
});

test("prevents removing a screen when 'usePreventRemove' hook is called multiple times", async () => {
  const TestNavigator = (props: any) => {
    const { state, descriptors, render } = useNavigationBuilder(
      StackRouter,
      props
    );

    return render(
      state.routes.map((route) => descriptors[route.key]?.render())
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

  const navigation = createNavigationContainerRef<ParamListBase>();

  const element = (
    <BaseNavigationContainer ref={navigation} onStateChange={onStateChange}>
      <TestNavigator>
        <Screen name="foo">{() => null}</Screen>
        <Screen name="bar" component={TestScreen} />
        <Screen name="baz">{() => null}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await render(element);

  await act(() => navigation.navigate('bar'));

  expect(onStateChange).toHaveBeenCalledTimes(1);
  expect(onStateChange).toHaveBeenCalledWith({
    index: 1,
    key: 'stack-1',
    retainedRouteKeys: [],
    routeNames: ['foo', 'bar', 'baz'],
    routes: [
      { key: 'foo-2', name: 'foo' },
      { key: 'bar-3', name: 'bar' },
    ],
    stale: false,
    type: 'stack',
  });

  await act(() => navigation.navigate('baz'));

  expect(onStateChange).toHaveBeenCalledTimes(2);
  expect(onStateChange).toHaveBeenCalledWith({
    index: 2,
    key: 'stack-1',
    retainedRouteKeys: [],
    routeNames: ['foo', 'bar', 'baz'],
    routes: [
      { key: 'foo-2', name: 'foo' },
      { key: 'bar-3', name: 'bar' },
      { key: 'baz-4', name: 'baz' },
    ],
    stale: false,
    type: 'stack',
  });

  await act(() => navigation.dispatch(StackActions.popTo('foo')));

  expect(onStateChange).toHaveBeenCalledTimes(2);
  expect(onPreventRemove).toHaveBeenCalledTimes(1);

  expect(navigation.getRootState()).toEqual({
    index: 2,
    key: 'stack-1',
    retainedRouteKeys: [],
    routeNames: ['foo', 'bar', 'baz'],
    routes: [
      { key: 'foo-2', name: 'foo' },
      { key: 'bar-3', name: 'bar' },
      { key: 'baz-4', name: 'baz' },
    ],
    stale: false,
    type: 'stack',
  });

  shouldContinue = true;

  await act(() => navigation.navigate('bar'));
  await act(() => navigation.dispatch(StackActions.popTo('foo')));

  expect(onStateChange).toHaveBeenCalledTimes(4);
  expect(onStateChange).toHaveBeenCalledWith({
    index: 0,
    key: 'stack-1',
    retainedRouteKeys: [],
    routeNames: ['foo', 'bar', 'baz'],
    routes: [{ key: 'foo-2', name: 'foo' }],
    stale: false,
    type: 'stack',
  });
});

test("doesn't prevent retaining a screen in inactive routes", async () => {
  const TestNavigator = (props: any) => {
    const { state, descriptors, render } = useNavigationBuilder(
      StackRouter,
      props
    );

    return render(
      state.routes.map((route) => descriptors[route.key]?.render())
    );
  };

  const onPreventRemove = jest.fn();

  const TestScreen = () => {
    usePreventRemove(true, onPreventRemove);

    return null;
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  await render(
    <BaseNavigationContainer ref={navigation}>
      <TestNavigator>
        <Screen name="foo">{() => null}</Screen>
        <Screen name="bar" component={TestScreen} />
        <Screen name="baz">{() => null}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await act(() => navigation.navigate('bar'));
  await act(() => navigation.dispatch(StackActions.retain(true)));
  await act(() => navigation.navigate('baz'));
  await act(() => navigation.dispatch(StackActions.popTo('foo')));

  expect(onPreventRemove).not.toHaveBeenCalled();

  expect(navigation.getRootState()).toEqual(
    expect.objectContaining({
      index: 0,
      routes: [
        { key: 'foo-2', name: 'foo' },
        { key: 'bar-3', name: 'bar' },
      ],
      retainedRouteKeys: ['bar-3'],
    })
  );
});

test("should have no effect when 'usePreventRemove' hook is set to false", async () => {
  const TestNavigator = (props: any) => {
    const { state, descriptors, render } = useNavigationBuilder(
      StackRouter,
      props
    );

    return render(
      state.routes.map((route) => descriptors[route.key]?.render())
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

  const navigation = createNavigationContainerRef<ParamListBase>();

  const element = (
    <BaseNavigationContainer ref={navigation} onStateChange={onStateChange}>
      <TestNavigator>
        <Screen name="foo">{() => null}</Screen>
        <Screen name="bar" component={TestScreen} />
        <Screen name="baz">{() => null}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await render(element);

  await act(() => navigation.navigate('bar'));

  expect(onStateChange).toHaveBeenCalledTimes(1);
  expect(onStateChange).toHaveBeenCalledWith({
    index: 1,
    key: 'stack-1',
    retainedRouteKeys: [],
    routeNames: ['foo', 'bar', 'baz'],
    routes: [
      { key: 'foo-2', name: 'foo' },
      { key: 'bar-3', name: 'bar' },
    ],
    stale: false,
    type: 'stack',
  });

  await act(() => navigation.navigate('baz'));

  expect(onStateChange).toHaveBeenCalledTimes(2);
  expect(onStateChange).toHaveBeenCalledWith({
    index: 2,
    key: 'stack-1',
    retainedRouteKeys: [],
    routeNames: ['foo', 'bar', 'baz'],
    routes: [
      { key: 'foo-2', name: 'foo' },
      { key: 'bar-3', name: 'bar' },
      { key: 'baz-4', name: 'baz' },
    ],
    stale: false,
    type: 'stack',
  });

  await act(() => navigation.dispatch(StackActions.popTo('foo')));

  expect(onStateChange).toHaveBeenCalledTimes(3);

  expect(navigation.getRootState()).toEqual({
    index: 0,
    key: 'stack-1',
    retainedRouteKeys: [],
    routeNames: ['foo', 'bar', 'baz'],
    routes: [{ key: 'foo-2', name: 'foo' }],
    stale: false,
    type: 'stack',
  });

  await act(() => navigation.navigate('bar'));
  await act(() => navigation.dispatch(StackActions.popTo('foo')));

  expect(onStateChange).toHaveBeenCalledTimes(5);
  expect(onStateChange).toHaveBeenCalledWith({
    index: 0,
    key: 'stack-1',
    retainedRouteKeys: [],
    routeNames: ['foo', 'bar', 'baz'],
    routes: [{ key: 'foo-2', name: 'foo' }],
    stale: false,
    type: 'stack',
  });

  expect(onPreventRemove).toHaveBeenCalledTimes(0);
});

test("prevents removing a child screen with 'usePreventRemove' hook", async () => {
  const TestNavigator = (props: any) => {
    const { state, descriptors, render } = useNavigationBuilder(
      StackRouter,
      props
    );

    return render(
      state.routes.map((route) => descriptors[route.key]?.render())
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

  const navigation = createNavigationContainerRef<ParamListBase>();

  const element = (
    <BaseNavigationContainer ref={navigation} onStateChange={onStateChange}>
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

  await act(() => navigation.navigate('bar'));

  expect(onStateChange).toHaveBeenCalledTimes(1);
  expect(onStateChange).toHaveBeenCalledWith({
    index: 1,
    key: 'stack-1',
    retainedRouteKeys: [],
    routeNames: ['foo', 'bar', 'baz'],
    routes: [
      { key: 'foo-2', name: 'foo' },
      { key: 'bar-3', name: 'bar' },
    ],
    stale: false,
    type: 'stack',
  });

  await act(() => navigation.navigate('baz'));

  expect(onStateChange).toHaveBeenCalledTimes(2);
  expect(onStateChange).toHaveBeenCalledWith({
    index: 2,
    key: 'stack-1',
    retainedRouteKeys: [],
    routeNames: ['foo', 'bar', 'baz'],
    routes: [
      { key: 'foo-2', name: 'foo' },
      { key: 'bar-3', name: 'bar' },
      {
        key: 'baz-4',
        name: 'baz',
        state: {
          index: 0,
          key: 'stack-5',
          retainedRouteKeys: [],
          routeNames: ['qux', 'lex'],
          routes: [{ key: 'qux-6', name: 'qux' }],
          stale: false,
          type: 'stack',
        },
      },
    ],
    stale: false,
    type: 'stack',
  });

  await act(() => navigation.dispatch(StackActions.popTo('foo')));

  expect(onStateChange).toHaveBeenCalledTimes(2);
  expect(onPreventRemove).toHaveBeenCalledTimes(1);

  expect(navigation.getRootState()).toEqual({
    index: 2,
    key: 'stack-1',
    retainedRouteKeys: [],
    routeNames: ['foo', 'bar', 'baz'],
    routes: [
      { key: 'foo-2', name: 'foo' },
      { key: 'bar-3', name: 'bar' },
      {
        key: 'baz-4',
        name: 'baz',
        state: {
          index: 0,
          key: 'stack-5',
          retainedRouteKeys: [],
          routeNames: ['qux', 'lex'],
          routes: [{ key: 'qux-6', name: 'qux' }],
          stale: false,
          type: 'stack',
        },
      },
    ],
    stale: false,
    type: 'stack',
  });

  await act(() => navigation.dispatch(StackActions.popTo('foo')));

  expect(onStateChange).toHaveBeenCalledTimes(2);
  expect(navigation.getRootState()).toEqual({
    index: 2,
    key: 'stack-1',
    retainedRouteKeys: [],
    routeNames: ['foo', 'bar', 'baz'],
    routes: [
      { key: 'foo-2', name: 'foo' },
      { key: 'bar-3', name: 'bar' },
      {
        key: 'baz-4',
        name: 'baz',
        state: {
          index: 0,
          key: 'stack-5',
          retainedRouteKeys: [],
          routeNames: ['qux', 'lex'],
          routes: [{ key: 'qux-6', name: 'qux' }],
          stale: false,
          type: 'stack',
        },
      },
    ],
    stale: false,
    type: 'stack',
  });

  shouldContinue = true;

  await act(() => navigation.navigate('bar'));
  await act(() => navigation.dispatch(StackActions.popTo('foo')));

  expect(onStateChange).toHaveBeenCalledTimes(4);
  expect(onStateChange).toHaveBeenCalledWith({
    index: 0,
    key: 'stack-1',
    retainedRouteKeys: [],
    routeNames: ['foo', 'bar', 'baz'],
    routes: [{ key: 'foo-2', name: 'foo' }],
    stale: false,
    type: 'stack',
  });
});

test("prevents removing a hidden screen with 'usePreventRemove' hook", async () => {
  const TestNavigator = (props: any) => {
    const { state, descriptors, render } = useNavigationBuilder(
      StackRouter,
      props
    );

    return render(
      state.routes.map((route, index) => (
        <React.Activity
          key={route.key}
          mode={index === state.index ? 'visible' : 'hidden'}
        >
          {descriptors[route.key]?.render()}
        </React.Activity>
      ))
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

  const navigation = createNavigationContainerRef<ParamListBase>();

  await render(
    <BaseNavigationContainer ref={navigation} onStateChange={onStateChange}>
      <TestNavigator>
        <Screen name="foo" component={TestScreen} />
        <Screen name="bar">{() => null}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await act(() => navigation.navigate('bar'));

  const state = navigation.getRootState();

  await act(() => {
    navigation.resetRoot({
      index: 0,
      routes: [{ name: 'bar' }],
    });
  });

  expect(onPreventRemove).toHaveBeenCalledTimes(1);
  expect(navigation.getRootState()).toEqual(state);
});

test("prevents removing a grand child screen with 'usePreventRemove' hook", async () => {
  const TestNavigator = (props: any) => {
    const { state, descriptors, render } = useNavigationBuilder(
      StackRouter,
      props
    );

    return render(
      state.routes.map((route) => descriptors[route.key]?.render())
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

  const navigation = createNavigationContainerRef<ParamListBase>();

  const element = (
    <BaseNavigationContainer ref={navigation} onStateChange={onStateChange}>
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

  await act(() => navigation.navigate('bar'));

  expect(onStateChange).toHaveBeenCalledTimes(1);
  expect(onStateChange).toHaveBeenCalledWith({
    index: 1,
    key: 'stack-1',
    retainedRouteKeys: [],
    routeNames: ['foo', 'bar', 'baz'],
    routes: [
      { key: 'foo-2', name: 'foo' },
      { key: 'bar-3', name: 'bar' },
    ],
    stale: false,
    type: 'stack',
  });

  await act(() => navigation.navigate('baz'));

  expect(onStateChange).toHaveBeenCalledTimes(2);
  expect(onStateChange).toHaveBeenCalledWith({
    index: 2,
    key: 'stack-1',
    retainedRouteKeys: [],
    routeNames: ['foo', 'bar', 'baz'],
    routes: [
      { key: 'foo-2', name: 'foo' },
      { key: 'bar-3', name: 'bar' },
      {
        key: 'baz-4',
        name: 'baz',
        state: {
          index: 0,
          key: 'stack-5',
          retainedRouteKeys: [],
          routeNames: ['qux'],
          routes: [
            {
              key: 'qux-6',
              name: 'qux',
              state: {
                index: 0,
                key: 'stack-7',
                retainedRouteKeys: [],
                routeNames: ['lex'],
                routes: [{ key: 'lex-8', name: 'lex' }],
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

  await act(() => navigation.dispatch(StackActions.popTo('foo')));

  expect(onStateChange).toHaveBeenCalledTimes(2);
  expect(onPreventRemove).toHaveBeenCalledTimes(1);

  expect(navigation.getRootState()).toEqual({
    index: 2,
    key: 'stack-1',
    retainedRouteKeys: [],
    routeNames: ['foo', 'bar', 'baz'],
    routes: [
      { key: 'foo-2', name: 'foo' },
      { key: 'bar-3', name: 'bar' },
      {
        key: 'baz-4',
        name: 'baz',
        state: {
          index: 0,
          key: 'stack-5',
          retainedRouteKeys: [],
          routeNames: ['qux'],
          routes: [
            {
              key: 'qux-6',
              name: 'qux',
              state: {
                index: 0,
                key: 'stack-7',
                retainedRouteKeys: [],
                routeNames: ['lex'],
                routes: [{ key: 'lex-8', name: 'lex' }],
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

  await act(() => navigation.navigate('bar'));
  await act(() => navigation.dispatch(StackActions.popTo('foo')));

  expect(onStateChange).toHaveBeenCalledTimes(4);
  expect(onStateChange).toHaveBeenCalledWith({
    index: 0,
    key: 'stack-1',
    retainedRouteKeys: [],
    routeNames: ['foo', 'bar', 'baz'],
    routes: [{ key: 'foo-2', name: 'foo' }],
    stale: false,
    type: 'stack',
  });
});

test("prevents removing by multiple screens with 'usePreventRemove' hook", async () => {
  const TestNavigator = (props: any) => {
    const { state, descriptors, render } = useNavigationBuilder(
      StackRouter,
      props
    );

    return render(
      state.routes.map((route) => descriptors[route.key]?.render())
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

  const navigation = createNavigationContainerRef<ParamListBase>();

  const element = (
    <BaseNavigationContainer ref={navigation} onStateChange={onStateChange}>
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
    navigation.navigate('bar');
    navigation.navigate('baz');
    navigation.navigate('bax');
  });

  const preventedState = {
    index: 3,
    key: 'stack-1',
    retainedRouteKeys: [],
    routeNames: ['foo', 'bar', 'baz', 'bax'],
    routes: [
      { key: 'foo-2', name: 'foo' },
      { key: 'bar-3', name: 'bar' },
      { key: 'baz-4', name: 'baz' },
      {
        key: 'bax-5',
        name: 'bax',
        state: {
          index: 0,
          key: 'stack-6',
          retainedRouteKeys: [],
          routeNames: ['qux'],
          routes: [
            {
              key: 'qux-7',
              name: 'qux',
              state: {
                index: 0,
                key: 'stack-8',
                retainedRouteKeys: [],
                routeNames: ['lex'],
                routes: [{ key: 'lex-9', name: 'lex' }],
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

  await act(() => navigation.dispatch(StackActions.popTo('foo')));

  expect(onStateChange).toHaveBeenCalledTimes(1);
  expect(onPreventRemove.lex).toHaveBeenCalledTimes(1);

  expect(navigation.getRootState()).toEqual(preventedState);

  shouldContinue.lex = false;

  await act(() => navigation.dispatch(StackActions.popTo('foo')));

  expect(onStateChange).toHaveBeenCalledTimes(1);
  expect(onPreventRemove.baz).toHaveBeenCalledTimes(1);

  expect(navigation.getRootState()).toEqual(preventedState);

  shouldContinue.baz = false;

  await act(() => navigation.dispatch(StackActions.popTo('foo')));

  expect(onStateChange).toHaveBeenCalledTimes(1);
  expect(onPreventRemove.bar).toHaveBeenCalledTimes(1);

  expect(navigation.getRootState()).toEqual(preventedState);

  shouldContinue.bar = false;

  await act(() => navigation.dispatch(StackActions.popTo('foo')));

  expect(onStateChange).toHaveBeenCalledTimes(2);
  expect(onStateChange).toHaveBeenCalledWith({
    index: 0,
    key: 'stack-1',
    retainedRouteKeys: [],
    routeNames: ['foo', 'bar', 'baz', 'bax'],
    routes: [{ key: 'foo-2', name: 'foo' }],
    stale: false,
    type: 'stack',
  });
});

test("prevents removing a child screen with 'usePreventRemove' hook with 'resetRoot'", async () => {
  const TestNavigator = (props: any) => {
    const { state, descriptors, render } = useNavigationBuilder(
      StackRouter,
      props
    );

    return render(
      state.routes.map((route) => descriptors[route.key]?.render())
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

  const navigation = createNavigationContainerRef<ParamListBase>();

  const element = (
    <BaseNavigationContainer ref={navigation} onStateChange={onStateChange}>
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

  await act(() => navigation.navigate('baz'));

  expect(onStateChange).toHaveBeenCalledTimes(1);
  expect(onStateChange).toHaveBeenCalledWith({
    index: 1,
    key: 'stack-1',
    retainedRouteKeys: [],
    routeNames: ['foo', 'bar', 'baz'],
    routes: [
      { key: 'foo-2', name: 'foo' },
      {
        key: 'baz-3',
        name: 'baz',
        state: {
          index: 0,
          key: 'stack-4',
          retainedRouteKeys: [],
          routeNames: ['qux', 'lex'],
          routes: [{ key: 'qux-5', name: 'qux' }],
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
      key: 'stack-1',
      routeNames: ['foo', 'bar', 'baz'],
      routes: [{ key: 'foo-2', name: 'foo' }],
      retainedRouteKeys: [],
      stale: false,
      type: 'stack',
    };

    navigation.resetRoot(state);
  });

  expect(onStateChange).toHaveBeenCalledTimes(1);

  expect(navigation.getRootState()).toEqual({
    index: 1,
    key: 'stack-1',
    retainedRouteKeys: [],
    routeNames: ['foo', 'bar', 'baz'],
    routes: [
      { key: 'foo-2', name: 'foo' },
      {
        key: 'baz-3',
        name: 'baz',
        state: {
          index: 0,
          key: 'stack-4',
          retainedRouteKeys: [],
          routeNames: ['qux', 'lex'],
          routes: [{ key: 'qux-5', name: 'qux' }],
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
    const { state, descriptors, render } = useNavigationBuilder(
      StackRouter,
      props
    );

    return render(
      <>
        <PreventedRoutesProbe />
        {state.routes.map((route, index) => (
          <React.Activity
            key={route.key}
            mode={index === state.index ? 'visible' : 'hidden'}
          >
            {descriptors[route.key]?.render()}
          </React.Activity>
        ))}
      </>
    );
  };

  const onPreventRemove = jest.fn();

  const TestScreen = () => {
    usePreventRemove(true, onPreventRemove);

    return null;
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  const element = (
    <BaseNavigationContainer ref={navigation}>
      <TestNavigator>
        <Screen name="foo">{() => null}</Screen>
        <Screen name="bar" component={TestScreen} />
        <Screen name="baz">{() => null}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await render(element);

  await act(() => navigation.navigate('bar'));
  await act(() => navigation.navigate('baz'));

  const barKey = navigation
    .getRootState()
    ?.routes.find((route) => route.name === 'bar')?.key;

  if (barKey == null) {
    throw new Error("Couldn't find the route for 'bar'");
  }

  expect(preventedRoutes[barKey]).toEqual({ preventRemove: true });

  await act(() => navigation.dispatch(StackActions.popTo('foo')));

  expect(onPreventRemove).toHaveBeenCalledTimes(1);

  expect(navigation.getRootState()).toMatchObject({
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
    const { state, descriptors, render } = useNavigationBuilder(
      StackRouter,
      props
    );

    return render(
      <>
        <PreventedRoutesProbe />
        {state.routes.map((route, index) => (
          <React.Activity
            key={route.key}
            mode={index === state.index ? 'visible' : 'hidden'}
          >
            {descriptors[route.key]?.render()}
          </React.Activity>
        ))}
      </>
    );
  };

  const TestScreen = (props: any) => {
    usePreventRemove(true, ({ data }) => {
      props.navigation.dispatch(data.action);
    });

    return null;
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  const element = (
    <BaseNavigationContainer ref={navigation}>
      <TestNavigator>
        <Screen name="foo">{() => null}</Screen>
        <Screen name="bar" component={TestScreen} />
        <Screen name="baz">{() => null}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await render(element);

  await act(() => navigation.navigate('bar'));
  await act(() => navigation.navigate('baz'));

  await act(() => navigation.dispatch(StackActions.popTo('foo')));

  expect(navigation.getRootState()).toMatchObject({
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
    const { state, descriptors, render } = useNavigationBuilder(
      StackRouter,
      props
    );

    return render(
      <>
        <PreventedRoutesProbe />
        {state.routes.map((route, index) => (
          <React.Activity
            key={route.key}
            mode={index === state.index ? 'visible' : 'hidden'}
          >
            {descriptors[route.key]?.render()}
          </React.Activity>
        ))}
      </>
    );
  };

  const onPreventRemove = jest.fn();

  const TestScreen = () => {
    usePreventRemove(true, onPreventRemove);

    return null;
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  const element = (
    <React.StrictMode>
      <BaseNavigationContainer ref={navigation}>
        <TestNavigator>
          <Screen name="foo">{() => null}</Screen>
          <Screen name="bar" component={TestScreen} />
          <Screen name="baz">{() => null}</Screen>
        </TestNavigator>
      </BaseNavigationContainer>
    </React.StrictMode>
  );

  await render(element);

  await act(() => navigation.navigate('bar'));
  await act(() => navigation.navigate('baz'));

  const barKey = navigation
    .getRootState()
    ?.routes.find((route) => route.name === 'bar')?.key;

  if (barKey == null) {
    throw new Error("Couldn't find the route for 'bar'");
  }

  expect(preventedRoutes[barKey]).toEqual({ preventRemove: true });

  await act(() => navigation.dispatch(StackActions.popTo('foo')));

  expect(onPreventRemove).toHaveBeenCalledTimes(1);

  expect(navigation.getRootState()).toMatchObject({
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
    const { state, descriptors, render } = useNavigationBuilder(
      StackRouter,
      props
    );

    return render(
      <>
        <PreventedRoutesProbe />
        {state.routes.map((route, index) => (
          <React.Activity
            key={route.key}
            mode={index === state.index ? 'visible' : 'hidden'}
          >
            {descriptors[route.key]?.render()}
          </React.Activity>
        ))}
      </>
    );
  };

  const NestedNavigator = (props: any) => {
    const { state, descriptors, render } = useNavigationBuilder(
      StackRouter,
      props
    );

    return render(
      state.routes.map((route) => descriptors[route.key]?.render())
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

  const navigation = createNavigationContainerRef<ParamListBase>();

  const element = (
    <BaseNavigationContainer ref={navigation}>
      <ParentNavigator>
        <Screen name="home">{() => null}</Screen>
        <Screen name="nested" component={NestedScreen} />
        <Screen name="other">{() => null}</Screen>
      </ParentNavigator>
    </BaseNavigationContainer>
  );

  await render(element);

  await act(() => navigation.navigate('nested'));
  await act(() => navigation.navigate('other'));

  const nestedKey = navigation
    .getRootState()
    ?.routes.find((route) => route.name === 'nested')?.key;

  if (nestedKey == null) {
    throw new Error("Couldn't find the route for 'nested'");
  }

  expect(preventedRoutes[nestedKey]).toEqual({ preventRemove: true });

  await act(() => navigation.dispatch(StackActions.popTo('home')));

  expect(onPreventRemove).toHaveBeenCalledTimes(1);

  expect(navigation.getRootState()).toMatchObject({
    routes: [{ name: 'home' }, { name: 'nested' }, { name: 'other' }],
  });

  expect(preventedRoutes[nestedKey]).toEqual({ preventRemove: true });
});

test('registers removal prevention for a visible screen during a suspended reset', async () => {
  const { promise, resolve } = Promise.withResolvers<void>();

  const navigation = createNavigationContainerRef<ParamListBase>();

  const onPreventRemove = jest.fn();

  let enablePrevention: () => void;
  let preventedRoutes: PreventedRoutes = {};

  const PreventedRoutesProbe = () => {
    preventedRoutes = usePreventRemoveContext().preventedRoutes;

    return null;
  };

  const TestNavigator = (props: Parameters<typeof useNavigationBuilder>[1]) => {
    const { state, descriptors, render } = useNavigationBuilder(
      StackRouter,
      props
    );

    return render(
      <>
        <PreventedRoutesProbe />
        {state.routes.map((route) => descriptors[route.key]?.render())}
      </>
    );
  };

  const First = () => {
    const [prevent, setPrevent] = React.useState(false);

    enablePrevention = () => setPrevent(true);

    usePreventRemove(prevent, onPreventRemove);

    return (
      <Text>First: {prevent ? 'removal prevented' : 'removal allowed'}</Text>
    );
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

  const initialState = navigation.getRootState();
  const firstKey = initialState?.routes[0]?.key;

  if (firstKey == null) {
    throw new Error("Couldn't find the route for 'First'");
  }

  expect(preventedRoutes).toEqual({});

  await act(() =>
    navigation.dispatch(
      CommonActions.reset({ index: 0, routes: [{ name: 'Second' }] })
    )
  );

  expect(navigation.getCurrentRoute()?.name).toBe('Second');

  expect(root.getByText('First: removal allowed')).toBeVisible();
  expect(root.queryByText('Second')).toBeNull();

  await act(() => enablePrevention());

  expect(root.getByText('First: removal prevented')).toBeVisible();

  expect(preventedRoutes[firstKey]).toEqual({ preventRemove: true });

  expect(onPreventRemove).not.toHaveBeenCalled();

  await act(() => navigation.resetRoot(initialState));
  await act(() => resolve());

  await act(() =>
    navigation.dispatch(
      CommonActions.reset({ index: 0, routes: [{ name: 'Second' }] })
    )
  );

  expect(onPreventRemove).toHaveBeenCalledTimes(1);

  expect(navigation.getCurrentRoute()?.name).toBe('First');

  expect(root.getByText('First: removal prevented')).toBeVisible();
  expect(root.queryByText('Second')).toBeNull();
});
