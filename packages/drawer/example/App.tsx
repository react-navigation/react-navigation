import * as React from 'react';
import { View, TouchableOpacity, FlatList } from 'react-native';
import {
  ThemeContext,
  ThemeColors,
  Themed,
  createAppContainer,
  SupportedThemes,
} from 'react-navigation';
import {
  createStackNavigator,
  NavigationStackOptions,
  NavigationStackProp,
  NavigationStackScreenProps,
} from 'react-navigation-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { List, Divider } from 'react-native-paper';

import { SimpleDrawer, SimpleDrawerUnmountInactive } from './src/SimpleDrawer';
import { ParallaxDrawer } from './src/ParallaxDrawer';
import StyledDrawer from './src/StyledDrawer';
import GestureInteraction from './src/GestureInteraction';
import RTLDrawer from './src/RTLDrawer';

type Item = {
  component: React.ComponentType;
  title: string;
  routeName: string;
};

const data: Item[] = [
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

class Row extends React.PureComponent<{
  navigation: NavigationStackProp;
  item: Item;
}> {
  static contextType = ThemeContext;

  context: SupportedThemes = 'light';

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

class Home extends React.Component<NavigationStackScreenProps> {
  static contextType = ThemeContext;

  static navigationOptions = {
    title: 'Examples',
  };

  _keyExtractor = (item: Item) => item.routeName;

  _renderItem = ({ item }: { item: Item }) => {
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
    ...data.reduce<{
      [key: string]: {
        screen: React.ComponentType<any>;
        navigationOptions: NavigationStackOptions;
      };
    }>((acc, it) => {
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
  let [theme, setTheme] = React.useState<SupportedThemes>('light');

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
