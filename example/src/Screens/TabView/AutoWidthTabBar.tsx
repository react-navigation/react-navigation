import * as React from 'react';
import { StyleSheet } from 'react-native';
import {
  NavigationState,
  SceneMap,
  SceneRendererProps,
  TabBar,
  TabView,
} from 'react-native-tab-view';

import Albums from '../../Shared/Albums';
import Article from '../../Shared/Article';
import Chat from '../../Shared/Chat';
import Contacts from '../../Shared/Contacts';

type State = NavigationState<{
  key: string;
  title: string;
}>;

const renderScene = SceneMap({
  albums: () => <Albums />,
  contacts: () => <Contacts />,
  article: () => <Article />,
  chat: () => <Chat bottom />,
  long: () => <Article />,
  medium: () => <Article />,
});

const AutoWidthTabBar = () => {
  const [index, onIndexChange] = React.useState(1);
  const [routes] = React.useState([
    { key: 'article', title: 'Article' },
    { key: 'contacts', title: 'Contacts' },
    { key: 'albums', title: 'Albums' },
    { key: 'chat', title: 'Chat' },
    { key: 'long', title: 'long long long title' },
    { key: 'medium', title: 'medium title' },
  ]);

  const renderTabBar = (
    props: SceneRendererProps & { navigationState: State }
  ) => (
    <TabBar
      {...props}
      scrollEnabled
      indicatorStyle={styles.indicator}
      style={styles.tabbar}
      labelStyle={styles.label}
      tabStyle={styles.tabStyle}
    />
  );

  return (
    <TabView
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

AutoWidthTabBar.options = {
  title: 'Scrollable tab bar (auto width)',
  headerShadowVisible: false,
  headerTintColor: '#fff',
  headerStyle: {
    backgroundColor: '#3f51b5',
  },
};

export default AutoWidthTabBar;

const styles = StyleSheet.create({
  tabbar: {
    backgroundColor: '#3f51b5',
  },
  indicator: {
    backgroundColor: '#ffeb3b',
  },
  label: {
    fontWeight: '400',
  },
  tabStyle: {
    width: 'auto',
  },
});
