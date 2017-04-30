/**
 * @flow
 */

import React from 'react';
import {
  Button,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import {
  DrawerNavigator,
} from 'react-navigation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SampleText from './SampleText';

const MyNavScreen = ({ navigation, banner }) => (
  <ScrollView style={styles.container}>
    <SampleText>{banner}</SampleText>
    <Button
      onPress={() => navigation.navigate('DrawerOpen')}
      title="Open drawer"
    />
    <Button
      onPress={() => navigation.goBack(null)}
      title="Go back"
    />
  </ScrollView>
);

const InboxScreen = ({ navigation }) => (
  <MyNavScreen
    banner={'Inbox Screen'}
    navigation={navigation}
  />
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
  <MyNavScreen
    banner={'Drafts Screen'}
    navigation={navigation}
  />
);
DraftsScreen.navigationOptions = {
  drawerLabel: 'Drafts',
  drawerIcon: ({ tintColor }) => (
    <MaterialIcons
      name="drafts"
      size={24}
      style={{ color: tintColor }}
    />
  ),
};

const RefreshButton = () => null;
RefreshButton.navigationOptions = ({ navigation }) => ({
  drawerLabel: navigation.state.params.isRefreshing ? 'Refreshing...' : 'Refresh',
  drawerIcon: ({ tintColor }) => (
    <MaterialIcons
      name="refresh"
      size={24}
      style={{ color: tintColor }}
    />
  ),
  drawerOnPress: () => {
    navigation.setParams({ isRefreshing: true });

    // Finish refreshing after a short delay.
    setTimeout(() => {
      navigation.setParams({ isRefreshing: false });
    }, 500);
  },
});

const MailboxesLabel = () => null;
MailboxesLabel.navigationOptions = {
  drawerLabel: 'Mailboxes',
  drawerOnPress: null,
};

const DrawerExample = DrawerNavigator({
  RefreshButton: {
    screen: RefreshButton,
  },
  MailboxesLabel: {
    screen: MailboxesLabel,
  },
  Inbox: {
    path: '/',
    screen: InboxScreen,
  },
  Drafts: {
    path: '/sent',
    screen: DraftsScreen,
  },
}, {
  initialRouteName: 'Drafts',
  contentOptions: {
    activeTintColor: '#e91e63',
  },
});

const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === 'ios' ? 20 : 0,
  },
});

export default DrawerExample;
