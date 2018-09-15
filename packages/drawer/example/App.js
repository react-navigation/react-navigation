import * as React from 'react';
import { FlatList } from 'react-native';
import { createSwitchNavigator, createStackNavigator } from 'react-navigation';
import { List, Divider } from 'react-native-paper';
import SimpleDrawer from './src/SimpleDrawer';
import StyledDrawer from './src/StyledDrawer';
import GestureInteraction from './src/GestureInteraction';

const data = [
  { component: SimpleDrawer, title: 'Simple', routeName: 'SimpleDrawer' },
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
      style={{ backgroundColor: '#fff' }}
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

export default createSwitchNavigator({
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
