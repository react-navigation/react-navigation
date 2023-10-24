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
    const { handleOnNextRouteNamesChange } = useUnhandledLinking();
    return (
      <>
        <Text>{route.name}</Text>
        <Button
          title="sign in"
          onPress={() => {
            handleOnNextRouteNamesChange();
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

  const App = () => {
    const [isSignedIn, setSignedIn] = React.useState(false);

    return (
      <NavigationContainer linking={linking}>
        <Stack.Navigator>
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
    const { handleOnNextRouteNamesChange } = useUnhandledLinking();
    return (
      <>
        <Text>{route.name}</Text>
        <Button
          title="sign in"
          onPress={() => {
            handleOnNextRouteNamesChange();
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

  const App = () => {
    const [isSignedIn, setSignedIn] = React.useState(false);

    return (
      <NavigationContainer linking={linking}>
        <OuterStack.Navigator>
          <OuterStack.Screen name="Outer">
            {() => (
              <Stack.Navigator>
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
            )}
          </OuterStack.Screen>
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
    const { handleOnNextRouteNamesChange } = useUnhandledLinking();
    return (
      <>
        <Text>{route.name}</Text>
        <Button
          title="sign in"
          onPress={() => {
            handleOnNextRouteNamesChange();
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

  const App = () => {
    const [isSignedIn, setSignedIn] = React.useState(false);

    return (
      <NavigationContainer linking={linking}>
        <Stack.Navigator>
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

  const App = () => {
    const Stack = createTestNavigator();
    const InnerStack = createTestNavigator();
    return (
      <NavigationContainer linking={linking}>
        <Stack.Navigator>
          <Stack.Screen name="Home0">{() => null}</Stack.Screen>
          <Stack.Screen name="Home">
            {() => (
              <InnerStack.Navigator>
                <InnerStack.Screen name="Profile0">
                  {() => null}
                </InnerStack.Screen>
                <InnerStack.Screen name="Profile" component={ProfileScreen} />
              </InnerStack.Navigator>
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    );
  };

  render(<App />);

  expect(getUnhandledLink!()).toBeUndefined();
});

it('warns if other navigation was invoked before we handling the unhandled deeplink', async () => {
  const linking = {
    prefixes: ['rn://'],
    config: {
      screens: {
        Profile: 'profile',
      },
    },
    getInitialURL() {
      return 'rn://profile';
    },
  };

  type TestNavigatorParams = {
    SignIn: undefined;
    Home: undefined;
    Profile: undefined;
  };

  const Stack = createTestNavigator<TestNavigatorParams>();

  const TestScreen = () => {
    const navigation = useNavigation<NavigationProp<TestNavigatorParams>>();
    const { handleOnNextRouteNamesChange } = useUnhandledLinking();
    useEffect(handleOnNextRouteNamesChange, [handleOnNextRouteNamesChange]);

    return (
      <>
        <Button
          title="navigate"
          onPress={() => {
            navigation.navigate('Home');
          }}
        />
      </>
    );
  };

  const App = () => {
    return (
      <NavigationContainer linking={linking}>
        <Stack.Navigator>
          <Stack.Screen name="SignIn" component={TestScreen} />
          <Stack.Screen name="Home">{() => null}</Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    );
  };

  const { queryByText } = await render(<App />);

  const consoleWarnMock = jest.spyOn(console, 'warn').mockImplementation();
  fireEvent.press(queryByText(/navigate/i));
  expect(consoleWarnMock).toHaveBeenCalledTimes(1);
  consoleWarnMock.mockRestore();
});
