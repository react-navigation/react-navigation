import * as React from 'react';
import { StyleSheet } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Albums from '../Shared/Albums';
import Contacts from '../Shared/Contacts';
import Chat from '../Shared/Chat';
import SimpleStackScreen from './SimpleStack';

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
        options={{
          tabBarLabel: 'Article',
          tabBarIcon: 'file-document-box',
          tabBarColor: '#C9E7F8',
        }}
      >
        {props => <SimpleStackScreen {...props} headerMode="none" />}
      </MaterialBottomTabs.Screen>
      <MaterialBottomTabs.Screen
        name="chat"
        component={Chat}
        options={{
          tabBarLabel: 'Chat',
          tabBarIcon: 'message-reply',
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
