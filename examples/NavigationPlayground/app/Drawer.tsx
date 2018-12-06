import React from 'react';
import { ScrollView, StatusBar, StyleProp, TextStyle } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  createDrawerNavigator,
  createStackNavigator,
  SafeAreaView,
} from 'react-navigation';
import { NavigationScreenProp, NavigationState } from 'react-navigation';
import { Button } from './commonComponents/ButtonWithMargin';
import SampleText from './SampleText';

const MyNavScreen = ({
  navigation,
  banner,
}: {
  navigation: NavigationScreenProp<NavigationState>;
  banner: string;
}) => (
  <ScrollView>
    <SafeAreaView forceInset={{ top: 'always' }}>
      <SampleText>{banner}</SampleText>
      <Button onPress={() => navigation.openDrawer()} title="Open drawer" />
      <Button
        onPress={() => navigation.navigate('Email')}
        title="Open other screen"
      />
      <Button onPress={() => navigation.navigate('Index')} title="Go back" />
    </SafeAreaView>
    <StatusBar barStyle="default" />
  </ScrollView>
);

const InboxScreen = ({
  navigation,
}: {
  navigation: NavigationScreenProp<NavigationState>;
}) => <MyNavScreen banner={'Inbox Screen'} navigation={navigation} />;
InboxScreen.navigationOptions = {
  headerTitle: 'Inbox',
};

const EmailScreen = ({
  navigation,
}: {
  navigation: NavigationScreenProp<NavigationState>;
}) => <MyNavScreen banner={'Email Screen'} navigation={navigation} />;

const DraftsScreen = ({
  navigation,
}: {
  navigation: NavigationScreenProp<NavigationState>;
}) => <MyNavScreen banner={'Drafts Screen'} navigation={navigation} />;
DraftsScreen.navigationOptions = {
  headerTitle: 'Drafts',
};

const InboxStack = createStackNavigator(
  {
    Email: { screen: EmailScreen },
    Inbox: { screen: InboxScreen },
  },
  {
    navigationOptions: {
      drawerIcon: ({ tintColor }) => (
        <MaterialIcons
          name="move-to-inbox"
          size={24}
          style={{ color: tintColor } as StyleProp<TextStyle>}
        />
      ),
      drawerLabel: 'Inbox',
    },
  }
);

const DraftsStack = createStackNavigator(
  {
    Drafts: { screen: DraftsScreen },
    Email: { screen: EmailScreen },
  },
  {
    navigationOptions: {
      drawerIcon: ({ tintColor }) => (
        <MaterialIcons
          name="drafts"
          size={24}
          style={{ color: tintColor } as StyleProp<TextStyle>}
        />
      ),
      drawerLabel: 'Drafts',
    },
  }
);

const DrawerExample = createDrawerNavigator(
  {
    Drafts: {
      path: '/sent',
      screen: DraftsStack,
    },
    Inbox: {
      path: '/',
      screen: InboxStack,
    },
  },

  {
    contentOptions: {
      activeTintColor: '#e91e63',
    },
    initialRouteName: 'Drafts',
  }
);

export default DrawerExample;
