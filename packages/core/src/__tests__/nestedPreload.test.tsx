import { beforeEach, expect, test } from '@jest/globals';
import {
  type NavigationState,
  StackRouter,
  TabRouter,
} from '@react-navigation/routers';
import { render } from '@testing-library/react-native';
import { act } from 'react';

import { BaseNavigationContainer } from '../BaseNavigationContainer';
import { createNavigationContainerRef } from '../createNavigationContainerRef';
import { Screen } from '../Screen';
import { useNavigationBuilder } from '../useNavigationBuilder';
import { MockRouterKey } from './__fixtures__/MockRouter';

beforeEach(() => {
  MockRouterKey.current = 0;
});

const StackNavigator = (props: any): any => {
  const { state, descriptors, NavigationContent } = useNavigationBuilder(
    StackRouter,
    props
  );

  return (
    <NavigationContent>
      {state.routes.map((route) => descriptors[route.key].render())}
      {state.preloadedRoutes?.map((route) => descriptors[route.key].render())}
    </NavigationContent>
  );
};

const TabNavigator = (props: any): any => {
  const { state, descriptors, NavigationContent } = useNavigationBuilder(
    TabRouter,
    props
  );

  return (
    <NavigationContent>
      {state.routes.map((route) => descriptors[route.key].render())}
    </NavigationContent>
  );
};

test('preloads nested screen in stack via navigate with preload flag', () => {
  const ref = createNavigationContainerRef<any>();

  render(
    <BaseNavigationContainer ref={ref}>
      <StackNavigator>
        <Screen name="Home">{() => null}</Screen>
        <Screen name="Details">
          {() => (
            <StackNavigator>
              <Screen name="Info">{() => null}</Screen>
              <Screen name="Settings">{() => null}</Screen>
            </StackNavigator>
          )}
        </Screen>
      </StackNavigator>
    </BaseNavigationContainer>
  );

  act(() => {
    ref.navigate('Details', { screen: 'Settings', preload: true });
  });

  const state = ref.getRootState();

  // Details should be navigated to (pushed onto stack)
  expect(state.routes.length).toBe(2);
  expect(state.index).toBe(1);
  expect(state.routes[1].name).toBe('Details');

  // Settings should be preloaded inside Details, not navigated to
  const detailsState = state.routes[1].state as any;

  expect(detailsState.index).toBe(0);
  expect(detailsState.routes[0].name).toBe('Info');
  expect(detailsState.preloadedRoutes.length).toBe(1);
  expect(detailsState.preloadedRoutes[0].name).toBe('Settings');
});

test('preloads deeply nested screens with multiple preload flags', () => {
  const ref = createNavigationContainerRef<any>();

  render(
    <BaseNavigationContainer ref={ref}>
      <StackNavigator>
        <Screen name="Home">{() => null}</Screen>
        <Screen name="A">
          {() => (
            <StackNavigator>
              <Screen name="B1">{() => null}</Screen>
              <Screen name="B2">
                {() => (
                  <StackNavigator>
                    <Screen name="C1">{() => null}</Screen>
                    <Screen name="C2">{() => null}</Screen>
                  </StackNavigator>
                )}
              </Screen>
            </StackNavigator>
          )}
        </Screen>
      </StackNavigator>
    </BaseNavigationContainer>
  );

  act(() => {
    ref.navigate('A', {
      screen: 'B2',
      preload: true,
      params: {
        screen: 'C2',
        preload: true,
      },
    });
  });

  const state = ref.getRootState();

  // A should be navigated to
  expect(state.routes.length).toBe(2);
  expect(state.routes[1].name).toBe('A');

  // B2 should be preloaded in A's navigator
  const aState = state.routes[1].state as any;

  expect(aState.index).toBe(0);
  expect(aState.routes[0].name).toBe('B1');
  expect(aState.preloadedRoutes.length).toBe(1);
  expect(aState.preloadedRoutes[0].name).toBe('B2');

  // B2 should have the nested params forwarded for deeper preloading
  expect(aState.preloadedRoutes[0].params).toEqual({
    screen: 'C2',
    preload: true,
  });
});

test('mixed navigate and preload at different nesting levels', () => {
  const ref = createNavigationContainerRef<any>();

  render(
    <BaseNavigationContainer ref={ref}>
      <StackNavigator>
        <Screen name="Home">{() => null}</Screen>
        <Screen name="A">
          {() => (
            <StackNavigator>
              <Screen name="B1">{() => null}</Screen>
              <Screen name="B2">
                {() => (
                  <StackNavigator>
                    <Screen name="C1">{() => null}</Screen>
                    <Screen name="C2">{() => null}</Screen>
                  </StackNavigator>
                )}
              </Screen>
            </StackNavigator>
          )}
        </Screen>
      </StackNavigator>
    </BaseNavigationContainer>
  );

  act(() => {
    ref.navigate('A', {
      screen: 'B2',
      params: {
        screen: 'C2',
        preload: true,
      },
    });
  });

  const state = ref.getRootState();

  // A should be navigated to
  expect(state.routes[1].name).toBe('A');

  // B2 should be navigated to (no preload flag at this level)
  // When navigating with screen param, the inner navigator initializes with B2
  const aState = state.routes[1].state as any;

  expect(aState.routes[aState.index].name).toBe('B2');

  // C2 should be preloaded inside B2
  const b2State = aState.routes[aState.index].state as any;

  expect(b2State.index).toBe(0);
  expect(b2State.routes[0].name).toBe('C1');
  expect(b2State.preloadedRoutes.length).toBe(1);
  expect(b2State.preloadedRoutes[0].name).toBe('C2');
});

test('navigate with preload updates params when screen is already focused', () => {
  const ref = createNavigationContainerRef<any>();

  render(
    <BaseNavigationContainer ref={ref}>
      <StackNavigator>
        <Screen name="Home">
          {() => (
            <StackNavigator>
              <Screen name="Inner">{() => null}</Screen>
              <Screen name="Other">{() => null}</Screen>
            </StackNavigator>
          )}
        </Screen>
      </StackNavigator>
    </BaseNavigationContainer>
  );

  act(() => {
    // Inner is already focused, so navigate with preload should update params
    ref.navigate('Home', { screen: 'Inner', preload: true });
  });

  const stateAfter = ref.getRootState();
  const homeState = stateAfter.routes[0].state as any;

  // Inner should still be focused, no preloaded routes
  expect(homeState.index).toBe(0);
  expect(homeState.routes[0].name).toBe('Inner');
  expect(homeState.preloadedRoutes.length).toBe(0);
});

test('preloads nested screen in tab navigator via navigate with preload flag', () => {
  const ref = createNavigationContainerRef<any>();

  render(
    <BaseNavigationContainer ref={ref}>
      <StackNavigator>
        <Screen name="Home">{() => null}</Screen>
        <Screen name="Tabs">
          {() => (
            <TabNavigator>
              <Screen name="Tab1">{() => null}</Screen>
              <Screen name="Tab2">{() => null}</Screen>
            </TabNavigator>
          )}
        </Screen>
      </StackNavigator>
    </BaseNavigationContainer>
  );

  act(() => {
    ref.navigate('Tabs', { screen: 'Tab2', preload: true });
  });

  const state = ref.getRootState();

  // Tabs should be navigated to
  expect(state.routes.length).toBe(2);
  expect(state.routes[1].name).toBe('Tabs');

  // Tab2 should be preloaded, Tab1 should still be focused
  const tabsState = state.routes[1].state as NavigationState;

  expect(tabsState.index).toBe(0);
  expect(tabsState.routes[0].name).toBe('Tab1');
  expect((tabsState as any).preloadedRouteKeys).toContain(
    tabsState.routes[1].key
  );
});
