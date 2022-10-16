import {
  Link,
  ParamListBase,
  StackActions,
  useLinkProps,
} from '@react-navigation/native';
import {
  createStackNavigator,
  StackScreenProps,
} from '@react-navigation/stack';
import * as React from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';

import type { LinkComponentDemoParamList } from '../screens';
import Albums from '../Shared/Albums';
import Article from '../Shared/Article';

const scrollEnabled = Platform.select({ web: true, default: false });

const LinkButton = ({
  screen,
  params,
  action,
  href,
  ...rest
}: React.ComponentProps<typeof Button> &
  Parameters<typeof useLinkProps>[0]) => {
  // @ts-expect-error: This is already type-checked by the prop types
  const props = useLinkProps({ screen, params, action, href });

  return <Button {...props} {...rest} />;
};

const ArticleScreen = ({
  navigation,
  route,
}: StackScreenProps<LinkComponentDemoParamList, 'Article'>) => {
  return (
    <ScrollView>
      <View style={styles.buttons}>
        <Link
          screen="LinkComponent"
          params={{ screen: 'Albums' }}
          style={[styles.button, { padding: 8 }]}
        >
          Go to LinkComponent &gt; Albums
        </Link>
        <Link
          screen="LinkComponent"
          params={{ screen: 'Albums' }}
          action={StackActions.replace('Albums')}
          style={[styles.button, { padding: 8 }]}
        >
          Replace with LinkComponent &gt; Albums
        </Link>
        <LinkButton screen="Home" mode="contained" style={styles.button}>
          Go to Home
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

const AlbumsScreen = ({
  navigation,
}: StackScreenProps<LinkComponentDemoParamList>) => {
  return (
    <ScrollView>
      <View style={styles.buttons}>
        <Link
          screen="LinkComponent"
          params={{ screen: 'Article', params: { author: 'Babel' } }}
          style={[styles.button, { padding: 8 }]}
        >
          Go to /link-component/article
        </Link>
        <LinkButton
          screen="LinkComponent"
          params={{ screen: 'Article', params: { author: 'Babel' } }}
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

const SimpleStack = createStackNavigator<LinkComponentDemoParamList>();

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
