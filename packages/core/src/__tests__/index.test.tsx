import * as React from 'react';
import { render, act } from 'react-native-testing-library';
import Screen from '../Screen';
import NavigationContainer from '../NavigationContainer';
import useNavigationBuilder from '../useNavigationBuilder';
import useNavigation from '../useNavigation';
import MockRouter, { MockRouterKey } from './__fixtures__/MockRouter';
import { NavigationState, NavigationContainerRef } from '../types';

beforeEach(() => (MockRouterKey.current = 0));

it('initializes state for a navigator on navigation', () => {
  const TestNavigator = (props: any) => {
    const { state, descriptors } = useNavigationBuilder(MockRouter, props);

    return descriptors[state.routes[state.index].key].render();
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
    <NavigationContainer onStateChange={onStateChange}>
      <TestNavigator initialRouteName="foo">
        <Screen
          name="foo"
          component={FooScreen}
          initialParams={{ count: 10 }}
        />
        <Screen name="bar" component={jest.fn()} />
        <Screen name="baz">
          {() => (
            <TestNavigator>
              <Screen name="qux" component={jest.fn()} />
            </TestNavigator>
          )}
        </Screen>
      </TestNavigator>
    </NavigationContainer>
  );

  render(element).update(element);

  expect(onStateChange).toBeCalledTimes(1);
  expect(onStateChange).toBeCalledWith({
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

it("doesn't crash when initialState is null", () => {
  const TestNavigator = (props: any) => {
    const { state, descriptors } = useNavigationBuilder(MockRouter, props);

    return descriptors[state.routes[state.index].key].render();
  };

  const TestScreen = () => null;

  const element = (
    // @ts-ignore
    <NavigationContainer initialState={null}>
      <TestNavigator>
        <Screen name="foo" component={TestScreen} />
      </TestNavigator>
    </NavigationContainer>
  );

  expect(() => render(element)).not.toThrowError();
});

it('rehydrates state for a navigator on navigation', () => {
  const TestNavigator = (props: any) => {
    const { state, descriptors } = useNavigationBuilder(MockRouter, props);

    return descriptors[state.routes[state.index].key].render();
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
    <NavigationContainer
      initialState={initialState}
      onStateChange={onStateChange}
    >
      <TestNavigator initialRouteName="foo">
        <Screen name="foo" component={jest.fn()} />
        <Screen name="bar" component={BarScreen} />
      </TestNavigator>
    </NavigationContainer>
  );

  render(element).update(element);

  expect(onStateChange).lastCalledWith({
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

it("doesn't rehydrate state if the type of state didn't match router", () => {
  const TestNavigator = (props: any) => {
    const { state, descriptors } = useNavigationBuilder(MockRouter, props);

    return descriptors[state.routes[state.index].key].render();
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
    <NavigationContainer
      initialState={initialState}
      onStateChange={onStateChange}
    >
      <TestNavigator initialRouteName="foo">
        <Screen
          name="foo"
          component={FooScreen}
          initialParams={{ answer: 42 }}
        />
        <Screen name="bar" component={jest.fn()} />
      </TestNavigator>
    </NavigationContainer>
  );

  render(element).update(element);

  expect(onStateChange).lastCalledWith({
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

it('initializes state for nested screens in React.Fragment', () => {
  const TestNavigator = (props: any) => {
    const { state, descriptors } = useNavigationBuilder(MockRouter, props);

    return descriptors[state.routes[state.index].key].render();
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
    <NavigationContainer onStateChange={onStateChange}>
      <TestNavigator>
        <Screen name="foo" component={TestScreen} />
        <React.Fragment>
          <Screen name="bar" component={jest.fn()} />
          <Screen name="baz" component={jest.fn()} />
        </React.Fragment>
      </TestNavigator>
    </NavigationContainer>
  );

  render(element).update(element);

  expect(onStateChange).toBeCalledTimes(1);
  expect(onStateChange).toBeCalledWith({
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

it('initializes state for nested navigator on navigation', () => {
  const TestNavigator = (props: any) => {
    const { state, descriptors } = useNavigationBuilder(MockRouter, props);

    return descriptors[state.routes[state.index].key].render();
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
    <NavigationContainer onStateChange={onStateChange}>
      <TestNavigator initialRouteName="baz">
        <Screen name="foo" component={jest.fn()} />
        <Screen name="bar" component={jest.fn()} />
        <Screen name="baz">
          {() => (
            <TestNavigator>
              <Screen name="qux" component={TestScreen} />
            </TestNavigator>
          )}
        </Screen>
      </TestNavigator>
    </NavigationContainer>
  );

  render(element).update(element);

  expect(onStateChange).toBeCalledTimes(1);
  expect(onStateChange).toBeCalledWith({
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

it("doesn't update state if nothing changed", () => {
  const TestNavigator = (props: any) => {
    const { state, descriptors } = useNavigationBuilder(MockRouter, props);

    return descriptors[state.routes[state.index].key].render();
  };

  const FooScreen = (props: any) => {
    React.useEffect(() => {
      props.navigation.dispatch({ type: 'NOOP' });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
  };

  const onStateChange = jest.fn();

  render(
    <NavigationContainer onStateChange={onStateChange}>
      <TestNavigator initialRouteName="foo">
        <Screen name="foo" component={FooScreen} />
        <Screen name="bar" component={jest.fn()} />
      </TestNavigator>
    </NavigationContainer>
  );

  expect(onStateChange).toBeCalledTimes(0);
});

it("doesn't update state if action wasn't handled", () => {
  const TestNavigator = (props: any) => {
    const { state, descriptors } = useNavigationBuilder(MockRouter, props);

    return descriptors[state.routes[state.index].key].render();
  };

  const FooScreen = (props: any) => {
    React.useEffect(() => {
      props.navigation.dispatch({ type: 'INVALID' });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
  };

  const onStateChange = jest.fn();

  const spy = jest.spyOn(console, 'error').mockImplementation();

  render(
    <NavigationContainer onStateChange={onStateChange}>
      <TestNavigator initialRouteName="foo">
        <Screen name="foo" component={FooScreen} />
        <Screen name="bar" component={jest.fn()} />
      </TestNavigator>
    </NavigationContainer>
  );

  expect(onStateChange).toBeCalledTimes(0);

  expect(spy.mock.calls[0][0]).toMatch(
    "The action 'INVALID' with payload 'undefined' was not handled by any navigator."
  );

  spy.mockRestore();
});

it('cleans up state when the navigator unmounts', () => {
  const TestNavigator = (props: any) => {
    const { state, descriptors } = useNavigationBuilder(MockRouter, props);

    return descriptors[state.routes[state.index].key].render();
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
    <NavigationContainer onStateChange={onStateChange}>
      <TestNavigator>
        <Screen name="foo" component={FooScreen} />
        <Screen name="bar" component={jest.fn()} />
      </TestNavigator>
    </NavigationContainer>
  );

  const root = render(element);

  root.update(element);

  expect(onStateChange).toBeCalledTimes(1);
  expect(onStateChange).lastCalledWith({
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

  root.update(
    <NavigationContainer onStateChange={onStateChange} children={null} />
  );

  expect(onStateChange).toBeCalledTimes(2);
  expect(onStateChange).lastCalledWith(undefined);
});

it('allows state updates by dispatching a function returning an action', () => {
  const TestNavigator = (props: any) => {
    const { state, descriptors } = useNavigationBuilder(MockRouter, props);

    return descriptors[state.routes[state.index].key].render();
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
    <NavigationContainer onStateChange={onStateChange}>
      <TestNavigator initialRouteName="foo">
        <Screen name="foo" component={FooScreen} />
        <Screen name="bar" component={BarScreen} />
      </TestNavigator>
    </NavigationContainer>
  );

  render(element).update(element);

  expect(onStateChange).toBeCalledTimes(1);
  expect(onStateChange).toBeCalledWith({
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

it('updates route params with setParams', () => {
  const TestNavigator = (props: any) => {
    const { state, descriptors } = useNavigationBuilder(MockRouter, props);

    return descriptors[state.routes[state.index].key].render();
  };

  let setParams: (params: object) => void = () => undefined;

  const FooScreen = (props: any) => {
    setParams = props.navigation.setParams;

    return null;
  };

  const onStateChange = jest.fn();

  render(
    <NavigationContainer onStateChange={onStateChange}>
      <TestNavigator initialRouteName="foo">
        <Screen name="foo" component={FooScreen} />
        <Screen name="bar" component={jest.fn()} />
      </TestNavigator>
    </NavigationContainer>
  );

  act(() => setParams({ username: 'alice' }));

  expect(onStateChange).toBeCalledTimes(1);
  expect(onStateChange).lastCalledWith({
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

  act(() => setParams({ age: 25 }));

  expect(onStateChange).toBeCalledTimes(2);
  expect(onStateChange).lastCalledWith({
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

it('updates route params with setParams applied to parent', () => {
  const TestNavigator = (props: any) => {
    const { state, descriptors } = useNavigationBuilder(MockRouter, props);

    return descriptors[state.routes[state.index].key].render();
  };

  let setParams: (params: object) => void = () => undefined;

  const FooScreen = (props: any) => {
    const parent = props.navigation.dangerouslyGetParent();
    if (parent) {
      setParams = parent.setParams;
    }

    return null;
  };

  const onStateChange = jest.fn();

  render(
    <NavigationContainer onStateChange={onStateChange}>
      <TestNavigator initialRouteName="foo">
        <Screen name="foo">
          {() => (
            <TestNavigator initialRouteName="baz">
              <Screen name="baz" component={FooScreen} />
            </TestNavigator>
          )}
        </Screen>
        <Screen name="bar" component={jest.fn()} />
      </TestNavigator>
    </NavigationContainer>
  );

  act(() => setParams({ username: 'alice' }));

  expect(onStateChange).toBeCalledTimes(1);
  expect(onStateChange).lastCalledWith({
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

  act(() => setParams({ age: 25 }));

  expect(onStateChange).toBeCalledTimes(2);
  expect(onStateChange).lastCalledWith({
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

it('handles change in route names', () => {
  const TestNavigator = (props: any): any => {
    useNavigationBuilder(MockRouter, props);
    return null;
  };

  const onStateChange = jest.fn();

  const root = render(
    <NavigationContainer onStateChange={onStateChange}>
      <TestNavigator initialRouteName="bar">
        <Screen name="foo" component={jest.fn()} />
        <Screen name="bar" component={jest.fn()} />
      </TestNavigator>
    </NavigationContainer>
  );

  root.update(
    <NavigationContainer onStateChange={onStateChange}>
      <TestNavigator>
        <Screen name="foo" component={jest.fn()} />
        <Screen name="baz" component={jest.fn()} />
        <Screen name="qux" component={jest.fn()} />
      </TestNavigator>
    </NavigationContainer>
  );

  expect(onStateChange).toBeCalledWith({
    stale: false,
    type: 'test',
    index: 0,
    key: '0',
    routeNames: ['foo', 'baz', 'qux'],
    routes: [{ key: 'foo', name: 'foo' }],
  });
});

it('navigates to nested child in a navigator', () => {
  const TestNavigator = (props: any): any => {
    const { state, descriptors } = useNavigationBuilder(MockRouter, props);

    return descriptors[state.routes[state.index].key].render();
  };

  const TestComponent = ({ route }: any): any =>
    `[${route.name}, ${JSON.stringify(route.params)}]`;

  const onStateChange = jest.fn();

  const navigation = React.createRef<NavigationContainerRef>();

  const element = render(
    <NavigationContainer ref={navigation} onStateChange={onStateChange}>
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
    </NavigationContainer>
  );

  expect(element).toMatchInlineSnapshot(`"[foo-a, undefined]"`);

  act(
    () =>
      navigation.current &&
      navigation.current.navigate('bar', {
        screen: 'bar-b',
        params: { test: 42 },
      })
  );

  expect(element).toMatchInlineSnapshot(
    `"[bar-b, {\\"some\\":\\"stuff\\",\\"test\\":42}]"`
  );

  act(
    () =>
      navigation.current &&
      navigation.current.navigate('bar', {
        screen: 'bar-a',
        params: { whoa: 'test' },
      })
  );

  expect(element).toMatchInlineSnapshot(
    `"[bar-a, {\\"lol\\":\\"why\\",\\"whoa\\":\\"test\\"}]"`
  );
});

it('gives access to internal state', () => {
  const TestNavigator = (props: any): any => {
    const { state, descriptors } = useNavigationBuilder(MockRouter, props);

    return descriptors[state.routes[state.index].key].render();
  };

  let state: NavigationState | undefined;

  const Test = () => {
    const navigation = useNavigation();
    state = navigation.dangerouslyGetState();
    return null;
  };

  const root = (
    <NavigationContainer>
      <TestNavigator initialRouteName="bar">
        <Screen name="bar" component={Test} />
      </TestNavigator>
    </NavigationContainer>
  );

  render(root).update(root);

  expect(state).toEqual({
    index: 0,
    key: '0',
    routeNames: ['bar'],
    routes: [{ key: 'bar', name: 'bar' }],
    stale: false,
    type: 'test',
  });
});

it("throws if navigator doesn't have any screens", () => {
  const TestNavigator = (props: any) => {
    useNavigationBuilder(MockRouter, props);
    return null;
  };

  const element = (
    <NavigationContainer>
      <TestNavigator />
    </NavigationContainer>
  );

  expect(() => render(element).update(element)).toThrowError(
    "Couldn't find any screens for the navigator. Have you defined any screens as its children?"
  );
});

it('throws if navigator is not inside a container', () => {
  const TestNavigator = (props: any) => {
    useNavigationBuilder(MockRouter, props);
    return null;
  };

  const element = (
    <TestNavigator>
      <Screen name="foo" component={jest.fn()} />
    </TestNavigator>
  );

  expect(() => render(element).update(element)).toThrowError(
    "Couldn't register the navigator. Have you wrapped your app with 'NavigationContainer'?"
  );
});

it('throws if multiple navigators rendered under one container', () => {
  const TestNavigator = (props: any) => {
    useNavigationBuilder(MockRouter, props);
    return null;
  };

  const element = (
    <NavigationContainer>
      <TestNavigator>
        <Screen name="foo" component={jest.fn()} />
      </TestNavigator>
      <TestNavigator>
        <Screen name="foo" component={jest.fn()} />
      </TestNavigator>
    </NavigationContainer>
  );

  expect(() => render(element).update(element)).toThrowError(
    'Another navigator is already registered for this container'
  );
});

it('throws when Screen is not the direct children', () => {
  const TestNavigator = (props: any) => {
    useNavigationBuilder(MockRouter, props);
    return null;
  };

  const Bar = () => null;

  const element = (
    <NavigationContainer>
      <TestNavigator>
        <Screen name="foo" component={jest.fn()} />
        <Bar />
      </TestNavigator>
    </NavigationContainer>
  );

  expect(() => render(element).update(element)).toThrowError(
    "A navigator can only contain 'Screen' components as its direct children (found 'Bar')"
  );
});

it('throws when a React Element is not the direct children', () => {
  const TestNavigator = (props: any) => {
    useNavigationBuilder(MockRouter, props);
    return null;
  };

  const element = (
    <NavigationContainer>
      <TestNavigator>
        <Screen name="foo" component={jest.fn()} />
        Hello world
      </TestNavigator>
    </NavigationContainer>
  );

  expect(() => render(element).update(element)).toThrowError(
    "A navigator can only contain 'Screen' components as its direct children (found 'Hello world')"
  );
});

// eslint-disable-next-line jest/expect-expect
it("doesn't throw when direct children is Screen or empty element", () => {
  const TestNavigator = (props: any) => {
    useNavigationBuilder(MockRouter, props);
    return null;
  };

  render(
    <NavigationContainer>
      <TestNavigator>
        <Screen name="foo" component={jest.fn()} />
        {null}
        {undefined}
        {false}
        {true}
      </TestNavigator>
    </NavigationContainer>
  );
});

it('throws when multiple screens with same name are defined', () => {
  const TestNavigator = (props: any) => {
    useNavigationBuilder(MockRouter, props);
    return null;
  };

  const element = (
    <NavigationContainer>
      <TestNavigator>
        <Screen name="foo" component={jest.fn()} />
        <Screen name="bar" component={jest.fn()} />
        <Screen name="foo" component={jest.fn()} />
      </TestNavigator>
    </NavigationContainer>
  );

  expect(() => render(element).update(element)).toThrowError(
    "A navigator cannot contain multiple 'Screen' components with the same name (found duplicate screen named 'foo')"
  );
});

it('switches rendered navigators', () => {
  const TestNavigator = (props: any) => {
    useNavigationBuilder(MockRouter, props);
    return null;
  };

  const root = render(
    <NavigationContainer>
      <TestNavigator key="a">
        <Screen name="foo" component={jest.fn()} />
      </TestNavigator>
    </NavigationContainer>
  );

  expect(() =>
    root.update(
      <NavigationContainer>
        <TestNavigator key="b">
          <Screen name="foo" component={jest.fn()} />
        </TestNavigator>
      </NavigationContainer>
    )
  ).not.toThrowError(
    'Another navigator is already registered for this container.'
  );
});

it('throws if both children and component are passed', () => {
  const TestNavigator = (props: any) => {
    useNavigationBuilder(MockRouter, props);
    return null;
  };

  const element = (
    <NavigationContainer>
      <TestNavigator>
        <Screen name="foo" component={jest.fn()}>
          {jest.fn()}
        </Screen>
      </TestNavigator>
    </NavigationContainer>
  );

  expect(() => render(element).update(element)).toThrowError(
    "We got both 'component' and 'children' props for 'Screen'. You must pass only one of them."
  );
});

it('throws descriptive error for undefined screen component', () => {
  const TestNavigator = (props: any) => {
    useNavigationBuilder(MockRouter, props);
    return null;
  };

  const element = (
    <NavigationContainer>
      <TestNavigator>
        <Screen name="foo" component={undefined as any} />
      </TestNavigator>
    </NavigationContainer>
  );

  expect(() => render(element).update(element)).toThrowError(
    "We couldn't find a 'component' or 'children' prop for 'Screen'"
  );
});

it('throws descriptive error for invalid screen component', () => {
  const TestNavigator = (props: any) => {
    useNavigationBuilder(MockRouter, props);
    return null;
  };

  const element = (
    <NavigationContainer>
      <TestNavigator>
        <Screen name="foo" component={{} as any} />
      </TestNavigator>
    </NavigationContainer>
  );

  expect(() => render(element).update(element)).toThrowError(
    "We got an invalid value for 'component' prop for 'Screen'. It must be a a valid React Component."
  );
});

it('throws descriptive error for invalid children', () => {
  const TestNavigator = (props: any) => {
    useNavigationBuilder(MockRouter, props);
    return null;
  };

  const element = (
    <NavigationContainer>
      <TestNavigator>
        <Screen name="foo">{[] as any}</Screen>
      </TestNavigator>
    </NavigationContainer>
  );

  expect(() => render(element).update(element)).toThrowError(
    "We got an invalid value for 'children' prop for 'Screen'. It must be a function returning a React Element."
  );
});

it("doesn't throw if children is null", () => {
  const TestNavigator = (props: any) => {
    useNavigationBuilder(MockRouter, props);
    return null;
  };

  const element = (
    <NavigationContainer>
      <TestNavigator>
        <Screen name="foo" component={jest.fn()}>
          {null as any}
        </Screen>
      </TestNavigator>
    </NavigationContainer>
  );

  expect(() => render(element).update(element)).not.toThrowError();
});
