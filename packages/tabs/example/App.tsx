import * as React from 'react';
import { registerRootComponent } from 'expo';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import {
  Assets as StackAssets,
  createStackNavigator,
  NavigationStackScreenProps,
} from 'react-navigation-stack';
import {
  Themed,
  createAppContainer,
  ThemeColors,
  useTheme,
} from 'react-navigation';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Asset } from 'expo-asset';

import BottomTabs from './src/BottomTabs';
import MaterialTopTabs from './src/MaterialTopTabs';

// Load the back button etc
Asset.loadAsync(StackAssets);

const Home = (props: NavigationStackScreenProps) => {
  let theme = useTheme();

  return (
    <View>
      <TouchableOpacity
        activeOpacity={0.8}
        style={theme === 'dark' ? styles.itemDark : styles.itemLight}
        onPress={() => props.navigation.push('BottomTabs')}
      >
        <Themed.Text>Bottom tabs</Themed.Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.8}
        style={theme === 'dark' ? styles.itemDark : styles.itemLight}
        onPress={() => props.navigation.push('MaterialTopTabs')}
      >
        <Themed.Text>Material top tabs</Themed.Text>
      </TouchableOpacity>
      <Themed.StatusBar />
    </View>
  );
};

const List = createStackNavigator({
  Home: {
    screen: Home,
    navigationOptions: { title: 'Examples' },
  },
  BottomTabs: {
    screen: BottomTabs,
    navigationOptions: { title: 'Bottom tabs' },
  },
  MaterialTopTabs: {
    screen: MaterialTopTabs,
    navigationOptions: { title: 'Material top tabs' },
  },
});

const Navigation = createAppContainer(List);

const App = () => {
  let [theme, setTheme] = React.useState<'light' | 'dark'>('light');

  return (
    <View style={styles.container}>
      <Navigation theme={theme} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: ThemeColors[theme].bodyContent,
              borderColor: ThemeColors[theme].bodyBorder,
              shadowColor: ThemeColors[theme].label,
            },
          ]}
          onPress={() => {
            setTheme(theme === 'light' ? 'dark' : 'light');
          }}
        >
          <MaterialCommunityIcons
            name="theme-light-dark"
            size={30}
            color={ThemeColors[theme].label}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute' as const,
    bottom: 60,
    right: 20,
  },
  button: {
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 2,
    borderRadius: 25,
    width: 50,
    height: 50,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    elevation: 5,
    borderWidth: 1,
  },
  itemLight: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  itemDark: {
    padding: 16,
    backgroundColor: ThemeColors.dark.bodyContent,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: ThemeColors.dark.bodyBorder,
  },
};

// @ts-ignore
registerRootComponent(App);
