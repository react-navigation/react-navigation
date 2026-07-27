import { afterEach, expect, jest, test } from '@jest/globals';
import {
  createNavigationContainerRef,
  createNavigatorFactory,
  NavigationContainer,
  type NavigatorScreenParams,
  StackRouter,
  useNavigationBuilder,
} from '@react-navigation/native';
import { act, render, screen, userEvent } from '@testing-library/react-native';
import { useEffect } from 'react';
import {
  type EmitterSubscription,
  Keyboard,
  type KeyboardEventListener,
  type KeyboardEventName,
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

test('pops nested stack to top on blur even when tab transition animation is interrupted', async () => {
  const createStackNavigator = createNavigatorFactory(
    (props: Parameters<typeof useNavigationBuilder>[1]) => {
      const { state, descriptors, NavigationContent } = useNavigationBuilder(
        StackRouter,
        props
      );

      return (
        <NavigationContent>
          {state.routes.map((route) => {
            const descriptor = descriptors[route.key];

            if (descriptor == null) {
              throw new Error(
                `Couldn't find a descriptor for route '${route.key}'.`
              );
            }

            return descriptor.render();
          })}
        </NavigationContent>
      );
    }
  );

  type NestedParamList = { Root: undefined; Detail: undefined };

  type TabParamList = {
    A: NavigatorScreenParams<NestedParamList>;
    B: undefined;
    C: undefined;
  };

  const Stack = createStackNavigator<NestedParamList>();

  const NestedStack = () => (
    <Stack.Navigator>
      <Stack.Screen name="Root">{() => null}</Stack.Screen>
      <Stack.Screen name="Detail">{() => null}</Stack.Screen>
    </Stack.Navigator>
  );

  const Tab = createBottomTabNavigator<TabParamList>();
  const navigation = createNavigationContainerRef<TabParamList>();

  await render(
    <NavigationContainer ref={navigation}>
      <Tab.Navigator
        implementation="custom"
        screenOptions={{ animation: 'fade' }}
      >
        <Tab.Screen
          name="A"
          component={NestedStack}
          options={{ popToTopOnBlur: true }}
        />
        <Tab.Screen name="B">{() => null}</Tab.Screen>
        <Tab.Screen name="C">{() => null}</Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );

  await act(() =>
    navigation.navigate('A', {
      screen: 'Detail',
    })
  );

  expect(navigation.getRootState()).toEqual(
    expect.objectContaining({
      routes: expect.arrayContaining([
        expect.objectContaining({
          name: 'A',
          state: expect.objectContaining({
            routes: [
              expect.objectContaining({ name: 'Root' }),
              expect.objectContaining({ name: 'Detail' }),
            ],
          }),
        }),
      ]),
    })
  );

  await act(() => navigation.navigate('B'));

  await act(() => jest.advanceTimersByTime(1));

  await act(() => navigation.navigate('C'));

  expect(navigation.getRootState()).toEqual(
    expect.objectContaining({
      routes: expect.arrayContaining([
        expect.objectContaining({
          name: 'A',
          state: expect.objectContaining({
            routes: [expect.objectContaining({ name: 'Root' })],
          }),
        }),
      ]),
    })
  );
});
