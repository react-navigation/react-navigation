import { expect, jest, test } from '@jest/globals';
import { Text } from '@react-navigation/elements';
import {
  createNavigationContainerRef,
  NavigationContainer,
} from '@react-navigation/native';
import { act, fireEvent, render } from '@testing-library/react-native';
import { Animated, Keyboard, View } from 'react-native';

import { type BottomTabScreenProps, createBottomTabNavigator } from '../index';

type BottomTabParamList = {
  A: undefined;
  B: undefined;
};

test('renders a bottom tab navigator with screens', async () => {
  // @ts-expect-error: incomplete mock for testing
  jest.spyOn(Animated, 'timing').mockImplementation(() => ({
    start: (callback) => callback?.({ finished: true }),
  }));

  const Test = ({ route }: BottomTabScreenProps<BottomTabParamList>) => (
    <View>
      <Text>Screen {route.name}</Text>
    </View>
  );

  const Tab = createBottomTabNavigator<BottomTabParamList>();

  const { queryByText, getAllByRole, getByRole } = render(
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="A" component={Test} />
        <Tab.Screen name="B" component={Test} />
      </Tab.Navigator>
    </NavigationContainer>
  );

  expect(queryByText('Screen A')).not.toBeNull();
  expect(queryByText('Screen B')).toBeNull();

  expect(
    getAllByRole('button', { name: /(A|B), tab, (1|2) of 2/ })
  ).toHaveLength(2);

  fireEvent.press(getByRole('button', { name: 'B, tab, 2 of 2' }), {});

  expect(queryByText('Screen B')).not.toBeNull();
});

test('handles screens preloading', async () => {
  const Tab = createBottomTabNavigator<BottomTabParamList>();

  const navigation = createNavigationContainerRef<BottomTabParamList>();

  const { queryByText } = render(
    <NavigationContainer ref={navigation}>
      <Tab.Navigator>
        <Tab.Screen name="A">{() => null}</Tab.Screen>
        <Tab.Screen name="B">{() => <Text>Screen B</Text>}</Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );

  expect(queryByText('Screen B', { includeHiddenElements: true })).toBeNull();
  act(() => navigation.preload('B'));
  expect(
    queryByText('Screen B', { includeHiddenElements: true })
  ).not.toBeNull();
});

test('tab bar cannot be tapped when hidden', async () => {
  jest.useFakeTimers();

  const Test = ({ route }: BottomTabScreenProps<BottomTabParamList>) => (
    <View>
      <Text>Screen {route.name}</Text>
    </View>
  );

  const Tab = createBottomTabNavigator<BottomTabParamList>();

  const { queryByText, getByRole } = render(
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarHideOnKeyboard: true,
        }}
      >
        <Tab.Screen name="A" component={Test} />
        <Tab.Screen name="B" component={Test} />
      </Tab.Navigator>
    </NavigationContainer>
  );

  // start at Screen A
  expect(queryByText('Screen B')).toBeNull();

  // move to Screen B
  fireEvent.press(getByRole('button', { name: 'B, tab, 2 of 2' }), {});
  jest.runAllTimers();
  expect(queryByText('Screen B')).not.toBeNull();

  // show the keyboard to hide the tab bar
  act(() => {
    // @ts-expect-error: React Native does not expose the emit method on Keyboard
    Keyboard._emitter.emit?.('keyboardWillShow');
  });

  // attempt to move to Screen A
  fireEvent.press(getByRole('button', { name: 'A, tab, 1 of 2' }), {});
  jest.runAllTimers();
  expect(queryByText('Screen A')).toBeNull();
  expect(queryByText('Screen B')).not.toBeNull();
});
