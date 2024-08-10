import { afterEach, describe, expect, jest, test } from '@jest/globals';
import { Text, useHeaderHeight } from '@react-navigation/elements';
import { NavigationContainer } from '@react-navigation/native';
import {
  fireEvent,
  isHiddenFromAccessibility,
  render,
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

jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  ...jest.requireActual<
    typeof import('react-native/Libraries/Utilities/Platform')
  >('react-native/Libraries/Utilities/Platform'),
  OS: 'ios',
}));

jest.mock('react-native-safe-area-context', () => ({
  ...jest.requireActual<typeof import('react-native-safe-area-context')>(
    'react-native-safe-area-context'
  ),
  // eslint-disable-next-line @eslint-react/hooks-extra/ensure-custom-hooks-using-other-hooks
  useSafeAreaInsets: () => ({
    top: 0,
  }),
}));

/**
 * Check if the element is "visible" (not hidden) from accessibility.
 */
const isVisible = (element: any) => {
  return !isHiddenFromAccessibility(element);
};

afterEach(() => {
  jest.resetAllMocks();
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

  expect(isVisible(getByText('Screen A'))).toBe(true);
  expect(queryByText('Screen B')).toBeNull();

  fireEvent.press(getByText(/go to b/i));

  expect(isVisible(queryByText('Screen A'))).toBe(false);
  expect(isVisible(getByText('Screen B'))).toBe(true);
});

describe('useHeaderHeight in native-stack', () => {
  test('returns header height on Android', async () => {
    Platform.OS = 'android';

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
    Platform.OS = 'ios';

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
    Platform.OS = 'web';

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
    Platform.OS = 'ios';

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
    Platform.OS = 'ios';

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
    Platform.OS = 'android';

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
    Platform.OS = 'ios';

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
    Platform.OS = 'android';

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
    Platform.OS = 'web';

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
    Platform.OS = 'ios';

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
    Platform.OS = 'ios';

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
    Platform.OS = 'ios';

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
    Platform.OS = 'android';

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
    Platform.OS = 'android';

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
    Platform.OS = 'android';

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
    Platform.OS = 'web';

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
    Platform.OS = 'web';

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
    Platform.OS = 'web';

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
