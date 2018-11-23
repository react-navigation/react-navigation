import React from 'react';
import { StatusBar, Text, View } from 'react-native';
import { createStackNavigator, NavigationScreenProp } from 'react-navigation';
import { NavigationState } from 'react-navigation';
import { Button } from './commonComponents/ButtonWithMargin';

interface Props {
  navigation: NavigationScreenProp<NavigationState & any>;
}

class HomeScreen extends React.Component<Props, any> {
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

class SettingsScreen extends React.Component<Props, any> {
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
