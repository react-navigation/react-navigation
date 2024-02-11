import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Button } from '@react-navigation/elements';
import {
  createStaticNavigation,
  NavigationIndependentTree,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';

import { Albums } from '../Shared/Albums';
import { Chat } from '../Shared/Chat';
import { Contacts } from '../Shared/Contacts';

const getTabBarIcon =
  (name: React.ComponentProps<typeof MaterialCommunityIcons>['name']) =>
  ({ color, size }: { color: string; size: number }) => (
    <MaterialCommunityIcons name={name} color={color} size={size} />
  );

const ChatShownContext = React.createContext({
  isChatShown: false,
  setIsChatShown: (_isChatShown: boolean) => {},
});

const useIsChatShown = () => {
  const { isChatShown } = React.useContext(ChatShownContext);

  return isChatShown;
};

const scrollEnabled = Platform.select({ web: true, default: false });

const AlbumsScreen = () => {
  const { isChatShown, setIsChatShown } = React.useContext(ChatShownContext);

  return (
    <ScrollView>
      <View style={styles.buttons}>
        <Button variant="filled" onPress={() => setIsChatShown(!isChatShown)}>
          {isChatShown ? 'Hide' : 'Show'} Chat
        </Button>
      </View>
      <Albums scrollEnabled={scrollEnabled} />
    </ScrollView>
  );
};

const HomeTabs = createBottomTabNavigator({
  screenOptions: ({ theme }) => ({
    tabBarActiveTintColor: theme.colors.notification,
  }),
  screens: {
    Albums: {
      screen: AlbumsScreen,
      options: {
        tabBarIcon: getTabBarIcon('image-album'),
      },
      linking: 'albums',
    },
    Contacts: {
      screen: Contacts,
      options: {
        tabBarIcon: getTabBarIcon('contacts'),
      },
      linking: 'contacts',
    },
    Chat: {
      screen: Chat,
      options: {
        tabBarIcon: getTabBarIcon('message-reply'),
      },
      linking: 'chat',
      if: useIsChatShown,
    },
  },
});

const RootStack = createStackNavigator({
  screenOptions: {
    headerShown: false,
  },
  screens: {
    Home: {
      screen: HomeTabs,
      linking: '',
    },
  },
});

const Navigation = createStaticNavigation(RootStack);

export function StaticScreen() {
  const [isChatShown, setIsChatShown] = React.useState(false);

  return (
    <ChatShownContext.Provider value={{ isChatShown, setIsChatShown }}>
      <NavigationIndependentTree>
        <Navigation />
      </NavigationIndependentTree>
    </ChatShownContext.Provider>
  );
}
const styles = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    padding: 12,
  },
});
