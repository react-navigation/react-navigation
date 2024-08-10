import { Button } from '@react-navigation/elements';
import type { PathConfigMap } from '@react-navigation/native';
import {
  createStackNavigator,
  HeaderStyleInterpolators,
  type StackScreenProps,
} from '@react-navigation/stack';
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

const linking: PathConfigMap<MixedHeaderStackParams> = {
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
          Navigate to albums
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

export function MixedHeaderMode() {
  return (
    <SimpleStack.Navigator
      screenOptions={{
        headerStyleInterpolator: HeaderStyleInterpolators.forUIKit,
      }}
    >
      <SimpleStack.Group
        screenOptions={{
          animation: 'slide_from_right',
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
          animation: 'slide_from_bottom',
          headerMode: 'screen',
          title: 'Albums',
        }}
      />
    </SimpleStack.Navigator>
  );
}

MixedHeaderMode.title = 'Float + Screen Header Stack';
MixedHeaderMode.linking = linking;

const styles = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    padding: 12,
  },
});
