/* eslint no-shadow:0, react/no-multi-comp:0, react/display-name:0 */

import React from 'react';

import StackRouter from '../StackRouter';
import TabRouter from '../TabRouter';
import { _TESTING_ONLY_normalize_keys } from '../KeyGenerator';

import NavigationActions from '../../NavigationActions';

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
      TestStackRouter.getActionForPathAndParams('people/foo?code=test&foo=bar')
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
      TestStackRouter.getActionForPathAndParams('people/foo?code=&foo=bar')
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
      action: {
        type: NavigationActions.NAVIGATE,
        routeName: 'login',
      },
    });
  });

  test('Correctly parses a path with arguments into an action chain', () => {
    const uri = 'main/p/4/list/10259959195';
    const action = TestStackRouter.getActionForPathAndParams(uri);
    expect(action).toEqual({
      type: NavigationActions.NAVIGATE,
      routeName: 'main',
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
    const uri = 'auth/login/2';
    const action = TestStackRouter.getActionForPathAndParams(uri);
    expect(action).toEqual({
      type: NavigationActions.NAVIGATE,
      routeName: 'auth',
      action: {
        type: NavigationActions.NAVIGATE,
        routeName: 'login',
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

  test('pop does not bubble up', () => {
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
    const barKey = state2.routes[1].routes[0].key;
    const state3 = router.getStateForAction(
      {
        type: NavigationActions.POP,
      },
      state2
    );
    expect(state3 && state3.index).toEqual(1);
    expect(state3 && state3.routes[1].index).toEqual(0);
  });

  test('push does not bubble up', () => {
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
    const barKey = state2.routes[1].routes[0].key;
    const state3 = router.getStateForAction(
      {
        type: NavigationActions.PUSH,
        routeName: 'Bad',
      },
      state2
    );
    expect(state3 && state3.index).toEqual(1);
    expect(state3 && state3.routes.length).toEqual(2);
  });

  test('popToTop does not bubble up', () => {
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
    const barKey = state2.routes[1].routes[0].key;
    const state3 = router.getStateForAction(
      {
        type: NavigationActions.POP_TO_TOP,
      },
      state2
    );
    expect(state3 && state3.index).toEqual(1);
    expect(state3 && state3.routes[1].index).toEqual(0);
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
      NavigationActions.popToTop(),
      state
    );
    expect(poppedState.routes.length).toBe(1);
    expect(poppedState.index).toBe(0);
    expect(poppedState.isTransitioning).toBe(true);
    const poppedState2 = TestRouter.getStateForAction(
      NavigationActions.popToTop(),
      poppedState
    );
    expect(poppedState).toEqual(poppedState2);
    const poppedImmediatelyState = TestRouter.getStateForAction(
      NavigationActions.popToTop({ immediate: true }),
      state
    );
    expect(poppedImmediatelyState.routes.length).toBe(1);
    expect(poppedImmediatelyState.index).toBe(0);
    expect(poppedImmediatelyState.isTransitioning).toBe(false);
  });

  test('Navigate Pushes duplicate routeName', () => {
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
      NavigationActions.navigate({ routeName: 'bar' }),
      pushedState
    );
    expect(pushedTwiceState.index).toEqual(2);
    expect(pushedTwiceState.routes[2].routeName).toEqual('bar');
  });

  test('Navigate with key is idempotent', () => {
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
    expect(pushedTwiceState.index).toEqual(1);
    expect(pushedTwiceState.routes[1].routeName).toEqual('bar');
  });

  test('Push behaves like navigate, except for key', () => {
    const TestRouter = StackRouter({
      foo: { screen: () => <div /> },
      bar: { screen: () => <div /> },
    });
    const initState = TestRouter.getStateForAction(NavigationActions.init());
    const pushedState = TestRouter.getStateForAction(
      NavigationActions.push({ routeName: 'bar' }),
      initState
    );
    expect(pushedState.index).toEqual(1);
    expect(pushedState.routes[1].routeName).toEqual('bar');
    expect(() => {
      TestRouter.getStateForAction(
        { type: NavigationActions.PUSH, routeName: 'bar', key: 'a' },
        pushedState
      );
    }).toThrow();
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

  test('Replace action works', () => {
    const TestRouter = StackRouter({
      foo: { screen: () => <div /> },
      bar: { screen: () => <div /> },
    });
    const initState = TestRouter.getStateForAction(
      NavigationActions.navigate({ routeName: 'foo' })
    );
    const replacedState = TestRouter.getStateForAction(
      NavigationActions.replace({
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
      NavigationActions.replace({
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
        type: NavigationActions.COMPLETE_TRANSITION,
      },
      state2
    );
    expect(state3 && state3.index).toEqual(1);
    expect(state3 && state3.isTransitioning).toEqual(false);
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
      { initialRouteName: 'Bar', initialRouteParams: { foo: 'bar' } }
    );
    const state = router.getStateForAction({ type: NavigationActions.INIT });
    expect(state).toEqual({
      index: 0,
      isTransitioning: false,
      key: 'StackRouterRoot',
      routes: [
        {
          key: state && state.routes[0].key,
          routeName: 'Bar',
          params: { foo: 'bar' },
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

  test('Handles the setParams action with nested routers', () => {
    const ChildNavigator = () => <div />;
    const GrandChildNavigator = () => <div />;
    GrandChildNavigator.router = StackRouter({
      Quux: { screen: () => <div /> },
      Corge: { screen: () => <div /> },
    });
    ChildNavigator.router = TabRouter({
      Baz: { screen: GrandChildNavigator },
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
    expect(state2 && state2.routes[0].routes[0].routes).toEqual([
      {
        key: 'id-0',
        routeName: 'Quux',
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
        type: NavigationActions.RESET,
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
      type: NavigationActions.RESET,
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
    const ChildRouter = TabRouter({
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
        type: NavigationActions.RESET,
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
        type: NavigationActions.RESET,
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
        type: NavigationActions.RESET,
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

  test('Handles the navigate action with params and nested TabRouter', () => {
    const ChildNavigator = () => <div />;
    ChildNavigator.router = TabRouter({
      Baz: { screen: () => <div /> },
      Boo: { screen: () => <div /> },
    });

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
      {
        key: 'Baz',
        routeName: 'Baz',
        params: { foo: '42' },
      },
      {
        key: 'Boo',
        routeName: 'Boo',
        params: { foo: '42' },
      },
    ]);
  });

  test('Handles empty URIs', () => {
    const router = StackRouter(
      {
        Foo: {
          screen: () => <div />,
        },
        Bar: {
          screen: () => <div />,
        },
      },
      { initialRouteName: 'Bar' }
    );
    const action = router.getActionForPathAndParams('');
    expect(action).toEqual({
      type: NavigationActions.NAVIGATE,
      routeName: 'Bar',
    });
    let state = null;
    if (action) {
      state = router.getStateForAction(action);
    }
    expect(state && state.index).toEqual(0);
    expect(state && state.routes[0]).toEqual(
      expect.objectContaining({
        routeName: 'Bar',
      })
    );
  });

  test('Gets deep path', () => {
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
    expect(params.id).toEqual('123');
    expect(params.bazId).toEqual('321');
  });

  test('Gets deep path with pure wildcard match', () => {
    const ScreenA = () => <div />;
    const ScreenB = () => <div />;
    const ScreenC = () => <div />;
    ScreenA.router = StackRouter({
      Boo: { path: 'boo', screen: ScreenC },
      Baz: { path: 'baz/:bazId', screen: ScreenB },
    });
    ScreenC.router = StackRouter({
      Boo2: { path: '', screen: ScreenB },
    });
    const router = StackRouter({
      Foo: {
        path: null,
        screen: ScreenA,
      },
      Bar: {
        screen: ScreenB,
      },
    });

    {
      const state = {
        index: 0,
        routes: [
          {
            index: 1,
            key: 'Foo',
            routeName: 'Foo',
            params: {
              id: '123',
            },
            routes: [
              {
                index: 0,
                key: 'Boo',
                routeName: 'Boo',
                routes: [{ key: 'Boo2', routeName: 'Boo2' }],
              },
              { key: 'Baz', routeName: 'Baz', params: { bazId: '321' } },
            ],
          },
          { key: 'Bar', routeName: 'Bar' },
        ],
      };
      const { path, params } = router.getPathAndParamsForState(state);
      expect(path).toEqual('baz/321');
      expect(params.id).toEqual('123');
      expect(params.bazId).toEqual('321');
    }

    {
      const state = {
        index: 0,
        routes: [
          {
            index: 0,
            key: 'Foo',
            routeName: 'Foo',
            params: {
              id: '123',
            },
            routes: [
              {
                index: 0,
                key: 'Boo',
                routeName: 'Boo',
                routes: [{ key: 'Boo2', routeName: 'Boo2' }],
              },
              { key: 'Baz', routeName: 'Baz', params: { bazId: '321' } },
            ],
          },
          { key: 'Bar', routeName: 'Bar' },
        ],
      };
      const { path, params } = router.getPathAndParamsForState(state);
      expect(path).toEqual('boo/');
      expect(params).toEqual({ id: '123' });
    }
  });

  test('Maps old actions (uses "Handles the reset action" test)', () => {
    global.console.warn = jest.fn();
    const router = StackRouter({
      Foo: {
        screen: () => <div />,
      },
      Bar: {
        screen: () => <div />,
      },
    });
    const initAction = NavigationActions.mapDeprecatedActionAndWarn({
      type: 'Init',
    });
    const state = router.getStateForAction(initAction);
    const resetAction = NavigationActions.mapDeprecatedActionAndWarn({
      type: 'Reset',
      actions: [
        { type: 'Navigate', routeName: 'Foo', params: { bar: '42' } },
        { type: 'Navigate', routeName: 'Bar' },
      ],
      index: 1,
    });
    const state2 = router.getStateForAction(resetAction, state);
    expect(state2 && state2.index).toEqual(1);
    expect(state2 && state2.routes[0].params).toEqual({ bar: '42' });
    expect(state2 && state2.routes[0].routeName).toEqual('Foo');
    expect(state2 && state2.routes[1].routeName).toEqual('Bar');
    expect(console.warn).toBeCalledWith(
      expect.stringContaining(
        "The action type 'Init' has been renamed to 'Navigation/INIT'"
      )
    );
  });

  test('Querystring params get passed to nested deep link', () => {
    // uri with two non-empty query param values
    const uri = 'main/p/4/list/10259959195?code=test&foo=bar';
    const action = TestStackRouter.getActionForPathAndParams(uri);
    expect(action).toEqual({
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

    // uri with one empty and one non-empty query param value
    const uri2 = 'main/p/4/list/10259959195?code=&foo=bar';
    const action2 = TestStackRouter.getActionForPathAndParams(uri2);
    expect(action2).toEqual({
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
  expect(state2 && state2.index).toEqual(0);
  expect(state2 && state2.isTransitioning).toEqual(false);
  expect(state2 && state2.routes[0].index).toEqual(1);
  expect(state2 && state2.routes[0].isTransitioning).toEqual(true);
  expect(!!key).toEqual(true);
  const state3 = router.getStateForAction(
    {
      type: NavigationActions.COMPLETE_TRANSITION,
    },
    state2
  );
  expect(state3 && state3.index).toEqual(0);
  expect(state3 && state3.isTransitioning).toEqual(false);
  expect(state3 && state3.routes[0].index).toEqual(1);
  expect(state3 && state3.routes[0].isTransitioning).toEqual(false);
});
