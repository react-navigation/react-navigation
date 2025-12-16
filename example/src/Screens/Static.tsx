import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Button, HeaderBackButton } from '@react-navigation/elements';
import type { StaticParamList } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';

import iconBookUser from '../../assets/icons/book-user.png';
import iconListMusic from '../../assets/icons/list-music.png';
import iconMessage from '../../assets/icons/message-circle.png';
import iconMusic from '../../assets/icons/music.png';
import { Albums } from '../Shared/Albums';
import { Chat } from '../Shared/Chat';
import { Contacts } from '../Shared/Contacts';

export type StaticScreenParamList = StaticParamList<typeof StaticStack>;

const ChatShownContext = React.createContext({
  isChatShown: false,
  setIsChatShown: (_isChatShown: boolean) => {},
});

const useIsChatShown = () => {
  const { isChatShown } = React.useContext(ChatShownContext);

  return isChatShown;
};

const ChatShownLayout = ({ children }: { children: React.ReactNode }) => {
  const [isChatShown, setIsChatShown] = React.useState(false);

  const context = React.useMemo(
    () => ({ isChatShown, setIsChatShown }),
    [isChatShown]
  );

  return (
    <ChatShownContext.Provider value={context}>
      {children}
    </ChatShownContext.Provider>
  );
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
  implementation: 'custom',
  screenOptions: ({ theme, navigation }) => ({
    headerShown: true,
    headerLeft: (props) => (
      <HeaderBackButton {...props} onPress={navigation.goBack} />
    ),
    tabBarActiveTintColor: theme.colors.notification,
  }),
  screens: {
    Albums: {
      screen: AlbumsScreen,
      options: {
        tabBarButtonTestID: 'albums',
        tabBarIcon: ({ focused }) => ({
          type: 'image',
          source: focused ? iconListMusic : iconMusic,
        }),
      },
      linking: 'albums',
    },
    Contacts: {
      screen: Contacts,
      options: {
        tabBarButtonTestID: 'contacts',
        tabBarIcon: {
          type: 'image',
          source: iconBookUser,
        },
      },
      linking: 'contacts',
    },
    Chat: {
      screen: Chat,
      options: {
        tabBarButtonTestID: 'chat',
        tabBarIcon: {
          type: 'image',
          source: iconMessage,
        },
      },
      linking: 'chat',
      if: useIsChatShown,
    },
  },
});

const StaticStack = createStackNavigator({
  layout: (props) => <ChatShownLayout {...props} />,
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

export const StaticScreen = {
  screen: StaticStack,
  title: 'Static config',
};

const styles = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    padding: 12,
  },
});
