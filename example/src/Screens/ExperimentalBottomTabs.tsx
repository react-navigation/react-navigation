import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {
  type BottomTabScreenProps,
  createExperimentalBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {
  Button,
  HeaderButton,
  type NativeStackHeaderItem,
  PlatformPressable,
  useHeaderHeight,
} from '@react-navigation/elements';
import {
  type NavigatorScreenParams,
  type PathConfigMap,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import * as React from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';

import iconBookUser from '../../assets/icons/book-user.png';
import iconHeart from '../../assets/icons/heart.png';
import iconListMusic from '../../assets/icons/list-music.png';
import iconMusic from '../../assets/icons/music.png';
import iconNewspaper from '../../assets/icons/newspaper.png';
import userRoundPlus from '../../assets/icons/user-round-plus.png';
import { SystemBars } from '../edge-to-edge';
import { Albums } from '../Shared/Albums';
import { Article } from '../Shared/Article';
import { Contacts } from '../Shared/Contacts';
import { NativeStack, type NativeStackParams } from './NativeStack';

export type ExperimentalBottomTabParams = {
  TabStack: NavigatorScreenParams<NativeStackParams>;
  TabAlbums: undefined;
  TabContacts: { count: number };
  TabExtra: undefined;
};

const linking: PathConfigMap<ExperimentalBottomTabParams> = {
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
      BottomTabScreenProps<ExperimentalBottomTabParams>['navigation']
    >();
  const headerHeight = useHeaderHeight();
  const isFocused = useIsFocused();

  return (
    <>
      {isFocused && Platform.OS === 'android' && <SystemBars style="light" />}
      <ScrollView
        automaticallyAdjustContentInsets
        contentContainerStyle={{
          paddingTop: headerHeight,
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

const Tab = createExperimentalBottomTabNavigator<ExperimentalBottomTabParams>();

export function ExperimentalBottomTabs() {
  const dimensions = useWindowDimensions();

  const [isCompact, setIsCompact] = React.useState(false);

  const isLargeScreen = dimensions.width >= 1024;

  return (
    <>
      <Tab.Navigator backBehavior="fullHistory">
        <Tab.Screen
          name="TabStack"
          component={Article}
          options={{
            popToTopOnBlur: true,
            title: 'Article',
            headerShown: false,
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
          options={({ navigation }) => {
            const leftItems: NativeStackHeaderItem[] = [
              {
                type: 'button',
                label: 'Back',
                onPress: () => navigation.goBack(),
              },
            ];

            const rightItems: NativeStackHeaderItem[] = [
              {
                type: 'button',
                label: 'Follow',
                icon: {
                  type: 'image',
                  source: userRoundPlus,
                },
                onPress: () => Alert.alert('Follow button pressed'),
              },
              {
                type: 'button',
                label: 'Favorite',
                icon: {
                  type: 'sfSymbol',
                  name: 'heart',
                },
                onPress: () => Alert.alert('Favorite button pressed'),
              },
              {
                type: 'menu',
                label: 'Options',
                icon: {
                  type: 'sfSymbol',
                  name: 'ellipsis',
                },
                badge: {
                  value: 3,
                },
                menu: {
                  title: 'Article options',
                  items: [
                    {
                      type: 'action',
                      label: 'Share',
                      onPress: () => Alert.alert('Share pressed'),
                    },
                    {
                      type: 'action',
                      label: 'Delete',
                      destructive: true,
                      onPress: () => Alert.alert('Delete pressed'),
                    },
                    {
                      type: 'action',
                      label: 'Report',
                      destructive: true,
                      onPress: () => Alert.alert('Report pressed'),
                    },
                    {
                      type: 'submenu',
                      label: 'View history',
                      items: [
                        {
                          type: 'action',
                          label: 'Version 1.0',
                          icon: {
                            type: 'sfSymbol',
                            name: 'checkmark',
                          },
                          onPress: () => Alert.alert('View version 1.0'),
                        },
                        {
                          type: 'action',
                          label: 'Version 0.9',
                          onPress: () => Alert.alert('View version 0.9'),
                        },
                      ],
                    },
                  ],
                },
              },
              {
                type: 'custom',
                element: (
                  <HeaderButton onPress={() => Alert.alert('Info pressed')}>
                    <MaterialCommunityIcons
                      name="information-outline"
                      size={28}
                    />
                  </HeaderButton>
                ),
              },
            ];

            return {
              title: 'Albums',
              tabBarIcon: ({ focused }) => ({
                type: 'image',
                source: focused ? iconListMusic : iconMusic,
              }),
              tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.7)',
              tabBarActiveTintColor: '#fff',
              tabBarStyle: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
              },
              headerLargeTitle: true,
              headerLargeTitleShadowVisible: false,
              headerRight: ({ tintColor }) => (
                <HeaderButton
                  onPress={() => Alert.alert('Favorite button pressed')}
                >
                  <MaterialCommunityIcons
                    name="heart"
                    size={24}
                    color={tintColor}
                  />
                </HeaderButton>
              ),
              unstable_headerLeftItems: () => leftItems,
              unstable_headerRightItems: () => rightItems,
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
      {isLargeScreen ? (
        <PlatformPressable
          onPress={() => setIsCompact(!isCompact)}
          style={{
            position: 'absolute',
            bottom: 0,
            start: 0,
            padding: 16,
          }}
        >
          <MaterialCommunityIcons
            name={isCompact ? 'chevron-double-right' : 'chevron-double-left'}
            size={24}
            color="black"
          />
        </PlatformPressable>
      ) : null}
    </>
  );
}

ExperimentalBottomTabs.title = 'Experimental Bottom Tabs';
ExperimentalBottomTabs.linking = linking;

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
