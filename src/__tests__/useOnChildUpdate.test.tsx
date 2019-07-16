import * as React from 'react';
import { render } from 'react-native-testing-library';
import { Router } from '../types';
import useNavigationBuilder from '../useNavigationBuilder';
import NavigationContainer from '../NavigationContainer';
import Screen from '../Screen';
import { MockRouter } from './index.test';

beforeEach(() => (MockRouter.key = 0));

it("lets children handle the action if parent didn't", () => {
  const ParentRouter: Router<{ type: string }> = {
    ...MockRouter,

    shouldActionPropagateToChildren() {
      return true;
    },
  };

  const ChildRouter: Router<{ type: string }> = {
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
    const { navigation, descriptors } = useNavigationBuilder(
      ChildRouter,
      props
    );

    return descriptors[
      navigation.state.routes[navigation.state.index].key
    ].render();
  };

  const ParentNavigator = (props: any) => {
    const { navigation, descriptors } = useNavigationBuilder(
      ParentRouter,
      props
    );

    return (
      <React.Fragment>
        {navigation.state.routes.map(route => descriptors[route.key].render())}
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

  render(
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

  expect(onStateChange).toBeCalledTimes(1);
  expect(onStateChange).lastCalledWith({
    index: 0,
    key: '5',
    routeNames: ['foo', 'bar', 'baz'],
    routes: [
      {
        key: 'baz',
        name: 'baz',
        state: {
          index: 0,
          key: '4',
          routeNames: ['qux', 'lex'],
          routes: [{ key: 'lex', name: 'lex' }, { key: 'qux', name: 'qux' }],
        },
      },
      { key: 'bar', name: 'bar' },
    ],
  });
});
