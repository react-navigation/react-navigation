import { Button } from '@react-navigation/elements';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  createStackNavigator,
  createStackScreen,
} from '@react-navigation/stack';
import * as React from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';

import { COMMON_LINKING_CONFIG } from '../constants';
import { Albums } from '../Shared/Albums';
import { Article } from '../Shared/Article';
import { Contacts } from '../Shared/Contacts';
import { NewsFeed } from '../Shared/NewsFeed';

const scrollEnabled = Platform.select({ web: true, default: false });

const ArticleScreen = () => {
  const navigation = useNavigation('Article');
  const route = useRoute('Article');

  return (
    <ScrollView>
      <View style={styles.buttons}>
        <Button
          variant="filled"
          onPress={() => navigation.navigate('NewsFeed', { date: Date.now() })}
        >
          Navigate to feed
        </Button>
        <Button variant="filled" onPress={() => navigation.popTo('Albums')}>
          Pop to albums
        </Button>
        <Button
          variant="tinted"
          onPress={() =>
            navigation.setParams({
              author:
                route.params?.author === 'Gandalf' ? 'Babel fish' : 'Gandalf',
            })
          }
        >
          Update params
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
        <Button variant="filled" onPress={() => navigation.replace('Contacts')}>
          Replace with contacts
        </Button>
        <Button variant="tinted" onPress={() => navigation.popTo('Home')}>
          Pop to home
        </Button>
        <Button variant="tinted" onPress={() => navigation.goBack()}>
          Go back
        </Button>
      </View>
      <NewsFeed scrollEnabled={scrollEnabled} date={route.params.date} />
    </ScrollView>
  );
};

const ContactsScreen = () => {
  const navigation = useNavigation('Contacts');
  const [query, setQuery] = React.useState('');

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        placeholder: 'Filter contacts',
        onChange: (e) => {
          setQuery(e.nativeEvent.text);
        },
      },
    });
  }, [navigation]);

  return (
    <Contacts
      query={query}
      ListHeaderComponent={
        <View style={styles.buttons}>
          <Button variant="filled" onPress={() => navigation.push('Albums')}>
            Push albums
          </Button>
          <Button variant="tinted" onPress={() => navigation.goBack()}>
            Go back
          </Button>
        </View>
      }
    />
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
        <Button variant="tinted" onPress={() => navigation.pop(2)}>
          Pop by 2
        </Button>
      </View>
      <Albums scrollEnabled={scrollEnabled} />
    </ScrollView>
  );
};

const StackBasicNavigator = createStackNavigator({
  screens: {
    Article: createStackScreen({
      screen: ArticleScreen,
      options: ({ route }) => ({
        title: `Article by ${route.params?.author ?? 'Unknown'}`,
      }),
      initialParams: { author: 'Gandalf' },
      getId: ({ params }) => params?.author,
      linking: COMMON_LINKING_CONFIG.Article,
    }),
    NewsFeed: createStackScreen({
      screen: NewsFeedScreen,
      options: { title: 'Feed' },
      linking: COMMON_LINKING_CONFIG.NewsFeed,
    }),
    Contacts: createStackScreen({
      screen: ContactsScreen,
      options: {
        headerSearchBarOptions: {
          placeholder: 'Filter contacts',
        },
      },
      linking: 'contacts',
    }),
    Albums: createStackScreen({
      screen: AlbumsScreen,
      options: { title: 'Albums' },
      linking: 'albums',
    }),
  },
});

export const StackBasic = {
  screen: StackBasicNavigator,
  title: 'Stack - Basic',
};

const styles = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    margin: 12,
  },
});
