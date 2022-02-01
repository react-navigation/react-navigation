import type { ParamListBase } from '@react-navigation/native';
import {
  createStackNavigator,
  HeaderStyleInterpolators,
  StackScreenProps,
  TransitionPresets,
} from '@react-navigation/stack';
import * as React from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';

import Albums from '../Shared/Albums';
import Article from '../Shared/Article';
import NewsFeed from '../Shared/NewsFeed';

export type SimpleStackParams = {
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
}: StackScreenProps<SimpleStackParams, 'NewsFeed'>) => {
  return (
    <ScrollView>
      <View style={styles.buttons}>
        <Button
          mode="contained"
          onPress={() => navigation.push('Albums')}
          style={styles.button}
        >
          Navigate to album
        </Button>
        <Button
          mode="outlined"
          onPress={() => navigation.pop()}
          style={styles.button}
        >
          Pop screen
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
          onPress={() => navigation.pop()}
          style={styles.button}
        >
          Pop screen
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
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <SimpleStack.Navigator
      screenOptions={{
        headerStyleInterpolator: HeaderStyleInterpolators.forUIKit,
      }}
    >
      <SimpleStack.Group
        screenOptions={{
          ...TransitionPresets.SlideFromRightIOS,
          headerMode: 'float',
        }}
      >
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
      </SimpleStack.Group>
      <SimpleStack.Screen
        name="Albums"
        component={AlbumsScreen}
        options={{
          ...TransitionPresets.ModalSlideFromBottomIOS,
          headerMode: 'screen',
          title: 'Albums',
        }}
      />
    </SimpleStack.Navigator>
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
