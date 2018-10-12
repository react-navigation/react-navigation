/* eslint react/no-multi-comp:0, react/display-name:0 */

import React from 'react';

import StackRouter from '../StackRouter';
import TabRouter from '../TabRouter';
import SwitchRouter from '../SwitchRouter';

import NavigationActions from '../../NavigationActions';
import { _TESTING_ONLY_normalize_keys } from '../KeyGenerator';

beforeEach(() => {
  _TESTING_ONLY_normalize_keys();
});

const ROUTERS = {
  TabRouter,
  StackRouter,
  SwitchRouter,
};

const dummyEventSubscriber = () => ({
  remove: () => {},
});

Object.keys(ROUTERS).forEach(routerName => {
  const Router = ROUTERS[routerName];

  describe(`General router features - ${routerName}`, () => {
    test(`title is configurable using navigationOptions and getScreenOptions - ${routerName}`, () => {
      class FooView extends React.Component {
        render() {
          return <div />;
        }
      }
      class BarView extends React.Component {
        render() {
          return <div />;
        }
        static navigationOptions = { title: 'BarTitle' };
      }
      class BazView extends React.Component {
        render() {
          return <div />;
        }
        static navigationOptions = ({ navigation }) => ({
          title: `Baz-${navigation.state.params.id}`,
        });
      }
      const router = Router({
        Foo: { screen: FooView },
        Bar: { screen: BarView },
        Baz: { screen: BazView },
      });
      const routes = [
        { key: 'A', routeName: 'Foo' },
        { key: 'B', routeName: 'Bar' },
        { key: 'A', routeName: 'Baz', params: { id: '123' } },
      ];
      expect(
        router.getScreenOptions(
          {
            state: routes[0],
            dispatch: () => false,
            addListener: dummyEventSubscriber,
          },
          {}
        ).title
      ).toEqual(undefined);
      expect(
        router.getScreenOptions(
          {
            state: routes[1],
            dispatch: () => false,
            addListener: dummyEventSubscriber,
          },
          {}
        ).title
      ).toEqual('BarTitle');
      expect(
        router.getScreenOptions(
          {
            state: routes[2],
            dispatch: () => false,
            addListener: dummyEventSubscriber,
          },
          {}
        ).title
      ).toEqual('Baz-123');
    });

    test(`set params works in ${routerName}`, () => {
      class FooView extends React.Component {
        render() {
          return <div />;
        }
      }
      const router = Router({
        Foo: { screen: FooView },
        Bar: { screen: FooView },
      });

      const initState = router.getStateForAction(NavigationActions.init());
      const initRoute = initState.routes[initState.index];
      expect(initRoute.params).toEqual(undefined);

      const state0 = router.getStateForAction(
        NavigationActions.setParams({
          params: { foo: 42 },
          key: initRoute.key,
        }),
        initState
      );
      expect(state0.routes[state0.index].params.foo).toEqual(42);
    });
  });
});

test('Nested navigate behavior test', () => {
  const Leaf = () => <div />;

  const First = () => <div />;
  First.router = StackRouter({
    First1: Leaf,
    First2: Leaf,
  });

  const Second = () => <div />;
  Second.router = StackRouter({
    Second1: Leaf,
    Second2: Leaf,
  });

  const Main = () => <div />;
  Main.router = StackRouter({
    First,
    Second,
  });
  const TestRouter = SwitchRouter({
    Login: Leaf,
    Main,
  });

  const state1 = TestRouter.getStateForAction({ type: NavigationActions.INIT });

  const state2 = TestRouter.getStateForAction(
    { type: NavigationActions.NAVIGATE, routeName: 'First' },
    state1
  );
  expect(state2.index).toEqual(1);
  expect(state2.routes[1].index).toEqual(0);
  expect(state2.routes[1].routes[0].index).toEqual(0);

  const state3 = TestRouter.getStateForAction(
    { type: NavigationActions.NAVIGATE, routeName: 'Second2' },
    state2
  );
  expect(state3.index).toEqual(1);
  expect(state3.routes[1].index).toEqual(1); // second
  expect(state3.routes[1].routes[1].index).toEqual(1); //second.second2

  const state4 = TestRouter.getStateForAction(
    {
      type: NavigationActions.NAVIGATE,
      routeName: 'First',
      action: { type: NavigationActions.NAVIGATE, routeName: 'First2' },
    },
    state3,
    true
  );
  expect(state4.index).toEqual(1); // main
  expect(state4.routes[1].index).toEqual(0); // first
  expect(state4.routes[1].routes[0].index).toEqual(1); // first2

  const state5 = TestRouter.getStateForAction(
    {
      type: NavigationActions.NAVIGATE,
      routeName: 'First',
      action: { type: NavigationActions.NAVIGATE, routeName: 'First1' },
    },
    state3 // second.second2 is active on state3
  );
  expect(state5.index).toEqual(1); // main
  expect(state5.routes[1].index).toEqual(0); // first
  expect(state5.routes[1].routes[0].index).toEqual(0); // first.first1
});

test('Handles no-op actions with tabs within stack router', () => {
  const BarView = () => <div />;
  const FooTabNavigator = () => <div />;
  FooTabNavigator.router = TabRouter({
    Zap: { screen: BarView },
    Zoo: { screen: BarView },
  });
  const TestRouter = StackRouter({
    Foo: {
      screen: FooTabNavigator,
    },
    Bar: {
      screen: BarView,
    },
  });
  const state1 = TestRouter.getStateForAction({ type: NavigationActions.INIT });
  const state2 = TestRouter.getStateForAction({
    type: NavigationActions.NAVIGATE,
    routeName: 'Qux',
  });
  expect(state1.routes[0].key).toEqual('id-0');
  expect(state2.routes[0].key).toEqual('id-1');
  state1.routes[0].key = state2.routes[0].key;
  expect(state1).toEqual(state2);
  const state3 = TestRouter.getStateForAction(
    { type: NavigationActions.NAVIGATE, routeName: 'Zap' },
    state2
  );
  expect(state2).toEqual(state3);
});

test('Handles deep action', () => {
  const BarView = () => <div />;
  const FooTabNavigator = () => <div />;
  FooTabNavigator.router = TabRouter({
    Zap: { screen: BarView },
    Zoo: { screen: BarView },
  });
  const TestRouter = StackRouter({
    Bar: { screen: BarView },
    Foo: { screen: FooTabNavigator },
  });
  const state1 = TestRouter.getStateForAction({ type: NavigationActions.INIT });
  const expectedState = {
    index: 0,
    isTransitioning: false,
    key: 'StackRouterRoot',
    routes: [
      {
        key: 'id-0',
        routeName: 'Bar',
      },
    ],
  };
  expect(state1).toEqual(expectedState);
  const state2 = TestRouter.getStateForAction(
    {
      type: NavigationActions.NAVIGATE,
      routeName: 'Foo',
      immediate: true,
      action: { type: NavigationActions.NAVIGATE, routeName: 'Zoo' },
    },
    state1
  );
  expect(state2 && state2.index).toEqual(1);
  expect(state2 && state2.routes[1].index).toEqual(1);
});

test('Handles the navigate action with params', () => {
  const FooTabNavigator = () => <div />;
  FooTabNavigator.router = TabRouter({
    Baz: { screen: () => <div /> },
    Boo: { screen: () => <div /> },
  });

  const TestRouter = StackRouter({
    Foo: { screen: () => <div /> },
    Bar: { screen: FooTabNavigator },
  });
  const state = TestRouter.getStateForAction({ type: NavigationActions.INIT });
  const state2 = TestRouter.getStateForAction(
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

test('Handles the setParams action', () => {
  const FooTabNavigator = () => <div />;
  FooTabNavigator.router = TabRouter({
    Baz: { screen: () => <div /> },
  });
  const TestRouter = StackRouter({
    Foo: { screen: FooTabNavigator },
    Bar: { screen: () => <div /> },
  });
  const state = TestRouter.getStateForAction({ type: NavigationActions.INIT });
  const state2 = TestRouter.getStateForAction(
    {
      type: NavigationActions.SET_PARAMS,
      params: { name: 'foobar' },
      key: 'Baz',
    },
    state
  );
  expect(state2 && state2.index).toEqual(0);
  expect(state2 && state2.routes[0].routes).toEqual([
    {
      key: 'Baz',
      routeName: 'Baz',
      params: { name: 'foobar' },
    },
  ]);
});

test('Supports lazily-evaluated getScreen', () => {
  const BarView = () => <div />;
  const FooTabNavigator = () => <div />;
  FooTabNavigator.router = TabRouter({
    Zap: { screen: BarView },
    Zoo: { screen: BarView },
  });
  const TestRouter = StackRouter({
    Foo: {
      screen: FooTabNavigator,
    },
    Bar: {
      getScreen: () => BarView,
    },
  });
  const state1 = TestRouter.getStateForAction({ type: NavigationActions.INIT });
  const state2 = TestRouter.getStateForAction({
    type: NavigationActions.NAVIGATE,
    immediate: true,
    routeName: 'Qux',
  });
  expect(state1.routes[0].key).toEqual('id-0');
  expect(state2.routes[0].key).toEqual('id-1');
  state1.routes[0].key = state2.routes[0].key;
  expect(state1).toEqual(state2);
  const state3 = TestRouter.getStateForAction(
    {
      type: NavigationActions.NAVIGATE,
      immediate: true,
      routeName: 'Zap',
    },
    state2
  );
  expect(state2).toEqual(state3);
});

test('Does not switch tab index when TabRouter child handles COMPLETE_NAVIGATION or SET_PARAMS', () => {
  const FooStackNavigator = () => <div />;
  const BarView = () => <div />;
  FooStackNavigator.router = StackRouter({
    Foo: {
      screen: BarView,
    },
    Bar: {
      screen: BarView,
    },
  });

  const TestRouter = TabRouter({
    Zap: { screen: FooStackNavigator },
    Zoo: { screen: FooStackNavigator },
  });

  const state1 = TestRouter.getStateForAction({ type: NavigationActions.INIT });

  // Navigate to the second screen in the first tab
  const state2 = TestRouter.getStateForAction(
    {
      type: NavigationActions.NAVIGATE,
      routeName: 'Bar',
    },
    state1
  );

  // Switch tabs
  const state3 = TestRouter.getStateForAction(
    {
      type: NavigationActions.NAVIGATE,
      routeName: 'Zoo',
    },
    state2
  );

  const stateAfterCompleteTransition = TestRouter.getStateForAction(
    {
      type: NavigationActions.COMPLETE_TRANSITION,
      key: state2.routes[0].key,
    },
    state3
  );
  const stateAfterSetParams = TestRouter.getStateForAction(
    {
      type: NavigationActions.SET_PARAMS,
      key: state1.routes[0].routes[0].key,
      params: { key: 'value' },
    },
    state3
  );

  expect(stateAfterCompleteTransition.index).toEqual(1);
  expect(stateAfterSetParams.index).toEqual(1);
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
  const TestRouter = TabRouter({
    Foo: { screen: ScreenA },
  });
  const screenApreState = {
    index: 0,
    key: 'Init',
    isTransitioning: false,
    routeName: 'Foo',
    routes: [{ key: 'Init', routeName: 'Bar' }],
  };
  const preState = {
    index: 0,
    isTransitioning: false,
    routes: [screenApreState],
  };

  const comparable = state => {
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
  const state = TestRouter.getStateForAction(action, preState);
  const innerState = state ? state.routes[0] : state;

  expect(expectedState && comparable(expectedState)).toEqual(
    innerState && comparable(innerState)
  );
});
