/**
 * @flow
 */

import React from 'react';
import {
  View,
  Button,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {
  DrawerNavigator,
  DrawerItems,
  DrawerItem,
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

const CustomDrawerItem = (props) => {
  const { item, focused, activeTintColor, inactiveTintColor } = props;
  const tintColor = focused ? activeTintColor : inactiveTintColor;

  const screenOptions = typeof item.screenOptions === 'function'
    ? item.screenOptions(props)
    : item.screenOptions;
  const { drawerIcon, drawerLabel, drawerOnPress } = screenOptions;

  return (
    <DrawerItem
      {...props}
      focused={false}
      icon={drawerIcon ? drawerIcon({ tintColor }) : null}
      label={drawerLabel}
      onPress={drawerOnPress}
    />
  );
};

const CustomDrawerItems = (props) => {
  const { items } = props;

  return (
    <View style={[styles.drawerContainer]}>
      {items.map((item) => {
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

        return <CustomDrawerItem {...props} key={key} item={item} />;
      })}
    </View>
  );
};

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
const drawerItems = [
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
      drawerOnPress: () => {
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
      drawerOnPress: null,
    }
  },
  { key: 'Inbox', routeName: 'Inbox' },
  { key: 'Drafts', routeName: 'Drafts' },
];

const DrawerExample = DrawerNavigator(drawerRoutes, {
  initialRouteName: 'Drafts',
  contentOptions: {
    activeTintColor: '#e91e63',
    items: drawerItems,
  },
  contentComponent: CustomDrawerItems,
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
