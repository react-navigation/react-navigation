/* @flow */

import * as React from 'react';
import {
  Animated,
  View,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import { TabViewAnimated, SceneMap } from 'react-native-tab-view';
import { Ionicons } from '@expo/vector-icons';
import Albums from './shared/Albums';
import Article from './shared/Article';
import Chat from './shared/Chat';
import Contacts from './shared/Contacts';

import type { Route, NavigationState } from 'react-native-tab-view/types';

const AnimatedIcon = Animated.createAnimatedComponent(Ionicons);

type State = NavigationState<
  Route<{
    key: string,
    title: string,
    icon: string,
  }>
>;

export default class TopBarIconExample extends React.Component<*, State> {
  static title = 'No animation';
  static backgroundColor = '#fafafa';
  static tintColor = '#263238';
  static appbarElevation = 4;
  static statusBarStyle = 'dark-content';

  state = {
    index: 0,
    routes: [
      { key: 'contacts', title: 'Contacts', icon: 'ios-people' },
      { key: 'albums', title: 'Albums', icon: 'ios-albums' },
      { key: 'article', title: 'Article', icon: 'ios-paper' },
      { key: 'chat', title: 'Chat', icon: 'ios-chatboxes' },
    ],
  };

  _handleIndexChange = index =>
    this.setState({
      index,
    });

  _renderLabel = ({ position, navigationState }) => ({ route, index }) => {
    const inputRange = navigationState.routes.map((x, i) => i);
    const outputRange = inputRange.map(
      inputIndex => (inputIndex === index ? '#2196f3' : '#939393')
    );
    const color = position.interpolate({
      inputRange,
      outputRange,
    });
    return (
      <Animated.Text style={[styles.label, { color }]}>
        {route.title}
      </Animated.Text>
    );
  };

  _renderIcon = ({ navigationState, position }) => ({ route, index }) => {
    const inputRange = navigationState.routes.map((x, i) => i);
    const filledOpacity = position.interpolate({
      inputRange,
      outputRange: inputRange.map(i => (i === index ? 1 : 0)),
    });
    const outlineOpacity = position.interpolate({
      inputRange,
      outputRange: inputRange.map(i => (i === index ? 0 : 1)),
    });
    return (
      <View style={styles.iconContainer}>
        <AnimatedIcon
          name={route.icon}
          size={26}
          style={[styles.icon, { opacity: filledOpacity }]}
        />
        <AnimatedIcon
          name={route.icon + '-outline'}
          size={26}
          style={[styles.icon, styles.outline, { opacity: outlineOpacity }]}
        />
      </View>
    );
  };

  _renderFooter = props => (
    <View style={styles.tabbar}>
      {props.navigationState.routes.map((route, index) => {
        return (
          <TouchableWithoutFeedback
            key={route.key}
            onPress={() => props.jumpTo(route.key)}
          >
            <Animated.View style={styles.tab}>
              {this._renderIcon(props)({ route, index })}
              {this._renderLabel(props)({ route, index })}
            </Animated.View>
          </TouchableWithoutFeedback>
        );
      })}
    </View>
  );

  _renderScene = SceneMap({
    contacts: Contacts,
    albums: Albums,
    article: Article,
    chat: Chat,
  });

  render() {
    return (
      <TabViewAnimated
        style={[styles.container, this.props.style]}
        navigationState={this.state}
        renderScene={this._renderScene}
        renderFooter={this._renderFooter}
        onIndexChange={this._handleIndexChange}
        animationEnabled={false}
        swipeEnabled={false}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fafafa',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0, 0, 0, .2)',
    paddingTop: 4.5,
  },
  iconContainer: {
    height: 26,
    width: 26,
  },
  icon: {
    position: 'absolute',
    textAlign: 'center',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    color: '#0084ff',
  },
  outline: {
    color: '#939393',
  },
  label: {
    fontSize: 10,
    marginTop: 3,
    marginBottom: 1.5,
    backgroundColor: 'transparent',
  },
});
