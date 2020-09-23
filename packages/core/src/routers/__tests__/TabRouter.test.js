/* eslint react/display-name:0 */

import * as React from 'react';
import TabRouter from '../TabRouter';

import * as NavigationActions from '../../NavigationActions';

const INIT_ACTION = { type: NavigationActions.INIT };

const BareLeafRouteConfig = {
  screen: () => <div />,
};

describe('TabRouter', () => {
  it('Handles basic tab logic', () => {
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

  it('Handles getScreen', () => {
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

  it('Can set the initial tab', () => {
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

  it('Can set the initial params', () => {
    const router = TabRouter(
      { Foo: BareLeafRouteConfig, Bar: BareLeafRouteConfig },
      { initialRouteName: 'Bar', initialRouteParams: { name: 'Qux' } }
    );
    const state = router.getStateForAction({ type: NavigationActions.INIT });
    expect(state).toEqual({
      index: 1,
      routes: [
        { key: 'Foo', routeName: 'Foo' },
        { key: 'Bar', routeName: 'Bar', params: { name: 'Qux' } },
      ],
    });
  });

  it('Handles the SetParams action', () => {
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

  it('Handles the SetParams action for inactive routes', () => {
    const router = TabRouter(
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

  it('getStateForAction returns null when navigating to same tab', () => {
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

  it('getStateForAction returns initial navigate', () => {
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

  it('Handles nested tabs and nested actions', () => {
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
    const action = router.getActionForPathAndParams('Baz/Bar', { foo: '42' });
    const navAction = {
      type: NavigationActions.NAVIGATE,
      routeName: 'Baz',
      params: { foo: '42' },
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
          params: { foo: '42' },
          routes: [
            {
              key: 'Foo',
              routeName: 'Foo',
            },
            {
              key: 'Bar',
              routeName: 'Bar',
              params: {
                foo: '42',
              },
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

  it('Handles passing params to nested tabs', () => {
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

  it('Handles initial deep linking into nested tabs', () => {
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

  it('Handles linking across of deeply nested tabs', () => {
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
      Fee: { screen: ChildNavigator0 },
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
              key: 'Fee',
              routeName: 'Fee',

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
              key: 'Fee',
              routeName: 'Fee',

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
        action: {
          type: NavigationActions.NAVIGATE,
          routeName: 'Zap',
        },
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
              key: 'Fee',
              routeName: 'Fee',

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

  it('Handles path configuration', () => {
    const ScreenA = () => <div />;
    const ScreenB = () => <div />;
    const router = TabRouter({
      Foo: {
        path: 'f',
        screen: ScreenA,
      },
      Bar: {
        path: 'b/:great',
        screen: ScreenB,
      },
    });
    const params = { foo: '42' };
    const action = router.getActionForPathAndParams('b/anything', params);
    const expectedAction = {
      params: {
        foo: '42',
        great: 'anything',
      },
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
        { key: 'Foo', routeName: 'Foo', params: undefined },
        {
          key: 'Bar',
          routeName: 'Bar',
          params: { foo: '42', great: 'anything' },
        },
      ],
    };
    expect(state2).toEqual(expectedState2);
    expect(router.getComponentForState(expectedState)).toEqual(ScreenA);
    expect(router.getComponentForState(expectedState2)).toEqual(ScreenB);
    expect(router.getPathAndParamsForState(expectedState).path).toEqual('f');
    expect(router.getPathAndParamsForState(expectedState2).path).toEqual(
      'b/anything'
    );
  });

  it('Handles default configuration', () => {
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

  it('Gets deep path', () => {
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

  it('Can navigate to other tab (no router) with params', () => {
    const ScreenA = () => <div />;
    const ScreenB = () => <div />;

    const router = TabRouter({
      a: { screen: ScreenA },
      b: { screen: ScreenB },
    });

    const state0 = router.getStateForAction(INIT_ACTION);

    expect(state0).toEqual({
      index: 0,

      routes: [
        { key: 'a', routeName: 'a' },
        { key: 'b', routeName: 'b' },
      ],
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

  it('Back actions are not propagated to inactive children', () => {
    const ScreenA = () => <div />;
    const ScreenB = () => <div />;
    const ScreenC = () => <div />;
    const InnerNavigator = () => <div />;
    InnerNavigator.router = TabRouter({
      a: { screen: ScreenA },
      b: { screen: ScreenB },
    });

    const router = TabRouter(
      {
        inner: { screen: InnerNavigator },
        c: { screen: ScreenC },
      },
      {
        backBehavior: 'none',
      }
    );

    const state0 = router.getStateForAction(INIT_ACTION);

    const state1 = router.getStateForAction(
      { type: NavigationActions.NAVIGATE, routeName: 'b' },
      state0
    );

    const state2 = router.getStateForAction(
      { type: NavigationActions.NAVIGATE, routeName: 'c' },
      state1
    );

    const state3 = router.getStateForAction(
      { type: NavigationActions.BACK },
      state2
    );

    expect(state3).toEqual(state2);
  });

  it('Back behavior initialRoute works', () => {
    const ScreenA = () => <div />;
    const ScreenB = () => <div />;
    const router = TabRouter({
      a: { screen: ScreenA },
      b: { screen: ScreenB },
    });

    const state0 = router.getStateForAction(INIT_ACTION);

    const state1 = router.getStateForAction(
      { type: NavigationActions.NAVIGATE, routeName: 'b' },
      state0
    );

    const state2 = router.getStateForAction(
      { type: NavigationActions.BACK },
      state1
    );

    expect(state2).toEqual(state0);
  });

  it('Inner actions are only unpacked if the current tab matches', () => {
    const PlainScreen = () => <div />;
    const ScreenA = () => <div />;
    const ScreenB = () => <div />;
    ScreenB.router = TabRouter({
      Baz: { screen: PlainScreen },
      Zoo: { screen: PlainScreen },
    });
    ScreenA.router = TabRouter({
      Bar: { screen: PlainScreen },
      Boo: { screen: ScreenB },
    });
    const router = TabRouter({
      Foo: { screen: ScreenA },
    });
    const screenApreState = {
      index: 0,
      key: 'Foo',

      routeName: 'Foo',
      routes: [{ key: 'Bar', routeName: 'Bar' }],
    };
    const preState = {
      index: 0,

      routes: [screenApreState],
    };

    const comparable = (state) => {
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

    expect(innerState.routes[1].index).toEqual(1);
    expect(expectedState && comparable(expectedState)).toEqual(
      innerState && comparable(innerState)
    );

    const noMatchAction = NavigationActions.navigate({
      routeName: 'Qux',
      action: NavigationActions.navigate({ routeName: 'Zoo' }),
    });
    const expectedState2 = ScreenA.router.getStateForAction(
      noMatchAction,
      screenApreState
    );
    const state2 = router.getStateForAction(noMatchAction, preState);
    const innerState2 = state2 ? state2.routes[0] : state2;

    expect(innerState2.routes[1].index).toEqual(0);
    expect(expectedState2 && comparable(expectedState2)).toEqual(
      innerState2 && comparable(innerState2)
    );
  });
});
