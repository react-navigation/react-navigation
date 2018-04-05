import React, { Component, PropTypes } from 'react';
import {
  Animated,
  Easing,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {
  Transitioner,
  SafeAreaView,
  StackRouter,
  createNavigationContainer,
  createNavigator,
} from 'react-navigation';
import SampleText from './SampleText';
import { Button } from './commonComponents/ButtonWithMargin';

const MyNavScreen = ({ navigation, banner }) => (
  <SafeAreaView forceInset={{ top: 'always' }}>
    <SampleText>{banner}</SampleText>
    {navigation.state &&
      navigation.state.routeName !== 'Settings' && (
        <Button
          onPress={() => navigation.navigate('Settings')}
          title="Go to a settings screen"
        />
      )}

    <Button onPress={() => navigation.goBack(null)} title="Go back" />
    <StatusBar barStyle="default" />
  </SafeAreaView>
);

const MyHomeScreen = ({ navigation }) => (
  <MyNavScreen banner="Home Screen" navigation={navigation} />
);

const MySettingsScreen = ({ navigation }) => (
  <MyNavScreen banner="Settings Screen" navigation={navigation} />
);

class CustomNavigationView extends Component {
  render() {
    const { navigation, router, descriptors } = this.props;

    return (
      <Transitioner
        configureTransition={this._configureTransition}
        descriptors={descriptors}
        navigation={navigation}
        render={this._render}
      />
    );
  }

  _configureTransition(transitionProps, prevTransitionProps) {
    return {
      duration: 200,
      easing: Easing.out(Easing.ease),
    };
  }

  _render = (transitionProps, prevTransitionProps) => {
    const scenes = transitionProps.scenes.map(scene =>
      this._renderScene(transitionProps, scene)
    );
    return <View style={{ flex: 1 }}>{scenes}</View>;
  };

  _renderScene = (transitionProps, scene) => {
    const { navigation, router } = this.props;
    const { routes } = navigation.state;
    const { position } = transitionProps;
    const { index } = scene;

    const animatedValue = position.interpolate({
      inputRange: [index - 1, index, index + 1],
      outputRange: [0, 1, 0],
    });

    const animation = {
      opacity: animatedValue,
      transform: [{ scale: animatedValue }],
    };

    const Scene = scene.descriptor.getComponent();
    return (
      <Animated.View key={index} style={[styles.view, animation]}>
        <Scene navigation={scene.descriptor.navigation} />
      </Animated.View>
    );
  };
}

const CustomRouter = StackRouter({
  Home: { screen: MyHomeScreen },
  Settings: { screen: MySettingsScreen },
});

const CustomTransitioner = createNavigationContainer(
  createNavigator(CustomNavigationView, CustomRouter, {})
);

export default CustomTransitioner;

const styles = StyleSheet.create({
  view: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});
