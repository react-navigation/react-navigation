import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import renderer from 'react-test-renderer';

import StackNavigator from '../createContainedStackNavigator';
import withNavigation from '../../views/withNavigation';
import { _TESTING_ONLY_reset_container_count } from '../../createNavigationContainer';

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

  it('renders successfully', () => {
    const MyStackNavigator = StackNavigator(routeConfig);
    const rendered = renderer.create(<MyStackNavigator />).toJSON();

    expect(rendered).toMatchSnapshot();
  });

  it('applies correct values when headerRight is present', () => {
    const MyStackNavigator = StackNavigator({
      Home: {
        screen: HomeScreen,
        navigationOptions: {
          headerRight: <View />,
        },
      },
    });
    const rendered = renderer.create(<MyStackNavigator />).toJSON();

    expect(rendered).toMatchSnapshot();
  });

  it('passes navigation to headerRight when wrapped in withNavigation', () => {
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

    renderer.create(<Nav />);

    expect(spy).toBeCalledWith(
      expect.objectContaining({
        navigate: expect.any(Function),
        addListener: expect.any(Function),
      })
    );
  });
});
