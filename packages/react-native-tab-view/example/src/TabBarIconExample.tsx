import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  TabView,
  TabBar,
  SceneMap,
  NavigationState,
  SceneRendererProps,
} from 'react-native-tab-view';
import Article from './Shared/Article';
import Chat from './Shared/Chat';
import Contacts from './Shared/Contacts';

type Route = {
  key: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
};

type State = NavigationState<Route>;

const TabBarIconExample = () => {
  const [index, onIndexChange] = React.useState(0);
  const [routes] = React.useState<Route[]>([
    { key: 'chat', icon: 'md-chatbubbles' },
    { key: 'contacts', icon: 'md-people' },
    { key: 'article', icon: 'md-list' },
  ]);

  const renderIcon = ({ route, color }: { route: Route; color: string }) => (
    <Ionicons name={route.icon} size={24} color={color} />
  );

  const renderTabBar = (
    props: SceneRendererProps & { navigationState: State }
  ) => (
    <TabBar
      {...props}
      indicatorStyle={styles.indicator}
      renderIcon={renderIcon}
      style={styles.tabbar}
    />
  );

  const renderScene = SceneMap({
    chat: Chat,
    contacts: Contacts,
    article: Article,
  });

  return (
    <TabView
      lazy
      navigationState={{
        index,
        routes,
      }}
      renderScene={renderScene}
      renderTabBar={renderTabBar}
      onIndexChange={onIndexChange}
    />
  );
};

TabBarIconExample.title = 'Top tab bar with icons';
TabBarIconExample.backgroundColor = '#e91e63';
TabBarIconExample.appbarElevation = 0;

export default TabBarIconExample;

const styles = StyleSheet.create({
  tabbar: {
    backgroundColor: '#e91e63',
  },
  indicator: {
    backgroundColor: '#ffeb3b',
  },
});
