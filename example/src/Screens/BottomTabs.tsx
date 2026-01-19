import { useActionSheet } from '@expo/react-native-action-sheet';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {
  type BottomTabScreenProps,
  createBottomTabNavigator,
  useBottomTabBarHeight,
} from '@react-navigation/bottom-tabs';
import {
  Button,
  HeaderBackButton,
  HeaderButton,
  PlatformPressable,
  useHeaderHeight,
} from '@react-navigation/elements';
import {
  type NavigatorScreenParams,
  type PathConfig,
  type StaticScreenProps,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import * as React from 'react';
import {
  type ColorValue,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';

import iconBookUser from '../../assets/icons/book-user.png';
import iconListMusic from '../../assets/icons/list-music.png';
import iconMusic from '../../assets/icons/music.png';
import iconNewspaper from '../../assets/icons/newspaper.png';
import { SystemBars } from '../edge-to-edge';
import { Albums } from '../Shared/Albums';
import { Chat } from '../Shared/Chat';
import { Contacts } from '../Shared/Contacts';
import { NativeStack, type NativeStackParamList } from './NativeStack';

export type BottomTabParamList = {
  TabStack: NavigatorScreenParams<NativeStackParamList>;
  TabAlbums: undefined;
  TabContacts: undefined;
  TabChat: { count: number } | undefined;
};

const linking = {
  screens: {
    TabStack: {
      path: 'stack',
      screens: NativeStack.linking.screens,
    },
    TabAlbums: 'albums',
    TabContacts: 'contacts',
    TabChat: 'chat',
  },
} satisfies PathConfig<NavigatorScreenParams<BottomTabParamList>>;

const AlbumsScreen = () => {
  const navigation = useNavigation<typeof Tab>();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const isFocused = useIsFocused();

  return (
    <>
      {isFocused && Platform.OS === 'android' && <SystemBars style="light" />}
      <ScrollView
        contentContainerStyle={{
          paddingTop: headerHeight,
          paddingBottom: tabBarHeight,
        }}
      >
        <View style={styles.buttons}>
          <Button
            variant="filled"
            onPress={() => {
              navigation.navigate('TabChat', { count: i++ });
            }}
          >
            Go to Chat
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

const Tab = createBottomTabNavigator<BottomTabParamList>();

const animations = ['none', 'fade', 'shift'] as const;
const variants = ['material', 'uikit'] as const;

export function BottomTabs(
  _: StaticScreenProps<NavigatorScreenParams<BottomTabParamList>>
) {
  const { showActionSheetWithOptions } = useActionSheet();

  const dimensions = useWindowDimensions();

  const [variant, setVariant] =
    React.useState<(typeof variants)[number]>('material');
  const [animation, setAnimation] =
    React.useState<(typeof animations)[number]>('none');

  const [isCompact, setIsCompact] = React.useState(false);

  const isLargeScreen = dimensions.width >= 1024;

  return (
    <>
      <Tab.Navigator
        implementation="custom"
        backBehavior="fullHistory"
        screenOptions={({
          navigation,
        }: BottomTabScreenProps<BottomTabParamList>) => ({
          headerShown: true,
          headerLeft: (props) => (
            <HeaderBackButton {...props} onPress={navigation.goBack} />
          ),
          headerRight: ({ tintColor }) => (
            <View style={styles.headerRight}>
              <HeaderButton
                onPress={() => {
                  showActionSheetWithOptions(
                    {
                      options: variants.map((option) => {
                        if (option === variant) {
                          return `${option} (current)`;
                        }

                        return option;
                      }),
                    },
                    (index) => {
                      if (index != null) {
                        setVariant(variants[index]);
                      }
                    }
                  );
                }}
              >
                <MaterialCommunityIcons
                  name={variant === 'uikit' ? 'ballot-outline' : 'ballot'}
                  size={24}
                  color={tintColor}
                />
              </HeaderButton>
              <HeaderButton
                onPress={() => {
                  showActionSheetWithOptions(
                    {
                      options: animations.map((option) => {
                        if (option === animation) {
                          return `${option} (current)`;
                        }

                        return option;
                      }),
                    },
                    (index) => {
                      if (index != null) {
                        setAnimation(animations[index]);
                      }
                    }
                  );
                }}
              >
                <MaterialCommunityIcons
                  name={
                    animation === 'none' ? 'movie-open-outline' : 'movie-open'
                  }
                  size={24}
                  color={tintColor}
                />
              </HeaderButton>
            </View>
          ),
          tabBarControllerMode: isLargeScreen ? 'tabSidebar' : 'tabBar',
          tabBarVariant: isLargeScreen ? variant : 'uikit',
          tabBarLabelPosition:
            isLargeScreen && isCompact && variant !== 'uikit'
              ? 'below-icon'
              : undefined,
          animation,
        })}
      >
        <Tab.Screen
          name="TabStack"
          component={NativeStack}
          options={{
            popToTopOnBlur: true,
            title: 'Article',
            headerShown: false,
            tabBarButtonTestID: 'article',
            tabBarIcon: {
              type: 'image',
              source: iconNewspaper,
            },
          }}
        />
        <Tab.Screen
          name="TabChat"
          component={Chat}
          initialParams={{ count: i }}
          options={({ route }) => ({
            title: 'Chat',
            tabBarButtonTestID: 'chat',
            tabBarIcon: ({
              color,
              size,
            }: {
              color: ColorValue;
              size: number;
            }) => (
              <MaterialCommunityIcons
                name="message-reply"
                color={color}
                size={size}
              />
            ),
            tabBarBadge: route.params?.count,
          })}
        />
        <Tab.Screen
          name="TabContacts"
          component={Contacts}
          options={{
            title: 'Contacts',
            tabBarButtonTestID: 'contacts',
            tabBarIcon: Platform.select({
              ios: {
                type: 'sfSymbol',
                name: 'person.2',
              },
              android: {
                type: 'materialSymbol',
                name: 'people',
              },
              default: {
                type: 'image',
                source: iconBookUser,
              },
            }),
          }}
        />
        <Tab.Screen
          name="TabAlbums"
          component={AlbumsScreen}
          options={{
            title: 'Albums',
            tabBarButtonTestID: 'albums',
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
            tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.5)',
            tabBarActiveTintColor: '#fff',
            tabBarStyle: [
              { borderRightWidth: 0, borderLeftWidth: 0, borderTopWidth: 0 },
              isLargeScreen ? null : { position: 'absolute' },
            ],
            tabBarBackground: () => (
              <>
                {isLargeScreen && (
                  <Image
                    source={require('../../assets/album-art/03.jpg')}
                    resizeMode="cover"
                    style={[
                      StyleSheet.absoluteFill,
                      {
                        // Override default size of the image
                        height: 'auto',
                        width: 'auto',
                      },
                    ]}
                  />
                )}
                <BlurView
                  tint="dark"
                  intensity={100}
                  style={[
                    StyleSheet.absoluteFill,
                    {
                      end: isLargeScreen
                        ? // Offset for right border of the sidebar
                          -StyleSheet.hairlineWidth
                        : 0,
                    },
                  ]}
                />
              </>
            ),
          }}
        />
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

BottomTabs.title = 'Bottom Tabs';
BottomTabs.linking = linking;

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
