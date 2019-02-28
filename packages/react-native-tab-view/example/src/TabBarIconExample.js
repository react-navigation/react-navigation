/* @flow */

import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  TabView,
  TabBar,
  SceneMap,
  type NavigationState,
} from 'react-native-tab-view';
import Article from './Shared/Article';
import Chat from './Shared/Chat';
import Contacts from './Shared/Contacts';

type State = NavigationState<{
  key: string,
  icon: string,
}>;

export default class TabBarIconExample extends React.Component<*, State> {
  static title = 'Top tab bar with icons';
  static backgroundColor = '#e91e63';
  static appbarElevation = 0;

  state = {
    index: 0,
    routes: [
      { key: 'chat', icon: 'md-chatbubbles' },
      { key: 'contacts', icon: 'md-contact' },
      { key: 'article', icon: 'md-list' },
    ],
  };

  _handleIndexChange = index =>
    this.setState({
      index,
    });

  _renderIcon = ({ route, color }) => (
    <Ionicons name={route.icon} size={24} color={color} />
  );

  _renderTabBar = props => {
    return (
      <TabBar
        {...props}
        indicatorStyle={styles.indicator}
        renderIcon={this._renderIcon}
        style={styles.tabbar}
      />
    );
  };

  _renderScene = SceneMap({
    chat: Chat,
    contacts: Contacts,
    article: Article,
  });

  render() {
    return (
      <TabView
        lazy
        style={this.props.style}
        navigationState={this.state}
        renderScene={this._renderScene}
        renderTabBar={this._renderTabBar}
        onIndexChange={this._handleIndexChange}
      />
    );
  }
}

const styles = StyleSheet.create({
  tabbar: {
    backgroundColor: '#e91e63',
  },
  indicator: {
    backgroundColor: '#ffeb3b',
  },
});
