import * as React from 'react';
// eslint-disable-next-line no-unused-vars
import { View, TouchableOpacity, FlatList, I18nManager } from 'react-native';
import { ThemeContext, ThemeColors } from '@react-navigation/core';
import { Themed, createAppContainer } from '@react-navigation/native';
import { createStackNavigator } from 'react-navigation-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { List, Divider } from 'react-native-paper';

import { SimpleDrawer, SimpleDrawerUnmountInactive } from './src/SimpleDrawer';
import { ParallaxDrawer } from './src/ParallaxDrawer';
import StyledDrawer from './src/StyledDrawer';
import GestureInteraction from './src/GestureInteraction';
import RTLDrawer from './src/RTLDrawer';

// I18nManager.forceRTL(false);

const data = [
  {
    component: SimpleDrawer,
    title: 'Simple - persistent routes like tabs',
    routeName: 'SimpleDrawer',
  },
  {
    component: SimpleDrawerUnmountInactive,
    title: 'Simple - unmount inactive routes',
    routeName: 'SimpleDrawerUnmountInactive',
  },
  { component: StyledDrawer, title: 'Styled', routeName: 'StyledDrawer' },
  {
    component: GestureInteraction,
    title: 'Gesture Interaction',
    routeName: 'GestureInteraction',
  },
  {
    component: RTLDrawer,
    title: 'Right drawer to test RTL',
    routeName: 'RTLDrawer',
  },
  {
    component: ParallaxDrawer,
    title: 'Basic Parallax Drawer',
    routeName: 'ParallaxDrawer',
  },
];

class Row extends React.PureComponent {
  static contextType = ThemeContext;

  render() {
    let { item, navigation } = this.props;

    return (
      <List.Item
        title={item.title}
        onPress={() => navigation.navigate(item.routeName)}
        style={{ backgroundColor: ThemeColors[this.context].bodyContent }}
        titleStyle={{ color: ThemeColors[this.context].label }}
      />
    );
  }
}

class Home extends React.Component {
  static contextType = ThemeContext;

  static navigationOptions = {
    title: 'Examples',
  };

  _keyExtractor = item => item.routeName;
  _renderItem = ({ item }) => {
    return <Row item={item} navigation={this.props.navigation} />;
  };

  render() {
    return (
      <>
        <Themed.StatusBar />
        <FlatList
          ItemSeparatorComponent={Divider}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          data={data}
        />
      </>
    );
  }
}

const MainNavigator = createStackNavigator(
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
    headerMode: 'none',
    mode: 'modal',
    defaultNavigationOptions: {
      gesturesEnabled: false,
    },
  }
);

const Navigation = createAppContainer(MainNavigator);

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

export default App;
