import {
  createNavigationContainerRef,
  createNavigatorFactory,
  ParamListBase,
  StackRouter,
  useNavigationBuilder,
} from '@react-navigation/core';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import * as React from 'react';
import { Button, Text } from 'react-native';

import { NavigationContainer } from '../NavigationContainer';
import { useDeferredLinking } from '../useDeferredLinking';

it('should schedule a state to be handled on conditional linking', async () => {
  const createStackNavigator = createNavigatorFactory((props: any) => {
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

  const Stack = createStackNavigator();

  const TestScreen = ({ route, signOut }: any): any => (
    <>
      <Text>{route.name}</Text>
      <Button title="sign out" onPress={signOut} />
    </>
  );
  const SignInScreen = ({ route, signIn }: any): any => {
    const fn = useDeferredLinking();
    return (
      <>
        <Text>{route.name}</Text>
        <Button
          title="sign in"
          onPress={() => {
            fn();
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
    async getInitialURL() {
      return 'rn://profile';
    },
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  const App = () => {
    const [isSignedIn, setSignedIn] = React.useState(false);
    // const [isSignedIn, setSignedIn] = [false, (_: boolean) => {}];

    return (
      <NavigationContainer ref={navigation} linking={linking} direction="ltr">
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
      </NavigationContainer>
    );
  };

  // const consoleWarnMock = jest.spyOn(console, 'warn').mockImplementation();
  const { queryByText } = await waitFor(() => render(<App />));
  // expect(console.warn).toHaveBeenCalledTimes(1);
  expect(queryByText('SignIn')).not.toBeNull();

  fireEvent.press(queryByText(/sign in/i));
  //
  expect(queryByText('SignIn')).toBeNull();
  expect(queryByText('Profile')).not.toBeNull();
  // // //
  fireEvent.press(queryByText(/sign out/i));
  //
  expect(queryByText('SignIn')).not.toBeNull();
  expect(queryByText('Home')).toBeNull();
  expect(queryByText('Profile')).toBeNull();

  fireEvent.press(queryByText(/sign in/i));

  expect(queryByText('Home')).not.toBeNull();

  // consoleWarnMock.mockRestore();
});

it('should schedule a state to be handled on conditional linking in nested stack', async () => {
  const createStackNavigator = createNavigatorFactory((props: any) => {
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

  const Stack = createStackNavigator();
  const NestedStack = createStackNavigator();

  const TestScreen = ({ route, signOut }: any): any => (
    <>
      <Text>{route.name}</Text>
      <Button title="sign out" onPress={signOut} />
    </>
  );
  const SignInScreen = ({ route, signIn }: any): any => {
    const fn = useDeferredLinking();
    return (
      <>
        <Text>{route.name}</Text>
        <Button
          title="sign in"
          onPress={() => {
            fn();
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
    async getInitialURL() {
      return 'rn://home/profile';
    },
  };

  const navigation = createNavigationContainerRef();

  const App = () => {
    const [isSignedIn, setSignedIn] = React.useState(false);

    return (
      <NavigationContainer ref={navigation} linking={linking}>
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

  const consoleWarnMock = jest.spyOn(console, 'warn').mockImplementation();
  const { queryByText } = await waitFor(() => render(<App />));

  expect(console.warn).toHaveBeenCalledTimes(1);
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

  consoleWarnMock.mockRestore();
});
