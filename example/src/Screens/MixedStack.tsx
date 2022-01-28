import type { ParamListBase } from '@react-navigation/native';
import {
  createStackNavigator,
  StackScreenProps,
} from '@react-navigation/stack';
import * as React from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';

import Albums from '../Shared/Albums';
import Article from '../Shared/Article';

type MixedStackParams = {
  Article: { author: string };
  Albums: undefined;
};

const scrollEnabled = Platform.select({ web: true, default: false });

const ArticleScreen = ({
  navigation,
  route,
}: StackScreenProps<MixedStackParams, 'Article'>) => {
  return (
    <ScrollView>
      <View style={styles.buttons}>
        <View>
          <Button
            mode="contained"
            onPress={() => navigation.push('Article', { author: 'Dalek' })}
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
        <View>
          <Button
            mode="contained"
            onPress={() => navigation.push('Albums')}
            style={styles.button}
          >
            Push album
          </Button>
        </View>
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
        <View>
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
        <View>
          <Button
            mode="contained"
            onPress={() => navigation.push('Article', { author: 'The Doctor' })}
            style={styles.button}
          >
            Push article
          </Button>
        </View>
      </View>
      <Albums scrollEnabled={scrollEnabled} />
    </ScrollView>
  );
};

const MixedStack = createStackNavigator<MixedStackParams>();

type Props = StackScreenProps<ParamListBase>;

export default function MixedStackScreen({ navigation }: Props) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <MixedStack.Navigator>
      <MixedStack.Screen
        name="Article"
        component={ArticleScreen}
        options={({ route }) => ({
          title: `Article by ${route.params.author}`,
        })}
        initialParams={{ author: 'Gandalf' }}
      />
      <MixedStack.Screen
        name="Albums"
        component={AlbumsScreen}
        options={{
          title: 'Albums',
          presentation: 'modal',
        }}
      />
    </MixedStack.Navigator>
  );
}

const styles = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  button: {
    margin: 8,
  },
});
