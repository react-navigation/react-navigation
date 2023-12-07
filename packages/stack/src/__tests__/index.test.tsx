import {
  createNavigationContainerRef,
  NavigationContainer,
  type ParamListBase,
  useFocusEffect,
  useIsFocused,
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

type StackParamList = {
  A: undefined;
  B: undefined;
};

it('handles screens preloading', async () => {
  const Stack = createStackNavigator<StackParamList>();

  const navigation = createNavigationContainerRef<StackParamList>();

  const { queryByText } = render(
    <NavigationContainer ref={navigation}>
      <Stack.Navigator>
        <Stack.Screen name="A">{() => null}</Stack.Screen>
        <Stack.Screen name="B">{() => <Text>Screen B</Text>}</Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );

  expect(queryByText('Screen B', { includeHiddenElements: true })).toBeNull();
  act(() => navigation.preload('B'));
  expect(
    queryByText('Screen B', { includeHiddenElements: true })
  ).not.toBeNull();
  act(() => navigation.removePreload('B'));
  expect(queryByText('Screen B', { includeHiddenElements: true })).toBeNull();
});

it('runs focus effect on focus change on preloaded route', () => {
  const focusEffect = jest.fn();
  const focusEffectCleanup = jest.fn();

  const Test = () => {
    const onFocus = React.useCallback(() => {
      focusEffect();

      return focusEffectCleanup;
    }, []);

    useFocusEffect(onFocus);

    return null;
  };

  const Stack = createStackNavigator();

  const navigation = React.createRef<any>();

  render(
    <NavigationContainer ref={navigation}>
      <Stack.Navigator>
        <Stack.Screen name="first">{() => null}</Stack.Screen>
        <Stack.Screen name="second" component={Test} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  expect(focusEffect).not.toHaveBeenCalled();
  expect(focusEffectCleanup).not.toHaveBeenCalled();

  act(() => navigation.current.preload('second'));
  act(() => navigation.current.removePreload('second'));
  act(() => navigation.current.preload('second'));

  expect(focusEffect).not.toHaveBeenCalled();
  expect(focusEffectCleanup).not.toHaveBeenCalled();

  act(() => navigation.current.navigate('second'));

  expect(focusEffect).toHaveBeenCalledTimes(1);
  expect(focusEffectCleanup).not.toHaveBeenCalled();

  act(() => navigation.current.navigate('first'));

  expect(focusEffect).toHaveBeenCalledTimes(1);
  expect(focusEffectCleanup).toHaveBeenCalledTimes(1);
});

it('renders correct focus state with preloading', () => {
  const Test = () => {
    const isFocused = useIsFocused();

    return (
      <>
        <Text>Test Screen</Text>
        <Text>{isFocused ? 'focused' : 'unfocused'}</Text>
      </>
    );
  };

  const Stack = createStackNavigator();

  const navigation = React.createRef<any>();

  const { queryByText } = render(
    <NavigationContainer ref={navigation}>
      <Stack.Navigator>
        <Stack.Screen name="first">{() => null}</Stack.Screen>
        <Stack.Screen name="second" component={Test} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  expect(
    queryByText('Test Screen', { includeHiddenElements: true })
  ).toBeNull();

  act(() => navigation.current.preload('second'));

  expect(
    queryByText('Test Screen', { includeHiddenElements: true })
  ).not.toBeNull();

  expect(
    queryByText('unfocused', { includeHiddenElements: true })
  ).not.toBeNull();

  act(() => navigation.current.navigate('second'));

  expect(
    queryByText('focused', { includeHiddenElements: true })
  ).not.toBeNull();

  act(() => navigation.current.navigate('first'));

  expect(queryByText('focused', { includeHiddenElements: true })).toBeNull();
});
