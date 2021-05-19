import * as React from 'react';
import { View, Platform, StyleSheet, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import type { ParamListBase } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import Article from '../Shared/Article';
import Albums from '../Shared/Albums';
import NewsFeed from '../Shared/NewsFeed';

export type NativeStackParams = {
  Article: { author: string } | undefined;
  NewsFeed: { date: number };
  Albums: undefined;
};

const scrollEnabled = Platform.select({ web: true, default: false });

const ArticleScreen = ({
  navigation,
  route,
}: NativeStackScreenProps<NativeStackParams, 'Article'>) => {
  return (
    <ScrollView>
      <View style={styles.buttons}>
        <Button
          mode="contained"
          onPress={() => navigation.push('NewsFeed', { date: Date.now() })}
          style={styles.button}
        >
          Push feed
        </Button>
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
}: NativeStackScreenProps<NativeStackParams, 'NewsFeed'>) => {
  return (
    <ScrollView>
      <View style={styles.buttons}>
        <Button
          mode="contained"
          onPress={() => navigation.push('Albums')}
          style={styles.button}
        >
          Push Albums
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
}: NativeStackScreenProps<NativeStackParams, 'Albums'>) => {
  return (
    <ScrollView contentContainerStyle={{ paddingTop: 44 + 12 }}>
      <View style={styles.buttons}>
        <Button
          mode="contained"
          onPress={() =>
            navigation.navigate('Article', { author: 'Babel fish' })
          }
          style={styles.button}
        >
          Navigate to article
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

const NativeStack = createNativeStackNavigator<NativeStackParams>();

export default function NativeStackScreen({
  navigation,
}: NativeStackScreenProps<ParamListBase>) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <NativeStack.Navigator screenOptions={{ headerTopInsetEnabled: false }}>
      <NativeStack.Screen
        name="Article"
        component={ArticleScreen}
        options={({ route }) => ({
          title: `Article by ${route.params?.author ?? 'Unknown'}`,
          headerLargeTitle: true,
          headerLargeTitleShadowVisible: false,
        })}
        initialParams={{ author: 'Gandalf' }}
      />
      <NativeStack.Screen
        name="NewsFeed"
        component={NewsFeedScreen}
        options={{ title: 'Feed' }}
      />
      <NativeStack.Screen
        name="Albums"
        component={AlbumsScreen}
        options={{
          title: 'Albums',
          presentation: 'modal',
          headerShadowVisible: true,
          headerTranslucent: true,
          headerBlurEffect: 'light',
        }}
      />
    </NativeStack.Navigator>
  );
}

const styles = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  button: {
    margin: 8,
  },
});
