import { Button, Text } from '@react-navigation/elements';
import { useNavigation, useTheme } from '@react-navigation/native';
import {
  createStackNavigator,
  createStackScreen,
} from '@react-navigation/stack';
import * as React from 'react';
import { ActivityIndicator, StyleSheet, TextInput, View } from 'react-native';

const AUTH_CONTEXT_ERROR =
  'Authentication context not found. Have your wrapped your components with AuthContext.Consumer?';

const AuthContext = React.createContext<{
  isSignedIn: boolean;
  signIn: () => void;
  signOut: () => void;
}>({
  isSignedIn: false,
  signIn: () => {
    throw new Error(AUTH_CONTEXT_ERROR);
  },
  signOut: () => {
    throw new Error(AUTH_CONTEXT_ERROR);
  },
});

const useIsSignedIn = () => {
  const { isSignedIn } = React.use(AuthContext);
  return isSignedIn;
};

const useIsSignedOut = () => {
  const { isSignedIn } = React.use(AuthContext);
  return !isSignedIn;
};

const SplashScreen = () => {
  const { colors } = useTheme();

  return (
    <View style={styles.content}>
      <ActivityIndicator color={colors?.primary} />
    </View>
  );
};

const SignInScreen = () => {
  const navigation = useNavigation('SignIn');
  const { signIn } = React.use(AuthContext);
  const { colors } = useTheme();

  return (
    <View style={styles.content}>
      <TextInput
        placeholder="Username"
        style={[
          styles.input,
          { backgroundColor: colors?.card, color: colors?.text },
        ]}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        style={[
          styles.input,
          { backgroundColor: colors?.card, color: colors?.text },
        ]}
      />
      <Button variant="filled" onPress={signIn} style={styles.button}>
        Sign in
      </Button>
      <Button onPress={() => navigation.navigate('Chat')} style={styles.button}>
        Go to Chat
      </Button>
    </View>
  );
};

const HomeScreen = () => {
  const navigation = useNavigation('Main');
  const { signOut } = React.use(AuthContext);

  return (
    <View style={styles.content}>
      <Text style={styles.heading}>Signed in successfully 🎉</Text>
      <Button onPress={signOut} style={styles.button}>
        Sign out
      </Button>
      <Button onPress={() => navigation.navigate('Chat')} style={styles.button}>
        Go to Chat
      </Button>
    </View>
  );
};

const ProfileScreen = () => {
  const navigation = useNavigation('Profile');
  const { signOut } = React.use(AuthContext);

  return (
    <View style={styles.content}>
      <Text style={styles.heading}>This is your profile</Text>
      <Button onPress={signOut} style={styles.button}>
        Sign out
      </Button>
      <Button onPress={() => navigation.navigate('Chat')} style={styles.button}>
        Go to Chat
      </Button>
    </View>
  );
};

const ChatScreen = () => {
  const { isSignedIn, signIn, signOut } = React.use(AuthContext);

  return (
    <View style={styles.content}>
      <Text style={styles.heading}>What&apos;s up?</Text>
      {isSignedIn ? (
        <Button onPress={signOut} style={styles.button}>
          Sign out
        </Button>
      ) : (
        <Button onPress={signIn} style={styles.button}>
          Sign in
        </Button>
      )}
    </View>
  );
};

type State = {
  isLoading: boolean;
  isSignout: boolean;
  userToken: undefined | string;
};

type Action =
  | { type: 'RESTORE_TOKEN'; token: undefined | string }
  | { type: 'SIGN_IN'; token: string }
  | { type: 'SIGN_OUT' };

const AuthFlowNavigator = createStackNavigator({
  groups: {
    SignedIn: {
      if: useIsSignedIn,
      screens: {
        Main: createStackScreen({
          screen: HomeScreen,
          options: {
            title: 'Home',
          },
          linking: '',
        }),
        Profile: createStackScreen({
          screen: ProfileScreen,
          linking: 'profile',
        }),
        Chat: createStackScreen({
          screen: ChatScreen,
          linking: 'chat',
        }),
      },
    },
    SignedOut: {
      if: useIsSignedOut,
      screens: {
        SignIn: createStackScreen({
          screen: SignInScreen,
          options: {
            title: 'Welcome',
          },
          linking: 'signin',
        }),
        Chat: createStackScreen({
          screen: ChatScreen,
          linking: 'chat',
        }),
      },
    },
  },
}).with(({ Navigator }) => {
  const [state, dispatch] = React.useReducer(
    (prevState: State, action: Action) => {
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
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: undefined,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: undefined,
    }
  );

  React.useEffect(() => {
    const timer = setTimeout(() => {
      dispatch({ type: 'RESTORE_TOKEN', token: undefined });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const isSignedIn = state.userToken !== undefined;

  const authContext = React.useMemo(
    () => ({
      isSignedIn,
      signIn: () => dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' }),
      signOut: () => dispatch({ type: 'SIGN_OUT' }),
    }),
    [isSignedIn]
  );

  if (state.isLoading) {
    return <SplashScreen />;
  }

  return (
    <AuthContext.Provider value={authContext}>
      <Navigator
        routeNamesChangeBehavior="lastUnhandled"
        screenOptions={({ route }) => {
          if (route.name === 'SignIn') {
            return {
              animationTypeForReplace: state.isSignout ? 'pop' : 'push',
            };
          }

          return {};
        }}
      />
    </AuthContext.Provider>
  );
});

export const AuthFlow = {
  screen: AuthFlowNavigator,
  title: 'Auth Flow',
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  input: {
    margin: 8,
    padding: 10,
    borderRadius: 3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  button: {
    margin: 8,
  },
  heading: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
});
