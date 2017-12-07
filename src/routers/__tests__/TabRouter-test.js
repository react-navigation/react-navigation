/* @flow */
/* eslint react/display-name:0 */

import React from 'react';
import TabRouter from '../TabRouter';
import StackRouter from '../StackRouter';

import NavigationActions from '../../NavigationActions';

import type { NavigationRoute, NavigationState } from '../../TypeDefinition';

const INIT_ACTION = { type: NavigationActions.INIT };

const BareLeafRouteConfig = {
  screen: () => <div />,
};

describe('TabRouter', () => {
  test('Handles basic tab logic', () => {
    const ScreenA = () => <div />;
    const ScreenB = () => <div />;
    const router = TabRouter({
      Foo: { screen: ScreenA },
      Bar: { screen: ScreenB },
    });
    const state = router.getStateForAction({ type: NavigationActions.INIT });
    const expectedState = {
      index: 0,
      routes: [
        { key: 'Foo', routeName: 'Foo' },
        { key: 'Bar', routeName: 'Bar' },
      ],
    };
    expect(state).toEqual(expectedState);
    const state2 = router.getStateForAction(
      { type: NavigationActions.NAVIGATE, routeName: 'Bar' },
      state
    );
    const expectedState2 = {
      index: 1,
      routes: [
        { key: 'Foo', routeName: 'Foo' },
        { key: 'Bar', routeName: 'Bar' },
      ],
    };
    expect(state2).toEqual(expectedState2);
    expect(router.getComponentForState(expectedState)).toEqual(ScreenA);
    expect(router.getComponentForState(expectedState2)).toEqual(ScreenB);
    const state3 = router.getStateForAction(
      { type: NavigationActions.NAVIGATE, routeName: 'Bar' },
      state2
    );
    expect(state3).toEqual(null);
  });

  test('Handles getScreen', () => {
    const ScreenA = () => <div />;
    const ScreenB = () => <div />;
    const router = TabRouter({
      Foo: { getScreen: () => ScreenA },
      Bar: { getScreen: () => ScreenB },
    });
    const state = router.getStateForAction({ type: NavigationActions.INIT });
    const expectedState = {
      index: 0,
      routes: [
        { key: 'Foo', routeName: 'Foo' },
        { key: 'Bar', routeName: 'Bar' },
      ],
    };
    expect(state).toEqual(expectedState);
    const state2 = router.getStateForAction(
      { type: NavigationActions.NAVIGATE, routeName: 'Bar' },
      state
    );
    const expectedState2 = {
      index: 1,
      routes: [
        { key: 'Foo', routeName: 'Foo' },
        { key: 'Bar', routeName: 'Bar' },
      ],
    };
    expect(state2).toEqual(expectedState2);
    expect(router.getComponentForState(expectedState)).toEqual(ScreenA);
    expect(router.getComponentForState(expectedState2)).toEqual(ScreenB);
    const state3 = router.getStateForAction(
      { type: NavigationActions.NAVIGATE, routeName: 'Bar' },
      state2
    );
    expect(state3).toEqual(null);
  });

  test('Can set the initial tab', () => {
    const router = TabRouter(
      { Foo: BareLeafRouteConfig, Bar: BareLeafRouteConfig },
      { initialRouteName: 'Bar' }
    );
    const state = router.getStateForAction({ type: NavigationActions.INIT });
    expect(state).toEqual({
      index: 1,
      routes: [
        { key: 'Foo', routeName: 'Foo' },
        { key: 'Bar', routeName: 'Bar' },
      ],
    });
  });

  test('Handles the SetParams action', () => {
    const router = TabRouter({
      Foo: {
        screen: () => <div />,
      },
      Bar: {
        screen: () => <div />,
      },
    });
    const state2 = router.getStateForAction({
      type: NavigationActions.SET_PARAMS,
      params: { name: 'Qux' },
      key: 'Foo',
    });
    expect(state2 && state2.routes[0].params).toEqual({ name: 'Qux' });
  });

  test('getStateForAction returns null when navigating to same tab', () => {
    const router = TabRouter(
      { Foo: BareLeafRouteConfig, Bar: BareLeafRouteConfig },
      { initialRouteName: 'Bar' }
    );
    const state = router.getStateForAction({ type: NavigationActions.INIT });
    const state2 = router.getStateForAction(
      { type: NavigationActions.NAVIGATE, routeName: 'Bar' },
      state
    );
    expect(state2).toEqual(null);
  });

  test('getStateForAction returns initial navigate', () => {
    const router = TabRouter({
      Foo: BareLeafRouteConfig,
      Bar: BareLeafRouteConfig,
    });
    const state = router.getStateForAction({
      type: NavigationActions.NAVIGATE,
      routeName: 'Foo',
    });
    expect(state && state.index).toEqual(0);
  });

  test('Handles nested tabs and nested actions', () => {
    const ChildTabNavigator = () => <div />;
    ChildTabNavigator.router = TabRouter({
      Foo: BareLeafRouteConfig,
      Bar: BareLeafRouteConfig,
    });
    const router = TabRouter({
      Foo: BareLeafRouteConfig,
      Baz: { screen: ChildTabNavigator },
      Boo: BareLeafRouteConfig,
    });
    const params = { foo: '42' };
    const action = router.getActionForPathAndParams('Baz/Bar', params);
    const navAction = {
      type: NavigationActions.NAVIGATE,
      routeName: 'Baz',
      action: {
        type: NavigationActions.NAVIGATE,
        routeName: 'Bar',
        params: { foo: '42' },
      },
    };
    expect(action).toEqual(navAction);
    const state = router.getStateForAction(navAction);
    expect(state).toEqual({
      index: 1,
      routes: [
        {
          key: 'Foo',
          routeName: 'Foo',
        },
        {
          index: 1,
          key: 'Baz',
          routeName: 'Baz',
          routes: [
            {
              key: 'Foo',
              routeName: 'Foo',
            },
            {
              key: 'Bar',
              routeName: 'Bar',
              params,
            },
          ],
        },
        {
          key: 'Boo',
          routeName: 'Boo',
        },
      ],
    });
  });

  test('Handles passing params to nested tabs', () => {
    const ChildTabNavigator = () => <div />;
    ChildTabNavigator.router = TabRouter({
      Boo: BareLeafRouteConfig,
      Bar: BareLeafRouteConfig,
    });
    const router = TabRouter({
      Foo: BareLeafRouteConfig,
      Baz: { screen: ChildTabNavigator },
    });
    const navAction = {
      type: NavigationActions.NAVIGATE,
      routeName: 'Baz',
    };
    let state = router.getStateForAction(navAction);
    expect(state).toEqual({
      index: 1,
      routes: [
        { key: 'Foo', routeName: 'Foo' },
        {
          index: 0,
          key: 'Baz',
          routeName: 'Baz',
          routes: [
            { key: 'Boo', routeName: 'Boo' },
            { key: 'Bar', routeName: 'Bar' },
          ],
        },
      ],
    });

    // Ensure that navigating back and forth doesn't overwrite
    state = router.getStateForAction(
      { type: NavigationActions.NAVIGATE, routeName: 'Bar' },
      state
    );
    state = router.getStateForAction(
      { type: NavigationActions.NAVIGATE, routeName: 'Boo' },
      state
    );
    expect(state && state.routes[1]).toEqual({
      index: 0,
      key: 'Baz',
      routeName: 'Baz',
      routes: [
        { key: 'Boo', routeName: 'Boo' },
        { key: 'Bar', routeName: 'Bar' },
      ],
    });
  });

  test('Handles initial deep linking into nested tabs', () => {
    const ChildTabNavigator = () => <div />;
    ChildTabNavigator.router = TabRouter({
      Foo: BareLeafRouteConfig,
      Bar: BareLeafRouteConfig,
    });
    const router = TabRouter({
      Foo: BareLeafRouteConfig,
      Baz: { screen: ChildTabNavigator },
      Boo: BareLeafRouteConfig,
    });
    const state = router.getStateForAction({
      type: NavigationActions.NAVIGATE,
      routeName: 'Bar',
    });
    expect(state).toEqual({
      index: 1,
      routes: [
        { key: 'Foo', routeName: 'Foo' },
        {
          index: 1,
          key: 'Baz',
          routeName: 'Baz',
          routes: [
            { key: 'Foo', routeName: 'Foo' },
            { key: 'Bar', routeName: 'Bar' },
          ],
        },
        { key: 'Boo', routeName: 'Boo' },
      ],
    });
    const state2 = router.getStateForAction(
      { type: NavigationActions.NAVIGATE, routeName: 'Foo' },
      state
    );
    expect(state2).toEqual({
      index: 1,
      routes: [
        { key: 'Foo', routeName: 'Foo' },
        {
          index: 0,
          key: 'Baz',
          routeName: 'Baz',
          routes: [
            { key: 'Foo', routeName: 'Foo' },
            { key: 'Bar', routeName: 'Bar' },
          ],
        },
        { key: 'Boo', routeName: 'Boo' },
      ],
    });
    const state3 = router.getStateForAction(
      { type: NavigationActions.NAVIGATE, routeName: 'Foo' },
      state2
    );
    expect(state3).toEqual(null);
  });

  test('Handles linking across of deeply nested tabs', () => {
    const ChildNavigator0 = () => <div />;
    ChildNavigator0.router = TabRouter({
      Boo: BareLeafRouteConfig,
      Baz: BareLeafRouteConfig,
    });
    const ChildNavigator1 = () => <div />;
    ChildNavigator1.router = TabRouter({
      Zoo: BareLeafRouteConfig,
      Zap: BareLeafRouteConfig,
    });
    const MidNavigator = () => <div />;
    MidNavigator.router = TabRouter({
      Foo: { screen: ChildNavigator0 },
      Bar: { screen: ChildNavigator1 },
    });
    const router = TabRouter({
      Foo: { screen: MidNavigator },
      Gah: BareLeafRouteConfig,
    });
    const state = router.getStateForAction(INIT_ACTION);
    expect(state).toEqual({
      index: 0,
      routes: [
        {
          index: 0,
          key: 'Foo',
          routeName: 'Foo',
          routes: [
            {
              index: 0,
              key: 'Foo',
              routeName: 'Foo',
              routes: [
                { key: 'Boo', routeName: 'Boo' },
                { key: 'Baz', routeName: 'Baz' },
              ],
            },
            {
              index: 0,
              key: 'Bar',
              routeName: 'Bar',
              routes: [
                { key: 'Zoo', routeName: 'Zoo' },
                { key: 'Zap', routeName: 'Zap' },
              ],
            },
          ],
        },
        { key: 'Gah', routeName: 'Gah' },
      ],
    });
    const state2 = router.getStateForAction(
      { type: NavigationActions.NAVIGATE, routeName: 'Zap' },
      state
    );
    expect(state2).toEqual({
      index: 0,
      routes: [
        {
          index: 1,
          key: 'Foo',
          routeName: 'Foo',
          routes: [
            {
              index: 0,
              key: 'Foo',
              routeName: 'Foo',
              routes: [
                { key: 'Boo', routeName: 'Boo' },
                { key: 'Baz', routeName: 'Baz' },
              ],
            },
            {
              index: 1,
              key: 'Bar',
              routeName: 'Bar',
              routes: [
                { key: 'Zoo', routeName: 'Zoo' },
                { key: 'Zap', routeName: 'Zap' },
              ],
            },
          ],
        },
        { key: 'Gah', routeName: 'Gah' },
      ],
    });
    const state3 = router.getStateForAction(
      { type: NavigationActions.NAVIGATE, routeName: 'Zap' },
      state2
    );
    expect(state3).toEqual(null);
    const state4 = router.getStateForAction({
      type: NavigationActions.NAVIGATE,
      routeName: 'Foo',
      action: {
        type: NavigationActions.NAVIGATE,
        routeName: 'Bar',
        action: { type: NavigationActions.NAVIGATE, routeName: 'Zap' },
      },
    });
    expect(state4).toEqual({
      index: 0,
      routes: [
        {
          index: 1,
          key: 'Foo',
          routeName: 'Foo',
          routes: [
            {
              index: 0,
              key: 'Foo',
              routeName: 'Foo',
              routes: [
                { key: 'Boo', routeName: 'Boo' },
                { key: 'Baz', routeName: 'Baz' },
              ],
            },
            {
              index: 1,
              key: 'Bar',
              routeName: 'Bar',
              routes: [
                { key: 'Zoo', routeName: 'Zoo' },
                { key: 'Zap', routeName: 'Zap' },
              ],
            },
          ],
        },
        { key: 'Gah', routeName: 'Gah' },
      ],
    });
  });

  test('Handles path configuration', () => {
    const ScreenA = () => <div />;
    const ScreenB = () => <div />;
    const router = TabRouter({
      Foo: {
        path: 'f',
        screen: ScreenA,
      },
      Bar: {
        path: 'b',
        screen: ScreenB,
      },
    });
    const params = { foo: '42' };
    const action = router.getActionForPathAndParams('b/anything', params);
    const expectedAction = {
      params,
      routeName: 'Bar',
      type: NavigationActions.NAVIGATE,
    };
    expect(action).toEqual(expectedAction);

    const state = router.getStateForAction({ type: NavigationActions.INIT });
    const expectedState = {
      index: 0,
      routes: [
        { key: 'Foo', routeName: 'Foo' },
        { key: 'Bar', routeName: 'Bar' },
      ],
    };
    expect(state).toEqual(expectedState);
    const state2 = router.getStateForAction(expectedAction, state);
    const expectedState2 = {
      index: 1,
      routes: [
        { key: 'Foo', routeName: 'Foo' },
        { key: 'Bar', routeName: 'Bar', params },
      ],
    };
    expect(state2).toEqual(expectedState2);
    expect(router.getComponentForState(expectedState)).toEqual(ScreenA);
    expect(router.getComponentForState(expectedState2)).toEqual(ScreenB);
    expect(router.getPathAndParamsForState(expectedState).path).toEqual('f');
    expect(router.getPathAndParamsForState(expectedState2).path).toEqual('b');
  });

  test('Handles default configuration', () => {
    const ScreenA = () => <div />;
    const ScreenB = () => <div />;
    const router = TabRouter({
      Foo: {
        path: '',
        screen: ScreenA,
      },
      Bar: {
        path: 'b',
        screen: ScreenB,
      },
    });
    const action = router.getActionForPathAndParams('', { foo: '42' });
    expect(action).toEqual({
      params: {
        foo: '42',
      },
      routeName: 'Foo',
      type: NavigationActions.NAVIGATE,
    });
  });

  test('Gets deep path', () => {
    const ScreenA = () => <div />;
    const ScreenB = () => <div />;
    ScreenA.router = TabRouter({
      Boo: { screen: ScreenB },
      Baz: { screen: ScreenB },
    });
    const router = TabRouter({
      Foo: {
        path: 'f',
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
          routes: [
            { key: 'Boo', routeName: 'Boo' },
            { key: 'Baz', routeName: 'Baz' },
          ],
        },
        { key: 'Bar', routeName: 'Bar' },
      ],
    };
    const { path } = router.getPathAndParamsForState(state);
    expect(path).toEqual('f/Baz');
  });

  test('Maps old actions (uses "getStateForAction returns null when navigating to same tab" test)', () => {
    global.console.warn = jest.fn();
    const router = TabRouter(
      { Foo: BareLeafRouteConfig, Bar: BareLeafRouteConfig },
      { initialRouteName: 'Bar' }
    );
    const initAction = NavigationActions.mapDeprecatedActionAndWarn({
      type: 'Init',
    });
    /* $FlowFixMe: these are for deprecated action names */
    const state = router.getStateForAction(initAction);
    const navigateAction = NavigationActions.mapDeprecatedActionAndWarn({
      type: 'Navigate',
      routeName: 'Bar',
    });
    /* $FlowFixMe: these are for deprecated action names */
    const state2 = router.getStateForAction(navigateAction, state);
    expect(state2).toEqual(null);
    expect(console.warn).toBeCalledWith(
      expect.stringContaining(
        "The action type 'Init' has been renamed to 'Navigation/INIT'"
      )
    );
  });

  test('Can navigate to other tab (no router) with params', () => {
    const ScreenA = () => <div />;
    const ScreenB = () => <div />;

    const router = TabRouter({
      a: { screen: ScreenA },
      b: { screen: ScreenB },
    });

    const state0 = router.getStateForAction(INIT_ACTION);

    expect(state0).toEqual({
      index: 0,
      routes: [{ key: 'a', routeName: 'a' }, { key: 'b', routeName: 'b' }],
    });

    const params = { key: 'value' };

    const state1 = router.getStateForAction(
      { type: NavigationActions.NAVIGATE, routeName: 'b', params },
      state0
    );

    expect(state1).toEqual({
      index: 1,
      routes: [
        { key: 'a', routeName: 'a' },
        { key: 'b', routeName: 'b', params },
      ],
    });
  });

  test('Inner actions are only unpacked if the current tab matches', () => {
    const PlainScreen = () => <div />;
    const ScreenA = () => <div />;
    const ScreenB = () => <div />;
    ScreenB.router = StackRouter({
      Baz: { screen: PlainScreen },
      Zoo: { screen: PlainScreen },
    });
    ScreenA.router = StackRouter({
      Bar: { screen: PlainScreen },
      Boo: { screen: ScreenB },
    });
    const router = TabRouter({
      Foo: { screen: ScreenA },
    });
    const screenApreState = {
      index: 0,
      key: 'Init',
      routeName: 'Foo',
      routes: [{ key: 'Init', routeName: 'Bar' }],
    };
    const preState = {
      index: 0,
      routes: [screenApreState],
    };

    type ComparableRoute = {
      routeName?: string,
      routes?: Array<ComparableRoute>,
    };

    type RouteOrState =
      | NavigationRoute
      | NavigationState
      | (NavigationRoute & NavigationState);

    const comparable = (state: RouteOrState): ComparableRoute => {
      let result = {};
      if (typeof state.routeName === 'string') {
        result = { ...result, routeName: state.routeName };
      }
      if (state.routes instanceof Array) {
        result = {
          ...result,
          routes: state.routes.map(comparable),
        };
      }
      return result;
    };

    const action = NavigationActions.navigate({
      routeName: 'Boo',
      action: NavigationActions.navigate({ routeName: 'Zoo' }),
    });

    const expectedState = ScreenA.router.getStateForAction(
      action,
      screenApreState
    );
    const state = router.getStateForAction(action, preState);
    const innerState = state ? state.routes[0] : state;

    expect(expectedState && comparable(expectedState)).toEqual(
      innerState && comparable(innerState)
    );
  });
});
