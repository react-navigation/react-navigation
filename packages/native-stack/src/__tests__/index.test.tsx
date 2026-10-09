import {
  afterEach,
  beforeEach,
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';
import { useHeaderHeight } from '@react-navigation/elements';
import { NavigationContainer } from '@react-navigation/native';
import {
  isHiddenFromAccessibility,
  render,
  screen,
  userEvent,
} from '@testing-library/react-native';
import { Button, Platform, Text, View } from 'react-native';
import {
  type HeaderBarButtonItemWithAction,
  type ScreenStackHeaderConfigProps,
} from 'react-native-screens';

import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from '../index';
import { useHeaderConfigProps } from '../views/useHeaderConfigProps';

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
  jest.restoreAllMocks();
});

test('renders a native-stack navigator with screens', async () => {
  const Test = ({
    route,
    navigation,
  }: NativeStackScreenProps<StackParamList>) => (
    <View>
      <Text>Screen {route.name}</Text>
      <Button onPress={() => navigation.navigate('A')} title="Go to A" />
      <Button onPress={() => navigation.navigate('B')} title="Go to B" />
    </View>
  );

  const Stack = createNativeStackNavigator<StackParamList>();
  const user = userEvent.setup();

  await render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="A" component={Test} />
        <Stack.Screen name="B" component={Test} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  expect(isHiddenFromAccessibility(screen.getByText('Screen A'))).toBe(false);
  expect(screen.queryByText('Screen B')).toBeNull();

  await user.press(screen.getByRole('button', { name: /go to b/i }));

  expect(
    isHiddenFromAccessibility(
      screen.getByText('Screen A', { includeHiddenElements: true })
    )
  ).toBe(true);
  expect(isHiddenFromAccessibility(screen.getByText('Screen B'))).toBe(false);
});

describe('useHeaderHeight in native-stack', () => {
  test('returns header height on Android', async () => {
    jest.replaceProperty(Platform, 'OS', 'android');

    let headerHeight;

    const Test = ({ navigation }: NativeStackScreenProps<StackParamList>) => {
      headerHeight = useHeaderHeight();
      return (
        <Button onPress={() => navigation.navigate('B')} title="Go to B" />
      );
    };

    const Stack = createNativeStackNavigator<StackParamList>();

    const user = userEvent.setup();

    await render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="A" component={Test} />
          <Stack.Screen name="B" component={Test} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    expect(headerHeight).toBe(64);

    await user.press(screen.getByRole('button', { name: /go to b/i }));

    expect(headerHeight).toBe(64);
  });

  test('returns header height on iOS', async () => {
    jest.replaceProperty(Platform, 'OS', 'ios');

    let headerHeight;

    const Test = ({ navigation }: NativeStackScreenProps<StackParamList>) => {
      headerHeight = useHeaderHeight();
      return (
        <Button onPress={() => navigation.navigate('B')} title="Go to B" />
      );
    };

    const Stack = createNativeStackNavigator<StackParamList>();

    const user = userEvent.setup();

    await render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="A" component={Test} />
          <Stack.Screen name="B" component={Test} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    expect(headerHeight).toBe(44);

    await user.press(screen.getByRole('button', { name: /go to b/i }));

    expect(headerHeight).toBe(44);
  });

  test('returns header height in modal on iOS', async () => {
    jest.replaceProperty(Platform, 'OS', 'ios');

    let headerHeight;

    const Test = ({ navigation }: NativeStackScreenProps<StackParamList>) => {
      headerHeight = useHeaderHeight();
      return (
        <Button onPress={() => navigation.navigate('B')} title="Go to B" />
      );
    };

    const Stack = createNativeStackNavigator<StackParamList>();

    const user = userEvent.setup();

    await render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="A" component={Test} />
          <Stack.Screen
            name="B"
            component={Test}
            options={{
              presentation: 'modal',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );

    expect(headerHeight).toBe(44);

    await user.press(screen.getByRole('button', { name: /go to b/i }));

    expect(headerHeight).toBe(56);
  });

  test('returns header height with transparent header on iOS', async () => {
    jest.replaceProperty(Platform, 'OS', 'ios');

    let headerHeight;

    const Test = ({ navigation }: NativeStackScreenProps<StackParamList>) => {
      headerHeight = useHeaderHeight();
      return (
        <Button onPress={() => navigation.navigate('B')} title="Go to B" />
      );
    };

    const Stack = createNativeStackNavigator<StackParamList>();

    const user = userEvent.setup();

    await render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="A"
            component={Test}
            options={{
              headerTransparent: true,
            }}
          />
          <Stack.Screen
            name="B"
            component={Test}
            options={{
              presentation: 'modal',
              headerTransparent: true,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );

    expect(headerHeight).toBe(44);

    await user.press(screen.getByRole('button', { name: /go to b/i }));

    expect(headerHeight).toBe(56);
  });

  test('returns header height with transparent header on Android', async () => {
    jest.replaceProperty(Platform, 'OS', 'android');

    let headerHeight;

    const Test = ({ navigation }: NativeStackScreenProps<StackParamList>) => {
      headerHeight = useHeaderHeight();
      return (
        <Button onPress={() => navigation.navigate('B')} title="Go to B" />
      );
    };

    const Stack = createNativeStackNavigator<StackParamList>();

    const user = userEvent.setup();

    await render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="A"
            component={Test}
            options={{
              headerTransparent: true,
            }}
          />
          <Stack.Screen
            name="B"
            component={Test}
            options={{
              presentation: 'modal',
              headerTransparent: true,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );

    expect(headerHeight).toBe(64);

    await user.press(screen.getByRole('button', { name: /go to b/i }));

    expect(headerHeight).toBe(64);
  });

  test("doesn't return header height with headerShown: false on iOS", async () => {
    jest.replaceProperty(Platform, 'OS', 'ios');

    let headerHeight;

    const Test = ({ navigation }: NativeStackScreenProps<StackParamList>) => {
      headerHeight = useHeaderHeight();
      return (
        <Button onPress={() => navigation.navigate('B')} title="Go to B" />
      );
    };

    const Stack = createNativeStackNavigator<StackParamList>();

    const user = userEvent.setup();

    await render(
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

    await user.press(screen.getByRole('button', { name: /go to b/i }));

    expect(headerHeight).toBe(44);
  });

  test("doesn't return header height with headerShown: false on Android", async () => {
    jest.replaceProperty(Platform, 'OS', 'android');

    let headerHeight;

    const Test = ({ navigation }: NativeStackScreenProps<StackParamList>) => {
      headerHeight = useHeaderHeight();
      return (
        <Button onPress={() => navigation.navigate('B')} title="Go to B" />
      );
    };

    const Stack = createNativeStackNavigator<StackParamList>();

    const user = userEvent.setup();

    await render(
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

    await user.press(screen.getByRole('button', { name: /go to b/i }));

    expect(headerHeight).toBe(64);
  });

  test('returns header height in nested stack on iOS', async () => {
    jest.replaceProperty(Platform, 'OS', 'ios');

    let headerHeight;

    const Test = ({ navigation }: NativeStackScreenProps<StackParamList>) => {
      headerHeight = useHeaderHeight();
      return (
        <Button onPress={() => navigation.navigate('B')} title="Go to B" />
      );
    };

    const Stack = createNativeStackNavigator<StackParamList>();
    const NestedStack = createNativeStackNavigator<NestedStackParamList>();

    const user = userEvent.setup();

    await render(
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

    expect(headerHeight).toBe(44);

    await user.press(screen.getByRole('button', { name: /go to b/i }));

    expect(headerHeight).toBe(44);
  });

  test('returns parent header height in nested stack when headerShown: false on iOS', async () => {
    jest.replaceProperty(Platform, 'OS', 'ios');

    let headerHeight;

    const Test = ({ navigation }: NativeStackScreenProps<StackParamList>) => {
      headerHeight = useHeaderHeight();
      return (
        <Button onPress={() => navigation.navigate('B')} title="Go to B" />
      );
    };

    const Stack = createNativeStackNavigator<StackParamList>();
    const NestedStack = createNativeStackNavigator<NestedStackParamList>();

    const user = userEvent.setup();

    await render(
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

    expect(headerHeight).toBe(44);

    await user.press(screen.getByRole('button', { name: /go to b/i }));

    expect(headerHeight).toBe(44);
  });

  test('returns header height 0 in nested stack when headerShown: false on both screens on iOS', async () => {
    jest.replaceProperty(Platform, 'OS', 'ios');

    let headerHeight;

    const Test = ({ navigation }: NativeStackScreenProps<StackParamList>) => {
      headerHeight = useHeaderHeight();
      return (
        <Button onPress={() => navigation.navigate('B')} title="Go to B" />
      );
    };

    const Stack = createNativeStackNavigator<StackParamList>();
    const NestedStack = createNativeStackNavigator<NestedStackParamList>();

    const user = userEvent.setup();

    await render(
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

    await user.press(screen.getByRole('button', { name: /go to b/i }));

    expect(headerHeight).toBe(0);
  });

  test('returns header height in nested stack on Android', async () => {
    jest.replaceProperty(Platform, 'OS', 'android');

    let headerHeight;

    const Test = ({ navigation }: NativeStackScreenProps<StackParamList>) => {
      headerHeight = useHeaderHeight();
      return (
        <Button onPress={() => navigation.navigate('B')} title="Go to B" />
      );
    };

    const Stack = createNativeStackNavigator<StackParamList>();
    const NestedStack = createNativeStackNavigator<NestedStackParamList>();

    const user = userEvent.setup();

    await render(
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

    await user.press(screen.getByRole('button', { name: /go to b/i }));

    expect(headerHeight).toBe(64);
  });

  test('returns parent header height in nested stack when headerShown: false on Android', async () => {
    jest.replaceProperty(Platform, 'OS', 'android');

    let headerHeight;

    const Test = ({ navigation }: NativeStackScreenProps<StackParamList>) => {
      headerHeight = useHeaderHeight();
      return (
        <Button onPress={() => navigation.navigate('B')} title="Go to B" />
      );
    };

    const Stack = createNativeStackNavigator<StackParamList>();
    const NestedStack = createNativeStackNavigator<NestedStackParamList>();

    const user = userEvent.setup();

    await render(
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

    await user.press(screen.getByRole('button', { name: /go to b/i }));

    expect(headerHeight).toBe(64);
  });

  test('returns header height 0 in nested stack when headerShown: false on both screens on Android', async () => {
    jest.replaceProperty(Platform, 'OS', 'android');

    let headerHeight;

    const Test = ({ navigation }: NativeStackScreenProps<StackParamList>) => {
      headerHeight = useHeaderHeight();
      return (
        <Button onPress={() => navigation.navigate('B')} title="Go to B" />
      );
    };

    const Stack = createNativeStackNavigator<StackParamList>();
    const NestedStack = createNativeStackNavigator<NestedStackParamList>();

    const user = userEvent.setup();

    await render(
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

    await user.press(screen.getByRole('button', { name: /go to b/i }));

    expect(headerHeight).toBe(0);
  });
});

describe('header bar button items tintColor', () => {
  test('does not set tintColor on items by default when headerTintColor is not provided', async () => {
    let headerConfig: ScreenStackHeaderConfigProps | undefined;

    const Test = () => {
      headerConfig = useHeaderConfigProps({
        route: { key: 'A', name: 'A' },
        headerHeight: 44,
        headerBack: undefined,
        unstable_headerRightItems: () => [
          {
            type: 'button',
            label: 'Save',
            onPress: () => {},
          },
        ],
      });

      return null;
    };

    await render(
      <NavigationContainer>
        <Test />
      </NavigationContainer>
    );

    expect(
      (
        headerConfig
          ?.headerRightBarButtonItems?.[0] as HeaderBarButtonItemWithAction
      )?.tintColor
    ).toBeUndefined();
  });

  test('applies explicit headerTintColor to items when provided', async () => {
    let headerConfig: ScreenStackHeaderConfigProps | undefined;

    const Test = () => {
      headerConfig = useHeaderConfigProps({
        route: { key: 'A', name: 'A' },
        headerHeight: 44,
        headerBack: undefined,
        headerTintColor: 'tomato',
        unstable_headerRightItems: () => [
          {
            type: 'button',
            label: 'Save',
            onPress: () => {},
          },
        ],
      });

      return null;
    };

    await render(
      <NavigationContainer>
        <Test />
      </NavigationContainer>
    );

    expect(
      (
        headerConfig
          ?.headerRightBarButtonItems?.[0] as HeaderBarButtonItemWithAction
      )?.tintColor
    ).toBe('tomato');
  });

  test('preserves item-level tintColor override over headerTintColor', async () => {
    let headerConfig: ScreenStackHeaderConfigProps | undefined;

    const Test = () => {
      headerConfig = useHeaderConfigProps({
        route: { key: 'A', name: 'A' },
        headerHeight: 44,
        headerBack: undefined,
        headerTintColor: 'tomato',
        unstable_headerRightItems: () => [
          {
            type: 'button',
            label: 'Delete',
            tintColor: 'red',
            onPress: () => {},
          },
        ],
      });

      return null;
    };

    await render(
      <NavigationContainer>
        <Test />
      </NavigationContainer>
    );

    expect(
      (
        headerConfig
          ?.headerRightBarButtonItems?.[0] as HeaderBarButtonItemWithAction
      )?.tintColor
    ).toBe('red');
  });
});
