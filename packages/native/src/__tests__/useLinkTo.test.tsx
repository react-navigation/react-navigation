import { expect, jest, test } from '@jest/globals';
import {
  createNavigationContainerRef,
  type NavigatorScreenParams,
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

test('navigates from the root when called in a nested navigator', async () => {
  const user = userEvent.setup();

  type ArticleStackParamList = {
    Article: undefined;
    Settings: undefined;
  };

  type RootStackParamList = {
    Articles: NavigatorScreenParams<ArticleStackParamList>;
    Settings: undefined;
  };

  const RootStack = createStackNavigator<RootStackParamList>();
  const ArticleStack = createStackNavigator<ArticleStackParamList>();

  const ArticleScreen = () => {
    const linkTo = useLinkTo();

    return (
      <Pressable onPress={() => linkTo('/settings')}>
        <Text>Open settings</Text>
      </Pressable>
    );
  };

  const ArticlesScreen = () => (
    <ArticleStack.Navigator>
      <ArticleStack.Screen name="Article" component={ArticleScreen} />
      <ArticleStack.Screen name="Settings">
        {() => <Text>Nested settings</Text>}
      </ArticleStack.Screen>
    </ArticleStack.Navigator>
  );

  await render(
    <NavigationContainer<RootStackParamList>
      linking={{
        config: {
          screens: {
            Articles: {
              screens: {
                Article: 'article',
                Settings: 'articles/settings',
              },
            },
            Settings: 'settings',
          },
        },
      }}
    >
      <RootStack.Navigator>
        <RootStack.Screen name="Articles" component={ArticlesScreen} />
        <RootStack.Screen name="Settings">
          {() => <Text>Root settings</Text>}
        </RootStack.Screen>
      </RootStack.Navigator>
    </NavigationContainer>
  );

  await user.press(screen.getByText('Open settings'));

  expect(screen.getByText('Root settings')).toBeOnTheScreen();
  expect(screen.queryByText('Nested settings')).not.toBeOnTheScreen();
});

test('throws when rendered outside a navigation container', async () => {
  const Test = () => {
    useLinkTo();

    return null;
  };

  await expect(render(<Test />)).rejects.toThrow(
    "Couldn't find a navigation object. Is your component inside NavigationContainer?"
  );
});
