import React from 'react';
import { Asset, registerRootComponent } from 'expo';
import { FlatList, I18nManager } from 'react-native';
import { createAppContainer } from '@react-navigation/native';

import {
  Assets as StackAssets,
  createStackNavigator,
} from 'react-navigation-stack';
import { List, Divider } from 'react-native-paper';

import ScrollView from './src/ScrollView';
import Lists from './src/Lists';

// Comment/uncomment the following two lines to toggle react-native-screens
// import { useScreens } from 'react-native-screens';
// useScreens();

// Uncomment the following line to force RTL. Requires closing and re-opening
// your app after you first load it with this option enabled.
I18nManager.forceRTL(false);

const data = [
  { component: ScrollView, title: 'ScrollView', routeName: 'ScrollView' },
  { component: Lists, title: 'FlatList and SectionList', routeName: 'Lists' },
];

// Cache images
Asset.loadAsync(StackAssets);

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
        ItemSeparatorComponent={Divider}
        renderItem={this._renderItem}
        keyExtractor={this._keyExtractor}
        data={data}
        style={{ backgroundColor: '#fff' }}
      />
    );
  }
}

const Root = createStackNavigator(
  {
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
  },
  {
    mode: 'modal',
    headerMode: 'none',
    defaultNavigationOptions: {
      gesturesEnabled: false,
    },
  }
);

const App = createAppContainer(Root);
export default App;
registerRootComponent(App);
