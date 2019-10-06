import * as React from 'react';
import { View, TextInput, ActivityIndicator, StyleSheet } from 'react-native';
import { Title, Button } from 'react-native-paper';
import { ParamListBase } from '@react-navigation/core';
import {
  createStackNavigator,
  HeaderBackButton,
  StackNavigationProp,
} from '@react-navigation/stack';

type AuthStackParams = {
  splash: undefined;
  home: undefined;
  'sign-in': undefined;
};

const SplashScreen = () => {
  return (
    <View style={styles.content}>
      <ActivityIndicator />
    </View>
  );
};

const SignInScreen = ({
  setUserToken,
}: {
  setUserToken: (token: string) => void;
}) => {
  return (
    <View style={styles.content}>
      <TextInput placeholder="Username" style={styles.input} />
      <TextInput placeholder="Password" secureTextEntry style={styles.input} />
      <Button
        mode="contained"
        onPress={() => setUserToken('token')}
        style={styles.button}
      >
        Sign in
      </Button>
    </View>
  );
};

const HomeScreen = ({
  setUserToken,
}: {
  setUserToken: (token: undefined) => void;
}) => {
  return (
    <View style={styles.content}>
      <Title style={styles.text}>Signed in successfully 🎉</Title>
      <Button onPress={() => setUserToken(undefined)} style={styles.button}>
        Sign out
      </Button>
    </View>
  );
};

const SimpleStack = createStackNavigator<AuthStackParams>();

type Props = {
  navigation: StackNavigationProp<ParamListBase>;
};

export default function SimpleStackScreen({ navigation }: Props) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [userToken, setUserToken] = React.useState<string | undefined>(
    undefined
  );

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);

    return () => clearTimeout(timer);
  }, []);

  navigation.setOptions({
    headerShown: false,
  });

  return (
    <SimpleStack.Navigator
      screenOptions={{
        headerLeft: () => (
          <HeaderBackButton onPress={() => navigation.goBack()} />
        ),
      }}
    >
      {isLoading ? (
        <SimpleStack.Screen
          name="splash"
          component={SplashScreen}
          options={{ title: `Auth Flow` }}
        />
      ) : userToken === undefined ? (
        <SimpleStack.Screen name="sign-in" options={{ title: `Sign in` }}>
          {() => <SignInScreen setUserToken={setUserToken} />}
        </SimpleStack.Screen>
      ) : (
        <SimpleStack.Screen name="home" options={{ title: 'Home' }}>
          {() => <HomeScreen setUserToken={setUserToken} />}
        </SimpleStack.Screen>
      )}
    </SimpleStack.Navigator>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  input: {
    margin: 8,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  button: {
    margin: 8,
  },
  text: {
    textAlign: 'center',
    margin: 8,
  },
});
