import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import renderer from 'react-test-renderer';
import { withNavigation } from 'react-navigation';

import createStackNavigator from '../createStackNavigator';

import createAppContainer, {
  _TESTING_ONLY_reset_container_count,
  // @ts-ignore
} from '../../../../native/src/createAppContainer';
import { StackNavigationProp } from '../../vendor/types';

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
    navigation: StackNavigationProp;
  }) => ({
    title: `Welcome ${
      navigation.state.params ? navigation.state.params.user : 'anonymous'
    }`,
    gestureEnabled: true,
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
          headerRight: () => <View />,
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
      onPress: (navigation: StackNavigationProp) => undefined;
      navigation: StackNavigationProp;
    }> {
      render() {
        return <View>{this.props.onPress(this.props.navigation)}</View>;
      }
    }

    const TestComponentWithNavigation = withNavigation(TestComponent);

    class A extends React.Component {
      static navigationOptions = {
        headerRight: () => <TestComponentWithNavigation onPress={spy} />,
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
