/**
 * @flow
 */

import React from 'react';
import {
  Button,
  ScrollView,
  Text,
} from 'react-native';
import {
  StackNavigator,
} from 'react-navigation';
import SampleText from './SampleText';

const MyNavScreen = ({ navigation, banner }) => (
  <ScrollView>
    <SampleText>{banner}</SampleText>
    <Button
      onPress={() => navigation.navigate('Profile', { name: 'Jane' })}
      title="Go to a profile screen"
    />
    <Button
      onPress={() => navigation.navigate('HeaderTest')}
      title="Go to a header toggle screen"
    />
    {navigation.state.routeName === 'HeaderTest' && <Button
      title="Toggle Header"
      onPress={() => navigation.setParams({ header: (!navigation.state.params || navigation.state.params.header === 'visible') ? 'none' : 'visible' })}
    />}
    <Button
      onPress={() => navigation.goBack(null)}
      title="Go back"
    />
  </ScrollView>
);

const MyHomeScreen = ({ navigation }) => (
  <MyNavScreen
    banner="Home Screen"
    navigation={navigation}
  />
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

const MyHeaderTestScreen = ({ navigation }) => (
  <MyNavScreen
    banner={`Full screen view`}
    navigation={navigation}
  />
);
MyHeaderTestScreen.navigationOptions = ({navigation}) => {
  const header = navigation.state.params && navigation.state.params.header;
  const headerVisible = !header || header === 'visible';
  return {
    headerVisible,
    headerBackTitle: 'wow',
    headerRight: <Text>wow2</Text>,
    title: 'Now you see me',
  };
};

const ModalStack = StackNavigator({
  Home: {
    screen: MyHomeScreen,
  },
  Profile: {
    path: 'people/:name',
    screen: MyProfileScreen,
  },
  HeaderTest: {screen: MyHeaderTestScreen},
}, {
  mode: 'modal',
});

export default ModalStack;
