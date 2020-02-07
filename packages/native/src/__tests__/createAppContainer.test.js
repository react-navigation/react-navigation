import React from 'react';
import { View } from 'react-native';

import renderer from 'react-test-renderer';

import {
  NavigationActions,
  createNavigator,
  StackRouter,
  SwitchView,
} from '@react-navigation/core';

import createAppContainer, {
  _TESTING_ONLY_reset_container_count,
} from '../createAppContainer';

function createStackNavigator(routeConfigMap, stackConfig = {}) {
  const router = StackRouter(routeConfigMap, stackConfig);
  return createAppContainer(createNavigator(SwitchView, router, stackConfig));
}

describe('NavigationContainer', () => {
  jest.useFakeTimers();
  beforeEach(() => {
    _TESTING_ONLY_reset_container_count();
  });

  const FooScreen = () => <div />;
  const BarScreen = () => <div />;
  const BazScreen = () => <div />;
  const CarScreen = () => <div />;
  const DogScreen = () => <div />;
  const ElkScreen = () => <div />;
  const Stack = createStackNavigator(
    {
      foo: {
        screen: FooScreen,
      },
      bar: {
        screen: BarScreen,
      },
      baz: {
        screen: BazScreen,
      },
      car: {
        screen: CarScreen,
      },
      dog: {
        screen: DogScreen,
      },
      elk: {
        screen: ElkScreen,
      },
    },
    {
      initialRouteName: 'foo',
    }
  );
  const NavigationContainer = createAppContainer(Stack);

  describe('state.nav', () => {
    it("should be preloaded with the router's initial state", () => {
      const navigationContainer = renderer
        .create(<NavigationContainer />)
        .getInstance();
      expect(navigationContainer.state.nav).toMatchObject({ index: 0 });
      expect(navigationContainer.state.nav.routes).toBeInstanceOf(Array);
      expect(navigationContainer.state.nav.routes.length).toBe(1);
      expect(navigationContainer.state.nav.routes[0]).toMatchObject({
        routeName: 'foo',
      });
    });
  });

  describe('dispatch', () => {
    it('returns true when given a valid action', () => {
      const navigationContainer = renderer
        .create(<NavigationContainer />)
        .getInstance();
      jest.runOnlyPendingTimers();
      expect(
        navigationContainer.dispatch(
          NavigationActions.navigate({ routeName: 'bar' })
        )
      ).toEqual(true);
    });

    it('returns false when given an invalid action', () => {
      const navigationContainer = renderer
        .create(<NavigationContainer />)
        .getInstance();
      jest.runOnlyPendingTimers();
      expect(navigationContainer.dispatch(NavigationActions.back())).toEqual(
        false
      );
    });

    it('updates state.nav with an action by the next tick', () => {
      const navigationContainer = renderer
        .create(<NavigationContainer />)
        .getInstance();

      expect(
        navigationContainer.dispatch(
          NavigationActions.navigate({ routeName: 'bar' })
        )
      ).toEqual(true);

      // Fake the passing of a tick
      jest.runOnlyPendingTimers();

      expect(navigationContainer.state.nav).toMatchObject({
        index: 1,
        routes: [{ routeName: 'foo' }, { routeName: 'bar' }],
      });
    });

    it('does not discard actions when called twice in one tick', () => {
      const navigationContainer = renderer
        .create(<NavigationContainer />)
        .getInstance();
      // const initialState = JSON.parse(
      //   JSON.stringify(navigationContainer.state.nav)
      // );

      // First dispatch
      expect(
        navigationContainer.dispatch(
          NavigationActions.navigate({ routeName: 'bar' })
        )
      ).toEqual(true);

      // Make sure that the test runner has NOT synchronously applied setState before the tick
      // expect(navigationContainer.state.nav).toMatchObject(initialState);

      // Second dispatch
      expect(
        navigationContainer.dispatch(
          NavigationActions.navigate({ routeName: 'baz' })
        )
      ).toEqual(true);

      // Fake the passing of a tick
      jest.runOnlyPendingTimers();

      expect(navigationContainer.state.nav).toMatchObject({
        index: 2,
        routes: [
          { routeName: 'foo' },
          { routeName: 'bar' },
          { routeName: 'baz' },
        ],
      });
    });

    it('does not discard actions when called more than 2 times in one tick', () => {
      const navigationContainer = renderer
        .create(<NavigationContainer />)
        .getInstance();
      // const initialState = JSON.parse(
      //   JSON.stringify(navigationContainer.state.nav)
      // );

      // First dispatch
      expect(
        navigationContainer.dispatch(
          NavigationActions.navigate({ routeName: 'bar' })
        )
      ).toEqual(true);

      // Make sure that the test runner has NOT synchronously applied setState before the tick
      // expect(navigationContainer.state.nav).toMatchObject(initialState);

      // Second dispatch
      expect(
        navigationContainer.dispatch(
          NavigationActions.navigate({ routeName: 'baz' })
        )
      ).toEqual(true);

      // Third dispatch
      expect(
        navigationContainer.dispatch(
          NavigationActions.navigate({ routeName: 'car' })
        )
      ).toEqual(true);

      // Fourth dispatch
      expect(
        navigationContainer.dispatch(
          NavigationActions.navigate({ routeName: 'dog' })
        )
      ).toEqual(true);

      // Fifth dispatch
      expect(
        navigationContainer.dispatch(
          NavigationActions.navigate({ routeName: 'elk' })
        )
      ).toEqual(true);

      // Fake the passing of a tick
      jest.runOnlyPendingTimers();

      expect(navigationContainer.state.nav).toMatchObject({
        index: 5,
        routes: [
          { routeName: 'foo' },
          { routeName: 'bar' },
          { routeName: 'baz' },
          { routeName: 'car' },
          { routeName: 'dog' },
          { routeName: 'elk' },
        ],
      });
    });
  });

  describe('warnings', () => {
    function spyConsole() {
      let spy = {};

      beforeEach(() => {
        spy.console = jest.spyOn(console, 'warn').mockImplementation(() => {});
      });

      afterEach(() => {
        spy.console.mockRestore();
      });

      return spy;
    }

    describe('detached navigators', () => {
      beforeEach(() => {
        _TESTING_ONLY_reset_container_count();
      });

      let spy = spyConsole();

      it('warns when you render more than one container explicitly', () => {
        class BlankScreen extends React.Component {
          render() {
            return <View />;
          }
        }

        class RootScreen extends React.Component {
          render() {
            return (
              <View>
                <ChildNavigator />
              </View>
            );
          }
        }

        const ChildNavigator = createAppContainer(
          createStackNavigator({
            Child: BlankScreen,
          })
        );

        const RootStack = createAppContainer(
          createStackNavigator({
            Root: RootScreen,
          })
        );

        renderer.create(<RootStack />).toJSON();
        expect(spy).toMatchSnapshot();
      });
    });
  });

  // https://github.com/facebook/jest/issues/2157#issuecomment-279171856
  const flushPromises = () => new Promise(resolve => setImmediate(resolve));

  describe('state persistence', () => {
    async function createPersistenceEnabledContainer(
      loadNavigationState,
      persistNavigationState = jest.fn()
    ) {
      const navContainer = renderer
        .create(
          <NavigationContainer
            persistNavigationState={persistNavigationState}
            loadNavigationState={loadNavigationState}
          />
        )
        .getInstance();

      // wait for loadNavigationState() to resolve
      await flushPromises();
      return navContainer;
    }

    it('loadNavigationState is called upon mount and persistNavigationState is called on a nav state change', async () => {
      const persistNavigationState = jest.fn();
      const loadNavigationState = jest.fn().mockResolvedValue({
        index: 1,
        routes: [{ routeName: 'foo' }, { routeName: 'bar' }],
      });

      const navigationContainer = await createPersistenceEnabledContainer(
        loadNavigationState,
        persistNavigationState
      );
      expect(loadNavigationState).toHaveBeenCalled();

      // wait for setState done
      jest.runOnlyPendingTimers();

      navigationContainer.dispatch(
        NavigationActions.navigate({ routeName: 'foo' })
      );
      jest.runOnlyPendingTimers();
      expect(persistNavigationState).toHaveBeenCalledWith({
        index: 0,
        isTransitioning: true,
        routes: [{ routeName: 'foo' }],
      });
    });

    it('when persistNavigationState rejects, a console warning is shown', async () => {
      const consoleSpy = jest.spyOn(console, 'warn');
      const persistNavigationState = jest
        .fn()
        .mockRejectedValue(new Error('serialization failed'));
      const loadNavigationState = jest.fn().mockResolvedValue(null);

      const navigationContainer = await createPersistenceEnabledContainer(
        loadNavigationState,
        persistNavigationState
      );

      // wait for setState done
      jest.runOnlyPendingTimers();

      navigationContainer.dispatch(
        NavigationActions.navigate({ routeName: 'baz' })
      );
      jest.runOnlyPendingTimers();
      await flushPromises();

      expect(consoleSpy).toHaveBeenCalledWith(expect.any(String));
    });

    it('when loadNavigationState rejects, navigator ignores the rejection and starts from the initial state', async () => {
      const loadNavigationState = jest
        .fn()
        .mockRejectedValue(new Error('deserialization failed'));

      const navigationContainer = await createPersistenceEnabledContainer(
        loadNavigationState
      );

      expect(loadNavigationState).toHaveBeenCalled();

      // wait for setState done
      jest.runOnlyPendingTimers();

      expect(navigationContainer.state.nav).toMatchObject({
        index: 0,
        isTransitioning: false,
        key: 'StackRouterRoot',
        routes: [{ routeName: 'foo' }],
      });
    });

    // this test is skipped because the componentDidCatch recovery logic does not work as intended
    // eslint-disable-next-line jest/no-disabled-tests
    it.skip('when loadNavigationState resolves with an invalid nav state object, navigator starts from the initial state', async () => {
      const loadNavigationState = jest.fn().mockResolvedValue({
        index: 20,
        routes: [{ routeName: 'foo' }, { routeName: 'bar' }],
      });

      const navigationContainer = await createPersistenceEnabledContainer(
        loadNavigationState
      );

      expect(loadNavigationState).toHaveBeenCalled();

      // wait for setState done
      jest.runOnlyPendingTimers();

      expect(navigationContainer.state.nav).toMatchObject({
        index: 0,
        isTransitioning: false,
        key: 'StackRouterRoot',
        routes: [{ routeName: 'foo' }],
      });
    });

    it('throws when persistNavigationState and loadNavigationState do not pass validation', () => {
      expect(() =>
        renderer.create(
          <NavigationContainer persistNavigationState={jest.fn()} />
        )
      ).toThrow(
        'both persistNavigationState and loadNavigationState must either be undefined, or be functions'
      );
    });
  });
});
