import * as React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Albums from '../Shared/Albums';
import Contacts from '../Shared/Contacts';
import Chat from '../Shared/Chat';

type MaterialTopTabParams = {
  albums: undefined;
  contacts: undefined;
  chat: undefined;
};

const MaterialTopTabs = createMaterialTopTabNavigator<MaterialTopTabParams>();

export default function MaterialTopTabsScreen() {
  return (
    <MaterialTopTabs.Navigator>
      <MaterialTopTabs.Screen
        name="chat"
        component={Chat}
        options={{ title: 'Chat' }}
      />
      <MaterialTopTabs.Screen
        name="contacts"
        component={Contacts}
        options={{ title: 'Contacts' }}
      />
      <MaterialTopTabs.Screen
        name="albums"
        component={Albums}
        options={{ title: 'Albums' }}
      />
    </MaterialTopTabs.Navigator>
  );
}
