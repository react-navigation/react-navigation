import React from 'react';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Button, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

class Screen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    tabBarLabel: navigation.getParam('title'),
    tabBarIcon: ({ tintColor }) => (
      <Feather size={25} name={navigation.getParam('icon')} color={tintColor} />
    ),
  });

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>{JSON.stringify(this.props.navigation.state.params)}</Text>
        <Button
          title="Go back"
          onPress={() => this.props.navigation.goBack(null)}
        />
      </View>
    );
  }
}

export default createBottomTabNavigator(
  {
    A: {
      screen: Screen,
      params: { title: 'First One', icon: 'activity' },
    },
    B: {
      screen: Screen,
      params: { title: 'Second One', icon: 'aperture' },
    },
  },
  {
    tabBarOptions: {
      activeTintColor: '#000',
      inactiveTintColor: '#eee',
    },
  }
);
