import * as React from 'react';
import { Button, View } from 'react-native';
import Animated from 'react-native-reanimated';
import {
  createStackNavigator,
  NavigationStackScreenProps,
  StackAnimationProgressContext,
  StackAnimationIsSwipingContext,
  StackAnimationIsClosingContext,
} from 'react-navigation-stack';

const ListScreen = (props: NavigationStackScreenProps) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Button
      title="Push to another screen"
      onPress={() => props.navigation.push('Another')}
    />
    <Button
      title="Push to yet another screen"
      onPress={() => props.navigation.push('YetAnother')}
    />
    <Button
      title="Go back to all examples"
      onPress={() => props.navigation.navigate('Home')}
    />
  </View>
);

const AnotherScreen = () => (
  <StackAnimationProgressContext.Consumer>
    {progress => {
      const fontSize = Animated.interpolate(progress, {
        inputRange: [0, 1],
        outputRange: [8, 32],
      });

      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'honeydew',
          }}
        >
          <Animated.Text style={{ fontSize, opacity: progress }}>
            Animates on progress
          </Animated.Text>
        </View>
      );
    }}
  </StackAnimationProgressContext.Consumer>
);

const YetAnotherScreen = () => (
  <View
    style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'papayawhip',
    }}
  >
    <StackAnimationIsSwipingContext.Consumer>
      {isSwiping => (
        <Animated.Text
          style={{
            fontSize: 24,
            opacity: Animated.interpolate(isSwiping, {
              inputRange: [0, 1],
              outputRange: [1, 0],
            }),
          }}
        >
          Disappears when swiping
        </Animated.Text>
      )}
    </StackAnimationIsSwipingContext.Consumer>
    <StackAnimationIsClosingContext.Consumer>
      {isClosing => (
        <Animated.Text
          style={{
            fontSize: 24,
            opacity: Animated.interpolate(isClosing, {
              inputRange: [0, 1],
              outputRange: [1, 0],
            }),
          }}
        >
          Disappears only when closing
        </Animated.Text>
      )}
    </StackAnimationIsClosingContext.Consumer>
  </View>
);

export default createStackNavigator(
  {
    List: ListScreen,
    Another: AnotherScreen,
    YetAnother: YetAnotherScreen,
  },
  { initialRouteName: 'List' }
);
