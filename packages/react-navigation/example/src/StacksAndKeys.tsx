import React from 'react';
import { Text, View } from 'react-native';
import { Themed } from 'react-navigation';
import {
  createStackNavigator,
  NavigationStackScreenProps,
} from 'react-navigation-stack';
import { Button } from './commonComponents/ButtonWithMargin';

class HomeScreen extends React.Component<NavigationStackScreenProps> {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Home</Text>
        <Button
          title="Navigate to 'Profile' with key 'A'"
          onPress={() =>
            this.props.navigation.navigate({
              key: 'A',
              params: { homeKey: this.props.navigation.state.key },
              routeName: 'Profile',
            })
          }
        />
        <Button
          title="Go back to other examples"
          onPress={() => this.props.navigation.goBack(null)}
        />
        <Themed.StatusBar />
      </View>
    );
  }
}

class ProfileScreen extends React.Component<
  NavigationStackScreenProps<{ homeKey: string }>
> {
  render() {
    const homeKey = this.props.navigation.getParam('homeKey');

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Profile</Text>
        <Button
          title="Navigate to 'Settings' with key 'B'"
          onPress={() =>
            this.props.navigation.navigate({
              key: 'B',
              params: { homeKey },
              routeName: 'Settings',
            })
          }
        />
        <Button
          title={`Navigate back to 'Home' with key ${homeKey}`}
          onPress={() =>
            this.props.navigation.navigate({ routeName: 'Home', key: homeKey })
          }
        />
      </View>
    );
  }
}

class SettingsScreen extends React.Component<NavigationStackScreenProps> {
  render() {
    const { homeKey } = this.props.navigation.state.params!;

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Settings</Text>
        <Button
          title={`Navigate back to 'Home' with key ${homeKey}`}
          onPress={() =>
            this.props.navigation.navigate({ routeName: 'Home', key: homeKey })
          }
        />
        <Button
          title="Navigate back to 'Profile' with key 'A'"
          onPress={() =>
            this.props.navigation.navigate({
              key: 'A',
              routeName: 'Profile',
            })
          }
        />
      </View>
    );
  }
}

const Stack = createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
    },
    Profile: {
      screen: ProfileScreen,
    },
    Settings: {
      screen: SettingsScreen,
    },
  },
  {
    headerMode: 'none',
  }
);

export default Stack;
