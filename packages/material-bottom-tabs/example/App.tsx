import * as React from 'react';
import { StyleSheet } from 'react-native';
import { registerRootComponent } from 'expo';
import { Asset } from 'expo-asset';
import {
  FlatList,
  createAppContainer,
  NavigationScreenProp,
} from 'react-navigation';
import {
  createStackNavigator,
  Assets as StackAssets,
} from 'react-navigation-stack';
import { List, Divider } from 'react-native-paper';

import SimpleTabs from './src/SimpleTabs';
import ShiftingTabs from './src/ShiftingTabs';
import IconTabs from './src/IconTabs';

Asset.loadAsync(StackAssets);

const data = [
  { component: ShiftingTabs, title: 'Shifting', routeName: 'ShiftingTabs' },
  { component: SimpleTabs, title: 'Simple', routeName: 'SimpleTabs' },
  { component: IconTabs, title: 'Icons only', routeName: 'IconTabs' },
];

type Props = {
  navigation: NavigationScreenProp<any>;
};

type Item = { title: string; routeName: string };

class Home extends React.Component<Props> {
  static navigationOptions = {
    title: 'Examples',
  };

  _renderItem = ({ item }: { item: Item }) => (
    <List.Item
      title={item.title}
      onPress={() => this.props.navigation.navigate(item.routeName)}
    />
  );

  _keyExtractor = (item: Item) => item.routeName;

  render() {
    return (
      <FlatList
        style={styles.container}
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
  ...data.reduce<{
    [key: string]: {
      screen: React.ComponentType;
      navigationOptions: { title: string };
    };
  }>((acc, it) => {
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

// @ts-ignore
registerRootComponent(App);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
});
