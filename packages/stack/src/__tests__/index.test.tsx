import {
  NavigationContainer,
  type ParamListBase,
} from '@react-navigation/native';
import { act, fireEvent, render } from '@testing-library/react-native';
import * as React from 'react';
import { Button, Text, View } from 'react-native';

import { createStackNavigator, type StackScreenProps } from '../index';

jest.useFakeTimers();

it('renders a stack navigator with screens', async () => {
  const Test = ({ route, navigation }: StackScreenProps<ParamListBase>) => (
    <View>
      <Text>Screen {route.name}</Text>
      <Button onPress={() => navigation.navigate('A')} title="Go to A" />
      <Button onPress={() => navigation.navigate('B')} title="Go to B" />
    </View>
  );

  const Stack = createStackNavigator();

  const { findByText, queryByText } = render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="A" component={Test} />
        <Stack.Screen name="B" component={Test} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  expect(queryByText('Screen A')).not.toBeNull();
  expect(queryByText('Screen B')).toBeNull();

  fireEvent.press(await findByText('Go to B'));

  act(() => jest.runAllTimers());

  expect(queryByText('Screen B')).not.toBeNull();
});

it('preloads screens', async () => {
  const ScreenA = ({ navigation }: StackScreenProps<ParamListBase>) => (
    <View>
      <Text>Screen A</Text>
      <Button onPress={() => navigation.preload('B')} title="Preload B" />
      <Button
        onPress={() => navigation.removePreload('B')}
        title="Dismiss preload B"
      />
    </View>
  );

  const ScreenB = () => {
    return <Text>Screen B</Text>;
  };

  const Tab = createStackNavigator();

  const component = (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="A" component={ScreenA} />
        <Tab.Screen name="B" component={ScreenB} />
      </Tab.Navigator>
    </NavigationContainer>
  );
  const app = render(component);

  const { getByText, queryByText } = app;

  expect(queryByText('Screen B', { includeHiddenElements: true })).toBeNull();
  fireEvent.press(getByText('Preload B'));
  expect(
    queryByText('Screen B', { includeHiddenElements: true })
  ).not.toBeNull();
  fireEvent.press(getByText('Dismiss preload B'));
  expect(queryByText('Screen B', { includeHiddenElements: true })).toBeNull();
});
