import * as React from 'react';
import { StyleSheet } from 'react-native';
import { createMaterialBottomTabNavigator } from '@navigation-ex/material-bottom-tabs';
import Article from '../Shared/Article';
import Albums from '../Shared/Albums';
import Contacts from '../Shared/Contacts';
import Chat from '../Shared/Chat';

type MaterialBottomTabParams = {
  article: undefined;
  albums: undefined;
  contacts: undefined;
  chat: undefined;
};

const MaterialBottomTabs = createMaterialBottomTabNavigator<
  MaterialBottomTabParams
>();

export default function MaterialBottomTabsScreen() {
  return (
    <MaterialBottomTabs.Navigator barStyle={styles.tabBar}>
      <MaterialBottomTabs.Screen
        name="article"
        component={Article}
        options={{
          tabBarLabel: 'Article',
          tabBarIcon: 'chrome-reader-mode',
          tabBarColor: '#C9E7F8',
        }}
      />
      <MaterialBottomTabs.Screen
        name="chat"
        component={Chat}
        options={{
          tabBarLabel: 'Chat',
          tabBarIcon: 'chat-bubble',
          tabBarColor: '#9FD5C9',
          tabBarBadge: true,
        }}
      />
      <MaterialBottomTabs.Screen
        name="contacts"
        component={Contacts}
        options={{
          tabBarLabel: 'Contacts',
          tabBarIcon: 'contacts',
          tabBarColor: '#F7EAA2',
        }}
      />
      <MaterialBottomTabs.Screen
        name="albums"
        component={Albums}
        options={{
          tabBarLabel: 'Albums',
          tabBarIcon: 'photo-album',
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
