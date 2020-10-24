import * as React from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { Button } from 'react-native-paper';
import {
  Link,
  StackActions,
  ParamListBase,
  useLinkProps,
} from '@react-navigation/native';
import {
  createStackNavigator,
  StackScreenProps,
} from '@react-navigation/stack';
import Article from '../Shared/Article';
import Albums from '../Shared/Albums';

type SimpleStackParams = {
  Article: { author: string };
  Albums: undefined;
};

const scrollEnabled = Platform.select({ web: true, default: false });

const LinkButton = ({
  to,
  ...rest
}: React.ComponentProps<typeof Button> & { to: string }) => {
  const props = useLinkProps({ to });

  return <Button {...props} {...rest} />;
};

const ArticleScreen = ({
  navigation,
  route,
}: StackScreenProps<SimpleStackParams, 'Article'>) => {
  return (
    <ScrollView>
      <View style={styles.buttons}>
        <Link
          to="/link-component/music"
          style={[styles.button, { padding: 8 }]}
        >
          Go to /link-component/music
        </Link>
        <Link
          to="/link-component/music"
          action={StackActions.replace('Albums')}
          style={[styles.button, { padding: 8 }]}
        >
          Replace with /link-component/music
        </Link>
        <LinkButton
          to="/link-component/music"
          mode="contained"
          style={styles.button}
        >
          Go to /link-component/music
        </LinkButton>
        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          style={styles.button}
        >
          Go back
        </Button>
      </View>
      <Article
        author={{ name: route.params.author }}
        scrollEnabled={scrollEnabled}
      />
    </ScrollView>
  );
};

const AlbumsScreen = ({ navigation }: StackScreenProps<SimpleStackParams>) => {
  return (
    <ScrollView>
      <View style={styles.buttons}>
        <Link
          to="/link-component/article/babel"
          style={[styles.button, { padding: 8 }]}
        >
          Go to /link-component/article
        </Link>
        <LinkButton
          to="/link-component/article/babel"
          mode="contained"
          style={styles.button}
        >
          Go to /link-component/article
        </LinkButton>
        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          style={styles.button}
        >
          Go back
        </Button>
      </View>
      <Albums scrollEnabled={scrollEnabled} />
    </ScrollView>
  );
};

const SimpleStack = createStackNavigator<SimpleStackParams>();

type Props = Partial<React.ComponentProps<typeof SimpleStack.Navigator>> &
  StackScreenProps<ParamListBase>;

export default function SimpleStackScreen({ navigation, ...rest }: Props) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

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
        name="Albums"
        component={AlbumsScreen}
        options={{ title: 'Albums' }}
      />
    </SimpleStack.Navigator>
  );
}

const styles = StyleSheet.create({
  buttons: {
    padding: 8,
  },
  button: {
    margin: 8,
  },
});
