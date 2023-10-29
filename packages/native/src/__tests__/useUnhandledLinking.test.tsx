import {
  createNavigatorFactory,
  NavigationProp,
  StackRouter,
  useNavigation,
  useNavigationBuilder,
} from '@react-navigation/core';
import { act, fireEvent, render } from '@testing-library/react-native';
import * as React from 'react';
import { useEffect } from 'react';
import { Button, Text } from 'react-native';

import { NavigationContainer } from '../NavigationContainer';
import { useUnhandledLinking } from '../useUnhandledLinking';

const createTestNavigator = createNavigatorFactory((props: any) => {
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
});

it('schedules a state to be handled on conditional linking', async () => {
  const Stack = createTestNavigator();

  const TestScreen = ({ route, signOut }: any) => (
    <>
      <Text>{route.name}</Text>
      <Button title="sign out" onPress={signOut} />
    </>
  );
  const SignInScreen = ({ route, signIn }: any) => {
    const { clearUnhandledLink } = useUnhandledLinking()
    return (
      <>
        <Text>{route.name}</Text>
        <Button
          title="sign in"
          onPress={signIn}
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

  const StackNavigator = () => {
    const [isSignedIn, setSignedIn] = React.useState(false);
    const { getStateForRouteNamesChange } = useUnhandledLinking();

    return (
      <Stack.Navigator
        getStateForRouteNamesChange={getStateForRouteNamesChange}
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

  const { queryByText } = render(<App />);

  expect(queryByText('SignIn')).not.toBeNull();

  fireEvent.press(queryByText(/sign in/i));

  expect(queryByText('SignIn')).toBeNull();

  expect(queryByText('Profile')).not.toBeNull();

  fireEvent.press(queryByText(/sign out/i));

  expect(queryByText('SignIn')).not.toBeNull();
  expect(queryByText('Home')).toBeNull();
  expect(queryByText('Profile')).toBeNull();
  fireEvent.press(queryByText(/sign in/i));
  expect(queryByText('Home')).not.toBeNull();
});

it('schedules a state to be handled on conditional linking under nested navigator', async () => {
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
        <Button
          title="sign in"
          onPress={signIn}
        />
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
    const { getStateForRouteNamesChange } = useUnhandledLinking();
    const [isSignedIn, setSignedIn] = React.useState(false);
    return (
      <Stack.Navigator
        getStateForRouteNamesChange={getStateForRouteNamesChange}
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

  const { queryByText } = render(<App />);

  expect(queryByText('SignIn')).not.toBeNull();

  fireEvent.press(queryByText(/sign in/i));

  expect(queryByText('SignIn')).toBeNull();

  expect(queryByText('Profile')).not.toBeNull();
});

it('schedules a state to be handled on conditional linking in nested stack', async () => {
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
        <Button
          title="sign in"
          onPress={signIn}
        />
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
    const { getStateForRouteNamesChange } = useUnhandledLinking();

    return (
      <Stack.Navigator getStateForRouteNamesChange={getStateForRouteNamesChange}>
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
    )
  }

  const App = () => {

    return (
      <NavigationContainer linking={linking}>
        <StackNavigation/>
      </NavigationContainer>
    );
  };

  const { queryByText } = await render(<App />);

  expect(queryByText('SignIn')).not.toBeNull();

  fireEvent.press(queryByText(/sign in/i));

  expect(queryByText('SignIn')).toBeNull();
  expect(queryByText('Profile')).not.toBeNull();

  fireEvent.press(queryByText(/sign out/i));

  expect(queryByText('SignIn')).not.toBeNull();
  expect(queryByText('Details')).toBeNull();
  expect(queryByText('Profile')).toBeNull();

  fireEvent.press(queryByText(/sign in/i));

  expect(queryByText('Details')).not.toBeNull();
});

it('clears lastUnhandledLinking upon successful linking handling', () => {
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

  let getUnhandledLink: (() => string | null | undefined) | undefined;
  const ProfileScreen = (): any => {
    getUnhandledLink = useUnhandledLinking().getUnhandledLink;
  };

  const InnerStack = createTestNavigator();
  const Stack = createTestNavigator();

  const InnerStackNavigator = () => {
    const { getStateForRouteNamesChange } = useUnhandledLinking();
    return (
      <InnerStack.Navigator getStateForRouteNamesChange={getStateForRouteNamesChange}>
        <InnerStack.Screen name="Profile0">
          {() => null}
        </InnerStack.Screen>
        <InnerStack.Screen name="Profile" component={ProfileScreen} />
      </InnerStack.Navigator>
    )
  }

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

  render(<App />);

  expect(getUnhandledLink!()).toBeUndefined();
});

it('clears lastUnhandledLinking upon calling clearUnhandledLink', async () => {
  const Stack = createTestNavigator();

  const TestScreen = ({ route, signOut }: any) => (
    <>
      <Text>{route.name}</Text>
      <Button title="sign out" onPress={signOut} />
    </>
  );
  const SignInScreen = ({ route, signIn }: any) => {
    const { clearUnhandledLink } = useUnhandledLinking()
    return (
      <>
        <Text>{route.name}</Text>
        <Button
          title="sign in"
          onPress={() => {
            clearUnhandledLink();
            signIn();
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

  const StackNavigator = () => {
    const [isSignedIn, setSignedIn] = React.useState(false);
    const { getStateForRouteNamesChange } = useUnhandledLinking();

    return (
      <Stack.Navigator
        getStateForRouteNamesChange={getStateForRouteNamesChange}
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

  const { queryByText } = render(<App />);

  expect(queryByText('SignIn')).not.toBeNull();

  fireEvent.press(queryByText(/sign in/i));

  expect(queryByText('SignIn')).toBeNull();

  expect(queryByText('Home')).not.toBeNull();
});

