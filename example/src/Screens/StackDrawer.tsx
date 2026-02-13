import { Button } from '@react-navigation/elements';
import type {
  NavigatorScreenParams,
  PathConfig,
  StaticScreenProps,
} from '@react-navigation/native';
import {
  createStackNavigator,
  type StackCardInterpolationProps,
  type StackScreenProps,
} from '@react-navigation/stack';
import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { COMMON_LINKING_CONFIG } from '../constants';
import { Albums } from '../Shared/Albums';
import { Article } from '../Shared/Article';
import { NewsFeed } from '../Shared/NewsFeed';

const DRAWER_WIDTH_RATIO = 0.75;

type StackDrawerParamList = {
  DrawerHome: undefined;
  Article: { author: string } | undefined;
  Albums: undefined;
  NewsFeed: { date: number };
};

const linking = {
  screens: {
    DrawerHome: 'drawer-home',
    Article: COMMON_LINKING_CONFIG.Article,
    NewsFeed: COMMON_LINKING_CONFIG.NewsFeed,
    Albums: 'albums',
  },
} satisfies PathConfig<NavigatorScreenParams<StackDrawerParamList>>;

const scrollEnabled = Platform.select({ web: true, default: false });

function forDrawerSlide({
  current,
  layouts: { screen },
}: StackCardInterpolationProps) {
  const translateX = current.progress.interpolate({
    inputRange: [0, 1],
    outputRange: [screen.width, 0],
    extrapolate: 'clamp',
  });

  const overlayOpacity = current.progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5],
    extrapolate: 'clamp',
  });

  return {
    cardStyle: {
      transform: [{ translateX }],
    },
    overlayStyle: { opacity: overlayOpacity },
  };
}

const DrawerHomeScreen = ({
  navigation,
}: StackScreenProps<StackDrawerParamList, 'DrawerHome'>) => {
  return (
    <View style={styles.container}>
      <View style={styles.buttons}>
        <Button
          variant="filled"
          onPress={() =>
            navigation.navigate('Article', { author: 'Gandalf' })
          }
        >
          Open Article
        </Button>
        <Button variant="filled" onPress={() => navigation.navigate('Albums')}>
          Open Albums
        </Button>
        <Button
          variant="filled"
          onPress={() =>
            navigation.navigate('NewsFeed', { date: Date.now() })
          }
        >
          Open News Feed
        </Button>
      </View>
    </View>
  );
};

const ArticleScreen = ({
  navigation,
  route,
}: StackScreenProps<StackDrawerParamList, 'Article'>) => {
  return (
    <View style={styles.contentScreen}>
      <Pressable style={styles.overlay} onPress={() => navigation.goBack()} />
      <View style={styles.contentPanel}>
        <ScrollView>
          <View style={styles.buttons}>
            <Button
              variant="tinted"
              onPress={() => navigation.popTo('DrawerHome')}
            >
              Back to drawer
            </Button>
          </View>
          <Article
            author={{ name: route.params?.author ?? 'Unknown' }}
            scrollEnabled={scrollEnabled}
          />
        </ScrollView>
      </View>
    </View>
  );
};

const AlbumsScreen = ({
  navigation,
}: StackScreenProps<StackDrawerParamList, 'Albums'>) => {
  return (
    <View style={styles.contentScreen}>
      <Pressable style={styles.overlay} onPress={() => navigation.goBack()} />
      <View style={styles.contentPanel}>
        <ScrollView>
          <View style={styles.buttons}>
            <Button
              variant="tinted"
              onPress={() => navigation.popTo('DrawerHome')}
            >
              Back to drawer
            </Button>
          </View>
          <Albums scrollEnabled={scrollEnabled} />
        </ScrollView>
      </View>
    </View>
  );
};

const NewsFeedScreen = ({
  navigation,
  route,
}: StackScreenProps<StackDrawerParamList, 'NewsFeed'>) => {
  return (
    <View style={styles.contentScreen}>
      <Pressable style={styles.overlay} onPress={() => navigation.goBack()} />
      <View style={styles.contentPanel}>
        <ScrollView>
          <View style={styles.buttons}>
            <Button
              variant="tinted"
              onPress={() => navigation.popTo('DrawerHome')}
            >
              Back to drawer
            </Button>
          </View>
          <NewsFeed scrollEnabled={scrollEnabled} date={route.params.date} />
        </ScrollView>
      </View>
    </View>
  );
};

const drawerScreenOptions = {
  headerShown: false,
  presentation: 'transparentModal' as const,
  animation: 'default' as const,
  cardStyleInterpolator: forDrawerSlide,
  cardOverlayEnabled: true,
  gestureEnabled: true,
  gestureDirection: 'horizontal' as const,
  transitionSpec: {
    open: { animation: 'timing' as const, config: { duration: 300 } },
    close: { animation: 'timing' as const, config: { duration: 300 } },
  },
};

const StackNavigator = createStackNavigator<StackDrawerParamList>();

export function StackDrawer(
  _: StaticScreenProps<NavigatorScreenParams<StackDrawerParamList>>
) {
  return (
    <StackNavigator.Navigator
      screenListeners={{
        transitionStart: (e) => {
          console.log('transitionStart', e.data);
        },
        transitionEnd: (e) => {
          console.log('transitionEnd', e.data);
        },
      }}
    >
      <StackNavigator.Screen
        name="DrawerHome"
        component={DrawerHomeScreen}
        options={{ title: 'Drawer' }}
      />
      <StackNavigator.Screen
        name="Article"
        component={ArticleScreen}
        options={({ route }) => ({
          ...drawerScreenOptions,
          title: `Article by ${route.params?.author ?? 'Unknown'}`,
        })}
      />
      <StackNavigator.Screen
        name="Albums"
        component={AlbumsScreen}
        options={{
          ...drawerScreenOptions,
          title: 'Albums',
        }}
      />
      <StackNavigator.Screen
        name="NewsFeed"
        component={NewsFeedScreen}
        options={{
          ...drawerScreenOptions,
          title: 'Feed',
        }}
      />
    </StackNavigator.Navigator>
  );
}

StackDrawer.title = 'Stack - Drawer';
StackDrawer.linking = linking;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    margin: 12,
  },
  contentScreen: {
    flex: 1,
    flexDirection: 'row',
  },
  overlay: {
    width: `${(1 - DRAWER_WIDTH_RATIO) * 100}%`,
  },
  contentPanel: {
    flex: 1,
    backgroundColor: 'white',
  },
});
