import { Button } from '@react-navigation/elements';
import type { ParamListBase, PathConfigMap } from '@react-navigation/native';
import {
  createStackNavigator,
  HeaderStyleInterpolators,
  type StackScreenProps,
  TransitionPresets,
} from '@react-navigation/stack';
import * as React from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';

import { COMMON_LINKING_CONFIG } from '../constants';
import { Albums } from '../Shared/Albums';
import { Article } from '../Shared/Article';
import { NewsFeed } from '../Shared/NewsFeed';

export type MixedHeaderStackParams = {
  Article: { author: string } | undefined;
  NewsFeed: { date: number };
  Albums: undefined;
};

export const mixedHeaderStackLinking: PathConfigMap<MixedHeaderStackParams> = {
  Article: COMMON_LINKING_CONFIG.Article,
  NewsFeed: COMMON_LINKING_CONFIG.NewsFeed,
  Albums: 'albums',
};

const scrollEnabled = Platform.select({ web: true, default: false });

const ArticleScreen = ({
  navigation,
  route,
}: StackScreenProps<MixedHeaderStackParams, 'Article'>) => {
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
}: StackScreenProps<MixedHeaderStackParams, 'NewsFeed'>) => {
  return (
    <ScrollView>
      <View style={styles.buttons}>
        <Button variant="filled" onPress={() => navigation.push('Albums')}>
          Navigate to album
        </Button>
        <Button variant="tinted" onPress={() => navigation.pop()}>
          Pop screen
        </Button>
      </View>
      <NewsFeed scrollEnabled={scrollEnabled} date={route.params.date} />
    </ScrollView>
  );
};

const AlbumsScreen = ({
  navigation,
}: StackScreenProps<MixedHeaderStackParams, 'Albums'>) => {
  return (
    <ScrollView>
      <View style={styles.buttons}>
        <Button
          variant="filled"
          onPress={() => navigation.push('Article', { author: 'Babel fish' })}
        >
          Push article
        </Button>
        <Button variant="tinted" onPress={() => navigation.pop()}>
          Pop screen
        </Button>
      </View>
      <Albums scrollEnabled={scrollEnabled} />
    </ScrollView>
  );
};

const SimpleStack = createStackNavigator<MixedHeaderStackParams>();

export function MixedHeaderMode({
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
    gap: 12,
    padding: 12,
  },
});
