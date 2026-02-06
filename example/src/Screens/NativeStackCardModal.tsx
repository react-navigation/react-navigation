import { Button } from '@react-navigation/elements';
import type {
  NavigatorScreenParams,
  PathConfig,
  StaticScreenProps,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';

import { COMMON_LINKING_CONFIG } from '../constants';
import { Albums } from '../Shared/Albums';
import { Article } from '../Shared/Article';

type MixedNativeStackParamList = {
  Article: { author: string };
  Albums: undefined;
};

const linking = {
  screens: {
    Article: COMMON_LINKING_CONFIG.Article,
    Albums: 'albums',
  },
} satisfies PathConfig<NavigatorScreenParams<MixedNativeStackParamList>>;

const scrollEnabled = Platform.select({ web: true, default: false });

const ArticleScreen = ({
  navigation,
  route,
}: NativeStackScreenProps<MixedNativeStackParamList, 'Article'>) => {
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
          Push albums
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
}: NativeStackScreenProps<MixedNativeStackParamList>) => {
  return (
    <ScrollView>
      <View style={styles.buttons}>
        <Button variant="filled" onPress={() => navigation.push('Albums')}>
          Push albums
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

const Stack = createNativeStackNavigator<MixedNativeStackParamList>();

export function NativeStackCardModal(
  _: StaticScreenProps<NavigatorScreenParams<MixedNativeStackParamList>>
) {
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

NativeStackCardModal.title = 'Native Stack - Card + Modal';
NativeStackCardModal.linking = linking;

const styles = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    padding: 12,
  },
});
