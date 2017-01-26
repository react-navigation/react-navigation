/**
 * @flow
 */

import React from 'react';

import StackRouter from '../StackRouter';
import TabRouter from '../TabRouter';

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

    expect(router.getComponentForState({
      index: 0,
      routes: [
        { key: 'a', routeName: 'foo' },
        { key: 'b', routeName: 'bar' },
        { key: 'c', routeName: 'foo' },
      ],
    })).toBe(FooScreen);
    expect(router.getComponentForState({
      index: 1,
      routes: [
        { key: 'a', routeName: 'foo' },
        { key: 'b', routeName: 'bar' },
      ],
    })).toBe(BarScreen);
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

    expect(router.getComponentForState({
      index: 0,
      routes: [
        { key: 'a', routeName: 'foo' },
        { key: 'b', routeName: 'bar' },
        { key: 'c', routeName: 'foo' },
      ],
    })).toBe(FooScreen);
    expect(router.getComponentForState({
      index: 1,
      routes: [
        { key: 'a', routeName: 'foo' },
        { key: 'b', routeName: 'bar' },
      ],
    })).toBe(BarScreen);
  });

  test('Gets the screen for given route', () => {
    const FooScreen = () => <div />;
    const BarScreen = class extends React.Component { render() { return <div />; } };
    const BazScreen = React.createClass({ render() { return <div />; } });
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
    const BarScreen = class extends React.Component { render() { return <div />; } };
    const BazScreen = React.createClass({ render() { return <div />; } });
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
      type: 'Navigate',
      routeName: 'login',
    });
  });

  test('Parses paths with a param', () => {
    expect(TestStackRouter.getActionForPathAndParams('people/foo')).toEqual({
      type: 'Navigate',
      routeName: 'person',
      params: {
        id: 'foo',
      },
    });
  });


  test('Correctly parses a path without arguments into an action chain', () => {
    const uri = 'auth/login';
    const action = TestStackRouter.getActionForPathAndParams(uri);
    expect(action).toEqual({
      type: 'Navigate',
      routeName: 'auth',
      action: {
        type: 'Navigate',
        routeName: 'login',
      },
    });
  });

  test('Correctly parses a path with arguments into an action chain', () => {
    const uri = 'main/p/4/list/10259959195';
    const action = TestStackRouter.getActionForPathAndParams(uri);
    expect(action).toEqual({
      type: 'Navigate',
      routeName: 'main',
      action: {
        type: 'Navigate',
        routeName: 'profile',
        params: {
          id: '4',
        },
        action: {
          type: 'Navigate',
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
      type: 'Navigate',
      routeName: 'auth',
      action: {
        type: 'Navigate',
        routeName: 'login',
      },
    });
  });

  test('Correctly returns action for path with multiple parameters', () => {
    const path = 'fo/22/b/hello';
    const action = TestStackRouter.getActionForPathAndParams(path);
    expect(action).toEqual({
      type: 'Navigate',
      routeName: 'foo',
      params: {
        fooThing: '22',
      },
      action: {
        type: 'Navigate',
        routeName: 'bar',
        params: {
          barThing: 'hello',
        },
      },
    });
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
    const state = router.getStateForAction({ type: 'Init' });
    expect(state).toEqual({
      index: 0,
      routes: [
        {
          key: 'Init',
          routeName: 'Foo',
        },
      ],
    });
    const state2 = router.getStateForAction({ type: 'Navigate', routeName: 'Bar', params: { name: 'Zoom' } }, state);
    expect(state2 && state2.index).toEqual(1);
    expect(state2 && state2.routes[1].routeName).toEqual('Bar');
    expect(state2 && state2.routes[1].params).toEqual({ name: 'Zoom' });
    expect(state2 && state2.routes.length).toEqual(2);
    const state3 = router.getStateForAction({ type: 'Back' }, state2);
    expect(state3).toEqual({
      index: 0,
      routes: [
        {
          key: 'Init',
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
    const state = router.getStateForAction({ type: 'Init' });
    expect(state).toEqual({
      index: 0,
      routes: [
        {
          key: 'Init',
          routeName: 'Foo',
        },
      ],
    });
    const state2 = router.getStateForAction({ type: 'Navigate', routeName: 'Bar', params: { name: 'Zoom' } }, state);
    expect(state2 && state2.index).toEqual(1);
    expect(state2 && state2.routes[1].routeName).toEqual('Bar');
    expect(state2 && state2.routes[1].params).toEqual({ name: 'Zoom' });
    expect(state2 && state2.routes.length).toEqual(2);
    const state3 = router.getStateForAction({ type: 'Back' }, state2);
    expect(state3).toEqual({
      index: 0,
      routes: [
        {
          key: 'Init',
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
    const state = router.getStateForAction({ type: 'Init' });
    const state2 = router.getStateForAction({ type: 'Navigate', routeName: 'Bar', params: { name: 'Zoom' } }, state);
    const state3 = router.getStateForAction({ type: 'Navigate', routeName: 'Bar', params: { name: 'Foo' } }, state2);
    const state4 = router.getStateForAction({ type: 'Back', key: 'wrongKey' }, state3);
    expect(state3).toEqual(state4);
    const state5 = router.getStateForAction({ type: 'Back', key: state3.routes[1].key }, state4);
    expect(state5).toEqual(state);
  });

  test('Handle initial route navigation', () => {
    const FooScreen = () => <div />;
    const BarScreen = () => <div />;
    const router = StackRouter({
      Foo: {
        screen: FooScreen,
      },
      Bar: {
        screen: BarScreen,
      },
    }, { initialRouteName: 'Bar' });
    const state = router.getStateForAction({ type: 'Init' });
    expect(state).toEqual({
      index: 0,
      routes: [
        {
          key: 'Init',
          routeName: 'Bar',
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
    const state = router.getStateForAction({ type: 'Init' });
    const state2 = router.getStateForAction({ type: 'Navigate', routeName: 'Bar', params: { bar: '42' } }, state);
    expect(state2).not.toBeNull();
    expect(state2 && state2.index).toEqual(1);
    expect(state2 && state2.routes[1].params).toEqual({ bar: '42' });
  });

  test('Handles the SetParams action', () => {
    const router = StackRouter({
      Foo: {
        screen: () => <div />,
      },
      Bar: {
        screen: () => <div />,
      },
    }, {
      initialRouteName: 'Bar',
      initialRouteParams: { name: 'Zoo' },
    });
    const state = router.getStateForAction({ type: 'Init' });
    const state2 = router.getStateForAction({
      type: 'SetParams',
      params: { name: 'Qux' },
      key: 'Init',
    }, state);
    expect(state2 && state2.index).toEqual(0);
    expect(state2 && state2.routes[0].params).toEqual({ name: 'Qux' });
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
    const state = router.getStateForAction({ type: 'Init' });
    const state2 = router.getStateForAction({ type: 'Reset', actions: [{ type: 'Navigate', routeName: 'Foo', params: { bar: '42' } }, { type: 'Navigate', routeName: 'Bar' }], index: 1 }, state);
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
    const state = router.getStateForAction({ type: 'Init' });
    const state2 = router.getStateForAction({ type: 'Reset', actions: [{ type: 'Navigate', routeName: 'Foo' }], index: 0 }, state);

    expect(state2 && state2.index).toEqual(0);
    expect(state2 && state2.routes[0].routeName).toEqual('Foo');
    expect(state2 && state2.routes[0].routes[0].routeName).toEqual('baz');
  });

  test('Handles empty URIs', () => {
    const router = StackRouter({
      Foo: {
        screen: () => <div />,
      },
      Bar: {
        screen: () => <div />,
      },
    }, { initialRouteName: 'Bar' });
    const action = router.getActionForPathAndParams('');
    expect(action).toEqual({ type: 'Navigate', routeName: 'Bar' });
    let state = null;
    if (action) {
      state = router.getStateForAction(action);
    }
    expect(state && state.index).toEqual(0);
    expect(state && state.routes[0]).toEqual({ key: 'Init', routeName: 'Bar' });
  });
});
