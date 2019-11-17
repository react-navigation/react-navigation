import * as React from 'react';
import { View, StyleSheet } from 'react-native';
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

type CompatStackParams = {
  Article: { author: string };
  Album: undefined;
};

const ArticleScreen: CompatScreenType<StackNavigationProp<
  CompatStackParams,
  'Article'
>> = ({ navigation }) => {
  return (
    <React.Fragment>
      <View style={styles.buttons}>
        <Button
          mode="contained"
          onPress={() => navigation.push('Album')}
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
      <Article author={{ name: navigation.getParam('author') }} />
    </React.Fragment>
  );
};

ArticleScreen.navigationOptions = ({ navigation }) => ({
  title: `Article by ${navigation.getParam('author')}`,
});

const AlbumsScreen: CompatScreenType<StackNavigationProp<
  CompatStackParams
>> = ({ navigation }) => {
  return (
    <React.Fragment>
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
          onPress={() => navigation.goBack()}
          style={styles.button}
        >
          Go back
        </Button>
      </View>
      <Albums />
    </React.Fragment>
  );
};

const CompatStack = createCompatNavigatorFactory(createStackNavigator)<
  StackNavigationProp<CompatStackParams>
>(
  {
    Article: {
      screen: ArticleScreen,
      params: {
        author: 'Gandalf',
      },
    },
    Album: AlbumsScreen,
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
