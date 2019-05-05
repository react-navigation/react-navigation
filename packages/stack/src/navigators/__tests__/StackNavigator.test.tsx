import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import renderer from 'react-test-renderer';
import { withNavigation } from '@react-navigation/core';

import createStackNavigator from '../createStackNavigator';

import createAppContainer, {
  _TESTING_ONLY_reset_container_count,
  // @ts-ignore
} from '@react-navigation/native/src/createAppContainer';
import { NavigationProp } from '../../types';

const NavigationTestUtils = {
  resetInternalState: _TESTING_ONLY_reset_container_count,
};

const styles = StyleSheet.create({
  header: {
    opacity: 0.5,
  },
});

class HomeScreen extends Component {
  static navigationOptions = ({
    navigation,
  }: {
    navigation: NavigationProp;
  }) => ({
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
    NavigationTestUtils.resetInternalState();
  });

  it('renders successfully', () => {
    const MyStackNavigator = createStackNavigator(routeConfig);
    const App = createAppContainer(MyStackNavigator);
    const rendered = renderer.create(<App />).toJSON();

    expect(rendered).toMatchSnapshot();
  });

  it('applies correct values when headerRight is present', () => {
    const MyStackNavigator = createStackNavigator({
      Home: {
        screen: HomeScreen,
        navigationOptions: {
          headerRight: <View />,
        },
      },
    });
    const App = createAppContainer(MyStackNavigator);
    const rendered = renderer.create(<App />).toJSON();

    expect(rendered).toMatchSnapshot();
  });

  it('passes navigation to headerRight when wrapped in withNavigation', () => {
    const spy = jest.fn();

    class TestComponent extends React.Component<{
      onPress: (navigation: NavigationProp) => undefined;
      navigation: NavigationProp;
    }> {
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

    const Nav = createStackNavigator({ A: { screen: A } });
    const App = createAppContainer(Nav);

    renderer.create(<App />);

    expect(spy).toBeCalledWith(
      expect.objectContaining({
        navigate: expect.any(Function),
        addListener: expect.any(Function),
      })
    );
  });
});
