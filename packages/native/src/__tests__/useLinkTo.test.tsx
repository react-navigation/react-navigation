import { expect, jest, test } from '@jest/globals';
import {
  createNavigationContainerRef,
  type ParamListBase,
} from '@react-navigation/core';
import { render, screen, userEvent } from '@testing-library/react-native';
import { Pressable, Text } from 'react-native';

import { createStackNavigator } from '../__stubs__/createStackNavigator';
import { NavigationContainer } from '../NavigationContainer';
import { useLinkTo } from '../useLinkTo';

jest.useFakeTimers();

test('navigates with href to a screen', async () => {
  const user = userEvent.setup();

  const Stack = createStackNavigator<ParamListBase>();

  const HomeScreen = () => {
    const linkTo = useLinkTo();

    return (
      <>
        <Text>Home</Text>
        <Pressable onPress={() => linkTo('/profile/42')}>
          <Text>Open profile</Text>
        </Pressable>
      </>
    );
  };

  const ProfileScreen = ({ route }: any) => {
    const linkTo = useLinkTo();

    return (
      <>
        <Text>Profile {route.params.id}</Text>
        <Pressable onPress={() => linkTo('/')}>
          <Text>Go home</Text>
        </Pressable>
      </>
    );
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  await render(
    <NavigationContainer
      ref={navigation}
      linking={{
        config: {
          screens: {
            Home: '',
            Profile: 'profile/:id',
          },
        },
      }}
    >
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  await user.press(screen.getByText('Open profile'));

  expect(screen.queryByTestId('Home')).toBeNull();
  expect(screen.getByText('Profile 42')).not.toBeNull();

  expect(navigation.getCurrentRoute()?.name).toBe('Profile');

  await user.press(screen.getByText('Go home'));

  expect(screen.queryByText('Profile 42')).toBeNull();
  expect(screen.getByText('Home')).not.toBeNull();

  expect(navigation.getCurrentRoute()?.name).toBe('Home');
});
