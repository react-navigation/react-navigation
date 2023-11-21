import {
  NavigationContainer,
  type ParamListBase,
} from '@react-navigation/native';
import { fireEvent, render } from '@testing-library/react-native';
import * as React from 'react';
import { Button, Text, View } from 'react-native';

import { createDrawerNavigator, type DrawerScreenProps } from '../index';

it('renders a drawer navigator with screens', async () => {
  const Test = ({ route, navigation }: DrawerScreenProps<ParamListBase>) => (
    <View>
      <Text>Screen {route.name}</Text>
      <Button onPress={() => navigation.navigate('A')} title="Go to A" />
      <Button onPress={() => navigation.navigate('B')} title="Go to B" />
    </View>
  );

  const Drawer = createDrawerNavigator();

  const { findByText, queryByText } = render(
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="A" component={Test} />
        <Drawer.Screen name="B" component={Test} />
      </Drawer.Navigator>
    </NavigationContainer>
  );

  expect(queryByText('Screen A')).not.toBeNull();
  expect(queryByText('Screen B')).toBeNull();

  fireEvent(await findByText('Go to B'), 'press');

  expect(queryByText('Screen B')).not.toBeNull();
});

it('preloads screens', async () => {
  const ScreenA = ({ navigation }: DrawerScreenProps<ParamListBase>) => (
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

  const Tab = createDrawerNavigator();

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
