import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Button, HeaderBackButton } from '@react-navigation/elements';
import {
  createComponentForStaticNavigation,
  createPathConfigForStaticNavigation,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import {
  type ColorValue,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { Albums } from '../Shared/Albums';
import { Article } from '../Shared/Article';
import { Chat } from '../Shared/Chat';
import { Contacts } from '../Shared/Contacts';

const getTabBarIcon =
  (name: React.ComponentProps<typeof MaterialCommunityIcons>['name']) =>
  ({ color, size }: { color: ColorValue; size: number }) => (
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

const suspenseLayout = ({ children }: { children: React.ReactNode }) => (
  <React.Suspense
    fallback={
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <MaterialCommunityIcons
          name="timelapse"
          size={32}
          style={{ textAlign: 'center' }}
          accessibilityLabel="Loading"
        />
      </View>
    }
  >
    {children}
  </React.Suspense>
);

const loadScreen = () =>
  new Promise<React.ComponentType<any>>((resolve) => {
    setTimeout(() => resolve(Contacts), 2000);
  });

const HomeTabs = createBottomTabNavigator({
  screenOptions: ({ theme, navigation }) => ({
    headerLeft: (props) => (
      <HeaderBackButton {...props} onPress={navigation.goBack} />
    ),
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
      loader: (signal: AbortSignal) => {
        // Simulate a network request

        return new Promise<void>((resolve) => {
          setTimeout(() => {
            console.log(signal);
            resolve();
          }, 2000);
        });
      },
      layout: suspenseLayout,
      asyncScreen: loadScreen,
      options: {
        tabBarIcon: getTabBarIcon('contacts'),
      },
      linking: 'contacts',
    },
    Article: {
      layout: suspenseLayout,
      screen: Article,
      options: {
        tabBarIcon: getTabBarIcon('file-document'),
      },
      linking: 'article',
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

const Navigation = createComponentForStaticNavigation(RootStack, 'Root');

export function StaticScreen() {
  const [isChatShown, setIsChatShown] = React.useState(false);

  const context = React.useMemo(
    () => ({ isChatShown, setIsChatShown }),
    [isChatShown]
  );

  return (
    <ChatShownContext.Provider value={context}>
      <Navigation />
    </ChatShownContext.Provider>
  );
}

StaticScreen.title = 'Static config';
StaticScreen.linking = createPathConfigForStaticNavigation(RootStack, {});

const styles = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    padding: 12,
  },
});
