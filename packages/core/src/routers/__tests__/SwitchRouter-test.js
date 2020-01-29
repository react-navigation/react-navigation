/* eslint react/display-name:0 */

import React from 'react';
import SwitchRouter from '../SwitchRouter';
import StackRouter from '../StackRouter';
import * as NavigationActions from '../../NavigationActions';
import { getRouterTestHelper } from './routerTestHelper';

describe('SwitchRouter', () => {
  it('resets the route when unfocusing a tab by default', () => {
    const { navigateTo, getState } = getRouterTestHelper(getExampleRouter());

    navigateTo('A2');
    expect(getState().routes[0].index).toEqual(1);
    expect(getState().routes[0].routes.length).toEqual(2);

    navigateTo('B');
    expect(getState().routes[0].index).toEqual(0);
    expect(getState().routes[0].routes.length).toEqual(1);
  });

  it('does not reset the route on unfocus if resetOnBlur is false', () => {
    const { navigateTo, getState } = getRouterTestHelper(
      getExampleRouter({ resetOnBlur: false })
    );

    navigateTo('A2');
    expect(getState().routes[0].index).toEqual(1);
    expect(getState().routes[0].routes.length).toEqual(2);

    navigateTo('B');
    expect(getState().routes[0].index).toEqual(1);
    expect(getState().routes[0].routes.length).toEqual(2);
  });

  it('ignores back by default', () => {
    const { jumpTo, back, getState } = getRouterTestHelper(getExampleRouter());

    jumpTo('B');
    expect(getState().index).toEqual(1);

    back();
    expect(getState().index).toEqual(1);
  });

  it('handles initialRoute backBehavior', () => {
    const { jumpTo, back, getState } = getRouterTestHelper(
      getExampleRouter({ backBehavior: 'initialRoute', initialRouteName: 'B' })
    );
    expect(getState().routeKeyHistory).toBeUndefined();
    expect(getState().index).toEqual(1);

    jumpTo('C');
    expect(getState().index).toEqual(2);

    jumpTo('A');
    expect(getState().index).toEqual(0);

    back();
    expect(getState().index).toEqual(1);

    back();
    expect(getState().index).toEqual(1);
  });

  it('handles order backBehavior', () => {
    const { navigateTo, back, getState } = getRouterTestHelper(
      getExampleRouter({ backBehavior: 'order' })
    );
    expect(getState().routeKeyHistory).toBeUndefined();

    navigateTo('C');
    expect(getState().index).toEqual(2);

    back();
    expect(getState().index).toEqual(1);

    back();
    expect(getState().index).toEqual(0);

    back();
    expect(getState().index).toEqual(0);
  });

  it('handles history backBehavior', () => {
    const { navigateTo, back, getState } = getRouterTestHelper(
      getExampleRouter({ backBehavior: 'history' })
    );
    expect(getState().routeKeyHistory).toEqual(['A']);

    navigateTo('B');
    expect(getState().index).toEqual(1);
    expect(getState().routeKeyHistory).toEqual(['A', 'B']);

    navigateTo('A');
    expect(getState().index).toEqual(0);
    expect(getState().routeKeyHistory).toEqual(['B', 'A']);

    navigateTo('C');
    expect(getState().index).toEqual(2);
    expect(getState().routeKeyHistory).toEqual(['B', 'A', 'C']);

    navigateTo('A');
    expect(getState().index).toEqual(0);
    expect(getState().routeKeyHistory).toEqual(['B', 'C', 'A']);

    back();
    expect(getState().index).toEqual(2);
    expect(getState().routeKeyHistory).toEqual(['B', 'C']);

    back();
    expect(getState().index).toEqual(1);
    expect(getState().routeKeyHistory).toEqual(['B']);

    back();
    expect(getState().index).toEqual(1);
    expect(getState().routeKeyHistory).toEqual(['B']);
  });

  it('handles history backBehavior without popping routeKeyHistory when child handles action', () => {
    const { navigateTo, back, getState, getSubState } = getRouterTestHelper(
      getExampleRouter({ backBehavior: 'history' })
    );
    expect(getState().routeKeyHistory).toEqual(['A']);

    navigateTo('B');
    expect(getState().index).toEqual(1);
    expect(getState().routeKeyHistory).toEqual(['A', 'B']);

    navigateTo('B2');
    expect(getState().index).toEqual(1);
    expect(getState().routeKeyHistory).toEqual(['A', 'B']);
    expect(getSubState(2).routeName).toEqual('B2');

    back();
    expect(getState().index).toEqual(1);
    // 'B' should not be popped when the child handles the back action
    expect(getState().routeKeyHistory).toEqual(['A', 'B']);
    expect(getSubState(2).routeName).toEqual('B1');
  });

  it('handles back and does not apply back action to inactive child', () => {
    const { navigateTo, back, getSubState } = getRouterTestHelper(
      getExampleRouter({
        backBehavior: 'initialRoute',
        resetOnBlur: false, // Don't erase the state of substack B when we switch back to A
      })
    );

    expect(getSubState(1).routeName).toEqual('A');

    navigateTo('B');
    navigateTo('B2');
    expect(getSubState(1).routeName).toEqual('B');
    expect(getSubState(2).routeName).toEqual('B2');

    navigateTo('A');
    expect(getSubState(1).routeName).toEqual('A');

    // The back action should not switch to B. It should stay on A
    back({ key: null });
    expect(getSubState(1).routeName).toEqual('A');
  });

  it('handles pop and does not apply pop action to inactive child', () => {
    const { navigateTo, pop, getSubState } = getRouterTestHelper(
      getExampleRouter({
        backBehavior: 'initialRoute',
        resetOnBlur: false, // Don't erase the state of substack B when we switch back to A
      })
    );

    expect(getSubState(1).routeName).toEqual('A');

    navigateTo('B');
    navigateTo('B2');
    expect(getSubState(1).routeName).toEqual('B');
    expect(getSubState(2).routeName).toEqual('B2');

    navigateTo('A');
    expect(getSubState(1).routeName).toEqual('A');

    // The pop action should not switch to B. It should stay on A
    pop();
    expect(getSubState(1).routeName).toEqual('A');
  });

  it('handles popToTop and does not apply popToTop action to inactive child', () => {
    const { navigateTo, popToTop, getSubState } = getRouterTestHelper(
      getExampleRouter({
        backBehavior: 'initialRoute',
        resetOnBlur: false, // Don't erase the state of substack B when we switch back to A
      })
    );

    expect(getSubState(1).routeName).toEqual('A');

    navigateTo('B');
    navigateTo('B2');
    expect(getSubState(1).routeName).toEqual('B');
    expect(getSubState(2).routeName).toEqual('B2');

    navigateTo('A');
    expect(getSubState(1).routeName).toEqual('A');

    // The popToTop action should not switch to B. It should stay on A
    popToTop();
    expect(getSubState(1).routeName).toEqual('A');
  });

  it('handles back and does switch to inactive child with matching key', () => {
    const { navigateTo, back, getSubState } = getRouterTestHelper(
      getExampleRouter({
        backBehavior: 'initialRoute',
        resetOnBlur: false, // Don't erase the state of substack B when we switch back to A
      })
    );

    expect(getSubState(1).routeName).toEqual('A');

    navigateTo('B');
    navigateTo('B2');
    expect(getSubState(1).routeName).toEqual('B');
    expect(getSubState(2).routeName).toEqual('B2');
    const b2Key = getSubState(2).key;

    navigateTo('A');
    expect(getSubState(1).routeName).toEqual('A');

    // The back action should switch to B and go back from B2 to B1
    back(b2Key);
    expect(getSubState(1).routeName).toEqual('B');
    expect(getSubState(2).routeName).toEqual('B1');
  });

  it('handles nested actions', () => {
    const { navigateTo, getSubState } = getRouterTestHelper(getExampleRouter());

    navigateTo('B', {
      action: { type: NavigationActions.NAVIGATE, routeName: 'B2' },
    });
    expect(getSubState(1).routeName).toEqual('B');
    expect(getSubState(2).routeName).toEqual('B2');
  });

  it('handles nested actions and params simultaneously', () => {
    const { navigateTo, getSubState } = getRouterTestHelper(getExampleRouter());

    const params1 = { foo: 'bar' };
    const params2 = { bar: 'baz' };

    navigateTo('B', {
      params: params1,
      action: {
        type: NavigationActions.NAVIGATE,
        routeName: 'B2',
        params: params2,
      },
    });
    expect(getSubState(1).routeName).toEqual('B');
    expect(getSubState(1).params).toEqual(params1);
    expect(getSubState(2).routeName).toEqual('B2');
    expect(getSubState(2).params).toEqual(params2);
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

    const { navigateTo, getSubState } = getRouterTestHelper(router);
    expect(getSubState(1).routeName).toEqual('OtherNestedSwitch');

    navigateTo('Bar');
    expect(getSubState(1).routeName).toEqual('Bar');

    navigateTo('NestedSwitch');
    navigateTo('Bar');

    expect(getSubState(1).routeName).toEqual('NestedSwitch');
    expect(getSubState(2).routeName).toEqual('Bar');
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

    const { navigateTo, getSubState } = getRouterTestHelper(router);
    expect(getSubState(1).routeName).toEqual('Login');

    navigateTo('Home');
    expect(getSubState(1).routeName).toEqual('Home');
  });

  it('does not error for a nested navigate action in an uninitialized history router', () => {
    const { navigateTo, getSubState } = getRouterTestHelper(
      getExampleRouter({ backBehavior: 'history' }),
      { skipInitializeState: true }
    );

    navigateTo('B', {
      action: NavigationActions.navigate({ routeName: 'B2' }),
    });
    expect(getSubState(1).routeName).toEqual('B');
    expect(getSubState(2).routeName).toEqual('B2');
  });
});

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
