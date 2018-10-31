import * as React from 'react';
import { FlatList } from 'react-native';
import { createAppContainer } from '@react-navigation/native';

// eslint-disable-next-line import/named
import { createStackNavigator } from 'react-navigation-stack';
import { List, Divider } from 'react-native-paper';
import { SimpleDrawer, SimpleDrawerUnmountInactive } from './src/SimpleDrawer';
import StyledDrawer from './src/StyledDrawer';
import GestureInteraction from './src/GestureInteraction';

const data = [
  {
    component: SimpleDrawer,
    title: 'Simple - persistent routes like tabs',
    routeName: 'SimpleDrawer',
  },
  {
    component: SimpleDrawerUnmountInactive,
    title: 'Simple - unmount inactive routes',
    routeName: 'SimpleDrawerUnmountInactive',
  },
  { component: StyledDrawer, title: 'Styled', routeName: 'StyledDrawer' },
  {
    component: GestureInteraction,
    title: 'Gesture Interaction',
    routeName: 'GestureInteraction',
  },
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
        ItemSeparatorComponent={Divider}
        renderItem={this._renderItem}
        keyExtractor={this._keyExtractor}
        style={{ backgroundColor: '#fff' }}
        data={data}
      />
    );
  }
}

const MainNavigator = createStackNavigator(
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
    headerMode: 'none',
    mode: 'modal',
    defaultNavigationOptions: {
      gesturesEnabled: false,
    },
  }
);

export default createAppContainer(MainNavigator);
