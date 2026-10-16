import 'react-native-gesture-handler/jestSetup';

import { afterEach, expect, jest, test } from '@jest/globals';
import { Text } from '@react-navigation/elements';
import {
  createNavigationContainerRef,
  DrawerActions,
  NavigationContainer,
} from '@react-navigation/native';
import { act, fireEvent, render } from '@testing-library/react-native';
import { Button, Keyboard, View } from 'react-native';
import { setUpTests } from 'react-native-reanimated';

import { createDrawerNavigator, type DrawerScreenProps } from '../index';

jest.mock('react-native-worklets', () =>
  require('react-native-worklets/src/mock')
);

setUpTests();

afterEach(() => {
  jest.restoreAllMocks();
  jest.useRealTimers();
});

type DrawerParamList = {
  A: undefined;
  B: undefined;
};

test('renders a drawer navigator with screens', async () => {
  const Test = ({ route, navigation }: DrawerScreenProps<DrawerParamList>) => (
    <View>
      <Text>Screen {route.name}</Text>
      <Button onPress={() => navigation.navigate('A')} title="Go to A" />
      <Button onPress={() => navigation.navigate('B')} title="Go to B" />
    </View>
  );

  const Drawer = createDrawerNavigator<DrawerParamList>();

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

test('handles screens preloading', () => {
  const Drawer = createDrawerNavigator<DrawerParamList>();

  const navigation = createNavigationContainerRef<DrawerParamList>();

  const { queryByText } = render(
    <NavigationContainer ref={navigation}>
      <Drawer.Navigator>
        <Drawer.Screen name="A">{() => null}</Drawer.Screen>
        <Drawer.Screen name="B">{() => <Text>Screen B</Text>}</Drawer.Screen>
      </Drawer.Navigator>
    </NavigationContainer>
  );

  expect(queryByText('Screen B', { includeHiddenElements: true })).toBeNull();
  act(() => navigation.preload('B'));
  expect(
    queryByText('Screen B', { includeHiddenElements: true })
  ).not.toBeNull();
});

test('dismisses the keyboard when the drawer is opened or closed', () => {
  jest.useFakeTimers();

  const Drawer = createDrawerNavigator<DrawerParamList>();
  const navigation = createNavigationContainerRef<DrawerParamList>();

  render(
    <NavigationContainer ref={navigation}>
      <Drawer.Navigator>
        <Drawer.Screen name="A">{() => null}</Drawer.Screen>
      </Drawer.Navigator>
    </NavigationContainer>
  );

  act(() => jest.runAllTimers());

  const dismiss = jest.spyOn(Keyboard, 'dismiss');

  act(() => navigation.dispatch(DrawerActions.openDrawer()));
  act(() => jest.runAllTimers());

  expect(dismiss).toHaveBeenCalledTimes(1);

  act(() => navigation.dispatch(DrawerActions.closeDrawer()));
  act(() => jest.runAllTimers());

  expect(dismiss).toHaveBeenCalledTimes(2);
});

test("doesn't dismiss the keyboard with keyboardDismissMode='none'", () => {
  jest.useFakeTimers();

  const Drawer = createDrawerNavigator<DrawerParamList>();
  const navigation = createNavigationContainerRef<DrawerParamList>();

  render(
    <NavigationContainer ref={navigation}>
      <Drawer.Navigator screenOptions={{ keyboardDismissMode: 'none' }}>
        <Drawer.Screen name="A">{() => null}</Drawer.Screen>
      </Drawer.Navigator>
    </NavigationContainer>
  );

  act(() => jest.runAllTimers());

  const dismiss = jest.spyOn(Keyboard, 'dismiss');

  act(() => navigation.dispatch(DrawerActions.openDrawer()));
  act(() => jest.runAllTimers());
  act(() => navigation.dispatch(DrawerActions.closeDrawer()));
  act(() => jest.runAllTimers());

  expect(dismiss).not.toHaveBeenCalled();
});
