import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import {
  createBottomTabNavigator,
  createBottomTabScreen,
} from '@react-navigation/bottom-tabs';
import {
  Button,
  getHeaderTitle,
  Header,
  HeaderButton,
  type Icon,
  useHeaderHeight,
} from '@react-navigation/elements';
import {
  type StaticScreenProps,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import { Alert, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import iconBookUser from '../../assets/icons/book-user.png';
import iconLayoutDashboard from '../../assets/icons/layout-dashboard.png';
import iconListMusic from '../../assets/icons/list-music.png';
import iconMusic from '../../assets/icons/music.png';
import iconNewspaper from '../../assets/icons/newspaper.png';
import { Albums } from '../Shared/Albums';
import { Contacts } from '../Shared/Contacts';
import { MiniPlayer } from '../Shared/MiniPlayer';
import { NewsFeed } from '../Shared/NewsFeed';
import { NativeStack } from './NativeStack';

function ContactsScreen(_: StaticScreenProps<{ count: number }>) {
  const insets = useSafeAreaInsets();

  return (
    <Contacts
      automaticallyAdjustContentInsets
      contentContainerStyle={{
        paddingTop: Platform.OS === 'ios' ? 0 : insets.top,
      }}
    />
  );
}

function AlbumsScreen() {
  const navigation = useNavigation<typeof NativeBottomTabsNavigator>();
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();

  return (
    <>
      {isFocused && <StatusBar style="light" />}
      <ScrollView
        automaticallyAdjustContentInsets
        contentContainerStyle={{
          paddingTop:
            Platform.OS === 'ios'
              ? // iOS also has automatic safe area insets at top
                headerHeight - insets.top
              : headerHeight,
        }}
      >
        <View style={styles.buttons}>
          <Button
            variant="filled"
            onPress={() => {
              navigation.navigate('TabContacts', { count: i++ });
            }}
          >
            Go to Contacts
          </Button>
          <Button variant="tinted" onPress={() => navigation.goBack()}>
            Go back
          </Button>
        </View>
        <Albums scrollEnabled={false} />
      </ScrollView>
    </>
  );
}

function NewsFeedScreen() {
  const insets = useSafeAreaInsets();

  return (
    <NewsFeed
      automaticallyAdjustContentInsets
      contentContainerStyle={{
        paddingTop: Platform.OS === 'ios' ? 0 : insets.top,
      }}
    />
  );
}

let i = 1;

const NativeBottomTabsNavigator = createBottomTabNavigator({
  screens: {
    TabStack: createBottomTabScreen({
      screen: NativeStack.screen,
      options: {
        popToTopOnBlur: true,
        title: 'Article',
        headerRight: ({ tintColor }) => (
          <HeaderButton onPress={() => Alert.alert('Favorite button pressed')}>
            <MaterialDesignIcons
              name="heart-outline"
              size={24}
              color={tintColor}
            />
          </HeaderButton>
        ),
        tabBarIcon: {
          type: 'image',
          source: iconNewspaper,
        },
        tabBarMinimizeBehavior: 'onScrollDown',
        tabBarControllerMode: 'tabSidebar',
      },
      linking: 'stack',
    }),
    TabContacts: createBottomTabScreen({
      screen: ContactsScreen,
      initialParams: { count: i },
      options: ({ route }) => ({
        title: 'Contacts',
        tabBarIcon: Platform.select<Icon>({
          ios: {
            type: 'sfSymbol',
            name: 'person.2',
          },
          android: {
            type: 'materialSymbol',
            name: 'contacts',
          },
          default: {
            type: 'image',
            source: iconBookUser,
          },
        }),
        tabBarBadge: route.params?.count,
      }),
      linking: 'contacts',
    }),
    TabAlbums: createBottomTabScreen({
      screen: AlbumsScreen,
      options: () => {
        return {
          title: 'Albums',
          header: ({ options, route }) => (
            <Header {...options} title={getHeaderTitle(options, route.name)} />
          ),
          headerTintColor: '#fff',
          headerTransparent: true,
          headerBackground: () => (
            <BlurView
              tint="dark"
              intensity={100}
              style={StyleSheet.absoluteFill}
            />
          ),
          tabBarIcon: ({ focused }) => ({
            type: 'image',
            source: focused ? iconListMusic : iconMusic,
          }),
          tabBarActiveTintColor:
            Platform.OS !== 'ios' ? 'rgba(255, 255, 255, 0.9)' : undefined,
          tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.7)',
          tabBarStyle: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderTopColor: 'transparent',
          },
          tabBarMinimizeBehavior: 'onScrollDown',
          bottomAccessory: ({ placement }) => (
            <MiniPlayer placement={placement} />
          ),
        };
      },
      linking: 'albums',
    }),
    TabFeed: createBottomTabScreen({
      screen: NewsFeedScreen,
      options: {
        title: 'Feed',
        tabBarRole: 'prominent',
        tabBarIcon: {
          type: 'image',
          source: iconLayoutDashboard,
        },
      },
      linking: 'feed',
    }),
  },
});

export const NativeBottomTabs = {
  screen: NativeBottomTabsNavigator,
  title: 'Native Bottom Tabs - Basic',
};

const styles = StyleSheet.create({
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginEnd: 16,
  },
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    margin: 12,
  },
});
