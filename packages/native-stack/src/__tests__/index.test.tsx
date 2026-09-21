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
  CommonActions,
  createNavigationContainerRef,
  NavigationContainer,
  StackActions,
} from '@react-navigation/native';
import {
  act,
  fireEvent,
  isHiddenFromAccessibility,
  render,
  screen,
  userEvent,
} from '@testing-library/react-native';
import { Button, Platform, Text, View } from 'react-native';

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

test('keeps a newly pushed screen when an earlier screen finishes dismissing', async () => {
  type ParamList = {
    A: undefined;
    B: undefined;
    C: undefined;
  };

  const Stack = createNativeStackNavigator<ParamList>();

  const navigation = createNavigationContainerRef<ParamList>();

  const Test = ({ route }: NativeStackScreenProps<ParamList>) => (
    <Text>Screen {route.name}</Text>
  );

  await render(
    <NavigationContainer
      ref={navigation}
      initialState={{
        index: 1,
        routes: [{ name: 'A' }, { name: 'B' }],
      }}
    >
      <Stack.Navigator>
        <Stack.Screen name="A" component={Test} />
        <Stack.Screen name="B" component={Test} />
        <Stack.Screen name="C" component={Test} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  await act(() => navigation.dispatch(StackActions.push('C')));

  await fireEvent(
    screen.getByText('Screen B', { includeHiddenElements: true }),
    'dismissed',
    { nativeEvent: { dismissCount: 1 } }
  );

  expect(navigation.getRootState()?.routes.map((route) => route.name)).toEqual([
    'A',
    'C',
  ]);

  expect(isHiddenFromAccessibility(screen.getByText('Screen C'))).toBe(false);
});

test('keeps a newly pushed screen when multiple screens finish dismissing', async () => {
  type ParamList = {
    A: undefined;
    B: undefined;
    C: { value: number };
    D: undefined;
  };

  const Stack = createNativeStackNavigator<ParamList>();

  const navigation = createNavigationContainerRef<ParamList>();

  const Test = ({ route }: NativeStackScreenProps<ParamList>) => (
    <Text>Screen {route.name}</Text>
  );

  await render(
    <NavigationContainer
      ref={navigation}
      initialState={{
        index: 2,
        routes: [
          { name: 'A' },
          { name: 'B' },
          { name: 'C', params: { value: 1 } },
        ],
      }}
    >
      <Stack.Navigator>
        <Stack.Screen name="A" component={Test} />
        <Stack.Screen name="B" component={Test} />
        <Stack.Screen name="C" component={Test} />
        <Stack.Screen name="D" component={Test} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  await act(() => navigation.dispatch(CommonActions.pushParams({ value: 2 })));

  await act(() => navigation.dispatch(StackActions.push('D')));

  await fireEvent(
    screen.getByText('Screen C', { includeHiddenElements: true }),
    'dismissed',
    { nativeEvent: { dismissCount: 2 } }
  );

  expect(isHiddenFromAccessibility(screen.getByText('Screen D'))).toBe(false);
  expect(
    screen.queryByText('Screen B', { includeHiddenElements: true })
  ).toBeNull();
  expect(
    screen.queryByText('Screen C', { includeHiddenElements: true })
  ).toBeNull();

  await act(() => navigation.goBack());

  expect(isHiddenFromAccessibility(screen.getByText('Screen A'))).toBe(false);
});

test('preserves retained and preloaded screens when multiple screens are dismissed', async () => {
  type ParamList = {
    A: undefined;
    B: undefined;
    C: undefined;
    D: undefined;
    E: undefined;
  };

  const Stack = createNativeStackNavigator<ParamList>();

  const navigation = createNavigationContainerRef<ParamList>();

  const Test = ({ route }: NativeStackScreenProps<ParamList>) => (
    <Text>Screen {route.name}</Text>
  );

  await render(
    <NavigationContainer
      ref={navigation}
      initialState={{
        index: 2,
        routes: [{ name: 'A' }, { name: 'B' }, { name: 'C' }],
      }}
    >
      <Stack.Navigator>
        <Stack.Screen name="A" component={Test} />
        <Stack.Screen name="B" component={Test} />
        <Stack.Screen name="C" component={Test} />
        <Stack.Screen name="D" component={Test} />
        <Stack.Screen name="E" component={Test} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  await act(() => navigation.preload('D'));

  const preloadedRoute = navigation
    .getRootState()
    ?.routes.find((route) => route.name === 'D');

  await act(() =>
    navigation.dispatch({
      ...StackActions.retain(true),
      source: preloadedRoute?.key,
    })
  );

  await act(() => navigation.preload('E'));

  await fireEvent(screen.getByText('Screen C'), 'dismissed', {
    nativeEvent: { dismissCount: 2 },
  });

  expect(isHiddenFromAccessibility(screen.getByText('Screen A'))).toBe(false);
  expect(
    isHiddenFromAccessibility(
      screen.getByText('Screen D', { includeHiddenElements: true })
    )
  ).toBe(true);
  expect(
    isHiddenFromAccessibility(
      screen.getByText('Screen E', { includeHiddenElements: true })
    )
  ).toBe(true);
  expect(
    screen.queryByText('Screen C', { includeHiddenElements: true })
  ).toBeNull();
});

test('preserves the first screen when a dismissed screen has already been removed', async () => {
  type ParamList = {
    A: undefined;
    B: undefined;
    C: undefined;
    D: undefined;
  };

  const Stack = createNativeStackNavigator<ParamList>();

  const navigation = createNavigationContainerRef<ParamList>();

  const Test = ({ route }: NativeStackScreenProps<ParamList>) => (
    <Text>Screen {route.name}</Text>
  );

  await render(
    <NavigationContainer
      ref={navigation}
      initialState={{
        index: 2,
        routes: [{ name: 'A' }, { name: 'B' }, { name: 'C' }],
      }}
    >
      <Stack.Navigator>
        <Stack.Screen name="A" component={Test} />
        <Stack.Screen name="B" component={Test} />
        <Stack.Screen name="C" component={Test} />
        <Stack.Screen name="D" component={Test} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  await act(() => navigation.dispatch(StackActions.remove('B')));

  await act(() => navigation.dispatch(StackActions.push('D')));

  await fireEvent(
    screen.getByText('Screen C', { includeHiddenElements: true }),
    'dismissed',
    { nativeEvent: { dismissCount: 2 } }
  );

  expect(isHiddenFromAccessibility(screen.getByText('Screen D'))).toBe(false);
  expect(
    screen.queryByText('Screen B', { includeHiddenElements: true })
  ).toBeNull();
  expect(
    screen.queryByText('Screen C', { includeHiddenElements: true })
  ).toBeNull();

  await act(() => navigation.goBack());

  expect(isHiddenFromAccessibility(screen.getByText('Screen A'))).toBe(false);
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
