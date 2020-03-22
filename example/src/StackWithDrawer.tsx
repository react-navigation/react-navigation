import * as React from 'react';
import { Button, Text, View } from 'react-native';
import {
  createStackNavigator,
  NavigationStackScreenProps,
} from 'react-navigation-stack';
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
} from 'react-navigation-drawer';
import {
  createBottomTabNavigator,
  NavigationTabScreenProps,
} from 'react-navigation-tabs';

function Menu({ navigation }: DrawerContentComponentProps) {
  return (
    <View style={{ flex: 1 }}>
      <Button
        title="Open on top"
        onPress={() => {
          // @ts-ignore
          navigation.navigate('Top');
        }}
      />
    </View>
  );
}

class Fake extends React.Component<
  NavigationTabScreenProps | NavigationStackScreenProps
> {
  static navigationOptions = ({
    navigation,
  }: NavigationTabScreenProps | NavigationStackScreenProps) => ({
    title: navigation.getParam('title'),
  });

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 20 }}>
          {this.props.navigation.getParam('title')}
        </Text>
      </View>
    );
  }
}

const Tab = createBottomTabNavigator({
  Home: { screen: Fake, params: { title: 'Home' } },
  Other: { screen: Fake, params: { title: 'Other' } },
});

const Drawer = createDrawerNavigator(
  {
    TabScreen: {
      screen: Tab,
    },
  },
  {
    contentComponent: (props) => <Menu {...props} />,
    navigationOptions: { title: 'Example' },
  }
);

const App = createStackNavigator({
  Drawer: { screen: Drawer },
  Top: { screen: Fake, params: { title: 'Top' } },
});

export default App;
