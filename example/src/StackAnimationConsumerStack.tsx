import * as React from 'react';
import { Animated, Button, View } from 'react-native';
import {
  createStackNavigator,
  NavigationStackScreenProps,
  CardAnimationContext,
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
      onPress={() => props.navigation.navigate('Index')}
    />
  </View>
);

const AnotherScreen = () => (
  <CardAnimationContext.Consumer>
    {value => {
      const scale = value
        ? value.current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0.25, 1],
          })
        : 1;

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
            style={{
              fontSize: 32,
              opacity: value ? value.current.progress : 1,
              transform: [{ scale }],
            }}
          >
            Animates on progress
          </Animated.Text>
        </View>
      );
    }}
  </CardAnimationContext.Consumer>
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
    <CardAnimationContext.Consumer>
      {value => (
        <Animated.Text
          style={{
            fontSize: 24,
            opacity: value
              ? value.swiping.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0],
                })
              : 1,
          }}
        >
          Disappears when swiping
        </Animated.Text>
      )}
    </CardAnimationContext.Consumer>
    <CardAnimationContext.Consumer>
      {value => (
        <Animated.Text
          style={{
            fontSize: 24,
            opacity: value
              ? value.closing.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0],
                })
              : 1,
          }}
        >
          Disappears only when closing
        </Animated.Text>
      )}
    </CardAnimationContext.Consumer>
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
