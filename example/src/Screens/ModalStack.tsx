import { Button } from '@react-navigation/elements';
import type { ParamListBase, PathConfigMap } from '@react-navigation/native';
import {
  createStackNavigator,
  type StackScreenProps,
} from '@react-navigation/stack';
import * as React from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';

import { COMMON_LINKING_CONFIG } from '../constants';
import { Albums } from '../Shared/Albums';
import { Article } from '../Shared/Article';

export type ModalStackParams = {
  Article: { author: string };
  Albums: undefined;
};

export const modalStackLinking: PathConfigMap<ModalStackParams> = {
  Article: COMMON_LINKING_CONFIG.Article,
  Albums: 'albums',
};

const scrollEnabled = Platform.select({ web: true, default: false });

const ArticleScreen = ({
  navigation,
  route,
}: StackScreenProps<ModalStackParams, 'Article'>) => {
  return (
    <ScrollView>
      <View style={styles.buttons}>
        <Button variant="filled" onPress={() => navigation.push('Albums')}>
          Push album
        </Button>
        <Button variant="tinted" onPress={() => navigation.goBack()}>
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
          variant="filled"
          onPress={() => navigation.push('Article', { author: 'Babel fish' })}
        >
          Push article
        </Button>
        <Button variant="tinted" onPress={() => navigation.goBack()}>
          Go back
        </Button>
      </View>
      <Albums scrollEnabled={scrollEnabled} />
    </ScrollView>
  );
};

const Stack = createStackNavigator<ModalStackParams>();

type Props = StackScreenProps<ParamListBase>;

export function ModalStack({ navigation }: Props) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <Stack.Navigator screenOptions={{ presentation: 'modal' }}>
      <Stack.Screen
        name="Article"
        component={ArticleScreen}
        options={({ route }) => ({
          title: `Article by ${route.params.author}`,
        })}
        initialParams={{ author: 'Gandalf' }}
      />
      <Stack.Screen
        name="Albums"
        component={AlbumsScreen}
        options={{ title: 'Albums' }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    padding: 12,
  },
});
