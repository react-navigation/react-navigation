import React from 'react';
import { Button, StatusBar, Text, View } from 'react-native';
import { StackNavigator } from 'react-navigation';

class HomeScreen extends React.Component<any, any> {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Home</Text>
        <Button
          title="Navigate to 'Profile' with key 'A'"
          onPress={() =>
            this.props.navigation.navigate({
              routeName: 'Profile',
              key: 'A',
              params: { homeKey: this.props.navigation.state.key },
            })
          }
        />
        <Button
          title="Go back to other examples"
          onPress={() => this.props.navigation.goBack(null)}
        />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

class ProfileScreen extends React.Component<any, any> {
  render() {
    const { homeKey } = this.props.navigation.state.params;
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Profile</Text>
        <Button
          title="Navigate to 'Settings' with key 'B'"
          onPress={() =>
            this.props.navigation.navigate({
              routeName: 'Settings',
              key: 'B',
              params: { homeKey },
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

class SettingsScreen extends React.Component<any, any> {
  render() {
    const { homeKey } = this.props.navigation.state.params;

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
              routeName: 'Profile',
              key: 'A',
            })
          }
        />
      </View>
    );
  }
}

const Stack = StackNavigator(
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
