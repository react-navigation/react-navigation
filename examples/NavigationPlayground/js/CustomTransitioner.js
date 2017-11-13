import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Platform,
  Easing,
  View,
  Animated,
  Image,
  Button,
} from 'react-native';
import {
  Transitioner,
  SafeAreaView,
  StackRouter,
  createNavigationContainer,
  addNavigationHelpers,
  createNavigator,
} from 'react-navigation';
import SampleText from './SampleText';

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
    const { navigation, router } = this.props;

    return (
      <Transitioner
        configureTransition={this._configureTransition}
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

    // The prop `router` is populated when we call `createNavigator`.
    const Scene = router.getComponentForRouteName(scene.route.routeName);
    return (
      <Animated.View key={index} style={[styles.view, animation]}>
        <Scene
          navigation={addNavigationHelpers({
            ...navigation,
            state: routes[index],
          })}
        />
      </Animated.View>
    );
  };
}

const CustomRouter = StackRouter({
  Home: { screen: MyHomeScreen },
  Settings: { screen: MySettingsScreen },
});

const CustomTransitioner = createNavigationContainer(
  createNavigator(CustomRouter)(CustomNavigationView)
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
