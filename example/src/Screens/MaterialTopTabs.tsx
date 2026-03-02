import {
  createMaterialTopTabNavigator,
  createMaterialTopTabScreen,
} from '@react-navigation/material-top-tabs';

import { Albums } from '../Shared/Albums';
import { Chat } from '../Shared/Chat';
import { Contacts } from '../Shared/Contacts';

const ChatScreen = () => <Chat bottom />;

const MaterialTopTabsNavigator = createMaterialTopTabNavigator({
  screens: {
    Chat: createMaterialTopTabScreen({
      screen: ChatScreen,
      options: { title: 'Chat' },
    }),
    Contacts: createMaterialTopTabScreen({
      screen: Contacts,
      options: { title: 'Contacts' },
    }),
    Albums: createMaterialTopTabScreen({
      screen: Albums,
      options: { title: 'Albums' },
    }),
  },
});

export const MaterialTopTabsBasic = {
  screen: MaterialTopTabsNavigator,
  title: 'Material Top Tabs - Basic',
  options: {
    headerShown: true,
    cardStyle: { flex: 1 },
  },
};
