/**
 * @flow
 */

import React from 'react';
import { Button, ScrollView } from 'react-native';
import { StackNavigator, SafeAreaView } from 'react-navigation';
import SampleText from './SampleText';

const MyNavScreen = ({ navigation, banner }) => (
  <SafeAreaView>
    <SampleText>{banner}</SampleText>
    <Button
      onPress={() => navigation.navigate('Profile', { name: 'Jane' })}
      title="Go to a profile screen"
    />
    <Button
      onPress={() => navigation.navigate('Photos', { name: 'Jane' })}
      title="Go to a photos screen"
    />
    {/* <Button onPress={() => navigation.goBack(null)} title="Go back" /> */}
    <Button onPress={() => navigation.dispatch({ type: 'POP', numberOfScreens: 8 })} title="Pop" />
    <Button onPress={() => navigation.dispatch({ type: 'POP_TO_TOP' })} title="Pop to top" />
  </SafeAreaView>
);

const MyHomeScreen = ({ navigation }) => (
  <MyNavScreen banner="Home Screen" navigation={navigation} />
);
MyHomeScreen.navigationOptions = {
  title: 'Welcome',
};

const MyPhotosScreen = ({ navigation }) => (
  <MyNavScreen
    banner={`${navigation.state.params.name}'s Photos`}
    navigation={navigation}
  />
);
MyPhotosScreen.navigationOptions = {
  title: 'Photos',
};

const MyProfileScreen = ({ navigation }) => (
  <MyNavScreen
    banner={`${navigation.state.params.mode === 'edit'
      ? 'Now Editing '
      : ''}${navigation.state.params.name}'s Profile`}
    navigation={navigation}
  />
);

MyProfileScreen.navigationOptions = props => {
  const { navigation } = props;
  const { state, setParams } = navigation;
  const { params } = state;
  return {
    headerTitle: `${params.name}'s Profile!`,
    // Render a button on the right side of the header.
    // When pressed switches the screen to edit mode.
    headerRight: (
      <Button
        title={params.mode === 'edit' ? 'Done' : 'Edit'}
        onPress={() =>
          setParams({ mode: params.mode === 'edit' ? '' : 'edit' })}
      />
    ),
  };
};

const SimpleStack = StackNavigator({
  Home: {
    screen: MyHomeScreen,
  },
  Profile: {
    path: 'people/:name',
    screen: MyProfileScreen,
  },
  Photos: {
    path: 'photos/:name',
    screen: MyPhotosScreen,
  },
});

const defaultGetStateForAction = SimpleStack.router.getStateForAction;
SimpleStack.router.getStateForAction = (action, state) => {
  if (state && action.type === 'POP') {
    let numberOfScreens = action.numberOfScreens || 1;
    if (state.index <= 0) {
      // TODO: How do I make this pass up to parent nav?
      return state;
    }

    if (numberOfScreens >= state.routes.length) {
      numberOfScreens = state.routes.length - 1;
    }

    const routes = state.routes.slice(0, numberOfScreens * -1);
    return {
      ...state,
      routes,
      index: routes.length - 1,
    };
  }

  if (state && action.type === 'POP_TO_TOP') {
    if (state.index <= 0) {
      // TODO: How do I make this pass up to parent nav?
      return state;
    }

    const routes = state.routes.slice(0, (state.routes.length - 1) * -1);
    return {
      ...state,
      routes,
      index: routes.length - 1,
    };
  }

  return defaultGetStateForAction(action, state);
};

export default SimpleStack;
