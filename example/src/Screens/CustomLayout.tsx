import {
  getDefaultHeaderHeight,
  getHeaderTitle,
} from '@react-navigation/elements';
import {
  CommonActions,
  ParamListBase,
  useTheme,
} from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationOptions,
  StackScreenProps,
} from '@react-navigation/stack';
import * as React from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Button } from 'react-native-paper';
import {
  useSafeAreaFrame,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { Albums } from '../Shared/Albums';
import { Article } from '../Shared/Article';
import { NewsFeed } from '../Shared/NewsFeed';

export type SimpleStackParams = {
  Article: { author: string } | undefined;
  NewsFeed: { date: number };
  Albums: undefined;
};

const scrollEnabled = Platform.select({ web: true, default: false });

const ArticleScreen = ({
  navigation,
  route,
}: StackScreenProps<SimpleStackParams, 'Article'>) => {
  return (
    <ScrollView>
      <View style={styles.buttons}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('NewsFeed', { date: Date.now() })}
          style={styles.button}
        >
          Navigate to feed
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
        author={{ name: route.params?.author ?? 'Unknown' }}
        scrollEnabled={scrollEnabled}
      />
    </ScrollView>
  );
};

const NewsFeedScreen = ({
  route,
  navigation,
}: StackScreenProps<SimpleStackParams, 'NewsFeed'>) => {
  return (
    <ScrollView>
      <View style={styles.buttons}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Albums')}
          style={styles.button}
        >
          Navigate to album
        </Button>
        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          style={styles.button}
        >
          Go back
        </Button>
      </View>
      <NewsFeed scrollEnabled={scrollEnabled} date={route.params.date} />
    </ScrollView>
  );
};

const AlbumsScreen = ({
  navigation,
}: StackScreenProps<SimpleStackParams, 'Albums'>) => {
  return (
    <ScrollView>
      <View style={styles.buttons}>
        <Button
          mode="contained"
          onPress={() =>
            navigation.navigate('Article', { author: 'Babel fish' })
          }
          style={styles.button}
        >
          Navigate to article
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

const Stack = createStackNavigator<SimpleStackParams>();

export function CustomLayout({
  navigation,
  screenOptions,
}: StackScreenProps<ParamListBase> & {
  screenOptions?: StackNavigationOptions;
}) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const { colors } = useTheme();

  const frame = useSafeAreaFrame();
  const insets = useSafeAreaInsets();

  return (
    <Stack.Navigator
      layout={({ children, state, descriptors, navigation }) => {
        return (
          <View style={styles.container}>
            <ScrollView
              horizontal
              style={{
                backgroundColor: colors.card,
                borderBottomColor: colors.border,
                borderBottomWidth: StyleSheet.hairlineWidth,
                maxHeight: getDefaultHeaderHeight(frame, false, insets.top),
              }}
              contentContainerStyle={[
                styles.breadcrumbs,
                { paddingTop: insets.top },
              ]}
            >
              {state.routes.map((route, i, self) => {
                return (
                  <React.Fragment key={route.key}>
                    <Pressable
                      onPress={() => {
                        navigation.dispatch((state) => {
                          return CommonActions.reset({
                            ...state,
                            index: i,
                            routes: state.routes.slice(0, i + 1),
                          });
                        });
                      }}
                    >
                      <Text style={[styles.title, { color: colors.text }]}>
                        {getHeaderTitle(
                          descriptors[route.key].options,
                          route.name
                        )}
                      </Text>
                    </Pressable>
                    {self.length - 1 !== i ? (
                      <Text style={[styles.arrow, { color: colors.text }]}>
                        ❯
                      </Text>
                    ) : null}
                  </React.Fragment>
                );
              })}
            </ScrollView>
            {children}
          </View>
        );
      }}
      screenOptions={{
        ...screenOptions,
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Article"
        component={ArticleScreen}
        options={({ route }) => ({
          title: `Article by ${route.params?.author ?? 'Unknown'}`,
        })}
        initialParams={{ author: 'Gandalf' }}
      />
      <Stack.Screen
        name="NewsFeed"
        component={NewsFeedScreen}
        options={{ title: 'Feed' }}
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
  container: {
    flex: 1,
  },
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  button: {
    margin: 8,
  },
  breadcrumbs: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 16,
    lineHeight: 16,
    fontWeight: 'bold',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  arrow: {
    fontSize: 14,
    lineHeight: 14,
    opacity: 0.3,
  },
});
