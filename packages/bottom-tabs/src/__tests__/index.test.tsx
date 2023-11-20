import {
  NavigationContainer,
  type ParamListBase,
} from '@react-navigation/native';
import { fireEvent, render } from '@testing-library/react-native';
import * as React from 'react';
import { useEffect } from 'react';
import { Animated, Button, Text, View } from 'react-native';

import { type BottomTabScreenProps, createBottomTabNavigator } from '../index';

it('renders a bottom tab navigator with screens', async () => {
  // @ts-expect-error: incomplete mock for testing
  jest.spyOn(Animated, 'timing').mockImplementation(() => ({
    start: (callback) => callback?.({ finished: true }),
  }));

  const Test = ({ route, navigation }: BottomTabScreenProps<ParamListBase>) => (
    <View>
      <Text>Screen {route.name}</Text>
      <Button onPress={() => navigation.navigate('A')} title="Go to A" />
      <Button onPress={() => navigation.navigate('B')} title="Go to B" />
    </View>
  );

  const Tab = createBottomTabNavigator();

  const { findByText, queryByText } = render(
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="A" component={Test} />
        <Tab.Screen name="B" component={Test} />
      </Tab.Navigator>
    </NavigationContainer>
  );

  expect(queryByText('Screen A')).not.toBeNull();
  expect(queryByText('Screen B')).toBeNull();

  fireEvent.press(await findByText('Go to B'));

  expect(queryByText('Screen B')).not.toBeNull();
});

it('preloads screens', async () => {
  // @ts-expect-error: incomplete mock for testing
  jest.spyOn(Animated, 'timing').mockImplementation(() => ({
    start: (callback) => callback?.({ finished: true }),
  }));

  const renderCallback = jest.fn();
  const unmountCallback = jest.fn();
  const Screen1 = ({
    route,
    navigation,
  }: BottomTabScreenProps<ParamListBase>) => (
    <View>
      <Text>Screen {route.name}</Text>
      <Button onPress={() => navigation.preload('B')} title="Preload B" />
      <Button
        onPress={() => navigation.dismissPreload('B')}
        title="Dismiss preload B"
      />
    </View>
  );

  const Screen2 = () => {
    useEffect(() => unmountCallback);
    renderCallback();
    return null;
  };

  const Tab = createBottomTabNavigator();

  const { findByText } = render(
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="A" component={Screen1} />
        <Tab.Screen name="B" component={Screen2} />
      </Tab.Navigator>
    </NavigationContainer>
  );

  expect(renderCallback).not.toHaveBeenCalled();
  fireEvent.press(await findByText('Preload B'));
  expect(renderCallback).toHaveBeenCalled();
  fireEvent.press(await findByText('Dismiss preload B'));
  expect(unmountCallback).toHaveBeenCalled();
  fireEvent.press(await findByText('Preload B'));
  expect(renderCallback).toHaveBeenCalledTimes(2);
});
