import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import type { PathConfigMap } from '@react-navigation/native';

import { Albums } from '../Shared/Albums';
import { Chat } from '../Shared/Chat';
import { Contacts } from '../Shared/Contacts';

export type MaterialTopTabParams = {
  Albums: undefined;
  Contacts: undefined;
  Chat: undefined;
};

const linking: PathConfigMap<MaterialTopTabParams> = {
  Albums: 'albums',
  Contacts: 'contacts',
  Chat: 'chat',
};

const MaterialTopTabs = createMaterialTopTabNavigator<MaterialTopTabParams>();

const ChatScreen = () => <Chat bottom />;

export function MaterialTopTabsScreen() {
  return (
    <MaterialTopTabs.Navigator>
      <MaterialTopTabs.Screen
        name="Chat"
        component={ChatScreen}
        options={{ title: 'Chat' }}
      />
      <MaterialTopTabs.Screen
        name="Contacts"
        component={Contacts}
        options={{ title: 'Contacts' }}
      />
      <MaterialTopTabs.Screen
        name="Albums"
        component={Albums}
        options={{ title: 'Albums' }}
      />
    </MaterialTopTabs.Navigator>
  );
}

MaterialTopTabsScreen.title = 'Material Top Tabs';
MaterialTopTabsScreen.linking = linking;
MaterialTopTabsScreen.options = {
  headerShown: true,
  cardStyle: { flex: 1 },
};
