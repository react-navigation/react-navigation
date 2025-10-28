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
  useHeaderHeight,
} from '@react-navigation/elements';
import {
  type NavigatorScreenParams,
  type PathConfigMap,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { Alert, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import iconBookUser from '../../assets/icons/book-user.png';
import iconHeart from '../../assets/icons/heart.png';
import iconListMusic from '../../assets/icons/list-music.png';
import iconMusic from '../../assets/icons/music.png';
import iconNewspaper from '../../assets/icons/newspaper.png';
import { SystemBars } from '../edge-to-edge';
import { Albums } from '../Shared/Albums';
import { Article } from '../Shared/Article';
import { Contacts } from '../Shared/Contacts';
import { NativeStack, type NativeStackParams } from './NativeStack';

export type NativeBottomTabParams = {
  TabStack: NavigatorScreenParams<NativeStackParams>;
  TabAlbums: undefined;
  TabContacts: { count: number };
  TabExtra: undefined;
};

const linking: PathConfigMap<NativeBottomTabParams> = {
  TabStack: {
    path: 'stack',
    screens: NativeStack.linking,
  },
  TabAlbums: 'albums',
  TabContacts: 'contacts',
};

const AlbumsScreen = () => {
  const navigation =
    useNavigation<
      NativeBottomTabScreenProps<NativeBottomTabParams>['navigation']
    >();
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();

  return (
    <>
      {isFocused && <SystemBars style="light" />}
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
};

let i = 1;

const Tab = createNativeBottomTabNavigator<NativeBottomTabParams>();

export function NativeBottomTabs() {
  return (
    <Tab.Navigator backBehavior="fullHistory">
      <Tab.Screen
        name="TabStack"
        component={Article}
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
            tabBarActiveTintColor: '#fff',
            tabBarStyle: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
            },
          };
        }}
      />

      <Tab.Screen
        name="TabExtra"
        options={{
          tabBarSystemItem: 'search',
          tabBarLabel: 'Favorites',
          tabBarIcon: {
            type: 'image',
            source: iconHeart,
          },
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            Alert.alert('Extra Action', 'Favorites pressed.');
          },
        }}
      >
        {() => null}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

NativeBottomTabs.title = 'Experimental Bottom Tabs';
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
});
