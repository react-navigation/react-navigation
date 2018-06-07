import * as React from 'react';
import Expo from 'expo';
import { FlatList } from 'react-native';
import { createSwitchNavigator, createStackNavigator } from 'react-navigation';
import { ListSection, Divider } from 'react-native-paper';
import SimpleDrawer from './src/SimpleDrawer';
import StyledDrawer from './src/StyledDrawer';

const data = [
  { component: SimpleDrawer, title: 'Simple', routeName: 'SimpleDrawer' },
  { component: StyledDrawer, title: 'Styled', routeName: 'StyledDrawer' },
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
