/* eslint no-shadow:0, react/no-multi-comp:0, react/display-name:0 */

import React from 'react';

import StackRouter from '../StackRouter';
import StackActions from '../StackActions';
import NavigationActions from '../../NavigationActions';
import { _TESTING_ONLY_normalize_keys } from '../KeyGenerator.ts';

beforeEach(() => {
  _TESTING_ONLY_normalize_keys();
});

const ListScreen = () => <div />;

const ProfileNavigator = () => <div />;
ProfileNavigator.router = StackRouter({
  list: {
    path: 'list/:id',
    screen: ListScreen,
  },
});

const MainNavigator = () => <div />;
MainNavigator.router = StackRouter({
  profile: {
    path: 'p/:id',
    screen: ProfileNavigator,
  },
});

const LoginScreen = () => <div />;

const AuthNavigator = () => <div />;
AuthNavigator.router = StackRouter({
  login: {
    screen: LoginScreen,
  },
});

const BarScreen = () => <div />;

class FooNavigator extends React.Component {
  static router = StackRouter({
    bar: {
      path: 'b/:barThing',
      screen: BarScreen,
    },
  });
  render() {
    return <div />;
  }
}

const PersonScreen = () => <div />;

const TestStackRouter = StackRouter({
  main: {
    screen: MainNavigator,
  },
  baz: {
    path: null,
    screen: FooNavigator,
  },
  auth: {
    screen: AuthNavigator,
  },
  person: {
    path: 'people/:id',
    screen: PersonScreen,
  },
  foo: {
    path: 'fo/:fooThing',
    screen: FooNavigator,
  },
});

describe('StackRouter', () => {
  test('Gets the active screen for a given state', () => {
    const FooScreen = () => <div />;
    const BarScreen = () => <div />;
    const router = StackRouter({
      foo: {
        screen: FooScreen,
      },
      bar: {
        screen: BarScreen,
      },
    });

    expect(
      router.getComponentForState({
        index: 0,
        isTransitioning: false,
        routes: [
          { key: 'a', routeName: 'foo' },
          { key: 'b', routeName: 'bar' },
          { key: 'c', routeName: 'foo' },
        ],
      })
    ).toBe(FooScreen);
    expect(
      router.getComponentForState({
        index: 1,
        isTransitioning: false,
        routes: [
          { key: 'a', routeName: 'foo' },
          { key: 'b', routeName: 'bar' },
        ],
      })
    ).toBe(BarScreen);
  });

  test('Handles getScreen in getComponentForState', () => {
    const FooScreen = () => <div />;
    const BarScreen = () => <div />;
    const router = StackRouter({
      foo: {
        getScreen: () => FooScreen,
      },
      bar: {
        getScreen: () => BarScreen,
      },
    });

    expect(
      router.getComponentForState({
        index: 0,
        isTransitioning: false,
        routes: [
          { key: 'a', routeName: 'foo' },
          { key: 'b', routeName: 'bar' },
          { key: 'c', routeName: 'foo' },
        ],
      })
    ).toBe(FooScreen);
    expect(
      router.getComponentForState({
        index: 1,
        isTransitioning: false,
        routes: [
          { key: 'a', routeName: 'foo' },
          { key: 'b', routeName: 'bar' },
        ],
      })
    ).toBe(BarScreen);
  });

  test('Gets the screen for given route', () => {
    const FooScreen = () => <div />;
    const BarScreen = class extends React.Component {
      render() {
        return <div />;
      }
    };
    const BazScreen = class extends React.Component {
      render() {
        return <div />;
      }
    };
    const router = StackRouter({
      foo: {
        screen: FooScreen,
      },
      bar: {
        screen: BarScreen,
      },
      baz: {
        screen: BazScreen,
      },
    });

    expect(router.getComponentForRouteName('foo')).toBe(FooScreen);
    expect(router.getComponentForRouteName('bar')).toBe(BarScreen);
    expect(router.getComponentForRouteName('baz')).toBe(BazScreen);
  });

  test('Handles getScreen in getComponent', () => {
    const FooScreen = () => <div />;
    const BarScreen = class extends React.Component {
      render() {
        return <div />;
      }
    };
    const BazScreen = class extends React.Component {
      render() {
        return <div />;
      }
    };
    const router = StackRouter({
      foo: {
        getScreen: () => FooScreen,
      },
      bar: {
        getScreen: () => BarScreen,
      },
      baz: {
        getScreen: () => BazScreen,
      },
    });

    expect(router.getComponentForRouteName('foo')).toBe(FooScreen);
    expect(router.getComponentForRouteName('bar')).toBe(BarScreen);
    expect(router.getComponentForRouteName('baz')).toBe(BazScreen);
  });

  test('Parses simple paths', () => {
    expect(AuthNavigator.router.getActionForPathAndParams('login')).toEqual({
      type: NavigationActions.NAVIGATE,
      routeName: 'login',
      params: {},
    });
  });

  test('Parses paths with a param', () => {
    expect(TestStackRouter.getActionForPathAndParams('people/foo')).toEqual({
      type: NavigationActions.NAVIGATE,
      routeName: 'person',
      params: {
        id: 'foo',
      },
    });
  });

  test('Parses paths with a query', () => {
    expect(
      TestStackRouter.getActionForPathAndParams('people/foo', {
        code: 'test',
        foo: 'bar',
      })
    ).toEqual({
      type: NavigationActions.NAVIGATE,
      routeName: 'person',
      params: {
        id: 'foo',
        code: 'test',
        foo: 'bar',
      },
    });
  });

  test('Parses paths with an empty query value', () => {
    expect(
      TestStackRouter.getActionForPathAndParams('people/foo', {
        code: '',
        foo: 'bar',
      })
    ).toEqual({
      type: NavigationActions.NAVIGATE,
      routeName: 'person',
      params: {
        id: 'foo',
        code: '',
        foo: 'bar',
      },
    });
  });

  test('Correctly parses a path without arguments into an action chain', () => {
    const uri = 'auth/login';
    const action = TestStackRouter.getActionForPathAndParams(uri);
    expect(action).toEqual({
      type: NavigationActions.NAVIGATE,
      routeName: 'auth',
      params: {},
      action: {
        type: NavigationActions.NAVIGATE,
        routeName: 'login',
        params: {},
      },
    });
  });

  test('Correctly parses a path with arguments into an action chain', () => {
    const uri = 'main/p/4/list/10259959195';
    const action = TestStackRouter.getActionForPathAndParams(uri);
    expect(action).toEqual({
      type: NavigationActions.NAVIGATE,
      routeName: 'main',
      params: {},
      action: {
        type: NavigationActions.NAVIGATE,
        routeName: 'profile',
        params: {
          id: '4',
        },
        action: {
          type: NavigationActions.NAVIGATE,
          routeName: 'list',
          params: {
            id: '10259959195',
          },
        },
      },
    });
  });

  test('Correctly parses a path to the router connected to another router through a pure wildcard route into an action chain', () => {
    const uri = 'b/123';
    const action = TestStackRouter.getActionForPathAndParams(uri);
    expect(action).toEqual({
      type: NavigationActions.NAVIGATE,
      routeName: 'baz',
      params: {},
      action: {
        type: NavigationActions.NAVIGATE,
        routeName: 'bar',
        params: {
          barThing: '123',
        },
      },
    });
  });

  test('Correctly returns null action for non-existent path', () => {
    const uri = 'asdf/1234';
    const action = TestStackRouter.getActionForPathAndParams(uri);
    expect(action).toEqual(null);
  });

  test('Correctly returns action chain for partially matched path', () => {
    const uri = 'auth/login';
    const action = TestStackRouter.getActionForPathAndParams(uri);
    expect(action).toEqual({
      type: NavigationActions.NAVIGATE,
      routeName: 'auth',
      params: {},
      action: {
        type: NavigationActions.NAVIGATE,
        routeName: 'login',
        params: {},
      },
    });
  });

  test('Correctly returns action for path with multiple parameters', () => {
    const path = 'fo/22/b/hello';
    const action = TestStackRouter.getActionForPathAndParams(path);
    expect(action).toEqual({
      type: NavigationActions.NAVIGATE,
      routeName: 'foo',
      params: {
        fooThing: '22',
      },
      action: {
        type: NavigationActions.NAVIGATE,
        routeName: 'bar',
        params: {
          barThing: 'hello',
        },
      },
    });
  });

  test('Pushes other navigators when navigating to an unopened route name', () => {
    const Bar = () => <div />;
    Bar.router = StackRouter({
      baz: { screen: () => <div /> },
      qux: { screen: () => <div /> },
    });
    const TestRouter = StackRouter({
      foo: { screen: () => <div /> },
      bar: { screen: Bar },
    });
    const initState = TestRouter.getStateForAction(NavigationActions.init());
    expect(initState).toEqual({
      index: 0,
      isTransitioning: false,
      key: 'StackRouterRoot',
      routes: [{ key: 'id-0', routeName: 'foo' }],
    });
    const pushedState = TestRouter.getStateForAction(
      NavigationActions.navigate({ routeName: 'qux' }),
      initState
    );
    expect(pushedState.index).toEqual(1);
    expect(pushedState.routes[1].index).toEqual(1);
    expect(pushedState.routes[1].routes[1].routeName).toEqual('qux');
  });

  test('push bubbles up', () => {
    const ChildNavigator = () => <div />;
    ChildNavigator.router = StackRouter({
      Baz: { screen: () => <div /> },
      Qux: { screen: () => <div /> },
    });
    const router = StackRouter({
      Foo: { screen: () => <div /> },
      Bar: { screen: ChildNavigator },
      Bad: { screen: () => <div /> },
    });
    const state = router.getStateForAction({ type: NavigationActions.INIT });
    const state2 = router.getStateForAction(
      {
        type: NavigationActions.NAVIGATE,
        routeName: 'Bar',
      },
      state
    );
    const state3 = router.getStateForAction(
      {
        type: StackActions.PUSH,
        routeName: 'Bad',
      },
      state2
    );
    expect(state3 && state3.index).toEqual(2);
    expect(state3 && state3.routes.length).toEqual(3);
  });

  test('pop bubbles up', () => {
    const ChildNavigator = () => <div />;
    ChildNavigator.router = StackRouter({
      Baz: { screen: () => <div /> },
      Qux: { screen: () => <div /> },
    });
    const router = StackRouter({
      Foo: { screen: () => <div /> },
      Bar: { screen: ChildNavigator },
    });

    const state = router.getStateForAction({ type: NavigationActions.INIT });
    const state2 = router.getStateForAction(
      {
        type: NavigationActions.NAVIGATE,
        routeName: 'Bar',
        key: 'StackRouterRoot',
      },
      state
    );
    const state3 = router.getStateForAction(
      {
        type: StackActions.POP,
      },
      state2
    );
    expect(state3 && state3.index).toEqual(0);
  });

  test('Handle navigation to nested navigator', () => {
    const action = TestStackRouter.getActionForPathAndParams('fo/22/b/hello');
    /* $FlowFixMe */
    const state2 = TestStackRouter.getStateForAction(action);
    expect(state2).toEqual({
      index: 0,
      isTransitioning: false,
      key: 'StackRouterRoot',
      routes: [
        {
          index: 0,
          key: 'id-1',
          isTransitioning: false,
          routeName: 'foo',
          params: {
            fooThing: '22',
          },
          routes: [
            {
              routeName: 'bar',
              key: 'id-0',
              params: {
                barThing: 'hello',
              },
            },
          ],
        },
      ],
    });
  });

  test('popToTop bubbles up', () => {
    const ChildNavigator = () => <div />;
    ChildNavigator.router = StackRouter({
      Baz: { screen: () => <div /> },
      Qux: { screen: () => <div /> },
    });

    const router = StackRouter({
      Foo: { screen: () => <div /> },
      Bar: { screen: ChildNavigator },
    });
    const state = router.getStateForAction({ type: NavigationActions.INIT });
    const state2 = router.getStateForAction(
      {
        type: NavigationActions.NAVIGATE,
        routeName: 'Bar',
      },
      state
    );

    const state3 = router.getStateForAction(
      {
        type: StackActions.POP_TO_TOP,
      },
      state2
    );
    expect(state3 && state3.index).toEqual(0);
  });

  test('popToTop targets StackRouter by key if specified', () => {
    const ChildNavigator = () => <div />;
    ChildNavigator.router = StackRouter({
      Baz: { screen: () => <div /> },
      Qux: { screen: () => <div /> },
    });
    const router = StackRouter({
      Foo: { screen: () => <div /> },
      Bar: { screen: ChildNavigator },
    });
    const state = router.getStateForAction({ type: NavigationActions.INIT });
    const state2 = router.getStateForAction(
      {
        type: NavigationActions.NAVIGATE,
        routeName: 'Bar',
      },
      state
    );

    const state3 = router.getStateForAction(
      {
        type: StackActions.POP_TO_TOP,
        key: state2.key,
      },
      state2
    );
    expect(state3 && state3.index).toEqual(0);
  });

  test('pop action works as expected', () => {
    const TestRouter = StackRouter({
      foo: { screen: () => <div /> },
      bar: { screen: () => <div /> },
    });

    const state = {
      index: 3,
      isTransitioning: false,
      routes: [
        { key: 'A', routeName: 'foo' },
        { key: 'B', routeName: 'bar', params: { bazId: '321' } },
        { key: 'C', routeName: 'foo' },
        { key: 'D', routeName: 'bar' },
      ],
    };
    const poppedState = TestRouter.getStateForAction(StackActions.pop(), state);
    expect(poppedState.routes.length).toBe(3);
    expect(poppedState.index).toBe(2);
    expect(poppedState.isTransitioning).toBe(true);

    const poppedState2 = TestRouter.getStateForAction(
      StackActions.pop({ n: 2, immediate: true }),
      state
    );
    expect(poppedState2.routes.length).toBe(2);
    expect(poppedState2.index).toBe(1);
    expect(poppedState2.isTransitioning).toBe(false);

    const poppedState3 = TestRouter.getStateForAction(
      StackActions.pop({ n: 5 }),
      state
    );
    expect(poppedState3.routes.length).toBe(1);
    expect(poppedState3.index).toBe(0);
    expect(poppedState3.isTransitioning).toBe(true);
  });

  test('popToTop works as expected', () => {
    const TestRouter = StackRouter({
      foo: { screen: () => <div /> },
      bar: { screen: () => <div /> },
    });

    const state = {
      index: 2,
      isTransitioning: false,
      routes: [
        { key: 'A', routeName: 'foo' },
        { key: 'B', routeName: 'bar', params: { bazId: '321' } },
        { key: 'C', routeName: 'foo' },
      ],
    };
    const poppedState = TestRouter.getStateForAction(
      StackActions.popToTop(),
      state
    );
    expect(poppedState.routes.length).toBe(1);
    expect(poppedState.index).toBe(0);
    expect(poppedState.isTransitioning).toBe(true);
    const poppedState2 = TestRouter.getStateForAction(
      StackActions.popToTop(),
      poppedState
    );
    expect(poppedState).toEqual(poppedState2);
    const poppedImmediatelyState = TestRouter.getStateForAction(
      StackActions.popToTop({ immediate: true }),
      state
    );
    expect(poppedImmediatelyState.routes.length).toBe(1);
    expect(poppedImmediatelyState.index).toBe(0);
    expect(poppedImmediatelyState.isTransitioning).toBe(false);
  });

  test('Navigate does not push duplicate routeName', () => {
    const TestRouter = StackRouter(
      {
        foo: { screen: () => <div /> },
        bar: { screen: () => <div /> },
      },
      { initialRouteName: 'foo' }
    );
    const initState = TestRouter.getStateForAction(NavigationActions.init());
    const barState = TestRouter.getStateForAction(
      NavigationActions.navigate({ routeName: 'bar' }),
      initState
    );
    expect(barState.index).toEqual(1);
    expect(barState.routes[1].routeName).toEqual('bar');
    const navigateOnBarState = TestRouter.getStateForAction(
      NavigationActions.navigate({ routeName: 'bar' }),
      barState
    );
    expect(navigateOnBarState).toEqual(null);
  });

  test('Navigate focuses given routeName if already active in stack', () => {
    const TestRouter = StackRouter(
      {
        foo: { screen: () => <div /> },
        bar: { screen: () => <div /> },
        baz: { screen: () => <div /> },
      },
      { initialRouteName: 'foo' }
    );
    const initialState = TestRouter.getStateForAction(NavigationActions.init());
    const fooBarState = TestRouter.getStateForAction(
      NavigationActions.navigate({ routeName: 'bar' }),
      initialState
    );
    const fooBarBazState = TestRouter.getStateForAction(
      NavigationActions.navigate({ routeName: 'baz' }),
      fooBarState
    );
    expect(fooBarBazState.index).toEqual(2);
    expect(fooBarBazState.routes[2].routeName).toEqual('baz');

    const fooState = TestRouter.getStateForAction(
      NavigationActions.navigate({ routeName: 'foo' }),
      fooBarBazState
    );
    expect(fooState.index).toEqual(0);
    expect(fooState.routes.length).toEqual(1);
    expect(fooState.routes[0].routeName).toEqual('foo');
  });

  test('Navigate pushes duplicate routeName if unique key is provided', () => {
    const TestRouter = StackRouter({
      foo: { screen: () => <div /> },
      bar: { screen: () => <div /> },
    });
    const initState = TestRouter.getStateForAction(NavigationActions.init());
    const pushedState = TestRouter.getStateForAction(
      NavigationActions.navigate({ routeName: 'bar' }),
      initState
    );
    expect(pushedState.index).toEqual(1);
    expect(pushedState.routes[1].routeName).toEqual('bar');
    const pushedTwiceState = TestRouter.getStateForAction(
      NavigationActions.navigate({ routeName: 'bar', key: 'new-unique-key!' }),
      pushedState
    );
    expect(pushedTwiceState.index).toEqual(2);
    expect(pushedTwiceState.routes[2].routeName).toEqual('bar');
  });

  test('Navigate from top propagates to any arbitary depth of stacks', () => {
    const GrandChildNavigator = () => <div />;
    GrandChildNavigator.router = StackRouter({
      Quux: { screen: () => <div /> },
      Corge: { screen: () => <div /> },
    });

    const ChildNavigator = () => <div />;
    ChildNavigator.router = StackRouter({
      Baz: { screen: () => <div /> },
      Woo: { screen: () => <div /> },
      Qux: { screen: GrandChildNavigator },
    });

    const Parent = StackRouter({
      Foo: { screen: () => <div /> },
      Bar: { screen: ChildNavigator },
    });

    const state = Parent.getStateForAction({ type: NavigationActions.INIT });
    const state2 = Parent.getStateForAction(
      {
        type: NavigationActions.NAVIGATE,
        routeName: 'Corge',
      },
      state
    );

    expect(state2.isTransitioning).toEqual(true);
    expect(state2.index).toEqual(1);
    expect(state2.routes[1].index).toEqual(1);
    expect(state2.routes[1].routes[1].index).toEqual(1);
    expect(state2.routes[1].routes[1].routes[1].routeName).toEqual('Corge');
  });

  test('Navigate to initial screen is possible', () => {
    const TestRouter = StackRouter(
      {
        foo: { screen: () => <div /> },
        bar: { screen: () => <div /> },
      },
      { initialRouteKey: 'foo' }
    );
    const initState = TestRouter.getStateForAction(NavigationActions.init());
    const pushedState = TestRouter.getStateForAction(
      NavigationActions.navigate({ routeName: 'foo', key: 'foo' }),
      initState
    );
    expect(pushedState).toEqual(null);
  });

  test('Navigate with key and without it is idempotent', () => {
    const TestRouter = StackRouter({
      foo: { screen: () => <div /> },
      bar: { screen: () => <div /> },
    });
    const initState = TestRouter.getStateForAction(NavigationActions.init());
    const pushedState = TestRouter.getStateForAction(
      NavigationActions.navigate({ routeName: 'bar', key: 'a' }),
      initState
    );
    expect(pushedState.index).toEqual(1);
    expect(pushedState.routes[1].routeName).toEqual('bar');
    const pushedTwiceState = TestRouter.getStateForAction(
      NavigationActions.navigate({ routeName: 'bar', key: 'a' }),
      pushedState
    );
    expect(pushedTwiceState).toEqual(null);
  });

  // https://github.com/react-navigation/react-navigation/issues/4063
  test('Navigate on inactive stackrouter is idempotent', () => {
    const FirstChildNavigator = () => <div />;
    FirstChildNavigator.router = StackRouter({
      First1: () => <div />,
      First2: () => <div />,
    });

    const SecondChildNavigator = () => <div />;
    SecondChildNavigator.router = StackRouter({
      Second1: () => <div />,
      Second2: () => <div />,
    });

    const router = StackRouter({
      Leaf: () => <div />,
      First: FirstChildNavigator,
      Second: SecondChildNavigator,
    });

    const state = router.getStateForAction({ type: NavigationActions.INIT });

    const first = router.getStateForAction(
      NavigationActions.navigate({ routeName: 'First2' }),
      state
    );

    const second = router.getStateForAction(
      NavigationActions.navigate({ routeName: 'Second2' }),
      first
    );

    const firstAgain = router.getStateForAction(
      NavigationActions.navigate({
        routeName: 'First2',
        params: { debug: true },
      }),
      second
    );

    expect(first.routes.length).toEqual(2);
    expect(first.index).toEqual(1);
    expect(second.routes.length).toEqual(3);
    expect(second.index).toEqual(2);

    expect(firstAgain.index).toEqual(1);
    expect(firstAgain.routes.length).toEqual(2);
  });

  test('Navigate to current routeName returns null to indicate handled action', () => {
    const TestRouter = StackRouter({
      foo: { screen: () => <div /> },
      bar: { screen: () => <div /> },
    });
    const initState = TestRouter.getStateForAction(NavigationActions.init());
    const navigatedState = TestRouter.getStateForAction(
      NavigationActions.navigate({ routeName: 'foo' }),
      initState
    );
    expect(navigatedState).toBe(null);
  });

  test('Push behaves like navigate, except for key', () => {
    const TestRouter = StackRouter({
      foo: { screen: () => <div /> },
      bar: { screen: () => <div /> },
    });
    const initState = TestRouter.getStateForAction(NavigationActions.init());
    const pushedState = TestRouter.getStateForAction(
      StackActions.push({ routeName: 'bar' }),
      initState
    );
    expect(pushedState.index).toEqual(1);
    expect(pushedState.routes[1].routeName).toEqual('bar');
    expect(() => {
      TestRouter.getStateForAction(
        { type: StackActions.PUSH, routeName: 'bar', key: 'a' },
        pushedState
      );
    }).toThrow();
  });

  test('Push adds new routes every time', () => {
    const TestRouter = StackRouter({
      foo: { screen: () => <div /> },
      bar: { screen: () => <div /> },
    });
    const initState = TestRouter.getStateForAction(NavigationActions.init());
    const pushedState = TestRouter.getStateForAction(
      StackActions.push({ routeName: 'bar' }),
      initState
    );
    expect(pushedState.index).toEqual(1);
    expect(pushedState.routes[1].routeName).toEqual('bar');
    const secondPushedState = TestRouter.getStateForAction(
      StackActions.push({ routeName: 'bar' }),
      pushedState
    );
    expect(secondPushedState.index).toEqual(2);
    expect(secondPushedState.routes[2].routeName).toEqual('bar');
  });

  test('Navigate backwards with key removes leading routes', () => {
    const TestRouter = StackRouter({
      foo: { screen: () => <div /> },
      bar: { screen: () => <div /> },
    });
    const initState = TestRouter.getStateForAction(NavigationActions.init());
    const pushedState = TestRouter.getStateForAction(
      NavigationActions.navigate({ routeName: 'bar', key: 'a' }),
      initState
    );
    const pushedTwiceState = TestRouter.getStateForAction(
      NavigationActions.navigate({ routeName: 'bar', key: 'b`' }),
      pushedState
    );
    const pushedThriceState = TestRouter.getStateForAction(
      NavigationActions.navigate({ routeName: 'foo', key: 'c`' }),
      pushedTwiceState
    );
    expect(pushedThriceState.routes.length).toEqual(4);

    const navigatedBackToFirstRouteState = TestRouter.getStateForAction(
      NavigationActions.navigate({
        routeName: 'foo',
        key: pushedThriceState.routes[0].key,
      }),
      pushedThriceState
    );
    expect(navigatedBackToFirstRouteState.index).toEqual(0);
    expect(navigatedBackToFirstRouteState.routes.length).toEqual(1);
  });

  test('Handle basic stack logic for plain components', () => {
    const FooScreen = () => <div />;
    const BarScreen = () => <div />;
    const router = StackRouter({
      Foo: {
        screen: FooScreen,
      },
      Bar: {
        screen: BarScreen,
      },
    });
    const state = router.getStateForAction({ type: NavigationActions.INIT });
    expect(state).toEqual({
      index: 0,
      isTransitioning: false,
      key: 'StackRouterRoot',
      routes: [
        {
          key: 'id-0',
          routeName: 'Foo',
        },
      ],
    });
    const state2 = router.getStateForAction(
      {
        type: NavigationActions.NAVIGATE,
        routeName: 'Bar',
        params: { name: 'Zoom' },
        immediate: true,
      },
      state
    );
    expect(state2.index).toEqual(1);
    expect(state2.routes[1].routeName).toEqual('Bar');
    expect(state2.routes[1].params).toEqual({ name: 'Zoom' });
    expect(state2.routes.length).toEqual(2);
    const state3 = router.getStateForAction(
      { type: NavigationActions.BACK, immediate: true },
      state2
    );
    expect(state3).toEqual({
      index: 0,
      isTransitioning: false,
      key: 'StackRouterRoot',
      routes: [
        {
          key: 'id-0',
          routeName: 'Foo',
        },
      ],
    });
  });

  test('Replace action works', () => {
    const TestRouter = StackRouter({
      foo: { screen: () => <div /> },
      bar: { screen: () => <div /> },
    });
    const initState = TestRouter.getStateForAction(
      NavigationActions.navigate({ routeName: 'foo' })
    );
    const replacedState = TestRouter.getStateForAction(
      StackActions.replace({
        routeName: 'bar',
        params: { meaning: 42 },
        key: initState.routes[0].key,
      }),
      initState
    );
    expect(replacedState.index).toEqual(0);
    expect(replacedState.routes.length).toEqual(1);
    expect(replacedState.routes[0].key).not.toEqual(initState.routes[0].key);
    expect(replacedState.routes[0].routeName).toEqual('bar');
    expect(replacedState.routes[0].params.meaning).toEqual(42);
    const replacedState2 = TestRouter.getStateForAction(
      StackActions.replace({
        routeName: 'bar',
        key: initState.routes[0].key,
        newKey: 'wow',
      }),
      initState
    );
    expect(replacedState2.index).toEqual(0);
    expect(replacedState2.routes.length).toEqual(1);
    expect(replacedState2.routes[0].key).toEqual('wow');
    expect(replacedState2.routes[0].routeName).toEqual('bar');
  });

  test('Replace action returns most recent route if no key is provided', () => {
    const GrandChildNavigator = () => <div />;
    GrandChildNavigator.router = StackRouter({
      Quux: { screen: () => <div /> },
      Corge: { screen: () => <div /> },
      Grault: { screen: () => <div /> },
    });

    const ChildNavigator = () => <div />;
    ChildNavigator.router = StackRouter({
      Baz: { screen: () => <div /> },
      Woo: { screen: () => <div /> },
      Qux: { screen: GrandChildNavigator },
    });

    const router = StackRouter({
      Foo: { screen: () => <div /> },
      Bar: { screen: ChildNavigator },
    });

    const state = router.getStateForAction({ type: NavigationActions.INIT });
    const state2 = router.getStateForAction(
      {
        type: NavigationActions.NAVIGATE,
        routeName: 'Bar',
      },
      state
    );
    const state3 = router.getStateForAction(
      {
        type: NavigationActions.NAVIGATE,
        routeName: 'Qux',
      },
      state2
    );
    const state4 = router.getStateForAction(
      {
        type: NavigationActions.NAVIGATE,
        routeName: 'Corge',
      },
      state3
    );
    const state5 = router.getStateForAction(
      {
        type: NavigationActions.NAVIGATE,
        routeName: 'Grault',
      },
      state4
    );

    const replacedState = router.getStateForAction(
      StackActions.replace({
        routeName: 'Woo',
        params: { meaning: 42 },
      }),
      state5
    );

    const originalCurrentScreen = state5.routes[1].routes[1].routes[2];
    const replacedCurrentScreen = replacedState.routes[1].routes[1].routes[2];

    expect(replacedState.routes[1].routes[1].index).toEqual(2);
    expect(replacedState.routes[1].routes[1].routes.length).toEqual(3);
    expect(replacedCurrentScreen.key).not.toEqual(originalCurrentScreen.key);
    expect(replacedCurrentScreen.routeName).not.toEqual(
      originalCurrentScreen.routeName
    );
    expect(replacedCurrentScreen.routeName).toEqual('Woo');
    expect(replacedCurrentScreen.params.meaning).toEqual(42);
  });

  test('Handles push transition logic with completion action', () => {
    const FooScreen = () => <div />;
    const BarScreen = () => <div />;
    const router = StackRouter({
      Foo: {
        screen: FooScreen,
      },
      Bar: {
        screen: BarScreen,
      },
    });
    const state = router.getStateForAction({ type: NavigationActions.INIT });
    const state2 = router.getStateForAction(
      {
        type: NavigationActions.NAVIGATE,
        routeName: 'Bar',
        params: { name: 'Zoom' },
      },
      state
    );
    expect(state2 && state2.index).toEqual(1);
    expect(state2 && state2.isTransitioning).toEqual(true);
    const state3 = router.getStateForAction(
      {
        type: StackActions.COMPLETE_TRANSITION,
        toChildKey: state2.routes[1].key,
      },
      state2
    );
    expect(state3 && state3.index).toEqual(1);
    expect(state3 && state3.isTransitioning).toEqual(false);
  });

  test('Completion action does not work with incorrect key', () => {
    const FooScreen = () => <div />;
    const router = StackRouter({
      Foo: {
        screen: FooScreen,
      },
      Bar: {
        screen: FooScreen,
      },
    });
    const state = {
      key: 'StackKey',
      index: 1,
      isTransitioning: true,
      routes: [{ key: 'a', routeName: 'Foo' }, { key: 'b', routeName: 'Foo' }],
    };
    const outputState = router.getStateForAction(
      {
        type: StackActions.COMPLETE_TRANSITION,
        toChildKey: state.routes[state.index].key,
        key: 'not StackKey',
      },
      state
    );
    expect(outputState.isTransitioning).toEqual(true);
  });

  test('Completion action does not work with incorrect toChildKey', () => {
    const FooScreen = () => <div />;
    const router = StackRouter({
      Foo: {
        screen: FooScreen,
      },
      Bar: {
        screen: FooScreen,
      },
    });
    const state = {
      key: 'StackKey',
      index: 1,
      isTransitioning: true,
      routes: [{ key: 'a', routeName: 'Foo' }, { key: 'b', routeName: 'Foo' }],
    };
    const outputState = router.getStateForAction(
      {
        type: StackActions.COMPLETE_TRANSITION,
        // for this action to toggle isTransitioning, toChildKey should be state.routes[state.index].key,
        toChildKey: 'incorrect',
        key: 'StackKey',
      },
      state
    );
    expect(outputState.isTransitioning).toEqual(true);
  });

  test('Back action parent is prioritized over inactive child routers', () => {
    const Bar = () => <div />;
    Bar.router = StackRouter({
      baz: { screen: () => <div /> },
      qux: { screen: () => <div /> },
    });
    const TestRouter = StackRouter({
      foo: { screen: () => <div /> },
      bar: { screen: Bar },
      boo: { screen: () => <div /> },
    });
    const state = {
      key: 'top',
      index: 3,
      routes: [
        { routeName: 'foo', key: 'f' },
        {
          routeName: 'bar',
          key: 'b',
          index: 1,
          routes: [
            { routeName: 'baz', key: 'bz' },
            { routeName: 'qux', key: 'bx' },
          ],
        },
        { routeName: 'foo', key: 'f1' },
        { routeName: 'boo', key: 'z' },
      ],
    };
    const testState = TestRouter.getStateForAction(
      { type: NavigationActions.BACK },
      state
    );
    expect(testState.index).toBe(2);
    expect(testState.routes[1].index).toBe(1);
  });

  test('Handle basic stack logic for components with router', () => {
    const FooScreen = () => <div />;
    const BarScreen = () => <div />;
    BarScreen.router = StackRouter({
      Xyz: {
        screen: () => null,
      },
    });
    const router = StackRouter({
      Foo: {
        screen: FooScreen,
      },
      Bar: {
        screen: BarScreen,
      },
    });
    const state = router.getStateForAction({ type: NavigationActions.INIT });
    expect(state).toEqual({
      index: 0,
      isTransitioning: false,
      key: 'StackRouterRoot',
      routes: [
        {
          key: 'id-0',
          routeName: 'Foo',
        },
      ],
    });
    const state2 = router.getStateForAction(
      {
        type: NavigationActions.NAVIGATE,
        routeName: 'Bar',
        params: { name: 'Zoom' },
        immediate: true,
      },
      state
    );
    expect(state2 && state2.index).toEqual(1);
    expect(state2 && state2.routes[1].routeName).toEqual('Bar');
    expect(state2 && state2.routes[1].params).toEqual({ name: 'Zoom' });
    expect(state2 && state2.routes.length).toEqual(2);
    const state3 = router.getStateForAction(
      { type: NavigationActions.BACK, immediate: true },
      state2
    );
    expect(state3).toEqual({
      index: 0,
      isTransitioning: false,
      key: 'StackRouterRoot',
      routes: [
        {
          key: 'id-0',
          routeName: 'Foo',
        },
      ],
    });
  });

  test('Gets deep path (stack behavior)', () => {
    const ScreenA = () => <div />;
    const ScreenB = () => <div />;
    ScreenA.router = StackRouter({
      Boo: { path: 'boo', screen: ScreenB },
      Baz: { path: 'baz/:bazId', screen: ScreenB },
    });
    const router = StackRouter({
      Foo: {
        path: 'f/:id',
        screen: ScreenA,
      },
      Bar: {
        screen: ScreenB,
      },
    });

    const state = {
      index: 0,
      isTransitioning: false,
      routes: [
        {
          index: 1,
          key: 'Foo',
          routeName: 'Foo',
          params: {
            id: '123',
          },
          routes: [
            { key: 'Boo', routeName: 'Boo' },
            { key: 'Baz', routeName: 'Baz', params: { bazId: '321' } },
          ],
        },
        { key: 'Bar', routeName: 'Bar' },
      ],
    };
    const { path, params } = router.getPathAndParamsForState(state);
    expect(path).toEqual('f/123/baz/321');
    expect(params).toEqual({});
  });

  test('Handle goBack identified by key', () => {
    const FooScreen = () => <div />;
    const BarScreen = () => <div />;
    const router = StackRouter({
      Foo: {
        screen: FooScreen,
      },
      Bar: {
        screen: BarScreen,
      },
    });
    const state = router.getStateForAction({ type: NavigationActions.INIT });
    const state2 = router.getStateForAction(
      {
        type: NavigationActions.NAVIGATE,
        routeName: 'Bar',
        immediate: true,
        params: { name: 'Zoom' },
      },
      state
    );
    const state3 = router.getStateForAction(
      {
        type: NavigationActions.NAVIGATE,
        routeName: 'Bar',
        immediate: true,
        params: { name: 'Foo' },
      },
      state2
    );
    const state4 = router.getStateForAction(
      { type: NavigationActions.BACK, key: 'wrongKey' },
      state3
    );
    expect(state3).toEqual(state4);
    const state5 = router.getStateForAction(
      {
        type: NavigationActions.BACK,
        key: state3 && state3.routes[1].key,
        immediate: true,
      },
      state4
    );
    expect(state5).toEqual(state);
  });

  test('Handle initial route navigation', () => {
    const FooScreen = () => <div />;
    const BarScreen = () => <div />;
    const router = StackRouter(
      {
        Foo: {
          screen: FooScreen,
        },
        Bar: {
          screen: BarScreen,
        },
      },
      { initialRouteName: 'Bar' }
    );
    const state = router.getStateForAction({ type: NavigationActions.INIT });
    expect(state).toEqual({
      index: 0,
      isTransitioning: false,
      key: 'StackRouterRoot',
      routes: [
        {
          key: 'id-0',
          routeName: 'Bar',
        },
      ],
    });
  });

  test('Initial route params appear in nav state', () => {
    const FooScreen = () => <div />;
    const router = StackRouter(
      {
        Foo: {
          screen: FooScreen,
        },
      },
      { initialRouteName: 'Foo', initialRouteParams: { foo: 'bar' } }
    );
    const state = router.getStateForAction({ type: NavigationActions.INIT });
    expect(state).toEqual({
      index: 0,
      isTransitioning: false,
      key: 'StackRouterRoot',
      routes: [
        {
          key: state && state.routes[0].key,
          routeName: 'Foo',
          params: { foo: 'bar' },
        },
      ],
    });
  });

  test('params in route config are merged with initialRouteParams', () => {
    const FooScreen = () => <div />;
    const router = StackRouter(
      {
        Foo: {
          screen: FooScreen,
          params: { foo: 'not-bar', meaning: 42 },
        },
      },
      { initialRouteName: 'Foo', initialRouteParams: { foo: 'bar' } }
    );
    const state = router.getStateForAction({ type: NavigationActions.INIT });
    expect(state).toEqual({
      index: 0,
      isTransitioning: false,
      key: 'StackRouterRoot',
      routes: [
        {
          key: state && state.routes[0].key,
          routeName: 'Foo',
          params: { foo: 'bar', meaning: 42 },
        },
      ],
    });
  });

  test('Action params appear in nav state', () => {
    const FooScreen = () => <div />;
    const BarScreen = () => <div />;
    const router = StackRouter({
      Foo: {
        screen: FooScreen,
      },
      Bar: {
        screen: BarScreen,
      },
    });
    const state = router.getStateForAction({ type: NavigationActions.INIT });
    const state2 = router.getStateForAction(
      {
        type: NavigationActions.NAVIGATE,
        routeName: 'Bar',
        params: { bar: '42' },
        immediate: true,
      },
      state
    );
    expect(state2).not.toBeNull();
    expect(state2 && state2.index).toEqual(1);
    expect(state2 && state2.routes[1].params).toEqual({ bar: '42' });
  });

  test('Handles the SetParams action', () => {
    const router = StackRouter(
      {
        Foo: {
          screen: () => <div />,
        },
        Bar: {
          screen: () => <div />,
        },
      },
      {
        initialRouteName: 'Bar',
        initialRouteParams: { name: 'Zoo' },
      }
    );
    const state = router.getStateForAction({ type: NavigationActions.INIT });
    const key = state && state.routes[0].key;
    const state2 =
      key &&
      router.getStateForAction(
        {
          type: NavigationActions.SET_PARAMS,
          params: { name: 'Qux' },
          key,
        },
        state
      );
    expect(state2 && state2.index).toEqual(0);
    expect(state2 && state2.routes[0].params).toEqual({ name: 'Qux' });
  });

  test('Handles the SetParams action for inactive routes', () => {
    const router = StackRouter(
      {
        Foo: {
          screen: () => <div />,
        },
        Bar: {
          screen: () => <div />,
        },
      },
      {
        initialRouteName: 'Bar',
        initialRouteParams: { name: 'Zoo' },
      }
    );
    const initialState = {
      index: 1,
      routes: [
        {
          key: 'RouteA',
          routeName: 'Foo',
          params: { name: 'InitialParam', other: 'Unchanged' },
        },
        { key: 'RouteB', routeName: 'Bar', params: {} },
      ],
    };
    const state = router.getStateForAction(
      {
        type: NavigationActions.SET_PARAMS,
        params: { name: 'NewParam' },
        key: 'RouteA',
      },
      initialState
    );
    expect(state.index).toEqual(1);
    expect(state.routes[0].params).toEqual({
      name: 'NewParam',
      other: 'Unchanged',
    });
  });

  test('Handles the setParams action with nested routers', () => {
    const ChildNavigator = () => <div />;
    ChildNavigator.router = StackRouter({
      Baz: { screen: () => <div /> },
      Qux: { screen: () => <div /> },
    });
    const router = StackRouter({
      Foo: { screen: ChildNavigator },
      Bar: { screen: () => <div /> },
    });
    const state = router.getStateForAction({ type: NavigationActions.INIT });
    const state2 = router.getStateForAction(
      {
        type: NavigationActions.SET_PARAMS,
        params: { name: 'foobar' },
        key: 'id-0',
      },
      state
    );
    expect(state2 && state2.index).toEqual(0);
    expect(state2 && state2.routes[0].routes).toEqual([
      {
        key: 'id-0',
        routeName: 'Baz',
        params: { name: 'foobar' },
      },
    ]);
  });

  test('Handles the reset action', () => {
    const router = StackRouter({
      Foo: {
        screen: () => <div />,
      },
      Bar: {
        screen: () => <div />,
      },
    });
    const state = router.getStateForAction({ type: NavigationActions.INIT });
    const state2 = router.getStateForAction(
      {
        type: StackActions.RESET,
        actions: [
          {
            type: NavigationActions.NAVIGATE,
            routeName: 'Foo',
            params: { bar: '42' },
            immediate: true,
          },
          {
            type: NavigationActions.NAVIGATE,
            routeName: 'Bar',
            immediate: true,
          },
        ],
        index: 1,
      },
      state
    );
    expect(state2 && state2.index).toEqual(1);
    expect(state2 && state2.routes[0].params).toEqual({ bar: '42' });
    expect(state2 && state2.routes[0].routeName).toEqual('Foo');
    expect(state2 && state2.routes[1].routeName).toEqual('Bar');
  });

  test('Handles the reset action only with correct key set', () => {
    const router = StackRouter({
      Foo: {
        screen: () => <div />,
      },
      Bar: {
        screen: () => <div />,
      },
    });
    const state1 = router.getStateForAction({ type: NavigationActions.INIT });
    const resetAction = {
      type: StackActions.RESET,
      key: 'Bad Key',
      actions: [
        {
          type: NavigationActions.NAVIGATE,
          routeName: 'Foo',
          params: { bar: '42' },
          immediate: true,
        },
        {
          type: NavigationActions.NAVIGATE,
          routeName: 'Bar',
          immediate: true,
        },
      ],
      index: 1,
    };
    const state2 = router.getStateForAction(resetAction, state1);
    expect(state2).toEqual(state1);
    const state3 = router.getStateForAction(
      {
        ...resetAction,
        key: state2.key,
      },
      state2
    );
    expect(state3 && state3.index).toEqual(1);
    expect(state3 && state3.routes[0].params).toEqual({ bar: '42' });
    expect(state3 && state3.routes[0].routeName).toEqual('Foo');
    expect(state3 && state3.routes[1].routeName).toEqual('Bar');
  });

  test('Handles the reset action with nested Router', () => {
    const ChildRouter = StackRouter({
      baz: {
        screen: () => <div />,
      },
    });

    const ChildNavigator = () => <div />;
    ChildNavigator.router = ChildRouter;

    const router = StackRouter({
      Foo: {
        screen: ChildNavigator,
      },
      Bar: {
        screen: () => <div />,
      },
    });
    const state = router.getStateForAction({ type: NavigationActions.INIT });
    const state2 = router.getStateForAction(
      {
        type: StackActions.RESET,
        key: null,
        actions: [
          {
            type: NavigationActions.NAVIGATE,
            routeName: 'Foo',
            immediate: true,
          },
        ],
        index: 0,
      },
      state
    );

    expect(state2 && state2.index).toEqual(0);
    expect(state2 && state2.routes[0].routeName).toEqual('Foo');
    expect(state2 && state2.routes[0].routes[0].routeName).toEqual('baz');
  });

  test('Handles the reset action with a key', () => {
    const ChildRouter = StackRouter({
      baz: {
        screen: () => <div />,
      },
    });

    const ChildNavigator = () => <div />;
    ChildNavigator.router = ChildRouter;

    const router = StackRouter({
      Foo: {
        screen: ChildNavigator,
      },
      Bar: {
        screen: () => <div />,
      },
    });
    const state = router.getStateForAction({ type: NavigationActions.INIT });
    const state2 = router.getStateForAction(
      {
        type: NavigationActions.NAVIGATE,
        routeName: 'Foo',
        immediate: true,
        action: {
          type: NavigationActions.NAVIGATE,
          routeName: 'baz',
          immediate: true,
        },
      },
      state
    );
    const state3 = router.getStateForAction(
      {
        type: StackActions.RESET,
        key: 'Init',
        actions: [
          {
            type: NavigationActions.NAVIGATE,
            routeName: 'Foo',
            immediate: true,
          },
        ],
        index: 0,
      },
      state2
    );
    const state4 = router.getStateForAction(
      {
        type: StackActions.RESET,
        key: null,
        actions: [
          {
            type: NavigationActions.NAVIGATE,
            routeName: 'Bar',
            immediate: true,
          },
        ],
        index: 0,
      },
      state3
    );

    expect(state4 && state4.index).toEqual(0);
    expect(state4 && state4.routes[0].routeName).toEqual('Bar');
  });

  test('Handles the navigate action with params and nested StackRouter', () => {
    const ChildNavigator = () => <div />;
    ChildNavigator.router = StackRouter({ Baz: { screen: () => <div /> } });

    const router = StackRouter({
      Foo: { screen: () => <div /> },
      Bar: { screen: ChildNavigator },
    });
    const state = router.getStateForAction({ type: NavigationActions.INIT });
    const state2 = router.getStateForAction(
      {
        type: NavigationActions.NAVIGATE,
        immediate: true,
        routeName: 'Bar',
        params: { foo: '42' },
      },
      state
    );
    expect(state2 && state2.routes[1].params).toEqual({ foo: '42' });
    expect(state2 && state2.routes[1].routes).toEqual([
      expect.objectContaining({
        routeName: 'Baz',
        params: { foo: '42' },
      }),
    ]);
  });

  test('Navigate action to previous nested StackRouter causes isTransitioning start', () => {
    const ChildNavigator = () => <div />;
    ChildNavigator.router = StackRouter({
      Baz: { screen: () => <div /> },
    });
    const router = StackRouter({
      Bar: { screen: ChildNavigator },
      Foo: { screen: () => <div /> },
    });
    const state = router.getStateForAction(
      {
        type: NavigationActions.NAVIGATE,
        immediate: true,
        routeName: 'Foo',
      },
      router.getStateForAction({ type: NavigationActions.INIT })
    );
    const state2 = router.getStateForAction(
      {
        type: NavigationActions.NAVIGATE,
        routeName: 'Baz',
      },
      state
    );
    expect(state2.index).toEqual(0);
    expect(state2.isTransitioning).toEqual(true);
  });

  test('Handles the navigate action with params and nested StackRouter as a first action', () => {
    const state = TestStackRouter.getStateForAction({
      type: NavigationActions.NAVIGATE,
      routeName: 'main',
      params: {
        code: 'test',
        foo: 'bar',
      },
      action: {
        type: NavigationActions.NAVIGATE,
        routeName: 'profile',
        params: {
          id: '4',
          code: 'test',
          foo: 'bar',
        },
        action: {
          type: NavigationActions.NAVIGATE,
          routeName: 'list',
          params: {
            id: '10259959195',
            code: 'test',
            foo: 'bar',
          },
        },
      },
    });

    expect(state).toEqual({
      index: 0,
      isTransitioning: false,
      key: 'StackRouterRoot',
      routes: [
        {
          index: 0,
          isTransitioning: false,
          key: 'id-2',
          params: { code: 'test', foo: 'bar' },
          routeName: 'main',
          routes: [
            {
              index: 0,
              isTransitioning: false,
              key: 'id-1',
              params: { code: 'test', foo: 'bar', id: '4' },
              routeName: 'profile',
              routes: [
                {
                  key: 'id-0',
                  params: { code: 'test', foo: 'bar', id: '10259959195' },
                  routeName: 'list',
                  type: undefined,
                },
              ],
            },
          ],
        },
      ],
    });

    const state2 = TestStackRouter.getStateForAction({
      type: NavigationActions.NAVIGATE,
      routeName: 'main',
      params: {
        code: '',
        foo: 'bar',
      },
      action: {
        type: NavigationActions.NAVIGATE,
        routeName: 'profile',
        params: {
          id: '4',
          code: '',
          foo: 'bar',
        },
        action: {
          type: NavigationActions.NAVIGATE,
          routeName: 'list',
          params: {
            id: '10259959195',
            code: '',
            foo: 'bar',
          },
        },
      },
    });

    expect(state2).toEqual({
      index: 0,
      isTransitioning: false,
      key: 'StackRouterRoot',
      routes: [
        {
          index: 0,
          isTransitioning: false,
          key: 'id-5',
          params: { code: '', foo: 'bar' },
          routeName: 'main',
          routes: [
            {
              index: 0,
              isTransitioning: false,
              key: 'id-4',
              params: { code: '', foo: 'bar', id: '4' },
              routeName: 'profile',
              routes: [
                {
                  key: 'id-3',
                  params: { code: '', foo: 'bar', id: '10259959195' },
                  routeName: 'list',
                  type: undefined,
                },
              ],
            },
          ],
        },
      ],
    });
  });

  test('Handles deep navigate completion action', () => {
    const LeafScreen = () => <div />;
    const FooScreen = () => <div />;
    FooScreen.router = StackRouter({
      Boo: { path: 'boo', screen: LeafScreen },
      Baz: { path: 'baz/:bazId', screen: LeafScreen },
    });
    const router = StackRouter({
      Foo: {
        screen: FooScreen,
      },
      Bar: {
        screen: LeafScreen,
      },
    });

    const state = router.getStateForAction({ type: NavigationActions.INIT });
    expect(state && state.index).toEqual(0);
    expect(state && state.routes[0].routeName).toEqual('Foo');
    const key = state && state.routes[0].key;
    const state2 = router.getStateForAction(
      {
        type: NavigationActions.NAVIGATE,
        routeName: 'Baz',
      },
      state
    );
    expect(state2.index).toEqual(0);
    expect(state2.isTransitioning).toEqual(false);
    expect(state2.routes[0].index).toEqual(1);
    expect(state2.routes[0].isTransitioning).toEqual(true);
    expect(!!key).toEqual(true);
    const state3 = router.getStateForAction(
      {
        type: StackActions.COMPLETE_TRANSITION,
        toChildKey: state2.routes[0].routes[1].key,
      },
      state2
    );
    expect(state3 && state3.index).toEqual(0);
    expect(state3 && state3.isTransitioning).toEqual(false);
    expect(state3 && state3.routes[0].index).toEqual(1);
    expect(state3 && state3.routes[0].isTransitioning).toEqual(false);
  });

  test('order of handling navigate action is correct for nested stackrouters', () => {
    const Screen = () => <div />;
    const NestedStack = () => <div />;
    let nestedRouter = StackRouter({
      Foo: Screen,
      Bar: Screen,
    });

    NestedStack.router = nestedRouter;

    let router = StackRouter(
      {
        NestedStack,
        Bar: Screen,
        Baz: Screen,
      },
      {
        initialRouteName: 'Baz',
      }
    );

    const state = router.getStateForAction({ type: NavigationActions.INIT });
    expect(state.routes[state.index].routeName).toEqual('Baz');

    const state2 = router.getStateForAction(
      {
        type: NavigationActions.NAVIGATE,
        routeName: 'Bar',
      },
      state
    );
    expect(state2.routes[state2.index].routeName).toEqual('Bar');

    const state3 = router.getStateForAction(
      {
        type: NavigationActions.NAVIGATE,
        routeName: 'Baz',
      },
      state2
    );
    expect(state3.routes[state3.index].routeName).toEqual('Baz');

    const state4 = router.getStateForAction(
      {
        type: NavigationActions.NAVIGATE,
        routeName: 'Foo',
      },
      state3
    );
    let activeState4 = state4.routes[state4.index];
    expect(activeState4.routeName).toEqual('NestedStack');
    expect(activeState4.routes[activeState4.index].routeName).toEqual('Foo');

    const state5 = router.getStateForAction(
      {
        type: NavigationActions.NAVIGATE,
        routeName: 'Bar',
      },
      state4
    );
    let activeState5 = state5.routes[state5.index];
    expect(activeState5.routeName).toEqual('NestedStack');
    expect(activeState5.routes[activeState5.index].routeName).toEqual('Bar');
  });

  test('order of handling navigate action is correct for nested stackrouters 2', () => {
    const Screen = () => <div />;
    const NestedStack = () => <div />;
    const OtherNestedStack = () => <div />;

    let nestedRouter = StackRouter({ Foo: Screen, Bar: Screen });
    let otherNestedRouter = StackRouter({ Foo: Screen });
    NestedStack.router = nestedRouter;
    OtherNestedStack.router = otherNestedRouter;

    let router = StackRouter(
      {
        NestedStack,
        OtherNestedStack,
        Bar: Screen,
      },
      {
        initialRouteName: 'OtherNestedStack',
      }
    );

    const state = router.getStateForAction({ type: NavigationActions.INIT });
    expect(state.routes[state.index].routeName).toEqual('OtherNestedStack');

    const state2 = router.getStateForAction(
      {
        type: NavigationActions.NAVIGATE,
        routeName: 'Bar',
      },
      state
    );
    expect(state2.routes[state2.index].routeName).toEqual('Bar');

    const state3 = router.getStateForAction(
      {
        type: NavigationActions.NAVIGATE,
        routeName: 'NestedStack',
      },
      state2
    );
    const state4 = router.getStateForAction(
      {
        type: NavigationActions.NAVIGATE,
        routeName: 'Bar',
      },
      state3
    );
    let activeState4 = state4.routes[state4.index];
    expect(activeState4.routeName).toEqual('NestedStack');
    expect(activeState4.routes[activeState4.index].routeName).toEqual('Bar');
  });
});
