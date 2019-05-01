import * as React from 'react';
import {
  Button,
  TextInput,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// eslint-disable-next-line import/named
import { createStackNavigator } from 'react-navigation-stack';
import { SafeAreaView } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { KeepAwake } from 'expo';

const SampleText = ({ children }) => <Text>{children}</Text>;

const MyNavScreen = ({ navigation, banner }) => (
  <ScrollView>
    <SafeAreaView forceInset={{ top: 'always' }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <SampleText>{banner}</SampleText>
      </View>
      <TextInput
        style={{
          flex: 1,
          height: 35,
          marginHorizontal: 10,
          marginVertical: 10,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: '#eee',
          textAlign: 'center',
        }}
        placeholder="Focus this TextInput then drag the drawer!"
      />
      <Button onPress={() => navigation.openDrawer()} title="Open drawer" />
      <Button onPress={() => navigation.toggleDrawer()} title="Toggle drawer" />
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
    <StatusBar barStyle="default" />
    <KeepAwake />
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

const InboxStack = createStackNavigator(
  {
    Inbox: { screen: InboxScreen },
    Email: { screen: EmailScreen },
  },
  {
    navigationOptions: ({ navigation }) => ({
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
    }),
  }
);

const DraftsStack = createStackNavigator(
  {
    Drafts: { screen: DraftsScreen },
    Email: { screen: EmailScreen },
  },
  {
    navigationOptions: ({ navigation }) => ({
      drawerLabel: 'Drafts',
      drawerLockMode: (
        navigation.state.routes[navigation.state.index].params || {}
      ).drawerLockMode,
      drawerIcon: ({ tintColor }) => (
        <MaterialIcons name="drafts" size={24} style={{ color: tintColor }} />
      ),
    }),
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
      drawerWidth: '60%',
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
