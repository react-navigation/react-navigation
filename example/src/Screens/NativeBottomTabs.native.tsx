import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {
  createNativeBottomTabNavigator,
  type NativeBottomTabScreenProps,
} from '@react-navigation/bottom-tabs/unstable';
import {
  Button,
  getHeaderTitle,
  Header,
  HeaderButton,
  Text,
  useHeaderHeight,
} from '@react-navigation/elements';
import {
  type NavigatorScreenParams,
  type PathConfigMap,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BlurView } from 'expo-blur';
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import album10 from '../../assets/album-art-10.jpg';
import iconBookUser from '../../assets/icons/book-user.png';
import iconHeart from '../../assets/icons/heart.png';
import iconListMusic from '../../assets/icons/list-music.png';
import iconMusic from '../../assets/icons/music.png';
import iconNewspaper from '../../assets/icons/newspaper.png';
import { Albums } from '../Shared/Albums';
import { Article } from '../Shared/Article';
import { Contacts } from '../Shared/Contacts';
import { NativeStack, type NativeStackParams } from './NativeStack';

export type NativeBottomTabParams = {
  TabStack: NavigatorScreenParams<NativeStackParams>;
  TabAlbums: undefined;
  TabContacts: { count: number };
  TabFavorites: undefined;
};

const linking: PathConfigMap<NativeBottomTabParams> = {
  TabStack: {
    path: 'stack',
    screens: NativeStack.linking,
  },
  TabAlbums: 'albums',
  TabContacts: 'contacts',
};

const ArticleStack = createNativeStackNavigator<{ Article: undefined }>();

function ArticleStackScreen() {
  return (
    <ArticleStack.Navigator>
      <ArticleStack.Screen
        name="Article"
        component={ArticleScreen}
        options={{
          title: 'Article',
        }}
      />
    </ArticleStack.Navigator>
  );
}

function ArticleScreen() {
  const navigation =
    useNavigation<
      NativeBottomTabScreenProps<NativeBottomTabParams>['navigation']
    >();

  return (
    <ScrollView automaticallyAdjustContentInsets>
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
      <Article />
    </ScrollView>
  );
}

function AlbumsScreen() {
  const navigation =
    useNavigation<
      NativeBottomTabScreenProps<NativeBottomTabParams>['navigation']
    >();
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();

  return (
    <>
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

function MiniPlayer({ placement }: { placement: 'inline' | 'regular' }) {
  return (
    <View style={styles.miniPlayer}>
      <View style={styles.miniPlayerCoverContainer}>
        <Image source={album10} style={styles.miniPlayerCover} />
      </View>
      {placement === 'inline' ? (
        <View style={styles.miniPlayerButtons}>
          <Ionicons name="play-back" size={32} />
          <Ionicons name="play" size={32} />
          <Ionicons name="play-forward" size={32} />
        </View>
      ) : (
        <>
          <Text numberOfLines={1} style={styles.miniPlayerAlbumTitle}>
            Sgt Pepper's Lonely Hearts Club Band
          </Text>
          <View style={styles.miniPlayerButtons}>
            <Ionicons name="play" size={32} />
            <Ionicons name="play-forward" size={32} />
          </View>
        </>
      )}
    </View>
  );
}

let i = 1;

const Tab = createNativeBottomTabNavigator<NativeBottomTabParams>();

export function NativeBottomTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="TabStack"
        component={ArticleStackScreen}
        options={{
          popToTopOnBlur: true,
          title: 'Article',
          headerRight: ({ tintColor }) => (
            <HeaderButton
              onPress={() => Alert.alert('Favorite button pressed')}
            >
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
        }}
      />
      <Tab.Screen
        name="TabContacts"
        component={Contacts}
        initialParams={{ count: i }}
        options={({ route }) => ({
          title: 'Contacts',
          tabBarIcon: Platform.select({
            ios: {
              type: 'sfSymbol',
              name: 'person.2',
            },
            default: {
              type: 'image',
              source: iconBookUser,
            },
          }),
          tabBarBadge: route.params?.count,
        })}
      />
      <Tab.Screen
        name="TabAlbums"
        component={AlbumsScreen}
        options={() => {
          return {
            title: 'Albums',
            header: ({ options, route }) => (
              <Header
                {...options}
                title={getHeaderTitle(options, route.name)}
              />
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
            tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.7)',
            tabBarStyle: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
            },
            tabBarMinimizeBehavior: 'onScrollDown',
            bottomAccessory: ({ placement }) => (
              <MiniPlayer placement={placement} />
            ),
          };
        }}
      />

      <Tab.Screen
        name="TabFavorites"
        options={{
          title: 'Favorites',
          tabBarSystemItem: 'search',
          tabBarLabel: 'Favorites',
          tabBarIcon: {
            type: 'image',
            source: iconHeart,
          },
          headerShown: true,
          headerSearchBarOptions: {
            placeholder: 'Search Favorites',
          },
        }}
      >
        {() => null}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

NativeBottomTabs.title = 'Native Bottom Tabs';
NativeBottomTabs.linking = linking;

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
  miniPlayer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  miniPlayerCoverContainer: {
    margin: 5,
  },
  miniPlayerCover: {
    height: '100%',
    aspectRatio: 1,
    borderRadius: '50%',
  },
  miniPlayerAlbumTitle: {
    flexShrink: 1,
    alignSelf: 'center',
    marginStart: 10,
    fontWeight: 'bold',
  },
  miniPlayerButtons: {
    flexDirection: 'row',
    gap: 15,
    justifyContent: 'center',
    marginHorizontal: 15,
  },
});
