import React from 'react';
import { Button, View, Text } from 'react-native';
import { withNavigation } from '@react-navigation/core';
import { createStackNavigator } from 'react-navigation-stack';

const Buttons = withNavigation((props) => (
  <React.Fragment>
    <Button
      title="Go to Details"
      onPress={() => props.navigation.navigate('Details')}
    />
    <Button
      title="Go to Headerless"
      onPress={() => props.navigation.navigate('Headerless')}
    />
    <Button title="Go back" onPress={() => props.navigation.goBack()} />
    <Button
      title="Go back to all examples"
      onPress={() => props.navigation.navigate('Home')}
    />
  </React.Fragment>
));

class ListScreen extends React.Component {
  static navigationOptions = {
    title: 'List',
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fff',
        }}
      >
        <Text>List Screen</Text>
        <Text>A list may go here</Text>
        <Buttons />
      </View>
    );
  }
}

class DetailsScreen extends React.Component {
  static navigationOptions = {
    title: 'Details',
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fff',
        }}
      >
        <Text>Details Screen</Text>
        <Buttons />
      </View>
    );
  }
}

class HeaderlessScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fff',
        }}
      >
        <Text>Headerless Screen</Text>
        <Buttons />
      </View>
    );
  }
}

export default createStackNavigator(
  {
    List: ListScreen,
    Details: DetailsScreen,
    Headerless: HeaderlessScreen,
  },
  {
    initialRouteName: 'List',

    // these are the defaults
    cardShadowEnabled: true,
    cardOverlayEnabled: false,

    // headerTransitionPreset: 'uikit',
  }
);
