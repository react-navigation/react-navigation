import React from 'react';
import { Button, ScrollView } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { Themed, SafeAreaView } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { createDrawerNavigator } from 'react-navigation-drawer';

const SampleText = ({ children }) => <Themed.Text>{children}</Themed.Text>;

const MyNavScreen = ({ navigation, banner }) => (
  <ScrollView>
    <SafeAreaView forceInset={{ top: 'always' }}>
      <SampleText>{banner}</SampleText>
      <Button onPress={() => navigation.openDrawer()} title="Open drawer" />
      <Button
        onPress={() => navigation.navigate('Email')}
        title="Open other screen"
      />
      <Button onPress={() => navigation.navigate('Home')} title="Go back" />
    </SafeAreaView>
    <Themed.StatusBar />
  </ScrollView>
);

const InboxScreen = ({ navigation }) => (
  <MyNavScreen banner="Inbox Screen" navigation={navigation} />
);
InboxScreen.navigationOptions = {
  headerTitle: 'Inbox',
};

const EmailScreen = ({ navigation }) => (
  <MyNavScreen banner="Email Screen" navigation={navigation} />
);

const DraftsScreen = ({ navigation }) => (
  <MyNavScreen banner="Drafts Screen" navigation={navigation} />
);
DraftsScreen.navigationOptions = {
  headerTitle: 'Drafts',
};

const InboxStack = createStackNavigator({
  Inbox: { screen: InboxScreen },
  Email: { screen: EmailScreen },
});

InboxStack.navigationOptions = {
  drawerLabel: 'Inbox',
  drawerIcon: ({ tintColor }) => (
    <MaterialIcons
      name="move-to-inbox"
      size={24}
      style={{ color: tintColor }}
    />
  ),
};

const DraftsStack = createStackNavigator({
  Drafts: { screen: DraftsScreen },
  Email: { screen: EmailScreen },
});

DraftsStack.navigationOptions = {
  drawerLabel: 'Drafts',
  drawerIcon: ({ tintColor }) => (
    <MaterialIcons name="drafts" size={24} style={{ color: tintColor }} />
  ),
};

const DrawerExample = createDrawerNavigator(
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

DrawerExample.navigationOptions = {
  header: null,
};

export default DrawerExample;
