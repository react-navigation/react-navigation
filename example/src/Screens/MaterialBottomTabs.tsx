import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import type { NavigatorScreenParams } from '@react-navigation/native';
import * as React from 'react';
import { StyleSheet } from 'react-native';

import Albums from '../Shared/Albums';
import Chat from '../Shared/Chat';
import Contacts from '../Shared/Contacts';
import SimpleStackScreen, { SimpleStackParams } from './SimpleStack';

type MaterialBottomTabParams = {
  TabStack: NavigatorScreenParams<SimpleStackParams>;
  TabAlbums: undefined;
  TabContacts: undefined;
  TabChat: undefined;
};

const MaterialBottomTabs =
  createMaterialBottomTabNavigator<MaterialBottomTabParams>();

export default function MaterialBottomTabsScreen() {
  return (
    <MaterialBottomTabs.Navigator barStyle={styles.tabBar}>
      <MaterialBottomTabs.Screen
        name="TabStack"
        options={{
          tabBarLabel: 'Article',
          tabBarIcon: 'file-document',
          tabBarColor: '#C9E7F8',
        }}
      >
        {(props) => (
          <SimpleStackScreen
            {...props}
            screenOptions={{ headerShown: false }}
          />
        )}
      </MaterialBottomTabs.Screen>
      <MaterialBottomTabs.Screen
        name="TabChat"
        component={Chat}
        options={{
          tabBarLabel: 'Chat',
          tabBarIcon: 'message-reply',
          tabBarColor: '#9FD5C9',
          tabBarBadge: true,
        }}
      />
      <MaterialBottomTabs.Screen
        name="TabContacts"
        component={Contacts}
        options={{
          tabBarLabel: 'Contacts',
          tabBarIcon: 'contacts',
          tabBarColor: '#F7EAA2',
        }}
      />
      <MaterialBottomTabs.Screen
        name="TabAlbums"
        component={Albums}
        options={{
          tabBarLabel: 'Albums',
          tabBarIcon: 'image-album',
          tabBarColor: '#FAD4D6',
        }}
      />
    </MaterialBottomTabs.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'white',
  },
});
