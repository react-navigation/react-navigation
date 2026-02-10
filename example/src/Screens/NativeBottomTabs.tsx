import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {
  type BottomTabIcon,
  createBottomTabNavigator,
  createBottomTabScreen,
} from '@react-navigation/bottom-tabs';
import {
  Button,
  getHeaderTitle,
  Header,
  HeaderButton,
  useHeaderHeight,
} from '@react-navigation/elements';
import {
  type StaticScreenProps,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  createNativeStackScreen,
} from '@react-navigation/native-stack';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import { Alert, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import iconBookUser from '../../assets/icons/book-user.png';
import iconHeart from '../../assets/icons/heart.png';
import iconListMusic from '../../assets/icons/list-music.png';
import iconMusic from '../../assets/icons/music.png';
import iconNewspaper from '../../assets/icons/newspaper.png';
import { Albums } from '../Shared/Albums';
import { Contacts } from '../Shared/Contacts';
import { MiniPlayer } from '../Shared/MiniPlayer';
import { NativeStack } from './NativeStack';

function ContactsScreen(_: StaticScreenProps<{ count: number }>) {
  return <Contacts />;
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
              ? // FIXME: seems iOS has an extra inset on top of header height
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

const FavoritesStack = createNativeStackNavigator({
  screens: {
    Favorites: createNativeStackScreen({
      screen: () => null,
      options: {
        title: 'Favorites',
        headerSearchBarOptions: {
          placeholder: 'Search Favorites',
        },
      },
    }),
  },
});

let i = 1;

const NativeBottomTabsNavigator = createBottomTabNavigator({
  screens: {
    TabStack: createBottomTabScreen({
      screen: NativeStack,
      options: {
        popToTopOnBlur: true,
        title: 'Article',
        headerRight: ({ tintColor }) => (
          <HeaderButton onPress={() => Alert.alert('Favorite button pressed')}>
            <MaterialCommunityIcons
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
      linking: {
        path: 'stack',
        screens: NativeStack.linking.screens,
      },
    }),
    TabContacts: createBottomTabScreen({
      screen: ContactsScreen,
      initialParams: { count: i },
      options: ({ route }) => ({
        title: 'Contacts',
        tabBarIcon: Platform.select<BottomTabIcon>({
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
    TabFavorites: createBottomTabScreen({
      screen: FavoritesStack,
      options: {
        title: 'Favorites',
        tabBarSystemItem: 'search',
        tabBarLabel: 'Favorites',
        tabBarIcon: {
          type: 'image',
          source: iconHeart,
        },
      },
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
