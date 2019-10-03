import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { useSafeArea } from 'react-native-safe-area-context';
import { RouteProp, ParamListBase } from '@react-navigation/core';
import {
  createStackNavigator,
  StackNavigationProp,
  TransitionPresets,
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
}) => {
  const insets = useSafeArea();

  return (
    <React.Fragment>
      <View style={[styles.buttons, { marginTop: insets.top }]}>
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
};

const AlbumsScreen = ({
  navigation,
}: {
  navigation: SimpleStackNavigation;
}) => {
  const insets = useSafeArea();

  return (
    <React.Fragment>
      <View style={[styles.buttons, { marginTop: insets.top }]}>
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
};

const ModalPresentationStack = createStackNavigator<SimpleStackParams>();

type Props = {
  options?: React.ComponentProps<typeof ModalPresentationStack.Navigator>;
  navigation: StackNavigationProp<ParamListBase>;
};

export default function SimpleStackScreen({ navigation, options }: Props) {
  navigation.setOptions({
    header: null,
  });

  return (
    <ModalPresentationStack.Navigator
      mode="modal"
      headerMode="none"
      screenOptions={{
        ...TransitionPresets.ModalPresentationIOS,
        cardOverlayEnabled: true,
        gestureEnabled: true,
      }}
      {...options}
    >
      <ModalPresentationStack.Screen
        name="article"
        component={ArticleScreen}
        options={({ route }) => ({
          title: `Article by ${route.params.author}`,
        })}
        initialParams={{ author: 'Gandalf' }}
      />
      <ModalPresentationStack.Screen
        name="album"
        component={AlbumsScreen}
        options={{ title: 'Album' }}
      />
    </ModalPresentationStack.Navigator>
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
