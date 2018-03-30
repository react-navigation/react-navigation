/* eslint react/no-multi-comp:0 */

import React from 'react';

import StackRouter from '../StackRouter';
import TabRouter from '../TabRouter';

import NavigationActions from '../../NavigationActions';
import { _TESTING_ONLY_normalize_keys } from '../KeyGenerator';

beforeEach(() => {
  _TESTING_ONLY_normalize_keys();
});

const ROUTERS = {
  TabRouter,
  StackRouter,
};

const dummyEventSubscriber = (name, handler) => ({
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
  });
});

// Creates a StackRouter with a nested TabRouter
const createTestRouters = stackRouterConfig => {
  const BarView = () => <div />;
  const FooTabNavigator = () => <div />;
  const TestTabRouter = TabRouter({
    Zap: { screen: BarView },
    Zoo: { screen: BarView },
  });
  FooTabNavigator.router = TestTabRouter;
  const TestStackRouter = StackRouter(
    {
      Foo: {
        screen: FooTabNavigator,
      },
      Bar: {
        screen: BarView,
      },
    },
    {
      ...stackRouterConfig,
    }
  );
  return {
    TestStackRouter,
    TestTabRouter,
  };
};

describe('StackRouter with nested TabRouter: Handling of no-op actions', () => {
  const NAV_NO_MATCH = {
    type: NavigationActions.NAVIGATE,
    routeName: 'Qux', // 'Qux' doesn't exist in route tree
  };
  const NAV_TO_ZAP = {
    type: NavigationActions.NAVIGATE,
    routeName: 'Zap',
  };

  test('Child TabRouter handles forwarded no-op actions', () => {
    const { TestTabRouter } = createTestRouters();

    const tabState1 = TestTabRouter.getStateForAction({
      type: NavigationActions.INIT,
    });
    const tabState2 = TestTabRouter.getStateForAction(NAV_NO_MATCH);
    expect(tabState1).toEqual(tabState2);

    const tabState3 = TestTabRouter.getStateForAction(NAV_TO_ZAP);
    expect(tabState2).toEqual(tabState3);
  });

  test('Parent StackRouter handles no-op actions', () => {
    const { TestStackRouter } = createTestRouters();
    const stackState1 = TestStackRouter.getStateForAction({
      type: NavigationActions.INIT,
    });
    expect(stackState1.routes[0].key).toEqual('id-0');

    const stackState2 = TestStackRouter.getStateForAction(NAV_NO_MATCH);
    expect(stackState2.routes[0].key).toEqual('id-1');

    stackState1.routes[0].key = stackState2.routes[0].key;
    expect(stackState1).toEqual(stackState2);

    const stackState3 = TestStackRouter.getStateForAction(
      NAV_TO_ZAP,
      stackState2
    );
    expect(stackState2).toEqual(stackState3);
  });
});

describe('StackRouter with nested TabRouter: Handling of deep actions', () => {
  const NAV_TO_ZOO = {
    type: NavigationActions.NAVIGATE,
    routeName: 'Zoo',
  };

  test('Child TabRouter handles the nested action', () => {
    const { TestTabRouter } = createTestRouters({ initialRouteName: 'Bar' });
    const tabState = TestTabRouter.getStateForAction(NAV_TO_ZOO);
    expect(tabState && tabState.index).toEqual(1);
  });

  test('Parent StackRouter handles deep actions', () => {
    const { TestStackRouter } = createTestRouters({ initialRouteName: 'Bar' });
    const stackState1 = TestStackRouter.getStateForAction({
      type: NavigationActions.INIT,
    });
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
    expect(stackState1).toEqual(expectedState);

    const stackState2 = TestStackRouter.getStateForAction(
      {
        type: NavigationActions.NAVIGATE,
        routeName: 'Foo',
        immediate: true,
        action: NAV_TO_ZOO,
      },
      stackState1
    );
    expect(stackState2 && stackState2.index).toEqual(1);
    expect(stackState2 && stackState2.routes[1].index).toEqual(1);
  });
});

describe('StackRouter with nested TabRouter: Handling of lazily-evaluated getScreen', () => {
  const NAV_NO_MATCH = {
    type: NavigationActions.NAVIGATE,
    immediate: true,
    routeName: 'Qux',
  };
  const NAV_TO_ZAP = {
    type: NavigationActions.NAVIGATE,
    immediate: true,
    routeName: 'Zap',
  };
  test('Child TabRouter handles forwarded nav actions', () => {
    const { TestTabRouter } = createTestRouters();
    const tabState1 = TestTabRouter.getStateForAction({
      type: NavigationActions.INIT,
    });
    const tabState2 = TestTabRouter.getStateForAction(NAV_NO_MATCH);
    expect(tabState1).toEqual(tabState2);
    const tabState3 = TestTabRouter.getStateForAction(NAV_TO_ZAP);
    expect(tabState2).toEqual(tabState3);
  });

  test('Parent StackRouter supports lazily-evaluated getScreen', () => {
    const BarView = () => <div />;
    const FooTabNavigator = () => <div />;
    FooTabNavigator.router = TabRouter({
      Zap: { screen: BarView },
      Zoo: { screen: BarView },
    });
    const TestStackRouter = StackRouter({
      Foo: {
        screen: FooTabNavigator,
      },
      Bar: {
        getScreen: () => BarView,
      },
    });
    const stackState1 = TestStackRouter.getStateForAction({
      type: NavigationActions.INIT,
    });
    const stackState2 = TestStackRouter.getStateForAction({
      type: NavigationActions.NAVIGATE,
      immediate: true,
      routeName: 'Qux',
    });
    expect(stackState1.routes[0].key).toEqual('id-0');
    expect(stackState2.routes[0].key).toEqual('id-1');
    stackState1.routes[0].key = stackState2.routes[0].key;
    expect(stackState1).toEqual(stackState2);
    const stackState3 = TestStackRouter.getStateForAction(
      NAV_TO_ZAP,
      stackState2
    );
    expect(stackState2).toEqual(stackState3);
  });
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
