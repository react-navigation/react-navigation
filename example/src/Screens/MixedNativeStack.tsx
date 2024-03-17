import { Button } from '@react-navigation/elements';
import type { PathConfigMap } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from '@react-navigation/native-stack';
import * as React from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';

import { COMMON_LINKING_CONFIG } from '../constants';
import { Albums } from '../Shared/Albums';
import { Article } from '../Shared/Article';

export type MixedNativeStackParams = {
  Article: { author: string };
  Albums: undefined;
};

const linking: PathConfigMap<MixedNativeStackParams> = {
  Article: COMMON_LINKING_CONFIG.Article,
  Albums: 'albums',
};

const scrollEnabled = Platform.select({ web: true, default: false });

const ArticleScreen = ({
  navigation,
  route,
}: NativeStackScreenProps<MixedNativeStackParams, 'Article'>) => {
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
          Push album
        </Button>
      </View>
      <Article
        author={{ name: route.params.author }}
        scrollEnabled={scrollEnabled}
      />
    </ScrollView>
  );
};

const AlbumsScreen = ({
  navigation,
}: NativeStackScreenProps<MixedNativeStackParams>) => {
  return (
    <ScrollView>
      <View style={styles.buttons}>
        <Button variant="filled" onPress={() => navigation.push('Albums')}>
          Push album
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

const Stack = createNativeStackNavigator<MixedNativeStackParams>();

export function MixedNativeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Article"
        component={ArticleScreen}
        options={({ route }) => ({
          title: `Article by ${route.params.author}`,
        })}
        initialParams={{ author: 'Gandalf' }}
      />
      <Stack.Screen
        name="Albums"
        component={AlbumsScreen}
        options={{
          title: 'Albums',
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
}

MixedNativeStack.title = 'Native + Modal Stack';
MixedNativeStack.linking = linking;

const styles = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    padding: 12,
  },
});
