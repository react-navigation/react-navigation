import * as React from 'react';
import { Button, View } from 'react-native';
import Animated from 'react-native-reanimated';
import {
  createStackNavigator,
  NavigationStackScreenProps,
  StackCardAnimationContext,
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
  <StackCardAnimationContext.Consumer>
    {value => {
      const fontSize = value
        ? Animated.interpolate(value.current.progress, {
            inputRange: [0, 1],
            outputRange: [8, 32],
          })
        : 32;

      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'honeydew',
          }}
        >
          <Animated.Text
            style={{ fontSize, opacity: value ? value.current.progress : 1 }}
          >
            Animates on progress
          </Animated.Text>
        </View>
      );
    }}
  </StackCardAnimationContext.Consumer>
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
    <StackCardAnimationContext.Consumer>
      {value => (
        <Animated.Text
          style={{
            fontSize: 24,
            opacity: value
              ? Animated.interpolate(value.swiping, {
                  inputRange: [0, 1],
                  outputRange: [1, 0],
                })
              : 1,
          }}
        >
          Disappears when swiping
        </Animated.Text>
      )}
    </StackCardAnimationContext.Consumer>
    <StackCardAnimationContext.Consumer>
      {value => (
        <Animated.Text
          style={{
            fontSize: 24,
            opacity: value
              ? Animated.interpolate(value.closing, {
                  inputRange: [0, 1],
                  outputRange: [1, 0],
                })
              : 1,
          }}
        >
          Disappears only when closing
        </Animated.Text>
      )}
    </StackCardAnimationContext.Consumer>
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
