import { Button } from '@react-navigation/elements';
import {
  CommonActions,
  Link,
  StackActions,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
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
        <Link screen="ComponentsLink" params={{ screen: 'Albums' }}>
          Go to albums
        </Link>
        <Link
          screen="ComponentsLink"
          params={{ screen: 'Albums' }}
          action={StackActions.replace('Albums')}
        >
          Replace with albums
        </Link>

        <Button screen="Home" variant="filled">
          Go to Home
        </Button>

        <Button variant="tinted" action={CommonActions.goBack()}>
          Go back
        </Button>

        <Button
          variant="tinted"
          onPress={() =>
            navigation.replaceParams({
              author:
                route.params?.author === 'Gandalf' ? 'Babel fish' : 'Gandalf',
            })
          }
        >
          Replace params
        </Button>

        <Button
          variant="tinted"
          onPress={() =>
            navigation.pushParams({
              author:
                route.params?.author === 'Gandalf' ? 'Babel fish' : 'Gandalf',
            })
          }
        >
          Push params
        </Button>

        {Platform.OS === 'web' && (
          <Button
            onPress={() => {
              location.hash = 'frodo';
            }}
          >
            Add hash to URL
          </Button>
        )}
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
        <Link
          screen="ComponentsLink"
          params={{ screen: 'Article', params: { author: 'Babel' } }}
        >
          Go to Article
        </Link>
        <Button
          screen="ComponentsLink"
          params={{ screen: 'Article', params: { author: 'Babel' } }}
          variant="filled"
        >
          Go to Article
        </Button>
        <Button variant="tinted" onPress={() => navigation.goBack()}>
          Go back
        </Button>
      </View>
      <Albums scrollEnabled={scrollEnabled} />
    </ScrollView>
  );
};

const ComponentsLinkNavigator = createStackNavigator({
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

export const ComponentsLink = {
  screen: ComponentsLinkNavigator,
  title: 'Components - Link',
};

const styles = StyleSheet.create({
  buttons: {
    gap: 12,
    padding: 12,
  },
});
