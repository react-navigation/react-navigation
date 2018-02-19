/**
 * @flow
 */

import React from 'react';
import { Button, Platform, ScrollView, StatusBar } from 'react-native';
import { StackNavigator, DrawerNavigator, SafeAreaView } from 'react-navigation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SampleText from './SampleText';

const MyNavScreen = ({ navigation, banner }) => (
  <ScrollView>
    <SafeAreaView forceInset={{ top: 'always' }}>
      <SampleText>{banner}</SampleText>
      <Button
        onPress={() => navigation.navigate('DrawerOpen')}
        title="Open drawer"
      />
      <Button
        onPress={() => navigation.navigate('Email')}
        title="Open other screen"
      />
      <Button onPress={() => navigation.goBack(null)} title="Go back" />
    </SafeAreaView>
    <StatusBar barStyle="default" />
  </ScrollView>
);

const InboxScreen = ({ navigation }) => (
  <MyNavScreen banner={'Inbox Screen'} navigation={navigation} />
);
InboxScreen.navigationOptions = {
  drawerLabel: 'Inbox',
  drawerIcon: ({ tintColor }) => (
    <MaterialIcons
      name="move-to-inbox"
      size={24}
      style={{ color: tintColor }}
    />
  ),
};

const EmailScreen = ({ navigation }) => (
  <MyNavScreen banner={'Email Screen'} navigation={navigation} />
);

const DraftsScreen = ({ navigation }) => (
  <MyNavScreen banner={'Drafts Screen'} navigation={navigation} />
);
DraftsScreen.navigationOptions = {
  drawerLabel: 'Drafts',
  drawerIcon: ({ tintColor }) => (
    <MaterialIcons name="drafts" size={24} style={{ color: tintColor }} />
  ),
};

const InboxStack = StackNavigator({
  Inbox: { screen: InboxScreen },
  Email: { screen: EmailScreen },
});

const DraftsStack = StackNavigator({
  Drafts: { screen: DraftsScreen },
  Email: { screen: EmailScreen },
});

const DrawerExample = DrawerNavigator(
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
    drawerOpenRoute: 'DrawerOpen',
    drawerCloseRoute: 'DrawerClose',
    drawerToggleRoute: 'DrawerToggle',
    initialRouteName: 'Drafts',
    contentOptions: {
      activeTintColor: '#e91e63',
    },
  }
);

export default DrawerExample;
