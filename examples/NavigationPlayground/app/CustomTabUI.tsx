import React from 'react';
import {
  LayoutAnimation,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  createMaterialTopTabNavigator,
  NavigationScreenProp,
  NavigationState,
  SafeAreaView,
} from 'react-navigation';
import { Button } from './commonComponents/ButtonWithMargin';

interface Props {
  navigation: NavigationScreenProp<NavigationState>;
}

class MyHomeScreen extends React.Component<Props> {
  static navigationOptions = {
    tabBarLabel: 'Home',
    tabBarIcon: ({
      tintColor,
      focused,
      horizontal,
    }: {
      tintColor: string;
      focused: boolean;
      horizontal: boolean;
    }) => (
      <Ionicons
        name={focused ? 'ios-home' : 'ios-home'}
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

class RecommendedScreen extends React.Component<Props> {
  static navigationOptions = {
    tabBarLabel: 'Recommended',
    tabBarIcon: ({
      tintColor,
      focused,
      horizontal,
    }: {
      tintColor: string;
      focused: boolean;
      horizontal: boolean;
    }) => (
      <Ionicons
        name={focused ? 'ios-people' : 'ios-people'}
        size={horizontal ? 20 : 26}
        style={{ color: tintColor }}
      />
    ),
  };
  render() {
    const { navigation } = this.props;
    return (
      <SafeAreaView forceInset={{ horizontal: 'always', top: 'always' }}>
        <Text>Recommended Screen</Text>
        <Button
          onPress={() => navigation.navigate('Home')}
          title="Go to home tab"
        />
        <Button onPress={() => navigation.goBack(null)} title="Go back" />
      </SafeAreaView>
    );
  }
}

class FeaturedScreen extends React.Component<Props> {
  static navigationOptions = ({
    navigation,
  }: {
    navigation: NavigationScreenProp<NavigationState>;
  }) => ({
    tabBarLabel: 'Featured',
    tabBarIcon: ({
      tintColor,
      focused,
      horizontal,
    }: {
      tintColor: string;
      focused: boolean;
      horizontal: boolean;
    }) => (
      <Ionicons
        name={focused ? 'ios-star' : 'ios-star'}
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
  Recommended: RecommendedScreen,
  Featured: FeaturedScreen,
});

class TabNavigator extends React.Component<Props> {
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
          <Button
            title="Check out"
            onPress={() => {
              //
            }}
          />
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
