import * as React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TouchableBounce from '../Shared/TouchableBounce';
import Albums from '../Shared/Albums';
import Contacts from '../Shared/Contacts';
import Chat from '../Shared/Chat';
import SimpleStackScreen from './SimpleStack';

const getTabBarIcon = (name: string) => ({
  color,
  size,
}: {
  color: string;
  size: number;
}) => <MaterialCommunityIcons name={name} color={color} size={size} />;

type BottomTabParams = {
  Article: undefined;
  Albums: undefined;
  Contacts: undefined;
  Chat: undefined;
};

const BottomTabs = createBottomTabNavigator<BottomTabParams>();

export default function BottomTabsScreen() {
  return (
    <BottomTabs.Navigator
      screenOptions={{
        tabBarButton: props => <TouchableBounce {...props} />,
      }}
    >
      <BottomTabs.Screen
        name="Article"
        options={{
          title: 'Article',
          tabBarIcon: getTabBarIcon('file-document-box'),
        }}
      >
        {props => <SimpleStackScreen {...props} headerMode="none" />}
      </BottomTabs.Screen>
      <BottomTabs.Screen
        name="Chat"
        component={Chat}
        options={{
          tabBarLabel: 'Chat',
          tabBarIcon: getTabBarIcon('message-reply'),
        }}
      />
      <BottomTabs.Screen
        name="Contacts"
        component={Contacts}
        options={{
          title: 'Contacts',
          tabBarIcon: getTabBarIcon('contacts'),
        }}
      />
      <BottomTabs.Screen
        name="Albums"
        component={Albums}
        options={{
          title: 'Albums',
          tabBarIcon: getTabBarIcon('image-album'),
        }}
      />
    </BottomTabs.Navigator>
  );
}
