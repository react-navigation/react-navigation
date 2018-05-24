import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import TestRenderer from 'react-test-renderer';

import StackNavigator from '../createStackNavigator';
import withNavigation from '../../views/withNavigation';
import { _TESTING_ONLY_reset_container_count } from '../../createNavigationContainer';
import flushPromises from '../../utils/flushPromises';

const styles = StyleSheet.create({
  header: {
    opacity: 0.5,
  },
});

class HomeScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: `Welcome ${
      navigation.state.params ? navigation.state.params.user : 'anonymous'
    }`,
    gesturesEnabled: true,
    headerStyle: [{ backgroundColor: 'red' }, styles.header],
  });

  render() {
    return null;
  }
}

const routeConfig = {
  Home: {
    screen: HomeScreen,
  },
};

describe('StackNavigator', () => {
  beforeEach(() => {
    _TESTING_ONLY_reset_container_count();
  });

  it('renders successfully', async () => {
    const MyStackNavigator = StackNavigator(routeConfig);
    const testRenderer = TestRenderer.create(<MyStackNavigator />);

    // the state only actually gets set asynchronously on componentDidMount
    // thus on the first render the component returns null (or the result of renderLoadingExperimental)
    expect(testRenderer.toJSON()).toEqual(null);
    // wait for the state to be set
    await flushPromises();

    expect(testRenderer.toJSON()).toMatchSnapshot();
  });

  it('applies correct values when headerRight is present', async () => {
    const MyStackNavigator = StackNavigator({
      Home: {
        screen: HomeScreen,
        navigationOptions: {
          headerRight: <View />,
        },
      },
    });
    const testRenderer = TestRenderer.create(<MyStackNavigator />);

    // the state only actually gets set asynchronously on componentDidMount
    // thus on the first render the component returns null (or the result of renderLoadingExperimental)
    expect(testRenderer.toJSON()).toEqual(null);
    // wait for the state to be set
    await flushPromises();

    expect(testRenderer.toJSON()).toMatchSnapshot();
  });

  it('passes navigation to headerRight when wrapped in withNavigation', async () => {
    const spy = jest.fn();

    class TestComponent extends React.Component {
      render() {
        return <View>{this.props.onPress(this.props.navigation)}</View>;
      }
    }

    const TestComponentWithNavigation = withNavigation(TestComponent);

    class A extends React.Component {
      static navigationOptions = {
        headerRight: <TestComponentWithNavigation onPress={spy} />,
      };

      render() {
        return <View />;
      }
    }

    const Nav = StackNavigator({ A: { screen: A } });

    TestRenderer.create(<Nav />);

    // the state only actually gets set asynchronously on componentDidMount
    // wait for the state to be set
    await flushPromises();

    expect(spy).toBeCalledWith(
      expect.objectContaining({
        navigate: expect.any(Function),
        addListener: expect.any(Function),
      })
    );
  });
});
