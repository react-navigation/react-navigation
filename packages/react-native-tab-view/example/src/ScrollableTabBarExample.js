/* @flow */

import * as React from 'react';
import { StyleSheet } from 'react-native';
import {
  TabView,
  TabBar,
  SceneMap,
  type NavigationState,
} from 'react-native-tab-view';
import Article from './Shared/Article';
import Albums from './Shared/Albums';
import Chat from './Shared/Chat';
import Contacts from './Shared/Contacts';

type State = NavigationState<{
  key: string,
  title: string,
}>;

export default class ScrollableTabBarExample extends React.Component<*, State> {
  static title = 'Scrollable top bar';
  static backgroundColor = '#3f51b5';
  static appbarElevation = 0;

  state = {
    index: 1,
    routes: [
      { key: 'article', title: 'Article' },
      { key: 'contacts', title: 'Contacts' },
      { key: 'albums', title: 'Albums' },
      { key: 'chat', title: 'Chat' },
    ],
  };

  _handleIndexChange = index =>
    this.setState({
      index,
    });

  _renderTabBar = props => (
    <TabBar
      {...props}
      scrollEnabled
      indicatorStyle={styles.indicator}
      style={styles.tabbar}
      tabStyle={styles.tab}
      labelStyle={styles.label}
    />
  );

  _renderScene = SceneMap({
    albums: Albums,
    contacts: Contacts,
    article: Article,
    chat: Chat,
  });

  render() {
    return (
      <TabView
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
    backgroundColor: '#3f51b5',
  },
  tab: {
    width: 120,
  },
  indicator: {
    backgroundColor: '#ffeb3b',
  },
  label: {
    fontWeight: '400',
  },
});
