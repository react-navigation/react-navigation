import { useLocale } from '@react-navigation/native';
import * as React from 'react';
import { SceneMap, ScrollViewAdapter, TabView } from 'react-native-tab-view';

import { Albums } from '../../Shared/Albums';
import { Article } from '../../Shared/Article';
import { Contacts } from '../../Shared/Contacts';

const renderScene = SceneMap({
  albums: () => <Albums />,
  contacts: () => <Contacts />,
  article: () => <Article />,
});

export function ScrollAdapter() {
  const { direction } = useLocale();
  const [index, onIndexChange] = React.useState(1);
  const [routes] = React.useState([
    { key: 'article', title: 'Article' },
    { key: 'contacts', title: 'Contacts' },
    { key: 'albums', title: 'Albums' },
  ]);

  return (
    <TabView
      navigationState={{
        index,
        routes,
      }}
      direction={direction}
      renderScene={renderScene}
      renderAdapter={(props) => <ScrollViewAdapter {...props} />}
      onIndexChange={onIndexChange}
    />
  );
}

ScrollAdapter.options = {
  title: 'ScrollView Adapter',
  headerShadowVisible: false,
};
