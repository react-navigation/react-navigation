import { Button } from '@react-navigation/elements';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  createStackNavigator,
  createStackScreen,
} from '@react-navigation/stack';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';

import { COMMON_LINKING_CONFIG } from '../constants';
import { Albums } from '../Shared/Albums';
import { Article } from '../Shared/Article';
import { NewsFeed } from '../Shared/NewsFeed';

const scrollEnabled = Platform.select({ web: true, default: false });

const ArticleScreen = () => {
  const route = useRoute('Article');
  const navigation = useNavigation('Article');

  return (
    <ScrollView>
      <View style={styles.buttons}>
        <Button
          variant="filled"
          onPress={() => navigation.push('NewsFeed', { date: Date.now() })}
        >
          Push feed
        </Button>
        <Button variant="tinted" onPress={() => navigation.pop()}>
          Pop screen
        </Button>
      </View>
      <Article
        author={{ name: route.params?.author ?? 'Unknown' }}
        scrollEnabled={scrollEnabled}
      />
    </ScrollView>
  );
};

const NewsFeedScreen = () => {
  const route = useRoute('NewsFeed');
  const navigation = useNavigation('NewsFeed');

  return (
    <ScrollView>
      <View style={styles.buttons}>
        <Button variant="filled" onPress={() => navigation.push('Albums')}>
          Navigate to albums
        </Button>
        <Button variant="tinted" onPress={() => navigation.pop()}>
          Pop screen
        </Button>
      </View>
      <NewsFeed scrollEnabled={scrollEnabled} date={route.params.date} />
    </ScrollView>
  );
};

const AlbumsScreen = () => {
  const navigation = useNavigation('Albums');

  return (
    <ScrollView>
      <View style={styles.buttons}>
        <Button
          variant="filled"
          onPress={() => navigation.push('Article', { author: 'Babel fish' })}
        >
          Push article
        </Button>
        <Button variant="tinted" onPress={() => navigation.pop()}>
          Pop screen
        </Button>
      </View>
      <Albums scrollEnabled={scrollEnabled} />
    </ScrollView>
  );
};

const StackFloatScreenHeaderNavigator = createStackNavigator({
  initialRouteName: 'Article',
  screens: {
    Albums: createStackScreen({
      screen: AlbumsScreen,
      options: {
        animation: 'slide_from_bottom',
        headerMode: 'screen',
        title: 'Albums',
      },
    }),
  },
  groups: {
    FloatHeader: {
      screenOptions: {
        animation: 'slide_from_right',
        headerMode: 'float',
      },
      screens: {
        Article: createStackScreen({
          screen: ArticleScreen,
          options: ({ route }) => ({
            title: `Article by ${route.params?.author ?? 'Unknown'}`,
          }),
          initialParams: { author: 'Gandalf' },
          linking: COMMON_LINKING_CONFIG.Article,
        }),
        NewsFeed: createStackScreen({
          screen: NewsFeedScreen,
          options: { title: 'Feed' },
          linking: COMMON_LINKING_CONFIG.NewsFeed,
        }),
      },
    },
  },
});

export const StackFloatScreenHeader = {
  screen: StackFloatScreenHeaderNavigator,
  title: 'Stack - Float + Screen Header',
};

const styles = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    padding: 12,
  },
});
