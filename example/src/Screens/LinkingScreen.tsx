import { Button } from '@react-navigation/elements';
import { useUnhandledLinking } from '@react-navigation/native';
import {
  createStackNavigator,
  type StackScreenProps,
} from '@react-navigation/stack';
import React, { useContext } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

const info = `
\u2022 xcrun simctl openurl booted exp://127.0.0.1:19000/--/linking/profile
\u2022 adb shell am start -W -a android.intent.action.VIEW -d "exp://127.0.0.1:19000/--/linking/profile" host.exp.exponent
\u2022 http://localhost:19006/linking/profile
`.trim();

type StackParamList = {
  Home: undefined;
  Profile: undefined;
  SignIn: undefined;
};

const SigningContext = React.createContext<{
  signIn: () => void;
  signOut: () => void;
} | null>(null);

const ProfileScreen = ({
  navigation,
}: StackScreenProps<StackParamList, 'Profile'>) => {
  const { signOut } = useContext(SigningContext)!;
  return (
    <View style={styles.container}>
      <Text style={{ ...styles.text, ...{ color: 'teal' } }}>
        Profile Screen
      </Text>
      <Button onPress={() => navigation.popTo('Home')}>Go back to home</Button>
      <Button onPress={signOut}>Sign out</Button>
    </View>
  );
};

const HomeScreen = ({
  navigation,
}: StackScreenProps<StackParamList, 'Home'>) => {
  const { signOut } = useContext(SigningContext)!;
  return (
    <View style={styles.container}>
      <Text style={{ ...styles.text, ...{ color: 'indianred' } }}>
        Home Screen
      </Text>
      <Button onPress={() => navigation.popTo('Profile')}>Go to profile</Button>
      <Button onPress={signOut}>Sign out</Button>
    </View>
  );
};

const SignInScreen = () => {
  const { handleOnNextRouteNamesChange: scheduleNext } = useUnhandledLinking();
  const { signIn } = useContext(SigningContext)!;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>SignIn Screen</Text>
      <Text style={styles.smallText}>To test the example try:</Text>
      <Text style={styles.code}>{info}</Text>
      <Button
        onPress={() => {
          scheduleNext();
          signIn();
        }}
      >
        Sign in
      </Button>
    </View>
  );
};

const Stack = createStackNavigator<StackParamList>();

export function LinkingScreen() {
  const [isSignedIn, setSignedIn] = React.useState(false);
  return (
    <SigningContext.Provider
      value={{
        signOut: () => setSignedIn(false),
        signIn: () => setSignedIn(true),
      }}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isSignedIn ? (
          <Stack.Group>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </Stack.Group>
        ) : (
          <Stack.Screen
            name="SignIn"
            component={SignInScreen}
            options={{
              animationTypeForReplace: !isSignedIn ? 'pop' : 'push',
            }}
          />
        )}
      </Stack.Navigator>
    </SigningContext.Provider>
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
  smallText: {
    fontSize: 20,
    textAlign: 'left',
  },
  code: {
    fontFamily: Platform.select({ ios: 'Courier New', default: 'monospace' }),
    margin: 40,
  },
});
