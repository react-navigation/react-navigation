/* @flow */

import * as React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import {
  TabViewAnimated,
  TabBar,
  TabViewPagerExperimental,
  SceneMap,
} from 'react-native-tab-view';
import * as GestureHandler from 'react-native-gesture-handler';
import Albums from './shared/Albums';
import Article from './shared/Article';
import Chat from './shared/Chat';

import type { Route, NavigationState } from 'react-native-tab-view/types';

type State = NavigationState<
  Route<{
    key: string,
    title: string,
  }>
>;

const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};

export default class NativeDriverExample extends React.Component<*, State> {
  static title = 'Native animations';
  static backgroundColor = '#f44336';
  static appbarElevation = 0;

  state = {
    index: 1,
    routes: [
      { key: 'article', title: 'Article' },
      { key: 'albums', title: 'Albums' },
      { key: 'chat', title: 'Chat' },
    ],
  };

  _handleIndexChange = index =>
    this.setState({
      index,
    });

  _renderHeader = props => (
    <TabBar {...props} style={styles.tabbar} labelStyle={styles.label} />
  );

  _renderScene = SceneMap({
    article: Article,
    albums: Albums,
    chat: Chat,
  });

  _renderPager = props => (
    <TabViewPagerExperimental GestureHandler={GestureHandler} {...props} />
  );

  render() {
    return (
      <TabViewAnimated
        style={[styles.container, this.props.style]}
        navigationState={this.state}
        renderScene={this._renderScene}
        renderHeader={this._renderHeader}
        renderPager={this._renderPager}
        onIndexChange={this._handleIndexChange}
        initialLayout={initialLayout}
        useNativeDriver
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabbar: {
    backgroundColor: '#f44336',
  },
  label: {
    color: '#fff',
    fontWeight: '400',
  },
});
