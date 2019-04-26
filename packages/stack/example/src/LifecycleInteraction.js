import * as React from 'react';
import { Button, Text, View, StyleSheet } from 'react-native';
import { BarCodeScanner } from 'expo';
import { withNavigationFocus } from '@react-navigation/core';
import { createStackNavigator } from 'react-navigation-stack';

const IndexScreen = ({ navigation }) => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Button
      title="Go to BarCodeScanner"
      onPress={() => navigation.navigate('BarCode')}
    />
    <Button
      title="Return to other examples"
      onPress={() => navigation.navigate('Home')}
    />
  </View>
);

IndexScreen.navigationOptions = {
  title: 'Lifecycle Interactions',
};

@withNavigationFocus
class BarCodeScreen extends React.Component {
  handleBarCodeScanned = data => {
    console.log('scanned...');
    this.props.navigation.navigate('Info', { data });
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <BarCodeScanner
          onBarCodeScanned={
            this.props.isFocused ? this.handleBarCodeScanned : null
          }
          style={StyleSheet.absoluteFill}
        />
      </View>
    );
  }
}

BarCodeScreen.navigationOptions = {
  title: 'BarCodeView',
};

class InfoScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Text>{JSON.stringify(this.props.navigation.getParam('data'))}</Text>
      </View>
    );
  }
}

InfoScreen.navigationOptions = {
  title: 'Info',
};

export default createStackNavigator(
  {
    Index: IndexScreen,
    BarCode: BarCodeScreen,
    Info: InfoScreen,
  },
  {
    initialRouteName: 'Index',
  }
);
