import { Button, Text } from '@react-navigation/elements';
import {
  createPathConfigForStaticNavigation,
  type StaticParamList,
  type StaticScreenProps,
  useNavigation,
  useNavigationState,
  useRoute,
} from '@react-navigation/native';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import {
  createMyStackNavigator,
  createMyStackScreen,
  type MyStackNavigationProp,
} from './createMyStackNavigator';

type MyNavigationObject = MyStackNavigationProp<
  StaticParamList<typeof MyStack>
>;

function HomeScreen() {
  const navigation = useNavigation<MyNavigationObject>();

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

function ProfileScreen({ route }: StaticScreenProps<{ user: string }>) {
  const navigation = useNavigation<MyNavigationObject>();

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

function DetailsScreen({ route }: StaticScreenProps<{ section: string }>) {
  const navigation = useNavigation<MyNavigationObject>();
  const focusedRoute = useRoute();
  const isPreloaded = useNavigationState(
    (state) =>
      'preloadedRoutes' in state &&
      Array.isArray(state.preloadedRoutes) &&
      state.preloadedRoutes.some(
        (r) => 'key' in r && r.key === focusedRoute.key
      )
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

const Navigation = MyStack.getComponent();

export function MyStackStatic() {
  return <Navigation />;
}

MyStackStatic.title = 'Standard Navigation (Static)';
MyStackStatic.linking = createPathConfigForStaticNavigation(MyStack, {});

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
