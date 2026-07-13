import { expect, test } from '@jest/globals';
import type { NavigationState, ParamListBase } from '@react-navigation/routers';
import { act, render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import { BaseNavigationContainer } from '../BaseNavigationContainer';
import { createNavigationContainerRef } from '../createNavigationContainerRef';
import { NavigationIndependentTree } from '../NavigationIndependentTree';
import { Screen } from '../Screen';
import type {
  DefaultNavigatorOptions,
  EventMapBase,
  NavigationContainerRef,
} from '../types';
import { useIsFocused } from '../useIsFocused';
import { useNavigation } from '../useNavigation';
import { useNavigationBuilder } from '../useNavigationBuilder';
import { useNavigationState } from '../useNavigationState';
import { useRoute } from '../useRoute';
import { useStateForPath } from '../useStateForPath';
import { MockRouter } from './__fixtures__/MockRouter';

const TestNavigator = (
  props: DefaultNavigatorOptions<
    ParamListBase,
    NavigationState,
    {},
    EventMapBase,
    unknown
  >
) => {
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

const App = ({
  children,
  ref,
}: {
  children: React.ReactNode;
  ref: React.Ref<NavigationContainerRef<ParamListBase>>;
}) => {
  return (
    <BaseNavigationContainer ref={ref}>
      <TestNavigator>
        <Screen name="Outer">
          {() => (
            <NavigationIndependentTree>
              <BaseNavigationContainer>{children}</BaseNavigationContainer>
            </NavigationIndependentTree>
          )}
        </Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );
};

test("doesn't include outer tree's state in useStateForPath", async () => {
  const navigation = createNavigationContainerRef<ParamListBase>();

  const Test = () => {
    const state = useStateForPath();

    return <Text>{state === undefined ? 'no state' : 'has state'}</Text>;
  };

  await render(
    <App ref={navigation}>
      <Test />
    </App>
  );

  expect(screen.getByText('no state')).toBeVisible();
});

test("doesn't consume outer route params as nested navigation params", async () => {
  const navigation = createNavigationContainerRef<ParamListBase>();

  const Test = () => {
    const isFocused = useIsFocused();
    const route = useRoute();

    return isFocused ? <Text>{route.name}</Text> : null;
  };

  await render(
    <App ref={navigation}>
      <TestNavigator>
        <Screen name="InnerA" component={Test} />
        <Screen name="InnerB" component={Test} />
      </TestNavigator>
    </App>
  );

  await act(() => navigation.navigate('Outer', { screen: 'InnerB' }));

  expect(navigation.getCurrentRoute()?.params).toEqual({ screen: 'InnerB' });
  expect(screen.getByText('InnerA')).toBeVisible();
  expect(screen.queryByText('InnerB')).toBeNull();
});

test("doesn't inherit outer tree's navigation object", async () => {
  const navigation = createNavigationContainerRef<ParamListBase>();

  const Test = () => {
    // @ts-expect-error for test purposes
    useNavigation('Outer');

    return null;
  };

  await expect(
    render(
      <App ref={navigation}>
        <Test />
      </App>
    )
  ).rejects.toThrow(
    "Couldn't find a navigation object for 'Outer' in current or any parent screens. Is your component inside the correct screen?"
  );
});

test("doesn't inherit outer tree's focus state", async () => {
  const navigation = createNavigationContainerRef<ParamListBase>();

  const Test = () => {
    useIsFocused();

    return null;
  };

  await expect(
    render(
      <App ref={navigation}>
        <Test />
      </App>
    )
  ).rejects.toThrow(
    "Couldn't determine focus state. Is your component inside a screen in a navigator?"
  );
});

test("doesn't expose outer tree's routes to named useRoute", async () => {
  const navigation = createNavigationContainerRef<ParamListBase>();

  const Test = () => {
    // @ts-expect-error for test purposes
    useRoute('Outer');

    return null;
  };

  await expect(
    render(
      <App ref={navigation}>
        <Test />
      </App>
    )
  ).rejects.toThrow(
    "Couldn't find a parent screen. Is your component inside a screen in a navigator?"
  );
});

test("doesn't expose outer tree's state to named useNavigationState", async () => {
  const navigation = createNavigationContainerRef<ParamListBase>();

  const Test = () => {
    useNavigationState(
      // @ts-expect-error for test purposes
      'Outer',
      (state: NavigationState) => state.routeNames
    );

    return null;
  };

  await expect(
    render(
      <App ref={navigation}>
        <Test />
      </App>
    )
  ).rejects.toThrow(
    "Couldn't find a navigator for the route 'Outer' in any of the parent screens. Is your component inside the correct screen?"
  );
});
