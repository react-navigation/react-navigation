import { beforeEach, expect, jest, test } from '@jest/globals';
import {
  CommonActions,
  type NavigationAction,
  type NavigationState,
  type ParamListBase,
  type Router,
  StackRouter,
} from '@react-navigation/routers';
import { act, render } from '@testing-library/react-native';
import * as React from 'react';
import { Text } from 'react-native';

import { BaseNavigationContainer } from '../BaseNavigationContainer';
import { createNavigationContainerRef } from '../createNavigationContainerRef';
import { Group } from '../Group';
import { Screen } from '../Screen';
import { useNavigation } from '../useNavigation';
import { useNavigationBuilder } from '../useNavigationBuilder';
import { MockRouter, MockRouterKey } from './__fixtures__/MockRouter';

const createDeferred = () => {
  let resolve: () => void;

  // eslint-disable-next-line promise/param-names
  const promise = new Promise<void>((res) => {
    resolve = res;
  });

  return { promise, resolve: resolve! };
};

beforeEach(() => {
  MockRouterKey.current = 0;
});

test('initializes state for a navigator on navigation', async () => {
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

  const FooScreen = (props: any) => {
    React.useEffect(() => {
      props.navigation.dispatch({ type: 'UPDATE' });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
  };

  const onStateChange = jest.fn();

  const element = (
    <BaseNavigationContainer onStateChange={onStateChange}>
      <TestNavigator initialRouteName="foo">
        <Screen
          name="foo"
          component={FooScreen}
          initialParams={{ count: 10 }}
        />
        <Screen name="bar" component={React.Fragment} />
        <Screen name="baz">
          {() => (
            <TestNavigator>
              <Screen name="qux" component={React.Fragment} />
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
    index: 0,
    key: '0',
    routeNames: ['foo', 'bar', 'baz'],
    routes: [
      { key: 'foo', name: 'foo', params: { count: 10 } },
      { key: 'bar', name: 'bar' },
      { key: 'baz', name: 'baz' },
    ],
  });
});

test("doesn't crash when initialState is null", async () => {
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

  const TestScreen = () => null;

  const element = (
    // @ts-expect-error: we're explicitly passing null for state
    <BaseNavigationContainer initialState={null}>
      <TestNavigator>
        <Screen name="foo" component={TestScreen} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await expect(render(element)).resolves.toBeDefined();
});

test('throws for incorrect initialRouteName', async () => {
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

  const TestScreen = () => null;

  await expect(
    render(
      <BaseNavigationContainer>
        <TestNavigator initialRouteName="qux">
          <Screen name="foo" component={TestScreen} />
          <Screen name="bar" component={TestScreen} />
          <Screen name="baz" component={TestScreen} />
        </TestNavigator>
      </BaseNavigationContainer>
    )
  ).rejects.toThrow(
    "Couldn't find a screen named 'qux' to use as 'initialRouteName'"
  );

  await expect(
    render(
      <BaseNavigationContainer>
        <TestNavigator initialRouteName="bar">
          <Screen name="foo" component={TestScreen} />
          <Screen name="bar" component={TestScreen} />
          <Screen name="baz" component={TestScreen} />
        </TestNavigator>
      </BaseNavigationContainer>
    )
  ).resolves.toBeDefined();
});

test('rehydrates state for a navigator on navigation', async () => {
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

  const BarScreen = (props: any) => {
    React.useEffect(() => {
      props.navigation.dispatch({ type: 'UPDATE' });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
  };

  const initialState = {
    index: 1,
    routes: [
      { key: 'foo', name: 'foo' },
      { key: 'bar', name: 'bar' },
    ],
  };

  const onStateChange = jest.fn();

  const element = (
    <BaseNavigationContainer
      initialState={initialState}
      onStateChange={onStateChange}
    >
      <TestNavigator initialRouteName="foo">
        <Screen name="foo" component={React.Fragment} />
        <Screen name="bar" component={BarScreen} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await render(element);

  expect(onStateChange).toHaveBeenLastCalledWith({
    index: 1,
    key: '0',
    routeNames: ['foo', 'bar'],
    routes: [
      { key: 'foo', name: 'foo' },
      { key: 'bar', name: 'bar' },
    ],
    stale: false,
    type: 'test',
  });
});

test("doesn't rehydrate state if the type of state didn't match router", async () => {
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

  const FooScreen = (props: any) => {
    React.useEffect(() => {
      props.navigation.dispatch({ type: 'UPDATE' });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
  };

  const initialState = {
    index: 1,
    type: 'something-else',
    routes: [
      { key: 'foo', name: 'foo' },
      { key: 'bar', name: 'bar' },
    ],
  };

  const onStateChange = jest.fn();

  const element = (
    <BaseNavigationContainer
      initialState={initialState}
      onStateChange={onStateChange}
    >
      <TestNavigator initialRouteName="foo">
        <Screen
          name="foo"
          component={FooScreen}
          initialParams={{ answer: 42 }}
        />
        <Screen name="bar" component={React.Fragment} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await render(element);

  expect(onStateChange).toHaveBeenLastCalledWith({
    index: 0,
    key: '0',
    routeNames: ['foo', 'bar'],
    routes: [
      {
        key: 'foo',
        name: 'foo',
        params: { answer: 42 },
      },
      { key: 'bar', name: 'bar' },
    ],
    stale: false,
    type: 'test',
  });
});

test('initializes state for nested screens in React.Fragment', async () => {
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

  const TestScreen = (props: any) => {
    React.useEffect(() => {
      props.navigation.dispatch({ type: 'UPDATE' });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
  };

  const onStateChange = jest.fn();

  const element = (
    <BaseNavigationContainer onStateChange={onStateChange}>
      <TestNavigator>
        <Screen name="foo" component={TestScreen} />
        <React.Fragment>
          <Screen name="bar" component={React.Fragment} />
          <Screen name="baz" component={React.Fragment} />
        </React.Fragment>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await render(element);

  expect(onStateChange).toHaveBeenCalledTimes(1);
  expect(onStateChange).toHaveBeenCalledWith({
    stale: false,
    type: 'test',
    index: 0,
    key: '0',
    routeNames: ['foo', 'bar', 'baz'],
    routes: [
      { key: 'foo', name: 'foo' },
      { key: 'bar', name: 'bar' },
      { key: 'baz', name: 'baz' },
    ],
  });
});

test('initializes state for nested screens in Group', async () => {
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

  const TestScreen = (props: any) => {
    React.useEffect(() => {
      props.navigation.dispatch({ type: 'UPDATE' });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
  };

  const onStateChange = jest.fn();

  const element = (
    <BaseNavigationContainer onStateChange={onStateChange}>
      <TestNavigator>
        <Screen name="foo" component={TestScreen} />
        <Group>
          <Screen name="bar" component={React.Fragment} />
          <Screen name="baz" component={React.Fragment} />
        </Group>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await render(element);

  expect(onStateChange).toHaveBeenCalledTimes(1);
  expect(onStateChange).toHaveBeenCalledWith({
    stale: false,
    type: 'test',
    index: 0,
    key: '0',
    routeNames: ['foo', 'bar', 'baz'],
    routes: [
      { key: 'foo', name: 'foo' },
      { key: 'bar', name: 'bar' },
      { key: 'baz', name: 'baz' },
    ],
  });
});

test('initializes state for nested navigator on navigation', async () => {
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

  const TestScreen = (props: any) => {
    React.useEffect(() => {
      props.navigation.dispatch({ type: 'UPDATE' });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
  };

  const onStateChange = jest.fn();

  const element = (
    <BaseNavigationContainer onStateChange={onStateChange}>
      <TestNavigator initialRouteName="baz">
        <Screen name="foo" component={React.Fragment} />
        <Screen name="bar" component={React.Fragment} />
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

  await render(element);

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
          routeNames: ['qux'],
          routes: [{ key: 'qux', name: 'qux' }],
        },
      },
    ],
  });
});

test("doesn't update state if nothing changed", async () => {
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

  const FooScreen = (props: any) => {
    React.useEffect(() => {
      props.navigation.dispatch({ type: 'NOOP' });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
  };

  const onStateChange = jest.fn();

  await render(
    <BaseNavigationContainer onStateChange={onStateChange}>
      <TestNavigator initialRouteName="foo">
        <Screen name="foo" component={FooScreen} />
        <Screen name="bar" component={React.Fragment} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  expect(onStateChange).toHaveBeenCalledTimes(0);
});

test("doesn't update state if action wasn't handled", async () => {
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

  const FooScreen = (props: any) => {
    React.useEffect(() => {
      props.navigation.dispatch({ type: 'INVALID' });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
  };

  const onStateChange = jest.fn();

  const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

  await render(
    <BaseNavigationContainer onStateChange={onStateChange}>
      <TestNavigator initialRouteName="foo">
        <Screen name="foo" component={FooScreen} />
        <Screen name="bar" component={React.Fragment} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  expect(onStateChange).toHaveBeenCalledTimes(0);

  expect(spy).toHaveBeenCalledTimes(1);
  expect(spy).toHaveBeenCalledWith(
    expect.stringContaining(
      "The action 'INVALID' was not handled by any navigator."
    )
  );

  spy.mockRestore();
});

test('cleans up state when the navigator unmounts', async () => {
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

  const FooScreen = (props: any) => {
    React.useEffect(() => {
      props.navigation.dispatch({ type: 'UPDATE' });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
  };

  const onStateChange = jest.fn();

  const element = (
    <BaseNavigationContainer onStateChange={onStateChange}>
      <TestNavigator>
        <Screen name="foo" component={FooScreen} />
        <Screen name="bar" component={React.Fragment} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  const root = await render(element);

  expect(onStateChange).toHaveBeenCalledTimes(1);
  expect(onStateChange).toHaveBeenLastCalledWith({
    stale: false,
    type: 'test',
    index: 0,
    key: '0',
    routeNames: ['foo', 'bar'],
    routes: [
      { key: 'foo', name: 'foo' },
      { key: 'bar', name: 'bar' },
    ],
  });

  await root.rerender(
    <BaseNavigationContainer onStateChange={onStateChange}>
      {null}
    </BaseNavigationContainer>
  );

  expect(onStateChange).toHaveBeenCalledTimes(2);
  expect(onStateChange).toHaveBeenLastCalledWith(undefined);
});

test('preserves initial state when navigator mount is delayed in StrictMode', async () => {
  const TestNavigator = (props: any): any => {
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

  const TestScreen = ({ route }: any): any => <Text>[{route.name}]</Text>;

  const navigation = createNavigationContainerRef<ParamListBase>();

  const Test = ({ condition }: { condition: boolean }) => (
    <React.StrictMode>
      <BaseNavigationContainer
        ref={navigation}
        initialState={{
          index: 1,
          routes: [{ name: 'foo' }, { name: 'bar' }],
        }}
      >
        {condition ? (
          <TestNavigator>
            <Screen name="foo" component={TestScreen} />
            <Screen name="bar" component={TestScreen} />
          </TestNavigator>
        ) : null}
      </BaseNavigationContainer>
    </React.StrictMode>
  );

  const root = await render(<Test condition={false} />);

  await root.rerender(<Test condition />);

  expect(root).toMatchInlineSnapshot(`
    <Text>
      [
      bar
      ]
    </Text>
  `);
  expect(navigation.getCurrentRoute()?.name).toBe('bar');
});

test('preserves state after rendered in `<Activity mode="hidden">`', async () => {
  const TestNavigator = (props: any): any => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      MockRouter,
      props
    );

    const route = state.routes[state.index];

    if (route == null) {
      return null;
    }

    return (
      <NavigationContent>
        <Text>{state.routes.map((route) => route.name).join(', ')}</Text>
        {descriptors[route.key]?.render()}
      </NavigationContent>
    );
  };

  const TestScreen = ({ route }: any): any => <Text>[{route.name}]</Text>;

  const navigation = createNavigationContainerRef<ParamListBase>();

  const Test = ({ mode }: { mode: 'visible' | 'hidden' }) => (
    <BaseNavigationContainer ref={navigation}>
      <React.Activity mode={mode}>
        <TestNavigator>
          <Screen name="foo" component={TestScreen} />
          <Screen name="bar" component={TestScreen} />
          <Screen name="baz" component={TestScreen} />
        </TestNavigator>
      </React.Activity>
    </BaseNavigationContainer>
  );

  const root = await render(<Test mode="visible" />);

  await act(async () => navigation.navigate('bar'));
  await act(async () => navigation.navigate('baz'));

  expect(root).toMatchInlineSnapshot(`
    <>
      <Text>
        foo, bar, baz
      </Text>
      <Text>
        [
        baz
        ]
      </Text>
    </>
  `);

  await root.rerender(<Test mode="hidden" />);

  expect(root).toMatchInlineSnapshot(`
    <>
      <Text
        style={
          {
            "display": "none",
          }
        }
      >
        foo, bar, baz
      </Text>
      <Text
        style={
          {
            "display": "none",
          }
        }
      >
        [
        baz
        ]
      </Text>
    </>
  `);

  await root.rerender(<Test mode="visible" />);

  expect(root).toMatchInlineSnapshot(`
    <>
      <Text>
        foo, bar, baz
      </Text>
      <Text>
        [
        baz
        ]
      </Text>
    </>
  `);
});

test('handles container ref methods in hidden trees', async () => {
  const TestNavigator = (props: any): any => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      MockRouter,
      props
    );

    const route = state.routes[state.index];

    if (route == null) {
      return null;
    }

    return (
      <NavigationContent>
        <Text>{state.routes.map((route) => route.name).join(', ')}</Text>
        {descriptors[route.key]?.render()}
      </NavigationContent>
    );
  };

  const TestScreen = ({ route }: any): any => <Text>[{route.name}]</Text>;

  const navigation = createNavigationContainerRef<ParamListBase>();

  const Test = ({ mode }: { mode: 'visible' | 'hidden' }) => (
    <BaseNavigationContainer ref={navigation}>
      <React.Activity mode={mode}>
        <TestNavigator>
          <Screen name="foo" component={TestScreen} />
          <Screen name="bar" component={TestScreen} />
          <Screen name="baz" component={TestScreen} />
        </TestNavigator>
      </React.Activity>
    </BaseNavigationContainer>
  );

  const root = await render(<Test mode="visible" />);

  await root.rerender(<Test mode="hidden" />);

  await act(async () => navigation.navigate('baz'));

  expect(navigation.getRootState()).toEqual({
    stale: false,
    type: 'test',
    index: 2,
    key: '0',
    routeNames: ['foo', 'bar', 'baz'],
    routes: [
      { key: 'foo', name: 'foo' },
      { key: 'bar', name: 'bar' },
      { key: 'baz', name: 'baz' },
    ],
  });

  await root.rerender(<Test mode="visible" />);

  expect(root).toMatchInlineSnapshot(`
    <>
      <Text>
        foo, bar, baz
      </Text>
      <Text>
        [
        baz
        ]
      </Text>
    </>
  `);
});

test('preserves child state after switching parent screens rendered in `<Activity>`', async () => {
  const ParentNavigator = (props: any): any => {
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

  const ChildNavigator = (props: any): any => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      MockRouter,
      props
    );

    const route = state.routes[state.index];

    if (route == null) {
      return null;
    }

    return (
      <NavigationContent>
        <Text>{state.routes.map((route) => route.name).join(', ')}</Text>
        {descriptors[route.key]?.render()}
      </NavigationContent>
    );
  };

  const ChildScreen = ({ route }: any): any => <Text>[{route.name}]</Text>;

  const ParentFirstScreen = () => (
    <ChildNavigator>
      <Screen name="child-a" component={ChildScreen} />
      <Screen name="child-b" component={ChildScreen} />
      <Screen name="child-c" component={ChildScreen} />
    </ChildNavigator>
  );

  const ParentSecondScreen = () => <Text>[parent-b]</Text>;

  const navigation = createNavigationContainerRef<ParamListBase>();

  const root = await render(
    <BaseNavigationContainer ref={navigation}>
      <ParentNavigator>
        <Screen name="parent-a" component={ParentFirstScreen} />
        <Screen name="parent-b" component={ParentSecondScreen} />
      </ParentNavigator>
    </BaseNavigationContainer>
  );

  await act(async () =>
    navigation.navigate('parent-a', {
      screen: 'child-b',
    })
  );

  await act(async () =>
    navigation.navigate('parent-a', {
      screen: 'child-c',
    })
  );

  expect(root).toMatchInlineSnapshot(`
    <>
      <Text>
        child-a, child-b, child-c
      </Text>
      <Text>
        [
        child-c
        ]
      </Text>
      <Text
        style={
          {
            "display": "none",
          }
        }
      >
        [parent-b]
      </Text>
    </>
  `);

  await act(() => navigation.navigate('parent-b'));

  expect(root).toMatchInlineSnapshot(`
    <>
      <Text
        style={
          {
            "display": "none",
          }
        }
      >
        child-a, child-b, child-c
      </Text>
      <Text
        style={
          {
            "display": "none",
          }
        }
      >
        [
        child-c
        ]
      </Text>
      <Text>
        [parent-b]
      </Text>
    </>
  `);

  expect(navigation.getRootState()).toEqual({
    stale: false,
    type: 'test',
    index: 1,
    key: '0',
    routeNames: ['parent-a', 'parent-b'],
    routes: [
      {
        key: 'parent-a',
        name: 'parent-a',
        params: {
          screen: 'child-c',
        },
        state: {
          stale: false,
          type: 'test',
          index: 2,
          key: '1',
          routeNames: ['child-a', 'child-b', 'child-c'],
          routes: [
            { key: 'child-a', name: 'child-a' },
            { key: 'child-b', name: 'child-b' },
            { key: 'child-c', name: 'child-c' },
          ],
        },
      },
      { key: 'parent-b', name: 'parent-b' },
    ],
  });

  await act(() => navigation.navigate('parent-a'));

  expect(root).toMatchInlineSnapshot(`
    <>
      <Text>
        child-a, child-b, child-c
      </Text>
      <Text>
        [
        child-c
        ]
      </Text>
      <Text
        style={
          {
            "display": "none",
          }
        }
      >
        [parent-b]
      </Text>
    </>
  `);
});

test('allows state updates by dispatching a function returning an action', async () => {
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

  const FooScreen = (props: any) => {
    React.useEffect(() => {
      props.navigation.dispatch((state: NavigationState) =>
        state.index === 0
          ? { type: 'NAVIGATE', payload: { name: state.routeNames[1] } }
          : { type: 'NOOP' }
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
  };

  const BarScreen = () => null;

  const onStateChange = jest.fn();

  const element = (
    <BaseNavigationContainer onStateChange={onStateChange}>
      <TestNavigator initialRouteName="foo">
        <Screen name="foo" component={FooScreen} />
        <Screen name="bar" component={BarScreen} />
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
    routeNames: ['foo', 'bar'],
    routes: [
      { key: 'foo', name: 'foo' },
      { key: 'bar', name: 'bar' },
    ],
  });
});

test('re-initializes state once for conditional rendering', async () => {
  const TestNavigatorA = (props: any) => {
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

  const TestNavigatorB = (props: any) => {
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

  const onStateChange = jest.fn();

  const navigation = createNavigationContainerRef<ParamListBase>();

  const Test = ({ condition }: { condition: boolean }) => {
    return (
      <BaseNavigationContainer ref={navigation} onStateChange={onStateChange}>
        {condition ? (
          <TestNavigatorA>
            <Screen name="foo">{() => null}</Screen>
            <Screen name="bar">{() => null}</Screen>
          </TestNavigatorA>
        ) : (
          <TestNavigatorB>
            <Screen name="bar">{() => null}</Screen>
            <Screen name="baz">{() => null}</Screen>
          </TestNavigatorB>
        )}
      </BaseNavigationContainer>
    );
  };

  const root = await render(<Test condition />);

  expect(onStateChange).toHaveBeenCalledTimes(0);
  expect(navigation.getRootState()).toEqual({
    stale: false,
    type: 'test',
    index: 0,
    key: '0',
    routeNames: ['foo', 'bar'],
    routes: [
      { key: 'foo', name: 'foo' },
      { key: 'bar', name: 'bar' },
    ],
  });

  await root.rerender(<Test condition={false} />);

  expect(onStateChange).toHaveBeenCalledTimes(1);
  expect(onStateChange).toHaveBeenCalledWith({
    stale: false,
    type: 'test',
    index: 0,
    key: '1',
    routeNames: ['bar', 'baz'],
    routes: [
      { key: 'bar', name: 'bar' },
      { key: 'baz', name: 'baz' },
    ],
  });
});

test('updates route params with setParams', async () => {
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

  let setParams: (params: object) => void = () => undefined;

  const FooScreen = (props: any) => {
    setParams = props.navigation.setParams;

    return null;
  };

  const onStateChange = jest.fn();

  await render(
    <BaseNavigationContainer onStateChange={onStateChange}>
      <TestNavigator initialRouteName="foo">
        <Screen name="foo" component={FooScreen} />
        <Screen name="bar" component={React.Fragment} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await act(() => setParams({ username: 'alice' }));

  expect(onStateChange).toHaveBeenCalledTimes(1);
  expect(onStateChange).toHaveBeenLastCalledWith({
    stale: false,
    type: 'test',
    index: 0,
    key: '0',
    routeNames: ['foo', 'bar'],
    routes: [
      { key: 'foo', name: 'foo', params: { username: 'alice' } },
      { key: 'bar', name: 'bar' },
    ],
  });

  await act(() => setParams({ age: 25 }));

  expect(onStateChange).toHaveBeenCalledTimes(2);
  expect(onStateChange).toHaveBeenLastCalledWith({
    stale: false,
    type: 'test',
    index: 0,
    key: '0',
    routeNames: ['foo', 'bar'],
    routes: [
      { key: 'foo', name: 'foo', params: { username: 'alice', age: 25 } },
      { key: 'bar', name: 'bar' },
    ],
  });
});

test('updates route params with setParams applied to parent', async () => {
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

  let setParams: (params: object) => void = () => undefined;

  const FooScreen = (props: any) => {
    const parent = props.navigation.getParent();
    if (parent) {
      setParams = parent.setParams;
    }

    return null;
  };

  const onStateChange = jest.fn();

  await render(
    <BaseNavigationContainer onStateChange={onStateChange}>
      <TestNavigator initialRouteName="foo">
        <Screen name="foo">
          {() => (
            <TestNavigator initialRouteName="baz">
              <Screen name="baz" component={FooScreen} />
            </TestNavigator>
          )}
        </Screen>
        <Screen name="bar" component={React.Fragment} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await act(() => setParams({ username: 'alice' }));

  expect(onStateChange).toHaveBeenCalledTimes(1);
  expect(onStateChange).toHaveBeenLastCalledWith({
    index: 0,
    key: '0',
    routeNames: ['foo', 'bar'],
    routes: [
      {
        key: 'foo',
        name: 'foo',
        params: { username: 'alice' },
        state: {
          index: 0,
          key: '1',
          routeNames: ['baz'],
          routes: [{ key: 'baz', name: 'baz' }],
          stale: false,
          type: 'test',
        },
      },
      { key: 'bar', name: 'bar' },
    ],
    stale: false,
    type: 'test',
  });

  await act(() => setParams({ age: 25 }));

  expect(onStateChange).toHaveBeenCalledTimes(2);
  expect(onStateChange).toHaveBeenLastCalledWith({
    index: 0,
    key: '0',
    routeNames: ['foo', 'bar'],
    routes: [
      {
        key: 'foo',
        name: 'foo',
        params: { username: 'alice', age: 25 },
        state: {
          index: 0,
          key: '1',
          routeNames: ['baz'],
          routes: [{ key: 'baz', name: 'baz' }],
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

test('handles change in route names', async () => {
  const TestNavigator = (props: any): any => {
    useNavigationBuilder(MockRouter, props);
    return null;
  };

  const onStateChange = jest.fn();

  const root = await render(
    <BaseNavigationContainer>
      <TestNavigator initialRouteName="bar">
        <Screen name="foo" component={React.Fragment} />
        <Screen name="bar" component={React.Fragment} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await root.rerender(
    <BaseNavigationContainer onStateChange={onStateChange}>
      <TestNavigator>
        <Screen name="foo" component={React.Fragment} />
        <Screen name="baz" component={React.Fragment} />
        <Screen name="qux" component={React.Fragment} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  expect(onStateChange).toHaveBeenCalledWith({
    stale: false,
    type: 'test',
    index: 0,
    key: '0',
    routeNames: ['foo', 'baz', 'qux'],
    routes: [{ key: 'foo', name: 'foo' }],
  });
});

test('navigates to nested child in a navigator', async () => {
  const TestNavigator = (props: any): any => {
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

  const TestComponent = ({ route }: any): any => (
    <Text>{`[${route.name}, ${JSON.stringify(route.params) ?? ''}]`}</Text>
  );

  const onStateChange = jest.fn();

  const navigation = createNavigationContainerRef<ParamListBase>();

  const element = await render(
    <BaseNavigationContainer ref={navigation} onStateChange={onStateChange}>
      <TestNavigator>
        <Screen name="foo">
          {() => (
            <TestNavigator>
              <Screen name="foo-a" component={TestComponent} />
              <Screen name="foo-b" component={TestComponent} />
            </TestNavigator>
          )}
        </Screen>
        <Screen name="bar">
          {() => (
            <TestNavigator initialRouteName="bar-a">
              <Screen
                name="bar-a"
                component={TestComponent}
                initialParams={{ lol: 'why' }}
              />
              <Screen
                name="bar-b"
                component={TestComponent}
                initialParams={{ some: 'stuff' }}
              />
            </TestNavigator>
          )}
        </Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  expect(element).toMatchInlineSnapshot(`
<Text>
  [foo-a, ]
</Text>
`);

  await act(() =>
    navigation.navigate('bar', {
      screen: 'bar-b',
      params: { test: 42 },
    })
  );

  expect(element).toMatchInlineSnapshot(`
<Text>
  [bar-b, {"some":"stuff","test":42}]
</Text>
`);

  await act(() =>
    navigation.navigate('bar', {
      screen: 'bar-a',
      params: { whoa: 'test' },
    })
  );

  expect(element).toMatchInlineSnapshot(`
<Text>
  [bar-a, {"lol":"why","whoa":"test"}]
</Text>
`);

  await act(() => navigation.goBack());

  expect(element).toMatchInlineSnapshot(`
<Text>
  [bar-b, {"some":"stuff","test":42}]
</Text>
`);

  await act(() => navigation.navigate('bar', { screen: 'bar-a' }));

  expect(element).toMatchInlineSnapshot(`
<Text>
  [bar-a, {"lol":"why","whoa":"test"}]
</Text>
`);
});

test('navigates to nested child in a navigator with initial: false', async () => {
  const TestRouter: typeof MockRouter = (options) => {
    const router = MockRouter(options);

    return {
      ...router,

      getStateForAction(state, action, options) {
        switch (action.type) {
          case 'NAVIGATE': {
            if (!options.routeNames.includes(action.payload.name as any)) {
              return null;
            }

            const routes = [
              ...state.routes,
              {
                key: String(MockRouterKey.current++),
                name: action.payload.name,
                params: action.payload.params,
              },
            ];

            return {
              ...state,
              index: routes.length - 1,
              routes,
            };
          }

          default:
            return router.getStateForAction(state, action, options);
        }
      },
    } as typeof router;
  };

  const TestNavigator = (props: any): any => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      TestRouter,
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

  const TestComponent = ({ route }: any): any => (
    <Text>{`[${route.name}, ${JSON.stringify(route.params) ?? ''}]`}</Text>
  );

  const onStateChange = jest.fn();

  const navigation = createNavigationContainerRef<ParamListBase>();

  const first = await render(
    <BaseNavigationContainer ref={navigation} onStateChange={onStateChange}>
      <TestNavigator>
        <Screen name="foo">
          {() => (
            <TestNavigator>
              <Screen name="foo-a" component={TestComponent} />
              <Screen name="foo-b" component={TestComponent} />
            </TestNavigator>
          )}
        </Screen>
        <Screen name="bar">
          {() => (
            <TestNavigator initialRouteName="bar-a">
              <Screen
                name="bar-a"
                component={TestComponent}
                initialParams={{ lol: 'why' }}
              />
              <Screen
                name="bar-b"
                component={TestComponent}
                initialParams={{ some: 'stuff' }}
              />
            </TestNavigator>
          )}
        </Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  expect(first).toMatchInlineSnapshot(`
<Text>
  [foo-a, ]
</Text>
`);
  expect(navigation.getRootState()).toEqual({
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
          routeNames: ['foo-a', 'foo-b'],
          routes: [
            {
              key: 'foo-a',
              name: 'foo-a',
            },
            {
              key: 'foo-b',
              name: 'foo-b',
            },
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

  await act(() =>
    navigation.navigate('bar', {
      screen: 'bar-b',
      params: { test: 42 },
    })
  );

  expect(first).toMatchInlineSnapshot(`
<Text>
  [bar-b, {"some":"stuff","test":42}]
</Text>
`);

  expect(navigation.getRootState()).toEqual({
    index: 2,
    key: '0',
    routeNames: ['foo', 'bar'],
    routes: [
      { key: 'foo', name: 'foo' },
      { key: 'bar', name: 'bar' },
      {
        key: '2',
        name: 'bar',
        params: {
          params: { test: 42 },
          screen: 'bar-b',
        },
        state: {
          index: 0,
          key: '4',
          routeNames: ['bar-a', 'bar-b'],
          routes: [
            {
              key: 'bar-b-3',
              name: 'bar-b',
              params: { some: 'stuff', test: 42 },
            },
          ],
          stale: false,
          type: 'test',
        },
      },
    ],
    stale: false,
    type: 'test',
  });

  const second = await render(
    <BaseNavigationContainer ref={navigation} onStateChange={onStateChange}>
      <TestNavigator>
        <Screen name="foo">
          {() => (
            <TestNavigator>
              <Screen name="foo-a" component={TestComponent} />
              <Screen name="foo-b" component={TestComponent} />
            </TestNavigator>
          )}
        </Screen>
        <Screen name="bar">
          {() => (
            <TestNavigator initialRouteName="bar-a">
              <Screen
                name="bar-a"
                component={TestComponent}
                initialParams={{ lol: 'why' }}
              />
              <Screen
                name="bar-b"
                component={TestComponent}
                initialParams={{ some: 'stuff' }}
              />
            </TestNavigator>
          )}
        </Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  expect(second).toMatchInlineSnapshot(`
<Text>
  [foo-a, ]
</Text>
`);
  expect(navigation.getRootState()).toEqual({
    index: 0,
    key: '5',
    routeNames: ['foo', 'bar'],
    routes: [
      {
        key: 'foo',
        name: 'foo',
        state: {
          index: 0,
          key: '6',
          routeNames: ['foo-a', 'foo-b'],
          routes: [
            { key: 'foo-a', name: 'foo-a' },
            { key: 'foo-b', name: 'foo-b' },
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

  await act(() =>
    navigation.navigate('bar', {
      screen: 'bar-b',
      params: { test: 42 },
      initial: false,
    })
  );

  expect(second).toMatchInlineSnapshot(`
<Text>
  [bar-b, {"test":42}]
</Text>
`);

  expect(navigation.getRootState()).toEqual({
    index: 2,
    key: '5',
    routeNames: ['foo', 'bar'],
    routes: [
      { key: 'foo', name: 'foo' },
      { key: 'bar', name: 'bar' },
      {
        key: '7',
        name: 'bar',
        params: {
          screen: 'bar-b',
          params: { test: 42 },
          initial: false,
        },
        state: {
          index: 2,
          key: '8',
          routeNames: ['bar-a', 'bar-b'],
          routes: [
            {
              key: 'bar-a',
              name: 'bar-a',
              params: { lol: 'why' },
            },
            {
              key: 'bar-b',
              name: 'bar-b',
              params: { some: 'stuff' },
            },
            { key: '9', name: 'bar-b', params: { test: 42 } },
          ],
          stale: false,
          type: 'test',
        },
      },
    ],
    stale: false,
    type: 'test',
  });

  const third = await render(
    <BaseNavigationContainer
      ref={navigation}
      initialState={{
        index: 1,
        routes: [
          { name: 'foo' },
          {
            name: 'bar',
            params: {
              params: { test: 42 },
              screen: 'bar-b',
              initial: false,
            },
            state: {
              index: 1,
              key: '7',
              routes: [
                {
                  name: 'bar-a',
                  params: { lol: 'why' },
                },
                {
                  name: 'bar-b',
                  params: { some: 'stuff' },
                },
              ],
              type: 'test',
            },
          },
        ],
        type: 'test',
      }}
    >
      <TestNavigator>
        <Screen name="foo" component={TestComponent} />
        <Screen name="bar">
          {() => (
            <TestNavigator initialRouteName="bar-a">
              <Screen
                name="bar-a"
                component={TestComponent}
                initialParams={{ lol: 'why' }}
              />
              <Screen
                name="bar-b"
                component={TestComponent}
                initialParams={{ some: 'stuff' }}
              />
            </TestNavigator>
          )}
        </Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  expect(third).toMatchInlineSnapshot(`
<Text>
  [bar-b, {"some":"stuff"}]
</Text>
`);

  expect(navigation.getRootState()).toEqual({
    index: 1,
    key: '12',
    routeNames: ['foo', 'bar'],
    routes: [
      { key: 'foo-10', name: 'foo' },
      {
        key: 'bar-11',
        name: 'bar',
        params: {
          params: { test: 42 },
          screen: 'bar-b',
          initial: false,
        },
        state: {
          index: 1,
          key: '15',
          routeNames: ['bar-a', 'bar-b'],
          routes: [
            {
              key: 'bar-a-13',
              name: 'bar-a',
              params: { lol: 'why' },
            },
            {
              key: 'bar-b-14',
              name: 'bar-b',
              params: { some: 'stuff' },
            },
          ],
          stale: false,
          type: 'test',
        },
      },
    ],
    stale: false,
    type: 'test',
  });
});

test('preserves navigation state changes for preloaded screens', async () => {
  const TestNavigator = (props: any): any => {
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

  const ChildNavigator = (props: any): any => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      StackRouter,
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

  let navigate: any;

  const BazScreen = ({ navigation }: any) => {
    React.useEffect(() => {
      navigate = navigation.navigate;
    }, [navigation]);

    return <Text>baz</Text>;
  };

  const TestScreen = ({ route }: any): any => (
    <Text>{`[${route.name}, ${JSON.stringify(route.params)}]`}</Text>
  );

  const navigation = createNavigationContainerRef<ParamListBase>();

  const element = await render(
    <BaseNavigationContainer ref={navigation}>
      <TestNavigator>
        <Screen name="foo" component={TestScreen} />
        <Screen name="bar">
          {() => (
            <ChildNavigator>
              <Screen name="baz" component={BazScreen} />
              <Screen name="qux" component={TestScreen} />
            </ChildNavigator>
          )}
        </Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  expect(element).toMatchInlineSnapshot(`
    <Text>
      [foo, undefined]
    </Text>
  `);

  await act(() => navigation.preload('bar'));

  expect(element).toMatchInlineSnapshot(`
    <>
      <Text>
        [foo, undefined]
      </Text>
      <Text>
        baz
      </Text>
    </>
  `);

  await act(() => navigate('qux', { answer: 42 }));

  await act(() => navigation.navigate('bar'));

  expect(element).toMatchInlineSnapshot(`
    <>
      <Text>
        [foo, undefined]
      </Text>
      <Text>
        [qux, {"answer":42}]
      </Text>
    </>
  `);
});

test('includes child state for preloaded screens in root state', async () => {
  const TestNavigator = (props: any): any => {
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

  const ChildNavigator = (props: any): any => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      StackRouter,
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
      <TestNavigator>
        <Screen name="foo">{() => null}</Screen>
        <Screen name="bar">
          {() => (
            <ChildNavigator>
              <Screen name="baz">{() => null}</Screen>
              <Screen name="qux">{() => null}</Screen>
            </ChildNavigator>
          )}
        </Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await act(() => navigation.preload('bar'));

  expect(navigation.getRootState()).toEqual(
    expect.objectContaining({
      index: 0,
      routes: [
        expect.objectContaining({ name: 'foo' }),
        expect.objectContaining({
          name: 'bar',
          state: expect.objectContaining({
            index: 0,
            routeNames: ['baz', 'qux'],
            routes: [expect.objectContaining({ name: 'baz' })],
            stale: false,
            type: 'stack',
          }),
        }),
      ],
    })
  );
});

test('resets to nested child in a navigator', async () => {
  const TestNavigator = (props: any): any => {
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

  const TestComponent = ({ route }: any): any => (
    <Text>{`[${route.name}, ${JSON.stringify(route.params) ?? ''}]`}</Text>
  );

  const onStateChange = jest.fn();

  const navigation = createNavigationContainerRef<ParamListBase>();

  const element = await render(
    <BaseNavigationContainer ref={navigation} onStateChange={onStateChange}>
      <TestNavigator>
        <Screen name="foo">
          {() => (
            <TestNavigator>
              <Screen name="foo-a" component={TestComponent} />
              <Screen name="foo-b" component={TestComponent} />
            </TestNavigator>
          )}
        </Screen>
        <Screen name="bar">
          {() => (
            <TestNavigator initialRouteName="bar-a">
              <Screen
                name="bar-a"
                component={TestComponent}
                initialParams={{ lol: 'why' }}
              />
              <Screen
                name="bar-b"
                component={TestComponent}
                initialParams={{ some: 'stuff' }}
              />
            </TestNavigator>
          )}
        </Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  expect(element).toMatchInlineSnapshot(`
<Text>
  [foo-a, ]
</Text>
`);

  await act(() =>
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'bar',
          params: {
            screen: 'bar-b',
            params: { test: 42 },
          },
        },
      ],
    })
  );

  expect(element).toMatchInlineSnapshot(`
<Text>
  [bar-b, {"some":"stuff","test":42}]
</Text>
`);

  await act(() =>
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'bar',
          params: {
            screen: 'bar-a',
            params: { whoa: 'test' },
          },
        },
      ],
    })
  );

  expect(element).toMatchInlineSnapshot(`
<Text>
  [bar-a, {"lol":"why","whoa":"test"}]
</Text>
`);

  await act(() =>
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'bar',
          params: { screen: 'bar-a' },
        },
      ],
    })
  );

  expect(element).toMatchInlineSnapshot(`
<Text>
  [bar-a, {"lol":"why"}]
</Text>
`);
});

test('resets state of a nested child in a navigator', async () => {
  const TestNavigator = (props: any): any => {
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

  const TestComponent = ({ route }: any): any => (
    <Text>{`[${route.name}, ${JSON.stringify(route.params) ?? ''}]`}</Text>
  );

  const onStateChange = jest.fn();

  const navigation = createNavigationContainerRef<ParamListBase>();

  const first = await render(
    <BaseNavigationContainer ref={navigation} onStateChange={onStateChange}>
      <TestNavigator>
        <Screen name="foo">
          {() => (
            <TestNavigator>
              <Screen name="foo-a" component={TestComponent} />
              <Screen name="foo-b" component={TestComponent} />
            </TestNavigator>
          )}
        </Screen>
        <Screen name="bar">
          {() => (
            <TestNavigator initialRouteName="bar-a">
              <Screen name="bar-a" component={TestComponent} />
              <Screen
                name="bar-b"
                component={TestComponent}
                initialParams={{ some: 'stuff' }}
              />
            </TestNavigator>
          )}
        </Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  expect(first).toMatchInlineSnapshot(`
<Text>
  [foo-a, ]
</Text>
`);

  expect(navigation.getRootState()).toEqual({
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
          routeNames: ['foo-a', 'foo-b'],
          routes: [
            {
              key: 'foo-a',
              name: 'foo-a',
            },
            {
              key: 'foo-b',
              name: 'foo-b',
            },
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

  await act(() =>
    navigation.navigate('bar', {
      state: {
        routes: [{ name: 'bar-a' }, { name: 'bar-b' }],
      },
    })
  );

  expect(first).toMatchInlineSnapshot(`
<Text>
  [bar-a, ]
</Text>
`);

  expect(navigation.getRootState()).toEqual({
    index: 1,
    key: '0',
    routeNames: ['foo', 'bar'],
    routes: [
      { key: 'foo', name: 'foo' },
      {
        key: 'bar',
        name: 'bar',
        params: {
          state: {
            routes: [{ name: 'bar-a' }, { name: 'bar-b' }],
          },
        },
        state: {
          index: 0,
          key: '4',
          routeNames: ['bar-a', 'bar-b'],
          routes: [
            {
              key: 'bar-a-2',
              name: 'bar-a',
            },
            {
              key: 'bar-b-3',
              name: 'bar-b',
              params: { some: 'stuff' },
            },
          ],
          stale: false,
          type: 'test',
        },
      },
    ],
    stale: false,
    type: 'test',
  });

  await act(() =>
    navigation.navigate('bar', {
      state: {
        index: 2,
        routes: [
          { key: '37', name: 'bar-b' },
          { name: 'bar-b' },
          { name: 'bar-a', params: { test: 18 } },
        ],
      },
    })
  );

  expect(first).toMatchInlineSnapshot(`
<Text>
  [bar-a, {"test":18}]
</Text>
`);

  expect(navigation.getRootState()).toEqual({
    index: 1,
    key: '0',
    routeNames: ['foo', 'bar'],
    routes: [
      { key: 'foo', name: 'foo' },
      {
        key: 'bar',
        name: 'bar',
        params: {
          state: {
            index: 2,
            routes: [
              { key: '37', name: 'bar-b' },
              { name: 'bar-b' },
              { name: 'bar-a', params: { test: 18 } },
            ],
          },
        },
        state: {
          index: 2,
          key: '7',
          routeNames: ['bar-a', 'bar-b'],
          routes: [
            {
              key: '37',
              name: 'bar-b',
              params: { some: 'stuff' },
            },
            {
              key: 'bar-b-5',
              name: 'bar-b',
              params: { some: 'stuff' },
            },
            {
              key: 'bar-a-6',
              name: 'bar-a',
              params: { test: 18 },
            },
          ],
          stale: false,
          type: 'test',
        },
      },
    ],
    stale: false,
    type: 'test',
  });
});

test('resets state for navigator which has screen from params', async () => {
  const TestNavigator = (props: any): any => {
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

  const TestScreen = () => null;

  const navigation = createNavigationContainerRef<ParamListBase>();

  await render(
    <BaseNavigationContainer ref={navigation}>
      <TestNavigator>
        <Screen name="foo" component={TestScreen} />
        <Screen name="bar">
          {() => (
            <TestNavigator>
              <Screen name="baz" component={TestScreen} />
              <Screen name="qux" component={TestScreen} />
            </TestNavigator>
          )}
        </Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  expect(navigation.getRootState()).toEqual({
    index: 0,
    key: '0',
    routeNames: ['foo', 'bar'],
    routes: [
      { key: 'foo', name: 'foo' },
      { key: 'bar', name: 'bar' },
    ],
    stale: false,
    type: 'test',
  });

  await act(() =>
    navigation.navigate('bar', {
      screen: 'qux',
      params: { test: 42 },
    })
  );

  expect(navigation.getRootState()).toEqual({
    index: 1,
    key: '0',
    routeNames: ['foo', 'bar'],
    routes: [
      { key: 'foo', name: 'foo' },
      {
        key: 'bar',
        name: 'bar',
        params: { screen: 'qux', params: { test: 42 } },
        state: {
          index: 0,
          key: '2',
          routeNames: ['baz', 'qux'],
          routes: [{ key: 'qux-1', name: 'qux', params: { test: 42 } }],
          stale: false,
          type: 'test',
        },
      },
    ],
    stale: false,
    type: 'test',
  });

  await act(() =>
    navigation.reset({
      index: 0,
      routes: [{ name: 'baz' }],
    })
  );

  expect(navigation.getRootState()).toEqual({
    index: 1,
    key: '0',
    routeNames: ['foo', 'bar'],
    routes: [
      { key: 'foo', name: 'foo' },
      {
        key: 'bar',
        name: 'bar',
        params: {
          screen: 'qux',
          params: { test: 42 },
        },
        state: {
          index: 0,
          key: '4',
          routeNames: ['baz', 'qux'],
          routes: [{ key: 'baz-3', name: 'baz' }],
          stale: false,
          type: 'test',
        },
      },
    ],
    stale: false,
    type: 'test',
  });
});

test('clears params for nested navigator after initial mount', async () => {
  const TestNavigator = (props: any): any => {
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

  const TestScreen = ({ route }: any): any => <Text>[{route.name}]</Text>;

  const navigation = createNavigationContainerRef<ParamListBase>();

  await render(
    <BaseNavigationContainer ref={navigation}>
      <TestNavigator>
        <Screen name="foo" component={TestScreen} />
        <Screen name="bar">
          {() => (
            <TestNavigator>
              <Screen name="baz" component={TestScreen} />
              <Screen name="qux" component={TestScreen} />
            </TestNavigator>
          )}
        </Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await act(() =>
    navigation.navigate('bar', {
      screen: 'qux',
      params: { test: 42 },
    })
  );

  expect(navigation.getRootState()).toEqual({
    index: 1,
    key: '0',
    routeNames: ['foo', 'bar'],
    routes: [
      { key: 'foo', name: 'foo' },
      {
        key: 'bar',
        name: 'bar',
        params: {
          screen: 'qux',
          params: { test: 42 },
        },
        state: {
          index: 0,
          key: '2',
          routeNames: ['baz', 'qux'],
          routes: [{ key: 'qux-1', name: 'qux', params: { test: 42 } }],
          stale: false,
          type: 'test',
        },
      },
    ],
    stale: false,
    type: 'test',
  });

  await act(() => navigation.navigate('foo'));

  expect(navigation.getRootState()).toEqual({
    index: 0,
    key: '0',
    routeNames: ['foo', 'bar'],
    routes: [
      { key: 'foo', name: 'foo' },
      {
        key: 'bar',
        name: 'bar',
        params: {
          screen: 'qux',
          params: { test: 42 },
        },
      },
    ],
    stale: false,
    type: 'test',
  });
});

test('does not clear params if there is no nested navigator', async () => {
  const TestNavigator = (props: any): any => {
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

  const TestScreen = ({ route }: any): any => <Text>[{route.name}]</Text>;

  const navigation = createNavigationContainerRef<ParamListBase>();

  await render(
    <BaseNavigationContainer ref={navigation}>
      <TestNavigator>
        <Screen name="foo" component={TestScreen} />
        <Screen name="bar" component={TestScreen} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await act(() =>
    navigation.navigate('bar', {
      screen: 'qux',
      params: { test: 42 },
    })
  );

  expect(navigation.getRootState()).toEqual({
    index: 1,
    key: '0',
    routeNames: ['foo', 'bar'],
    routes: [
      { key: 'foo', name: 'foo' },
      {
        key: 'bar',
        name: 'bar',
        params: {
          screen: 'qux',
          params: { test: 42 },
        },
      },
    ],
    stale: false,
    type: 'test',
  });
});

test('restores previously discarded state when route names change after initial render', async () => {
  const TestNavigator = (props: any): any => {
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

  const TestScreen = ({ route }: any): any => <Text>[{route.name}]</Text>;

  const onStateChange = jest.fn();

  const initialState = {
    index: 0,
    routes: [{ key: 'qux', name: 'qux' }],
  };

  const root = await render(
    <BaseNavigationContainer
      initialState={initialState}
      onStateChange={onStateChange}
    >
      <TestNavigator routeNamesChangeBehavior="lastUnhandled">
        <Screen name="foo" component={TestScreen} />
        <Screen name="bar" component={TestScreen} />
        <Screen name="baz" component={TestScreen} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  expect(root).toMatchInlineSnapshot(`
    <Text>
      [
      foo
      ]
    </Text>
  `);

  await root.rerender(
    <BaseNavigationContainer onStateChange={onStateChange}>
      <TestNavigator routeNamesChangeBehavior="lastUnhandled">
        <Screen name="bar" component={TestScreen} />
        <Screen name="baz" component={TestScreen} />
        <Screen name="qux" component={TestScreen} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  expect(onStateChange).toHaveBeenCalledTimes(1);
  expect(onStateChange).toHaveBeenLastCalledWith({
    index: 0,
    key: '2',
    routeNames: ['bar', 'baz', 'qux'],
    routes: [{ key: 'qux', name: 'qux' }],
    stale: false,
    type: 'test',
  });
  expect(root).toMatchInlineSnapshot(`
    <Text>
      [
      qux
      ]
    </Text>
  `);
});

test('restores previously discarded state when route names change after navigation', async () => {
  const TestNavigator = (props: any): any => {
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

  const TestScreen = ({ route }: any): any => <Text>[{route.name}]</Text>;

  const navigation = createNavigationContainerRef<ParamListBase>();

  const onStateChange = jest.fn();

  const intialState = {
    index: 0,
    key: '1',
    routeNames: ['foo', 'bar', 'baz'],
    routes: [{ key: 'foo', name: 'foo' }],
    stale: false,
    type: 'test',
  };

  const root = await render(
    <BaseNavigationContainer
      initialState={intialState}
      ref={navigation}
      onStateChange={onStateChange}
    >
      <TestNavigator routeNamesChangeBehavior="lastUnhandled">
        <Screen name="foo" component={TestScreen} />
        <Screen name="bar" component={TestScreen} />
        <Screen name="baz" component={TestScreen} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  expect(root).toMatchInlineSnapshot(`
    <Text>
      [
      foo
      ]
    </Text>
  `);

  // Suppress unhandled action warnings

  const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

  await act(() => navigation.navigate('qux'));

  expect(spy).toHaveBeenCalledTimes(1);
  expect(spy).toHaveBeenCalledWith(
    expect.stringContaining(
      'The action \'NAVIGATE\' with payload {"name":"qux"} was not handled by any navigator.'
    )
  );

  spy.mockRestore();

  expect(onStateChange).toHaveBeenCalledTimes(0);
  expect(root).toMatchInlineSnapshot(`
    <Text>
      [
      foo
      ]
    </Text>
  `);

  await root.rerender(
    <BaseNavigationContainer ref={navigation} onStateChange={onStateChange}>
      <TestNavigator routeNamesChangeBehavior="lastUnhandled">
        <Screen name="bar" component={TestScreen} />
        <Screen name="baz" component={TestScreen} />
        <Screen name="qux" component={TestScreen} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  expect(onStateChange).toHaveBeenCalledTimes(1);
  expect(onStateChange).toHaveBeenLastCalledWith({
    index: 0,
    key: '2',
    routeNames: ['bar', 'baz', 'qux'],
    routes: [{ key: 'qux-1', name: 'qux' }],
    stale: false,
    type: 'test',
  });
  expect(root).toMatchInlineSnapshot(`
    <Text>
      [
      qux
      ]
    </Text>
  `);
});

test('restores previously discarded state when route names change after navigation in a child navigator', async () => {
  const TestNavigator = (props: any): any => {
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

  const TestScreen = ({ route }: any): any => <Text>[{route.name}]</Text>;

  const navigation = createNavigationContainerRef<ParamListBase>();

  const onStateChange = jest.fn();

  const intialState = {
    index: 0,
    key: '0',
    routeNames: ['test'],
    routes: [
      {
        key: 'test',
        name: 'test',
        state: {
          index: 0,
          key: '1',
          routeNames: ['foo', 'bar', 'baz'],
          routes: [{ key: 'foo', name: 'foo' }],
          stale: false,
          type: 'test',
        },
      },
    ],
    stale: false,
    type: 'test',
  };

  const root = await render(
    <BaseNavigationContainer
      initialState={intialState}
      ref={navigation}
      onStateChange={onStateChange}
    >
      <TestNavigator>
        <Screen name="test">
          {() => (
            <TestNavigator routeNamesChangeBehavior="lastUnhandled">
              <Screen name="foo" component={TestScreen} />
              <Screen name="bar" component={TestScreen} />
              <Screen name="baz" component={TestScreen} />
            </TestNavigator>
          )}
        </Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  expect(root).toMatchInlineSnapshot(`
    <Text>
      [
      foo
      ]
    </Text>
  `);

  const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

  await act(() =>
    navigation.dispatch({
      ...CommonActions.navigate('qux'),
      target: 'test',
    })
  );

  expect(spy).toHaveBeenCalledTimes(1);
  expect(spy).toHaveBeenCalledWith(
    expect.stringContaining(
      'The action \'NAVIGATE\' with payload {"name":"qux"} was not handled by any navigator.'
    )
  );

  spy.mockRestore();

  expect(onStateChange).toHaveBeenCalledTimes(0);
  expect(navigation.getRootState()).toEqual({
    index: 0,
    key: '0',
    routeNames: ['test'],
    routes: [
      {
        key: 'test',
        name: 'test',
        state: {
          index: 0,
          key: '1',
          routeNames: ['foo', 'bar', 'baz'],
          routes: [{ key: 'foo', name: 'foo' }],
          stale: false,
          type: 'test',
        },
      },
    ],
    stale: false,
    type: 'test',
  });

  expect(root).toMatchInlineSnapshot(`
    <Text>
      [
      foo
      ]
    </Text>
  `);

  await root.rerender(
    <BaseNavigationContainer ref={navigation} onStateChange={onStateChange}>
      <TestNavigator>
        <Screen name="test">
          {() => (
            <TestNavigator routeNamesChangeBehavior="lastUnhandled">
              <Screen name="bar" component={TestScreen} />
              <Screen name="baz" component={TestScreen} />
              <Screen name="qux" component={TestScreen} />
            </TestNavigator>
          )}
        </Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  expect(onStateChange).toHaveBeenCalledTimes(1);
  expect(onStateChange).toHaveBeenLastCalledWith({
    index: 0,
    key: '0',
    routeNames: ['test'],
    routes: [
      {
        key: 'test',
        name: 'test',
        state: {
          index: 0,
          key: '3',
          routeNames: ['bar', 'baz', 'qux'],
          routes: [{ key: 'qux-2', name: 'qux' }],
          stale: false,
          type: 'test',
        },
      },
    ],
    stale: false,
    type: 'test',
  });
  expect(root).toMatchInlineSnapshot(`
    <Text>
      [
      qux
      ]
    </Text>
  `);
});

test('restores previously discarded state when route names change after navigation to nested child in a navigator', async () => {
  const TestNavigator = (props: any): any => {
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

  const TestScreen = ({ route }: any): any => <Text>[{route.name}]</Text>;

  const navigation = createNavigationContainerRef<ParamListBase>();

  const onStateChange = jest.fn();

  const intialState = {
    index: 0,
    key: '0',
    routeNames: ['test'],
    routes: [
      {
        key: 'test',
        name: 'test',
        params: { screen: 'qux' },
        state: {
          index: 0,
          key: '1',
          routeNames: ['foo', 'bar', 'baz'],
          routes: [{ key: 'foo', name: 'foo' }],
          stale: false,
          type: 'test',
        },
      },
    ],
    stale: false,
    type: 'test',
  };

  const root = await render(
    <BaseNavigationContainer
      initialState={intialState}
      ref={navigation}
      onStateChange={onStateChange}
    >
      <TestNavigator>
        <Screen name="test">
          {() => (
            <TestNavigator routeNamesChangeBehavior="lastUnhandled">
              <Screen name="foo" component={TestScreen} />
              <Screen name="bar" component={TestScreen} />
              <Screen name="baz" component={TestScreen} />
            </TestNavigator>
          )}
        </Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  expect(root).toMatchInlineSnapshot(`
    <Text>
      [
      foo
      ]
    </Text>
  `);

  await act(() => navigation.navigate('test', { screen: 'qux' }));

  expect(onStateChange).toHaveBeenCalledTimes(1);
  expect(onStateChange).toHaveBeenLastCalledWith({
    index: 0,
    key: '0',
    routeNames: ['test'],
    routes: [
      {
        key: 'test',
        name: 'test',
        params: { screen: 'qux' },
        state: {
          index: 0,
          key: '2',
          routeNames: ['foo', 'bar', 'baz'],
          routes: [{ key: 'foo-1', name: 'foo' }],
          stale: false,
          type: 'test',
        },
      },
    ],
    stale: false,
    type: 'test',
  });

  expect(root).toMatchInlineSnapshot(`
    <Text>
      [
      foo
      ]
    </Text>
  `);

  await root.rerender(
    <BaseNavigationContainer ref={navigation} onStateChange={onStateChange}>
      <TestNavigator>
        <Screen name="test">
          {() => (
            <TestNavigator routeNamesChangeBehavior="lastUnhandled">
              <Screen name="bar" component={TestScreen} />
              <Screen name="baz" component={TestScreen} />
              <Screen name="qux" component={TestScreen} />
            </TestNavigator>
          )}
        </Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  expect(onStateChange).toHaveBeenCalledTimes(2);
  expect(onStateChange).toHaveBeenLastCalledWith({
    index: 0,
    key: '0',
    routeNames: ['test'],
    routes: [
      {
        key: 'test',
        name: 'test',
        params: { screen: 'qux' },
        state: {
          index: 0,
          key: '4',
          routeNames: ['bar', 'baz', 'qux'],
          routes: [{ key: 'qux-3', name: 'qux' }],
          stale: false,
          type: 'test',
        },
      },
    ],
    stale: false,
    type: 'test',
  });
  expect(root).toMatchInlineSnapshot(`
    <Text>
      [
      qux
      ]
    </Text>
  `);
});

test('overrides router with router prop', async () => {
  const TestNavigator = (props: any): any => {
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

  const TestScreen = () => null;

  const navigation = createNavigationContainerRef<ParamListBase>();

  await render(
    <BaseNavigationContainer ref={navigation}>
      <TestNavigator
        router={(
          original: Router<NavigationState, NavigationAction>
        ): Partial<Router<NavigationState, NavigationAction>> => {
          return {
            getStateForAction(state, action, options) {
              if (action.type === 'REVERSE') {
                return {
                  ...state,
                  routes: [...state.routes].reverse(),
                };
              }

              return original.getStateForAction(state, action, options);
            },
          };
        }}
      >
        <Screen name="foo" component={TestScreen} />
        <Screen name="bar" component={TestScreen} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  expect(navigation.getRootState()).toEqual({
    type: 'test',
    index: 0,
    key: '0',
    routeNames: ['foo', 'bar'],
    routes: [
      { key: 'foo', name: 'foo' },
      { key: 'bar', name: 'bar' },
    ],
    stale: false,
  });

  await act(() => {
    navigation.dispatch({
      type: 'REVERSE',
    });
  });

  expect(navigation.getRootState()).toEqual({
    type: 'test',
    index: 0,
    key: '0',
    routeNames: ['foo', 'bar'],
    routes: [
      { key: 'bar', name: 'bar' },
      { key: 'foo', name: 'foo' },
    ],
    stale: false,
  });

  await act(() => {
    navigation.dispatch({
      type: 'NAVIGATE',
      payload: {
        name: 'foo',
      },
    });
  });

  expect(navigation.getRootState()).toEqual({
    type: 'test',
    index: 1,
    key: '0',
    routeNames: ['foo', 'bar'],
    routes: [
      { key: 'bar', name: 'bar' },
      { key: 'foo', name: 'foo' },
    ],
    stale: false,
  });
});

test('gets immediate parent with getParent()', async () => {
  const TestNavigator = (props: any): any => {
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

  const TestComponent = ({ route, navigation }: any): any => {
    const parentRoutes = navigation
      .getParent()
      .getState()
      .routes.map((r: any) => r.name)
      .join();

    return (
      <Text>
        {route.name} [{parentRoutes}]
      </Text>
    );
  };

  const onStateChange = jest.fn();

  const element = await render(
    <BaseNavigationContainer onStateChange={onStateChange}>
      <TestNavigator>
        <Screen name="foo">
          {() => (
            <TestNavigator>
              <Screen name="foo-a">
                {() => (
                  <TestNavigator>
                    <Screen name="bar" component={TestComponent} />
                  </TestNavigator>
                )}
              </Screen>
            </TestNavigator>
          )}
        </Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  expect(element).toMatchInlineSnapshot(`
    <Text>
      bar
       [
      foo-a
      ]
    </Text>
  `);
});

test('gets parent with a route name with getParent(routeName)', async () => {
  const TestNavigator = (props: any): any => {
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

  const TestComponent = ({ route, navigation }: any): any => {
    const parentRoutes = navigation
      .getParent('foo')
      .getState()
      .routes.map((r: any) => r.name)
      .join();

    return (
      <Text>
        {route.name} [{parentRoutes}]
      </Text>
    );
  };

  const onStateChange = jest.fn();

  const element = await render(
    <BaseNavigationContainer onStateChange={onStateChange}>
      <TestNavigator>
        <Screen name="foo">
          {() => (
            <TestNavigator>
              <Screen name="foo-a">
                {() => (
                  <TestNavigator>
                    <Screen name="bar" component={TestComponent} />
                  </TestNavigator>
                )}
              </Screen>
            </TestNavigator>
          )}
        </Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  expect(element).toMatchInlineSnapshot(`
    <Text>
      bar
       [
      foo
      ]
    </Text>
  `);
});

test('gets self with a route name with getParent(routeName)', async () => {
  const TestNavigator = (props: any): any => {
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

  const TestComponent = ({ route, navigation }: any): any => {
    const parentRoutes = navigation
      .getParent('bar')
      .getState()
      .routes.map((r: any) => r.name)
      .join();

    return (
      <Text>
        {route.name} [{parentRoutes}]
      </Text>
    );
  };

  const onStateChange = jest.fn();

  const element = await render(
    <BaseNavigationContainer onStateChange={onStateChange}>
      <TestNavigator>
        <Screen name="foo">
          {() => (
            <TestNavigator>
              <Screen name="foo-a">
                {() => (
                  <TestNavigator>
                    <Screen name="bar" component={TestComponent} />
                  </TestNavigator>
                )}
              </Screen>
            </TestNavigator>
          )}
        </Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  expect(element).toMatchInlineSnapshot(`
    <Text>
      bar
       [
      bar
      ]
    </Text>
  `);
});

test('returns undefined when route name is not found with getParent(routeName)', async () => {
  const TestNavigator = (props: any): any => {
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

  const TestComponent = ({ route, navigation }: any): any => (
    <Text>{`${route.name} [${navigation.getParent('foo-non-existent')}]`}</Text>
  );

  const onStateChange = jest.fn();

  const element = await render(
    <BaseNavigationContainer onStateChange={onStateChange}>
      <TestNavigator>
        <Screen name="foo">
          {() => (
            <TestNavigator>
              <Screen name="foo-a">
                {() => (
                  <TestNavigator>
                    <Screen name="bar" component={TestComponent} />
                  </TestNavigator>
                )}
              </Screen>
            </TestNavigator>
          )}
        </Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  expect(element).toMatchInlineSnapshot(`
    <Text>
      bar [undefined]
    </Text>
  `);
});

test('gives access to internal state', async () => {
  const TestNavigator = (props: any): any => {
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

  let state: NavigationState | undefined;

  const Test = () => {
    const navigation = useNavigation();
    state = navigation.getState();
    return null;
  };

  const root = (
    <BaseNavigationContainer>
      <TestNavigator initialRouteName="bar">
        <Screen name="bar" component={Test} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await render(root);

  expect(state).toEqual({
    index: 0,
    key: '0',
    routeNames: ['bar'],
    routes: [{ key: 'bar', name: 'bar' }],
    stale: false,
    type: 'test',
  });
});

test('preserves order of screens in state with non-numeric names', async () => {
  const TestNavigator = (props: any): any => {
    useNavigationBuilder(MockRouter, props);
    return null;
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  const root = (
    <BaseNavigationContainer ref={navigation}>
      <TestNavigator>
        <Screen name="foo" component={React.Fragment} />
        <Screen name="bar" component={React.Fragment} />
        <Screen name="baz" component={React.Fragment} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await render(root);

  expect(navigation.getRootState().routeNames).toEqual(['foo', 'bar', 'baz']);
});

test('preserves order of screens in state with numeric names', async () => {
  const TestNavigator = (props: any): any => {
    useNavigationBuilder(MockRouter, props);
    return null;
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  const root = (
    <BaseNavigationContainer ref={navigation}>
      <TestNavigator>
        <Screen name="4" component={React.Fragment} />
        <Screen name="7" component={React.Fragment} />
        <Screen name="1" component={React.Fragment} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await render(root);

  expect(navigation.getRootState().routeNames).toEqual(['4', '7', '1']);
});

test("throws if navigator doesn't have any screens", async () => {
  const TestNavigator = (props: any) => {
    useNavigationBuilder(MockRouter, props);
    return null;
  };

  const element = (
    <BaseNavigationContainer>
      <TestNavigator />
    </BaseNavigationContainer>
  );

  await expect(render(element)).rejects.toThrow(
    "Couldn't find any screens for the navigator. Have you defined any screens as its children?"
  );
});

test('throws if navigator is not inside a container', async () => {
  const TestNavigator = (props: any) => {
    useNavigationBuilder(MockRouter, props);
    return null;
  };

  const element = (
    <TestNavigator>
      <Screen name="foo" component={React.Fragment} />
    </TestNavigator>
  );

  await expect(render(element)).rejects.toThrow(
    "Couldn't register the navigator. Have you wrapped your app with 'NavigationContainer'?"
  );
});

test('throws if multiple navigators rendered under one container', async () => {
  const TestNavigator = (props: any) => {
    useNavigationBuilder(MockRouter, props);
    return null;
  };

  const element = (
    <BaseNavigationContainer>
      <TestNavigator>
        <Screen name="foo" component={React.Fragment} />
      </TestNavigator>
      <TestNavigator>
        <Screen name="foo" component={React.Fragment} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await expect(render(element)).rejects.toThrow(
    'Another navigator is already registered for this container'
  );
});

test('throws if multiple navigators rendered under one container in hidden trees', async () => {
  const TestNavigator = (props: any) => {
    useNavigationBuilder(MockRouter, props);
    return null;
  };

  const Test = ({ showSecond }: { showSecond: boolean }) => (
    <BaseNavigationContainer>
      <React.Activity mode={showSecond ? 'hidden' : 'visible'}>
        <TestNavigator>
          <Screen name="foo" component={React.Fragment} />
        </TestNavigator>
      </React.Activity>
      {showSecond ? (
        <TestNavigator>
          <Screen name="bar" component={React.Fragment} />
        </TestNavigator>
      ) : null}
    </BaseNavigationContainer>
  );

  const root = await render(<Test showSecond={false} />);

  await expect(root.rerender(<Test showSecond />)).rejects.toThrow(
    'Another navigator is already registered for this container'
  );
});

test('throws when Screen is not the direct children', async () => {
  const TestNavigator = (props: any) => {
    useNavigationBuilder(MockRouter, props);
    return null;
  };

  const Bar = () => null;

  const element = (
    <BaseNavigationContainer>
      <TestNavigator>
        <Screen name="foo" component={React.Fragment} />
        <Bar />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await expect(render(element)).rejects.toThrow(
    "A navigator can only contain 'Screen', 'Group' or 'React.Fragment' as its direct children (found 'Bar')"
  );
});

test('throws when undefined component is a direct children', async () => {
  const TestNavigator = (props: any) => {
    useNavigationBuilder(MockRouter, props);
    return null;
  };

  const Undefined = undefined;

  const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
  const element = (
    <BaseNavigationContainer>
      <TestNavigator>
        {/* @ts-expect-error testing incorrect usage */}
        <Undefined name="foo" component={React.Fragment} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  spy.mockRestore();

  await expect(render(element)).rejects.toThrow(
    "A navigator can only contain 'Screen', 'Group' or 'React.Fragment' as its direct children (found 'undefined' for the screen 'foo')"
  );
});

test('throws when a tag is a direct children', async () => {
  const TestNavigator = (props: any) => {
    useNavigationBuilder(MockRouter, props);
    return null;
  };

  const element = (
    <BaseNavigationContainer>
      <TestNavigator>
        {/* @ts-expect-error testing incorrect usage */}
        <screen name="foo" />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await expect(render(element)).rejects.toThrow(
    "A navigator can only contain 'Screen', 'Group' or 'React.Fragment' as its direct children (found 'screen' for the screen 'foo')"
  );
});

test('throws when a React Element is not the direct children', async () => {
  const TestNavigator = (props: any) => {
    useNavigationBuilder(MockRouter, props);
    return null;
  };

  const element = (
    <BaseNavigationContainer>
      <TestNavigator>
        <Screen name="foo" component={React.Fragment} />
        Hello world
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await expect(render(element)).rejects.toThrow(
    "A navigator can only contain 'Screen', 'Group' or 'React.Fragment' as its direct children (found 'Hello world')"
  );
});

test("doesn't throw when direct children is Screen or empty element", async () => {
  const TestNavigator = (props: any) => {
    useNavigationBuilder(MockRouter, props);
    return null;
  };

  await expect(
    render(
      <BaseNavigationContainer>
        <TestNavigator>
          <Screen name="foo" component={React.Fragment} />
          {null}
          {undefined}
          {false}
          {true}
        </TestNavigator>
      </BaseNavigationContainer>
    )
  ).resolves.toBeDefined();
});

test('throws when multiple screens with same name are defined', async () => {
  const TestNavigator = (props: any) => {
    useNavigationBuilder(MockRouter, props);
    return null;
  };

  const element = (
    <BaseNavigationContainer>
      <TestNavigator>
        <Screen name="foo" component={React.Fragment} />
        <Screen name="bar" component={React.Fragment} />
        <Screen name="foo" component={React.Fragment} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await expect(render(element)).rejects.toThrow(
    "A navigator cannot contain multiple 'Screen' components with the same name (found duplicate screen named 'foo')"
  );
});

test('switches rendered navigators', async () => {
  const TestNavigator = (props: any) => {
    useNavigationBuilder(MockRouter, props);
    return null;
  };

  const root = await render(
    <BaseNavigationContainer>
      <TestNavigator key="a">
        <Screen name="foo" component={React.Fragment} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await expect(
    root.rerender(
      <BaseNavigationContainer>
        <TestNavigator key="b">
          <Screen name="foo" component={React.Fragment} />
        </TestNavigator>
      </BaseNavigationContainer>
    )
  ).resolves.toBeUndefined();
});

test('throws if no name is passed to Screen', async () => {
  const TestNavigator = (props: any) => {
    useNavigationBuilder(MockRouter, props);
    return null;
  };

  const element = (
    <BaseNavigationContainer>
      <TestNavigator>
        <Screen name={undefined as any} component={React.Fragment} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await expect(render(element)).rejects.toThrow(
    'Got an invalid name (undefined) for the screen. It must be a non-empty string.'
  );
});

test('throws if invalid name is passed to Screen', async () => {
  const TestNavigator = (props: any) => {
    useNavigationBuilder(MockRouter, props);
    return null;
  };

  const element = (
    <BaseNavigationContainer>
      <TestNavigator>
        <Screen name={[] as any} component={React.Fragment} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await expect(render(element)).rejects.toThrow(
    'Got an invalid name ([]) for the screen. It must be a non-empty string.'
  );
});

test('throws if both children and component are passed', async () => {
  const TestNavigator = (props: any) => {
    useNavigationBuilder(MockRouter, props);
    return null;
  };

  const element = (
    <BaseNavigationContainer>
      <TestNavigator>
        <Screen name="foo" component={React.Fragment}>
          {/* @ts-expect-error testing incorrect usage */}
          {jest.fn()}
        </Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await expect(render(element)).rejects.toThrow(
    "Got both 'component' and 'children' props for the screen 'foo'. You must pass only one of them."
  );
});

test('throws if both children and getComponent are passed', async () => {
  const TestNavigator = (props: any) => {
    useNavigationBuilder(MockRouter, props);
    return null;
  };

  const Test = () => null;

  const element = (
    <BaseNavigationContainer>
      <TestNavigator>
        {/* @ts-expect-error testing incorrect usage */}
        <Screen name="foo" getComponent={() => Test}>
          {() => <Test />}
        </Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await expect(render(element)).rejects.toThrow(
    "Got both 'getComponent' and 'children' props for the screen 'foo'. You must pass only one of them."
  );
});

test('throws if both component and getComponent are passed', async () => {
  const TestNavigator = (props: any) => {
    useNavigationBuilder(MockRouter, props);
    return null;
  };

  const Test = () => null;

  const element = (
    <BaseNavigationContainer>
      <TestNavigator>
        {/* @ts-expect-error testing incorrect usage */}
        <Screen name="foo" component={Test} getComponent={() => Test} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await expect(render(element)).rejects.toThrow(
    "Got both 'component' and 'getComponent' props for the screen 'foo'. You must pass only one of them."
  );
});

test('throws descriptive error for undefined screen component', async () => {
  const TestNavigator = (props: any) => {
    useNavigationBuilder(MockRouter, props);
    return null;
  };

  const element = (
    <BaseNavigationContainer>
      <TestNavigator>
        {/* @ts-expect-error testing incorrect usage */}
        <Screen name="foo" component={undefined} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await expect(render(element)).rejects.toThrow(
    "Couldn't find a 'component', 'getComponent' or 'children' prop for the screen 'foo'"
  );
});

test('throws descriptive error for invalid screen component', async () => {
  const TestNavigator = (props: any) => {
    useNavigationBuilder(MockRouter, props);
    return null;
  };

  const element = (
    <BaseNavigationContainer>
      <TestNavigator>
        {/* @ts-expect-error testing incorrect usage */}
        <Screen name="foo" component={{}} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await expect(render(element)).rejects.toThrow(
    "Got an invalid value for 'component' prop for the screen 'foo'. It must be a valid React Component."
  );
});

test('throws descriptive error for invalid getComponent prop', async () => {
  const TestNavigator = (props: any) => {
    useNavigationBuilder(MockRouter, props);
    return null;
  };

  const element = (
    <BaseNavigationContainer>
      <TestNavigator>
        {/* @ts-expect-error testing incorrect usage */}
        <Screen name="foo" getComponent={{}} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await expect(render(element)).rejects.toThrow(
    "Got an invalid value for 'getComponent' prop for the screen 'foo'. It must be a function returning a React Component."
  );
});

test('throws descriptive error for invalid children', async () => {
  const TestNavigator = (props: any) => {
    useNavigationBuilder(MockRouter, props);
    return null;
  };

  const element = (
    <BaseNavigationContainer>
      <TestNavigator>
        <Screen name="foo">{[] as any}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await expect(render(element)).rejects.toThrow(
    "Got an invalid value for 'children' prop for the screen 'foo'. It must be a function returning a React Element."
  );
});

test("doesn't throw if children is null", async () => {
  const TestNavigator = (props: any) => {
    useNavigationBuilder(MockRouter, props);
    return null;
  };

  const element = (
    <BaseNavigationContainer>
      <TestNavigator>
        <Screen name="foo" component={React.Fragment}>
          {null as any}
        </Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await expect(render(element)).resolves.toBeDefined();
});

test('returns currently focused route with getCurrentRoute', async () => {
  const TestNavigator = (props: any): any => {
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

  const TestScreen = () => null;

  const navigation = createNavigationContainerRef<ParamListBase>();

  const container = (
    <BaseNavigationContainer ref={navigation}>
      <TestNavigator>
        <Screen name="bar" options={{ a: 'b' }}>
          {() => (
            <TestNavigator initialRouteName="bar-a">
              <Screen
                name="bar-a"
                component={TestScreen}
                options={{ sample: 'data' }}
              />
            </TestNavigator>
          )}
        </Screen>
        <Screen name="xux" component={TestScreen} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await render(container);

  expect(navigation.getCurrentRoute()).toEqual({
    key: 'bar-a',
    name: 'bar-a',
  });
});

test("returns focused screen's options with getCurrentOptions when focused screen is rendered", async () => {
  const TestNavigator = (props: any): any => {
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

  const TestScreen = () => null;

  const navigation = createNavigationContainerRef<ParamListBase>();

  const container = (
    <BaseNavigationContainer ref={navigation}>
      <TestNavigator>
        <Screen name="bar" options={{ a: 'b' }}>
          {() => (
            <TestNavigator initialRouteName="bar-a">
              <Screen
                name="bar-a"
                component={TestScreen}
                options={{ sample: '1' }}
              />
              <Screen
                name="bar-b"
                component={TestScreen}
                options={{ sample2: '2' }}
              />
            </TestNavigator>
          )}
        </Screen>
        <Screen name="xux" component={TestScreen} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await render(container);

  expect(navigation.getCurrentOptions()).toEqual({
    sample: '1',
  });

  await act(() => navigation.navigate('bar-b'));

  expect(navigation.getCurrentOptions()).toEqual({
    sample2: '2',
  });
});

test('returns focused screen options with getCurrentOptions from navigators in hidden trees', async () => {
  const TestNavigator = (props: any): any => {
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

  const TestScreen = () => null;

  const navigation = createNavigationContainerRef<ParamListBase>();

  const Test = ({ mode }: { mode: 'visible' | 'hidden' }) => (
    <BaseNavigationContainer ref={navigation}>
      <React.Activity mode={mode}>
        <TestNavigator>
          <Screen name="bar" options={{ a: 'b' }}>
            {() => (
              <TestNavigator initialRouteName="bar-a">
                <Screen
                  name="bar-a"
                  component={TestScreen}
                  options={{ sample: '1' }}
                />
                <Screen
                  name="bar-b"
                  component={TestScreen}
                  options={{ sample2: '2' }}
                />
              </TestNavigator>
            )}
          </Screen>
          <Screen name="xux" component={TestScreen} />
        </TestNavigator>
      </React.Activity>
    </BaseNavigationContainer>
  );

  const root = await render(<Test mode="visible" />);

  expect(navigation.getCurrentOptions()).toEqual({
    sample: '1',
  });

  await root.rerender(<Test mode="hidden" />);

  expect(navigation.getCurrentOptions()).toEqual({
    sample: '1',
  });
});

test("returns focused screen's options with getCurrentOptions when focused screen is rendered when using screenOptions", async () => {
  const TestNavigator = (props: any): any => {
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

  const TestScreen = () => null;

  const navigation = createNavigationContainerRef<ParamListBase>();

  const container = (
    <BaseNavigationContainer ref={navigation}>
      <TestNavigator>
        <Screen name="bar" options={{ a: 'b' }}>
          {() => (
            <TestNavigator
              initialRouteName="bar-a"
              screenOptions={() => ({ sample2: '2' })}
            >
              <Screen
                name="bar-a"
                component={TestScreen}
                options={{ sample: '1' }}
              />
              <Screen
                name="bar-b"
                component={TestScreen}
                options={{ sample3: '3' }}
              />
            </TestNavigator>
          )}
        </Screen>
        <Screen name="xux" component={TestScreen} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await render(container);

  expect(navigation.getCurrentOptions()).toEqual({
    sample: '1',
    sample2: '2',
  });

  await act(() => navigation.navigate('bar-b'));

  expect(navigation.getCurrentOptions()).toEqual({
    sample2: '2',
    sample3: '3',
  });
});

test("returns focused screen's options with getCurrentOptions when focused screen is rendered when using Group", async () => {
  const TestNavigator = (props: any): any => {
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

  const TestScreen = () => null;

  const navigation = createNavigationContainerRef<ParamListBase>();

  const container = (
    <BaseNavigationContainer ref={navigation}>
      <TestNavigator>
        <Screen name="bar" options={{ a: 'b' }}>
          {() => (
            <TestNavigator
              initialRouteName="bar-a"
              screenOptions={() => ({ sample2: '2' })}
            >
              <Screen
                name="bar-a"
                component={TestScreen}
                options={{ sample: '1' }}
              />
              <Group screenOptions={{ sample4: '4' }}>
                <Screen
                  name="bar-b"
                  component={TestScreen}
                  options={{ sample3: '3' }}
                />
              </Group>
            </TestNavigator>
          )}
        </Screen>
        <Screen name="xux" component={TestScreen} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await render(container);

  expect(navigation.getCurrentOptions()).toEqual({
    sample: '1',
    sample2: '2',
  });

  await act(() => navigation.navigate('bar-b'));

  expect(navigation.getCurrentOptions()).toEqual({
    sample2: '2',
    sample3: '3',
    sample4: '4',
  });
});

test("returns focused screen's options with getCurrentOptions when all screens are rendered", async () => {
  const TestNavigator = (props: any): any => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      MockRouter,
      props
    );

    return (
      <NavigationContent>
        <>{state.routes.map((route) => descriptors[route.key]?.render())}</>
      </NavigationContent>
    );
  };

  const TestScreen = () => null;

  const navigation = createNavigationContainerRef<ParamListBase>();

  const container = (
    <BaseNavigationContainer ref={navigation}>
      <TestNavigator>
        <Screen name="bar" options={{ a: 'b' }}>
          {() => (
            <TestNavigator initialRouteName="bar-a">
              <Screen
                name="bar-a"
                component={TestScreen}
                options={{ sample: '1' }}
              />
              <Screen
                name="bar-b"
                component={TestScreen}
                options={{ sample2: '2' }}
              />
            </TestNavigator>
          )}
        </Screen>
        <Screen name="xux" component={TestScreen} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await render(container);

  expect(navigation.getCurrentOptions()).toEqual({
    sample: '1',
  });

  await act(() => navigation.navigate('bar-b'));

  expect(navigation.getCurrentOptions()).toEqual({
    sample2: '2',
  });
});

test("returns focused screen's options with getCurrentOptions when all screens are rendered with screenOptions", async () => {
  const TestNavigator = (props: any): any => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      MockRouter,
      props
    );

    return (
      <NavigationContent>
        <>{state.routes.map((route) => descriptors[route.key]?.render())}</>
      </NavigationContent>
    );
  };

  const TestScreen = () => null;

  const navigation = createNavigationContainerRef<ParamListBase>();

  const container = (
    <BaseNavigationContainer ref={navigation}>
      <TestNavigator>
        <Screen name="bar" options={{ a: 'b' }}>
          {() => (
            <TestNavigator
              initialRouteName="bar-a"
              screenOptions={() => ({ sample2: '2' })}
            >
              <Screen
                name="bar-a"
                component={TestScreen}
                options={{ sample: '1' }}
              />
              <Screen
                name="bar-b"
                component={TestScreen}
                options={{ sample3: '3' }}
              />
            </TestNavigator>
          )}
        </Screen>
        <Screen name="xux" component={TestScreen} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await render(container);

  expect(navigation.getCurrentOptions()).toEqual({
    sample: '1',
    sample2: '2',
  });

  await act(() => navigation.navigate('bar-b'));

  expect(navigation.getCurrentOptions()).toEqual({
    sample2: '2',
    sample3: '3',
  });
});

test("returns focused screen's options with getCurrentOptions when all screens are rendered with Group", async () => {
  const TestNavigator = (props: any): any => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      MockRouter,
      props
    );

    return (
      <NavigationContent>
        <>{state.routes.map((route) => descriptors[route.key]?.render())}</>
      </NavigationContent>
    );
  };

  const TestScreen = () => null;

  const navigation = createNavigationContainerRef<ParamListBase>();

  const container = (
    <BaseNavigationContainer ref={navigation}>
      <TestNavigator>
        <Screen name="bar" options={{ a: 'b' }}>
          {() => (
            <TestNavigator
              initialRouteName="bar-a"
              screenOptions={() => ({ sample2: '2' })}
            >
              <Screen
                name="bar-a"
                component={TestScreen}
                options={{ sample: '1' }}
              />
              <Group screenOptions={{ sample4: '4' }}>
                <Screen
                  name="bar-b"
                  component={TestScreen}
                  options={{ sample3: '3' }}
                />
              </Group>
            </TestNavigator>
          )}
        </Screen>
        <Screen name="xux" component={TestScreen} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await render(container);

  expect(navigation.getCurrentOptions()).toEqual({
    sample: '1',
    sample2: '2',
  });

  await act(() => navigation.navigate('bar-b'));

  expect(navigation.getCurrentOptions()).toEqual({
    sample2: '2',
    sample3: '3',
    sample4: '4',
  });
});

test('does not throw if while getting current options with no options defined', async () => {
  const TestNavigator = (props: any): any => {
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

  const TestScreen = () => null;

  const navigation = createNavigationContainerRef<ParamListBase>();

  const container = (
    <BaseNavigationContainer ref={navigation}>
      <TestNavigator>
        <Screen name="bar" options={{ a: 'b' }}>
          {() => (
            <TestNavigator initialRouteName="bar-a">
              <Screen
                name="bar-b"
                component={TestScreen}
                options={{ wrongKey: true }}
              />
              <Screen name="bar-a" component={TestScreen} />
            </TestNavigator>
          )}
        </Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await render(container);

  expect(navigation.getCurrentOptions()).toEqual({});
});

test('does not throw if while getting current options with empty container', async () => {
  const navigation = createNavigationContainerRef<ParamListBase>();

  const container = (
    <BaseNavigationContainer ref={navigation}>{null}</BaseNavigationContainer>
  );

  await render(container);

  expect(navigation.getCurrentOptions()).toBeUndefined();
});

test('shows stale content instead of fallback with startTransition for setParams', async () => {
  const TestNavigator = (props: any) => {
    const { state, descriptors } = useNavigationBuilder(MockRouter, props);
    const route = state.routes[state.index];

    if (route == null) {
      return null;
    }

    return descriptors[route.key]?.render();
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  let { promise, resolve } = createDeferred();

  const Content = ({ contentId }: { contentId: number }) => {
    if (contentId !== 0) {
      React.use(promise);
    }

    return <Text>[content-{contentId}]</Text>;
  };

  const TestScreen = (props: any) => {
    const contentId = props.route.params?.contentId ?? 0;
    return (
      <React.Suspense fallback={<Text>[fallback]</Text>}>
        <Content contentId={contentId} />
      </React.Suspense>
    );
  };

  const root = await render(
    <BaseNavigationContainer ref={navigation}>
      <TestNavigator>
        <Screen name="A" component={TestScreen} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  expect(root).toMatchInlineSnapshot(`
    <Text>
      [content-
      0
      ]
    </Text>
  `);

  await act(async () => {
    navigation.dispatch(CommonActions.setParams({ contentId: 1 }));
  });

  expect(root).toMatchInlineSnapshot(`
    <>
      <Text
        style={
          {
            "display": "none",
          }
        }
      >
        [content-
        0
        ]
      </Text>
      <Text>
        [fallback]
      </Text>
    </>
  `);

  await act(async () => resolve());

  expect(root).toMatchInlineSnapshot(`
    <Text>
      [content-
      1
      ]
    </Text>
  `);

  ({ promise, resolve } = createDeferred());

  await act(async () => {
    navigation.dispatch(CommonActions.setParams({ contentId: 2 }));
  });

  expect(root).toMatchInlineSnapshot(`
    <>
      <Text
        style={
          {
            "display": "none",
          }
        }
      >
        [content-
        1
        ]
      </Text>
      <Text>
        [fallback]
      </Text>
    </>
  `);

  await act(async () => resolve());

  expect(root).toMatchInlineSnapshot(`
    <Text>
      [content-
      2
      ]
    </Text>
  `);

  ({ promise, resolve } = createDeferred());

  await act(async () => {
    React.startTransition(() => {
      navigation.dispatch(CommonActions.setParams({ contentId: 3 }));
    });
  });

  expect(root).toMatchInlineSnapshot(`
    <Text>
      [content-
      2
      ]
    </Text>
  `);

  await act(async () => resolve());

  expect(root).toMatchInlineSnapshot(`
    <Text>
      [content-
      3
      ]
    </Text>
  `);
});
