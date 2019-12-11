import * as React from 'react';
import { View, TextInput, ActivityIndicator, StyleSheet } from 'react-native';
import { Title, Button } from 'react-native-paper';
import { ParamListBase } from '@react-navigation/native';
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

const SignInScreen = ({ onSignIn }: { onSignIn: (token: string) => void }) => {
  return (
    <View style={styles.content}>
      <TextInput placeholder="Username" style={styles.input} />
      <TextInput placeholder="Password" secureTextEntry style={styles.input} />
      <Button
        mode="contained"
        onPress={() => onSignIn('token')}
        style={styles.button}
      >
        Sign in
      </Button>
    </View>
  );
};

const HomeScreen = ({ onSignOut }: { onSignOut: () => void }) => {
  return (
    <View style={styles.content}>
      <Title style={styles.text}>Signed in successfully 🎉</Title>
      <Button onPress={onSignOut} style={styles.button}>
        Sign out
      </Button>
    </View>
  );
};

const SimpleStack = createStackNavigator<AuthStackParams>();

type Props = {
  navigation: StackNavigationProp<ParamListBase>;
};

type State = {
  isLoading: boolean;
  userToken: undefined | string;
};

type Action =
  | { type: 'RESTORE_TOKEN'; token: undefined | string }
  | { type: 'SIGN_IN'; token: string }
  | { type: 'SIGN_OUT' };

export default function SimpleStackScreen({ navigation }: Props) {
  const [state, dispatch] = React.useReducer<React.Reducer<State, Action>>(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            userToken: undefined,
          };
      }
    },
    {
      isLoading: true,
      userToken: undefined,
    }
  );

  React.useEffect(() => {
    const timer = setTimeout(() => {
      dispatch({ type: 'RESTORE_TOKEN', token: undefined });
    }, 1000);

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
      {state.isLoading ? (
        <SimpleStack.Screen
          name="splash"
          component={SplashScreen}
          options={{ title: `Auth Flow` }}
        />
      ) : state.userToken === undefined ? (
        <SimpleStack.Screen name="sign-in" options={{ title: `Sign in` }}>
          {() => (
            <SignInScreen
              onSignIn={token => dispatch({ type: 'SIGN_IN', token })}
            />
          )}
        </SimpleStack.Screen>
      ) : (
        <SimpleStack.Screen name="home" options={{ title: 'Home' }}>
          {() => (
            <HomeScreen onSignOut={() => dispatch({ type: 'SIGN_OUT' })} />
          )}
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
