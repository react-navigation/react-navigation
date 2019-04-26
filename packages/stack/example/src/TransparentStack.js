import * as React from 'react';
import { Animated, Button, Easing, View, Text } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';

class ListScreen extends React.Component {
  render() {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
        }}
      >
        <Text>List Screen</Text>
        <Text>A list may go here</Text>
        <Button
          title="Open Dialog"
          onPress={() => this.props.navigation.navigate('ModalDialog')}
        />
        <Button
          title="Go back to all examples"
          onPress={() => this.props.navigation.navigate('Home')}
        />
      </View>
    );
  }
}

class ModalDialogScreen extends React.Component {
  render() {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
        }}
      >
        <View
          style={{
            backgroundColor: 'white',
            padding: 16,
            width: '90%',
            maxWidth: 500,
            minHeight: 300,
            borderRadius: 6,
            elevation: 6,
            shadowColor: 'black',
            shadowOpacity: 0.15,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 10,
          }}
        >
          <Text style={{ flex: 1, fontSize: 16 }}>Dialog</Text>
          <Button
            title="Close"
            onPress={() => this.props.navigation.goBack()}
          />
        </View>
      </View>
    );
  }
}

export default createStackNavigator(
  {
    List: ListScreen,
    ModalDialog: ModalDialogScreen,
  },
  {
    initialRouteName: 'List',
    transparentCard: true,
    mode: 'modal',
    headerMode: 'none',
    navigationOptions: {
      gesturesEnabled: false,
    },
    transitionConfig: () => ({
      transitionSpec: {
        duration: 300,
        easing: Easing.inOut(Easing.ease),
        timing: Animated.timing,
      },
      screenInterpolator: sceneProps => {
        const { position, scene } = sceneProps;
        const { index } = scene;

        const opacity = position.interpolate({
          inputRange: [index - 1, index],
          outputRange: [0, 1],
        });

        return { opacity };
      },
    }),
  }
);
