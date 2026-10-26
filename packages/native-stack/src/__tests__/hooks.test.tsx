import { afterEach, beforeEach, expect, jest, test } from '@jest/globals';
import { useHeaderSearchBar } from '@react-navigation/elements';
import {
  NavigationContainer,
  type NavigatorScreenParams,
} from '@react-navigation/native';
import { act, render, screen, userEvent } from '@testing-library/react-native';
import * as React from 'react';
import { Button } from 'react-native';

import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
  useFormSheet,
} from '../index';

// Native commands can't run in tests, so we record the calls made through the refs instead
const mockSelectDetent =
  jest.fn<(presentation: string, index: number | 'last') => void>();
const mockSearchBarCommand = jest.fn<(command: string) => void>();

jest.mock('react-native-screens', () => {
  const actual = jest.requireActual<typeof import('react-native-screens')>(
    'react-native-screens'
  );
  const React = jest.requireActual<typeof import('react')>('react');

  return {
    ...actual,
    ScreenStackItem: ({
      sheetRef,
      ...rest
    }: React.ComponentProps<typeof actual.ScreenStackItem>) => {
      React.useImperativeHandle(sheetRef, () => ({
        selectDetent: (index: number | 'last') =>
          mockSelectDetent(rest.stackPresentation ?? 'push', index),
      }));

      return <actual.ScreenStackItem {...rest} />;
    },
    SearchBar: ({ ref }: React.ComponentProps<typeof actual.SearchBar>) => {
      React.useImperativeHandle(ref, () => ({
        focus: () => mockSearchBarCommand('focus'),
        blur: () => mockSearchBarCommand('blur'),
        clearText: () => mockSearchBarCommand('clearText'),
        toggleCancelButton: () => mockSearchBarCommand('toggleCancelButton'),
        setText: () => mockSearchBarCommand('setText'),
        cancelSearch: () => mockSearchBarCommand('cancelSearch'),
      }));

      return null;
    },
  };
});

type StackParamList = {
  A: undefined;
  B: undefined;
};

type ParentStackParamList = {
  A: undefined;
  B: NavigatorScreenParams<ChildStackParamList>;
};

type ChildStackParamList = {
  X: undefined;
};

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
  jest.clearAllMocks();
});

const ExpandSheet = () => {
  const formSheet = useFormSheet();

  return (
    <Button onPress={() => formSheet.selectDetent('last')} title="Expand" />
  );
};

const FocusSearch = () => {
  const searchBar = useHeaderSearchBar();

  return <Button onPress={() => searchBar.focus()} title="Focus search" />;
};

test('controls the form sheet with useFormSheet', async () => {
  const Stack = createNativeStackNavigator<StackParamList>();
  const user = userEvent.setup();

  const Home = ({ navigation }: NativeStackScreenProps<StackParamList>) => (
    <Button onPress={() => navigation.navigate('B')} title="Open sheet" />
  );

  await render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="A" component={Home} />
        <Stack.Screen
          name="B"
          component={ExpandSheet}
          options={{
            presentation: 'formSheet',
            sheetAllowedDetents: [0.3, 0.6, 1],
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );

  await user.press(screen.getByRole('button', { name: 'Open sheet' }));
  await act(() => jest.runAllTimers());
  await user.press(screen.getByRole('button', { name: 'Expand' }));

  expect(mockSelectDetent).toHaveBeenCalledTimes(1);
  expect(mockSelectDetent).toHaveBeenCalledWith('formSheet', 'last');
});

test('controls the parent form sheet from a nested navigator', async () => {
  const Stack = createNativeStackNavigator<ParentStackParamList>();
  const NestedStack = createNativeStackNavigator<ChildStackParamList>();
  const user = userEvent.setup();

  const Home = ({
    navigation,
  }: NativeStackScreenProps<ParentStackParamList>) => (
    <Button
      onPress={() => navigation.navigate('B', { screen: 'X' })}
      title="Open sheet"
    />
  );

  const Nested = () => (
    <NestedStack.Navigator>
      <NestedStack.Screen name="X" component={ExpandSheet} />
    </NestedStack.Navigator>
  );

  await render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="A" component={Home} />
        <Stack.Screen
          name="B"
          component={Nested}
          options={{ presentation: 'formSheet' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );

  await user.press(screen.getByRole('button', { name: 'Open sheet' }));
  await act(() => jest.runAllTimers());
  await user.press(screen.getByRole('button', { name: 'Expand' }));

  expect(mockSelectDetent).toHaveBeenCalledTimes(1);
  expect(mockSelectDetent).toHaveBeenCalledWith('formSheet', 'last');
});

test('controls the form sheet from a header button', async () => {
  const Stack = createNativeStackNavigator<StackParamList>();
  const user = userEvent.setup();

  const Home = ({ navigation }: NativeStackScreenProps<StackParamList>) => (
    <Button onPress={() => navigation.navigate('B')} title="Open sheet" />
  );

  await render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="A" component={Home} />
        <Stack.Screen
          name="B"
          options={{
            presentation: 'formSheet',
            headerShown: true,
            headerRight: () => <ExpandSheet />,
          }}
        >
          {() => null}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );

  await user.press(screen.getByRole('button', { name: 'Open sheet' }));
  await act(() => jest.runAllTimers());
  await user.press(screen.getByRole('button', { name: 'Expand' }));

  expect(mockSelectDetent).toHaveBeenCalledTimes(1);
  expect(mockSelectDetent).toHaveBeenCalledWith('formSheet', 'last');
});

test('throws when useFormSheet is used outside a native stack', async () => {
  jest.spyOn(console, 'error').mockImplementation(() => {});

  await expect(render(<ExpandSheet />)).rejects.toThrow(
    "Couldn't find the form sheet. Are you inside a screen in a native stack navigator?"
  );
});

test('controls the search bar in the header with useHeaderSearchBar', async () => {
  const Stack = createNativeStackNavigator<StackParamList>();
  const user = userEvent.setup();

  await render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="A"
          component={FocusSearch}
          options={{ headerSearchBarOptions: {} }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );

  await user.press(screen.getByRole('button', { name: 'Focus search' }));

  expect(mockSearchBarCommand).toHaveBeenCalledTimes(1);
  expect(mockSearchBarCommand).toHaveBeenCalledWith('focus');
});

test('controls the search bar from a header button', async () => {
  const Stack = createNativeStackNavigator<StackParamList>();
  const user = userEvent.setup();

  await render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="A"
          options={{
            headerSearchBarOptions: {},
            headerRight: () => <FocusSearch />,
          }}
        >
          {() => null}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );

  await user.press(screen.getByRole('button', { name: 'Focus search' }));

  expect(mockSearchBarCommand).toHaveBeenCalledTimes(1);
  expect(mockSearchBarCommand).toHaveBeenCalledWith('focus');
});
