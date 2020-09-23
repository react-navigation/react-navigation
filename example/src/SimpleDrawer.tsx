import * as React from 'react';
import { Button, ScrollView, StyleSheet, View } from 'react-native';
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
  NavigationDrawerProp,
  NavigationDrawerScreenComponent,
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
  navigation: NavigationDrawerProp<NavigationRoute, Params>;
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
          onPress={() => navigation.navigate('Index')}
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
            'unlocked': (
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

const InboxScreen: NavigationDrawerScreenComponent<Params> = ({
  navigation,
}) => <MyNavScreen banner="Inbox Screen" navigation={navigation} />;

const EmailScreen: NavigationDrawerScreenComponent<Params> = ({
  navigation,
}) => <MyNavScreen banner="Email Screen" navigation={navigation} />;

const DraftsScreen: NavigationDrawerScreenComponent<Params> = ({
  navigation,
}) => <MyNavScreen banner="Drafts Screen" navigation={navigation} />;

function createDrawerExample(options = {}) {
  let DrawerExample = createDrawerNavigator(
    {
      Inbox: {
        path: '/',
        screen: InboxScreen,
        navigationOptions: ({ navigation }: NavigationDrawerScreenProps) => {
          const options: NavigationDrawerOptions = {
            drawerLabel: 'Inbox',
            drawerLockMode: navigation.state.params?.drawerLockMode,
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
      },
      Drafts: {
        path: '/sent',
        screen: DraftsScreen,
        navigationOptions: ({ navigation }: NavigationDrawerScreenProps) => {
          const options: NavigationDrawerOptions = {
            drawerLabel: 'Drafts',
            drawerLockMode: navigation.state.params?.drawerLockMode,
            drawerIcon: ({ tintColor }) => (
              <MaterialIcons
                name="drafts"
                size={24}
                style={{ color: tintColor }}
              />
            ),
          };

          return options;
        },
      },
      Email: {
        screen: EmailScreen,
      },
    },
    {
      initialRouteName: 'Drafts',
      drawerWidth: 210,
      navigationOptions: {
        headerShown: false,
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
