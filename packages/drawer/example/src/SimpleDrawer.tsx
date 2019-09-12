import React from 'react';
import { Button, ScrollView, StyleSheet, View } from 'react-native';
import {
  createStackNavigator,
  NavigationStackProp,
  NavigationStackScreenComponent,
} from 'react-navigation-stack';
import {
  ThemeColors,
  useTheme,
  Themed,
  SafeAreaView,
  NavigationRoute,
} from 'react-navigation';
import {
  createDrawerNavigator,
  NavigationDrawerOptions,
  NavigationDrawerScreenProps,
} from 'react-navigation-drawer';
import { MaterialIcons } from '@expo/vector-icons';

const SampleText = ({ children }: { children: React.ReactNode }) => (
  <Themed.Text>{children}</Themed.Text>
);

type Params = { drawerLockMode: 'unlocked' | 'locked-open' | 'locked-closed' };

const MyNavScreen = ({
  navigation,
  banner,
}: {
  navigation: NavigationStackProp<NavigationRoute, Params>;
  banner: string;
}) => {
  let theme = useTheme();

  return (
    <ScrollView>
      <SafeAreaView forceInset={{ top: 'always' }}>
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <SampleText>{banner}</SampleText>
        </View>
        <Themed.TextInput
          style={{
            flex: 1,
            height: 35,
            marginHorizontal: 10,
            marginVertical: 10,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: ThemeColors[theme].bodyBorder,
            textAlign: 'center',
          }}
          placeholder="Focus this TextInput then drag the drawer!"
        />
        <Button onPress={() => navigation.openDrawer()} title="Open drawer" />
        <Button
          onPress={() => navigation.toggleDrawer()}
          title="Toggle drawer"
        />
        <Button
          onPress={() => {
            navigation.openDrawer();
            navigation.closeDrawer();
          }}
          title="Open and immediately close"
        />
        <Button
          onPress={() => {
            navigation.closeDrawer();
            navigation.openDrawer();
          }}
          title="Close and immediately open"
        />
        <Button
          onPress={() => {
            navigation.openDrawer();
            setTimeout(() => {
              navigation.closeDrawer();
            }, 150);
          }}
          title="Open then close drawer shortly after"
        />
        <Button
          onPress={() => navigation.navigate('Email')}
          title="Open other screen"
        />
        <Button onPress={() => navigation.goBack(null)} title="Go back" />
        <Button
          onPress={() => navigation.navigate('Home')}
          title="Go back to list"
        />
        {
          {
            'locked-open': (
              <Button
                onPress={() =>
                  navigation.setParams({ drawerLockMode: 'locked-closed' })
                }
                title="Set locked-closed"
              />
            ),
            'locked-closed': (
              <Button
                onPress={() =>
                  navigation.setParams({ drawerLockMode: 'unlocked' })
                }
                title="Set unlocked"
              />
            ),
            unlocked: (
              <Button
                onPress={() =>
                  navigation.setParams({ drawerLockMode: 'locked-open' })
                }
                title="Set locked-open"
              />
            ),
          }[navigation.getParam('drawerLockMode', 'unlocked')]
        }
      </SafeAreaView>
      <Themed.StatusBar />
    </ScrollView>
  );
};

const InboxScreen: NavigationStackScreenComponent<Params> = ({
  navigation,
}) => <MyNavScreen banner="Inbox Screen" navigation={navigation} />;
InboxScreen.navigationOptions = {
  headerTitle: 'Inbox',
};

const EmailScreen: NavigationStackScreenComponent<Params> = ({
  navigation,
}) => <MyNavScreen banner="Email Screen" navigation={navigation} />;

const DraftsScreen: NavigationStackScreenComponent<Params> = ({
  navigation,
}) => <MyNavScreen banner="Drafts Screen" navigation={navigation} />;
DraftsScreen.navigationOptions = {
  headerTitle: 'Drafts',
};

const InboxStack = createStackNavigator(
  {
    Inbox: { screen: InboxScreen },
    Email: { screen: EmailScreen },
  },
  {
    navigationOptions: ({ navigation }: NavigationDrawerScreenProps) => {
      const options: NavigationDrawerOptions = {
        drawerLabel: 'Inbox',
        drawerLockMode: (
          navigation.state.routes[navigation.state.index].params || {}
        ).drawerLockMode,
        drawerIcon: ({ tintColor }) => (
          <MaterialIcons
            name="move-to-inbox"
            size={24}
            style={{ color: tintColor }}
          />
        ),
      };

      return options;
    },
  }
);

const DraftsStack = createStackNavigator(
  {
    Drafts: { screen: DraftsScreen },
    Email: { screen: EmailScreen },
  },
  {
    navigationOptions: ({ navigation }: NavigationDrawerScreenProps) => {
      const options: NavigationDrawerOptions = {
        drawerLabel: 'Drafts',
        drawerLockMode: (
          navigation.state.routes[navigation.state.index].params || {}
        ).drawerLockMode,
        drawerIcon: ({ tintColor }) => (
          <MaterialIcons name="drafts" size={24} style={{ color: tintColor }} />
        ),
      };

      return options;
    },
  }
);

function createDrawerExample(options = {}) {
  let DrawerExample = createDrawerNavigator(
    {
      Inbox: {
        path: '/',
        screen: InboxStack,
      },
      Drafts: {
        path: '/sent',
        screen: DraftsStack,
      },
    },
    {
      initialRouteName: 'Drafts',
      drawerWidth: 210,
      navigationOptions: {
        header: null,
      },
      contentOptions: {
        activeTintColor: '#e91e63',
      },
      ...options,
    }
  );

  return DrawerExample;
}

export const SimpleDrawer = createDrawerExample();
export const SimpleDrawerUnmountInactive = createDrawerExample({
  unmountInactiveRoutes: true,
});
