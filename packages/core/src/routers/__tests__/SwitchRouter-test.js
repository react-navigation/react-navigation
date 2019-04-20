/* eslint react/display-name:0 */

import React from 'react';
import SwitchRouter from '../SwitchRouter';
import StackRouter from '../StackRouter';
import * as SwitchActions from '../SwitchActions';
import * as NavigationActions from '../../NavigationActions';

describe('SwitchRouter', () => {
  it('resets the route when unfocusing a tab by default', () => {
    const router = getExampleRouter();
    const state = router.getStateForAction({ type: NavigationActions.INIT });
    const state2 = router.getStateForAction(
      { type: NavigationActions.NAVIGATE, routeName: 'A2' },
      state
    );
    expect(state2.routes[0].index).toEqual(1);
    expect(state2.routes[0].routes.length).toEqual(2);

    const state3 = router.getStateForAction(
      { type: NavigationActions.NAVIGATE, routeName: 'B' },
      state2
    );

    expect(state3.routes[0].index).toEqual(0);
    expect(state3.routes[0].routes.length).toEqual(1);
  });

  it('does not reset the route on unfocus if resetOnBlur is false', () => {
    const router = getExampleRouter({ resetOnBlur: false });
    const state = router.getStateForAction({ type: NavigationActions.INIT });
    const state2 = router.getStateForAction(
      { type: NavigationActions.NAVIGATE, routeName: 'A2' },
      state
    );
    expect(state2.routes[0].index).toEqual(1);
    expect(state2.routes[0].routes.length).toEqual(2);

    const state3 = router.getStateForAction(
      { type: NavigationActions.NAVIGATE, routeName: 'B' },
      state2
    );

    expect(state3.routes[0].index).toEqual(1);
    expect(state3.routes[0].routes.length).toEqual(2);
  });

  it('ignores back by default', () => {
    const router = getExampleRouter();
    const state = router.getStateForAction({ type: NavigationActions.INIT });
    const state2 = router.getStateForAction(
      { type: SwitchActions.JUMP_TO, routeName: 'B' },
      state
    );
    expect(state2.index).toEqual(1);

    const state3 = router.getStateForAction(
      { type: NavigationActions.BACK },
      state2
    );

    expect(state3.index).toEqual(1);
  });

  it('handles initialRoute backBehavior', () => {
    const router = getExampleRouter({ backBehavior: 'initialRoute' });

    const state = router.getStateForAction({ type: NavigationActions.INIT });
    expect(state.routeKeyHistory).toBeUndefined();

    const state2 = router.getStateForAction(
      { type: SwitchActions.JUMP_TO, routeName: 'B' },
      state
    );
    expect(state2.index).toEqual(1);

    const state3 = router.getStateForAction(
      { type: NavigationActions.BACK },
      state2
    );

    expect(state3.index).toEqual(0);
  });

  it('handles order backBehavior', () => {
    const routerHelper = new ExampleRouterHelper({ backBehavior: 'order' });
    expect(routerHelper.getCurrentState().routeKeyHistory).toBeUndefined();

    expect(
      routerHelper.applyAction({
        type: SwitchActions.JUMP_TO,
        routeName: 'C',
      })
    ).toMatchObject({ index: 2 });

    expect(
      routerHelper.applyAction({ type: NavigationActions.BACK })
    ).toMatchObject({ index: 1 });

    expect(
      routerHelper.applyAction({ type: NavigationActions.BACK })
    ).toMatchObject({ index: 0 });

    expect(
      routerHelper.applyAction({ type: NavigationActions.BACK })
    ).toMatchObject({ index: 0 });
  });

  it('handles history backBehavior', () => {
    const routerHelper = new ExampleRouterHelper({ backBehavior: 'history' });
    expect(routerHelper.getCurrentState().routeKeyHistory).toMatchObject(['A']);

    expect(
      routerHelper.applyAction({
        type: NavigationActions.NAVIGATE,
        routeName: 'B',
      })
    ).toMatchObject({ index: 1, routeKeyHistory: ['A', 'B'] });

    expect(
      routerHelper.applyAction({
        type: NavigationActions.NAVIGATE,
        routeName: 'A',
      })
    ).toMatchObject({ index: 0, routeKeyHistory: ['B', 'A'] });

    expect(
      routerHelper.applyAction({
        type: NavigationActions.NAVIGATE,
        routeName: 'C',
      })
    ).toMatchObject({ index: 2, routeKeyHistory: ['B', 'A', 'C'] });

    expect(
      routerHelper.applyAction({
        type: NavigationActions.NAVIGATE,
        routeName: 'A',
      })
    ).toMatchObject({ index: 0, routeKeyHistory: ['B', 'C', 'A'] });

    expect(
      routerHelper.applyAction({ type: NavigationActions.BACK })
    ).toMatchObject({ index: 2, routeKeyHistory: ['B', 'C'] });

    expect(
      routerHelper.applyAction({ type: NavigationActions.BACK })
    ).toMatchObject({ index: 1, routeKeyHistory: ['B'] });

    expect(
      routerHelper.applyAction({ type: NavigationActions.BACK })
    ).toMatchObject({ index: 1, routeKeyHistory: ['B'] });
  });

  it('handles nested actions', () => {
    const router = getExampleRouter();
    const state = router.getStateForAction({ type: NavigationActions.INIT });
    const state2 = router.getStateForAction(
      {
        type: NavigationActions.NAVIGATE,
        routeName: 'B',
        action: { type: NavigationActions.NAVIGATE, routeName: 'B2' },
      },
      state
    );
    const subState = state2.routes[state2.index];
    const activeGrandChildRoute = subState.routes[subState.index];
    expect(activeGrandChildRoute.routeName).toEqual('B2');
  });

  it('handles nested actions and params simultaneously', () => {
    const router = getExampleRouter();
    const state = router.getStateForAction({ type: NavigationActions.INIT });
    const state2 = router.getStateForAction(
      {
        type: NavigationActions.NAVIGATE,
        routeName: 'B',
        params: { foo: 'bar' },
        action: { type: NavigationActions.NAVIGATE, routeName: 'B2' },
      },
      state
    );
    const subState = state2.routes[state2.index];
    const activeGrandChildRoute = subState.routes[subState.index];
    expect(subState.params.foo).toEqual('bar');
    expect(activeGrandChildRoute.routeName).toEqual('B2');
  });

  it('order of handling navigate action is correct for nested switchrouters', () => {
    // router = switch({ Nested: switch({ Foo, Bar }), Other: switch({ Foo }), Bar })
    // if we are focused on Other and navigate to Bar, what should happen?

    const Screen = () => <div />;
    const NestedSwitch = () => <div />;
    const OtherNestedSwitch = () => <div />;

    let nestedRouter = SwitchRouter({ Foo: Screen, Bar: Screen });
    let otherNestedRouter = SwitchRouter({ Foo: Screen });
    NestedSwitch.router = nestedRouter;
    OtherNestedSwitch.router = otherNestedRouter;

    let router = SwitchRouter(
      {
        NestedSwitch,
        OtherNestedSwitch,
        Bar: Screen,
      },
      {
        initialRouteName: 'OtherNestedSwitch',
      }
    );

    const state = router.getStateForAction({ type: NavigationActions.INIT });
    expect(state.routes[state.index].routeName).toEqual('OtherNestedSwitch');

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
        routeName: 'NestedSwitch',
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
    expect(activeState4.routeName).toEqual('NestedSwitch');
    expect(activeState4.routes[activeState4.index].routeName).toEqual('Bar');
  });

  // https://github.com/react-navigation/react-navigation.github.io/issues/117#issuecomment-385597628
  it('order of handling navigate action is correct for nested stackrouters', () => {
    const Screen = () => <div />;
    const MainStack = () => <div />;
    const LoginStack = () => <div />;
    MainStack.router = StackRouter({ Home: Screen, Profile: Screen });
    LoginStack.router = StackRouter({ Form: Screen, ForgotPassword: Screen });

    let router = SwitchRouter(
      {
        Home: Screen,
        Login: LoginStack,
        Main: MainStack,
      },
      {
        initialRouteName: 'Login',
      }
    );

    const state = router.getStateForAction({ type: NavigationActions.INIT });
    expect(state.routes[state.index].routeName).toEqual('Login');

    const state2 = router.getStateForAction(
      {
        type: SwitchActions.JUMP_TO,
        routeName: 'Home',
      },
      state
    );
    expect(state2.routes[state2.index].routeName).toEqual('Home');
  });
});

// A simple helper that makes it easier to write basic routing tests
// As we generally want to apply one action after the other,
// it's often convenient to manipulate a structure that keeps the router state
class ExampleRouterHelper {
  constructor(config) {
    this._router = getExampleRouter(config);
    this._currentState = this._router.getStateForAction({
      type: NavigationActions.INIT,
    });
  }

  applyAction = action => {
    this._currentState = this._router.getStateForAction(
      action,
      this._currentState
    );
    return this._currentState;
  };

  getCurrentState = () => this._currentState;
}

const getExampleRouter = (config = {}) => {
  const PlainScreen = () => <div />;
  const StackA = () => <div />;
  const StackB = () => <div />;
  const StackC = () => <div />;

  StackA.router = StackRouter({
    A1: PlainScreen,
    A2: PlainScreen,
  });

  StackB.router = StackRouter({
    B1: PlainScreen,
    B2: PlainScreen,
  });

  StackC.router = StackRouter({
    C1: PlainScreen,
    C2: PlainScreen,
  });

  const router = SwitchRouter(
    {
      A: {
        screen: StackA,
        path: '',
      },
      B: {
        screen: StackB,
        path: 'great/path',
      },
      C: {
        screen: StackC,
        path: 'pathC',
      },
    },
    {
      initialRouteName: 'A',
      ...config,
    }
  );

  return router;
};
