import { expect, test } from '@jest/globals';
import type { NavigationState, ParamListBase } from '@react-navigation/routers';
import { act, render } from '@testing-library/react-native';

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
import { useNavigationBuilder } from '../useNavigationBuilder';
import { useRoute } from '../useRoute';
import { useStateForPath } from '../useStateForPath';
import { MockRouter } from './__fixtures__/MockRouter';

const theme: ReactNavigation.Theme = {
  dark: false,
  colors: {
    primary: 'blue',
    background: 'white',
    card: 'white',
    text: 'black',
    border: 'gray',
    notification: 'red',
  },
  fonts: {
    regular: { fontFamily: 'sans-serif', fontWeight: '400' },
    medium: { fontFamily: 'sans-serif', fontWeight: '500' },
    bold: { fontFamily: 'sans-serif', fontWeight: '600' },
    heavy: { fontFamily: 'sans-serif', fontWeight: '700' },
  },
};

const TestNavigator = (
  props: DefaultNavigatorOptions<
    ParamListBase,
    string | undefined,
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
    <BaseNavigationContainer ref={ref} theme={theme}>
      <TestNavigator>
        <Screen name="Outer">
          {() => (
            <NavigationIndependentTree>
              <BaseNavigationContainer theme={theme}>
                {children}
              </BaseNavigationContainer>
            </NavigationIndependentTree>
          )}
        </Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );
};

test("doesn't include outer tree's state in useStateForPath", () => {
  const navigation = createNavigationContainerRef<ParamListBase>();

  const Test = () => {
    const state = useStateForPath();

    return state === undefined ? 'no state' : 'has state';
  };

  const element = render(
    <App ref={navigation}>
      <Test />
    </App>
  );

  expect(element).toMatchInlineSnapshot(`"no state"`);
});

test("doesn't consume outer route params as nested navigation params", () => {
  const navigation = createNavigationContainerRef<ParamListBase>();

  const Test = () => {
    const isFocused = useIsFocused();
    const route = useRoute();

    return isFocused ? route.name : null;
  };

  const element = render(
    <App ref={navigation}>
      <TestNavigator>
        <Screen name="InnerA" component={Test} />
        <Screen name="InnerB" component={Test} />
      </TestNavigator>
    </App>
  );

  act(() => navigation.navigate('Outer', { screen: 'InnerB' }));

  expect(navigation.getCurrentRoute()?.params).toEqual({ screen: 'InnerB' });

  expect(element).toMatchInlineSnapshot(`"InnerA"`);
});
