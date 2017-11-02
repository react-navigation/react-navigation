/* @flow */
/* eslint no-shadow:0, react/no-multi-comp:0, react/display-name:0 */

import * as React from 'react';

import StackRouter from '../StackRouter';
import TabRouter from '../TabRouter';

import NavigationActions from '../../NavigationActions';

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

class FooNavigator extends React.Component<void> {
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
        routes: [
          { key: 'a', routeName: 'foo' },
          { key: 'b', routeName: 'bar' },
        ],
      })
    ).toBe(BarScreen);
  });

  test('Gets the screen for given route', () => {
    const FooScreen = () => <div />;
    const BarScreen = class extends React.Component<void> {
      render() {
        return <div />;
      }
    };
    const BazScreen = class extends React.Component<void> {
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
    const BarScreen = class extends React.Component<void> {
      render() {
        return <div />;
      }
    };
    const BazScreen = class extends React.Component<void> {
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
      routes: [{ key: 'Init-id-0-0', routeName: 'foo' }],
    });
    const pushedState = TestRouter.getStateForAction(
      NavigationActions.navigate({ routeName: 'qux' }),
      initState
    );
    // $FlowFixMe
    expect(pushedState.index).toEqual(1);
    // $FlowFixMe
    expect(pushedState.routes[1].index).toEqual(1);
    // $FlowFixMe
    expect(pushedState.routes[1].routes[1].routeName).toEqual('qux');
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
      routes: [
        {
          key: 'Init-id-0-4',
          routeName: 'Foo',
        },
      ],
    });
    const state2 = router.getStateForAction(
      {
        type: NavigationActions.NAVIGATE,
        routeName: 'Bar',
        params: { name: 'Zoom' },
      },
      state
    );
    expect(state2 && state2.index).toEqual(1);
    expect(state2 && state2.routes[1].routeName).toEqual('Bar');
    expect(state2 && state2.routes[1].params).toEqual({ name: 'Zoom' });
    expect(state2 && state2.routes.length).toEqual(2);
    const state3 = router.getStateForAction(
      { type: NavigationActions.BACK },
      state2
    );
    expect(state3).toEqual({
      index: 0,
      routes: [
        {
          key: 'Init-id-0-4',
          routeName: 'Foo',
        },
      ],
    });
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
      routes: [
        {
          key: 'Init-id-0-6',
          routeName: 'Foo',
        },
      ],
    });
    const state2 = router.getStateForAction(
      {
        type: NavigationActions.NAVIGATE,
        routeName: 'Bar',
        params: { name: 'Zoom' },
      },
      state
    );
    expect(state2 && state2.index).toEqual(1);
    expect(state2 && state2.routes[1].routeName).toEqual('Bar');
    expect(state2 && state2.routes[1].params).toEqual({ name: 'Zoom' });
    expect(state2 && state2.routes.length).toEqual(2);
    const state3 = router.getStateForAction(
      { type: NavigationActions.BACK },
      state2
    );
    expect(state3).toEqual({
      index: 0,
      routes: [
        {
          key: 'Init-id-0-6',
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
        params: { name: 'Zoom' },
      },
      state
    );
    const state3 = router.getStateForAction(
      {
        type: NavigationActions.NAVIGATE,
        routeName: 'Bar',
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
      { type: NavigationActions.BACK, key: state3 && state3.routes[1].key },
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
      routes: [
        {
          key: 'Init-id-0-12',
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
      routes: [
        {
          key: 'Init-id-0-13',
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
    const state2 = router.getStateForAction(
      {
        type: NavigationActions.SET_PARAMS,
        params: { name: 'Qux' },
        key: 'Init-id-0-16',
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
        key: 'Init-id-0-17',
      },
      state
    );
    expect(state2 && state2.index).toEqual(0);
    /* $FlowFixMe */
    expect(state2 && state2.routes[0].routes[0].routes).toEqual([
      {
        key: 'Init-id-0-17',
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
          },
          { type: NavigationActions.NAVIGATE, routeName: 'Bar' },
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
        actions: [{ type: NavigationActions.NAVIGATE, routeName: 'Foo' }],
        index: 0,
      },
      state
    );

    expect(state2 && state2.index).toEqual(0);
    expect(state2 && state2.routes[0].routeName).toEqual('Foo');
    /* $FlowFixMe */
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
        action: { type: NavigationActions.NAVIGATE, routeName: 'baz' },
      },
      state
    );
    const state3 = router.getStateForAction(
      {
        type: NavigationActions.RESET,
        key: 'Init',
        actions: [{ type: NavigationActions.NAVIGATE, routeName: 'Foo' }],
        index: 0,
      },
      state2
    );
    const state4 = router.getStateForAction(
      {
        type: NavigationActions.RESET,
        key: null,
        actions: [{ type: NavigationActions.NAVIGATE, routeName: 'Bar' }],
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
        routeName: 'Bar',
        params: { foo: '42' },
      },
      state
    );
    expect(state2 && state2.routes[1].params).toEqual({ foo: '42' });
    /* $FlowFixMe */
    expect(state2 && state2.routes[1].routes).toEqual([
      expect.objectContaining({
        routeName: 'Baz',
        params: { foo: '42' },
      }),
    ]);
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
        routeName: 'Bar',
        params: { foo: '42' },
      },
      state
    );
    expect(state2 && state2.routes[1].params).toEqual({ foo: '42' });
    /* $FlowFixMe */
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
        type: undefined,
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
    /* $FlowFixMe: params.id has to exist */
    expect(params.id).toEqual('123');
    /* $FlowFixMe: params.bazId has to exist */
    expect(params.bazId).toEqual('321');
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
