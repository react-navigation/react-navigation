import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
// eslint-disable-next-line import/no-unresolved
import { useScreens } from 'react-native-screens';
import {
  RouteProp,
  ParamListBase,
  useFocusEffect,
} from '@react-navigation/core';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import Article from '../Shared/Article';
import Albums from '../Shared/Albums';

type NativeStackParams = {
  article: { author: string };
  album: undefined;
};

type NativeStackNavigation = NativeStackNavigationProp<NativeStackParams>;

const ArticleScreen = ({
  navigation,
  route,
}: {
  navigation: NativeStackNavigation;
  route: RouteProp<NativeStackParams, 'article'>;
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
  navigation: NativeStackNavigation;
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

const NativeStack = createNativeStackNavigator<NativeStackParams>();

type Props = {
  navigation: StackNavigationProp<ParamListBase>;
};

export default function NativeStackScreen({ navigation }: Props) {
  navigation.setOptions({
    headerShown: false,
  });

  useFocusEffect(
    React.useCallback(() => {
      const drawer = navigation.dangerouslyGetParent() as DrawerNavigationProp<
        ParamListBase
      >;

      navigation.setOptions({ gestureEnabled: false });
      drawer.setOptions({ drawerLockMode: 'locked-closed' });

      return () => {
        navigation.setOptions({ gestureEnabled: true });
        drawer.setOptions({ drawerLockMode: 'unlocked' });
      };
    }, [navigation])
  );

  return (
    <NativeStack.Navigator>
      <NativeStack.Screen
        name="article"
        component={ArticleScreen}
        options={({ route }) => ({
          title: `Article by ${route.params.author}`,
        })}
        initialParams={{ author: 'Gandalf' }}
      />
      <NativeStack.Screen
        name="album"
        component={AlbumsScreen}
        options={{ title: 'Album' }}
      />
    </NativeStack.Navigator>
  );
}

// eslint-disable-next-line react-hooks/rules-of-hooks
useScreens(true);

const styles = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
    padding: 8,
  },
  button: {
    margin: 8,
  },
});
