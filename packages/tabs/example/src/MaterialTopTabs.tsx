import * as React from 'react';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import Albums from './Shared/Albums';
import Article from './Shared/Article';
import Contacts from './Shared/Contacts';

class AlbumsScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Albums',
  };

  render() {
    return <Albums />;
  }
}

class ArticleScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Article',
  };

  render() {
    return <Article />;
  }
}

class ContactsScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Contacts',
  };

  render() {
    return <Contacts />;
  }
}

export default createMaterialTopTabNavigator({
  AlbumsScreen,
  ArticleScreen,
  ContactsScreen,
});
