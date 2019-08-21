/* eslint-disable import/namespace, import/default */

import * as React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// @ts-ignore
import TouchableBounce from 'react-native/Libraries/Components/Touchable/TouchableBounce';
import Albums from '../Shared/Albums';
import Contacts from '../Shared/Contacts';
import Chat from '../Shared/Chat';

const getTabBarIcon = (name: string) => ({
  tintColor,
  horizontal,
}: {
  tintColor: string;
  horizontal: boolean;
}) => (
  <MaterialIcons name={name} color={tintColor} size={horizontal ? 17 : 24} />
);

type BottomTabParams = {
  albums: undefined;
  contacts: undefined;
  chat: undefined;
};

const BottomTabs = createBottomTabNavigator<BottomTabParams>();

export default function BottomTabsScreen() {
  return (
    <BottomTabs.Navigator>
      <BottomTabs.Screen
        name="chat"
        component={Chat}
        options={{
          title: 'Chat',
          tabBarIcon: getTabBarIcon('chat-bubble'),
          tabBarButtonComponent: TouchableBounce,
        }}
      />
      <BottomTabs.Screen
        name="contacts"
        component={Contacts}
        options={{
          title: 'Contacts',
          tabBarIcon: getTabBarIcon('contacts'),
          tabBarButtonComponent: TouchableBounce,
        }}
      />
      <BottomTabs.Screen
        name="albums"
        component={Albums}
        options={{
          title: 'Albums',
          tabBarIcon: getTabBarIcon('photo-album'),
          tabBarButtonComponent: TouchableBounce,
        }}
      />
    </BottomTabs.Navigator>
  );
}
