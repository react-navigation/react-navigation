import React from 'react';
import { StyleSheet, View } from 'react-native';

import TestRenderer from 'react-test-renderer';

import NavigationActions from '../NavigationActions';
import createStackNavigator from '../navigators/createStackNavigator';
import { _TESTING_ONLY_reset_container_count } from '../createNavigationContainer';
import flushPromises from '../utils/flushPromises';

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
  const NavigationContainer = createStackNavigator(
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

  describe('state.nav', () => {
    it("should be preloaded with the router's initial state", async () => {
      const testRenderer = TestRenderer.create(<NavigationContainer />);
      const navigationContainer = testRenderer.getInstance();

      // the state only actually gets set asynchronously on componentDidMount
      // thus on the first render the component returns null (or the result of renderLoadingExperimental)
      expect(testRenderer.toJSON()).toEqual(null);
      // wait for the state to be set
      await flushPromises();

      expect(navigationContainer.state.nav).toMatchObject({ index: 0 });
      expect(navigationContainer.state.nav.routes).toBeInstanceOf(Array);
      expect(navigationContainer.state.nav.routes.length).toBe(1);
      expect(navigationContainer.state.nav.routes[0]).toMatchObject({
        routeName: 'foo',
      });
    });
  });

  describe('renderLoading', () => {
    it('renders loading when set', async () => {
      const renderLoadingExperimental = () => <renderLoading />;
      const testRenderer = TestRenderer.create(
        <NavigationContainer
          renderLoadingExperimental={renderLoadingExperimental}
        />
      );
      expect(testRenderer.toJSON()).toMatchSnapshot();
    });
    it('renders null when not set', async () => {
      const testRenderer = TestRenderer.create(<NavigationContainer />);
      expect(testRenderer.toJSON()).toMatchSnapshot();
    });
  });

  describe('dispatch', () => {
    it('returns true when given a valid action', async () => {
      const testRenderer = TestRenderer.create(<NavigationContainer />);
      const navigationContainer = testRenderer.getInstance();

      // the state only actually gets set asynchronously on componentDidMount
      // wait for the state to be set
      await flushPromises();

      jest.runOnlyPendingTimers();
      expect(
        navigationContainer.dispatch(
          NavigationActions.navigate({ routeName: 'bar' })
        )
      ).toEqual(true);
    });

    it('returns false when given an invalid action', async () => {
      const testRenderer = TestRenderer.create(<NavigationContainer />);
      const navigationContainer = testRenderer.getInstance();

      // the state only actually gets set asynchronously on componentDidMount
      // wait for the state to be set
      await flushPromises();

      jest.runOnlyPendingTimers();
      expect(navigationContainer.dispatch(NavigationActions.back())).toEqual(
        false
      );
    });

    it('updates state.nav with an action by the next tick', async () => {
      const testRenderer = TestRenderer.create(<NavigationContainer />);
      const navigationContainer = testRenderer.getInstance();

      // the state only actually gets set asynchronously on componentDidMount
      // wait for the state to be set
      await flushPromises();

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

    it('does not discard actions when called twice in one tick', async () => {
      const testRenderer = TestRenderer.create(<NavigationContainer />);
      const navigationContainer = testRenderer.getInstance();

      // the state only actually gets set asynchronously on componentDidMount
      // wait for the state to be set
      await flushPromises();

      const initialState = JSON.parse(
        JSON.stringify(navigationContainer.state.nav)
      );

      // First dispatch
      expect(
        navigationContainer.dispatch(
          NavigationActions.navigate({ routeName: 'bar' })
        )
      ).toEqual(true);

      // Make sure that the test runner has NOT synchronously applied setState before the tick
      expect(navigationContainer.state.nav).toMatchObject(initialState);

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

    it('does not discard actions when called more than 2 times in one tick', async () => {
      const testRenderer = TestRenderer.create(<NavigationContainer />);
      const navigationContainer = testRenderer.getInstance();

      // the state only actually gets set asynchronously on componentDidMount
      // wait for the state to be set
      await flushPromises();

      const initialState = JSON.parse(
        JSON.stringify(navigationContainer.state.nav)
      );

      // First dispatch
      expect(
        navigationContainer.dispatch(
          NavigationActions.navigate({ routeName: 'bar' })
        )
      ).toEqual(true);

      // Make sure that the test runner has NOT synchronously applied setState before the tick
      expect(navigationContainer.state.nav).toMatchObject(initialState);

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

      it('warns when you render more than one navigator explicitly', async () => {
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

        const ChildNavigator = createStackNavigator({
          Child: BlankScreen,
        });

        const RootStack = createStackNavigator({
          Root: RootScreen,
        });

        TestRenderer.create(<RootStack />);

        // the state only actually gets set asynchronously on componentDidMount
        // wait for the state to be set
        await flushPromises();

        expect(spy).toMatchSnapshot();
      });
    });
  });
});
