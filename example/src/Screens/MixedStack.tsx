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

export type MixedStackParams = {
  Article: { author: string };
  Albums: undefined;
};

export const mixedStackLinking: PathConfigMap<MixedStackParams> = {
  Article: COMMON_LINKING_CONFIG.Article,
  Albums: 'albums',
};

const scrollEnabled = Platform.select({ web: true, default: false });

const ArticleScreen = ({
  navigation,
  route,
}: StackScreenProps<MixedStackParams, 'Article'>) => {
  return (
    <ScrollView>
      <View style={styles.buttons}>
        <Button
          variant="filled"
          onPress={() => navigation.push('Article', { author: 'Dalek' })}
        >
          Push article
        </Button>
        <Button variant="tinted" onPress={() => navigation.goBack()}>
          Go back
        </Button>
        <Button variant="filled" onPress={() => navigation.push('Albums')}>
          Push album
        </Button>
      </View>
      <Article
        author={{ name: route.params.author }}
        scrollEnabled={scrollEnabled}
      />
    </ScrollView>
  );
};

const AlbumsScreen = ({ navigation }: StackScreenProps<MixedStackParams>) => {
  return (
    <ScrollView>
      <View style={styles.buttons}>
        <Button variant="filled" onPress={() => navigation.push('Albums')}>
          Push album
        </Button>
        <Button variant="tinted" onPress={() => navigation.goBack()}>
          Go back
        </Button>
        <Button
          variant="filled"
          onPress={() => navigation.push('Article', { author: 'The Doctor' })}
        >
          Push article
        </Button>
      </View>
      <Albums scrollEnabled={scrollEnabled} />
    </ScrollView>
  );
};

const Stack = createStackNavigator<MixedStackParams>();

type Props = StackScreenProps<ParamListBase>;

export function MixedStack({ navigation }: Props) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <Stack.Navigator>
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
        options={{
          title: 'Albums',
          presentation: 'modal',
        }}
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
