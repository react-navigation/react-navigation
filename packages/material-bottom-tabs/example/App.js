import * as React from 'react';
import Expo from 'expo';
import { FlatList } from 'react-native';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import { List, Divider } from 'react-native-paper';

// Unclear why this isn't getitng picked up :O
// eslint-disable-next-line import/named
import { Assets as StackAssets } from 'react-navigation-stack';

import SimpleTabs from './src/SimpleTabs';
import ShiftingTabs from './src/ShiftingTabs';
import IconTabs from './src/IconTabs';

Expo.Asset.loadAsync(StackAssets);

const data = [
  { component: ShiftingTabs, title: 'Shifting', routeName: 'ShiftingTabs' },
  { component: SimpleTabs, title: 'Simple', routeName: 'SimpleTabs' },
  { component: IconTabs, title: 'Icons only', routeName: 'IconTabs' },
];

class Home extends React.Component {
  static navigationOptions = {
    title: 'Examples',
  };

  _renderItem = ({ item }) => (
    <List.Item
      title={item.title}
      onPress={() => this.props.navigation.navigate(item.routeName)}
    />
  );

  _keyExtractor = item => item.routeName;

  render() {
    return (
      <FlatList
        style={{ backgroundColor: '#fff' }}
        ItemSeparatorComponent={Divider}
        renderItem={this._renderItem}
        keyExtractor={this._keyExtractor}
        data={data}
      />
    );
  }
}

const MainStack = createStackNavigator({
  Home,
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

const App = createAppContainer(MainStack);
Expo.registerRootComponent(App);
