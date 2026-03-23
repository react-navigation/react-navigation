import {
  Button,
  getDefaultHeaderHeight,
  getHeaderTitle,
  Text,
  useFrameSize,
} from '@react-navigation/elements';
import {
  CommonActions,
  useNavigation,
  useRoute,
  useTheme,
} from '@react-navigation/native';
import {
  createStackNavigator,
  createStackScreen,
  type StackNavigatorProps,
} from '@react-navigation/stack';
import * as React from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { COMMON_LINKING_CONFIG } from '../constants';
import { Albums } from '../Shared/Albums';
import { Article } from '../Shared/Article';
import { NewsFeed } from '../Shared/NewsFeed';

const scrollEnabled = Platform.select({ web: true, default: false });

const ArticleScreen = () => {
  const navigation = useNavigation('Article');
  const route = useRoute('Article');

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

const NewsFeedScreen = () => {
  const route = useRoute('NewsFeed');
  const navigation = useNavigation('NewsFeed');

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

const AlbumsScreen = () => {
  const navigation = useNavigation('Albums');

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

function BreadcrumbLayout({
  children,
  state,
  descriptors,
  navigation,
}: Parameters<NonNullable<StackNavigatorProps['layout']>>[0]) {
  const { colors } = useTheme();

  const insets = useSafeAreaInsets();
  const defaultHeaderHeight = useFrameSize((size) =>
    getDefaultHeaderHeight({
      landscape: size.width > size.height,
      modalPresentation: false,
      topInset: insets.top,
    })
  );

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        style={{
          backgroundColor: colors.card,
          borderBottomColor: colors.border,
          borderBottomWidth: StyleSheet.hairlineWidth,
          maxHeight: defaultHeaderHeight,
        }}
        contentContainerStyle={[styles.breadcrumbs, { paddingTop: insets.top }]}
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
                  {getHeaderTitle(descriptors[route.key].options, route.name)}
                </Text>
              </Pressable>
              {self.length - 1 !== i ? (
                <Text style={[styles.arrow, { color: colors.text }]}>❯</Text>
              ) : null}
            </React.Fragment>
          );
        })}
      </ScrollView>
      {children}
    </View>
  );
}

const NavigatorLayoutNavigator = createStackNavigator({
  layout: (props) => <BreadcrumbLayout {...props} />,
  screenOptions: {
    headerShown: false,
  },
  screens: {
    Article: createStackScreen({
      screen: ArticleScreen,
      options: ({ route }) => ({
        title: `Article by ${route.params?.author ?? 'Unknown'}`,
      }),
      initialParams: { author: 'Gandalf' },
      linking: COMMON_LINKING_CONFIG.Article,
    }),
    NewsFeed: createStackScreen({
      screen: NewsFeedScreen,
      options: { title: 'Feed' },
      linking: COMMON_LINKING_CONFIG.NewsFeed,
    }),
    Albums: createStackScreen({
      screen: AlbumsScreen,
      options: { title: 'Albums' },
      linking: 'albums',
    }),
  },
});

export const NavigatorLayout = {
  screen: NavigatorLayoutNavigator,
  title: 'Navigator Layout',
};

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
