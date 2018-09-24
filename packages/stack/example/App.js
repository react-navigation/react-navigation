import React from 'react';
import Expo from 'expo';
import { FlatList } from 'react-native';
import { createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { ListSection, Divider } from 'react-native-paper';

import SimpleStack from './src/SimpleStack';
import TransparentStack from './src/TransparentStack';

// Comment the following two lines to stop using react-native-screens
import { useScreens } from 'react-native-screens';
useScreens();

const data = [
  { component: SimpleStack, title: 'Simple', routeName: 'SimpleStack' },
  {
    component: TransparentStack,
    title: 'Transparent',
    routeName: 'TransparentStack',
  },
];

class Home extends React.Component {
  static navigationOptions = {
    title: 'Examples',
  };

  _renderItem = ({ item }) => (
    <ListSection.Item
      title={item.title}
      onPress={() => this.props.navigation.navigate(item.routeName)}
    />
  );

  _keyExtractor = item => item.routeName;

  render() {
    return (
      <FlatList
        ItemSeparatorComponent={Divider}
        renderItem={this._renderItem}
        keyExtractor={this._keyExtractor}
        data={data}
      />
    );
  }
}

const App = createSwitchNavigator({
  Home: createStackNavigator({ Home }),
  ...data.reduce((acc, it) => {
    acc[it.routeName] = {
      screen: it.component,
      navigationOptions: {
        title: it.title,
      },
    };

    return acc;
  }, {}),
});

Expo.registerRootComponent(App);
