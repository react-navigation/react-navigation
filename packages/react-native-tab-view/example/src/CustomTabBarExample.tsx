import * as React from 'react';
import { View, Text, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import {
  TabView,
  SceneMap,
  NavigationState,
  SceneRendererProps,
} from 'react-native-tab-view';
import Animated from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import Albums from './Shared/Albums';
import Article from './Shared/Article';
import Chat from './Shared/Chat';
import Contacts from './Shared/Contacts';

type Route = {
  key: string;
  title: string;
  icon: string;
};

type State = NavigationState<Route>;

export default class CustomTabBarExample extends React.Component<{}, State> {
  static title = 'Custom tab bar';
  static backgroundColor = '#fafafa';
  static tintColor = '#263238';
  static appbarElevation = 4;
  static statusBarStyle = 'dark-content' as 'dark-content';

  state = {
    index: 0,
    routes: [
      { key: 'contacts', title: 'Contacts', icon: 'ios-people' },
      { key: 'albums', title: 'Albums', icon: 'ios-albums' },
      { key: 'article', title: 'Article', icon: 'ios-paper' },
      { key: 'chat', title: 'Chat', icon: 'ios-chatboxes' },
    ],
  };

  private handleIndexChange = (index: number) =>
    this.setState({
      index,
    });

  private renderItem = ({
    navigationState,
    position,
  }: {
    navigationState: State;
    position: Animated.Node<number>;
  }) => ({ route, index }: { route: Route; index: number }) => {
    const inputRange = navigationState.routes.map((_, i) => i);

    const activeOpacity = Animated.interpolate(position, {
      inputRange,
      outputRange: inputRange.map((i: number) => (i === index ? 1 : 0)),
    });
    const inactiveOpacity = Animated.interpolate(position, {
      inputRange,
      outputRange: inputRange.map((i: number) => (i === index ? 0 : 1)),
    });

    return (
      <View style={styles.tab}>
        <Animated.View style={[styles.item, { opacity: inactiveOpacity }]}>
          <Ionicons
            name={route.icon}
            size={26}
            style={[styles.icon, styles.inactive]}
          />
          <Text style={[styles.label, styles.inactive]}>{route.title}</Text>
        </Animated.View>
        <Animated.View
          style={[styles.item, styles.activeItem, { opacity: activeOpacity }]}
        >
          <Ionicons
            name={route.icon}
            size={26}
            style={[styles.icon, styles.active]}
          />
          <Text style={[styles.label, styles.active]}>{route.title}</Text>
        </Animated.View>
      </View>
    );
  };

  private renderTabBar = (
    props: SceneRendererProps & { navigationState: State }
  ) => (
    <View style={styles.tabbar}>
      {props.navigationState.routes.map((route: Route, index: number) => {
        return (
          <TouchableWithoutFeedback
            key={route.key}
            onPress={() => props.jumpTo(route.key)}
          >
            {this.renderItem(props)({ route, index })}
          </TouchableWithoutFeedback>
        );
      })}
    </View>
  );

  private renderScene = SceneMap({
    contacts: Contacts,
    albums: Albums,
    article: Article,
    chat: Chat,
  });

  render() {
    return (
      <TabView
        navigationState={this.state}
        renderScene={this.renderScene}
        renderTabBar={this.renderTabBar}
        tabBarPosition="bottom"
        onIndexChange={this.handleIndexChange}
      />
    );
  }
}

const styles = StyleSheet.create({
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
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 4.5,
  },
  activeItem: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  active: {
    color: '#0084ff',
  },
  inactive: {
    color: '#939393',
  },
  icon: {
    height: 26,
    width: 26,
  },
  label: {
    fontSize: 10,
    marginTop: 3,
    marginBottom: 1.5,
    backgroundColor: 'transparent',
  },
});
