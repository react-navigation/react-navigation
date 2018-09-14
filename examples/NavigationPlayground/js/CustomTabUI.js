/**
 * @flow
 */

import type {
  NavigationScreenProp,
  NavigationEventSubscription,
} from 'react-navigation';

import React from 'react';
import {
  Platform,
  ScrollView,
  StatusBar,
  LayoutAnimation,
  View,
  StyleSheet,
} from 'react-native';
import {
  SafeAreaView,
  createMaterialTopTabNavigator,
  createNavigationContainer,
} from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SampleText from './SampleText';
import { Button } from './commonComponents/ButtonWithMargin';

class MyHomeScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Home',
    tabBarIcon: ({ tintColor, focused, horizontal }) => (
      <Ionicons
        name={focused ? 'ios-home' : 'ios-home-outline'}
        size={horizontal ? 20 : 26}
        style={{ color: tintColor }}
      />
    ),
  };
  render() {
    const { navigation } = this.props;
    return (
      <SafeAreaView forceInset={{ horizontal: 'always', top: 'always' }}>
        <SampleText>Home Screen</SampleText>
        <Button
          onPress={() => navigation.navigate('Home')}
          title="Go to home tab"
        />
        <Button onPress={() => navigation.goBack(null)} title="Go back" />
      </SafeAreaView>
    );
  }
}

class ReccomendedScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Reccomended',
    tabBarIcon: ({ tintColor, focused, horizontal }) => (
      <Ionicons
        name={focused ? 'ios-home' : 'ios-home-outline'}
        size={horizontal ? 20 : 26}
        style={{ color: tintColor }}
      />
    ),
  };
  render() {
    const { navigation } = this.props;
    return (
      <SafeAreaView forceInset={{ horizontal: 'always', top: 'always' }}>
        <SampleText>Reccomended Screen</SampleText>
        <Button
          onPress={() => navigation.navigate('Home')}
          title="Go to home tab"
        />
        <Button onPress={() => navigation.goBack(null)} title="Go back" />
      </SafeAreaView>
    );
  }
}

class FeaturedScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    tabBarLabel: 'Featured',
    tabBarIcon: ({ tintColor, focused, horizontal }) => (
      <Ionicons
        name={focused ? 'ios-home' : 'ios-home-outline'}
        size={horizontal ? 20 : 26}
        style={{ color: tintColor }}
      />
    ),
  });
  render() {
    const { navigation } = this.props;
    return (
      <SafeAreaView forceInset={{ horizontal: 'always', top: 'always' }}>
        <SampleText>Featured Screen</SampleText>
        <Button
          onPress={() => navigation.navigate('Home')}
          title="Go to home tab"
        />
        <Button onPress={() => navigation.goBack(null)} title="Go back" />
      </SafeAreaView>
    );
  }
}

const SimpleTabs = createMaterialTopTabNavigator({
  Home: MyHomeScreen,
  Reccomended: ReccomendedScreen,
  Featured: FeaturedScreen,
});

class CustomTabNavigator extends React.Component {
  static router = SimpleTabs.router;
  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }
  render() {
    const { navigation } = this.props;
    const { routes, index } = navigation.state;
    const activeRoute = routes[index];
    let bottom = null;
    if (activeRoute.routeName !== 'Home') {
      bottom = (
        <View style={{ height: 50, borderTopWidth: StyleSheet.hairlineWidth }}>
          <Button title="Check out" onPress={() => {}} />
        </View>
      );
    }
    return (
      <View style={{ flex: 1 }}>
        <SimpleTabs navigation={navigation} />
        {bottom}
      </View>
    );
  }
}

const NavigatorWithState = createNavigationContainer(CustomTabNavigator);

const App = () => <NavigatorWithState />;

export default App;
