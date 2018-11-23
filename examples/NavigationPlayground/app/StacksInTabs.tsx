import React from 'react';
import { StatusBar, Text } from 'react-native';
import {
  createBottomTabNavigator,
  createStackNavigator,
  NavigationScreenProp,
  NavigationState,
  SafeAreaView,
  ScrollView,
} from 'react-navigation';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { Button } from './commonComponents/ButtonWithMargin';
import SampleText from './SampleText';

const TEXT = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla a hendrerit dui, id consectetur nulla. Curabitur mattis sapien nunc, quis dignissim eros venenatis sit amet. Praesent rutrum dapibus diam quis eleifend. Donec vulputate quis purus sed vulputate. Fusce ipsum felis, cursus at congue vel, consectetur tincidunt purus. Pellentesque et fringilla lorem. In at augue malesuada, sollicitudin ex ut, convallis elit. Curabitur metus nibh, consequat vel libero sit amet, iaculis congue nisl. Maecenas eleifend sodales sapien, fringilla sagittis nisi ornare volutpat. Integer tellus enim, volutpat vitae nisl et, dignissim pharetra leo. Sed sit amet efficitur sapien, at tristique sapien. Aenean dignissim semper sagittis. Nullam sit amet volutpat mi.
Curabitur auctor orci et justo molestie iaculis. Integer elementum tortor ac ipsum egestas pharetra. Etiam ultrices elementum pharetra. Maecenas lobortis ultrices risus dignissim luctus. Nunc malesuada cursus posuere. Vestibulum tristique lectus pretium pellentesque pellentesque. Nunc ac nisi lacus. Duis ultrices dui ac viverra ullamcorper. Morbi placerat laoreet lacus sit amet ullamcorper.
Nulla convallis pulvinar hendrerit. Nulla mattis sem et aliquam ultrices. Nam egestas magna leo, nec luctus turpis sollicitudin ac. Sed id leo luctus, lobortis tortor ut, rhoncus ex. Aliquam gravida enim ac dapibus ultricies. Vestibulum at interdum est, et vehicula nibh. Phasellus dignissim iaculis rhoncus. Vestibulum tempus leo lectus, quis euismod metus ullamcorper quis. Interdum et malesuada fames ac ante ipsum primis in faucibus. Ut id ipsum at enim eleifend porttitor id quis metus. Proin bibendum ornare iaculis. Duis elementum lacus vel cursus efficitur. Nunc eu tortor sed risus lacinia scelerisque.
Praesent lobortis elit sit amet mauris pulvinar, viverra condimentum massa pellentesque. Curabitur massa ex, dignissim eget neque at, fringilla consectetur justo. Cras sollicitudin vel ligula sed cursus. Aliquam porta sem hendrerit diam porta ultricies. Sed eu mi erat. Curabitur id justo vel tortor hendrerit vestibulum id eget est. Morbi eros magna, placerat id diam ut, varius sollicitudin mi. Curabitur pretium finibus accumsan.`;

interface Props {
  navigation: NavigationScreenProp<NavigationState>;
  banner: string;
}

class MyNavScreen extends React.Component<Props> {
  render() {
    const { navigation } = this.props;
    const banner = navigation.getParam('banner');

    return (
      <ScrollView style={{ flex: 1 }}>
        <SafeAreaView forceInset={{ horizontal: 'always' }}>
          <SampleText>{banner}</SampleText>
          <Button
            onPress={() => navigation.navigate('Profile', { name: 'Jordan' })}
            title="Open profile screen"
          />
          <Button
            onPress={() => navigation.navigate('NotifSettings')}
            title="Open notifications screen"
          />
          <Button
            onPress={() => navigation.navigate('SettingsTab')}
            title="Go to settings tab"
          />
          <Button onPress={() => navigation.goBack(null)} title="Go back" />

          {TEXT.split('\n').map((p, n) => (
            <Text key={n} style={{ marginVertical: 10, marginHorizontal: 8 }}>
              {p}
            </Text>
          ))}
        </SafeAreaView>

        <StatusBar barStyle="default" />
      </ScrollView>
    );
  }
}

const MyProfileScreen = ({
  navigation,
}: {
  navigation: NavigationScreenProp<NavigationState>;
}) => (
  <MyNavScreen
    banner={`${navigation.state.params!.name}s Profile`}
    navigation={navigation}
  />
);

const MainTab = createStackNavigator({
  Home: {
    navigationOptions: {
      title: 'Welcome',
    },
    params: { banner: 'Home Screen' },
    path: '/',
    screen: MyNavScreen,
  },
  Profile: {
    navigationOptions: ({
      navigation,
    }: {
      navigation: NavigationScreenProp<NavigationState>;
    }) => ({
      title: `${navigation.state.params!.name}'s Profile!`,
    }),
    path: '/people/:name',
    screen: MyProfileScreen,
  },
});

const SettingsTab = createStackNavigator({
  NotifSettings: {
    navigationOptions: {
      title: 'Notifications',
    },
    params: { banner: 'Notifications Screen' },
    screen: MyNavScreen,
  },
  Settings: {
    navigationOptions: () => ({
      title: 'Settings',
    }),
    params: { banner: 'Settings Screen' },
    path: '/',
    screen: MyNavScreen,
  },
});

const StacksInTabs = createBottomTabNavigator(
  {
    MainTab: {
      navigationOptions: {
        tabBarIcon: ({
          tintColor,
          focused,
        }: {
          tintColor: string;
          focused: boolean;
        }) => (
          <Ionicons
            name={focused ? 'ios-home' : 'ios-home'}
            size={26}
            style={{ color: tintColor }}
          />
        ),
        tabBarLabel: 'Home',
      },
      path: '/',
      screen: MainTab,
    },
    SettingsTab: {
      screen: SettingsTab,
      path: '/settings',
      navigationOptions: {
        tabBarLabel: 'Settings',
        tabBarIcon: ({
          tintColor,
          focused,
        }: {
          tintColor: string;
          focused: boolean;
        }) => (
          <Ionicons
            name={focused ? 'ios-settings' : 'ios-settings'}
            size={26}
            style={{ color: tintColor }}
          />
        ),
      },
    },
  },
  {
    tabBarOptions: {
      showLabel: false,
    },
  }
);

export default StacksInTabs;
