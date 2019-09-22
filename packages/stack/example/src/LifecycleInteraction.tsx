import * as React from 'react';
import { Button, Text, View, StyleSheet } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { withNavigationFocus } from 'react-navigation';
import {
  createStackNavigator,
  NavigationStackScreenComponent,
  NavigationStackScreenProps,
} from 'react-navigation-stack';

const IndexScreen: NavigationStackScreenComponent = ({ navigation }) => (
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

const BarCodeScreenBase = (
  props: NavigationStackScreenProps & { isFocused: boolean }
) => {
  return (
    <View style={{ flex: 1 }}>
      <BarCodeScanner
        onBarCodeScanned={
          props.isFocused
            ? data => {
                console.log('scanned...');
                props.navigation.navigate('Info', { data });
              }
            : () => {}
        }
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
};

BarCodeScreenBase.navigationOptions = {
  title: 'BarCodeView',
};

const BarCodeScreen = withNavigationFocus(BarCodeScreenBase);

const InfoScreen: NavigationStackScreenComponent = props => {
  return (
    <View style={{ flex: 1 }}>
      <Text>{JSON.stringify(props.navigation.getParam('data'))}</Text>
    </View>
  );
};

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
