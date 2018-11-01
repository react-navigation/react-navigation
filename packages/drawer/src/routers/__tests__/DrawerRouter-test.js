/* eslint react/display-name:0 */

import React from 'react';
import DrawerRouter from '../DrawerRouter';

import {
  NavigationActions,
  SwitchRouter,
  StackRouter,
} from '@react-navigation/core';
import DrawerActions from '../../routers/DrawerActions';

const INIT_ACTION = { type: NavigationActions.INIT };

describe('DrawerRouter', () => {
  test('Handles basic drawer logic and fires close on switch', () => {
    const ScreenA = () => <div />;
    const ScreenB = () => <div />;
    const router = DrawerRouter({
      Foo: { screen: ScreenA },
      Bar: { screen: ScreenB },
    });
    const state = router.getStateForAction(INIT_ACTION);
    const expectedState = {
      index: 0,
      isTransitioning: false,
      routes: [
        { key: 'Foo', routeName: 'Foo', params: undefined },
        { key: 'Bar', routeName: 'Bar', params: undefined },
      ],
      isDrawerOpen: false,
      isDrawerIdle: true,
      drawerMovementDirection: null,
      openId: 0,
      closeId: 1,
      toggleId: 2,
    };
    expect(state).toEqual(expectedState);
    const state2 = router.getStateForAction(
      { type: NavigationActions.NAVIGATE, routeName: 'Bar' },
      state
    );
    const expectedState2 = {
      index: 1,
      isTransitioning: false,
      routes: [
        { key: 'Foo', routeName: 'Foo', params: undefined },
        { key: 'Bar', routeName: 'Bar', params: undefined },
      ],
      isDrawerOpen: false,
      isDrawerIdle: true,
      drawerMovementDirection: null,
      openId: 0,
      closeId: 3,
      toggleId: 2,
    };
    expect(state2).toEqual(expectedState2);
    expect(router.getComponentForState(expectedState)).toEqual(ScreenA);
    expect(router.getComponentForState(expectedState2)).toEqual(ScreenB);
  });

  test('Handles initial route navigation', () => {
    const FooScreen = () => <div />;
    const BarScreen = () => <div />;
    const router = DrawerRouter(
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
    const state = router.getStateForAction({
      type: NavigationActions.NAVIGATE,
      routeName: 'Foo',
    });
    expect(state).toEqual({
      index: 0,
      isDrawerOpen: false,
      isDrawerIdle: true,
      drawerMovementDirection: null,
      isTransitioning: false,
      openId: 0,
      closeId: 1,
      toggleId: 2,
      routes: [
        {
          key: 'Foo',
          params: undefined,
          routeName: 'Foo',
        },
        {
          key: 'Bar',
          params: undefined,
          routeName: 'Bar',
        },
      ],
    });
  });

  test('Drawer opens closes and toggles', () => {
    const ScreenA = () => <div />;
    const ScreenB = () => <div />;
    const router = DrawerRouter({
      Foo: { screen: ScreenA },
      Bar: { screen: ScreenB },
    });
    const state = router.getStateForAction(INIT_ACTION);
    expect(state.toggleId).toEqual(2);
    const state2 = router.getStateForAction(
      { type: DrawerActions.OPEN_DRAWER },
      state
    );
    expect(state2.openId).toEqual(3);
    const state3 = router.getStateForAction(
      { type: DrawerActions.CLOSE_DRAWER },
      state2
    );
    expect(state3.closeId).toEqual(4);
    const state4 = router.getStateForAction(
      { type: DrawerActions.TOGGLE_DRAWER },
      state3
    );
    expect(state4.toggleId).toEqual(5);
  });

  test('Drawer opens closes with key targeted', () => {
    const ScreenA = () => <div />;
    const ScreenB = () => <div />;
    const router = DrawerRouter({
      Foo: { screen: ScreenA },
      Bar: { screen: ScreenB },
    });
    const state = router.getStateForAction(INIT_ACTION);
    const state2 = router.getStateForAction(
      { type: DrawerActions.OPEN_DRAWER, key: 'wrong' },
      state
    );
    expect(state2.openId).toEqual(0);
    const state3 = router.getStateForAction(
      { type: DrawerActions.OPEN_DRAWER, key: state.key },
      state2
    );
    expect(state3.openId).toEqual(3);
  });
});

test('Nested routers bubble up blocked actions', () => {
  const ScreenA = () => <div />;
  ScreenA.router = {
    getStateForAction(action, lastState) {
      if (action.type === 'CHILD_ACTION') return null;
      return lastState;
    },
  };
  const ScreenB = () => <div />;
  const router = DrawerRouter({
    Foo: { screen: ScreenA },
    Bar: { screen: ScreenB },
  });
  const state = router.getStateForAction(INIT_ACTION);

  const state2 = router.getStateForAction({ type: 'CHILD_ACTION' }, state);
  expect(state2).toEqual(null);
});

test('Drawer does not fire close when child routers return new state', () => {
  const ScreenA = () => <div />;
  ScreenA.router = {
    getStateForAction(action, lastState = { changed: false }) {
      if (action.type === 'CHILD_ACTION')
        return { ...lastState, changed: true };
      return lastState;
    },
  };
  const router = DrawerRouter({
    Foo: { screen: ScreenA },
  });

  const state = router.getStateForAction(INIT_ACTION);
  expect(state.closeId).toEqual(1);

  const state2 = router.getStateForAction({ type: 'CHILD_ACTION' }, state);
  expect(state2.closeId).toEqual(1);
  expect(state2.routes[0].changed).toEqual(true);
});

test('DrawerRouter will close drawer on child navigaton, not on child param changes', () => {
  class FooView extends React.Component {
    render() {
      return <div />;
    }
  }
  const BarRouter = SwitchRouter({
    Qux: FooView,
    Quo: FooView,
  });
  class BarView extends React.Component {
    static router = BarRouter;
    render() {
      return <div />;
    }
  }
  const router = DrawerRouter({
    Bar: BarView,
    Foo: FooView,
  });

  const emptyState = router.getStateForAction(NavigationActions.init());
  const initState = router.getStateForAction(
    DrawerActions.openDrawer(),
    emptyState
  );
  expect(initState.openId).toBe(3);

  const state0 = router.getStateForAction(
    NavigationActions.navigate({ routeName: 'Quo' }),
    initState
  );
  expect(state0.closeId).toBe(4);

  const initSwitchState = initState.routes[initState.index];
  const initQuxState = initSwitchState.routes[initSwitchState.index];

  const state1 = router.getStateForAction(
    NavigationActions.setParams({
      key: initQuxState.key,
      params: { foo: 'bar' },
    }),
    initState
  );
  const state1switchState = state1.routes[state1.index];
  const state1quxState = state1switchState.routes[state1switchState.index];
  expect(state1.closeId).toBe(1); // don't fire close
  expect(state1quxState.params.foo).toEqual('bar');
});

test('goBack closes drawer when inside of stack', () => {
  const ScreenA = () => <div />;
  const DrawerScreen = () => <div />;
  DrawerScreen.router = DrawerRouter({
    Foo: { screen: ScreenA },
    Bar: { screen: ScreenA },
  });
  const router = StackRouter({
    Baz: { screen: ScreenA },
    Drawer: { screen: DrawerScreen },
  });
  const state0 = router.getStateForAction(INIT_ACTION);
  expect(state0.index).toEqual(0);
  const state1 = router.getStateForAction(
    NavigationActions.navigate({ routeName: 'Foo' }),
    state0
  );
  expect(state1.index).toEqual(1);
  const state2 = router.getStateForAction(DrawerActions.openDrawer(), state1);
  const state3 = router.getStateForAction(
    { type: DrawerActions.DRAWER_OPENED },
    state2
  );
  expect(state3.index).toEqual(1);
  expect(state3.routes[1].isDrawerOpen).toEqual(true);
  expect(state3.routes[1].closeId).toEqual(1); // changed
  const state4 = router.getStateForAction(NavigationActions.back(), state3);
  expect(state4.routes[1].closeId).toEqual(4);
  const state5 = router.getStateForAction(
    { type: DrawerActions.DRAWER_CLOSED },
    state4
  );
  expect(state5.routes[1].isDrawerOpen).toEqual(false);
});
