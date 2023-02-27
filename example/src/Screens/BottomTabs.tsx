import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {
  createBottomTabNavigator,
  useBottomTabBarHeight,
} from '@react-navigation/bottom-tabs';
import { HeaderBackButton, useHeaderHeight } from '@react-navigation/elements';
import {
  getFocusedRouteNameFromRoute,
  NavigatorScreenParams,
  ParamListBase,
  useIsFocused,
} from '@react-navigation/native';
import type { StackScreenProps } from '@react-navigation/stack';
import { BlurView } from 'expo-blur';
import * as React from 'react';
import { ScrollView, StatusBar, StyleSheet } from 'react-native';

import { Albums } from '../Shared/Albums';
import { Chat } from '../Shared/Chat';
import { Contacts } from '../Shared/Contacts';
import { SimpleStack, SimpleStackParams } from './SimpleStack';

const getTabBarIcon =
  (name: React.ComponentProps<typeof MaterialCommunityIcons>['name']) =>
  ({ color, size }: { color: string; size: number }) =>
    <MaterialCommunityIcons name={name} color={color} size={size} />;

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
      {isFocused && <StatusBar barStyle="light-content" />}
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

export function BottomTabs({
  navigation,
  route,
}: StackScreenProps<ParamListBase, string>) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Article';

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
      title: routeName,
    });
  }, [navigation, routeName]);

  return (
    <Tab.Navigator
      screenOptions={{
        headerLeft: (props) => (
          <HeaderBackButton {...props} onPress={navigation.goBack} />
        ),
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
            position: 'absolute',
            borderTopColor: 'rgba(0, 0, 0, .2)',
          },
          tabBarBackground: () => (
            <BlurView
              tint="dark"
              intensity={100}
              style={StyleSheet.absoluteFill}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
