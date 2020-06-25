import * as React from 'react';
import { View, Platform, StyleSheet, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import type { ParamListBase } from '@react-navigation/native';
import {
  createStackNavigator,
  StackScreenProps,
} from '@react-navigation/stack';
import Article from '../Shared/Article';
import Albums from '../Shared/Albums';
import NewsFeed from '../Shared/NewsFeed';

type SimpleStackParams = {
  Article: { author: string } | undefined;
  NewsFeed: { date: number };
  Albums: undefined;
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
          mode="contained"
          onPress={() => navigation.replace('NewsFeed', { date: Date.now() })}
          style={styles.button}
        >
          Replace with feed
        </Button>
        <Button
          mode="outlined"
          onPress={() => navigation.pop()}
          style={styles.button}
        >
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
          mode="contained"
          onPress={() => navigation.navigate('Albums')}
          style={styles.button}
        >
          Navigate to album
        </Button>
        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          style={styles.button}
        >
          Go back
        </Button>
      </View>
      <NewsFeed scrollEnabled={scrollEnabled} date={route.params.date} />
    </ScrollView>
  );
};

const AlbumsScreen = ({
  navigation,
}: StackScreenProps<SimpleStackParams, 'Albums'>) => {
  return (
    <ScrollView>
      <View style={styles.buttons}>
        <Button
          mode="contained"
          onPress={() => navigation.push('Article', { author: 'Babel fish' })}
          style={styles.button}
        >
          Push article
        </Button>
        <Button
          mode="outlined"
          onPress={() => navigation.pop(2)}
          style={styles.button}
        >
          Pop by 2
        </Button>
      </View>
      <Albums scrollEnabled={scrollEnabled} />
    </ScrollView>
  );
};

const SimpleStack = createStackNavigator<SimpleStackParams>();

export default function SimpleStackScreen({
  navigation,
}: StackScreenProps<ParamListBase>) {
  navigation.setOptions({
    headerShown: false,
  });

  return (
    <SimpleStack.Navigator>
      <SimpleStack.Screen
        name="Article"
        component={ArticleScreen}
        options={({ route }) => ({
          title: `Article by ${route.params?.author ?? 'Unknown'}`,
        })}
        initialParams={{ author: 'Gandalf' }}
      />
      <SimpleStack.Screen
        name="NewsFeed"
        component={NewsFeedScreen}
        options={{ title: 'Feed' }}
      />
      <SimpleStack.Screen
        name="Albums"
        component={AlbumsScreen}
        options={{ title: 'Albums' }}
      />
    </SimpleStack.Navigator>
  );
}

const styles = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
    padding: 8,
  },
  button: {
    margin: 8,
  },
});
