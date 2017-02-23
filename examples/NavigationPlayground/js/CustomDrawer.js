/**
 * @flow
 */

import React from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { DrawerNavigator } from 'react-navigation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SampleText from './SampleText';

const MyNavScreen = ({ navigation, banner }) => (
  <ScrollView style={styles.container}>
    <SampleText>{banner}</SampleText>
    <Button onPress={() => navigation.navigate('DrawerOpen')} title="Open drawer" />
    <Button onPress={() => navigation.goBack(null)} title="Go back" />
  </ScrollView>
);

const InboxScreen = ({ navigation }) => <MyNavScreen banner={'Inbox Screen'} navigation={navigation} />;
InboxScreen.navigationOptions = {
  drawer: {
    label: 'Inbox',
    item: ({ focused, label }) => (
      <View style={[styles.itemContainer, focused && styles.itemFocused]}>
        <MaterialIcons name="move-to-inbox" size={24} style={styles.icon} />
        <Text style={[styles.label]}>{label}</Text>
      </View>
    ),
  },
};

const DraftsScreen = ({ navigation }) => <MyNavScreen banner={'Drafts Screen'} navigation={navigation} />;
DraftsScreen.navigationOptions = {
  drawer: {
    label: 'Drafts',
    item: ({ focused, label }) => (
      <View style={[styles.itemContainer, focused && styles.itemFocused]}>
        <MaterialIcons name="drafts" size={24} style={styles.icon} />
        <Text style={[styles.label]}>{label}</Text>
      </View>
    ),
  },
};

const DrawerExample = DrawerNavigator(
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
    initialRouteName: 'Inbox',
  },
);

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 5,
    borderColor: 'transparent',
    height: 44,
  },
  itemFocused: {
    borderColor: '#F44336',
  },
  icon: {
    marginHorizontal: 16,
    width: 24,
    alignItems: 'center',
  },
  label: {
    fontWeight: 'bold',
    margin: 16,
  },
});

export default DrawerExample;
