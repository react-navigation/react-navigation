import * as React from 'react';
import { Button, View, Text } from 'react-native';
import {
  createStackNavigator,
  TransitionPresets,
  NavigationStackScreenProps,
} from 'react-navigation-stack';

function SlideScreen({ navigation }: NavigationStackScreenProps) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Slide Screen</Text>
      <Button title="Go to Modal" onPress={() => navigation.push('Modal')} />
      <Button title="Go to Reveal" onPress={() => navigation.push('Reveal')} />
      <Button
        title="Go back to all examples"
        onPress={() => navigation.navigate('Home')}
      />
    </View>
  );
}

function ModalScreen({ navigation }: NavigationStackScreenProps) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Slide Screen</Text>
      <Button title="Go to Reveal" onPress={() => navigation.push('Reveal')} />
      <Button title="Go to Slide" onPress={() => navigation.push('Slide')} />
      <Button
        title="Go back to all examples"
        onPress={() => navigation.navigate('Home')}
      />
    </View>
  );
}

function RevealScreen({ navigation }: NavigationStackScreenProps) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Slide Screen</Text>
      <Button title="Go to Slide" onPress={() => navigation.push('Slide')} />
      <Button title="Go to Modal" onPress={() => navigation.push('Modal')} />
      <Button
        title="Go back to all examples"
        onPress={() => navigation.navigate('Home')}
      />
    </View>
  );
}

export default createStackNavigator(
  {
    Slide: {
      screen: SlideScreen,
      navigationOptions: TransitionPresets.SlideFromRightIOS,
    },
    Modal: {
      screen: ModalScreen,
      navigationOptions: TransitionPresets.ModalSlideFromBottomIOS,
    },
    Reveal: {
      screen: RevealScreen,
      navigationOptions: TransitionPresets.RevealFromBottomAndroid,
    },
  },
  {
    headerMode: 'screen',
    defaultNavigationOptions: {
      cardOverlayEnabled: true,
      gestureEnabled: true,
    },
  }
);
