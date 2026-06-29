import { Button, Text } from '@react-navigation/elements';
import {
  useNavigation,
  useNavigationState,
  useRoute,
} from '@react-navigation/native';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import {
  createMyStackNavigator,
  createMyStackScreen,
} from './createMyStackNavigator';

function HomeScreen() {
  const navigation = useNavigation('StandardStaticHome');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Static home</Text>
      <Button
        variant="filled"
        onPress={() =>
          navigation.navigate('StandardStaticProfile', { user: 'jane' })
        }
      >
        Open profile
      </Button>
      <Button variant="tinted" onPress={() => navigation.goBack()}>
        Go back
      </Button>
    </View>
  );
}

function ProfileScreen() {
  const navigation = useNavigation('StandardStaticProfile');
  const route = useRoute('StandardStaticProfile');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{route.params.user}</Text>
      <View style={styles.buttons}>
        <Button
          variant="filled"
          onPress={() =>
            navigation.navigate('StandardStaticDetails', {
              section: 'settings',
            })
          }
        >
          Open details
        </Button>
        <Button
          variant="tinted"
          onPress={() =>
            navigation.preload('StandardStaticDetails', {
              section: 'preloaded details',
            })
          }
        >
          Preload details
        </Button>
      </View>
    </View>
  );
}

function DetailsScreen() {
  const navigation = useNavigation('StandardStaticDetails');
  const route = useRoute('StandardStaticDetails');

  const isPreloaded = useNavigationState('StandardStaticDetails', (state) =>
    state.routes.slice(state.index + 1).some((r) => r.key === route.key)
  );

  const [wasPreloaded, setWasPreloaded] = React.useState(isPreloaded);

  if (isPreloaded && !wasPreloaded) {
    setWasPreloaded(true);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{route.params.section}</Text>
      {wasPreloaded ? <Text>(preloaded)</Text> : null}
      <Button variant="tinted" onPress={() => navigation.popToTop()}>
        Pop to top
      </Button>
    </View>
  );
}

export const MyStack = createMyStackNavigator({
  variant: 'regular',
  screenListeners: {
    rightButtonPress: (event) => {
      alert(`Right button pressed (${event.data.count})`);
    },
  },
  screens: {
    StandardStaticHome: createMyStackScreen({
      screen: HomeScreen,
      options: { title: 'Home', rightButtonTitle: '🌟' },
      linking: 'standard-static-home',
    }),
    StandardStaticProfile: createMyStackScreen({
      screen: ProfileScreen,
      options: { title: 'Profile' },
      linking: 'standard-static-profile/:user',
    }),
    StandardStaticDetails: createMyStackScreen({
      screen: DetailsScreen,
      options: { title: 'Details', rightButtonTitle: '🎨' },
      linking: 'standard-static-details/:section',
    }),
  },
});

export const MyStackStatic = {
  screen: MyStack,
  title: 'Standard Navigation - Static',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  buttons: {
    gap: 12,
  },
});
