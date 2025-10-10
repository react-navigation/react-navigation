import { createExperimentalBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { type PathConfigMap } from '@react-navigation/native';
import { Platform } from 'react-native';

import { Albums } from '../Shared/Albums';
import { Contacts } from '../Shared/Contacts';

export type BottomTabParams = {
  TabAlbums: undefined;
  TabContacts: undefined;
};

const linking: PathConfigMap<BottomTabParams> = {
  TabAlbums: 'albums',
  TabContacts: 'contacts',
};

const Tab = createExperimentalBottomTabNavigator();

export function ExperimentalBottomTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="TabAlbums"
        component={Albums}
        options={{
          tabBarIcon: Platform.select({
            // ios: { sfSymbolName: 'newspaper' },
            ios: 'star',
            android: 'star_on',
            // android: { name: 'newspaper' },
          }),
          tabBarBadge: 'Hi',
          tabBarBadgeStyle: {
            backgroundColor: 'blue',
            textColor: 'yellow',
            // color: 'white',
          },
          tabBarActiveTintColor: 'green',
          tabBarInactiveTintColor: 'red', // android only
          tabBarStyle: {
            backgroundColor: 'pink',
            shadowColor: 'black', //ios
          },
          tabBarLabelStyle: {
            fontSize: 14,
            fontWeight: '600',
            color: 'purple',
            fontStyle: 'italic',
          },
        }}
      />
      <Tab.Screen
        name="TabContacts"
        component={Contacts}
        options={{
          tabBarIcon: Platform.select({
            // ios: { sfSymbolName: 'newspaper' },
            ios: 'star',
            android: 'star_on',
            // android: { name: 'newspaper' },
          }),
        }}
      />
      <Tab.Screen
        name="TabContacts2"
        component={Contacts}
        options={{
          tabBarIcon: Platform.select({
            // ios: { sfSymbolName: 'newspaper' },
            ios: 'star',
            android: 'star_on',
            // android: { name: 'newspaper' },
          }),
        }}
      />
    </Tab.Navigator>
  );
}

ExperimentalBottomTabs.title = 'Experimental Bottom Tabs';
ExperimentalBottomTabs.linking = linking;
