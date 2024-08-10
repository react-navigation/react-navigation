import {
  Button,
  getDefaultHeaderHeight,
  getHeaderTitle,
  Text,
} from '@react-navigation/elements';
import {
  CommonActions,
  type PathConfigMap,
  useTheme,
} from '@react-navigation/native';
import {
  createStackNavigator,
  type StackScreenProps,
} from '@react-navigation/stack';
import * as React from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {
  useSafeAreaFrame,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { COMMON_LINKING_CONFIG } from '../constants';
import { Albums } from '../Shared/Albums';
import { Article } from '../Shared/Article';
import { NewsFeed } from '../Shared/NewsFeed';

export type CustomLayoutParams = {
  Article: { author: string } | undefined;
  NewsFeed: { date: number };
  Albums: undefined;
};

const linking: PathConfigMap<CustomLayoutParams> = {
  Article: COMMON_LINKING_CONFIG.Article,
  NewsFeed: COMMON_LINKING_CONFIG.NewsFeed,
  Albums: 'albums',
};

const scrollEnabled = Platform.select({ web: true, default: false });

const ArticleScreen = ({
  navigation,
  route,
}: StackScreenProps<CustomLayoutParams, 'Article'>) => {
  return (
    <ScrollView>
      <View style={styles.buttons}>
        <Button
          variant="filled"
          onPress={() => navigation.navigate('NewsFeed', { date: Date.now() })}
        >
          Navigate to feed
        </Button>
        <Button variant="tinted" onPress={() => navigation.goBack()}>
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
}: StackScreenProps<CustomLayoutParams, 'NewsFeed'>) => {
  return (
    <ScrollView>
      <View style={styles.buttons}>
        <Button variant="filled" onPress={() => navigation.navigate('Albums')}>
          Navigate to albums
        </Button>
        <Button variant="tinted" onPress={() => navigation.goBack()}>
          Go back
        </Button>
      </View>
      <NewsFeed scrollEnabled={scrollEnabled} date={route.params.date} />
    </ScrollView>
  );
};

const AlbumsScreen = ({
  navigation,
}: StackScreenProps<CustomLayoutParams, 'Albums'>) => {
  return (
    <ScrollView>
      <View style={styles.buttons}>
        <Button
          variant="filled"
          onPress={() =>
            navigation.navigate('Article', { author: 'Babel fish' })
          }
        >
          Navigate to article
        </Button>
        <Button variant="tinted" onPress={() => navigation.goBack()}>
          Go back
        </Button>
      </View>
      <Albums scrollEnabled={scrollEnabled} />
    </ScrollView>
  );
};

const Stack = createStackNavigator<CustomLayoutParams>();

export function NavigatorLayout() {
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

NavigatorLayout.title = 'Navigator Layout';
NavigatorLayout.linking = linking;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    padding: 12,
  },
  breadcrumbs: {
    flexDirection: 'row',
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
    paddingVertical: 16,
    opacity: 0.3,
  },
});
