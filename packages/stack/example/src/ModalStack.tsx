import * as React from 'react';
import {
  Button,
  View,
  Text,
  Dimensions,
  Switch,
  TextInput,
} from 'react-native';
import {
  createStackNavigator,
  CardStyleInterpolators,
  NavigationStackScreenProps,
  StackCardStyleInterpolator,
} from 'react-navigation-stack';

const gestureResponseDistance = {
  vertical: Dimensions.get('window').height,
};

const forVerticalInvertedIOS: StackCardStyleInterpolator = ({
  current: { progress },
  layouts: { screen },
}) => {
  const translateY = progress.interpolate({
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
};

class Modal extends React.Component<NavigationStackScreenProps> {
  static navigationOptions = ({ navigation }: NavigationStackScreenProps) => {
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

class ListScreen extends React.Component<
  NavigationStackScreenProps,
  { isInverted: boolean }
> {
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

class DetailsScreen extends React.Component<NavigationStackScreenProps> {
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
          title="Go to inputs..."
          onPress={() => this.props.navigation.push('Inputs')}
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
function InputsScreen({ navigation }: NavigationStackScreenProps) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Inputs Screen</Text>
      <TextInput
        defaultValue="sample"
        autoFocus
        style={{ backgroundColor: 'blue' }}
      />
      <TextInput defaultValue="sample" style={{ backgroundColor: 'red' }} />
      <TextInput defaultValue="sample" style={{ backgroundColor: 'green' }} />
      <Button
        title="Go to inputs... again"
        onPress={() => navigation.push('Inputs')}
      />
    </View>
  );
}

export default createStackNavigator(
  {
    List: ListScreen,
    Details: DetailsScreen,
    Modal: Modal,
    Inputs: {
      screen: InputsScreen,
      navigationOptions: { gestureDirection: 'vertical' },
    },
  },
  {
    initialRouteName: 'List',
    mode: 'modal',
  }
);
