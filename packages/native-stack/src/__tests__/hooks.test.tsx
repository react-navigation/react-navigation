import { afterEach, beforeEach, expect, jest, test } from '@jest/globals';
import { useHeaderSearchBar } from '@react-navigation/elements';
import { NavigationContainer } from '@react-navigation/native';
import { render, screen, userEvent } from '@testing-library/react-native';
import * as React from 'react';
import { Button } from 'react-native';

import { createNativeStackNavigator } from '../index';

// Native commands can't run in tests, so we record the calls made through the refs instead
const mockSearchBarCommand = jest.fn<(command: string) => void>();

jest.mock('react-native-screens', () => {
  const actual = jest.requireActual<typeof import('react-native-screens')>(
    'react-native-screens'
  );
  const React = jest.requireActual<typeof import('react')>('react');

  return {
    ...actual,
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

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
  jest.clearAllMocks();
});

const FocusSearch = () => {
  const searchBar = useHeaderSearchBar();

  return <Button onPress={() => searchBar.focus()} title="Focus search" />;
};

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
