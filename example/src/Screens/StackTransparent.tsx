import { ParamListBase, useTheme } from '@react-navigation/native';
import {
  createStackNavigator,
  StackScreenProps,
  useCardAnimation,
} from '@react-navigation/stack';
import * as React from 'react';
import {
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Button, Paragraph } from 'react-native-paper';

import Article from '../Shared/Article';
import NewsFeed from '../Shared/NewsFeed';

type TransparentStackParams = {
  Article: { author: string };
  NewsFeed: undefined;
  Dialog: undefined;
};

const scrollEnabled = Platform.select({ web: true, default: false });

const ArticleScreen = ({
  navigation,
  route,
}: StackScreenProps<TransparentStackParams, 'Article'>) => {
  return (
    <ScrollView>
      <View style={styles.buttons}>
        <Button
          mode="contained"
          onPress={() => navigation.push('Dialog')}
          style={styles.button}
        >
          Show Dialog
        </Button>
        <Button
          mode="contained"
          onPress={() => navigation.push('NewsFeed')}
          style={styles.button}
        >
          Push NewsFeed
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

const NewsFeedScreen = ({
  navigation,
}: StackScreenProps<TransparentStackParams, 'NewsFeed'>) => {
  return (
    <ScrollView>
      <View style={styles.buttons}>
        <Button
          mode="contained"
          onPress={() => navigation.push('Dialog')}
          style={styles.button}
        >
          Show Dialog
        </Button>
        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          style={styles.button}
        >
          Go back
        </Button>
      </View>
      <NewsFeed scrollEnabled={scrollEnabled} />
    </ScrollView>
  );
};

const DialogScreen = ({
  navigation,
}: StackScreenProps<TransparentStackParams>) => {
  const { colors } = useTheme();
  const { current } = useCardAnimation();

  return (
    <View style={styles.container}>
      <Pressable style={styles.backdrop} onPress={navigation.goBack} />
      <Animated.View
        style={[
          styles.dialog,
          {
            backgroundColor: colors.card,
            transform: [
              {
                scale: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.9, 1],
                  extrapolate: 'clamp',
                }),
              },
            ],
          },
        ]}
      >
        <Paragraph>
          Mise en place is a French term that literally means “put in place.” It
          also refers to a way cooks in professional kitchens and restaurants
          set up their work stations—first by gathering all ingredients for a
          recipes, partially preparing them (like measuring out and chopping),
          and setting them all near each other. Setting up mise en place before
          cooking is another top tip for home cooks, as it seriously helps with
          organization. It’ll pretty much guarantee you never forget to add an
          ingredient and save you time from running back and forth from the
          pantry ten times.
        </Paragraph>
        <Button style={styles.close} compact onPress={navigation.goBack}>
          Okay
        </Button>
      </Animated.View>
    </View>
  );
};

const TransparentStack = createStackNavigator<TransparentStackParams>();

type Props = StackScreenProps<ParamListBase>;

export default function TransparentStackScreen({ navigation }: Props) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <TransparentStack.Navigator>
      <TransparentStack.Screen
        name="Article"
        component={ArticleScreen}
        initialParams={{ author: 'Gandalf' }}
      />
      <TransparentStack.Screen
        name="NewsFeed"
        component={NewsFeedScreen}
        options={{ presentation: 'modal' }}
      />
      <TransparentStack.Screen
        name="Dialog"
        component={DialogScreen}
        options={{
          headerShown: false,
          presentation: 'transparentModal',
        }}
      />
    </TransparentStack.Navigator>
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
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialog: {
    padding: 16,
    width: '90%',
    maxWidth: 400,
    borderRadius: 3,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  close: {
    alignSelf: 'flex-end',
  },
});
