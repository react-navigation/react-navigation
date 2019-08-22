import * as React from 'react';
import { Button, View, Text, Dimensions, Switch } from 'react-native';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from 'react-navigation-stack';
import Animated from 'react-native-reanimated';

const { interpolate } = Animated;

const gestureResponseDistance = {
  vertical: Dimensions.get('window').height,
};

function forVerticalInvertedIOS({
  progress: { current },
  layouts: { screen },
}) {
  const translateY = interpolate(current, {
    inputRange: [0, 1],
    outputRange: [-screen.height, 0],
  });

  return {
    cardStyle: {
      transform: [
        // Translation for the animation of the current card
        { translateY },
      ],
    },
  };
}

class Modal extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Modal',
      cardStyleInterpolator:
        navigation.getParam('gestureDirection', 'vertical') ===
        'vertical-inverted'
          ? forVerticalInvertedIOS
          : CardStyleInterpolators.forVerticalIOS,
      gestureDirection: navigation.getParam('gestureDirection', 'vertical'),
      cardTransparent: true,
      gestureResponseDistance,
    };
  };

  render() {
    return (
      <View
        style={{
          backgroundColor: 'white',
          paddingVertical: 20,
          paddingHorizontal: 20,
          height: Dimensions.get('screen').height,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
        }}
      />
    );
  }
}

class ListScreen extends React.Component {
  static navigationOptions = {
    title: 'My Modal',
  };

  state = { isInverted: false };

  onSwitch = () =>
    this.setState(prevState => ({ isInverted: !prevState.isInverted }));

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>List Screen</Text>
        <Text>A list may go here</Text>
        <Button
          title="Go to Details"
          onPress={() => this.props.navigation.navigate('Details')}
        />
        <Button
          title="Go back to all examples"
          onPress={() => this.props.navigation.navigate('Home')}
        />
        <Text>Invert modal gesture direction:</Text>
        <Switch
          style={{ margin: 10 }}
          onValueChange={this.onSwitch}
          value={this.state.isInverted}
        />
        <Button
          title="Show Modal"
          onPress={() =>
            this.props.navigation.push('Modal', {
              gestureDirection: this.state.isInverted
                ? 'vertical-inverted'
                : 'vertical',
            })
          }
        />
      </View>
    );
  }
}

class DetailsScreen extends React.Component {
  static navigationOptions = {
    // Uncomment below to test inverted modal gesture
    // gestureDirection: 'inverted',
  };

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Details Screen</Text>
        <Button
          title="Go to Details... again"
          onPress={() => this.props.navigation.push('Details')}
        />
        <Button
          title="Go to List"
          onPress={() => this.props.navigation.navigate('List')}
        />
        <Button
          title="Go back"
          onPress={() => this.props.navigation.goBack()}
        />
        <Button
          title="Go back to all examples"
          onPress={() => this.props.navigation.navigate('Home')}
        />
      </View>
    );
  }
}

export default createStackNavigator(
  {
    List: ListScreen,
    Details: DetailsScreen,
    Modal: Modal,
  },
  {
    initialRouteName: 'List',
    mode: 'modal',
  }
);
