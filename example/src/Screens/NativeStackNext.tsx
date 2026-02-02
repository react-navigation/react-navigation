import { Button, Text } from '@react-navigation/elements';
import {
  createComponentForStaticNavigation,
  type NavigatorScreenParams,
  type PathConfig,
  type StaticScreenProps,
} from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
// eslint-disable-next-line no-restricted-imports
import { createNativeStackNavigator } from '@react-navigation/native-stack/next';
import * as React from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COMMON_LINKING_CONFIG } from '../constants';
import { Article } from '../Shared/Article';
import { NewsFeed } from '../Shared/NewsFeed';
import { NativeBottomTabs } from './NativeBottomTabs';

export type NativeStackParamList = {
  Article: { author: string } | undefined;
  NewsFeed: { date: number } | undefined;
  BottomTabs: undefined;
};

const linking = {
  screens: {
    Article: COMMON_LINKING_CONFIG.Article,
    NewsFeed: COMMON_LINKING_CONFIG.NewsFeed,
    BottomTabs: 'contacts',
  },
} satisfies PathConfig<NavigatorScreenParams<NativeStackParamList>>;

const scrollEnabled = Platform.select({ web: true, default: false });

const ArticleScreen = ({
  navigation,
  route,
}: NativeStackScreenProps<NativeStackParamList, 'Article'>) => {
  return (
    <View style={styles.container}>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.buttons}>
          <Button variant="filled" onPress={() => navigation.push('Article')}>
            Push article
          </Button>
          <Button
            variant="filled"
            onPress={() => navigation.preload('NewsFeed')}
          >
            Preload feed
          </Button>
          <Button
            variant="filled"
            onPress={() => navigation.navigate('NewsFeed')}
          >
            Navigate to feed
          </Button>
          <Button
            variant="filled"
            onPress={() => navigation.popTo('BottomTabs')}
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

const NewsFeedScreen = ({
  route,
  navigation,
}: NativeStackScreenProps<NativeStackParamList, 'NewsFeed'>) => {
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
            onPress={() => navigation.replace('BottomTabs')}
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

const Stack = createNativeStackNavigator<NativeStackParamList>();

const BottomTabs = createComponentForStaticNavigation(
  NativeBottomTabs.screen,
  'BottomTabs'
);

export function NativeStackNext(
  _: StaticScreenProps<NavigatorScreenParams<NativeStackParamList>>
) {
  return (
    <Stack.Navigator
      screenLayout={({ children, route }) =>
        route.name === 'BottomTabs' ? (
          children
        ) : (
          <SafeAreaView style={{ flex: 1 }}>{children}</SafeAreaView>
        )
      }
    >
      <Stack.Screen
        name="Article"
        component={ArticleScreen}
        options={({ route }) => {
          return {
            title: `Article by ${route.params?.author ?? 'Unknown'}`,
            headerLargeTitleEnabled: true,
            headerLargeTitleShadowVisible: false,
          };
        }}
        initialParams={{ author: 'Gandalf' }}
      />
      <Stack.Screen
        name="NewsFeed"
        component={NewsFeedScreen}
        options={{
          title: 'Feed',
          fullScreenGestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="BottomTabs"
        component={BottomTabs}
        options={{
          headerSearchBarOptions: {
            placeholder: 'Filter contacts',
          },
        }}
      />
    </Stack.Navigator>
  );
}

NativeStackNext.title = 'Native Stack - Next';
NativeStackNext.linking = linking;
NativeStackNext.options = {
  gestureEnabled: false,
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
