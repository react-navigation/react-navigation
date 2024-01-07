import { useActionSheet } from '@expo/react-native-action-sheet';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {
  createBottomTabNavigator,
  TransitionPresets,
  useBottomTabBarHeight,
} from '@react-navigation/bottom-tabs';
import { HeaderBackButton, useHeaderHeight } from '@react-navigation/elements';
import {
  type NavigatorScreenParams,
  type ParamListBase,
  useIsFocused,
} from '@react-navigation/native';
import type { StackScreenProps } from '@react-navigation/stack';
import { BlurView } from 'expo-blur';
import * as React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { Appbar, IconButton } from 'react-native-paper';

import { Albums } from '../Shared/Albums';
import { Chat } from '../Shared/Chat';
import { Contacts } from '../Shared/Contacts';
import { SimpleStack, type SimpleStackParams } from './SimpleStack';

const getTabBarIcon =
  (name: React.ComponentProps<typeof MaterialCommunityIcons>['name']) =>
  ({ color, size }: { color: string; size: number }) => (
    <MaterialCommunityIcons name={name} color={color} size={size} />
  );

type BottomTabParams = {
  TabStack: NavigatorScreenParams<SimpleStackParams>;
  TabAlbums: undefined;
  TabContacts: undefined;
  TabChat: undefined;
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

const animations = {
  shifting: TransitionPresets.ShiftingTransition,
  fade: TransitionPresets.FadeTransition,
  none: null,
} as const;

export function BottomTabs({
  navigation,
}: StackScreenProps<ParamListBase, string>) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const { showActionSheetWithOptions } = useActionSheet();

  const dimensions = useWindowDimensions();

  const [animation, setAnimation] =
    React.useState<keyof typeof animations>('none');
  const [isCompact, setIsCompact] = React.useState(false);

  const isLargeScreen = dimensions.width >= 1024;

  return (
    <>
      <Tab.Navigator
        screenOptions={{
          headerLeft: (props) => (
            <HeaderBackButton {...props} onPress={navigation.goBack} />
          ),
          headerRight: ({ tintColor }) => (
            <Appbar.Action
              icon={animation === 'none' ? 'heart-outline' : 'heart'}
              color={tintColor}
              onPress={() => {
                const options = Object.keys(
                  animations
                ) as (keyof typeof animations)[];

                showActionSheetWithOptions(
                  {
                    options: options.map((option) => {
                      if (option === animation) {
                        return `${option} (current)`;
                      }

                      return option;
                    }),
                  },
                  (index) => {
                    if (index != null) {
                      setAnimation(options[index]);
                    }
                  }
                );
              }}
            />
          ),
          tabBarPosition: isLargeScreen ? 'left' : 'bottom',
          tabBarLabelPosition:
            isLargeScreen && isCompact ? 'below-icon' : undefined,
          ...animations[animation],
        }}
      >
        <Tab.Screen
          name="TabStack"
          component={SimpleStack}
          options={{
            title: 'Article',
            tabBarIcon: getTabBarIcon('file-document'),
          }}
        />
        <Tab.Screen
          name="TabChat"
          component={Chat}
          options={{
            tabBarLabel: 'Chat',
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
            tabBarStyle: {
              position: isLargeScreen ? undefined : 'absolute',
              borderColor: 'rgba(0, 0, 0, .2)',
            },
            tabBarBackground: () => (
              <>
                {isLargeScreen && (
                  <Image
                    source={require('../../assets/album-art-03.jpg')}
                    resizeMode="cover"
                    style={{
                      ...StyleSheet.absoluteFillObject,
                      // Override default size of the image
                      height: undefined,
                      width: undefined,
                    }}
                  />
                )}
                <BlurView
                  tint="dark"
                  intensity={100}
                  style={{
                    ...StyleSheet.absoluteFillObject,
                    right: isLargeScreen
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
        <IconButton
          icon={isCompact ? 'chevron-double-right' : 'chevron-double-left'}
          onPress={() => setIsCompact(!isCompact)}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
          }}
        />
      ) : null}
    </>
  );
}
