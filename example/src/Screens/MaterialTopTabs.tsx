import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import {
  createMaterialTopTabNavigator,
  createMaterialTopTabScreen,
} from '@react-navigation/material-top-tabs';
import type { ColorValue } from 'react-native';

import { Albums } from '../Shared/Albums';
import { Chat } from '../Shared/Chat';
import { Contacts } from '../Shared/Contacts';

const ChatScreen = () => <Chat bottom />;

const MaterialTopTabsNavigator = createMaterialTopTabNavigator({
  screens: {
    Chat: createMaterialTopTabScreen({
      screen: ChatScreen,
      options: {
        title: 'Chat',
        tabBarBadge: 3,
        tabBarIcon: ({ color, size }: { color: ColorValue; size: number }) => (
          <MaterialDesignIcons name="message-reply" color={color} size={size} />
        ),
      },
    }),
    Contacts: createMaterialTopTabScreen({
      screen: Contacts,
      options: { title: 'Contacts' },
    }),
    Albums: createMaterialTopTabScreen({
      screen: Albums,
      options: {
        title: 'Albums',
        tabBarBadge: 'new',
        tabBarBadgeStyle: { backgroundColor: 'tomato' },
      },
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
