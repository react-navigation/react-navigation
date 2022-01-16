import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import type { ParamListBase } from '@react-navigation/native';
import type { StackScreenProps } from '@react-navigation/stack';
import * as React from 'react';
import { Text } from 'react-native';

import Albums from '../Shared/Albums';
import Chat from '../Shared/Chat';
import Contacts from '../Shared/Contacts';

type MaterialTopTabParams = {
  Albums: undefined;
  Contacts: undefined;
  Chat: undefined;
  NoAccess: undefined;
};

const MaterialTopTabs = createMaterialTopTabNavigator<MaterialTopTabParams>();

export default function MaterialTopTabsScreen({
  navigation,
}: StackScreenProps<ParamListBase>) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      cardStyle: { flex: 1 },
    });
  }, [navigation]);

  return (
    <MaterialTopTabs.Navigator>
      <MaterialTopTabs.Screen
        name="Chat"
        component={Chat}
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
      <MaterialTopTabs.Screen
        name="NoAccess"
        component={Null}
        options={{
          hideScene: true,
          tabBarLabel: () => <Text style={{ color: 'red' }}>No Access</Text>,
        }}
      />
    </MaterialTopTabs.Navigator>
  );
}

function Null() {
  return null;
}
