import { expect, jest, test } from '@jest/globals';
import { Text } from '@react-navigation/elements';
import {
  createNavigationContainerRef,
  NavigationContainer,
  type ParamListBase,
  useFocusEffect,
  useIsFocused,
} from '@react-navigation/native';
import { act, fireEvent, render } from '@testing-library/react-native';
import * as React from 'react';
import { Button, View } from 'react-native';

import { createStackNavigator, type StackScreenProps } from '../index';

type StackParamList = {
  A: undefined;
  B: undefined;
};

jest.useFakeTimers();

test('renders a stack navigator with screens', async () => {
  const Test = ({ route, navigation }: StackScreenProps<ParamListBase>) => (
    <View>
      <Text>Screen {route.name}</Text>
      <Button onPress={() => navigation.navigate('A')} title="Go to A" />
      <Button onPress={() => navigation.navigate('B')} title="Go to B" />
    </View>
  );

  const Stack = createStackNavigator<StackParamList>();

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

test('fires transition events on navigation', async () => {
  const FirstScreen = ({ navigation }: StackScreenProps<ParamListBase>) => (
    <Button onPress={() => navigation.navigate('B')} title="Go to B" />
  );

  const onTransitionStart = jest.fn();
  const onTransitionEnd = jest.fn();

  const SecondScreen = ({ navigation }: StackScreenProps<ParamListBase>) => {
    React.useLayoutEffect(
      () => navigation.addListener('transitionStart', onTransitionStart),
      [navigation]
    );

    React.useEffect(
      () => navigation.addListener('transitionEnd', onTransitionEnd),
      [navigation]
    );

    return <Button onPress={() => navigation.goBack()} title="Go back" />;
  };

  const Stack = createStackNavigator<StackParamList>();

  const { findByText } = render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="A" component={FirstScreen} />
        <Stack.Screen name="B" component={SecondScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  expect(onTransitionStart).not.toHaveBeenCalled();
  expect(onTransitionEnd).not.toHaveBeenCalled();

  fireEvent.press(await findByText('Go to B'));

  expect(onTransitionStart).toHaveBeenCalledWith(
    expect.objectContaining({ data: { closing: false } })
  );

  expect(onTransitionEnd).not.toHaveBeenCalled();

  act(() => jest.runAllTimers());

  expect(onTransitionEnd).toHaveBeenCalledWith(
    expect.objectContaining({ data: { closing: false } })
  );

  fireEvent.press(await findByText('Go back'));

  expect(onTransitionStart).toHaveBeenCalledTimes(2);
  expect(onTransitionStart).toHaveBeenCalledWith(
    expect.objectContaining({ data: { closing: true } })
  );

  expect(onTransitionEnd).toHaveBeenCalledTimes(1);

  act(() => jest.runAllTimers());

  expect(onTransitionEnd).toHaveBeenCalledTimes(2);
  expect(onTransitionEnd).toHaveBeenCalledWith(
    expect.objectContaining({ data: { closing: true } })
  );
});

test('handles screens preloading', async () => {
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
});

test('runs focus effect on focus change on preloaded route', () => {
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

  const Stack = createStackNavigator<StackParamList>();

  const navigation = createNavigationContainerRef<StackParamList>();

  render(
    <NavigationContainer ref={navigation}>
      <Stack.Navigator>
        <Stack.Screen name="A">{() => null}</Stack.Screen>
        <Stack.Screen name="B" component={Test} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  expect(focusEffect).not.toHaveBeenCalled();
  expect(focusEffectCleanup).not.toHaveBeenCalled();

  act(() => navigation.preload('A'));
  act(() => navigation.preload('B'));

  expect(focusEffect).not.toHaveBeenCalled();
  expect(focusEffectCleanup).not.toHaveBeenCalled();

  act(() => navigation.navigate('B'));

  expect(focusEffect).toHaveBeenCalledTimes(1);
  expect(focusEffectCleanup).not.toHaveBeenCalled();

  act(() => navigation.navigate('A'));

  expect(focusEffect).toHaveBeenCalledTimes(1);
  expect(focusEffectCleanup).toHaveBeenCalledTimes(1);
});

test('renders correct focus state with preloading', () => {
  const Test = () => {
    const isFocused = useIsFocused();

    return (
      <>
        <Text>Test Screen</Text>
        <Text>{isFocused ? 'focused' : 'unfocused'}</Text>
      </>
    );
  };

  const Stack = createStackNavigator<StackParamList>();

  const navigation = React.createRef<any>();

  const { queryByText } = render(
    <NavigationContainer ref={navigation}>
      <Stack.Navigator>
        <Stack.Screen name="A">{() => null}</Stack.Screen>
        <Stack.Screen name="B" component={Test} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  expect(
    queryByText('Test Screen', { includeHiddenElements: true })
  ).toBeNull();

  act(() => navigation.current.preload('B'));

  expect(
    queryByText('Test Screen', { includeHiddenElements: true })
  ).not.toBeNull();

  expect(
    queryByText('unfocused', { includeHiddenElements: true })
  ).not.toBeNull();

  act(() => navigation.current.navigate('B'));

  expect(
    queryByText('focused', { includeHiddenElements: true })
  ).not.toBeNull();

  act(() => navigation.current.navigate('A'));

  expect(queryByText('focused', { includeHiddenElements: true })).toBeNull();
});
