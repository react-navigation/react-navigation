import * as React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import {
  createCompatNavigatorFactory,
  CompatScreenType,
} from '@react-navigation/compat';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import Article from '../Shared/Article';
import Albums from '../Shared/Albums';
import NewsFeed from '../Shared/NewsFeed';

type CompatStackParams = {
  Albums: undefined;
  Nested: { author: string };
};

type NestedStackParams = {
  Feed: undefined;
  Article: { author: string };
};

const AlbumsScreen: CompatScreenType<StackNavigationProp<
  CompatStackParams
>> = ({ navigation }) => {
  return (
    <ScrollView>
      <View style={styles.buttons}>
        <Button
          mode="contained"
          onPress={() => navigation.push('Nested', { author: 'Babel fish' })}
          style={styles.button}
        >
          Push nested
        </Button>
        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          style={styles.button}
        >
          Go back
        </Button>
      </View>
      <Albums scrollEnabled={false} />
    </ScrollView>
  );
};

const FeedScreen: CompatScreenType<StackNavigationProp<NestedStackParams>> = ({
  navigation,
}) => {
  return (
    <ScrollView>
      <View style={styles.buttons}>
        <Button
          mode="contained"
          onPress={() => navigation.push('Article')}
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
      <NewsFeed scrollEnabled={false} />
    </ScrollView>
  );
};

const ArticleScreen: CompatScreenType<StackNavigationProp<
  NestedStackParams,
  'Article'
>> = ({ navigation }) => {
  navigation.dangerouslyGetParent();
  return (
    <ScrollView>
      <View style={styles.buttons}>
        <Button
          mode="contained"
          onPress={() => navigation.push('Albums')}
          style={styles.button}
        >
          Push albums
        </Button>
        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          style={styles.button}
        >
          Go back
        </Button>
      </View>
      <Article
        author={{ name: navigation.getParam('author') }}
        scrollEnabled={false}
      />
    </ScrollView>
  );
};

ArticleScreen.navigationOptions = ({ navigation }) => ({
  title: `Article by ${navigation.getParam('author')}`,
});

const createCompatStackNavigator = createCompatNavigatorFactory(
  createStackNavigator
);

const CompatStack = createCompatStackNavigator<
  StackNavigationProp<CompatStackParams>
>(
  {
    Albums: AlbumsScreen,
    Nested: {
      screen: createCompatStackNavigator<
        StackNavigationProp<NestedStackParams>
      >(
        {
          Feed: FeedScreen,
          Article: ArticleScreen,
        },
        { navigationOptions: { headerShown: false } }
      ),
      params: {
        author: 'Gandalf',
      },
    },
  },
  {
    mode: 'modal',
  }
);

export default function CompatStackScreen({
  navigation,
}: {
  navigation: StackNavigationProp<{}>;
}) {
  navigation.setOptions({
    headerShown: false,
  });

  return <CompatStack />;
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
