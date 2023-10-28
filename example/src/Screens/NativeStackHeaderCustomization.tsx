import { Button } from '@react-navigation/elements';
import type { ParamListBase } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
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
import { Appbar } from 'react-native-paper';

import { Albums } from '../Shared/Albums';
import { Article } from '../Shared/Article';
import { NewsFeed } from '../Shared/NewsFeed';

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

const NewsFeedScreen = ({
  route,
  navigation,
}: NativeStackScreenProps<NativeStackParams, 'NewsFeed'>) => {
  return (
    <ScrollView>
      <View style={styles.buttons}>
        <Button variant="filled" onPress={() => navigation.push('Albums')}>
          Push Albums
        </Button>
        <Button variant="tinted" onPress={() => navigation.goBack()}>
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
          variant="filled"
          onPress={() =>
            navigation.navigate('Article', { author: 'Babel fish' })
          }
        >
          Navigate to article
        </Button>
        <Button variant="tinted" onPress={() => navigation.pop(2)}>
          Pop by 2
        </Button>
      </View>
      <Albums scrollEnabled={scrollEnabled} />
    </ScrollView>
  );
};

const Stack = createNativeStackNavigator<NativeStackParams>();

export function NativeStackHeaderCustomization({
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
    <Stack.Navigator>
      <Stack.Screen
        name="Article"
        component={ArticleScreen}
        options={({ route, navigation }) => ({
          title: `Article by ${route.params?.author ?? 'Unknown'}`,
          headerTintColor: 'white',
          headerTitle: ({ tintColor }) => (
            <Appbar.Action
              color={tintColor}
              icon="signal-5g"
              onPress={onPress}
            />
          ),
          headerLeft: ({ tintColor, canGoBack }) =>
            canGoBack ? (
              <Appbar.Action
                color={tintColor}
                icon="arrow-left-thick"
                onPress={navigation.goBack}
              />
            ) : null,
          headerRight: ({ tintColor }) => (
            <Appbar.Action color={tintColor} icon="music" onPress={onPress} />
          ),
          headerBackground: () => (
            <Image
              source={require('../../assets/cpu.jpg')}
              resizeMode="cover"
              style={styles.headerBackground}
            />
          ),
        })}
        initialParams={{ author: 'Gandalf' }}
      />
      <Stack.Screen
        name="NewsFeed"
        component={NewsFeedScreen}
        options={{
          title: 'Feed',
          headerLeft: ({ tintColor }) => (
            <Appbar.Action color={tintColor} icon="spa" onPress={onPress} />
          ),
        }}
      />
      <Stack.Screen
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
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    padding: 12,
  },
  headerBackground: {
    height: undefined,
    width: undefined,
    flex: 1,
  },
});
