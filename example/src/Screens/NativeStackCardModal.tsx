import { Button } from '@react-navigation/elements';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  createNativeStackScreen,
} from '@react-navigation/native-stack';
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
        <Button
          variant="filled"
          onPress={() => navigation.push('Article', { author: 'Dalek' })}
        >
          Push article
        </Button>
        <Button variant="tinted" onPress={() => navigation.goBack()}>
          Go back
        </Button>
        <Button variant="filled" onPress={() => navigation.push('Albums')}>
          Push albums
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
        <Button variant="filled" onPress={() => navigation.push('Albums')}>
          Push albums
        </Button>
        <Button variant="tinted" onPress={() => navigation.goBack()}>
          Go back
        </Button>
        <Button
          variant="filled"
          onPress={() => navigation.push('Article', { author: 'The Doctor' })}
        >
          Push article
        </Button>
      </View>
      <Albums scrollEnabled={scrollEnabled} />
    </ScrollView>
  );
};

const NativeStackCardModalNavigator = createNativeStackNavigator({
  screens: {
    Article: createNativeStackScreen({
      screen: ArticleScreen,
      options: ({ route }) => ({
        title: `Article by ${route.params?.author ?? 'Unknown'}`,
      }),
      initialParams: { author: 'Gandalf' },
      linking: COMMON_LINKING_CONFIG.Article,
    }),
    Albums: createNativeStackScreen({
      screen: AlbumsScreen,
      options: {
        title: 'Albums',
        presentation: 'modal',
      },
    }),
  },
});

export const NativeStackCardModal = {
  screen: NativeStackCardModalNavigator,
  title: 'Native Stack - Card + Modal',
};

const styles = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    padding: 12,
  },
});
