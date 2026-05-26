import { afterEach, expect, jest, test } from '@jest/globals';
import { Text } from '@react-navigation/elements';
import {
  createNavigationContainerRef,
  createNavigatorFactory,
  NavigationContainer,
  type ParamListBase,
  StackRouter,
  useNavigationBuilder,
} from '@react-navigation/native';
import { act, fireEvent, render } from '@testing-library/react-native';
import { useEffect } from 'react';
import {
  Animated,
  type EmitterSubscription,
  Keyboard,
  type KeyboardEventListener,
  type KeyboardEventName,
  Platform,
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

  const { queryByText, getAllByRole, getByRole } = render(
    <NavigationContainer>
      <Tab.Navigator implementation="custom">
        <Tab.Screen name="A" component={Test} />
        <Tab.Screen name="B" component={Test} />
      </Tab.Navigator>
    </NavigationContainer>
  );

  expect(queryByText('Screen A')).not.toBeNull();
  expect(queryByText('Screen B')).toBeNull();

  expect(
    getAllByRole('button', { name: /(A|B), (selected|unselected)/ })
  ).toHaveLength(2);

  fireEvent.press(getByRole('button', { name: 'B, unselected' }), {});

  expect(queryByText('Screen B')).not.toBeNull();
});

test('handles screens preloading', async () => {
  const Tab = createBottomTabNavigator<BottomTabParamList>();

  const navigation = createNavigationContainerRef<BottomTabParamList>();

  const { queryByText } = render(
    <NavigationContainer ref={navigation}>
      <Tab.Navigator implementation="custom">
        <Tab.Screen name="A">{() => null}</Tab.Screen>
        <Tab.Screen name="B">{() => <Text>Screen B</Text>}</Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );

  expect(queryByText('Screen B', { includeHiddenElements: true })).toBeNull();
  act(() => navigation.preload('B'));
  expect(
    queryByText('Screen B', { includeHiddenElements: true })
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

  const { queryByText, getByRole } = render(
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

  expect(queryByText('Screen B')).toBeNull();

  fireEvent.press(getByRole('button', { name: 'B, unselected' }), {});

  act(() => jest.runAllTimers());

  expect(queryByText('Screen B')).not.toBeNull();

  act(() => {
    // Show the keyboard to hide the tab bar
    listeners.keyboardWillShow.forEach((listener) =>
      // @ts-expect-error: mock event
      listener({})
    );
  });

  fireEvent.press(getByRole('button', { name: 'A, unselected' }), {});

  act(() => jest.runAllTimers());

  expect(queryByText('Screen A')).toBeNull();
  expect(queryByText('Screen B')).not.toBeNull();

  spy.mockRestore();
});

test('tab bars render appropriate hrefs on web', () => {
  jest.replaceProperty(Platform, 'OS', 'web');

  const Tab = createBottomTabNavigator<BottomTabParamList>();

  const { getByText } = render(
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

  expect(getByText('/root/first')).not.toBeNull();
  expect(getByText('/root/second')).not.toBeNull();
});

test('inactiveBehavior="none" keeps effects active when switching tabs', () => {
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

  render(
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

  act(() => navigation.navigate('B'));

  expect(effectActive).toBe(true);
});

test('default inactiveBehavior="pause" unmounts effects when switching tabs', () => {
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

  render(
    <NavigationContainer ref={navigation}>
      <Tab.Navigator implementation="custom">
        <Tab.Screen name="A" component={ScreenA} />
        <Tab.Screen name="B">{() => null}</Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );

  expect(effectActive).toBe(true);

  act(() => navigation.navigate('B'));

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
    return null;
  };

  const Tab = createBottomTabNavigator<BottomTabParamList>();
  const navigation = createNavigationContainerRef<BottomTabParamList>();

  render(
    <NavigationContainer ref={navigation}>
      <Tab.Navigator implementation="custom">
        <Tab.Screen name="A">{() => null}</Tab.Screen>
        <Tab.Screen name="B" component={ScreenB} />
      </Tab.Navigator>
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

  const Tab = createBottomTabNavigator<BottomTabParamList>();
  const navigation = createNavigationContainerRef<BottomTabParamList>();

  const { queryByText } = render(
    <NavigationContainer ref={navigation}>
      <Tab.Navigator implementation="custom">
        <Tab.Screen name="A">{() => null}</Tab.Screen>
        <Tab.Screen name="B" component={ScreenB} options={{ lazy: false }} />
      </Tab.Navigator>
    </NavigationContainer>
  );

  expect(
    queryByText('Screen B', { includeHiddenElements: true })
  ).not.toBeNull();

  expect(effectActive).toBe(true);

  act(() => navigation.navigate('B'));
  act(() => navigation.navigate('A'));

  expect(effectActive).toBe(true);

  act(() => jest.runAllTimers());
  act(() => jest.runAllTimers());

  expect(effectActive).toBe(false);
});

test('popToTopOnBlur dispatches even when tab transition animation is interrupted', () => {
  // Regression test for #12512.
  //
  // BottomTabViewCustom dispatches popToTopAction from
  // Animated.parallel(...).start(cb). In real apps a parent re-render
  // during a tab switch causes the effect to re-run and start a second
  // Animated.parallel that preempts the first, so the first callback
  // fires with `finished: false` and the action would be silently
  // dropped if the dispatch were gated on `finished`.
  //
  // We simulate that race deterministically by mocking Animated.parallel
  // so its start() callback always fires with `finished: false`.
  jest.spyOn(Animated, 'parallel').mockImplementation(
    () =>
      ({
        start: (cb?: (info: { finished: boolean }) => void) =>
          cb?.({ finished: false }),
        stop: jest.fn(),
        reset: jest.fn(),
      }) as ReturnType<typeof Animated.parallel>
  );

  // Minimal stub stack navigator — bottom-tabs has no stack dependency.
  const createStackNavigator = createNavigatorFactory(
    (props: Parameters<typeof useNavigationBuilder>[1]) => {
      const { state, descriptors, NavigationContent } = useNavigationBuilder(
        StackRouter,
        props
      );

      return (
        <NavigationContent>
          {descriptors[state.routes[state.index].key].render()}
        </NavigationContent>
      );
    }
  );

  type NestedParamList = { Root: undefined; Detail: undefined };
  const Stack = createStackNavigator<ParamListBase>();

  const NestedStack = () => (
    <Stack.Navigator>
      <Stack.Screen name="Root">{() => null}</Stack.Screen>
      <Stack.Screen name="Detail">{() => null}</Stack.Screen>
    </Stack.Navigator>
  );

  const Tab = createBottomTabNavigator<BottomTabParamList>();
  const navigation = createNavigationContainerRef<BottomTabParamList>();

  render(
    <NavigationContainer ref={navigation}>
      <Tab.Navigator implementation="custom">
        <Tab.Screen
          name="A"
          component={NestedStack}
          options={{ popToTopOnBlur: true }}
        />
        <Tab.Screen name="B">{() => null}</Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );

  // Push 'Detail' onto Tab A's nested stack.
  act(() =>
    navigation.navigate('A', {
      screen: 'Detail',
    } as never)
  );

  const stackBefore = navigation
    .getRootState()
    .routes.find((r) => r.name === 'A')?.state as
    | { routes: { name: keyof NestedParamList }[] }
    | undefined;
  expect(stackBefore?.routes.map((r) => r.name)).toEqual(['Root', 'Detail']);

  // Blur Tab A — the dispatch must still happen even though the mocked
  // Animated.parallel reports `finished: false`.
  act(() => navigation.navigate('B'));

  const stackAfter = navigation
    .getRootState()
    .routes.find((r) => r.name === 'A')?.state as
    | { routes: { name: keyof NestedParamList }[] }
    | undefined;
  expect(stackAfter?.routes.map((r) => r.name)).toEqual(['Root']);
});
