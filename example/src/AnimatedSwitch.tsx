import * as React from 'react';
import { Text, View, Button, StyleSheet } from 'react-native';
import createAnimatedSwitchNavigator, {
  NavigationAnimatedSwitchProp,
} from 'react-navigation-animated-switch';
import { Transition } from 'react-native-reanimated';

function Home({ navigation }: { navigation: NavigationAnimatedSwitchProp }) {
  return (
    <View style={styles.content}>
      <Text>Home screen</Text>
      <Button
        title="Go to settings"
        onPress={() => navigation.navigate('Settings')}
      />
    </View>
  );
}

function Settings({
  navigation,
}: {
  navigation: NavigationAnimatedSwitchProp;
}) {
  return (
    <View style={styles.content}>
      <Text>Settings screen</Text>
      <Button title="Go to home" onPress={() => navigation.navigate('Home')} />
      <Button
        title="Go back to examples"
        onPress={() => navigation.navigate('Index')}
      />
    </View>
  );
}

const MySwitch = createAnimatedSwitchNavigator(
  {
    Home,
    Settings,
  },
  {
    transition: (
      <Transition.Together>
        <Transition.Out
          type="slide-bottom"
          durationMs={400}
          interpolation="easeIn"
        />
        <Transition.In type="fade" durationMs={500} />
      </Transition.Together>
    ),
  }
);

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MySwitch;
