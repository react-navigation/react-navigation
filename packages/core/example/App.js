import React from 'react';
import { registerRootComponent } from 'expo';
import { Asset } from 'expo-asset';
import { TouchableOpacity, View, FlatList, I18nManager } from 'react-native';
import { Themed, createAppContainer } from '@react-navigation/native';
import { ThemeContext, ThemeColors } from '@react-navigation/core';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import {
  Assets as StackAssets,
  createStackNavigator,
} from 'react-navigation-stack';
import { List, Divider } from 'react-native-paper';

import SimpleStack from './src/SimpleStack';
import SimpleTabs, { createSimpleTabs } from './src/SimpleTabs';
import EventsStack from './src/EventsStack';

// Comment/uncomment the following two lines to toggle react-native-screens
// import { useScreens } from 'react-native-screens';
// useScreens();

// Uncomment the following line to force RTL. Requires closing and re-opening
// your app after you first load it with this option enabled.
I18nManager.forceRTL(false);

const data = [
  { component: SimpleStack, title: 'Simple Stack', routeName: 'SimpleStack' },
  { component: SimpleTabs, title: 'Simple Tabs', routeName: 'SimpleTabs' },
  { component: EventsStack, title: 'Events', routeName: 'EventsStack' },
];

['initialRoute', 'none', 'order', 'history'].forEach(backBehavior => {
  data.push({
    component: createSimpleTabs({
      backBehavior: backBehavior,
      initialRouteName: 'C', // more easy to test initialRoute behavior
    }),
    title: `Tabs backBehavior=${backBehavior}`,
    routeName: `Tabs backBehavior=${backBehavior}`,
  });
});

// Cache images
Asset.loadAsync(StackAssets);

class Home extends React.Component {
  static contextType = ThemeContext;
  static navigationOptions = {
    title: 'Examples',
  };

  _renderItem = ({ item }) => (
    <List.Item
      title={item.title}
      onPress={() => this.props.navigation.navigate(item.routeName)}
      style={{ backgroundColor: ThemeColors[this.context].bodyContent }}
      titleStyle={{ color: ThemeColors[this.context].label }}
    />
  );

  _keyExtractor = item => item.routeName;

  render() {
    return (
      <>
        <FlatList
          ItemSeparatorComponent={() => (
            <Divider
              style={{
                backgroundColor: ThemeColors[this.context].bodyBorder,
              }}
            />
          )}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          data={data}
          style={{ backgroundColor: ThemeColors[this.context].body }}
        />
        <Themed.StatusBar />
      </>
    );
  }
}

const Root = createStackNavigator(
  {
    Home: createStackNavigator({ Home }),
    ...data.reduce((acc, it) => {
      acc[it.routeName] = {
        screen: it.component,
        navigationOptions: {
          title: it.title,
        },
      };

      return acc;
    }, {}),
  },
  {
    mode: 'modal',
    headerMode: 'none',
    defaultNavigationOptions: {
      gesturesEnabled: false,
    },
  }
);

const Navigation = createAppContainer(Root);

const App = () => {
  let [theme, setTheme] = React.useState('light');

  return (
    <View style={{ flex: 1 }}>
      <Navigation theme={theme} />
      <View style={{ position: 'absolute', bottom: 60, right: 20 }}>
        <TouchableOpacity
          onPress={() => {
            setTheme(theme === 'light' ? 'dark' : 'light');
          }}
        >
          <View
            style={{
              backgroundColor: ThemeColors[theme].bodyContent,
              borderRadius: 25,
              width: 50,
              height: 50,
              alignItems: 'center',
              justifyContent: 'center',
              borderColor: ThemeColors[theme].bodyBorder,
              borderWidth: 1,
              shadowColor: ThemeColors[theme].label,
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.4,
              shadowRadius: 2,

              elevation: 5,
            }}
          >
            <MaterialCommunityIcons
              name="theme-light-dark"
              size={30}
              color={ThemeColors[theme].label}
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

registerRootComponent(App);
