import { Button } from '@react-navigation/elements';
import {
  CommonActions,
  Link,
  type PathConfigMap,
  StackActions,
} from '@react-navigation/native';
import {
  createStackNavigator,
  type StackScreenProps,
} from '@react-navigation/stack';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';

import { COMMON_LINKING_CONFIG } from '../constants';
import { Albums } from '../Shared/Albums';
import { Article } from '../Shared/Article';

export type LinkComponentDemoParamList = {
  Article: { author: string };
  Albums: undefined;
};

const linking: PathConfigMap<LinkComponentDemoParamList> = {
  Article: COMMON_LINKING_CONFIG.Article,
  Albums: 'albums',
};

const scrollEnabled = Platform.select({ web: true, default: false });

const ArticleScreen = ({
  navigation,
  route,
}: StackScreenProps<LinkComponentDemoParamList, 'Article'>) => {
  return (
    <ScrollView>
      <View style={styles.buttons}>
        <Link screen="LinkComponent" params={{ screen: 'Albums' }}>
          Go to albums
        </Link>
        <Link
          screen="LinkComponent"
          params={{ screen: 'Albums' }}
          action={StackActions.replace('Albums')}
        >
          Replace with albums
        </Link>

        <Button screen="Home" variant="filled">
          Go to Home
        </Button>
        <Button variant="tinted" action={CommonActions.goBack()}>
          Go back
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

        {Platform.OS === 'web' && (
          <Button
            onPress={() => {
              location.hash = 'frodo';
            }}
          >
            Add hash to URL
          </Button>
        )}
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
}: StackScreenProps<LinkComponentDemoParamList>) => {
  return (
    <ScrollView>
      <View style={styles.buttons}>
        <Link
          screen="LinkComponent"
          params={{ screen: 'Article', params: { author: 'Babel' } }}
        >
          Go to Article
        </Link>
        <Button
          screen="LinkComponent"
          params={{ screen: 'Article', params: { author: 'Babel' } }}
          variant="filled"
        >
          Go to Article
        </Button>
        <Button variant="tinted" onPress={() => navigation.goBack()}>
          Go back
        </Button>
      </View>
      <Albums scrollEnabled={scrollEnabled} />
    </ScrollView>
  );
};

const SimpleStack = createStackNavigator<LinkComponentDemoParamList>();

export function LinkComponent() {
  return (
    <SimpleStack.Navigator>
      <SimpleStack.Screen
        name="Article"
        component={ArticleScreen}
        options={({ route }) => ({
          title: `Article by ${route.params.author}`,
        })}
        initialParams={{ author: 'Gandalf' }}
      />
      <SimpleStack.Screen
        name="Albums"
        component={AlbumsScreen}
        options={{ title: 'Albums' }}
      />
    </SimpleStack.Navigator>
  );
}

LinkComponent.title = '<Link /> ';
LinkComponent.linking = linking;

const styles = StyleSheet.create({
  buttons: {
    gap: 12,
    padding: 12,
  },
});
