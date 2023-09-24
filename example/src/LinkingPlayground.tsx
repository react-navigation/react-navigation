import {
  NavigationContainer,
  useDeferredLinking,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createURL } from 'expo-linking';
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

const HomeScreen = ({ navigation }: any) => (
  <View style={styles.container}>
    <Text style={{ ...styles.text, ...{ color: 'teal' } }}>Home Screen</Text>
    <Button
      onPress={() => navigation.navigate('Profile')}
      title="Go to profile"
    />
  </View>
);

const DetailsScreen = ({ route }: any) => {
  const {
    params: { message },
  } = route;

  return (
    <View style={styles.container}>
      {message && <Text style={styles.text}>Message: {message}</Text>}
    </View>
  );
};

const ProfileScreen = ({ navigation }: any) => (
  <View style={styles.container}>
    <Text style={{ ...styles.text, ...{ color: 'indianred' } }}>
      Profile Screen
    </Text>
    <Button onPress={() => navigation.popTo('Home')} title="Go back to home" />
  </View>
);

const SignInScreen = ({ signIn }: any) => {
  const scheduleNext = useDeferredLinking();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>SignIn Screen</Text>
      <Button
        onPress={() => {
          scheduleNext();
          signIn();
        }}
        title="Sign In"
      />
    </View>
  );
};

const Stack = createStackNavigator();
const OuterStack = createStackNavigator();

const config = {
  screens: {
    Outer: {
      path: 'outer',
      screens: {
        Home: 'home',
        Details: {
          path: 'details/:message',
          parse: {
            message: (message: string) => `${message}`,
          },
        },
        Profile: 'profile',
      },
    },
  },
};

const linking = {
  prefixes: [createURL('/')],
  config,
  // async getInitialURL() {
  //   return `${createURL('/')}profile`;
  // },
};

export function LinkingPlayground() {
  const [isSignedIn, setSignedIn] = React.useState(false);
  return (
    <NavigationContainer linking={linking}>
      <OuterStack.Navigator>
        <OuterStack.Screen name="Outer">
          {() => (
            <Stack.Navigator>
              {isSignedIn ? (
                <Stack.Group
                  screenOptions={{
                    headerRight: () => (
                      <Button
                        onPress={() => setSignedIn(false)}
                        title="Sign Out"
                      />
                    ),
                  }}
                >
                  <Stack.Screen name="Home" component={HomeScreen} />
                  <Stack.Screen name="Details" component={DetailsScreen} />
                  <Stack.Screen name="Profile" component={ProfileScreen} />
                </Stack.Group>
              ) : (
                <Stack.Screen
                  name="SignIn"
                  options={{
                    animationTypeForReplace: !isSignedIn ? 'pop' : 'push',
                  }}
                >
                  {() => <SignInScreen signIn={() => setSignedIn(true)} />}
                </Stack.Screen>
              )}
            </Stack.Navigator>
          )}
        </OuterStack.Screen>
      </OuterStack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
