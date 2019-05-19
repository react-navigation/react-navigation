import React from 'react';
import {
  ScrollView,
  StatusBar,
  StatusBarStyle,
  StyleSheet,
  View,
} from 'react-native';
import {
  createMaterialTopTabNavigator,
  createStackNavigator,
  NavigationScreenProp,
  NavigationState,
  SafeAreaView,
} from 'react-navigation';
import { MaterialTopTabBar } from 'react-navigation-tabs';

import { Button } from './commonComponents/ButtonWithMargin';
import SampleText from './SampleText';

const HEADER_HEIGHT = 64;

const MyNavScreen = ({
  navigation,
  banner,
  statusBarStyle,
}: {
  navigation: NavigationScreenProp<NavigationState>;
  banner: string;
  statusBarStyle?: StatusBarStyle;
}) => (
  <ScrollView>
    <SafeAreaView forceInset={{ horizontal: 'always' }}>
      <SampleText>{banner}</SampleText>
      <Button
        onPress={() => navigation.navigate('Profile', { name: 'Jordan' })}
        title="Open profile screen"
      />
      <Button
        onPress={() => navigation.navigate('NotifSettings')}
        title="Open notifications screen"
      />
      <Button
        onPress={() => navigation.navigate('SettingsTab')}
        title="Go to settings tab"
      />
      <Button onPress={() => navigation.goBack(null)} title="Go back" />
    </SafeAreaView>
    <StatusBar barStyle={statusBarStyle || 'default'} />
  </ScrollView>
);

const MyHomeScreen = ({
  navigation,
}: {
  navigation: NavigationScreenProp<NavigationState>;
}) => (
  <MyNavScreen
    banner="Home Screen"
    navigation={navigation}
    statusBarStyle="light-content"
  />
);

const MyProfileScreen = ({
  navigation,
}: {
  navigation: NavigationScreenProp<NavigationState>;
}) => (
  <MyNavScreen
    banner={`${navigation.state.params!.name}s Profile`}
    navigation={navigation}
  />
);

const MyNotificationsSettingsScreen = ({
  navigation,
}: {
  navigation: NavigationScreenProp<NavigationState>;
}) => <MyNavScreen banner="Notifications Screen" navigation={navigation} />;

const MySettingsScreen = ({
  navigation,
}: {
  navigation: NavigationScreenProp<NavigationState>;
}) => (
  <MyNavScreen
    banner="Settings Screen"
    navigation={navigation}
    statusBarStyle="light-content"
  />
);

const styles = StyleSheet.create({
  stackHeader: {
    height: HEADER_HEIGHT,
  },
  tab: {
    height: HEADER_HEIGHT,
  },
});

function MaterialTopTabBarWithStatusBar(props: any) {
  return (
    <View
      style={{
        paddingTop: 20,
        backgroundColor: '#2196f3',
      }}
    >
      <MaterialTopTabBar
        {...props}
        jumpToIndex={() => {
          //
        }}
      />
    </View>
  );
}

const TabNavigator = createMaterialTopTabNavigator(
  {
    MainTab: {
      screen: MyHomeScreen,
      navigationOptions: {
        title: 'Welcome',
      },
    },
    SettingsTab: {
      screen: MySettingsScreen,
      navigationOptions: {
        title: 'Settings',
      },
    },
  },
  {
    tabBarComponent: MaterialTopTabBarWithStatusBar,
    tabBarOptions: {
      tabStyle: styles.tab,
    },
  }
);

const StackNavigator = createStackNavigator(
  {
    Root: {
      screen: TabNavigator,
      navigationOptions: {
        header: null,
      },
    },
    NotifSettings: {
      screen: MyNotificationsSettingsScreen,
      navigationOptions: {
        title: 'Notifications',
      },
    },
    Profile: {
      screen: MyProfileScreen,
      navigationOptions: ({
        navigation,
      }: {
        navigation: NavigationScreenProp<NavigationState>;
      }) => ({
        title: `${navigation.state.params!.name}'s Profile!`,
      }),
    },
  },
  {
    defaultNavigationOptions: {
      headerStyle: styles.stackHeader,
    },
  }
);

export default StackNavigator;
