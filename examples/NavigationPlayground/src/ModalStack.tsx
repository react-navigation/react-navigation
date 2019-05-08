import React from 'react';
import { ScrollView, StatusBar, Text } from 'react-native';
import {
  createStackNavigator,
  NavigationScreenProp,
  SafeAreaView,
} from 'react-navigation';
import { NavigationState } from 'react-navigation';
import { Button } from './commonComponents/ButtonWithMargin';
import SampleText from './SampleText';

const MyNavScreen = ({
  navigation,
  banner,
}: {
  navigation: NavigationScreenProp<NavigationState & any>;
  banner: string;
}) => (
  <ScrollView>
    <SafeAreaView
      forceInset={{
        top: navigation.state.routeName === 'HeaderTest' ? 'always' : 'never',
      }}
    >
      <SampleText>{banner}</SampleText>
      <Button
        onPress={() => navigation.navigate('Profile', { name: 'Jane' })}
        title="Go to a profile screen"
      />
      <Button
        onPress={() => navigation.navigate('HeaderTest')}
        title="Go to a header toggle screen"
      />
      {navigation.state.routeName === 'HeaderTest' && (
        <Button
          title="Toggle Header"
          onPress={() =>
            navigation.setParams({
              headerVisible:
                !navigation.state.params ||
                !navigation.state.params.headerVisible,
            })
          }
        />
      )}
      <Button onPress={() => navigation.goBack(null)} title="Go back" />
    </SafeAreaView>
    <StatusBar barStyle="default" />
  </ScrollView>
);

const MyHomeScreen = ({
  navigation,
}: {
  navigation: NavigationScreenProp<NavigationState>;
}) => <MyNavScreen banner="Home Screen" navigation={navigation} />;
MyHomeScreen.navigationOptions = {
  title: 'Welcome',
};

const MyProfileScreen = ({
  navigation,
}: {
  navigation: NavigationScreenProp<NavigationState>;
}) => (
  <MyNavScreen
    banner={`${navigation.state.params!.name}'s Profile`}
    navigation={navigation}
  />
);
MyProfileScreen.navigationOptions = ({
  navigation,
}: {
  navigation: NavigationScreenProp<NavigationState>;
}) => ({
  title: `${navigation.state.params!.name}'s Profile!`,
});

const ProfileNavigator = createStackNavigator(
  {
    Home: {
      screen: MyHomeScreen,
    },
    Profile: {
      path: 'people/:name',
      screen: MyProfileScreen,
    },
  },
  {
    defaultNavigationOptions: {
      headerLeft: null,
    },
    mode: 'modal',
  }
);

const MyHeaderTestScreen = ({
  navigation,
}: {
  navigation: NavigationScreenProp<NavigationState>;
}) => <MyNavScreen banner={`Full screen view`} navigation={navigation} />;
MyHeaderTestScreen.navigationOptions = ({
  navigation,
}: {
  navigation: NavigationScreenProp<NavigationState>;
}) => {
  const headerVisible =
    navigation.state.params && navigation.state.params.headerVisible;
  return {
    header: headerVisible ? undefined : null,
    title: 'Now you see me',
  };
};

const ModalStack = createStackNavigator(
  {
    HeaderTest: { screen: MyHeaderTestScreen },
    ProfileNavigator: {
      screen: ProfileNavigator,
    },
  },
  {
    defaultNavigationOptions: {
      header: null,
    },
    mode: 'modal',
  }
);

export default ModalStack;
