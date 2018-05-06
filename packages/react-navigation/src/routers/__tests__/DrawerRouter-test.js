/* eslint react/display-name:0 */

import React from 'react';
import DrawerRouter from '../DrawerRouter';

import NavigationActions from '../../NavigationActions';
import DrawerActions from '../../routers/DrawerActions';

const INIT_ACTION = { type: NavigationActions.INIT };

describe('DrawerRouter', () => {
  test('Handles basic tab logic', () => {
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
    };
    expect(state2).toEqual(expectedState2);
    expect(router.getComponentForState(expectedState)).toEqual(ScreenA);
    expect(router.getComponentForState(expectedState2)).toEqual(ScreenB);
  });

  test('Drawer opens closes and toggles', () => {
    const ScreenA = () => <div />;
    const ScreenB = () => <div />;
    const router = DrawerRouter({
      Foo: { screen: ScreenA },
      Bar: { screen: ScreenB },
    });
    const state = router.getStateForAction(INIT_ACTION);
    expect(state.isDrawerOpen).toEqual(false);
    const state2 = router.getStateForAction(
      { type: DrawerActions.OPEN_DRAWER },
      state
    );
    expect(state2.isDrawerOpen).toEqual(true);
    const state3 = router.getStateForAction(
      { type: DrawerActions.CLOSE_DRAWER },
      state2
    );
    expect(state3.isDrawerOpen).toEqual(false);
    const state4 = router.getStateForAction(
      { type: DrawerActions.TOGGLE_DRAWER },
      state3
    );
    expect(state4.isDrawerOpen).toEqual(true);
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
    expect(state2.isDrawerOpen).toEqual(false);
    const state3 = router.getStateForAction(
      { type: DrawerActions.OPEN_DRAWER, key: state.key },
      state2
    );
    expect(state3.isDrawerOpen).toEqual(true);
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

test('Drawer stays open when child routers return new state', () => {
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
  expect(state.isDrawerOpen).toEqual(false);

  const state2 = router.getStateForAction(
    { type: DrawerActions.OPEN_DRAWER, key: state.key },
    state
  );
  expect(state2.isDrawerOpen).toEqual(true);

  const state3 = router.getStateForAction({ type: 'CHILD_ACTION' }, state2);
  expect(state3.isDrawerOpen).toEqual(true);
  expect(state3.routes[0].changed).toEqual(true);
});
