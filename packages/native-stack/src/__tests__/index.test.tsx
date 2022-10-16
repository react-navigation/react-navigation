import { useHeaderHeight } from '@react-navigation/elements';
import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import {
  fireEvent,
  isHiddenFromAccessibility,
  render,
} from '@testing-library/react-native';
import * as React from 'react';
import { Button, Platform, Text, View } from 'react-native';

import { createNativeStackNavigator, NativeStackScreenProps } from '../index';

jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  ...jest.requireActual('react-native/Libraries/Utilities/Platform'),
  OS: 'ios',
}));

jest.mock('react-native-safe-area-context', () => ({
  ...jest.requireActual('react-native-safe-area-context'),
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

it('renders a native-stack navigator with screens', async () => {
  const Test = ({
    route,
    navigation,
  }: NativeStackScreenProps<ParamListBase>) => (
    <View>
      <Text>Screen {route.name}</Text>
      <Button onPress={() => navigation.navigate('A')} title="Go to A" />
      <Button onPress={() => navigation.navigate('B')} title="Go to B" />
    </View>
  );

  const Stack = createNativeStackNavigator();

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

  expect(isVisible(getByText('Screen A'))).toBe(false);
  expect(isVisible(getByText('Screen B'))).toBe(true);
});

describe('useHeaderHeight in native-stack', () => {
  it('returns header height on Android', async () => {
    Platform.OS = 'android';

    let headerHeight;
    const Test = ({ navigation }: NativeStackScreenProps<ParamListBase>) => {
      headerHeight = useHeaderHeight();
      return (
        <Button onPress={() => navigation.navigate('B')} title="Go to B" />
      );
    };

    const Stack = createNativeStackNavigator();

    const { findByText } = render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="A" component={Test} />
          <Stack.Screen name="B" component={Test} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    expect(headerHeight).toBe(56);
    fireEvent.press(await findByText(/go to b/i));
    expect(headerHeight).toBe(56);
  });

  it('returns header height on iOS', async () => {
    Platform.OS = 'ios';

    let headerHeight;
    const Test = ({ navigation }: NativeStackScreenProps<ParamListBase>) => {
      headerHeight = useHeaderHeight();
      return (
        <Button onPress={() => navigation.navigate('B')} title="Go to B" />
      );
    };

    const Stack = createNativeStackNavigator();

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

  it('returns header height on Web', async () => {
    Platform.OS = 'web';

    let headerHeight;
    const Test = ({ navigation }: NativeStackScreenProps<ParamListBase>) => {
      headerHeight = useHeaderHeight();
      return (
        <Button onPress={() => navigation.navigate('B')} title="Go to B" />
      );
    };

    const Stack = createNativeStackNavigator();

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

  it('returns header height in modal on iOS', async () => {
    Platform.OS = 'ios';

    let headerHeight;
    const Test = ({ navigation }: NativeStackScreenProps<ParamListBase>) => {
      headerHeight = useHeaderHeight();
      return (
        <Button onPress={() => navigation.navigate('B')} title="Go to B" />
      );
    };

    const Stack = createNativeStackNavigator();

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

  it('returns header height with transparent header on iOS', async () => {
    Platform.OS = 'ios';

    let headerHeight;
    const Test = ({ navigation }: NativeStackScreenProps<ParamListBase>) => {
      headerHeight = useHeaderHeight();
      return (
        <Button onPress={() => navigation.navigate('B')} title="Go to B" />
      );
    };

    const Stack = createNativeStackNavigator();

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

  it('returns header height with transparent header on Android', async () => {
    Platform.OS = 'android';

    let headerHeight;
    const Test = ({ navigation }: NativeStackScreenProps<ParamListBase>) => {
      headerHeight = useHeaderHeight();
      return (
        <Button onPress={() => navigation.navigate('B')} title="Go to B" />
      );
    };

    const Stack = createNativeStackNavigator();

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

    expect(headerHeight).toBe(56);
    fireEvent.press(await findByText(/go to b/i));
    expect(headerHeight).toBe(56);
  });

  it("doesn't return header height with headerShown: false on iOS", async () => {
    Platform.OS = 'ios';

    let headerHeight;
    const Test = ({ navigation }: NativeStackScreenProps<ParamListBase>) => {
      headerHeight = useHeaderHeight();
      return (
        <Button onPress={() => navigation.navigate('B')} title="Go to B" />
      );
    };

    const Stack = createNativeStackNavigator();

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

  it("doesn't return header height with headerShown: false on Android", async () => {
    Platform.OS = 'android';

    let headerHeight;
    const Test = ({ navigation }: NativeStackScreenProps<ParamListBase>) => {
      headerHeight = useHeaderHeight();
      return (
        <Button onPress={() => navigation.navigate('B')} title="Go to B" />
      );
    };

    const Stack = createNativeStackNavigator();

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
    expect(headerHeight).toBe(56);
  });

  it("doesn't return header height with headerShown: false on Web", async () => {
    Platform.OS = 'web';

    let headerHeight;
    const Test = ({ navigation }: NativeStackScreenProps<ParamListBase>) => {
      headerHeight = useHeaderHeight();
      return (
        <Button onPress={() => navigation.navigate('B')} title="Go to B" />
      );
    };

    const Stack = createNativeStackNavigator();

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

  it('returns header height in nested stack on iOS', async () => {
    Platform.OS = 'ios';

    let headerHeight;
    const Test = ({ navigation }: NativeStackScreenProps<ParamListBase>) => {
      headerHeight = useHeaderHeight();
      return (
        <Button onPress={() => navigation.navigate('B')} title="Go to B" />
      );
    };

    const Stack = createNativeStackNavigator();
    const NestedStack = createNativeStackNavigator();

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

  it('returns parent header height in nested stack when headerShown: false on iOS', async () => {
    Platform.OS = 'ios';

    let headerHeight;
    const Test = ({ navigation }: NativeStackScreenProps<ParamListBase>) => {
      headerHeight = useHeaderHeight();
      return (
        <Button onPress={() => navigation.navigate('B')} title="Go to B" />
      );
    };

    const Stack = createNativeStackNavigator();
    const NestedStack = createNativeStackNavigator();

    const { findByText } = render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="A" component={Test} />
          <Stack.Screen name="B">
            {() => (
              <NestedStack.Navigator>
                <NestedStack.Screen
                  name="third"
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

  it('returns header height 0 in nested stack when headerShown: false on both screens on iOS', async () => {
    Platform.OS = 'ios';

    let headerHeight;
    const Test = ({ navigation }: NativeStackScreenProps<ParamListBase>) => {
      headerHeight = useHeaderHeight();
      return (
        <Button onPress={() => navigation.navigate('B')} title="Go to B" />
      );
    };

    const Stack = createNativeStackNavigator();
    const NestedStack = createNativeStackNavigator();

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

  it('returns header height in nested stack on Android', async () => {
    Platform.OS = 'android';

    let headerHeight;
    const Test = ({ navigation }: NativeStackScreenProps<ParamListBase>) => {
      headerHeight = useHeaderHeight();
      return (
        <Button onPress={() => navigation.navigate('B')} title="Go to B" />
      );
    };

    const Stack = createNativeStackNavigator();
    const NestedStack = createNativeStackNavigator();

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

    expect(headerHeight).toBe(56);
    fireEvent.press(await findByText(/go to b/i));
    expect(headerHeight).toBe(56);
  });

  it('returns parent header height in nested stack when headerShown: false on Android', async () => {
    Platform.OS = 'android';

    let headerHeight;
    const Test = ({ navigation }: NativeStackScreenProps<ParamListBase>) => {
      headerHeight = useHeaderHeight();
      return (
        <Button onPress={() => navigation.navigate('B')} title="Go to B" />
      );
    };

    const Stack = createNativeStackNavigator();
    const NestedStack = createNativeStackNavigator();

    const { findByText } = render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="A" component={Test} />
          <Stack.Screen name="B">
            {() => (
              <NestedStack.Navigator>
                <NestedStack.Screen
                  name="third"
                  component={Test}
                  options={{ headerShown: false }}
                />
              </NestedStack.Navigator>
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    );

    expect(headerHeight).toBe(56);
    fireEvent.press(await findByText(/go to b/i));
    expect(headerHeight).toBe(56);
  });

  it('returns header height 0 in nested stack when headerShown: false on both screens on Android', async () => {
    Platform.OS = 'android';

    let headerHeight;
    const Test = ({ navigation }: NativeStackScreenProps<ParamListBase>) => {
      headerHeight = useHeaderHeight();
      return (
        <Button onPress={() => navigation.navigate('B')} title="Go to B" />
      );
    };

    const Stack = createNativeStackNavigator();
    const NestedStack = createNativeStackNavigator();

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

  it('returns header height in nested stack on Web', async () => {
    Platform.OS = 'web';

    let headerHeight;
    const Test = ({ navigation }: NativeStackScreenProps<ParamListBase>) => {
      headerHeight = useHeaderHeight();
      return (
        <Button onPress={() => navigation.navigate('B')} title="Go to B" />
      );
    };

    const Stack = createNativeStackNavigator();
    const NestedStack = createNativeStackNavigator();

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

  it('returns parent header height in nested stack when headerShown: false on Web', async () => {
    Platform.OS = 'web';

    let headerHeight;
    const Test = ({ navigation }: NativeStackScreenProps<ParamListBase>) => {
      headerHeight = useHeaderHeight();
      return (
        <Button onPress={() => navigation.navigate('B')} title="Go to B" />
      );
    };

    const Stack = createNativeStackNavigator();
    const NestedStack = createNativeStackNavigator();

    const { findByText } = render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="A" component={Test} />
          <Stack.Screen name="B">
            {() => (
              <NestedStack.Navigator>
                <NestedStack.Screen
                  name="third"
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

  it('returns header height 0 in nested stack when headerShown: false on both screens on Web', async () => {
    Platform.OS = 'web';

    let headerHeight;
    const Test = ({ navigation }: NativeStackScreenProps<ParamListBase>) => {
      headerHeight = useHeaderHeight();
      return (
        <Button onPress={() => navigation.navigate('B')} title="Go to B" />
      );
    };

    const Stack = createNativeStackNavigator();
    const NestedStack = createNativeStackNavigator();

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
