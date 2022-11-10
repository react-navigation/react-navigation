import * as React from 'react';
import {
  Animated,
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import {
  TabView,
  SceneMap,
  NavigationState,
  SceneRendererProps,
} from 'react-native-tab-view';
import { Ionicons } from '@expo/vector-icons';
import Albums from './Shared/Albums';
import Article from './Shared/Article';
import Chat from './Shared/Chat';
import Contacts from './Shared/Contacts';

type Route = {
  key: string;
  title: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
};

type State = NavigationState<Route>;

const CustomTabBarExample = () => {
  const [index, onIndexChange] = React.useState(0);
  const [routes] = React.useState<Route[]>([
    { key: 'contacts', title: 'Contacts', icon: 'ios-people' },
    { key: 'albums', title: 'Albums', icon: 'ios-albums' },
    { key: 'article', title: 'Article', icon: 'ios-document' },
    { key: 'chat', title: 'Chat', icon: 'ios-chatbubble' },
  ]);

  const renderItem =
    ({
      navigationState,
      position,
    }: {
      navigationState: State;
      position: Animated.AnimatedInterpolation<number>;
    }) =>
    ({ route, index }: { route: Route; index: number }) => {
      const inputRange = navigationState.routes.map((_, i) => i);

      const activeOpacity = position.interpolate({
        inputRange,
        outputRange: inputRange.map((i: number) => (i === index ? 1 : 0)),
      });
      const inactiveOpacity = position.interpolate({
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

  const renderTabBar = (
    props: SceneRendererProps & { navigationState: State }
  ) => (
    <View style={styles.tabbar}>
      {props.navigationState.routes.map((route: Route, index: number) => {
        return (
          <TouchableWithoutFeedback
            key={route.key}
            onPress={() => props.jumpTo(route.key)}
          >
            {renderItem(props)({ route, index })}
          </TouchableWithoutFeedback>
        );
      })}
    </View>
  );

  const renderScene = SceneMap({
    contacts: Contacts,
    albums: Albums,
    article: Article,
    chat: Chat,
  });

  return (
    <TabView
      navigationState={{
        index,
        routes,
      }}
      renderScene={renderScene}
      renderTabBar={renderTabBar}
      tabBarPosition="bottom"
      onIndexChange={onIndexChange}
    />
  );
};

CustomTabBarExample.title = 'Custom tab bar';
CustomTabBarExample.backgroundColor = '#fafafa';
CustomTabBarExample.appbarElevation = 0;
CustomTabBarExample.tintColor = '#263238';
CustomTabBarExample.statusBarStyle = 'dark-content' as 'dark-content';

export default CustomTabBarExample;

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
