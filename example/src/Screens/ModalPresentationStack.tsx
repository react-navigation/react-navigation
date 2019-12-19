import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { useSafeArea } from 'react-native-safe-area-context';
import { RouteProp, ParamListBase } from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationProp,
  TransitionPresets,
} from '@react-navigation/stack';
import Article from '../Shared/Article';
import Albums from '../Shared/Albums';

type ModalStackParams = {
  Article: { author: string };
  Album: undefined;
};

type ModalStackNavigation = StackNavigationProp<ModalStackParams>;

const ArticleScreen = ({
  navigation,
  route,
}: {
  navigation: ModalStackNavigation;
  route: RouteProp<ModalStackParams, 'Article'>;
}) => {
  const insets = useSafeArea();

  return (
    <React.Fragment>
      <View style={[styles.buttons, { marginTop: insets.top }]}>
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
      <Article author={{ name: route.params.author }} />
    </React.Fragment>
  );
};

const AlbumsScreen = ({ navigation }: { navigation: ModalStackNavigation }) => {
  const insets = useSafeArea();

  return (
    <React.Fragment>
      <View style={[styles.buttons, { marginTop: insets.top }]}>
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

const ModalPresentationStack = createStackNavigator<ModalStackParams>();

type Props = {
  options?: React.ComponentProps<typeof ModalPresentationStack.Navigator>;
  navigation: StackNavigationProp<ParamListBase>;
};

export default function SimpleStackScreen({ navigation, options }: Props) {
  navigation.setOptions({
    headerShown: false,
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
        name="Article"
        component={ArticleScreen}
        options={({ route }) => ({
          title: `Article by ${route.params.author}`,
        })}
        initialParams={{ author: 'Gandalf' }}
      />
      <ModalPresentationStack.Screen
        name="Album"
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
