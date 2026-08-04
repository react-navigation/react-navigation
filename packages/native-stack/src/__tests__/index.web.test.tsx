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
} from '@react-navigation/native';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { Button } from 'react-native';

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

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

test('inactiveBehavior="pauseWhenCovered" pauses the screen when it is covered', async () => {
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

  const Stack = createNativeStackNavigator<StackParamList>();
  const navigation = createNavigationContainerRef<StackParamList>();

  render(
    <NavigationContainer ref={navigation}>
      <Stack.Navigator>
        <Stack.Screen
          name="A"
          component={ScreenA}
          options={{ inactiveBehavior: 'pauseWhenCovered' }}
        />
        <Stack.Screen name="B" options={{ presentation: 'transparentModal' }}>
          {() => null}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );

  expect(effectActive).toBe(true);

  await act(async () => {
    navigation.navigate('B');
  });

  await act(async () => {
    jest.runAllTimers();
  });

  // Unlike `pause`, the screen is paused even though it's visible under the modal
  expect(effectActive).toBe(false);

  await act(async () => {
    navigation.goBack();
  });

  await act(async () => {
    jest.runAllTimers();
  });

  expect(effectActive).toBe(true);
});

test('inactiveBehavior="pauseWhenCovered" pauses the screen when a parent navigator is covered', async () => {
  let effectActive = false;

  const ScreenC = () => {
    React.useEffect(() => {
      effectActive = true;

      return () => {
        effectActive = false;
      };
    }, []);

    return null;
  };

  const Stack = createNativeStackNavigator<StackParamList>();
  const NestedStack = createNativeStackNavigator<NestedStackParamList>();
  const navigation = createNavigationContainerRef<StackParamList>();

  render(
    <NavigationContainer ref={navigation}>
      <Stack.Navigator>
        <Stack.Screen name="A">
          {() => (
            <NestedStack.Navigator>
              <NestedStack.Screen
                name="C"
                component={ScreenC}
                options={{ inactiveBehavior: 'pauseWhenCovered' }}
              />
            </NestedStack.Navigator>
          )}
        </Stack.Screen>
        <Stack.Screen name="B" options={{ presentation: 'transparentModal' }}>
          {() => null}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );

  expect(effectActive).toBe(true);

  await act(async () => {
    navigation.navigate('B');
  });

  await act(async () => {
    jest.runAllTimers();
  });

  // The nested screen is still focused in its own stack
  expect(effectActive).toBe(false);

  await act(async () => {
    navigation.goBack();
  });

  await act(async () => {
    jest.runAllTimers();
  });

  expect(effectActive).toBe(true);
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
