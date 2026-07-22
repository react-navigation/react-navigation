import { expect, test } from '@jest/globals';
import { render, screen, userEvent } from '@testing-library/react-native';
import { Text } from 'react-native';

import { createStackNavigator } from '../__stubs__/createStackNavigator';
import { Link } from '../Link';
import { NavigationContainer } from '../NavigationContainer';

type RootParamList = { Foo: undefined; Bar: { id: string } };

test('navigates on native', async () => {
  const user = userEvent.setup();

  const Stack = createStackNavigator<RootParamList>();

  const FooScreen = () => (
    <Link<RootParamList> screen="Bar" params={{ id: '42' }}>
      Go to Bar
    </Link>
  );

  await render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Foo" component={FooScreen} />
        <Stack.Screen name="Bar">{() => <Text>Bar Screen</Text>}</Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );

  const link = screen.getByRole('link', { name: 'Go to Bar' });

  await user.press(link);

  expect(await screen.findByText('Bar Screen')).toBeOnTheScreen();
});
