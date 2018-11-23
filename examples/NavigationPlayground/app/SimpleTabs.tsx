import React from 'react';
import { Animated, Platform, StatusBar, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  createBottomTabNavigator,
  FlatList,
  NavigationEventSubscription,
  NavigationScreenProp,
  SafeAreaView,
  ScrollView,
} from 'react-navigation';
import { NavigationEventPayload, NavigationState } from 'react-navigation';
import { Button } from './commonComponents/ButtonWithMargin';
import SampleText from './SampleText';

const TEXT = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla a hendrerit dui, id consectetur nulla. Curabitur mattis sapien nunc, quis dignissim eros venenatis sit amet. Praesent rutrum dapibus diam quis eleifend. Donec vulputate quis purus sed vulputate. Fusce ipsum felis, cursus at congue vel, consectetur tincidunt purus. Pellentesque et fringilla lorem. In at augue malesuada, sollicitudin ex ut, convallis elit. Curabitur metus nibh, consequat vel libero sit amet, iaculis congue nisl. Maecenas eleifend sodales sapien, fringilla sagittis nisi ornare volutpat. Integer tellus enim, volutpat vitae nisl et, dignissim pharetra leo. Sed sit amet efficitur sapien, at tristique sapien. Aenean dignissim semper sagittis. Nullam sit amet volutpat mi.
Curabitur auctor orci et justo molestie iaculis. Integer elementum tortor ac ipsum egestas pharetra. Etiam ultrices elementum pharetra. Maecenas lobortis ultrices risus dignissim luctus. Nunc malesuada cursus posuere. Vestibulum tristique lectus pretium pellentesque pellentesque. Nunc ac nisi lacus. Duis ultrices dui ac viverra ullamcorper. Morbi placerat laoreet lacus sit amet ullamcorper.
Nulla convallis pulvinar hendrerit. Nulla mattis sem et aliquam ultrices. Nam egestas magna leo, nec luctus turpis sollicitudin ac. Sed id leo luctus, lobortis tortor ut, rhoncus ex. Aliquam gravida enim ac dapibus ultricies. Vestibulum at interdum est, et vehicula nibh. Phasellus dignissim iaculis rhoncus. Vestibulum tempus leo lectus, quis euismod metus ullamcorper quis. Interdum et malesuada fames ac ante ipsum primis in faucibus. Ut id ipsum at enim eleifend porttitor id quis metus. Proin bibendum ornare iaculis. Duis elementum lacus vel cursus efficitur. Nunc eu tortor sed risus lacinia scelerisque.
Praesent lobortis elit sit amet mauris pulvinar, viverra condimentum massa pellentesque. Curabitur massa ex, dignissim eget neque at, fringilla consectetur justo. Cras sollicitudin vel ligula sed cursus. Aliquam porta sem hendrerit diam porta ultricies. Sed eu mi erat. Curabitur id justo vel tortor hendrerit vestibulum id eget est. Morbi eros magna, placerat id diam ut, varius sollicitudin mi. Curabitur pretium finibus accumsan.`;
const MyNavScreen = ({
  navigation,
  banner,
}: {
  navigation: NavigationScreenProp<NavigationState>;
  banner: string;
}) => (
  <ScrollView style={{ flex: 1 }}>
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

const MyListScreen = ({
  navigation,
}: {
  navigation: NavigationScreenProp<NavigationState>;
}) => (
  <FlatList
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

const MyHomeScreen = ({
  navigation,
}: {
  navigation: NavigationScreenProp<NavigationState>;
}) => <MyNavScreen banner="Home Tab" navigation={navigation} />;

MyHomeScreen.navigationOptions = {
  tabBarIcon: ({
    tintColor,
    focused,
    horizontal,
  }: {
    tintColor: string;
    focused: boolean;
    horizontal: boolean;
  }) => (
    <Ionicons
      name={'ios-home'}
      size={horizontal ? 20 : 26}
      style={{ color: tintColor }}
    />
  ),
  tabBarLabel: 'Home',
  tabBarTestIDProps: {
    accessibilityLabel: 'TEST_ID_HOME_ACLBL',
    testID: 'TEST_ID_HOME',
  },
};
MyListScreen.navigationOptions = MyHomeScreen.navigationOptions;

interface MyPeopleScreenProps {
  navigation: NavigationScreenProp<NavigationState>;
}
class MyPeopleScreen extends React.Component<MyPeopleScreenProps> {
  static navigationOptions = {
    tabBarIcon: ({
      tintColor,
      focused,
      horizontal,
    }: {
      tintColor: string;
      focused: boolean;
      horizontal: boolean;
    }) => (
      <Ionicons
        name={'ios-people'}
        size={horizontal ? 20 : 26}
        style={{ color: tintColor }}
      />
    ),
    tabBarLabel: 'People',
  };
  s0: NavigationEventSubscription | null = null;
  s1: NavigationEventSubscription | null = null;
  s2: NavigationEventSubscription | null = null;
  s3: NavigationEventSubscription | null = null;
  componentDidMount() {
    // this.s0! = this.props.navigation.addListener('willFocus', this.onEvent);
    // this.s1! = this.props.navigation.addListener('didFocus', this.onEvent);
    // this.s2! = this.props.navigation.addListener('willBlur', this.onEvent);
    // this.s3! = this.props.navigation.addListener('didBlur', this.onEvent);
  }
  componentWillUnmount() {
    // this.s0!.remove();
    // this.s1!.remove();
    // this.s2!.remove();
    // this.s3!.remove();
  }
  onEvent = (a: NavigationEventPayload) => {
    console.log('EVENT ON PEOPLE TAB', a.type, a);
  };
  render() {
    const { navigation } = this.props;
    return <MyNavScreen banner="People Tab" navigation={navigation} />;
  }
}

interface MyChatScreenProps {
  navigation: NavigationScreenProp<NavigationState>;
}
class MyChatScreen extends React.Component<MyChatScreenProps> {
  static navigationOptions = {
    tabBarIcon: ({
      tintColor,
      focused,
      horizontal,
    }: {
      tintColor: string;
      focused: boolean;
      horizontal: boolean;
    }) => (
      <Ionicons
        name={'ios-chatboxes'}
        size={horizontal ? 20 : 26}
        style={{ color: tintColor }}
      />
    ),
    tabBarLabel: 'Chat',
  };
  s0: NavigationEventSubscription | null = null;
  s1: NavigationEventSubscription | null = null;
  s2: NavigationEventSubscription | null = null;
  s3: NavigationEventSubscription | null = null;
  componentDidMount() {
    // this.s0! = this.props.navigation.addListener('willFocus', this.onEvent);
    // this.s1! = this.props.navigation.addListener('didFocus', this.onEvent);
    // this.s2! = this.props.navigation.addListener('willBlur', this.onEvent);
    // this.s3! = this.props.navigation.addListener('didBlur', this.onEvent);
  }
  componentWillUnmount() {
    // this.s0!.remove();
    // this.s1!.remove();
    // this.s2!.remove();
    // this.s3!.remove();
  }
  onEvent = (a: NavigationEventPayload) => {
    console.log('EVENT ON CHAT TAB', a.type, a);
  };
  render() {
    const { navigation } = this.props;
    return <MyNavScreen banner="Chat Tab" navigation={navigation} />;
  }
}

const MySettingsScreen = ({
  navigation,
}: {
  navigation: NavigationScreenProp<NavigationState>;
}) => <MyNavScreen banner="Settings Tab" navigation={navigation} />;

MySettingsScreen.navigationOptions = {
  tabBarIcon: ({
    tintColor,
    focused,
    horizontal,
  }: {
    tintColor: string;
    focused: boolean;
    horizontal: boolean;
  }) => (
    <Ionicons
      name={'ios-settings'}
      size={horizontal ? 20 : 26}
      style={{ color: tintColor }}
    />
  ),
  tabBarLabel: 'Settings',
};

const SimpleTabs = createBottomTabNavigator(
  {
    Chat: {
      path: 'chat',
      screen: MyChatScreen,
    },
    Home: {
      path: '',
      screen: MyListScreen,
    },
    People: {
      path: 'cart',
      screen: MyPeopleScreen,
    },
    Settings: {
      path: 'settings',
      screen: MySettingsScreen,
    },
  },
  {
    backBehavior: 'history',
    tabBarOptions: {
      activeTintColor: '#e91e63',
    },
  }
);

interface SimpleTabsContainerProps {
  navigation: NavigationScreenProp<NavigationState>;
}

class SimpleTabsContainer extends React.Component<SimpleTabsContainerProps> {
  static router = SimpleTabs.router;
  s0: NavigationEventSubscription | null = null;
  s1: NavigationEventSubscription | null = null;
  s2: NavigationEventSubscription | null = null;
  s3: NavigationEventSubscription | null = null;

  componentDidMount() {
    // this.s0! = this.props.navigation.addListener('willFocus', this.onAction);
    // this.s1! = this.props.navigation.addListener('didFocus', this.onAction);
    // this.s2! = this.props.navigation.addListener('willBlur', this.onAction);
    // this.s3! = this.props.navigation.addListener('didBlur', this.onAction);
  }
  componentWillUnmount() {
    // this.s0!.remove();
    // this.s1!.remove();
    // this.s2!.remove();
    // this.s3!.remove();
  }
  onAction = (a: NavigationEventPayload) => {
    console.log('TABS EVENT', a.type, a);
  };
  render() {
    return <SimpleTabs navigation={this.props.navigation} />;
  }
}

export default SimpleTabsContainer;
