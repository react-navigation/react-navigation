import { expect, jest, test } from '@jest/globals';
import {
  type TabActionHelpers,
  type TabNavigationState,
  TabRouter,
  type TabRouterOptions,
} from '@react-navigation/core';
import {
  render,
  screen,
  userEvent,
  waitFor,
} from '@testing-library/react-native';
import * as React from 'react';
import { Pressable, Text, View } from 'react-native';
import { createStandardNavigator } from 'standard-navigation';

import {
  createStandardNavigationFactories,
  type StandardNavigationTypeBagBase,
} from '../createStandardNavigationFactories';
import { NavigationContainer } from '../NavigationContainer';
import { useScrollToTop } from '../useScrollToTop';

jest.useFakeTimers();

/**
 * A tab navigator that renders all screens (not just the focused one),
 * so screens remain mounted when switching tabs.
 */
function createPersistentTabNavigator() {
  type MyTabOptions = { title?: string };

  type MyTabEventMap = {
    tabPress: {
      data: { isAlreadyFocused: boolean };
      canPreventDefault: true;
    };
  };

  type MyTabNavigatorProps = Record<string, never>;
  type MyTabMapperProps = Record<string, never>;

  const MyTabNavigator = createStandardNavigator<
    MyTabOptions,
    MyTabEventMap,
    MyTabNavigatorProps & MyTabMapperProps
  >(({ state, descriptors, actions, emitter }) => {
    return (
      <View>
        {state.routes.map((route, index) => {
          const descriptor = descriptors[route.key];
          const focused = index === state.index;

          return (
            <Pressable
              key={route.key}
              accessibilityState={{ selected: focused }}
              testID={`tab-${route.name}`}
              onPress={() => {
                const event = emitter.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                  data: { isAlreadyFocused: focused },
                });
                if (!focused && !event.defaultPrevented) {
                  actions.navigate(route.name, route.params);
                }
              }}
            >
              <Text>{descriptor?.options.title ?? route.name}</Text>
            </Pressable>
          );
        })}
        {/* Render ALL screens so they stay mounted */}
        {state.routes.map((route, index) => {
          const descriptor = descriptors[route.key];
          const focused = index === state.index;
          return (
            <View
              key={route.key}
              style={{ display: focused ? 'flex' : 'none' }}
            >
              {descriptor?.render()}
            </View>
          );
        })}
      </View>
    );
  });

  interface MyTabTypeBag extends StandardNavigationTypeBagBase {
    State: TabNavigationState<this['ParamList']>;
    ActionHelpers: TabActionHelpers<this['ParamList']>;
    ScreenOptions: MyTabOptions;
    EventMap: MyTabEventMap;
    RouterOptions: TabRouterOptions;
  }

  const { createNavigator: createMyTabNavigator } =
    createStandardNavigationFactories<
      MyTabTypeBag,
      MyTabNavigatorProps,
      MyTabMapperProps
    >(MyTabNavigator, TabRouter, () => ({}));

  return createMyTabNavigator<{
    Home: undefined;
    Feed: undefined;
  }>();
}

test('useScrollToTop scrolls a SectionList to top on tab press', async () => {
  const user = userEvent.setup();
  const MyTabs = createPersistentTabNavigator();

  const scrollToLocation = jest.fn();
  const ref = {
    current: { scrollToLocation },
  } as unknown as React.RefObject<{
    scrollToLocation: (options: {
      sectionIndex: number;
      itemIndex: number;
      animated?: boolean;
    }) => void;
  }>;

  function HomeScreen() {
    useScrollToTop(ref);
    return <Text>Home screen</Text>;
  }

  function FeedScreen() {
    return <Text>Feed screen</Text>;
  }

  await render(
    <NavigationContainer>
      <MyTabs.Navigator>
        <MyTabs.Screen name="Home" component={HomeScreen} />
        <MyTabs.Screen name="Feed" component={FeedScreen} />
      </MyTabs.Navigator>
    </NavigationContainer>
  );

  // Initially on Home — HomeScreen is mounted and listener is registered
  expect(screen.getByText('Home screen')).not.toBeNull();

  // Press Home tab again while already focused — triggers tabPress with
  // isAlreadyFocused: true. The tab listener should fire scrollToLocation.
  await user.press(screen.getByTestId('tab-Home'));

  // The tabPress listener runs inside requestAnimationFrame — flush it
  jest.runAllTimers();
  await waitFor(() => {
    expect(scrollToLocation).toHaveBeenCalledWith({
      sectionIndex: 0,
      itemIndex: 0,
      animated: true,
    });
  });
});
