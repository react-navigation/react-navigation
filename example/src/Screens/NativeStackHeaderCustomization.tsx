import type { ParamListBase } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import * as React from 'react';
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Appbar, Button } from 'react-native-paper';

import Albums from '../Shared/Albums';
import Article from '../Shared/Article';
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
    <ScrollView>
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
      gestureEnabled: false,
    });
  }, [navigation]);

  const onPress = () => {
    Alert.alert(
      'Never gonna give you up!',
      'Never gonna let you down! Never gonna run around and desert you!'
    );
  };

  return (
    <NativeStack.Navigator>
      <NativeStack.Screen
        name="Article"
        component={ArticleScreen}
        options={({ route }) => ({
          title: `Article by ${route.params?.author ?? 'Unknown'}`,
          headerTintColor: 'white',
          headerTitle: ({ tintColor }) => (
            <Appbar.Action
              color={tintColor}
              icon="signal-5g"
              onPress={onPress}
            />
          ),
          headerRight: ({ tintColor }) => (
            <Appbar.Action
              color={tintColor}
              icon="bookmark"
              onPress={onPress}
            />
          ),
          headerBackground: () => (
            <Image
              source={require('../../assets/album-art-19.jpg')}
              style={styles.headerBackground}
            />
          ),
        })}
        initialParams={{ author: 'Gandalf' }}
      />
      <NativeStack.Screen
        name="NewsFeed"
        component={NewsFeedScreen}
        options={{
          title: 'Feed',
          headerLeft: ({ tintColor }) => (
            <Appbar.Action color={tintColor} icon="spa" onPress={onPress} />
          ),
        }}
      />
      <NativeStack.Screen
        name="Albums"
        component={AlbumsScreen}
        options={{
          title: 'Albums',
          headerTintColor: 'tomato',
          headerStyle: { backgroundColor: 'papayawhip' },
          headerBackVisible: true,
          headerLeft: ({ tintColor }) => (
            <Appbar.Action color={tintColor} icon="music" onPress={onPress} />
          ),
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
  headerBackground: {
    height: undefined,
    width: undefined,
    flex: 1,
    resizeMode: 'cover',
  },
});
