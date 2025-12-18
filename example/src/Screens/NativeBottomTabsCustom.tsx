import {
  BottomTabBar,
  createBottomTabNavigator,
  createBottomTabScreen,
} from '@react-navigation/bottom-tabs';
import {
  Button,
  getHeaderTitle,
  Header,
  useHeaderHeight,
} from '@react-navigation/elements';
import {
  type StaticScreenProps,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import iconBookUser from '../../assets/icons/book-user.png';
import iconListMusic from '../../assets/icons/list-music.png';
import iconMusic from '../../assets/icons/music.png';
import iconNewspaper from '../../assets/icons/newspaper.png';
import { SystemBars } from '../edge-to-edge';
import { Albums } from '../Shared/Albums';
import { Article } from '../Shared/Article';
import { Contacts } from '../Shared/Contacts';
import { MiniPlayer } from '../Shared/MiniPlayer';

function ArticleScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation('TabArticle');

  return (
    <ScrollView contentContainerStyle={{ paddingTop: insets.top }}>
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

function ContactsScreen(_: StaticScreenProps<{ count: number }>) {
  const insets = useSafeAreaInsets();

  return <Contacts contentContainerStyle={{ paddingTop: insets.top }} />;
}

function AlbumsScreen() {
  const navigation = useNavigation<typeof NativeBottomTabsCustomNavigator>();
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
}

let i = 1;

const NativeBottomTabsCustomNavigator = createBottomTabNavigator({
  tabBar: (props) => <BottomTabBar {...props} />,
  screenOptions: {
    tabBarPosition: 'left',
  },
  screens: {
    TabArticle: createBottomTabScreen({
      screen: ArticleScreen,
      options: {
        title: 'Article',
        tabBarButtonTestID: 'article',
        tabBarIcon: {
          type: 'image',
          source: iconNewspaper,
        },
      },
    }),
    TabContacts: createBottomTabScreen({
      screen: ContactsScreen,
      initialParams: { count: i },
      options: ({ route }) => ({
        title: 'Contacts',
        tabBarButtonTestID: 'contacts',
        tabBarIcon: {
          type: 'image',
          source: iconBookUser,
        },
        tabBarBadge: route.params?.count,
      }),
      linking: 'contacts',
    }),
    TabAlbums: createBottomTabScreen({
      screen: AlbumsScreen,
      options: () => {
        return {
          title: 'Albums',
          tabBarButtonTestID: 'albums',
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
          tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.7)',
          tabBarStyle: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderTopColor: 'transparent',
          },
          tabBarPosition: 'bottom',
          bottomAccessory: ({ placement }) => (
            <MiniPlayer placement={placement} />
          ),
        };
      },
      linking: 'albums',
    }),
  },
});

export const NativeBottomTabsCustom = {
  screen: NativeBottomTabsCustomNavigator,
  title: 'Native Bottom Tabs - Custom Tab Bar',
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
