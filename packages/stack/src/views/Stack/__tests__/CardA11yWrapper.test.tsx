import 'react-native-gesture-handler/jestSetup';

import { expect, jest, test } from '@jest/globals';
import { Text } from '@react-navigation/elements';
import { NavigationContainer } from '@react-navigation/native';
import { act, fireEvent, render } from '@testing-library/react-native';
import { Button, View } from 'react-native';

import { createStackNavigator, type StackScreenProps } from '../../../index';

type StackParamList = {
  A: undefined;
  B: undefined;
};

jest.useFakeTimers();

function findA11yWrapper(element: any) {
  let node = element.parent;
  while (node && node.props['aria-hidden'] === undefined) {
    node = node.parent;
  }
  return node;
}

test('focused screen is not aria-hidden', () => {
  const Stack = createStackNavigator<StackParamList>();

  const { getByText } = render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="A">{() => <Text>Screen A</Text>}</Stack.Screen>
        <Stack.Screen name="B">{() => <Text>Screen B</Text>}</Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );

  const wrapper = findA11yWrapper(getByText('Screen A'));

  expect(wrapper).not.toBeNull();
  expect(wrapper!.props['aria-hidden']).toBe(false);
});

test('unfocused screen is aria-hidden after navigation', () => {
  const TestScreen = ({
    navigation,
  }: StackScreenProps<StackParamList, 'A'>) => (
    <View>
      <Text>Screen A</Text>
      <Button onPress={() => navigation.navigate('B')} title="Go to B" />
    </View>
  );

  const Stack = createStackNavigator<StackParamList>();

  const { getByText } = render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="A" component={TestScreen} />
        <Stack.Screen name="B">{() => <Text>Screen B</Text>}</Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );

  fireEvent.press(getByText('Go to B'));
  act(() => jest.runAllTimers());

  const wrapper = findA11yWrapper(
    getByText('Screen A', { includeHiddenElements: true })
  );

  expect(wrapper).not.toBeNull();
  expect(wrapper!.props['aria-hidden']).toBe(true);
});
