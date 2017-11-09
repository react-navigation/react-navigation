/**
 * @flow
 */

import React from 'react';
import { Button, ScrollView, Text } from 'react-native';
import { SafeAreaView, StackNavigator } from 'react-navigation';
import SampleText from './SampleText';

const MyNavScreen = ({ navigation, banner }) => (
  <ScrollView contentInsetAdjustmentBehavior="automatic">
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
            })}
        />
      )}
      <Button onPress={() => navigation.goBack(null)} title="Go back" />
    </SafeAreaView>
  </ScrollView>
);

const MyHomeScreen = ({ navigation }) => (
  <MyNavScreen banner="Home Screen" navigation={navigation} />
);
MyHomeScreen.navigationOptions = {
  title: 'Welcome',
};

const MyProfileScreen = ({ navigation }) => (
  <MyNavScreen
    banner={`${navigation.state.params.name}'s Profile`}
    navigation={navigation}
  />
);
MyProfileScreen.navigationOptions = ({ navigation }) => ({
  title: `${navigation.state.params.name}'s Profile!`,
});

const ProfileNavigator = StackNavigator(
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
    navigationOptions: {
      header: null,
    },
  }
);

const MyHeaderTestScreen = ({ navigation }) => (
  <MyNavScreen banner={`Full screen view`} navigation={navigation} />
);
MyHeaderTestScreen.navigationOptions = ({ navigation }) => {
  const headerVisible =
    navigation.state.params && navigation.state.params.headerVisible;
  return {
    header: headerVisible ? undefined : null,
    title: 'Now you see me',
  };
};

const ModalStack = StackNavigator(
  {
    Home: {
      screen: MyHomeScreen,
    },
    ProfileNavigator: {
      screen: ProfileNavigator,
    },
    HeaderTest: { screen: MyHeaderTestScreen },
  },
  {
    mode: 'modal',
  }
);

export default ModalStack;
