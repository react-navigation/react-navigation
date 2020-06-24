import React from 'react';
import { Button, ScrollView } from 'react-native';
import { Themed, SafeAreaView } from 'react-navigation';
import {
  createDrawerNavigator,
  NavigationDrawerScreenComponent,
  NavigationDrawerProp,
} from 'react-navigation-drawer';
import { MaterialIcons } from '@expo/vector-icons';

const SampleText = ({ children }: { children: React.ReactNode }) => (
  <Themed.Text>{children}</Themed.Text>
);

const MyNavScreen = ({
  navigation,
  banner,
}: {
  navigation: NavigationDrawerProp;
  banner: string;
}) => (
  <ScrollView style={{ backgroundColor: '#eee' }}>
    <SafeAreaView forceInset={{ top: 'always' }}>
      <SampleText>{banner}</SampleText>
      <Button onPress={() => navigation.openDrawer()} title="Open drawer" />
      <Button
        onPress={() => navigation.navigate('Email')}
        title="Open other screen"
      />
      <Button onPress={() => navigation.navigate('Index')} title="Go back" />
    </SafeAreaView>
    <Themed.StatusBar />
  </ScrollView>
);

const InboxScreen: NavigationDrawerScreenComponent = ({ navigation }) => (
  <MyNavScreen banner="Inbox Screen" navigation={navigation} />
);

const EmailScreen: NavigationDrawerScreenComponent = ({ navigation }) => (
  <MyNavScreen banner="Email Screen" navigation={navigation} />
);

const DraftsScreen: NavigationDrawerScreenComponent = ({ navigation }) => (
  <MyNavScreen banner="Drafts Screen" navigation={navigation} />
);

const DrawerExample = createDrawerNavigator(
  {
    Inbox: {
      path: '/',
      screen: InboxScreen,
      navigationOptions: {
        drawerLabel: 'Inbox',
        drawerIcon: ({ tintColor }) => (
          <MaterialIcons
            name="move-to-inbox"
            size={24}
            style={{ color: tintColor }}
          />
        ),
      },
    },
    Drafts: {
      path: '/sent',
      screen: DraftsScreen,
      navigationOptions: {
        drawerLabel: 'Drafts',
        drawerIcon: ({ tintColor }) => (
          <MaterialIcons name="drafts" size={24} style={{ color: tintColor }} />
        ),
      },
    },
    Email: {
      path: '/sent',
      screen: EmailScreen,
    },
  },
  {
    drawerBackgroundColor: {
      light: '#eee',
      dark: 'rgba(40,40,40,1)',
    },
    initialRouteName: 'Drafts',
    contentOptions: {
      activeTintColor: '#e91e63',
    },
    drawerType: 'back',
    overlayColor: '#00000000',
    hideStatusBar: true,
  }
);

export default DrawerExample;
