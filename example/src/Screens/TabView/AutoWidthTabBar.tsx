import { useLocale } from '@react-navigation/native';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';

import { Albums } from '../../Shared/Albums';
import { Article } from '../../Shared/Article';
import { Chat } from '../../Shared/Chat';
import { Contacts } from '../../Shared/Contacts';

type Route = {
  key: string;
  title: string;
};

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

  const renderTabBar: React.ComponentProps<
    typeof TabView<Route>
  >['renderTabBar'] = (props) => (
    <TabBar
      {...props}
      scrollEnabled
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
};

const styles = StyleSheet.create({
  tabbarContentContainer: {
    paddingHorizontal: 10,
  },
  tabStyle: {
    width: 'auto',
  },
});
