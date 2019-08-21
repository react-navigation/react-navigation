import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { RouteProp, ParamListBase } from '@react-navigation/core';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import Article from '../Shared/Article';
import Albums from '../Shared/Albums';

type SimpleStackParams = {
  article: { author: string };
  album: undefined;
};

type SimpleStackNavigation = StackNavigationProp<SimpleStackParams>;

const ArticleScreen = ({
  navigation,
  route,
}: {
  navigation: SimpleStackNavigation;
  route: RouteProp<SimpleStackParams, 'article'>;
}) => (
  <React.Fragment>
    <View style={styles.buttons}>
      <Button
        mode="contained"
        onPress={() => navigation.push('album')}
        style={styles.button}
      >
        Push album
      </Button>
      <Button
        mode="outlined"
        onPress={() => navigation.goBack()}
        style={styles.button}
      >
        Go back
      </Button>
    </View>
    <Article author={{ name: route.params.author }} />
  </React.Fragment>
);

const AlbumsScreen = ({
  navigation,
}: {
  navigation: SimpleStackNavigation;
}) => (
  <React.Fragment>
    <View style={styles.buttons}>
      <Button
        mode="contained"
        onPress={() => navigation.push('article', { author: 'Babel fish' })}
        style={styles.button}
      >
        Push article
      </Button>
      <Button
        mode="outlined"
        onPress={() => navigation.goBack()}
        style={styles.button}
      >
        Go back
      </Button>
    </View>
    <Albums />
  </React.Fragment>
);

const SimpleStack = createStackNavigator<SimpleStackParams>();

export default function SimpleStackScreen({
  navigation,
}: {
  navigation: StackNavigationProp<ParamListBase>;
}) {
  navigation.setOptions({
    header: null,
  });

  return (
    <SimpleStack.Navigator>
      <SimpleStack.Screen
        name="article"
        component={ArticleScreen}
        options={({ route }) => ({
          title: `Article by ${route.params.author}`,
        })}
        initialParams={{ author: 'Gandalf' }}
      />
      <SimpleStack.Screen
        name="album"
        component={AlbumsScreen}
        options={{ title: 'Album' }}
      />
    </SimpleStack.Navigator>
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
