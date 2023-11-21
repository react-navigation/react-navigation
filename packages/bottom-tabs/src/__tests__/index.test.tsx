import {
  NavigationContainer,
  type ParamListBase,
} from '@react-navigation/native';
import { fireEvent, render } from '@testing-library/react-native';
import * as React from 'react';
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
  const ScreenA = ({ navigation }: BottomTabScreenProps<ParamListBase>) => (
    <View>
      <Text>Screen A</Text>
      <Button onPress={() => navigation.preload('B')} title="Preload B" />
      <Button
        onPress={() => navigation.dismissPreload('B')}
        title="Dismiss preload B"
      />
    </View>
  );

  const ScreenB = () => {
    return <Text>Screen B</Text>;
  };

  const Tab = createBottomTabNavigator();

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
