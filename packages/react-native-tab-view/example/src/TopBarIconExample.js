/* @flow */

import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view';
import Article from './shared/Article';
import Chat from './shared/Chat';
import Contacts from './shared/Contacts';

import type { Route, NavigationState } from 'react-native-tab-view/types';

type State = NavigationState<
  Route<{
    key: string,
    icon: string,
  }>
>;

export default class TopBarIconExample extends React.Component<*, State> {
  static title = 'Icon only top bar';
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

  _renderIcon = ({ route }) => (
    <Ionicons name={route.icon} size={24} color="white" />
  );

  _renderHeader = props => {
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
      <TabViewAnimated
        style={[styles.container, this.props.style]}
        navigationState={this.state}
        renderScene={this._renderScene}
        renderHeader={this._renderHeader}
        onIndexChange={this._handleIndexChange}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabbar: {
    backgroundColor: '#e91e63',
  },
  indicator: {
    backgroundColor: '#ffeb3b',
  },
});
