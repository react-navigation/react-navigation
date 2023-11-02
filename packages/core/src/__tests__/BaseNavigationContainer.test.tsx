import {
  type DefaultRouterOptions,
  type NavigationState,
  type ParamListBase,
  type Router,
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
import { useNavigationBuilder } from '../useNavigationBuilder';
import {
  type MockActions,
  MockRouter,
  MockRouterKey,
} from './__fixtures__/MockRouter';

beforeEach(() => {
  MockRouterKey.current = 0;
});

it('throws when getState is accessed without a container', () => {
  expect.assertions(1);

  const Test = () => {
    const { getState } = React.useContext(NavigationStateContext);

    getState;

    return null;
  };

  const element = <Test />;

  expect(() => render(element).update(element)).toThrow(
    "Couldn't find a navigation context. Have you wrapped your app with 'NavigationContainer'?"
  );
});

it('throws when setState is accessed without a container', () => {
  expect.assertions(1);

  const Test = () => {
    const { setState } = React.useContext(NavigationStateContext);

    setState;

    return null;
  };

  const element = <Test />;

  expect(() => render(element).update(element)).toThrow(
    "Couldn't find a navigation context. Have you wrapped your app with 'NavigationContainer'?"
  );
});

it('throws when nesting containers', () => {
  expect(() =>
    render(
      <BaseNavigationContainer>
        <BaseNavigationContainer>
          <React.Fragment />
        </BaseNavigationContainer>
      </BaseNavigationContainer>
    )
  ).toThrow(
    "Looks like you have nested a 'NavigationContainer' inside another."
  );

  expect(() =>
    render(
      <BaseNavigationContainer>
        <NavigationIndependentTree>
          <BaseNavigationContainer>
            <React.Fragment />
          </BaseNavigationContainer>
        </NavigationIndependentTree>
      </BaseNavigationContainer>
    )
  ).not.toThrow(
    "Looks like you have nested a 'NavigationContainer' inside another."
  );
});

it('handle dispatching with ref', () => {
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
    const { state, descriptors } = useNavigationBuilder(
      CurrentRootRouter,
      props
    );

    return (
      <React.Fragment>
        {state.routes.map((route) => descriptors[route.key].render())}
      </React.Fragment>
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

  render(element).update(element);

  act(() => {
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

it('handle resetting state with ref', () => {
  const TestNavigator = (props: any) => {
    const { state, descriptors } = useNavigationBuilder(MockRouter, props);

    return (
      <React.Fragment>
        {state.routes.map((route) => descriptors[route.key].render())}
      </React.Fragment>
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

  render(element).update(element);

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

  act(() => {
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

it('handles getRootState', () => {
  const TestNavigator = (props: any) => {
    const { state, descriptors } = useNavigationBuilder(MockRouter, props);

    return descriptors[state.routes[state.index].key].render();
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

  render(element);

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

it('emits state events when the state changes', () => {
  const TestNavigator = (props: any) => {
    const { state, descriptors } = useNavigationBuilder(MockRouter, props);

    return (
      <React.Fragment>
        {state.routes.map((route) => descriptors[route.key].render())}
      </React.Fragment>
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

  render(element).update(element);

  const listener = jest.fn();

  ref.current?.addListener('state', listener);

  expect(listener).not.toHaveBeenCalled();

  act(() => {
    ref.current?.navigate('bar');
  });

  expect(listener).toHaveBeenCalledTimes(1);
  expect(listener.mock.calls[0][0].data.state).toEqual({
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

  act(() => {
    ref.current?.navigate('baz', { answer: 42 });
  });

  expect(listener).toHaveBeenCalledTimes(2);
  expect(listener.mock.calls[1][0].data.state).toEqual({
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

it('emits state events when new navigator mounts', () => {
  jest.useFakeTimers();

  const TestNavigator = (props: any) => {
    const { state, descriptors } = useNavigationBuilder(MockRouter, props);

    return (
      <React.Fragment>
        {state.routes.map((route) => descriptors[route.key].render())}
      </React.Fragment>
    );
  };

  const ref = createNavigationContainerRef<ParamListBase>();

  const NestedNavigator = () => {
    const [isRendered, setIsRendered] = React.useState(false);

    React.useEffect(() => {
      setTimeout(() => setIsRendered(true), 100);
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

  render(element).update(element);

  const listener = jest.fn();

  ref.current?.addListener('state', listener);

  expect(listener).not.toHaveBeenCalled();
  expect(onStateChange).not.toHaveBeenCalled();

  act(() => {
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
  expect(listener.mock.calls[0][0].data.state).toEqual(resultState);

  expect(onStateChange).toHaveBeenCalledTimes(1);
  expect(onStateChange).toHaveBeenLastCalledWith(resultState);
});

it('emits option events when options change with tab router', () => {
  const TestNavigator = (props: any) => {
    const { state, descriptors } = useNavigationBuilder(TabRouter, props);

    return (
      <React.Fragment>
        {state.routes.map((route) => descriptors[route.key].render())}
      </React.Fragment>
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

  const listener = jest.fn();

  render(element).update(element);
  ref.current?.addListener('options', listener);

  act(() => {
    ref.current?.navigate('bar');
  });

  expect(listener).toHaveBeenCalledTimes(1);
  expect(listener.mock.calls[0][0].data.options).toEqual({ y: 2 });
  expect(ref.current?.getCurrentOptions()).toEqual({ y: 2 });

  ref.current?.removeListener('options', listener);

  const listener2 = jest.fn();

  ref.current?.addListener('options', listener2);

  act(() => {
    ref.current?.navigate('baz');
  });

  expect(listener2).toHaveBeenCalledTimes(1);
  expect(listener2.mock.calls[0][0].data.options).toEqual({ g: 5 });
  expect(ref.current?.getCurrentOptions()).toEqual({ g: 5 });

  act(() => {
    ref.current?.navigate('quxx');
  });

  expect(listener2).toHaveBeenCalledTimes(2);
  expect(listener2.mock.calls[1][0].data.options).toEqual({ h: 9 });
  expect(ref.current?.getCurrentOptions()).toEqual({ h: 9 });
});

it('emits option events when options change with stack router', () => {
  const TestNavigator = (props: any) => {
    const { state, descriptors } = useNavigationBuilder(StackRouter, props);

    return (
      <React.Fragment>
        {state.routes.map((route) => descriptors[route.key].render())}
      </React.Fragment>
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

  const listener = jest.fn();

  render(element).update(element);
  ref.current?.addListener('options', listener);

  act(() => {
    ref.current?.navigate('bar');
  });

  expect(listener).toHaveBeenCalledTimes(1);
  expect(listener.mock.calls[0][0].data.options).toEqual({ y: 2 });
  expect(ref.current?.getCurrentOptions()).toEqual({ y: 2 });

  ref.current?.removeListener('options', listener);

  const listener2 = jest.fn();

  ref.current?.addListener('options', listener2);

  act(() => {
    ref.current?.navigate('baz');
  });

  expect(listener2).toHaveBeenCalledTimes(1);
  expect(listener2.mock.calls[0][0].data.options).toEqual({ g: 5 });
  expect(ref.current?.getCurrentOptions()).toEqual({ g: 5 });

  act(() => {
    ref.current?.navigate('quxx');
  });

  expect(listener2).toHaveBeenCalledTimes(2);
  expect(listener2.mock.calls[1][0].data.options).toEqual({ h: 9 });
  expect(ref.current?.getCurrentOptions()).toEqual({ h: 9 });
});

it('throws if there is no navigator rendered', () => {
  expect.assertions(1);

  const ref = createNavigationContainerRef<ParamListBase>();

  const element = (
    <BaseNavigationContainer ref={ref}>{null}</BaseNavigationContainer>
  );

  render(element);

  const spy = jest.spyOn(console, 'error').mockImplementation();

  ref.current?.dispatch({ type: 'WHATEVER' });

  expect(spy.mock.calls[0][0]).toMatch(
    "The 'navigation' object hasn't been initialized yet."
  );

  spy.mockRestore();
});

it("throws if the ref hasn't finished initializing", () => {
  expect.assertions(1);

  const ref = createNavigationContainerRef<ParamListBase>();

  const TestNavigator = (props: any) => {
    const { state, descriptors } = useNavigationBuilder(MockRouter, props);

    return descriptors[state.routes[state.index].key].render();
  };

  const TestScreen = () => {
    React.useEffect(() => {
      const spy = jest.spyOn(console, 'error').mockImplementation();

      ref.current?.dispatch({ type: 'WHATEVER' });

      expect(spy.mock.calls[0][0]).toMatch(
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

  render(element);
});

it('fires onReady after navigator is rendered', () => {
  const ref = createNavigationContainerRef<ParamListBase>();

  const TestNavigator = (props: any) => {
    const { state, descriptors } = useNavigationBuilder(MockRouter, props);

    return descriptors[state.routes[state.index].key].render();
  };

  const onReady = jest.fn();

  const element = (
    <BaseNavigationContainer ref={ref} onReady={onReady}>
      {null}
    </BaseNavigationContainer>
  );

  const root = render(element);

  expect(onReady).not.toHaveBeenCalled();
  expect(ref.current?.isReady()).toBe(false);

  root.rerender(
    <BaseNavigationContainer ref={ref} onReady={onReady}>
      <TestNavigator>
        <Screen name="foo">{() => null}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  expect(onReady).toHaveBeenCalledTimes(1);
  expect(ref.current?.isReady()).toBe(true);
});

it('invokes the unhandled action listener with the unhandled action', () => {
  const ref = createNavigationContainerRef<ParamListBase>();
  const fn = jest.fn();

  const TestNavigator = (props: any) => {
    const { state, descriptors } = useNavigationBuilder(MockRouter, props);

    return (
      <React.Fragment>
        {state.routes.map((route) => descriptors[route.key].render())}
      </React.Fragment>
    );
  };

  const TestScreen = () => <></>;

  render(
    <BaseNavigationContainer ref={ref} onUnhandledAction={fn}>
      <TestNavigator>
        <Screen name="foo" component={TestScreen} />
        <Screen name="bar" component={TestScreen} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  act(() => ref.current!.navigate('bar'));
  act(() => ref.current!.navigate('baz'));

  expect(fn).toHaveBeenCalledWith({
    payload: {
      name: 'baz',
    },
    type: 'NAVIGATE',
  });
});

it('works with state change events in independent nested container', () => {
  const TestNavigator = (props: any) => {
    const { state, descriptors } = useNavigationBuilder(MockRouter, props);

    return (
      <React.Fragment>
        {state.routes.map((route) => descriptors[route.key].render())}
      </React.Fragment>
    );
  };

  const ref = createNavigationContainerRef<ParamListBase>();

  const onStateChange = jest.fn();

  render(
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

  act(() => ref.current?.navigate('lex'));

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

it('warns for duplicate route names nested inside each other', () => {
  const TestNavigator = (props: any) => {
    const { state, descriptors } = useNavigationBuilder(MockRouter, props);

    return (
      <React.Fragment>
        {descriptors[state.routes[state.index].key].render()}
      </React.Fragment>
    );
  };

  const TestScreen = () => <></>;

  const spy = jest.spyOn(console, 'warn').mockImplementation();

  render(
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

  expect(spy.mock.calls[0][0]).toMatch(
    'Found screens with the same name nested inside one another.'
  );

  render(
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

  expect(spy.mock.calls[1][0]).toMatch(
    'Found screens with the same name nested inside one another.'
  );

  render(
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
