import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  createStaticNavigation,
  NavigationIndependentTree,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Albums from '../Shared/Albums';
import Chat from '../Shared/Chat';
import Contacts from '../Shared/Contacts';

const getTabBarIcon =
  (name: string) =>
  ({ color, size }: { color: string; size: number }) =>
    <MaterialCommunityIcons name={name} color={color} size={size} />;

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
        <Button mode="contained" onPress={() => setIsChatShown(!isChatShown)}>
          {isChatShown ? 'Hide' : 'Show'} Chat
        </Button>
      </View>
      <Albums scrollEnabled={scrollEnabled} />
    </ScrollView>
  );
};

const HomeTabs = createBottomTabNavigator({
  screens: {
    Albums: {
      screen: AlbumsScreen,
      options: {
        tabBarIcon: getTabBarIcon('image-album'),
      },
    },
    Contacts: {
      screen: Contacts,
      options: {
        tabBarIcon: getTabBarIcon('contacts'),
      },
    },
    Chat: {
      screen: Chat,
      options: {
        tabBarIcon: getTabBarIcon('message-reply'),
      },
      if: useIsChatShown,
    },
  },
});

const RootStack = createStackNavigator({
  screenOptions: {
    headerShown: false,
  },
  screens: {
    Home: HomeTabs,
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function StaticScreen() {
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
    padding: 16,
  },
});
