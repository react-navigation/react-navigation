import * as React from 'react';
import { View, Text, Button } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '../index';

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

  expect(queryByText('Screen B')).not.toBeNull();
});
