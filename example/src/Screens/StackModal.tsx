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

const scrollEnabled = Platform.select({ web: true, default: false });

const ArticleScreen = () => {
  const route = useRoute('Article');
  const navigation = useNavigation('Article');

  return (
    <ScrollView>
      <View style={styles.buttons}>
        <Button variant="filled" onPress={() => navigation.push('Albums')}>
          Push albums
        </Button>
        <Button variant="tinted" onPress={() => navigation.goBack()}>
          Go back
        </Button>
      </View>
      <Article
        author={{ name: route.params?.author ?? 'Unknown' }}
        scrollEnabled={scrollEnabled}
      />
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
        <Button variant="tinted" onPress={() => navigation.goBack()}>
          Go back
        </Button>
      </View>
      <Albums scrollEnabled={scrollEnabled} />
    </ScrollView>
  );
};

const StackModalNavigator = createStackNavigator({
  screenOptions: { presentation: 'modal' },
  screens: {
    Article: createStackScreen({
      screen: ArticleScreen,
      options: ({ route }) => ({
        title: `Article by ${route.params?.author ?? 'Unknown'}`,
      }),
      initialParams: { author: 'Gandalf' },
      linking: COMMON_LINKING_CONFIG.Article,
    }),
    Albums: createStackScreen({
      screen: AlbumsScreen,
      options: { title: 'Albums' },
    }),
  },
});

export const StackModal = {
  screen: StackModalNavigator,
  title: 'Stack - Modal',
};

const styles = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    padding: 12,
  },
});
