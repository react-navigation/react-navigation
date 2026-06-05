import 'react-native-gesture-handler/jestSetup';

import { afterEach, expect, jest, test } from '@jest/globals';
import {
  createNavigationContainerRef,
  NavigationContainer,
} from '@react-navigation/native';
import { act, render, screen, userEvent } from '@testing-library/react-native';
import { useEffect } from 'react';
import { Button, Text, View } from 'react-native';
import { setUpTests } from 'react-native-reanimated';

import { createDrawerNavigator, type DrawerScreenProps } from '../index';

setUpTests();

type DrawerParamList = {
  A: undefined;
  B: undefined;
};

jest.useFakeTimers();

afterEach(() => {
  jest.restoreAllMocks();
});

jest.mock('react-native-worklets', () =>
  require('react-native-worklets/src/mock')
);

test('renders a drawer navigator with screens', async () => {
  const Test = ({ route, navigation }: DrawerScreenProps<DrawerParamList>) => (
    <View>
      <Text>Screen {route.name}</Text>
      <Button onPress={() => navigation.navigate('A')} title="Go to A" />
      <Button onPress={() => navigation.navigate('B')} title="Go to B" />
    </View>
  );

  const Drawer = createDrawerNavigator<DrawerParamList>();
  const user = userEvent.setup();

  await render(
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="A" component={Test} />
        <Drawer.Screen name="B" component={Test} />
      </Drawer.Navigator>
    </NavigationContainer>
  );

  expect(screen.getByText('Screen A')).not.toBeNull();
  expect(screen.queryByText('Screen B')).toBeNull();

  await user.press(screen.getByRole('button', { name: 'Go to B' }));

  expect(screen.getByText('Screen B')).not.toBeNull();
});

test('handles screens preloading', async () => {
  const Drawer = createDrawerNavigator<DrawerParamList>();

  const navigation = createNavigationContainerRef<DrawerParamList>();

  await render(
    <NavigationContainer ref={navigation}>
      <Drawer.Navigator>
        <Drawer.Screen name="A">{() => null}</Drawer.Screen>
        <Drawer.Screen name="B">{() => <Text>Screen B</Text>}</Drawer.Screen>
      </Drawer.Navigator>
    </NavigationContainer>
  );

  expect(
    screen.queryByText('Screen B', { includeHiddenElements: true })
  ).toBeNull();

  await act(() => navigation.preload('B'));

  expect(
    screen.getByText('Screen B', { includeHiddenElements: true })
  ).not.toBeNull();
});

test('inactiveBehavior="none" keeps effects active when navigating away', async () => {
  let effectActive = false;

  const ScreenB = () => {
    useEffect(() => {
      effectActive = true;
      return () => {
        effectActive = false;
      };
    }, []);
    return <Text>Screen B</Text>;
  };

  const Drawer = createDrawerNavigator<DrawerParamList>();
  const navigation = createNavigationContainerRef<DrawerParamList>();

  await render(
    <NavigationContainer ref={navigation}>
      <Drawer.Navigator>
        <Drawer.Screen name="A">{() => null}</Drawer.Screen>
        <Drawer.Screen
          name="B"
          component={ScreenB}
          options={{ inactiveBehavior: 'none' }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );

  await act(() => navigation.navigate('B'));

  expect(effectActive).toBe(true);

  await act(() => navigation.navigate('A'));

  expect(effectActive).toBe(true);
});

test('default inactiveBehavior="pause" unmounts effects when navigating away', async () => {
  let effectActive = false;

  const ScreenB = () => {
    useEffect(() => {
      effectActive = true;
      return () => {
        effectActive = false;
      };
    }, []);
    return <Text>Screen B</Text>;
  };

  const Drawer = createDrawerNavigator<DrawerParamList>();
  const navigation = createNavigationContainerRef<DrawerParamList>();

  await render(
    <NavigationContainer ref={navigation}>
      <Drawer.Navigator>
        <Drawer.Screen name="A">{() => null}</Drawer.Screen>
        <Drawer.Screen name="B" component={ScreenB} />
      </Drawer.Navigator>
    </NavigationContainer>
  );

  await act(() => navigation.navigate('B'));

  expect(effectActive).toBe(true);

  await act(() => navigation.navigate('A'));

  expect(effectActive).toBe(true);

  await act(() => jest.runAllTimers());
  await act(() => jest.runAllTimers());

  expect(effectActive).toBe(false);
});

test('preloading a screen runs effects', async () => {
  let effectActive = false;

  const ScreenB = () => {
    useEffect(() => {
      effectActive = true;
      return () => {
        effectActive = false;
      };
    }, []);
    return <Text>Screen B</Text>;
  };

  const Drawer = createDrawerNavigator<DrawerParamList>();
  const navigation = createNavigationContainerRef<DrawerParamList>();

  await render(
    <NavigationContainer ref={navigation}>
      <Drawer.Navigator>
        <Drawer.Screen name="A">{() => null}</Drawer.Screen>
        <Drawer.Screen name="B" component={ScreenB} />
      </Drawer.Navigator>
    </NavigationContainer>
  );

  expect(effectActive).toBe(false);

  await act(() => navigation.preload('B'));

  expect(effectActive).toBe(true);
});

test('lazy=false pre-renders screen with effects active, pauses after first visit', async () => {
  let effectActive = false;

  const ScreenB = () => {
    useEffect(() => {
      effectActive = true;
      return () => {
        effectActive = false;
      };
    }, []);
    return <Text>Screen B</Text>;
  };

  const Drawer = createDrawerNavigator<DrawerParamList>();
  const navigation = createNavigationContainerRef<DrawerParamList>();

  await render(
    <NavigationContainer ref={navigation}>
      <Drawer.Navigator>
        <Drawer.Screen name="A">{() => null}</Drawer.Screen>
        <Drawer.Screen name="B" component={ScreenB} options={{ lazy: false }} />
      </Drawer.Navigator>
    </NavigationContainer>
  );

  // Pre-rendered before any navigation
  expect(
    screen.getByText('Screen B', { includeHiddenElements: true })
  ).not.toBeNull();

  expect(effectActive).toBe(true);

  await act(() => navigation.navigate('B'));
  await act(() => navigation.navigate('A'));

  expect(effectActive).toBe(true);

  await act(() => jest.runAllTimers());
  await act(() => jest.runAllTimers());

  // After first focus and navigating away, effects are paused
  expect(effectActive).toBe(false);
});
