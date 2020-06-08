import * as React from 'react';
import { Dimensions, Button, View, Text } from 'react-native';
import { withNavigation } from 'react-navigation';
import {
  createStackNavigator,
  NavigationStackScreenProps,
  NavigationStackProp,
} from 'react-navigation-stack';

const Buttons = withNavigation((props: { navigation: NavigationStackProp }) => (
  <React.Fragment>
    <Button
      title="Push Details"
      onPress={() => props.navigation.push('Details')}
    />
    <Button title="PopToTop" onPress={() => props.navigation.popToTop()} />
    <Button
      title="Go to Details"
      onPress={() => props.navigation.navigate('Details')}
    />
    <Button
      title="Replace with List"
      onPress={() => props.navigation.replace('List')}
    />
    <Button
      title="Go and then go to details quick"
      onPress={() => {
        props.navigation.pop();
        setTimeout(() => {
          props.navigation.navigate('Details');
        }, 100);
      }}
    />
    <Button
      title="Go to Headerless"
      onPress={() => props.navigation.navigate('Headerless')}
    />
    <Button title="Go back" onPress={() => props.navigation.goBack()} />
    <Button
      title="Go back quick"
      onPress={() => {
        props.navigation.pop();
        setTimeout(() => {
          props.navigation.pop();
        }, 100);
      }}
    />
    <Button
      title="Go back to all examples"
      onPress={() => props.navigation.navigate('Index')}
    />
  </React.Fragment>
));

class ListScreen extends React.Component {
  static navigationOptions = {
    title: 'List',
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          // backgroundColor: '#fff',
        }}
      >
        <Text>List Screen</Text>
        <Text>A list may go here</Text>
        <Buttons />
      </View>
    );
  }
}

class DetailsScreen extends React.Component<NavigationStackScreenProps> {
  static navigationOptions = {
    title: 'Details',
    gestureResponseDistance: {
      horizontal: Dimensions.get('window').width,
    },
  };

  _goBackInTwoSeconds = () => {
    setTimeout(() => {
      this.props.navigation.goBack();
    }, 2000);
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          // backgroundColor: '#fff',
        }}
      >
        <Text>Details Screen</Text>
        <Button title="Go back in 2s" onPress={this._goBackInTwoSeconds} />
        <Buttons />
      </View>
    );
  }
}

class HeaderlessScreen extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          // backgroundColor: '#fff',
        }}
      >
        <Text>Headerless Screen</Text>
        <Buttons />
      </View>
    );
  }
}

export default createStackNavigator(
  {
    List: ListScreen,
    Details: DetailsScreen,
    Headerless: HeaderlessScreen,
  },
  {
    initialRouteName: 'List',
  }
);
