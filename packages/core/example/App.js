import React from 'react';
import Expo from 'expo';
import { FlatList, I18nManager } from 'react-native';
import { createAppContainer } from '@react-navigation/native';
import {
  Assets as StackAssets,
  createStackNavigator,
} from 'react-navigation-stack';
import { ListSection, Divider } from 'react-native-paper';

import SimpleStack from './src/SimpleStack';

// Comment the following two lines to stop using react-native-screens
import { useScreens } from 'react-native-screens';

// Uncomment the following line to force RTL. Requires closing and re-opening
// your app after you first load it with this option enabled.
I18nManager.forceRTL(false);
// useScreens();

const data = [
  { component: SimpleStack, title: 'Simple', routeName: 'SimpleStack' },
];

// Cache images
Expo.Asset.loadAsync(StackAssets);

class Home extends React.Component {
  static navigationOptions = {
    title: 'Examples',
  };

  componentDidMount() {
    // this.props.navigation.addListener('refocus', payload => {
    //   console.log({ payload });
    // })

    // setTimeout(() => {
    //   this.props.navigation.emit('refocus', {lol: true});
    // }, 1000)
  }

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
Expo.registerRootComponent(App);
