import { expect, test } from '@jest/globals';
import type { ParamListBase } from '@react-navigation/routers';
import { act, render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import { BaseNavigationContainer } from '../BaseNavigationContainer';
import { createNavigationContainerRef } from '../createNavigationContainerRef';
import { NavigationIndependentTree } from '../NavigationIndependentTree';
import { Screen } from '../Screen';
import { useIsFocused } from '../useIsFocused';
import { useNavigation } from '../useNavigation';
import { useNavigationBuilder } from '../useNavigationBuilder';
import { useNavigationState } from '../useNavigationState';
import { useRoute } from '../useRoute';
import { useStateForPath } from '../useStateForPath';
import { MockRouter } from './__fixtures__/MockRouter';

const TestNavigator = (props: any): any => {
  const { state, descriptors, NavigationContent } = useNavigationBuilder(
    MockRouter,
    props
  );

  return (
    <NavigationContent>
      {state.routes.map((route) => descriptors[route.key]?.render())}
    </NavigationContent>
  );
};

const renderIndependentTree = (children: React.ReactNode) => {
  const navigation = createNavigationContainerRef<ParamListBase>();

  const element = (
    <BaseNavigationContainer ref={navigation}>
      <TestNavigator>
        <Screen name="outer">
          {() => (
            <NavigationIndependentTree>
              <BaseNavigationContainer>{children}</BaseNavigationContainer>
            </NavigationIndependentTree>
          )}
        </Screen>
        <Screen name="other">{() => null}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  return { navigation, element };
};

test("doesn't include outer tree's state in useStateForPath", async () => {
  const TestScreen = () => {
    const state = useStateForPath();

    return <Text>{JSON.stringify(state)}</Text>;
  };

  const { element } = renderIndependentTree(
    <TestNavigator>
      <Screen name="inner" component={TestScreen} />
    </TestNavigator>
  );

  await render(element);

  expect(screen).toMatchInlineSnapshot(`
<Text>
  {"routes":[{"key":"inner","name":"inner"}]}
</Text>
`);
});

test("doesn't consume outer route params as nested navigation params", async () => {
  const TestScreen = () => {
    const route = useRoute();

    return <Text>{route.name}</Text>;
  };

  const { navigation, element } = renderIndependentTree(
    <TestNavigator>
      <Screen name="inner-a" component={TestScreen} />
      <Screen name="inner-b" component={TestScreen} />
    </TestNavigator>
  );

  await render(element);

  await act(() => navigation.navigate('outer', { screen: 'inner-b' }));

  expect(navigation.getCurrentRoute()?.params).toEqual({ screen: 'inner-b' });

  // The inner navigator should not navigate to 'inner-b' based on the outer route params
  expect(screen).toMatchInlineSnapshot(`
<>
  <Text>
    inner-a
  </Text>
  <Text>
    inner-b
  </Text>
</>
`);
});

test("doesn't inherit outer tree's navigation object", async () => {
  const TestScreen = () => {
    const navigation = useNavigation();

    return <Text>{navigation.getParent() ? 'has parent' : 'no parent'}</Text>;
  };

  const { element } = renderIndependentTree(
    <TestNavigator>
      <Screen name="inner" component={TestScreen} />
    </TestNavigator>
  );

  await render(element);

  expect(screen).toMatchInlineSnapshot(`
<Text>
  no parent
</Text>
`);
});

test("doesn't inherit outer tree's focus state", async () => {
  const TestScreen = () => {
    const isFocused = useIsFocused();

    return <Text>{isFocused ? 'focused' : 'blurred'}</Text>;
  };

  const { navigation, element } = renderIndependentTree(
    <TestNavigator>
      <Screen name="inner" component={TestScreen} />
    </TestNavigator>
  );

  await render(element);

  expect(screen.getByText('focused')).toBeVisible();

  // The inner screen should stay focused even when the outer screen is blurred
  await act(() => navigation.navigate('other'));

  expect(screen.getByText('focused')).toBeVisible();
});

test("doesn't expose outer tree's routes to named useRoute", async () => {
  const TestScreen = () => {
    // @ts-expect-error for test purposes
    const route = useRoute('outer');

    return <Text>{route.name}</Text>;
  };

  const { element } = renderIndependentTree(
    <TestNavigator>
      <Screen name="inner" component={TestScreen} />
    </TestNavigator>
  );

  await expect(render(element)).rejects.toThrow(
    "Couldn't find a route named 'outer' in any of the parent screens. Is your component inside the correct screen?"
  );
});

test("doesn't expose outer tree's state to named useNavigationState", async () => {
  const TestScreen = () => {
    const routeNames = useNavigationState(
      // @ts-expect-error for test purposes
      'outer',
      (state: any) => state.routeNames
    );

    return <Text>{routeNames.join(',')}</Text>;
  };

  const { element } = renderIndependentTree(
    <TestNavigator>
      <Screen name="inner" component={TestScreen} />
    </TestNavigator>
  );

  await expect(render(element)).rejects.toThrow(
    "Couldn't find a navigator for the route 'outer' in any of the parent screens. Is your component inside the correct screen?"
  );
});
