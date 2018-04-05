/**
 * @flow
 */

import React from 'react';
import { Platform, ScrollView, StyleSheet } from 'react-native';
import { createDrawerNavigator } from 'react-navigation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SampleText from './SampleText';
import { Button } from './commonComponents/ButtonWithMargin';

const MyNavScreen = ({ navigation, banner }) => (
  <ScrollView style={styles.container}>
    <SampleText>{banner}</SampleText>
    <Button onPress={() => navigation.openDrawer()} title="Open drawer" />
    <Button onPress={() => navigation.goBack(null)} title="Go back" />
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

const DraftsScreen = ({ navigation }) => (
  <MyNavScreen banner={'Drafts Screen'} navigation={navigation} />
);
DraftsScreen.navigationOptions = {
  drawerLabel: 'Drafts',
  drawerIcon: ({ tintColor }) => (
    <MaterialIcons name="drafts" size={24} style={{ color: tintColor }} />
  ),
};

const DrawerExample = createDrawerNavigator(
  {
    Inbox: {
      path: '/',
      screen: InboxScreen,
    },
    Drafts: {
      path: '/sent',
      screen: DraftsScreen,
    },
  },
  {
    initialRouteName: 'Drafts',
    contentOptions: {
      activeTintColor: '#e91e63',
    },
  }
);

const MainDrawerExample = createDrawerNavigator({
  Drafts: {
    screen: DrawerExample,
  },
});

const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === 'ios' ? 20 : 0,
  },
});

export default MainDrawerExample;
