import { Button, Text } from '@react-navigation/elements';
import {
  type NavigatorScreenParams,
  type StaticScreenProps,
  useTheme,
} from '@react-navigation/native';
import {
  createStackNavigator,
  type StackScreenProps,
  useCardAnimation,
} from '@react-navigation/stack';
import {
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { COMMON_LINKING_CONFIG } from '../constants';
import { Article } from '../Shared/Article';
import { NewsFeed } from '../Shared/NewsFeed';

type TransparentStackParamList = {
  Article: { author: string };
  NewsFeed: undefined;
  Dialog: undefined;
};

const linking = {
  screens: {
    Article: COMMON_LINKING_CONFIG.Article,
    NewsFeed: COMMON_LINKING_CONFIG.NewsFeed,
    Dialog: 'dialog',
  },
};

const scrollEnabled = Platform.select({ web: true, default: false });

const ArticleScreen = ({
  navigation,
  route,
}: StackScreenProps<TransparentStackParamList, 'Article'>) => {
  return (
    <ScrollView>
      <View style={styles.buttons}>
        <Button variant="filled" onPress={() => navigation.push('Dialog')}>
          Show Dialog
        </Button>
        <Button variant="filled" onPress={() => navigation.push('NewsFeed')}>
          Push NewsFeed
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

const NewsFeedScreen = ({
  navigation,
}: StackScreenProps<TransparentStackParamList, 'NewsFeed'>) => {
  return (
    <ScrollView>
      <View style={styles.buttons}>
        <Button variant="filled" onPress={() => navigation.push('Dialog')}>
          Show Dialog
        </Button>
        <Button variant="tinted" onPress={() => navigation.goBack()}>
          Go back
        </Button>
      </View>
      <NewsFeed scrollEnabled={scrollEnabled} />
    </ScrollView>
  );
};

const DialogScreen = ({
  navigation,
}: StackScreenProps<TransparentStackParamList>) => {
  const { colors } = useTheme();
  const { current } = useCardAnimation();

  return (
    <View style={styles.container}>
      <Pressable
        style={[StyleSheet.absoluteFill, styles.backdrop]}
        onPress={navigation.goBack}
      />
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
        <Text style={styles.title}>Trivia</Text>
        <Text>
          Mise en place is a French term that literally means “put in place.” It
          also refers to a way cooks in professional kitchens and restaurants
          set up their work stations—first by gathering all ingredients for a
          recipes, partially preparing them (like measuring out and chopping),
          and setting them all near each other. Setting up mise en place before
          cooking is another top tip for home cooks, as it seriously helps with
          organization. It’ll pretty much guarantee you never forget to add an
          ingredient and save you time from running back and forth from the
          pantry ten times.
        </Text>
        <Button
          variant="plain"
          style={styles.close}
          onPress={navigation.goBack}
        >
          Okay
        </Button>
      </Animated.View>
    </View>
  );
};

const Stack = createStackNavigator<TransparentStackParamList>();

export function StackTransparent(
  _: StaticScreenProps<NavigatorScreenParams<TransparentStackParamList>>
) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Article"
        component={ArticleScreen}
        initialParams={{ author: 'Gandalf' }}
      />
      <Stack.Screen
        name="NewsFeed"
        component={NewsFeedScreen}
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen
        name="Dialog"
        component={DialogScreen}
        options={{
          headerShown: false,
          presentation: 'transparentModal',
        }}
      />
    </Stack.Navigator>
  );
}

StackTransparent.title = 'Transparent Stack';
StackTransparent.linking = linking;

const styles = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    padding: 12,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialog: {
    padding: 24,
    gap: 24,
    width: '90%',
    maxWidth: 400,
    borderRadius: 3,
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  close: {
    alignSelf: 'flex-end',
  },
});
