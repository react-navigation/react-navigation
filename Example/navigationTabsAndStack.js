import * as React from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { useScreens } from 'react-native-screens';
import {
  createAppContainer,
  createStackNavigator,
  createBottomTabNavigator,
} from 'react-navigation';

useScreens();

class DetailsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Details screen #' + navigation.getParam('index', '0'),
    };
  };
  render() {
    const index = this.props.navigation.getParam('index', 0);
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button
          title={'More details ' + index}
          onPress={() =>
            this.props.navigation.push('Details', {
              index: index + 1,
            })
          }
        />
      </View>
    );
  }
}

const Scenes = {
  A: createStackNavigator({ DetailsScreen }),
  B: createStackNavigator({ DetailsScreen }),
  C: createStackNavigator({ DetailsScreen }),
  D: createStackNavigator({ DetailsScreen }),
};

export default createAppContainer(createBottomTabNavigator(Scenes, {}));
