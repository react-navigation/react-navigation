import 'react-native-gesture-handler/jestSetup';

import { afterEach, expect, jest, test } from '@jest/globals';
import { Text } from '@react-navigation/elements';
import {
  createNavigationContainerRef,
  NavigationContainer,
} from '@react-navigation/native';
import { act, fireEvent, render } from '@testing-library/react-native';
import { useEffect } from 'react';
import { Button, View } from 'react-native';
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

  const { findByText, queryByText } = render(
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="A" component={Test} />
        <Drawer.Screen name="B" component={Test} />
      </Drawer.Navigator>
    </NavigationContainer>
  );

  expect(queryByText('Screen A')).not.toBeNull();
  expect(queryByText('Screen B')).toBeNull();

  fireEvent(await findByText('Go to B'), 'press');

  expect(queryByText('Screen B')).not.toBeNull();
});

test('handles screens preloading', async () => {
  const Drawer = createDrawerNavigator<DrawerParamList>();

  const navigation = createNavigationContainerRef<DrawerParamList>();

  const { queryByText } = render(
    <NavigationContainer ref={navigation}>
      <Drawer.Navigator>
        <Drawer.Screen name="A">{() => null}</Drawer.Screen>
        <Drawer.Screen name="B">{() => <Text>Screen B</Text>}</Drawer.Screen>
      </Drawer.Navigator>
    </NavigationContainer>
  );

  expect(queryByText('Screen B', { includeHiddenElements: true })).toBeNull();
  act(() => navigation.preload('B'));
  expect(
    queryByText('Screen B', { includeHiddenElements: true })
  ).not.toBeNull();
});

test('inactiveBehavior="none" keeps effects active when navigating away', () => {
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

  render(
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

  act(() => navigation.navigate('B'));

  expect(effectActive).toBe(true);

  act(() => navigation.navigate('A'));

  expect(effectActive).toBe(true);
});

test('default inactiveBehavior="pause" unmounts effects when navigating away', () => {
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

  render(
    <NavigationContainer ref={navigation}>
      <Drawer.Navigator>
        <Drawer.Screen name="A">{() => null}</Drawer.Screen>
        <Drawer.Screen name="B" component={ScreenB} />
      </Drawer.Navigator>
    </NavigationContainer>
  );

  act(() => navigation.navigate('B'));

  expect(effectActive).toBe(true);

  act(() => navigation.navigate('A'));

  expect(effectActive).toBe(true);

  act(() => jest.runAllTimers());
  act(() => jest.runAllTimers());

  expect(effectActive).toBe(false);
});

test('preloading a screen runs effects', () => {
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

  render(
    <NavigationContainer ref={navigation}>
      <Drawer.Navigator>
        <Drawer.Screen name="A">{() => null}</Drawer.Screen>
        <Drawer.Screen name="B" component={ScreenB} />
      </Drawer.Navigator>
    </NavigationContainer>
  );

  expect(effectActive).toBe(false);

  act(() => navigation.preload('B'));

  expect(effectActive).toBe(true);
});

test('lazy=false pre-renders screen with effects active, pauses after first visit', () => {
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

  const { queryByText } = render(
    <NavigationContainer ref={navigation}>
      <Drawer.Navigator>
        <Drawer.Screen name="A">{() => null}</Drawer.Screen>
        <Drawer.Screen name="B" component={ScreenB} options={{ lazy: false }} />
      </Drawer.Navigator>
    </NavigationContainer>
  );

  // Pre-rendered before any navigation
  expect(
    queryByText('Screen B', { includeHiddenElements: true })
  ).not.toBeNull();

  expect(effectActive).toBe(true);

  act(() => navigation.navigate('B'));
  act(() => navigation.navigate('A'));

  expect(effectActive).toBe(true);

  act(() => jest.runAllTimers());
  act(() => jest.runAllTimers());

  // After first focus and navigating away, effects are paused
  expect(effectActive).toBe(false);
});
