import * as React from 'react';
import { act, render } from 'react-native-testing-library';
import NavigationContainer, {
  NavigationStateContext,
} from '../NavigationContainer';
import MockRouter, { MockActions } from './__fixtures__/MockRouter';
import useNavigationBuilder from '../useNavigationBuilder';
import Screen from '../Screen';
import {
  DefaultRouterOptions,
  NavigationState,
  Router,
  NavigationHelpers,
  ParamListBase,
} from '../types';

it('throws when getState is accessed without a container', () => {
  expect.assertions(1);

  const Test = () => {
    const { getState } = React.useContext(NavigationStateContext);

    // eslint-disable-next-line babel/no-unused-expressions
    getState;

    return null;
  };

  const element = <Test />;

  expect(() => render(element).update(element)).toThrowError(
    "We couldn't find a navigation context. Have you wrapped your app with 'NavigationContainer'?"
  );
});

it('throws when setState is accessed without a container', () => {
  expect.assertions(1);

  const Test = () => {
    const { setState } = React.useContext(NavigationStateContext);

    // eslint-disable-next-line babel/no-unused-expressions
    setState;

    return null;
  };

  const element = <Test />;

  expect(() => render(element).update(element)).toThrowError(
    "We couldn't find a navigation context. Have you wrapped your app with 'NavigationContainer'?"
  );
});

it('throws when performTransaction is accessed without a container', () => {
  expect.assertions(1);

  const Test = () => {
    const { performTransaction } = React.useContext(NavigationStateContext);

    // eslint-disable-next-line babel/no-unused-expressions
    performTransaction;

    return null;
  };

  const element = <Test />;

  expect(() => render(element).update(element)).toThrowError(
    "We couldn't find a navigation context. Have you wrapped your app with 'NavigationContainer'?"
  );
});

it('throws when setState is called outside performTransaction', () => {
  expect.assertions(1);

  const Test = () => {
    const { setState } = React.useContext(NavigationStateContext);

    React.useEffect(() => {
      setState(undefined);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
  };

  const element = (
    <NavigationContainer>
      <Test />
    </NavigationContainer>
  );

  expect(() => render(element).update(element)).toThrowError(
    "Any 'setState' calls need to be done inside 'performTransaction'"
  );
});

it('throws when nesting performTransaction', () => {
  expect.assertions(1);

  const Test = () => {
    const { performTransaction } = React.useContext(NavigationStateContext);

    React.useEffect(() => {
      performTransaction(() => {
        performTransaction(() => {});
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
  };

  const element = (
    <NavigationContainer>
      <Test />
    </NavigationContainer>
  );

  expect(() => render(element).update(element)).toThrowError(
    "Only one transaction can be active at a time. Did you accidentally nest 'performTransaction'?"
  );
});

it('handle dispatching with ref', () => {
  function CurrentParentRouter(options: DefaultRouterOptions) {
    const CurrentMockRouter = MockRouter(options);
    const ParentRouter: Router<NavigationState, MockActions> = {
      ...CurrentMockRouter,

      shouldActionPropagateToChildren() {
        return true;
      },
    };
    return ParentRouter;
  }

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

      getStateForAction(state, action) {
        if (action.type === 'REVERSE') {
          return {
            ...state,
            routes: state.routes.slice().reverse(),
          };
        }
        return CurrentMockRouter.getStateForAction(state, action);
      },
    };
    return ChildRouter;
  }

  const ChildNavigator = (props: any) => {
    const { state, descriptors } = useNavigationBuilder(
      CurrentChildRouter,
      props
    );

    return descriptors[state.routes[state.index].key].render();
  };

  const ParentNavigator = (props: any) => {
    const { state, descriptors } = useNavigationBuilder(
      CurrentParentRouter,
      props
    );

    return (
      <React.Fragment>
        {state.routes.map(route => descriptors[route.key].render())}
      </React.Fragment>
    );
  };

  const ref = React.createRef<NavigationHelpers<ParamListBase>>();

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
      ref={ref}
      initialState={initialState}
      onStateChange={onStateChange}
    >
      <ParentNavigator>
        <Screen name="foo">{() => null}</Screen>
        <Screen name="foo2">
          {() => (
            <ChildNavigator>
              <Screen name="qux" component={() => null} />
              <Screen name="lex" component={() => null} />
            </ChildNavigator>
          )}
        </Screen>
        <Screen name="bar">{() => null}</Screen>
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

  act(() => {
    if (ref.current !== null) {
      ref.current.dispatch({ type: 'REVERSE' });
    }
  });

  expect(onStateChange).toBeCalledTimes(1);
  expect(onStateChange).lastCalledWith({
    stale: false,
    index: 0,
    key: '0',
    routeNames: ['foo', 'foo2', 'bar', 'baz'],
    routes: [
      {
        key: 'baz',
        name: 'baz',
        state: {
          stale: false,
          index: 0,
          key: '1',
          routeNames: ['qux', 'lex'],
          routes: [{ key: 'lex', name: 'lex' }, { key: 'qux', name: 'qux' }],
        },
      },
      { key: 'bar', name: 'bar' },
    ],
  });
});
