import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import type {
  NavigatorScreenParams,
  PathConfig,
  StaticScreenProps,
} from '@react-navigation/native';

import { Albums } from '../Shared/Albums';
import { Chat } from '../Shared/Chat';
import { Contacts } from '../Shared/Contacts';

type MaterialTopTabParamList = {
  Albums: undefined;
  Contacts: undefined;
  Chat: undefined;
};

const linking = {
  screens: {
    Albums: 'albums',
    Contacts: 'contacts',
    Chat: 'chat',
  },
} satisfies PathConfig<NavigatorScreenParams<MaterialTopTabParamList>>;

const MaterialTopTabs =
  createMaterialTopTabNavigator<MaterialTopTabParamList>();

const ChatScreen = () => <Chat bottom />;

export function MaterialTopTabsScreen(_: StaticScreenProps<{}>) {
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
