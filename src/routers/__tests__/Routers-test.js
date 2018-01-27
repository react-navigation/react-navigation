/* eslint react/no-multi-comp:0 */

import React from 'react';

import StackRouter from '../StackRouter';
import TabRouter from '../TabRouter';

import NavigationActions from '../../NavigationActions';
import addNavigationHelpers from '../../addNavigationHelpers';

const ROUTERS = {
  TabRouter,
  StackRouter,
};

const dummyEventSubscriber = (name: string, handler: (*) => void) => ({
  remove: () => {},
});

Object.keys(ROUTERS).forEach(routerName => {
  const Router = ROUTERS[routerName];

  describe(`General router features - ${routerName}`, () => {
    test('title is configurable using navigationOptions and getScreenOptions', () => {
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
          addNavigationHelpers({
            state: routes[0],
            dispatch: () => false,
            addListener: dummyEventSubscriber,
          }),
          {}
        ).title
      ).toEqual(undefined);
      expect(
        router.getScreenOptions(
          addNavigationHelpers({
            state: routes[1],
            dispatch: () => false,
            addListener: dummyEventSubscriber,
          }),
          {}
        ).title
      ).toEqual('BarTitle');
      expect(
        router.getScreenOptions(
          addNavigationHelpers({
            state: routes[2],
            dispatch: () => false,
            addListener: dummyEventSubscriber,
          }),
          {}
        ).title
      ).toEqual('Baz-123');
    });
  });
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
  expect(state1.routes[0].key).toEqual('Init-id-0-0');
  expect(state2.routes[0].key).toEqual('Init-id-0-1');
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
    routes: [
      {
        key: 'Init-id-0-2',
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
  expect(state1.routes[0].key).toEqual('Init-id-0-4');
  expect(state2.routes[0].key).toEqual('Init-id-0-5');
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
