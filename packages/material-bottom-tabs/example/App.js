import * as React from 'react';
import Expo from 'expo';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import MaterialBottomTabs from './src/MaterialBottomTabs';

class Home extends React.Component {
  static navigationOptions = {
    title: 'Examples'
  };

  render() {
    return (
      <View>
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
