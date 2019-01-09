/**
 * @flow
 */

import type {
  NavigationScreenProp,
  NavigationEventSubscription,
} from 'react-navigation';

import React from 'react';
import { Animated, Platform, Text, StatusBar, View } from 'react-native';
import {
  ScrollView,
  FlatList,
  SafeAreaView,
  createBottomTabNavigator,
  withNavigation,
} from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SampleText from './SampleText';
import { Button } from './commonComponents/ButtonWithMargin';

const TEXT = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla a hendrerit dui, id consectetur nulla. Curabitur mattis sapien nunc, quis dignissim eros venenatis sit amet. Praesent rutrum dapibus diam quis eleifend. Donec vulputate quis purus sed vulputate. Fusce ipsum felis, cursus at congue vel, consectetur tincidunt purus. Pellentesque et fringilla lorem. In at augue malesuada, sollicitudin ex ut, convallis elit. Curabitur metus nibh, consequat vel libero sit amet, iaculis congue nisl. Maecenas eleifend sodales sapien, fringilla sagittis nisi ornare volutpat. Integer tellus enim, volutpat vitae nisl et, dignissim pharetra leo. Sed sit amet efficitur sapien, at tristique sapien. Aenean dignissim semper sagittis. Nullam sit amet volutpat mi.
Curabitur auctor orci et justo molestie iaculis. Integer elementum tortor ac ipsum egestas pharetra. Etiam ultrices elementum pharetra. Maecenas lobortis ultrices risus dignissim luctus. Nunc malesuada cursus posuere. Vestibulum tristique lectus pretium pellentesque pellentesque. Nunc ac nisi lacus. Duis ultrices dui ac viverra ullamcorper. Morbi placerat laoreet lacus sit amet ullamcorper.
Nulla convallis pulvinar hendrerit. Nulla mattis sem et aliquam ultrices. Nam egestas magna leo, nec luctus turpis sollicitudin ac. Sed id leo luctus, lobortis tortor ut, rhoncus ex. Aliquam gravida enim ac dapibus ultricies. Vestibulum at interdum est, et vehicula nibh. Phasellus dignissim iaculis rhoncus. Vestibulum tempus leo lectus, quis euismod metus ullamcorper quis. Interdum et malesuada fames ac ante ipsum primis in faucibus. Ut id ipsum at enim eleifend porttitor id quis metus. Proin bibendum ornare iaculis. Duis elementum lacus vel cursus efficitur. Nunc eu tortor sed risus lacinia scelerisque.
Praesent lobortis elit sit amet mauris pulvinar, viverra condimentum massa pellentesque. Curabitur massa ex, dignissim eget neque at, fringilla consectetur justo. Cras sollicitudin vel ligula sed cursus. Aliquam porta sem hendrerit diam porta ultricies. Sed eu mi erat. Curabitur id justo vel tortor hendrerit vestibulum id eget est. Morbi eros magna, placerat id diam ut, varius sollicitudin mi. Curabitur pretium finibus accumsan.`;
const MyNavScreen = ({ navigation, banner }) => (
  <ScrollView navigation={navigation} style={{ flex: 1 }}>
    <SafeAreaView forceInset={{ horizontal: 'always', top: 'always' }}>
      <SampleText>{banner}</SampleText>
      <Button
        onPress={() => navigation.navigate('Home')}
        title="Go to home tab"
      />
      <Button
        onPress={() => navigation.navigate('Settings')}
        title="Go to settings tab"
      />
      <Button onPress={() => navigation.goBack(null)} title="Go back" />
      {TEXT.split('\n').map((p, n) => (
        <Text key={n} style={{ marginVertical: 10, marginHorizontal: 8 }}>
          {p}
        </Text>
      ))}
      <StatusBar barStyle="default" />
    </SafeAreaView>
  </ScrollView>
);

const MyListScreen = ({ navigation, data }) => (
  <FlatList
    navigation={navigation}
    data={TEXT.split('\n')}
    style={{ paddingTop: 10 }}
    keyExtractor={(item, index) => index.toString()}
    renderItem={({ item }) => (
      <Text style={{ fontSize: 16, marginVertical: 10, marginHorizontal: 8 }}>
        {item}
      </Text>
    )}
  />
);

const MyHomeScreen = ({ navigation }) => (
  <MyNavScreen banner="Home Tab" navigation={navigation} />
);

MyHomeScreen.navigationOptions = {
  tabBarTestIDProps: {
    testID: 'TEST_ID_HOME',
    accessibilityLabel: 'TEST_ID_HOME_ACLBL',
  },
  tabBarLabel: 'Home',
  tabBarIcon: ({ tintColor, focused, horizontal }) => (
    <Ionicons
      name={'ios-home'}
      size={horizontal ? 20 : 26}
      style={{ color: tintColor }}
    />
  ),
};
MyListScreen.navigationOptions = MyHomeScreen.navigationOptions;

type MyPeopleScreenProps = {
  navigation: NavigationScreenProp<*>,
};
class MyPeopleScreen extends React.Component<MyPeopleScreenProps> {
  _s0: NavigationEventSubscription;
  _s1: NavigationEventSubscription;
  _s2: NavigationEventSubscription;
  _s3: NavigationEventSubscription;

  static navigationOptions = {
    tabBarLabel: 'People',
    tabBarIcon: ({ tintColor, focused, horizontal }) => (
      <Ionicons
        name={'ios-people'}
        size={horizontal ? 20 : 26}
        style={{ color: tintColor }}
      />
    ),
  };
  componentDidMount() {
    // this._s0 = this.props.navigation.addListener('willFocus', this._onEvent);
    // this._s1 = this.props.navigation.addListener('didFocus', this._onEvent);
    // this._s2 = this.props.navigation.addListener('willBlur', this._onEvent);
    // this._s3 = this.props.navigation.addListener('didBlur', this._onEvent);
  }
  componentWillUnmount() {
    // this._s0.remove();
    // this._s1.remove();
    // this._s2.remove();
    // this._s3.remove();
  }
  _onEvent = a => {
    console.log('EVENT ON PEOPLE TAB', a.type, a);
  };
  render() {
    const { navigation } = this.props;
    return <MyNavScreen banner="People Tab" navigation={navigation} />;
  }
}

type MyChatScreenProps = {
  navigation: NavigationScreenProp<*>,
};
class MyChatScreen extends React.Component<MyChatScreenProps> {
  _s0: NavigationEventSubscription;
  _s1: NavigationEventSubscription;
  _s2: NavigationEventSubscription;
  _s3: NavigationEventSubscription;

  static navigationOptions = {
    tabBarLabel: 'Chat',
    tabBarIcon: ({ tintColor, focused, horizontal }) => (
      <Ionicons
        name={'ios-chatboxes'}
        size={horizontal ? 20 : 26}
        style={{ color: tintColor }}
      />
    ),
  };
  componentDidMount() {
    // this._s0 = this.props.navigation.addListener('willFocus', this._onEvent);
    // this._s1 = this.props.navigation.addListener('didFocus', this._onEvent);
    // this._s2 = this.props.navigation.addListener('willBlur', this._onEvent);
    // this._s3 = this.props.navigation.addListener('didBlur', this._onEvent);
  }
  componentWillUnmount() {
    // this._s0.remove();
    // this._s1.remove();
    // this._s2.remove();
    // this._s3.remove();
  }
  _onEvent = a => {
    console.log('EVENT ON CHAT TAB', a.type, a);
  };
  render() {
    const { navigation } = this.props;
    return <MyNavScreen banner="Chat Tab" navigation={navigation} />;
  }
}

const MySettingsScreen = ({ navigation }) => (
  <MyNavScreen banner="Settings Tab" navigation={navigation} />
);

MySettingsScreen.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ tintColor, focused, horizontal }) => (
    <Ionicons
      name={'ios-settings'}
      size={horizontal ? 20 : 26}
      style={{ color: tintColor }}
    />
  ),
};

const SimpleTabs = createBottomTabNavigator(
  {
    Home: {
      screen: MyListScreen,
      path: '',
    },
    People: {
      screen: MyPeopleScreen,
      path: 'cart',
    },
    Chat: {
      screen: MyChatScreen,
      path: 'chat',
    },
    Settings: {
      screen: MySettingsScreen,
      path: 'settings',
    },
  },
  {
    tabBarOptions: {
      activeTintColor: '#e91e63',
    },
  }
);

type SimpleTabsContainerProps = {
  navigation: NavigationScreenProp<*>,
};

class SimpleTabsContainer extends React.Component<SimpleTabsContainerProps> {
  static router = SimpleTabs.router;
  _s0: NavigationEventSubscription;
  _s1: NavigationEventSubscription;
  _s2: NavigationEventSubscription;
  _s3: NavigationEventSubscription;

  componentDidMount() {
    // this._s0 = this.props.navigation.addListener('willFocus', this._onAction);
    // this._s1 = this.props.navigation.addListener('didFocus', this._onAction);
    // this._s2 = this.props.navigation.addListener('willBlur', this._onAction);
    // this._s3 = this.props.navigation.addListener('didBlur', this._onAction);
  }
  componentWillUnmount() {
    // this._s0.remove();
    // this._s1.remove();
    // this._s2.remove();
    // this._s3.remove();
  }
  _onAction = a => {
    console.log('TABS EVENT', a.type, a);
  };
  render() {
    return <SimpleTabs navigation={this.props.navigation} />;
  }
}

export default SimpleTabsContainer;
