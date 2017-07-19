/**
 * @flow
 */

import React from 'react';
import { View, Button, Platform, ScrollView, StyleSheet } from 'react-native';
import { DrawerNavigator, DrawerItems, DrawerItem } from 'react-navigation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SampleText from './SampleText';

const MyNavScreen = ({ navigation, banner }) => (
  <ScrollView style={styles.container}>
    <SampleText>{banner}</SampleText>
    <Button
      onPress={() => navigation.navigate('DrawerOpen')}
      title="Open drawer"
    />
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

const onTapAccount = (accountName, navigation) => {
  navigation.setParams({
    currAccount: accountName,
    showAccounts: false,
  });
};

// Items to be rendered after tapping "Choose Account".
// These could be loaded via network request, for example.
const accountItems = [
  {
    key: 'Alice',
    screenOptions: ({ navigation }) => ({
      drawerLabel: 'Alice',
      onPress: () => onTapAccount('Alice', navigation),
    }),
  },
  {
    key: 'Bob',
    screenOptions: ({ navigation }) => ({
      drawerLabel: 'Bob',
      onPress: () => onTapAccount('Bob', navigation),
    }),
  },
];

const CustomDrawerItem = (props) => {
  const { item, focused, activeTintColor, inactiveTintColor, onPress: defaultOnPress } = props;

  const tintColor = focused ? activeTintColor : inactiveTintColor;

  const screenOptions = typeof item.screenOptions === 'function'
    ? item.screenOptions(props)
    : item.screenOptions;
  const { drawerIcon, drawerLabel, onPress: customOnPress } = screenOptions;

  return (
    <DrawerItem
      {...props}
      focused={false}
      icon={drawerIcon ? drawerIcon({ tintColor }) : null}
      label={drawerLabel}
      onPress={customOnPress !== undefined ? customOnPress : defaultOnPress}
    />
  );
};

const CustomDrawerItems = (props) => {
  const { items, onItemPress, ...itemProps } = props;
  const { navigation: { state: { params: { showAccounts } } } } = itemProps;
  const itemsToShow = showAccounts ? accountItems : items;

  return (
    <View style={[styles.drawerContainer]}>
      {itemsToShow.map((item) => {
        const { routeName, key } = item;

        // Simply render the default component if the item is a route.
        if (routeName) {
          return (
            <DrawerItems
              {...props}
              key={key}
              items={[item]}
              style={styles.drawerContainerInner}
            />
          );
        }

        return (
          <CustomDrawerItem
            {...itemProps}
            key={key}
            item={item}
            onPress={onItemPress}
          />
        );
      })}
    </View>
  );
};

// The routes themselves need to be specified even if you're overriding them with custom `items`;
// otherwise, React Navigation wouldn't know which components to use.
const drawerRoutes = {
  Inbox: {
    path: '/',
    screen: InboxScreen,
  },
  Drafts: {
    path: '/sent',
    screen: DraftsScreen,
  },
};

// Add a few custom items along with the regular ones.
//
// This array is optional; if you don't provide it,
// the drawer will automatically show all of your routes that were defined above.
const customDrawerItems = [
  {
    key: 'ChooseAccount',
    screenOptions: ({ navigation }) => ({
      drawerLabel: navigation.state.params.currAccount || 'Sign in...',
      drawerIcon: ({ tintColor }) => (
        <MaterialIcons
          name="account-circle"
          size={24}
          style={{ color: tintColor }}
        />
      ),
      onPress: () => {
        navigation.setParams({ showAccounts: true });
      },
    }),
  },
  {
    key: 'RefreshButton',
    screenOptions: ({ navigation }) => ({
      drawerLabel: navigation.state.params.isRefreshing ? 'Refreshing...' : 'Refresh',
      drawerIcon: ({ tintColor }) => (
        <MaterialIcons
          name="refresh"
          size={24}
          style={{ color: tintColor }}
        />
      ),
      onPress: () => {
        navigation.setParams({ isRefreshing: true });

        // Finish refreshing after a short delay.
        setTimeout(() => {
          navigation.setParams({ isRefreshing: false });
        }, 500);
      },
    })
  },
  {
    key: 'MailboxesLabel',
    screenOptions: {
      drawerLabel: 'Mailboxes',
      onPress: null,
    }
  },
  { key: 'Inbox', routeName: 'Inbox' },
  { key: 'Drafts', routeName: 'Drafts' },
];

const DrawerExample = DrawerNavigator(drawerRoutes, {
  initialRouteName: 'Drafts',
  contentComponent: CustomDrawerItems,
  contentOptions: {
    activeTintColor: '#e91e63',

    // Display the custom items defined above, rather than the default ones.
    items: customDrawerItems,
  },
});

const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === 'ios' ? 20 : 0,
  },
  drawerContainer: {
    marginTop: Platform.OS === 'ios' ? 20 : 0,
    paddingVertical: 4,
  },
  drawerContainerInner: {
    marginTop: 0,
    paddingVertical: 0,
  },
});

export default DrawerExample;
