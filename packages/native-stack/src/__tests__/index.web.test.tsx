import {
  afterEach,
  beforeEach,
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';
import { useHeaderHeight } from '@react-navigation/elements';
import {
  createNavigationContainerRef,
  NavigationContainer,
  type NavigatorScreenParams,
  StackActions,
} from '@react-navigation/native';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { Button, Text, View } from 'react-native';

import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from '../index';

type StackParamList = {
  A: undefined;
  B: undefined;
};

type NestedStackParamList = {
  C: undefined;
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

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

test('inactiveBehavior="unmount" keeps screens with nested navigators mounted', async () => {
  const Stack = createNativeStackNavigator<ParentStackParamList>();
  const NestedStack = createNativeStackNavigator<ChildStackParamList>();

  const navigation = createNavigationContainerRef<ParentStackParamList>();
  const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

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

  render(
    <NavigationContainer ref={navigation}>
      <Stack.Navigator screenOptions={{ inactiveBehavior: 'unmount' }}>
        <Stack.Screen name="A" component={Nested} />
        <Stack.Screen name="B">{() => <Counter name="Plain" />}</Stack.Screen>
        <Stack.Screen name="C">{() => null}</Stack.Screen>
        <Stack.Screen name="D">{() => null}</Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );

  act(() => navigation.navigate('A', { screen: 'Y' }));
  await user.click(screen.getByRole('button', { name: 'Increment' }));

  expect(screen.getByText('Nested: 1')).toBeTruthy();

  act(() => navigation.navigate('B'));
  await user.click(screen.getByRole('button', { name: 'Increment' }));

  expect(screen.getByText('Plain: 1')).toBeTruthy();

  act(() => navigation.navigate('C'));
  act(() => navigation.navigate('D'));
  act(() => jest.runAllTimers());

  act(() => navigation.dispatch(StackActions.popTo('B')));

  expect(screen.getByText('Plain: 0')).toBeTruthy();

  act(() => navigation.dispatch(StackActions.popTo('A')));

  expect(screen.getByText('Nested: 1')).toBeTruthy();
});

describe('useHeaderHeight in native-stack', () => {
  test('returns header height on Web', async () => {
    let headerHeight;

    const Test = ({ navigation }: NativeStackScreenProps<StackParamList>) => {
      headerHeight = useHeaderHeight();
      return (
        <Button onPress={() => navigation.navigate('B')} title="Go to B" />
      );
    };

    const Stack = createNativeStackNavigator<StackParamList>();

    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="A" component={Test} />
          <Stack.Screen name="B" component={Test} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    expect(headerHeight).toBe(64);

    await user.click(screen.getByRole('button', { name: /go to b/i }));

    expect(headerHeight).toBe(64);
  });

  test("doesn't return header height with headerShown: false on Web", async () => {
    let headerHeight;

    const Test = ({ navigation }: NativeStackScreenProps<StackParamList>) => {
      headerHeight = useHeaderHeight();
      return (
        <Button onPress={() => navigation.navigate('B')} title="Go to B" />
      );
    };

    const Stack = createNativeStackNavigator<StackParamList>();

    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="A"
            component={Test}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="B" component={Test} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    expect(headerHeight).toBe(0);

    await user.click(screen.getByRole('button', { name: /go to b/i }));

    expect(headerHeight).toBe(64);
  });

  test('returns header height in nested stack on Web', async () => {
    let headerHeight;

    const Test = ({ navigation }: NativeStackScreenProps<StackParamList>) => {
      headerHeight = useHeaderHeight();
      return (
        <Button onPress={() => navigation.navigate('B')} title="Go to B" />
      );
    };

    const Stack = createNativeStackNavigator<StackParamList>();
    const NestedStack = createNativeStackNavigator<NestedStackParamList>();

    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="A" component={Test} />
          <Stack.Screen name="B">
            {() => (
              <NestedStack.Navigator>
                <NestedStack.Screen name="C" component={Test} />
              </NestedStack.Navigator>
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    );

    expect(headerHeight).toBe(64);

    await user.click(screen.getByRole('button', { name: /go to b/i }));

    expect(headerHeight).toBe(64);
  });

  test('returns parent header height in nested stack when headerShown: false on Web', async () => {
    let headerHeight;

    const Test = ({ navigation }: NativeStackScreenProps<StackParamList>) => {
      headerHeight = useHeaderHeight();
      return (
        <Button onPress={() => navigation.navigate('B')} title="Go to B" />
      );
    };

    const Stack = createNativeStackNavigator<StackParamList>();
    const NestedStack = createNativeStackNavigator<NestedStackParamList>();

    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="A" component={Test} />
          <Stack.Screen name="B">
            {() => (
              <NestedStack.Navigator>
                <NestedStack.Screen
                  name="C"
                  component={Test}
                  options={{ headerShown: false }}
                />
              </NestedStack.Navigator>
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    );

    expect(headerHeight).toBe(64);

    await user.click(screen.getByRole('button', { name: /go to b/i }));

    expect(headerHeight).toBe(64);
  });

  test('returns header height 0 in nested stack when headerShown: false on both screens on Web', async () => {
    let headerHeight;

    const Test = ({ navigation }: NativeStackScreenProps<StackParamList>) => {
      headerHeight = useHeaderHeight();
      return (
        <Button onPress={() => navigation.navigate('B')} title="Go to B" />
      );
    };

    const Stack = createNativeStackNavigator<StackParamList>();
    const NestedStack = createNativeStackNavigator<NestedStackParamList>();

    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="A" component={Test} />
          <Stack.Screen name="B">
            {() => (
              <NestedStack.Navigator screenOptions={{ headerShown: false }}>
                <NestedStack.Screen name="C" component={Test} />
              </NestedStack.Navigator>
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    );

    expect(headerHeight).toBe(0);

    await user.click(screen.getByRole('button', { name: /go to b/i }));

    expect(headerHeight).toBe(0);
  });
});
