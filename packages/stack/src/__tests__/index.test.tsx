import 'react-native-gesture-handler/jestSetup';

import { describe, expect, jest, test } from '@jest/globals';
import { useHeaderSearchBar } from '@react-navigation/elements';
import {
  createNavigationContainerRef,
  NavigationContainer,
  type NavigatorScreenParams,
  StackActions,
  useFocusEffect,
  useIsFocused,
} from '@react-navigation/native';
import { act, render, screen, userEvent } from '@testing-library/react-native';
import * as React from 'react';
import { Button, Text, View } from 'react-native';

import { createStackNavigator, type StackScreenProps } from '../index';

type StackParamList = {
  A: undefined;
  B: undefined;
  C: undefined;
};

type NestedStackParamList = {
  D: undefined;
};

type ParentStackParamList = {
  A: NavigatorScreenParams<ChildStackParamList>;
  B: undefined;
  C: undefined;
  D: undefined;
};

type ChildStackParamList = {
  X: undefined;
  Y: undefined;
};

jest.useFakeTimers();

test('renders a stack navigator with screens', async () => {
  const Test = ({ route, navigation }: StackScreenProps<StackParamList>) => (
    <View>
      <Text>Screen {route.name}</Text>
      <Button onPress={() => navigation.navigate('A')} title="Go to A" />
      <Button onPress={() => navigation.navigate('B')} title="Go to B" />
    </View>
  );

  const Stack = createStackNavigator<StackParamList>();
  const user = userEvent.setup();

  await render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="A" component={Test} />
        <Stack.Screen name="B" component={Test} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  expect(screen.getByText('Screen A')).not.toBeNull();
  expect(screen.queryByText('Screen B')).toBeNull();

  await user.press(screen.getByRole('button', { name: 'Go to B' }));

  await act(() => jest.runAllTimers());

  expect(screen.getByText('Screen B')).not.toBeNull();
});

test("doesn't show back button on the first screen", async () => {
  const Test = ({ navigation }: StackScreenProps<StackParamList>) => (
    <Button onPress={() => navigation.navigate('B')} title="Go to B" />
  );

  const Stack = createStackNavigator<StackParamList>();
  const user = userEvent.setup();

  await render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="A" component={Test} />
        <Stack.Screen name="B" component={Test} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  expect(screen.queryByRole('button', { name: 'Go back' })).toBeNull();

  await user.press(screen.getByRole('button', { name: 'Go to B' }));

  expect(screen.getByRole('button', { name: 'A, back' })).not.toBeNull();
});

test('fires transition events on navigation', async () => {
  const FirstScreen = ({ navigation }: StackScreenProps<StackParamList>) => (
    <Button onPress={() => navigation.navigate('B')} title="Go to B" />
  );

  const onTransitionStart = jest.fn();
  const onTransitionEnd = jest.fn();

  const SecondScreen = ({ navigation }: StackScreenProps<StackParamList>) => {
    React.useLayoutEffect(
      () => navigation.addListener('transitionStart', onTransitionStart),
      [navigation]
    );

    React.useEffect(
      () => navigation.addListener('transitionEnd', onTransitionEnd),
      [navigation]
    );

    return <Button onPress={() => navigation.goBack()} title="Go back" />;
  };

  const Stack = createStackNavigator<StackParamList>();
  const user = userEvent.setup();

  await render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="A" component={FirstScreen} />
        <Stack.Screen name="B" component={SecondScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  expect(onTransitionStart).not.toHaveBeenCalled();
  expect(onTransitionEnd).not.toHaveBeenCalled();

  await user.press(screen.getByRole('button', { name: 'Go to B' }));

  await act(() => jest.advanceTimersByTime(1));

  expect(onTransitionStart).toHaveBeenCalledTimes(1);
  expect(onTransitionStart).toHaveBeenCalledWith(
    expect.objectContaining({ data: { closing: false } })
  );

  expect(onTransitionEnd).not.toHaveBeenCalled();

  await act(() => jest.runAllTimers());

  expect(onTransitionStart).toHaveBeenCalledTimes(1);
  expect(onTransitionEnd).toHaveBeenCalledTimes(1);
  expect(onTransitionEnd).toHaveBeenCalledWith(
    expect.objectContaining({ data: { closing: false } })
  );

  await user.press(screen.getByRole('button', { name: 'Go back' }));

  expect(onTransitionStart).toHaveBeenCalledTimes(2);
  expect(onTransitionStart).toHaveBeenCalledWith(
    expect.objectContaining({ data: { closing: true } })
  );

  expect(onTransitionEnd).toHaveBeenCalledTimes(1);

  await act(() => jest.runAllTimers());

  expect(onTransitionEnd).toHaveBeenCalledTimes(2);
  expect(onTransitionEnd).toHaveBeenCalledWith(
    expect.objectContaining({ data: { closing: true } })
  );
});

test('handles screens preloading', async () => {
  const Stack = createStackNavigator<StackParamList>();

  const navigation = createNavigationContainerRef<StackParamList>();

  const TestScreen = () => {
    const isFocused = useIsFocused();

    return <Text>Screen B ({isFocused ? 'focused' : 'unfocused'})</Text>;
  };

  await render(
    <NavigationContainer ref={navigation}>
      <Stack.Navigator>
        <Stack.Screen name="A">{() => null}</Stack.Screen>
        <Stack.Screen name="B" component={TestScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  expect(
    screen.queryByText('Screen B', { includeHiddenElements: true })
  ).toBeNull();

  await act(() => navigation.preload('B'));

  expect(
    screen.getByText('Screen B (unfocused)', { includeHiddenElements: true })
  ).not.toBeNull();

  await act(() => navigation.navigate('B'));

  expect(screen.getByText('Screen B (focused)')).not.toBeNull();
});

test('runs focus effect on focus change on preloaded route', async () => {
  const focusEffect = jest.fn();
  const focusEffectCleanup = jest.fn();

  const Test = () => {
    const onFocus = React.useCallback(() => {
      focusEffect();

      return focusEffectCleanup;
    }, []);

    useFocusEffect(onFocus);

    return null;
  };

  const Stack = createStackNavigator<StackParamList>();

  const navigation = createNavigationContainerRef<StackParamList>();

  await render(
    <NavigationContainer ref={navigation}>
      <Stack.Navigator>
        <Stack.Screen name="A">{() => null}</Stack.Screen>
        <Stack.Screen name="B" component={Test} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  expect(focusEffect).not.toHaveBeenCalled();
  expect(focusEffectCleanup).not.toHaveBeenCalled();

  await act(() => navigation.preload('A'));
  await act(() => navigation.preload('B'));

  expect(focusEffect).not.toHaveBeenCalled();
  expect(focusEffectCleanup).not.toHaveBeenCalled();

  await act(() => navigation.navigate('B'));

  expect(focusEffect).toHaveBeenCalledTimes(1);
  expect(focusEffectCleanup).not.toHaveBeenCalled();

  await act(() => navigation.navigate('A'));

  expect(focusEffect).toHaveBeenCalledTimes(1);
  expect(focusEffectCleanup).toHaveBeenCalledTimes(1);
});

test('renders correct focus state with preloading', async () => {
  const Test = () => {
    const isFocused = useIsFocused();

    return (
      <>
        <Text>Test Screen</Text>
        <Text>{isFocused ? 'focused' : 'unfocused'}</Text>
      </>
    );
  };

  const Stack = createStackNavigator<StackParamList>();

  const navigation = React.createRef<any>();

  await render(
    <NavigationContainer ref={navigation}>
      <Stack.Navigator>
        <Stack.Screen name="A">{() => null}</Stack.Screen>
        <Stack.Screen name="B" component={Test} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  expect(
    screen.queryByText('Test Screen', { includeHiddenElements: true })
  ).toBeNull();

  await act(() => navigation.current.preload('B'));

  expect(
    screen.getByText('Test Screen', { includeHiddenElements: true })
  ).not.toBeNull();

  expect(
    screen.getByText('unfocused', { includeHiddenElements: true })
  ).not.toBeNull();

  await act(() => navigation.current.navigate('B'));

  expect(
    screen.getByText('focused', { includeHiddenElements: true })
  ).not.toBeNull();

  await act(() => navigation.current.navigate('A'));

  expect(
    screen.queryByText('focused', { includeHiddenElements: true })
  ).toBeNull();
});

test('handles preloading screens with nested navigators', async () => {
  const Stack = createStackNavigator<StackParamList>();
  const NestedStack = createStackNavigator<NestedStackParamList>();

  const TestScreen = () => {
    const isFocused = useIsFocused();

    return <Text>Screen C ({isFocused ? 'focused' : 'unfocused'})</Text>;
  };

  const NestedNavigator = () => (
    <NestedStack.Navigator>
      <NestedStack.Screen name="D" component={TestScreen} />
    </NestedStack.Navigator>
  );

  const navigation = createNavigationContainerRef<StackParamList>();

  await render(
    <NavigationContainer ref={navigation}>
      <Stack.Navigator>
        <Stack.Screen name="A">{() => null}</Stack.Screen>
        <Stack.Screen name="B" component={NestedNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  expect(
    screen.queryByText('Screen C', { includeHiddenElements: true })
  ).toBeNull();

  await act(() => navigation.preload('B'));

  expect(
    screen.getByText('Screen C (unfocused)', { includeHiddenElements: true })
  ).not.toBeNull();

  await act(() => navigation.navigate('B'));

  expect(screen.getByText('Screen C (focused)')).not.toBeNull();
});

test('inactiveBehavior="none" keeps effects active when navigating away', async () => {
  let effectActive = false;

  const ScreenA = () => {
    React.useEffect(() => {
      effectActive = true;
      return () => {
        effectActive = false;
      };
    }, []);
    return null;
  };

  const Stack = createStackNavigator<StackParamList>();
  const navigation = createNavigationContainerRef<StackParamList>();

  await render(
    <NavigationContainer ref={navigation}>
      <Stack.Navigator>
        <Stack.Screen
          name="A"
          component={ScreenA}
          options={{ inactiveBehavior: 'none' }}
        />
        <Stack.Screen name="B">{() => null}</Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );

  expect(effectActive).toBe(true);

  await act(() => navigation.navigate('B'));
  await act(() => jest.runAllTimers());

  expect(effectActive).toBe(true);
});

test('default inactiveBehavior="pause" unmounts effects except last 2 screens', async () => {
  let effectActiveA = false;
  let effectActiveB = false;

  const ScreenA = () => {
    React.useEffect(() => {
      effectActiveA = true;
      return () => {
        effectActiveA = false;
      };
    }, []);
    return null;
  };

  const ScreenB = () => {
    React.useEffect(() => {
      effectActiveB = true;
      return () => {
        effectActiveB = false;
      };
    }, []);
    return null;
  };

  const Stack = createStackNavigator<StackParamList>();
  const navigation = createNavigationContainerRef<StackParamList>();

  await render(
    <NavigationContainer ref={navigation}>
      <Stack.Navigator>
        <Stack.Screen name="A" component={ScreenA} />
        <Stack.Screen name="B" component={ScreenB} />
        <Stack.Screen name="C">{() => null}</Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );

  expect(effectActiveA).toBe(true);

  await act(() => navigation.navigate('B'));

  expect(effectActiveA).toBe(true);
  expect(effectActiveB).toBe(true);

  await act(() => jest.runAllTimers());

  expect(effectActiveA).toBe(true);
  expect(effectActiveB).toBe(true);

  await act(() => navigation.navigate('C'));

  expect(effectActiveA).toBe(true);
  expect(effectActiveB).toBe(true);

  await act(() => jest.runAllTimers());

  expect(effectActiveA).toBe(false);
  expect(effectActiveB).toBe(true);
});

test('inactiveBehavior="unmount" keeps screens with nested navigators mounted', async () => {
  const Stack = createStackNavigator<ParentStackParamList>();
  const NestedStack = createStackNavigator<ChildStackParamList>();

  const navigation = createNavigationContainerRef<ParentStackParamList>();
  const user = userEvent.setup();

  const Counter = ({ name }: { name: string }) => {
    const [count, setCount] = React.useState(0);

    return (
      <View>
        <Text>
          {name}: {count}
        </Text>
        <Button onPress={() => setCount((c) => c + 1)} title="Increment" />
      </View>
    );
  };

  const Nested = () => (
    <NestedStack.Navigator>
      <NestedStack.Screen name="X">{() => null}</NestedStack.Screen>
      <NestedStack.Screen name="Y">
        {() => <Counter name="Nested" />}
      </NestedStack.Screen>
    </NestedStack.Navigator>
  );

  await render(
    <NavigationContainer ref={navigation}>
      <Stack.Navigator screenOptions={{ inactiveBehavior: 'unmount' }}>
        <Stack.Screen name="A" component={Nested} />
        <Stack.Screen name="B">{() => <Counter name="Plain" />}</Stack.Screen>
        <Stack.Screen name="C">{() => null}</Stack.Screen>
        <Stack.Screen name="D">{() => null}</Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );

  await act(() => navigation.navigate('A', { screen: 'Y' }));
  await user.press(screen.getByRole('button', { name: 'Increment' }));

  expect(screen.getByText('Nested: 1')).toBeOnTheScreen();

  await act(() => navigation.navigate('B'));
  await user.press(screen.getByRole('button', { name: 'Increment' }));

  expect(screen.getByText('Plain: 1')).toBeOnTheScreen();

  await act(() => navigation.navigate('C'));
  await act(() => navigation.navigate('D'));
  await act(() => jest.runAllTimers());

  await act(() => navigation.dispatch(StackActions.popTo('B')));

  expect(screen.getByText('Plain: 0')).toBeOnTheScreen();

  await act(() => navigation.dispatch(StackActions.popTo('A')));

  expect(screen.getByText('Nested: 1')).toBeOnTheScreen();
});

test('preloading a screen runs effects', async () => {
  let effectActive = false;

  const ScreenB = () => {
    React.useEffect(() => {
      effectActive = true;
      return () => {
        effectActive = false;
      };
    }, []);
    return null;
  };

  const Stack = createStackNavigator<StackParamList>();
  const navigation = createNavigationContainerRef<StackParamList>();

  await render(
    <NavigationContainer ref={navigation}>
      <Stack.Navigator>
        <Stack.Screen name="A">{() => null}</Stack.Screen>
        <Stack.Screen name="B" component={ScreenB} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  expect(effectActive).toBe(false);

  await act(() => navigation.preload('B'));

  expect(effectActive).toBe(true);
});

test('goes back to the parent screen with the nested stack header button', async () => {
  const StackA = createStackNavigator<NestedStackParamList>();

  const StackAScreen = ({ route }: StackScreenProps<StackParamList>) => (
    <StackA.Navigator>
      <StackA.Screen name="D">
        {({ navigation }) => {
          const next = route.name === 'A' ? 'B' : 'A';

          return (
            <Button
              onPress={() => navigation.navigate(next)}
              title={`Go to ${next}`}
            />
          );
        }}
      </StackA.Screen>
    </StackA.Navigator>
  );

  const StackB = createStackNavigator<StackParamList>();

  const user = userEvent.setup();

  await render(
    <NavigationContainer>
      <StackB.Navigator screenOptions={{ headerShown: false }}>
        <StackB.Screen name="A" component={StackAScreen} />
        <StackB.Screen name="B" component={StackAScreen} />
      </StackB.Navigator>
    </NavigationContainer>
  );

  expect(screen.queryByRole('button', { name: 'Go back' })).toBeNull();

  await user.press(screen.getByRole('button', { name: 'Go to B' }));

  expect(screen.getByRole('button', { name: 'A, back' })).not.toBeNull();

  await act(() => jest.runAllTimers());

  await user.press(screen.getByRole('button', { name: 'A, back' }));

  await act(() => jest.runAllTimers());

  expect(screen.getByRole('button', { name: 'Go to B' })).not.toBeNull();
  expect(screen.queryByRole('button', { name: 'Go to A' })).toBeNull();
  expect(screen.queryByRole('button', { name: 'A, back' })).toBeNull();
});

describe('useHeaderSearchBar in stack', () => {
  const CancelSearch = () => {
    const searchBar = useHeaderSearchBar();

    return (
      <Button onPress={() => searchBar.cancelSearch()} title="Cancel search" />
    );
  };

  test.each(['float', 'screen'] as const)(
    'controls the search bar in the header with %s header mode',
    async (headerMode) => {
      const Stack = createStackNavigator<StackParamList>();

      const onClose = jest.fn();
      const user = userEvent.setup();

      await render(
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerMode }}>
            <Stack.Screen
              name="A"
              component={CancelSearch}
              options={{ headerSearchBarOptions: { onClose } }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      );

      await user.press(screen.getByRole('button', { name: 'Search' }));

      expect(screen.getByRole('search')).not.toBeNull();

      await user.press(screen.getByRole('button', { name: 'Cancel search' }));

      expect(onClose).toHaveBeenCalledTimes(1);
    }
  );

  test("controls the parent's search bar from a nested navigator without a header", async () => {
    const Stack = createStackNavigator<ParentStackParamList>();
    const NestedStack = createStackNavigator<ChildStackParamList>();

    const onClose = jest.fn();
    const user = userEvent.setup();

    const Nested = () => (
      <NestedStack.Navigator screenOptions={{ headerShown: false }}>
        <NestedStack.Screen name="X" component={CancelSearch} />
      </NestedStack.Navigator>
    );

    await render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="A"
            component={Nested}
            options={{ headerSearchBarOptions: { onClose } }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );

    await user.press(screen.getByRole('button', { name: 'Search' }));
    await user.press(screen.getByRole('button', { name: 'Cancel search' }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('throws when used outside a navigator', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});

    await expect(render(<CancelSearch />)).rejects.toThrow(
      "Couldn't find the header search bar. Are you inside a screen in a navigator with a header?"
    );
  });
});
