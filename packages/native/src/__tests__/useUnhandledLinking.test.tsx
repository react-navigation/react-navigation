import { expect, test } from '@jest/globals';
import {
  createNavigatorFactory,
  type NavigationListBase,
  type ParamListBase,
  type StackNavigationState,
  StackRouter,
  type TypedNavigator,
  useNavigationBuilder,
} from '@react-navigation/core';
import { act, fireEvent, render } from '@testing-library/react-native';
import * as React from 'react';
import { Button, Text } from 'react-native';

import { NavigationContainer } from '../NavigationContainer';
import { UNSTABLE_useUnhandledLinking } from '../useUnhandledLinking';

const StackNavigator = (props: any) => {
  const { state, descriptors, NavigationContent } = useNavigationBuilder(
    StackRouter,
    props
  );

  return (
    <NavigationContent>
      {state.routes.map((route) => (
        <div key={route.key}>{descriptors[route.key].render()}</div>
      ))}
    </NavigationContent>
  );
};

function createTestNavigator<
  ParamList extends ParamListBase,
>(): TypedNavigator<{
  ParamList: ParamList;
  NavigatorID: string | undefined;
  State: StackNavigationState<ParamList>;
  ScreenOptions: {};
  EventMap: {};
  NavigationList: NavigationListBase<ParamList>;
  Navigator: typeof StackNavigator;
}> {
  return createNavigatorFactory(StackNavigator)();
}

test('schedules a state to be handled on conditional linking', async () => {
  const Stack = createTestNavigator();

  const TestScreen = ({ route, signOut }: any) => (
    <>
      <Text>{route.name}</Text>
      <Button title="sign out" onPress={signOut} />
    </>
  );
  const SignInScreen = ({ route, signIn }: any) => {
    return (
      <>
        <Text>{route.name}</Text>
        <Button title="sign in" onPress={signIn} />
      </>
    );
  };

  const linking = {
    prefixes: ['rn://'],
    config: {
      screens: {
        Home: 'home',
        Profile: 'profile',
      },
    },
    getInitialURL() {
      return 'rn://profile';
    },
  };

  const StackNavigator = () => {
    const [isSignedIn, setSignedIn] = React.useState(false);
    const { getStateForRouteNamesChange } = UNSTABLE_useUnhandledLinking();

    return (
      <Stack.Navigator
        UNSTABLE_getStateForRouteNamesChange={getStateForRouteNamesChange}
      >
        {isSignedIn ? (
          <>
            <Stack.Screen name="Home">
              {(props) => (
                <TestScreen
                  signOut={() => act(() => setSignedIn(false))}
                  {...props}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="Profile">
              {(props) => (
                <TestScreen
                  signOut={() => act(() => setSignedIn(false))}
                  {...props}
                />
              )}
            </Stack.Screen>
          </>
        ) : (
          <Stack.Screen name="SignIn">
            {(props) => (
              <SignInScreen signIn={() => setSignedIn(true)} {...props} />
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    );
  };
  const App = () => {
    return (
      <NavigationContainer linking={linking}>
        <StackNavigator />
      </NavigationContainer>
    );
  };

  const { queryByText, getByText } = render(<App />);

  expect(queryByText('SignIn')).not.toBeNull();

  fireEvent.press(getByText(/sign in/i));

  expect(queryByText('SignIn')).toBeNull();

  expect(queryByText('Profile')).not.toBeNull();

  fireEvent.press(getByText(/sign out/i));

  expect(queryByText('SignIn')).not.toBeNull();
  expect(queryByText('Home')).toBeNull();
  expect(queryByText('Profile')).toBeNull();
  fireEvent.press(getByText(/sign in/i));
  expect(queryByText('Home')).not.toBeNull();
});

test('schedules a state to be handled on conditional linking under nested navigator', async () => {
  const OuterStack = createTestNavigator();
  const Stack = createTestNavigator();

  const TestScreen = ({ route, signOut }: any) => (
    <>
      <Text>{route.name}</Text>
      <Button title="sign out" onPress={signOut} />
    </>
  );
  const SignInScreen = ({ route, signIn }: any) => {
    return (
      <>
        <Text>{route.name}</Text>
        <Button title="sign in" onPress={signIn} />
      </>
    );
  };

  const linking = {
    prefixes: ['rn://'],
    config: {
      screens: {
        Outer: {
          path: 'outer',
          screens: {
            Home: 'home',
            Profile: 'profile',
            Outer: 'outer',
          },
        },
      },
    },
    getInitialURL() {
      return 'rn://outer/profile';
    },
  };

  const InnerStackNavigator = () => {
    const { getStateForRouteNamesChange } = UNSTABLE_useUnhandledLinking();
    const [isSignedIn, setSignedIn] = React.useState(false);
    return (
      <Stack.Navigator
        UNSTABLE_getStateForRouteNamesChange={getStateForRouteNamesChange}
      >
        {isSignedIn ? (
          <>
            <Stack.Screen name="Home">
              {(props) => (
                <TestScreen
                  signOut={() => act(() => setSignedIn(false))}
                  {...props}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="Profile">
              {(props) => (
                <TestScreen
                  signOut={() => act(() => setSignedIn(false))}
                  {...props}
                />
              )}
            </Stack.Screen>
          </>
        ) : (
          <Stack.Screen name="SignIn">
            {(props) => (
              <SignInScreen
                signIn={() => act(() => setSignedIn(true))}
                {...props}
              />
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    );
  };

  const App = () => {
    return (
      <NavigationContainer linking={linking}>
        <OuterStack.Navigator>
          <OuterStack.Screen name="Outer" component={InnerStackNavigator} />
        </OuterStack.Navigator>
      </NavigationContainer>
    );
  };

  const { queryByText, getByText } = render(<App />);

  expect(queryByText('SignIn')).not.toBeNull();

  fireEvent.press(getByText(/sign in/i));

  expect(queryByText('SignIn')).toBeNull();

  expect(queryByText('Profile')).not.toBeNull();
});

test('schedules a state to be handled on conditional linking in nested stack', async () => {
  const Stack = createTestNavigator();
  const NestedStack = createTestNavigator();

  const TestScreen = ({ route, signOut }: any) => (
    <>
      <Text>{route.name}</Text>
      <Button title="sign out" onPress={signOut} />
    </>
  );
  const SignInScreen = ({ route, signIn }: any) => {
    return (
      <>
        <Text>{route.name}</Text>
        <Button title="sign in" onPress={signIn} />
      </>
    );
  };

  const linking = {
    prefixes: ['rn://'],
    config: {
      screens: {
        Home: {
          path: 'home',
          screens: {
            Profile: 'profile',
          },
        },
      },
    },
    getInitialURL() {
      return 'rn://home/profile';
    },
  };

  const StackNavigation = () => {
    const [isSignedIn, setSignedIn] = React.useState(false);
    const { getStateForRouteNamesChange } = UNSTABLE_useUnhandledLinking();

    return (
      <Stack.Navigator
        UNSTABLE_getStateForRouteNamesChange={getStateForRouteNamesChange}
      >
        {isSignedIn ? (
          <Stack.Screen name="Home">
            {() => (
              <NestedStack.Navigator>
                <NestedStack.Screen name="Details">
                  {(props) => (
                    <TestScreen
                      signOut={() => act(() => setSignedIn(false))}
                      {...props}
                    />
                  )}
                </NestedStack.Screen>
                <NestedStack.Screen name="Profile">
                  {(props) => (
                    <TestScreen
                      signOut={() => act(() => setSignedIn(false))}
                      {...props}
                    />
                  )}
                </NestedStack.Screen>
              </NestedStack.Navigator>
            )}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="SignIn">
            {(props) => (
              <SignInScreen
                signIn={() => act(() => setSignedIn(true))}
                {...props}
              />
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    );
  };

  const App = () => {
    return (
      <NavigationContainer linking={linking}>
        <StackNavigation />
      </NavigationContainer>
    );
  };

  const { queryByText, getByText } = await render(<App />);

  expect(queryByText('SignIn')).not.toBeNull();

  fireEvent.press(getByText(/sign in/i));

  expect(queryByText('SignIn')).toBeNull();
  expect(queryByText('Profile')).not.toBeNull();

  fireEvent.press(getByText(/sign out/i));

  expect(queryByText('SignIn')).not.toBeNull();
  expect(queryByText('Details')).toBeNull();
  expect(queryByText('Profile')).toBeNull();

  fireEvent.press(getByText(/sign in/i));

  expect(queryByText('Details')).not.toBeNull();
});

test('clears lastUnhandledLink upon successful linking handling', () => {
  const linking = {
    prefixes: ['rn://'],
    config: {
      screens: {
        Home: {
          path: 'home',
          screens: {
            Profile: 'profile',
          },
        },
      },
    },
    getInitialURL() {
      return 'rn://home/profile';
    },
  };

  const ProfileScreen = (): any => {
    const { lastUnhandledLink } = UNSTABLE_useUnhandledLinking();
    return lastUnhandledLink;
  };

  const InnerStack = createTestNavigator();
  const Stack = createTestNavigator();

  const InnerStackNavigator = () => {
    const { getStateForRouteNamesChange } = UNSTABLE_useUnhandledLinking();
    return (
      <InnerStack.Navigator
        UNSTABLE_getStateForRouteNamesChange={getStateForRouteNamesChange}
      >
        <InnerStack.Screen name="Profile0">{() => null}</InnerStack.Screen>
        <InnerStack.Screen name="Profile" component={ProfileScreen} />
      </InnerStack.Navigator>
    );
  };

  const App = () => {
    return (
      <NavigationContainer linking={linking}>
        <Stack.Navigator>
          <Stack.Screen name="Home0">{() => null}</Stack.Screen>
          <Stack.Screen name="Home" component={InnerStackNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  };

  const { queryByText } = render(<App />);
  expect(queryByText('home/profile')).toBeNull();
});

test('clears lastUnhandledLink upon calling clearUnhandledLink', async () => {
  const Stack = createTestNavigator();

  const LinkDisplayScreen = (): any => {
    const { lastUnhandledLink, clearUnhandledLink } =
      UNSTABLE_useUnhandledLinking();

    return (
      <>
        <Text>{lastUnhandledLink}</Text>
        <Button
          title="clear"
          onPress={() => {
            clearUnhandledLink();
          }}
        />
      </>
    );
  };

  const linking = {
    prefixes: ['rn://'],
    config: {
      screens: {
        Home: 'home',
        Profile: 'profile',
      },
    },
    getInitialURL() {
      return 'rn://profile';
    },
  };

  const App = () => {
    return (
      <NavigationContainer linking={linking}>
        <Stack.Navigator>
          <Stack.Screen name="LinkDisplay" component={LinkDisplayScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  };

  const { queryByText, getByText } = render(<App />);

  expect(queryByText('profile')).not.toBeNull();

  fireEvent.press(getByText(/clear/i));

  expect(queryByText('profile')).toBeNull();
});
