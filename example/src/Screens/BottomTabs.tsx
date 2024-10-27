import { useActionSheet } from '@expo/react-native-action-sheet';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {
  type BottomTabScreenProps,
  createBottomTabNavigator,
  useBottomTabBarHeight,
} from '@react-navigation/bottom-tabs';
import {
  HeaderBackButton,
  HeaderButton,
  PlatformPressable,
  useHeaderHeight,
} from '@react-navigation/elements';
import {
  type NavigatorScreenParams,
  type PathConfigMap,
  useIsFocused,
  useLocale,
} from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import * as React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';

import { Albums } from '../Shared/Albums';
import { Chat } from '../Shared/Chat';
import { Contacts } from '../Shared/Contacts';
import { NativeStack, type NativeStackParams } from './NativeStack';

const getTabBarIcon =
  (name: React.ComponentProps<typeof MaterialCommunityIcons>['name']) =>
  ({ color, size }: { color: string; size: number }) => (
    <MaterialCommunityIcons name={name} color={color} size={size} />
  );

export type BottomTabParams = {
  TabStack: NavigatorScreenParams<NativeStackParams>;
  TabAlbums: undefined;
  TabContacts: undefined;
  TabChat: undefined;
};

const linking: PathConfigMap<BottomTabParams> = {
  TabStack: {
    path: 'stack',
    screens: NativeStack.linking,
  },
  TabAlbums: 'albums',
  TabContacts: 'contacts',
  TabChat: 'chat',
};

const AlbumsScreen = () => {
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const isFocused = useIsFocused();

  return (
    <>
      {isFocused && Platform.OS === 'android' && (
        <StatusBar barStyle="light-content" />
      )}
      <ScrollView
        contentContainerStyle={{
          paddingTop: headerHeight,
          paddingBottom: tabBarHeight,
        }}
      >
        <Albums scrollEnabled={false} />
      </ScrollView>
    </>
  );
};

const Tab = createBottomTabNavigator<BottomTabParams>();

const animations = ['none', 'fade', 'shift'] as const;
const variants = ['material', 'uikit'] as const;

export function BottomTabs() {
  const { showActionSheetWithOptions } = useActionSheet();
  const { direction } = useLocale();

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
        screenOptions={({
          navigation,
        }: BottomTabScreenProps<BottomTabParams>) => ({
          headerLeft: (props) => (
            <HeaderBackButton {...props} onPress={navigation.goBack} />
          ),
          headerRight: ({ tintColor }) => (
            <View style={styles.buttons}>
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
          tabBarPosition: isLargeScreen
            ? direction === 'ltr'
              ? 'left'
              : 'right'
            : 'bottom',
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
            tabBarIcon: getTabBarIcon('file-document'),
          }}
        />
        <Tab.Screen
          name="TabChat"
          component={Chat}
          options={{
            title: 'Chat',
            tabBarIcon: getTabBarIcon('message-reply'),
            tabBarBadge: 2,
          }}
        />
        <Tab.Screen
          name="TabContacts"
          component={Contacts}
          options={{
            title: 'Contacts',
            tabBarIcon: getTabBarIcon('contacts'),
          }}
        />
        <Tab.Screen
          name="TabAlbums"
          component={AlbumsScreen}
          options={{
            title: 'Albums',
            headerTintColor: '#fff',
            headerTransparent: true,
            headerBackground: () => (
              <BlurView
                tint="dark"
                intensity={100}
                style={StyleSheet.absoluteFill}
              />
            ),
            tabBarIcon: getTabBarIcon('image-album'),
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
                    source={require('../../assets/album-art-03.jpg')}
                    resizeMode="cover"
                    style={{
                      ...StyleSheet.absoluteFillObject,
                      // Override default size of the image
                      height: 'auto',
                      width: 'auto',
                    }}
                  />
                )}
                <BlurView
                  tint="dark"
                  intensity={100}
                  style={{
                    ...StyleSheet.absoluteFillObject,
                    end: isLargeScreen
                      ? // Offset for right border of the sidebar
                        -StyleSheet.hairlineWidth
                      : 0,
                  }}
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
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginEnd: 16,
  },
});
