import * as React from 'react';
import { render } from 'react-native-testing-library';
import useNavigationBuilder from '../useNavigationBuilder';
import NavigationContainer from '../NavigationContainer';
import Screen from '../Screen';
import MockRouter, { MockActions } from './__fixtures__/MockRouter';
import { Router, NavigationState } from '../types';

beforeEach(() => (MockRouter.key = 0));

it("lets parent handle the action if child didn't", () => {
  const ParentRouter: Router<NavigationState, MockActions> = {
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
    const { state, descriptors } = useNavigationBuilder(ParentRouter, props);

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

it("lets children handle the action if parent didn't", () => {
  const ParentRouter: Router<NavigationState, MockActions> = {
    ...MockRouter,

    shouldActionPropagateToChildren() {
      return true;
    },
  };

  const ChildRouter: Router<NavigationState, MockActions> = {
    ...MockRouter,

    shouldActionChangeFocus() {
      return true;
    },

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

  const ChildNavigator = (props: any) => {
    const { state, descriptors } = useNavigationBuilder(ChildRouter, props);

    return descriptors[state.routes[state.index].key].render();
  };

  const ParentNavigator = (props: any) => {
    const { state, descriptors } = useNavigationBuilder(ParentRouter, props);

    return (
      <React.Fragment>
        {state.routes.map(route => descriptors[route.key].render())}
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
          routes: [{ key: 'qux', name: 'qux' }, { key: 'lex', name: 'lex' }],
        },
      },
      { key: 'bar', name: 'bar' },
    ],
  };

  const element = (
    <NavigationContainer
      initialState={initialState}
      onStateChange={onStateChange}
    >
      <ParentNavigator>
        <Screen name="foo">{() => null}</Screen>
        <Screen name="bar">{TestScreen}</Screen>
        <Screen name="baz">
          {() => (
            <ChildNavigator>
              <Screen name="qux" component={() => null} />
              <Screen name="lex" component={() => null} />
            </ChildNavigator>
          )}
        </Screen>
      </ParentNavigator>
    </NavigationContainer>
  );

  render(element).update(element);

  expect(onStateChange).toBeCalledTimes(1);
  expect(onStateChange).lastCalledWith({
    stale: false,
    index: 0,
    key: '7',
    routeNames: ['foo', 'bar', 'baz'],
    routes: [
      {
        key: 'baz',
        name: 'baz',
        state: {
          stale: false,
          index: 0,
          key: '6',
          routeNames: ['qux', 'lex'],
          routes: [{ key: 'lex', name: 'lex' }, { key: 'qux', name: 'qux' }],
        },
      },
      { key: 'bar', name: 'bar' },
    ],
  });
});
