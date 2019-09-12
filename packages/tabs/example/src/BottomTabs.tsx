import * as React from 'react';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import Albums from './Shared/Albums';
import Article from './Shared/Article';
import Chat from './Shared/Chat';
import Contacts from './Shared/Contacts';

// @ts-ignore
import TouchableBounce from 'react-native/Libraries/Components/Touchable/TouchableBounce';

const tabBarIcon = (name: string) => ({
  tintColor,
  horizontal,
}: {
  tintColor: string;
  horizontal: boolean;
}) => (
  <MaterialIcons name={name} color={tintColor} size={horizontal ? 17 : 24} />
);

class AlbumsScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Albums',
    tabBarIcon: tabBarIcon('photo-album'),
    tabBarButtonComponent: TouchableBounce,
  };

  render() {
    return <Albums />;
  }
}

class ArticleScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Article',
    tabBarIcon: tabBarIcon('chrome-reader-mode'),
    tabBarButtonComponent: TouchableBounce,
  };

  render() {
    return <Article />;
  }
}

class ChatScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Chat',
    tabBarIcon: tabBarIcon('chat-bubble'),
    tabBarButtonComponent: TouchableBounce,
  };

  render() {
    return <Chat />;
  }
}

class ContactsScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Contacts',
    tabBarIcon: tabBarIcon('contacts'),
    tabBarButtonComponent: TouchableBounce,
  };

  render() {
    return <Contacts />;
  }
}

export default createBottomTabNavigator(
  {
    AlbumsScreen,
    ArticleScreen,
    ChatScreen,
    ContactsScreen,
  },
  {
    initialRouteName: 'AlbumsScreen',
  }
);
