import { Button, Text } from '@react-navigation/elements';
import {
  type NavigatorScreenParams,
  type PathConfig,
  useNavigation,
  useNavigationState,
} from '@react-navigation/native';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import {
  createMyStackNavigator,
  type MyStackScreenProps,
} from './createMyStackNavigator';

type MyStackParamList = {
  StandardDynamicHome: undefined;
  StandardDynamicProfile: { user: string };
  StandardDynamicDetails: { section: string };
};

const linking = {
  screens: {
    StandardDynamicHome: 'standard-dynamic-home',
    StandardDynamicProfile: 'standard-dynamic-profile/:user',
    StandardDynamicDetails: 'standard-dynamic-details/:section',
  },
} satisfies PathConfig<NavigatorScreenParams<MyStackParamList>>;

const MyStack = createMyStackNavigator<MyStackParamList>();

function HomeScreen() {
  const navigation = useNavigation<typeof MyStack>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dynamic home</Text>
      <Button
        variant="filled"
        onPress={() =>
          navigation.navigate('StandardDynamicProfile', { user: 'jane' })
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

function ProfileScreen({
  route,
}: MyStackScreenProps<MyStackParamList, 'StandardDynamicProfile'>) {
  const navigation = useNavigation<typeof MyStack>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{route.params.user}</Text>
      <View style={styles.buttons}>
        <Button
          variant="filled"
          onPress={() =>
            navigation.navigate('StandardDynamicDetails', {
              section: 'settings',
            })
          }
        >
          Open details
        </Button>
        <Button
          variant="tinted"
          onPress={() =>
            navigation.preload('StandardDynamicDetails', {
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

function DetailsScreen({
  route,
}: MyStackScreenProps<MyStackParamList, 'StandardDynamicDetails'>) {
  const navigation = useNavigation<typeof MyStack>();

  const isPreloaded = useNavigationState((state) =>
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

export function MyStackDynamic() {
  return (
    <MyStack.Navigator
      screenListeners={{
        rightButtonPress: (event) => {
          alert(`Right button pressed (${event.data.count})`);
        },
      }}
    >
      <MyStack.Screen
        name="StandardDynamicHome"
        component={HomeScreen}
        options={{ title: 'Home', rightButtonTitle: '🌟' }}
      />
      <MyStack.Screen
        name="StandardDynamicProfile"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
      <MyStack.Screen
        name="StandardDynamicDetails"
        component={DetailsScreen}
        options={{ title: 'Details', rightButtonTitle: '🎨' }}
      />
    </MyStack.Navigator>
  );
}

MyStackDynamic.title = 'Standard Navigation - Dynamic';
MyStackDynamic.linking = linking;

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
