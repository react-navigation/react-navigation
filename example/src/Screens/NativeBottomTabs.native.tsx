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
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
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
import iconLayoutDashboard from '../../assets/icons/layout-dashboard.png';
import iconListMusic from '../../assets/icons/list-music.png';
import iconMusic from '../../assets/icons/music.png';
import iconNewspaper from '../../assets/icons/newspaper.png';
import { Albums } from '../Shared/Albums';
import { Contacts } from '../Shared/Contacts';
import { NewsFeed } from '../Shared/NewsFeed';
import { NativeStack, type NativeStackParams } from './NativeStack';

export type NativeBottomTabParams = {
  TabStack: NavigatorScreenParams<NativeStackParams>;
  TabAlbums: undefined;
  TabContacts: { count: number };
  TabFeed: undefined;
};

const linking: PathConfigMap<NativeBottomTabParams> = {
  TabStack: {
    path: 'stack',
    screens: NativeStack.linking,
  },
  TabAlbums: 'albums',
  TabContacts: 'contacts',
  TabFeed: 'feed',
};

function ContactsScreen() {
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
  const navigation =
    useNavigation<
      NativeBottomTabScreenProps<NativeBottomTabParams>['navigation']
    >();
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
        component={NativeStack}
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
                color={typeof tintColor === 'string' ? tintColor : undefined}
              />
            </HeaderButton>
          ),
          tabBarIcon: {
            type: 'image',
            source: iconNewspaper,
          },
          tabBarMinimizeBehavior: 'onScrollDown',
          tabBarControllerMode: 'tabSidebar',
        }}
      />
      <Tab.Screen
        name="TabContacts"
        component={ContactsScreen}
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
            tabBarActiveTintColor:
              Platform.OS !== 'ios' ? 'rgba(255, 255, 255, 0.9)' : undefined,
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
        name="TabFeed"
        component={NewsFeedScreen}
        options={{
          title: 'Feed',
          tabBarRole: 'prominent',
          tabBarIcon: {
            type: 'image',
            source: iconLayoutDashboard,
          },
        }}
      />
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
