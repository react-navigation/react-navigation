import { afterEach, expect, jest, test } from '@jest/globals';
import {
  createNavigationContainerRef,
  NavigationContainer,
} from '@react-navigation/native';
import { act, render, screen, userEvent } from '@testing-library/react-native';
import { useEffect } from 'react';
import {
  type EmitterSubscription,
  Keyboard,
  type KeyboardEventListener,
  type KeyboardEventName,
  Platform,
  Text,
  View,
} from 'react-native';

import { type BottomTabScreenProps, createBottomTabNavigator } from '../index';

type BottomTabParamList = {
  A: undefined;
  B: undefined;
};

jest.useFakeTimers();

afterEach(() => {
  jest.restoreAllMocks();
});

test('renders a bottom tab navigator with screens', async () => {
  const Test = ({ route }: BottomTabScreenProps<BottomTabParamList>) => (
    <View>
      <Text>Screen {route.name}</Text>
    </View>
  );

  const Tab = createBottomTabNavigator<BottomTabParamList>();
  const user = userEvent.setup();

  await render(
    <NavigationContainer>
      <Tab.Navigator implementation="custom">
        <Tab.Screen name="A" component={Test} />
        <Tab.Screen name="B" component={Test} />
      </Tab.Navigator>
    </NavigationContainer>
  );

  expect(screen.getByText('Screen A')).not.toBeNull();
  expect(screen.queryByText('Screen B')).toBeNull();

  expect(
    screen.getAllByRole('button', { name: /(A|B), (selected|unselected)/ })
  ).toHaveLength(2);

  await user.press(screen.getByRole('button', { name: 'B, unselected' }));

  expect(screen.getByText('Screen B')).not.toBeNull();
});

test('handles screens preloading', async () => {
  const Tab = createBottomTabNavigator<BottomTabParamList>();

  const navigation = createNavigationContainerRef<BottomTabParamList>();

  await render(
    <NavigationContainer ref={navigation}>
      <Tab.Navigator implementation="custom">
        <Tab.Screen name="A">{() => null}</Tab.Screen>
        <Tab.Screen name="B">{() => <Text>Screen B</Text>}</Tab.Screen>
      </Tab.Navigator>
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

test('tab bar cannot be tapped when hidden', async () => {
  // @ts-expect-error: mock implementation for testing
  const listeners: Record<KeyboardEventName, KeyboardEventListener[]> = {
    keyboardWillShow: [],
    keyboardWillHide: [],
  };

  const spy = jest
    .spyOn(Keyboard, 'addListener')
    .mockImplementation((name, callback) => {
      listeners[name].push(callback);

      return {
        remove: () => {
          listeners[name] = listeners[name].filter((c) => c !== callback);
        },
      } as EmitterSubscription;
    });

  const Test = ({ route }: BottomTabScreenProps<BottomTabParamList>) => (
    <View>
      <Text>Screen {route.name}</Text>
    </View>
  );

  const Tab = createBottomTabNavigator<BottomTabParamList>();
  const user = userEvent.setup();

  await render(
    <NavigationContainer>
      <Tab.Navigator
        implementation="custom"
        screenOptions={{
          tabBarHideOnKeyboard: true,
        }}
      >
        <Tab.Screen name="A" component={Test} />
        <Tab.Screen name="B" component={Test} />
      </Tab.Navigator>
    </NavigationContainer>
  );

  expect(screen.queryByText('Screen B')).toBeNull();

  await user.press(screen.getByRole('button', { name: 'B, unselected' }));

  await act(() => jest.runAllTimers());

  expect(screen.getByText('Screen B')).not.toBeNull();

  await act(() => {
    // Show the keyboard to hide the tab bar
    listeners.keyboardWillShow.forEach((listener) =>
      // @ts-expect-error: mock event
      listener({})
    );
  });

  await user.press(screen.getByRole('button', { name: 'A, unselected' }));

  await act(() => jest.runAllTimers());

  expect(screen.queryByText('Screen A')).toBeNull();
  expect(screen.getByText('Screen B')).not.toBeNull();

  spy.mockRestore();
});

test('tab bars render appropriate hrefs on web', async () => {
  jest.replaceProperty(Platform, 'OS', 'web');

  const Tab = createBottomTabNavigator<BottomTabParamList>();

  await render(
    <NavigationContainer
      linking={{
        config: {
          path: 'root',
          screens: {
            A: 'first',
            B: 'second',
          },
        },
        getInitialURL: () => null,
      }}
    >
      <Tab.Navigator
        implementation="custom"
        screenOptions={{ tabBarButton: ({ href }) => <Text>{href}</Text> }}
      >
        <Tab.Screen name="A">{() => null}</Tab.Screen>
        <Tab.Screen name="B">{() => null}</Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );

  expect(screen.getByText('/root/first')).not.toBeNull();
  expect(screen.getByText('/root/second')).not.toBeNull();
});

test('inactiveBehavior="none" keeps effects active when switching tabs', async () => {
  let effectActive = false;

  const ScreenA = () => {
    useEffect(() => {
      effectActive = true;
      return () => {
        effectActive = false;
      };
    }, []);
    return null;
  };

  const Tab = createBottomTabNavigator<BottomTabParamList>();
  const navigation = createNavigationContainerRef<BottomTabParamList>();

  await render(
    <NavigationContainer ref={navigation}>
      <Tab.Navigator implementation="custom">
        <Tab.Screen
          name="A"
          component={ScreenA}
          options={{ inactiveBehavior: 'none' }}
        />
        <Tab.Screen name="B">{() => null}</Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );

  expect(effectActive).toBe(true);

  await act(() => navigation.navigate('B'));

  expect(effectActive).toBe(true);
});

test('default inactiveBehavior="pause" unmounts effects when switching tabs', async () => {
  let effectActive = false;

  const ScreenA = () => {
    useEffect(() => {
      effectActive = true;
      return () => {
        effectActive = false;
      };
    }, []);
    return null;
  };

  const Tab = createBottomTabNavigator<BottomTabParamList>();
  const navigation = createNavigationContainerRef<BottomTabParamList>();

  await render(
    <NavigationContainer ref={navigation}>
      <Tab.Navigator implementation="custom">
        <Tab.Screen name="A" component={ScreenA} />
        <Tab.Screen name="B">{() => null}</Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );

  expect(effectActive).toBe(true);

  await act(() => navigation.navigate('B'));

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
    return null;
  };

  const Tab = createBottomTabNavigator<BottomTabParamList>();
  const navigation = createNavigationContainerRef<BottomTabParamList>();

  await render(
    <NavigationContainer ref={navigation}>
      <Tab.Navigator implementation="custom">
        <Tab.Screen name="A">{() => null}</Tab.Screen>
        <Tab.Screen name="B" component={ScreenB} />
      </Tab.Navigator>
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

  const Tab = createBottomTabNavigator<BottomTabParamList>();
  const navigation = createNavigationContainerRef<BottomTabParamList>();

  await render(
    <NavigationContainer ref={navigation}>
      <Tab.Navigator implementation="custom">
        <Tab.Screen name="A">{() => null}</Tab.Screen>
        <Tab.Screen name="B" component={ScreenB} options={{ lazy: false }} />
      </Tab.Navigator>
    </NavigationContainer>
  );

  expect(
    screen.getByText('Screen B', { includeHiddenElements: true })
  ).not.toBeNull();

  expect(effectActive).toBe(true);

  await act(() => navigation.navigate('B'));
  await act(() => navigation.navigate('A'));

  expect(effectActive).toBe(true);

  await act(() => jest.runAllTimers());
  await act(() => jest.runAllTimers());

  expect(effectActive).toBe(false);
});
