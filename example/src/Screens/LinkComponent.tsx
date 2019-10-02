import * as React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import { Link, RouteProp, ParamListBase } from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import Article from '../Shared/Article';
import Albums from '../Shared/Albums';

type SimpleStackParams = {
  Article: { author: string };
  Album: undefined;
};

type SimpleStackNavigation = StackNavigationProp<SimpleStackParams>;

const ArticleScreen = ({
  navigation,
  route,
}: {
  navigation: SimpleStackNavigation;
  route: RouteProp<SimpleStackParams, 'Article'>;
}) => {
  return (
    <ScrollView>
      <View style={styles.buttons}>
        <Link<SimpleStackNavigation>
          to="Album"
          style={[styles.button, { padding: 8 }]}
        >
          Go to album
        </Link>
        <Link<SimpleStackNavigation> to="Album">
          {props => (
            <Button {...props} mode="contained" style={styles.button}>
              Go to album
            </Button>
          )}
        </Link>
        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          style={styles.button}
        >
          Go back
        </Button>
      </View>
      <Article author={{ name: route.params.author }} scrollEnabled={false} />
    </ScrollView>
  );
};

const AlbumsScreen = ({
  navigation,
}: {
  navigation: SimpleStackNavigation;
}) => {
  return (
    <ScrollView>
      <View style={styles.buttons}>
        <Link<SimpleStackNavigation>
          to="Article"
          params={{ author: 'Babel fish' }}
          style={[styles.button, { padding: 8 }]}
        >
          Go to article
        </Link>
        <Link<SimpleStackNavigation>
          to="Article"
          params={{ author: 'Luke Skywalker' }}
        >
          {props => (
            <Button {...props} mode="contained" style={styles.button}>
              Go to article
            </Button>
          )}
        </Link>
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

const SimpleStack = createStackNavigator<SimpleStackParams>();

type Props = Partial<React.ComponentProps<typeof SimpleStack.Navigator>> & {
  navigation: StackNavigationProp<ParamListBase>;
};

export default function SimpleStackScreen({ navigation, ...rest }: Props) {
  navigation.setOptions({
    headerShown: false,
  });

  return (
    <SimpleStack.Navigator {...rest}>
      <SimpleStack.Screen
        name="Article"
        component={ArticleScreen}
        options={({ route }) => ({
          title: `Article by ${route.params.author}`,
        })}
        initialParams={{ author: 'Gandalf' }}
      />
      <SimpleStack.Screen
        name="Album"
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
