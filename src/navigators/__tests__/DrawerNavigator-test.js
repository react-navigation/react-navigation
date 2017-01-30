/* @flow */

import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import DrawerNavigator from '../DrawerNavigator';

const _getScreen = (label: string) => {
  return class extends React.Component {
    static navigationOptions = {
      drawer: () => ({
        label,
      }),
    };

    render() {
      return null;
    }
  }
};

describe('DrawerNavigator', () => {

  const DrawerApp = DrawerNavigator({
    Inbox: {
      screen: _getScreen('Inbox'),
    },
    Drafts: {
      screen: _getScreen('Drafts'),
    },
  });

  it('renders a DrawerNavigator with correct options', () => {
    expect(renderer.create(
      <DrawerApp />,
    )).toMatchSnapshot();
  })

});
