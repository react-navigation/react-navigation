import { Button } from '@react-navigation/elements';
import type { PathConfigMap } from '@react-navigation/native';
import {
  createStackNavigator,
  HeaderStyleInterpolators,
  type StackScreenProps,
} from '@react-navigation/stack';
import * as React from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';

import { COMMON_LINKING_CONFIG } from '../constants';
import { Albums } from '../Shared/Albums';
import { Article } from '../Shared/Article';
import { Contacts } from '../Shared/Contacts';
import { NewsFeed } from '../Shared/NewsFeed';

export type SimpleStackParams = {
  Article: { author: string } | undefined;
  NewsFeed: { date: number };
  Contacts: undefined;
  Albums: undefined;
};

const linking: PathConfigMap<SimpleStackParams> = {
  Article: COMMON_LINKING_CONFIG.Article,
  NewsFeed: COMMON_LINKING_CONFIG.NewsFeed,
  Contacts: 'contacts',
  Albums: 'albums',
};

const scrollEnabled = Platform.select({ web: true, default: false });

const ArticleScreen = ({
  navigation,
  route,
}: StackScreenProps<SimpleStackParams, 'Article'>) => {
  return (
    <ScrollView>
      <View style={styles.buttons}>
        <Button
          variant="filled"
          onPress={() => navigation.replace('NewsFeed', { date: Date.now() })}
        >
          Replace with feed
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

const NewsFeedScreen = ({
  route,
  navigation,
}: StackScreenProps<SimpleStackParams, 'NewsFeed'>) => {
  return (
    <ScrollView>
      <View style={styles.buttons}>
        <Button
          variant="filled"
          onPress={() => navigation.navigate('Contacts')}
        >
          Navigate to contacts
        </Button>
        <Button variant="tinted" onPress={() => navigation.goBack()}>
          Go back
        </Button>
      </View>
      <NewsFeed scrollEnabled={scrollEnabled} date={route.params.date} />
    </ScrollView>
  );
};

const ContactsScreen = ({
  navigation,
}: StackScreenProps<SimpleStackParams, 'Contacts'>) => {
  const [query, setQuery] = React.useState('');

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        placeholder: 'Filter contacts',
        onChangeText: (e) => {
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

const AlbumsScreen = ({
  navigation,
}: StackScreenProps<SimpleStackParams, 'Albums'>) => {
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

const Stack = createStackNavigator<SimpleStackParams>();

export function SimpleStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyleInterpolator: HeaderStyleInterpolators.forUIKit,
      }}
    >
      <Stack.Screen
        name="Article"
        component={ArticleScreen}
        options={({ route }) => ({
          title: `Article by ${route.params?.author ?? 'Unknown'}`,
        })}
        initialParams={{ author: 'Gandalf' }}
      />
      <Stack.Screen
        name="NewsFeed"
        component={NewsFeedScreen}
        options={{ title: 'Feed' }}
      />
      <Stack.Screen
        name="Contacts"
        component={ContactsScreen}
        options={{
          headerSearchBarOptions: {
            placeholder: 'Filter contacts',
          },
        }}
      />
      <Stack.Screen
        name="Albums"
        component={AlbumsScreen}
        options={{ title: 'Albums' }}
      />
    </Stack.Navigator>
  );
}

SimpleStack.title = 'Simple Stack';
SimpleStack.linking = linking;

const styles = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    margin: 12,
  },
});
