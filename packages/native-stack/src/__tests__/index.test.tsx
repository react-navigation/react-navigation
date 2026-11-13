import {
  afterEach,
  beforeEach,
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';
import {
  getHeaderTitle,
  Text,
  useHeaderHeight,
} from '@react-navigation/elements';
import { NavigationContainer } from '@react-navigation/native';
import {
  fireEvent,
  isHiddenFromAccessibility,
  render,
  screen,
  userEvent,
} from '@testing-library/react-native';
import { Button, Platform, View } from 'react-native';

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

  const { getByText, queryByText } = render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="A" component={Test} />
        <Stack.Screen name="B" component={Test} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  expect(isHiddenFromAccessibility(getByText('Screen A'))).toBe(false);
  expect(queryByText('Screen B')).toBeNull();

  fireEvent.press(getByText(/go to b/i));

  expect(isHiddenFromAccessibility(queryByText('Screen A'))).toBe(true);
  expect(isHiddenFromAccessibility(getByText('Screen B'))).toBe(false);
});

test('renders a custom header with left and right buttons', async () => {
  const Stack = createNativeStackNavigator<StackParamList>();

  const user = userEvent.setup();

  const onPressLeft = jest.fn();
  const onPressRight = jest.fn();

  render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="A"
          options={{
            header: ({ options, route, back }) => (
              <View>
                {options.headerLeft?.({ canGoBack: back != null })}
                <Text>{getHeaderTitle(options, route.name)}</Text>
                {options.headerRight?.({ canGoBack: back != null })}
              </View>
            ),
            headerTitle: 'Edit profile',
            headerLeft: () => <Button title="Cancel" onPress={onPressLeft} />,
            headerRight: () => <Button title="Save" onPress={onPressRight} />,
          }}
        >
          {() => <Text>Profile</Text>}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );

  expect(screen.getByText('Edit profile')).toBeOnTheScreen();
  expect(screen.getByText('Cancel')).toBeOnTheScreen();
  expect(screen.getByText('Save')).toBeOnTheScreen();

  await user.press(screen.getByText('Cancel'));

  expect(onPressLeft).toHaveBeenCalledTimes(1);

  await user.press(screen.getByText('Save'));

  expect(onPressRight).toHaveBeenCalledTimes(1);
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

    const { findByText } = render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="A" component={Test} />
          <Stack.Screen name="B" component={Test} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    expect(headerHeight).toBe(64);
    fireEvent.press(await findByText(/go to b/i));
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

    const { findByText } = render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="A" component={Test} />
          <Stack.Screen name="B" component={Test} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    expect(headerHeight).toBe(44);
    fireEvent.press(await findByText(/go to b/i));
    expect(headerHeight).toBe(44);
  });

  test('returns header height on Web', async () => {
    jest.replaceProperty(Platform, 'OS', 'web');

    let headerHeight;
    const Test = ({ navigation }: NativeStackScreenProps<StackParamList>) => {
      headerHeight = useHeaderHeight();
      return (
        <Button onPress={() => navigation.navigate('B')} title="Go to B" />
      );
    };

    const Stack = createNativeStackNavigator<StackParamList>();

    const { findByText } = render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="A" component={Test} />
          <Stack.Screen name="B" component={Test} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    expect(headerHeight).toBe(64);
    fireEvent.press(await findByText(/go to b/i));
    expect(headerHeight).toBe(64);
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

    const { findByText } = render(
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
    fireEvent.press(await findByText(/go to b/i));
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

    const { findByText } = render(
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
    fireEvent.press(await findByText(/go to b/i));
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

    const { findByText } = render(
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
    fireEvent.press(await findByText(/go to b/i));
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

    const { findByText } = render(
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
    fireEvent.press(await findByText(/go to b/i));
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

    const { findByText } = render(
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
    fireEvent.press(await findByText(/go to b/i));
    expect(headerHeight).toBe(64);
  });

  test("doesn't return header height with headerShown: false on Web", async () => {
    jest.replaceProperty(Platform, 'OS', 'web');

    let headerHeight;
    const Test = ({ navigation }: NativeStackScreenProps<StackParamList>) => {
      headerHeight = useHeaderHeight();
      return (
        <Button onPress={() => navigation.navigate('B')} title="Go to B" />
      );
    };

    const Stack = createNativeStackNavigator<StackParamList>();

    const { findByText } = render(
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
    fireEvent.press(await findByText(/go to b/i));
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

    const { findByText } = render(
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
    fireEvent.press(await findByText(/go to b/i));
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

    const { findByText } = render(
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
    fireEvent.press(await findByText(/go to b/i));
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

    const { findByText } = render(
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
    fireEvent.press(await findByText(/go to b/i));
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

    const { findByText } = render(
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
    fireEvent.press(await findByText(/go to b/i));
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

    const { findByText } = render(
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
    fireEvent.press(await findByText(/go to b/i));
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

    const { findByText } = render(
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
    fireEvent.press(await findByText(/go to b/i));
    expect(headerHeight).toBe(0);
  });

  test('returns header height in nested stack on Web', async () => {
    jest.replaceProperty(Platform, 'OS', 'web');

    let headerHeight;
    const Test = ({ navigation }: NativeStackScreenProps<StackParamList>) => {
      headerHeight = useHeaderHeight();
      return (
        <Button onPress={() => navigation.navigate('B')} title="Go to B" />
      );
    };

    const Stack = createNativeStackNavigator<StackParamList>();
    const NestedStack = createNativeStackNavigator<NestedStackParamList>();

    const { findByText } = render(
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
    fireEvent.press(await findByText(/go to b/i));
    expect(headerHeight).toBe(64);
  });

  test('returns parent header height in nested stack when headerShown: false on Web', async () => {
    jest.replaceProperty(Platform, 'OS', 'web');

    let headerHeight;
    const Test = ({ navigation }: NativeStackScreenProps<StackParamList>) => {
      headerHeight = useHeaderHeight();
      return (
        <Button onPress={() => navigation.navigate('B')} title="Go to B" />
      );
    };

    const Stack = createNativeStackNavigator<StackParamList>();
    const NestedStack = createNativeStackNavigator<NestedStackParamList>();

    const { findByText } = render(
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
    fireEvent.press(await findByText(/go to b/i));
    expect(headerHeight).toBe(64);
  });

  test('returns header height 0 in nested stack when headerShown: false on both screens on Web', async () => {
    jest.replaceProperty(Platform, 'OS', 'web');

    let headerHeight;
    const Test = ({ navigation }: NativeStackScreenProps<StackParamList>) => {
      headerHeight = useHeaderHeight();
      return (
        <Button onPress={() => navigation.navigate('B')} title="Go to B" />
      );
    };

    const Stack = createNativeStackNavigator<StackParamList>();
    const NestedStack = createNativeStackNavigator<NestedStackParamList>();

    const { findByText } = render(
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
    fireEvent.press(await findByText(/go to b/i));
    expect(headerHeight).toBe(0);
  });
});
