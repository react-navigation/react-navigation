import * as React from 'react';
import { render, act } from 'react-native-testing-library';
import Screen from '../Screen';
import NavigationContainer from '../NavigationContainer';
import useNavigationBuilder from '../useNavigationBuilder';
import { Router } from '../types';

export const MockRouter: Router<{ type: string }> & { key: number } = {
  key: 0,

  getInitialState({
    routeNames,
    initialRouteName = routeNames[0],
    initialParamsList,
  }) {
    const index = routeNames.indexOf(initialRouteName);

    return {
      key: String(MockRouter.key++),
      index,
      routeNames,
      routes: routeNames.map(name => ({
        name,
        key: name,
        params: initialParamsList[name],
      })),
    };
  },

  getRehydratedState({ routeNames, partialState }) {
    let state = partialState;

    if (state.routeNames === undefined || state.key === undefined) {
      state = {
        ...state,
        routeNames,
        key: String(MockRouter.key++),
      };
    }

    return state;
  },

  getStateForAction(state, action) {
    switch (action.type) {
      case 'UPDATE':
        return { ...state };

      case 'NOOP':
        return state;

      default:
        return null;
    }
  },

  getStateForChildUpdate(state, { update, focus, key }) {
    const index = state.routes.findIndex(r => r.key === key);

    if (index === -1) {
      return state;
    }

    return {
      ...state,
      index: focus ? index : state.index,
      routes: state.routes.map((route, i) =>
        i === index ? { ...route, state: update } : route
      ),
    };
  },

  shouldActionPropagateToChildren() {
    return false;
  },

  shouldActionChangeFocus() {
    return false;
  },

  actionCreators: {},
};

beforeEach(() => (MockRouter.key = 0));

it('initializes state for a navigator on navigation', () => {
  const TestNavigator = (props: any) => {
    const { navigation, descriptors } = useNavigationBuilder(MockRouter, props);

    return descriptors[
      navigation.state.routes[navigation.state.index].key
    ].render();
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

it('rehydrates state for a navigator on navigation', () => {
  const TestNavigator = (props: any) => {
    const { navigation, descriptors } = useNavigationBuilder(MockRouter, props);

    return descriptors[
      navigation.state.routes[navigation.state.index].key
    ].render();
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
    routes: [{ key: 'foo', name: 'foo' }, { key: 'bar', name: 'bar' }],
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
    key: '2',
    routeNames: ['foo', 'bar'],
    routes: [{ key: 'foo', name: 'foo' }, { key: 'bar', name: 'bar' }],
  });
});

it('initializes state for nested navigator on navigation', () => {
  const TestNavigator = (props: any) => {
    const { navigation, descriptors } = useNavigationBuilder(MockRouter, props);

    return descriptors[
      navigation.state.routes[navigation.state.index].key
    ].render();
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
    const { navigation, descriptors } = useNavigationBuilder(MockRouter, props);

    return descriptors[
      navigation.state.routes[navigation.state.index].key
    ].render();
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
    const { navigation, descriptors } = useNavigationBuilder(MockRouter, props);

    return descriptors[
      navigation.state.routes[navigation.state.index].key
    ].render();
  };

  const FooScreen = (props: any) => {
    React.useEffect(() => {
      props.navigation.dispatch({ type: 'INVALID' });
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

it('cleans up state when the navigator unmounts', () => {
  const TestNavigator = (props: any) => {
    const { navigation, descriptors } = useNavigationBuilder(MockRouter, props);

    return descriptors[
      navigation.state.routes[navigation.state.index].key
    ].render();
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
    index: 0,
    key: '0',
    routeNames: ['foo', 'bar'],
    routes: [{ key: 'foo', name: 'foo' }, { key: 'bar', name: 'bar' }],
  });

  root.update(
    <NavigationContainer onStateChange={onStateChange} children={null} />
  );

  expect(onStateChange).toBeCalledTimes(2);
  expect(onStateChange).lastCalledWith(undefined);
});

it("lets parent handle the action if child didn't", () => {
  const ParentRouter: Router<{ type: string }> = {
    ...MockRouter,

    getStateForAction(state, action) {
      if (action.type === 'REVERSE') {
        return {
          ...state,
          routes: state.routes.slice().reverse(),
        };
      }

      return MockRouter.getStateForAction(state, action);
    },
  };

  const ParentNavigator = (props: any) => {
    const { navigation, descriptors } = useNavigationBuilder(
      ParentRouter,
      props
    );

    return descriptors[
      navigation.state.routes[navigation.state.index].key
    ].render();
  };

  const ChildNavigator = (props: any) => {
    const { navigation, descriptors } = useNavigationBuilder(MockRouter, props);

    return descriptors[
      navigation.state.routes[navigation.state.index].key
    ].render();
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
    <NavigationContainer onStateChange={onStateChange}>
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
    </NavigationContainer>
  );

  expect(onStateChange).toBeCalledTimes(1);
  expect(onStateChange).lastCalledWith({
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

it('allows arbitrary state updates by dispatching a function', () => {
  const TestNavigator = (props: any) => {
    const { navigation, descriptors } = useNavigationBuilder(MockRouter, props);

    return descriptors[
      navigation.state.routes[navigation.state.index].key
    ].render();
  };

  const FooScreen = (props: any) => {
    React.useEffect(() => {
      props.navigation.dispatch((state: any) => ({
        ...state,
        routes: state.routes.slice().reverse(),
        index: 1,
      }));
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
    index: 1,
    key: '0',
    routeNames: ['foo', 'bar'],
    routes: [{ key: 'bar', name: 'bar' }, { key: 'foo', name: 'foo' }],
  });
});

it('updates route params with setParams', () => {
  const TestNavigator = (props: any) => {
    const { navigation, descriptors } = useNavigationBuilder(MockRouter, props);

    return descriptors[
      navigation.state.routes[navigation.state.index].key
    ].render();
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
    index: 0,
    key: '0',
    routeNames: ['foo', 'bar'],
    routes: [
      { key: 'foo', name: 'foo', params: { username: 'alice', age: 25 } },
      { key: 'bar', name: 'bar' },
    ],
  });
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

it('throws if muliple navigators rendered under one container', () => {
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
