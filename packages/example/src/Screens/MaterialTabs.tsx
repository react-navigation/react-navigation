import * as React from 'react';
import { StyleSheet } from 'react-native';
import createMaterialTopTabNavigator from '@navigation-ex/material-top-tabs';
import Albums from '../Shared/Albums';
import Contacts from '../Shared/Contacts';
import Chat from '../Shared/Chat';

type MaterialTabParams = {
  albums: undefined;
  contacts: undefined;
  chat: undefined;
};

const MaterialTabs = createMaterialTopTabNavigator<MaterialTabParams>();

export default function MaterialTabsScreen() {
  return (
    <MaterialTabs.Navigator
      tabBarOptions={{
        style: styles.tabBar,
        labelStyle: styles.tabLabel,
        indicatorStyle: styles.tabIndicator,
      }}
    >
      <MaterialTabs.Screen
        name="chat"
        component={Chat}
        options={{ title: 'Chat' }}
      />
      <MaterialTabs.Screen
        name="contacts"
        component={Contacts}
        options={{ title: 'Contacts' }}
      />
      <MaterialTabs.Screen
        name="albums"
        component={Albums}
        options={{ title: 'Albums' }}
      />
    </MaterialTabs.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'white',
  },
  tabLabel: {
    color: 'black',
  },
  tabIndicator: {
    backgroundColor: 'tomato',
  },
});
