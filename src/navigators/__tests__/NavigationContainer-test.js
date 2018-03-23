import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import renderer from 'react-test-renderer';

import StackNavigator from '../createStackNavigator';

function spyConsole() {
  let spy = {};

  beforeEach(() => {
    spy.console = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    spy.console.mockRestore();
  });

  return spy;
}

describe('detached navigators', () => {
  let spy = spyConsole();

  it('warns when you render more than one navigator explicitly', () => {
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

    const ChildNavigator = StackNavigator({
      Child: BlankScreen,
    });

    const RootStack = StackNavigator({
      Root: RootScreen,
    });

    renderer.create(<RootStack />).toJSON();
    expect(spy).toMatchSnapshot();
  });
});
