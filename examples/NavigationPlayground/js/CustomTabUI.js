import React from 'react';
import {
  LayoutAnimation,
  View,
  StyleSheet,
  StatusBar,
  Text,
} from 'react-native';
import {
  SafeAreaView,
  createMaterialTopTabNavigator,
  createNavigationContainer,
} from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
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
        <Text>Home Screen</Text>
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
        name={focused ? 'ios-people' : 'ios-people-outline'}
        size={horizontal ? 20 : 26}
        style={{ color: tintColor }}
      />
    ),
  };
  render() {
    const { navigation } = this.props;
    return (
      <SafeAreaView forceInset={{ horizontal: 'always', top: 'always' }}>
        <Text>Reccomended Screen</Text>
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
        name={focused ? 'ios-star' : 'ios-star-outline'}
        size={horizontal ? 20 : 26}
        style={{ color: tintColor }}
      />
    ),
  });
  render() {
    const { navigation } = this.props;
    return (
      <SafeAreaView forceInset={{ horizontal: 'always', top: 'always' }}>
        <Text>Featured Screen</Text>
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

class TabNavigator extends React.Component {
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
        <StatusBar barStyle="default" />
        <SafeAreaView
          style={{ flex: 1 }}
          forceInset={{ horizontal: 'always', top: 'always' }}
        >
          <SimpleTabs navigation={navigation} />
        </SafeAreaView>
        {bottom}
      </View>
    );
  }
}

export default TabNavigator;
