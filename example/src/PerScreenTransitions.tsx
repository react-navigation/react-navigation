import * as React from 'react';
import { Button, View, Text } from 'react-native';
import {
  createStackNavigator,
  TransitionPresets,
  TransitionSpecs,
  NavigationStackScreenProps,
} from 'react-navigation-stack';

function SlideScreen({ navigation }: NavigationStackScreenProps) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Slide Screen</Text>
      <Button title="Go to Modal" onPress={() => navigation.push('Modal')} />
      <Button title="Go to Reveal" onPress={() => navigation.push('Reveal')} />
      <Button
        title="Go to Transparent"
        onPress={() => navigation.push('Transparent')}
      />
      <Button
        title="Go back to all examples"
        onPress={() => navigation.navigate('Index')}
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
        title="Go to Transparent"
        onPress={() => navigation.push('Transparent')}
      />
      <Button
        title="Go back to all examples"
        onPress={() => navigation.navigate('Index')}
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
        title="Go to Transparent"
        onPress={() => navigation.push('Transparent')}
      />
      <Button
        title="Go back to all examples"
        onPress={() => navigation.navigate('Index')}
      />
    </View>
  );
}

function TransparentScreen({ navigation }: NavigationStackScreenProps) {
  return (
    <View
      style={{
        backgroundColor: 'rgba(0, 0, 0, .7)',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          backgroundColor: 'white',
          borderRadius: 4,
          padding: 16,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text>Transparent Screen</Text>
        <Button title="Go to Slide" onPress={() => navigation.push('Slide')} />
        <Button title="Go to Modal" onPress={() => navigation.push('Modal')} />
        <Button
          title="Go to Reveal"
          onPress={() => navigation.push('Reveal')}
        />
        <Button
          title="Go back to all examples"
          onPress={() => navigation.navigate('Index')}
        />
        <Button title="Close" onPress={() => navigation.goBack()} />
      </View>
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
    Transparent: {
      screen: TransparentScreen,
      navigationOptions: {
        cardStyle: { backgroundColor: 'transparent' },
        headerShown: false,
        gestureEnabled: false,
        transitionSpec: {
          open: TransitionSpecs.TransitionIOSSpec,
          close: TransitionSpecs.TransitionIOSSpec,
        },
        cardStyleInterpolator: ({ current: { progress } }) => ({
          cardStyle: { opacity: progress },
        }),
      },
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
