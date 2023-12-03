import {
  NavigationContainer,
  type ParamListBase,
} from '@react-navigation/native';
import { act, fireEvent, render } from '@testing-library/react-native';
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

it('handles screens preloading', async () => {
  const Drawer = createDrawerNavigator();

  const navigation = React.createRef<any>();

  const { queryByText } = render(
    <NavigationContainer ref={navigation}>
      <Drawer.Navigator>
        <Drawer.Screen name="A" component={() => null} />
        <Drawer.Screen name="B" component={() => <Text>Screen B</Text>} />
      </Drawer.Navigator>
    </NavigationContainer>
  );

  expect(queryByText('Screen B', { includeHiddenElements: true })).toBeNull();
  act(() => navigation.current.preload('B'));
  expect(
    queryByText('Screen B', { includeHiddenElements: true })
  ).not.toBeNull();
  act(() => navigation.current.removePreload('B'));
  expect(queryByText('Screen B', { includeHiddenElements: true })).toBeNull();
});
