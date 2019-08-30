import React from 'react';
import {
  Alert,
  TouchableOpacity,
  LayoutAnimation,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  Themed,
  ThemeContext,
  NavigationScreenProp,
  NavigationState,
  SafeAreaView,
} from 'react-navigation';
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBar,
} from 'react-navigation-tabs';
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
        <Themed.Text>Home Screen</Themed.Text>
        <Button
          onPress={() => navigation.navigate('Home')}
          title="Go to home tab"
        />
        <Button onPress={() => navigation.goBack(null)} title="Go back" />
      </SafeAreaView>
    );
  }
}

class StarredScreen extends React.Component<Props> {
  static navigationOptions = {
    tabBarLabel: 'Starred',
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
        <Themed.Text>Starred Screen</Themed.Text>
        <Button
          onPress={() => navigation.navigate('Home')}
          title="Go to home tab"
        />
        <Button onPress={() => navigation.goBack(null)} title="Go back" />
      </SafeAreaView>
    );
  }
}

type MaterialTopTabBarProps = React.ComponentProps<typeof MaterialTopTabBar>;

class MaterialTopTabBarWrapper extends React.Component<MaterialTopTabBarProps> {
  render() {
    return (
      <SafeAreaView
        style={{ backgroundColor: '#000' }}
        forceInset={{ top: 'always', horizontal: 'never', bottom: 'never' }}
      >
        <MaterialTopTabBar {...this.props} />
      </SafeAreaView>
    );
  }
}

class FeaturedScreen extends React.Component<Props> {
  static navigationOptions = {
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
  };

  render() {
    const { navigation } = this.props;
    return (
      <SafeAreaView forceInset={{ horizontal: 'always', top: 'always' }}>
        <Themed.Text>Featured Screen</Themed.Text>
        <Button
          onPress={() => navigation.navigate('Home')}
          title="Go to home tab"
        />
        <Button onPress={() => navigation.goBack(null)} title="Go back" />
      </SafeAreaView>
    );
  }
}

const SimpleTabs = createMaterialTopTabNavigator(
  {
    Home: MyHomeScreen,
    Starred: StarredScreen,
    Featured: FeaturedScreen,
  },
  {
    tabBarComponent: MaterialTopTabBarWrapper,
    tabBarOptions: {
      style: {
        backgroundColor: '#000',
      },
    },
  }
);

class TabNavigator extends React.Component<Props> {
  static contextType = ThemeContext;

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
        <View
          style={{
            height: 50,
            borderTopWidth: StyleSheet.hairlineWidth,
            backgroundColor: this.context === 'light' ? '#000' : '#fff',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <TouchableOpacity
            onPress={() => {
              Alert.alert('hello!');
              //
            }}
          >
            <Text
              style={{
                fontSize: 20,
                color: this.context === 'light' ? '#fff' : '#000',
                fontWeight: 'bold',
              }}
            >
              Check out
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" />
        <SimpleTabs navigation={navigation} />
        {bottom}
      </View>
    );
  }
}

export default TabNavigator;
