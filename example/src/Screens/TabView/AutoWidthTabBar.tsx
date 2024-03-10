import { useLocale } from '@react-navigation/native';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import {
  type NavigationState,
  SceneMap,
  type SceneRendererProps,
  TabBar,
  TabView,
} from 'react-native-tab-view';

import { Albums } from '../../Shared/Albums';
import { Article } from '../../Shared/Article';
import { Chat } from '../../Shared/Chat';
import { Contacts } from '../../Shared/Contacts';

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

export const AutoWidthTabBar = () => {
  const { direction } = useLocale();
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
      contentContainerStyle={styles.tabbarContentContainer}
      tabStyle={styles.tabStyle}
      gap={20}
      direction={direction}
    />
  );

  return (
    <TabView
      navigationState={{
        index,
        routes,
      }}
      direction={direction}
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

const styles = StyleSheet.create({
  tabbar: {
    backgroundColor: '#3f51b5',
  },
  tabbarContentContainer: {
    paddingHorizontal: 10,
  },
  indicator: {
    backgroundColor: '#ffeb3b',
  },
  tabStyle: {
    width: 'auto',
  },
});
