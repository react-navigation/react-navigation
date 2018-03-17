import * as React from 'react';
import Expo from 'expo';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import BottomTabs from './src/BottomTabs';
import MaterialTopTabs from './src/MaterialTopTabs';
import MaterialBottomTabs from './src/MaterialBottomTabs';

class Home extends React.Component {
  render() {
    return (
      <View>
        <TouchableOpacity
          style={styles.item}
          onPress={() => this.props.navigation.push('BottomTabs')}
        >
          <Text>Bottom tabs</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.item}
          onPress={() => this.props.navigation.push('MaterialTopTabs')}
        >
          <Text>Material top tabs</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.item}
          onPress={() => this.props.navigation.push('MaterialBottomTabs')}
        >
          <Text>Material bottom tabs</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const App = createStackNavigator({
  Home,
  BottomTabs,
  MaterialTopTabs,
  MaterialBottomTabs,
});

const styles = {
  item: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
};

Expo.registerRootComponent(App);
