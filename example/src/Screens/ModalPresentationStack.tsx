import * as React from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { Button } from 'react-native-paper';
import type { ParamListBase } from '@react-navigation/native';
import {
  createStackNavigator,
  StackScreenProps,
  StackNavigationOptions,
  TransitionPresets,
} from '@react-navigation/stack';
import Article from '../Shared/Article';
import Albums from '../Shared/Albums';

type ModalStackParams = {
  Article: { author: string };
  Albums: undefined;
};

const scrollEnabled = Platform.select({ web: true, default: false });

const ArticleScreen = ({
  navigation,
  route,
}: StackScreenProps<ModalStackParams, 'Article'>) => {
  return (
    <ScrollView>
      <View style={styles.buttons}>
        <Button
          mode="contained"
          onPress={() => navigation.push('Albums')}
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
      <Article
        author={{ name: route.params.author }}
        scrollEnabled={scrollEnabled}
      />
    </ScrollView>
  );
};

const AlbumsScreen = ({ navigation }: StackScreenProps<ModalStackParams>) => {
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

const ModalPresentationStack = createStackNavigator<ModalStackParams>();

type Props = StackScreenProps<ParamListBase> & {
  options?: StackNavigationOptions;
};

export default function SimpleStackScreen({ navigation, options }: Props) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <ModalPresentationStack.Navigator
      mode="modal"
      screenOptions={({ route, navigation }) => ({
        ...TransitionPresets.ModalPresentationIOS,
        cardOverlayEnabled: true,
        gestureEnabled: true,
        headerStatusBarHeight:
          navigation
            .dangerouslyGetState()
            .routes.findIndex((r: any) => r.key === route.key) > 0
            ? 0
            : undefined,
      })}
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
        name="Albums"
        component={AlbumsScreen}
        options={{ title: 'Albums' }}
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
