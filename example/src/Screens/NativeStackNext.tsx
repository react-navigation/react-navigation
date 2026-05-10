import { Button, Text } from '@react-navigation/elements';
import { useNavigation, useRoute } from '@react-navigation/native';
// eslint-disable-next-line no-restricted-imports
import {
  createNativeStackNavigator,
  createNativeStackScreen,
} from '@react-navigation/native-stack/next';
import * as React from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { COMMON_LINKING_CONFIG } from '../constants';
import { Article } from '../Shared/Article';
import { NewsFeed } from '../Shared/NewsFeed';
import { NativeBottomTabs } from './NativeBottomTabs';

const scrollEnabled = Platform.select({ web: true, default: false });

const ArticleScreen = () => {
  const route = useRoute('NativeStackNextArticle');
  const navigation = useNavigation('NativeStackNextArticle');

  return (
    <View style={styles.container}>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.buttons}>
          <Button
            variant="filled"
            onPress={() =>
              navigation.push('NativeStackNextArticle', { author: 'Gandalf' })
            }
          >
            Push article
          </Button>
          <Button
            variant="filled"
            onPress={() =>
              navigation.preload('NativeStackNextNewsFeed', {
                date: Date.now(),
              })
            }
          >
            Preload feed
          </Button>
          <Button
            variant="filled"
            onPress={() =>
              navigation.navigate('NativeStackNextNewsFeed', {
                date: Date.now(),
              })
            }
          >
            Navigate to feed
          </Button>
          <Button
            variant="filled"
            onPress={() =>
              navigation.popTo('NativeStackNextBottomTabs', {
                screen: 'TabStack',
                params: { screen: 'Article' },
              })
            }
          >
            Pop to bottom tabs
          </Button>
          <Button
            variant="tinted"
            onPress={() =>
              navigation.setParams({
                author:
                  route.params?.author === 'Gandalf' ? 'Babel fish' : 'Gandalf',
              })
            }
          >
            Update params
          </Button>
          <Button variant="tinted" onPress={() => navigation.pop()}>
            Pop screen
          </Button>
        </View>
        <Article
          author={{ name: route.params?.author ?? 'Unknown' }}
          scrollEnabled={scrollEnabled}
        />
      </ScrollView>
    </View>
  );
};

const NewsFeedScreen = () => {
  const route = useRoute('NativeStackNextNewsFeed');
  const navigation = useNavigation('NativeStackNextNewsFeed');

  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    let iteration = 0;

    const interval = setInterval(() => {
      if (iteration >= 5) {
        clearInterval(interval);
        return;
      }

      iteration++;
      setCount((c) => c + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <Text style={{ margin: 10 }}>{count}</Text>
        <View style={styles.buttons}>
          <Button
            variant="filled"
            onPress={() =>
              navigation.replace('NativeStackNextBottomTabs', {
                screen: 'TabStack',
                params: { screen: 'Article' },
              })
            }
          >
            Replace with bottom tabs
          </Button>
          <Button variant="tinted" onPress={() => navigation.goBack()}>
            Go back
          </Button>
        </View>
        <NewsFeed scrollEnabled={scrollEnabled} date={route.params?.date} />
      </ScrollView>
    </View>
  );
};

const NativeStackNextNavigator = createNativeStackNavigator({
  screens: {
    NativeStackNextArticle: createNativeStackScreen({
      screen: ArticleScreen,
      options: ({ route }) => {
        return {
          title: `Article by ${route.params?.author ?? 'Unknown'}`,
          headerLargeTitleEnabled: true,
          headerLargeTitleShadowVisible: false,
        };
      },
      initialParams: { author: 'Gandalf' },
      layout: ({ children }) => (
        <SafeViewContainer>{children}</SafeViewContainer>
      ),
      linking: COMMON_LINKING_CONFIG.Article,
    }),
    NativeStackNextNewsFeed: createNativeStackScreen({
      screen: NewsFeedScreen,
      options: {
        title: 'Feed',
        fullScreenGestureEnabled: true,
      },
      layout: ({ children }) => (
        <SafeViewContainer>{children}</SafeViewContainer>
      ),
      linking: COMMON_LINKING_CONFIG.NewsFeed,
    }),
    NativeStackNextBottomTabs: createNativeStackScreen({
      screen: NativeBottomTabs.screen,
      options: {
        headerSearchBarOptions: {
          placeholder: 'Filter contacts',
        },
      },
      linking: 'contacts',
    }),
  },
});

const SafeViewContainer = ({ children }: { children: React.ReactNode }) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      {children}
    </View>
  );
};

export const NativeStackNext = {
  screen: NativeStackNextNavigator,
  title: 'Native Stack - Next',
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
  headerHeight: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 3,
  },
});
