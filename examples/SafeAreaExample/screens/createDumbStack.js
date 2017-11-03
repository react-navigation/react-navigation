import React from 'react';
import { StackNavigator } from 'react-navigation';
import {
  Dimensions,
  Button,
  Platform,
  ScrollView,
  Text,
  View,
  StatusBar,
} from 'react-native';
import { ScreenOrientation } from 'expo';

const Separator = () => (
  <View
    style={{
      width: Dimensions.get('window').width - 100,
      height: 1,
      backgroundColor: '#ccc',
      marginHorizontal: 50,
      marginTop: 15,
      marginBottom: 15,
    }}
  />
);

const Spacer = () => (
  <View
    style={{
      marginBottom: Platform.OS === 'android' ? 20 : 5,
    }}
  />
);

export default (navigationOptions = {}) => {
  class DumbScreen extends React.Component {
    static navigationOptions = {
      title: 'Title!',
      ...navigationOptions,
      headerStyle: {
        backgroundColor: '#6b52ae',
        ...navigationOptions.headerStyle,
      },
      headerTitleStyle: {
        color: '#fff',
        ...navigationOptions.headerTitleStyle,
      },
    };

    render() {
      return (
        <ScrollView style={{ flex: 1 }}>
          <View
            style={{
              paddingTop: 30,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Button onPress={this._goBack} title="Go back" />
            <Separator />
            <Button onPress={this._setPortrait} title="Set portrait" />
            <Spacer />
            <Button onPress={this._setLandscape} title="Set landscape" />
            <Separator />
            <Button onPress={this._hideStatusBar} title="Hide status bar" />
            <Spacer />
            <Button onPress={this._showStatusBar} title="Show status bar" />
          </View>
        </ScrollView>
      );
    }

    _goBack = () => {
      this.props.navigation.goBack(null);
    };

    _setPortrait = () => {
      ScreenOrientation.allow(ScreenOrientation.Orientation.PORTRAIT);
    };

    _setLandscape = () => {
      ScreenOrientation.allow(ScreenOrientation.Orientation.LANDSCAPE);
    };

    _hideStatusBar = () => {
      StatusBar.setHidden(true, 'slide');
    };

    _showStatusBar = () => {
      StatusBar.setHidden(false, 'slide');
    };
  }

  return StackNavigator({
    dumb: {
      screen: DumbScreen,
    },
  });
};
