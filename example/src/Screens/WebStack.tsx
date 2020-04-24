import * as React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import { RouteProp, ParamListBase } from '@react-navigation/native';
import {
  createWebStackNavigator,
  WebStackNavigationProp,
} from '@react-navigation/web-stack';
import Article from '../Shared/Article';
import Albums from '../Shared/Albums';
import NewsFeed from '../Shared/NewsFeed';

type WebStackParams = {
  Article: { author: string };
  NewsFeed: undefined;
  Album: undefined;
};

type WebStackNavigation = WebStackNavigationProp<WebStackParams>;

const ArticleScreen = ({
  navigation,
  route,
}: {
  navigation: WebStackNavigation;
  route: RouteProp<WebStackParams, 'Article'>;
}) => {
  return (
    <ScrollView>
      <View style={styles.buttons}>
        <Button
          mode="contained"
          onPress={() => navigation.replace('NewsFeed')}
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
      <Article author={{ name: route.params.author }} scrollEnabled={false} />
    </ScrollView>
  );
};

const NewsFeedScreen = ({ navigation }: { navigation: WebStackNavigation }) => {
  return (
    <ScrollView>
      <View style={styles.buttons}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Album')}
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
      <NewsFeed scrollEnabled={false} />
    </ScrollView>
  );
};

const AlbumsScreen = ({ navigation }: { navigation: WebStackNavigation }) => {
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
      <Albums scrollEnabled={false} />
    </ScrollView>
  );
};

const WebStack = createWebStackNavigator<WebStackParams>();

type Props = Partial<React.ComponentProps<typeof WebStack.Navigator>> & {
  navigation: WebStackNavigationProp<ParamListBase>;
};

export default function WebStackScreen({ navigation, ...rest }: Props) {
  navigation.setOptions({
    headerShown: false,
  });

  return (
    <WebStack.Navigator {...rest}>
      <WebStack.Screen
        name="Article"
        component={ArticleScreen}
        options={({ route }) => ({
          title: `Article by ${route.params.author}`,
        })}
        initialParams={{ author: 'Gandalf' }}
      />
      <WebStack.Screen
        name="NewsFeed"
        component={NewsFeedScreen}
        options={{ title: 'Feed' }}
      />
      <WebStack.Screen
        name="Album"
        component={AlbumsScreen}
        options={{ title: 'Album' }}
      />
    </WebStack.Navigator>
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
