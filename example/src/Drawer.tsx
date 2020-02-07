import React from 'react';
import { ScrollView, StyleProp, TextStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import {
  Themed,
  SafeAreaView,
  NavigationScreenProp,
  NavigationState,
} from 'react-navigation';
import {
  createStackNavigator,
  NavigationStackScreenProps,
} from 'react-navigation-stack';
import {
  createDrawerNavigator,
  NavigationDrawerScreenProps,
} from 'react-navigation-drawer';
import { Button } from './Shared/ButtonWithMargin';
import SampleText from './Shared/SampleText';

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
      <Button
        onPress={() => {
          // @ts-ignore
          navigation.openDrawer();
        }}
        title="Open drawer"
      />
      <Button
        onPress={() => navigation.navigate('Email')}
        title="Open other screen"
      />
      <Button onPress={() => navigation.navigate('Index')} title="Go back" />
    </SafeAreaView>
    <Themed.StatusBar />
  </ScrollView>
);

const InboxScreen = ({ navigation }: NavigationDrawerScreenProps) => (
  <MyNavScreen banner="Inbox Screen" navigation={navigation} />
);

InboxScreen.navigationOptions = {
  headerTitle: 'Inbox',
};

const EmailScreen = ({ navigation }: NavigationStackScreenProps) => (
  <MyNavScreen banner="Email Screen" navigation={navigation} />
);

const DraftsScreen = ({ navigation }: NavigationStackScreenProps) => (
  <MyNavScreen banner="Drafts Screen" navigation={navigation} />
);

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
      drawerIcon: ({ tintColor }: { tintColor: string }) => (
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
      drawerIcon: ({ tintColor }: { tintColor: string }) => (
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
