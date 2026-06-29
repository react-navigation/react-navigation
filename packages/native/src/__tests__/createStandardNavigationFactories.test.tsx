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
import { Pressable, Text } from 'react-native';
import { createStandardNavigator } from 'standard-navigation';

import {
  createStandardNavigationFactories,
  type StandardNavigationTypeBagBase,
} from '../createStandardNavigationFactories';
import { NavigationContainer } from '../NavigationContainer';

jest.useFakeTimers();

test('creates a navigator with standard navigation', async () => {
  type MyTabOptions = {
    title?: string;
  };

  type MyTabEventMap = {
    tabPress: {
      data: { isAlreadyFocused: boolean };
      canPreventDefault: true;
    };
  };

  type MyTabNavigatorProps = {
    variant?: 'compact' | 'regular';
  };

  type MyTabMapperProps = {
    focusedRouteName: string;
  };

  const MyTabNavigator = createStandardNavigator<
    MyTabOptions,
    MyTabEventMap,
    MyTabNavigatorProps & MyTabMapperProps
  >(({ state, descriptors, actions, emitter, focusedRouteName, variant }) => {
    const route = state.routes[state.index];

    return (
      <>
        <Text>{variant}</Text>
        <Text>{focusedRouteName ?? 'Unknown'}</Text>
        <Text>{state.routes.map((r) => r.href).join('|')}</Text>
        {state.routes.map((route, index) => {
          const descriptor = descriptors[route.key];
          const focused = index === state.index;

          return (
            <Pressable
              key={route.key}
              accessibilityState={{ selected: focused }}
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
        {route ? descriptors[route.key]?.render() : null}
      </>
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
    >(MyTabNavigator, TabRouter, ({ state }) => ({
      focusedRouteName: state.routes[state.index]?.name ?? 'Unknown',
    }));

  const MyTabs = createMyTabNavigator<{
    Home: undefined;
    Feed: undefined;
  }>();

  const onTabPress = jest.fn();
  const user = userEvent.setup();

  function HomeScreen() {
    return <Text>Home screen</Text>;
  }

  function FeedScreen() {
    return <Text>Feed screen</Text>;
  }

  await render(
    <NavigationContainer
      linking={{
        config: {
          screens: {
            Home: '',
            Feed: 'feed',
          },
        },
      }}
    >
      <MyTabs.Navigator
        screenListeners={{ tabPress: onTabPress }}
        variant="compact"
      >
        <MyTabs.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Start' }}
        />
        <MyTabs.Screen name="Feed" component={FeedScreen} />
      </MyTabs.Navigator>
    </NavigationContainer>
  );

  expect(screen.getByText('compact')).not.toBeNull();
  expect(screen.getByText('Home')).not.toBeNull();
  expect(screen.getByText('/|/feed')).not.toBeNull();
  expect(screen.getByText('Start')).not.toBeNull();
  expect(screen.getByText('Home screen')).not.toBeNull();

  await user.press(screen.getByText('Feed'));

  await waitFor(() => {
    expect(screen.getAllByText('Feed')).toHaveLength(2);
    expect(screen.getByText('Feed screen')).not.toBeNull();
  });

  expect(onTabPress).toHaveBeenCalledWith(
    expect.objectContaining({
      data: { isAlreadyFocused: false },
      defaultPrevented: false,
      type: 'tabPress',
    })
  );
});

test('throws for a non-standard navigator object', () => {
  expect(() =>
    createStandardNavigationFactories(
      {
        // @ts-expect-error: invalid type for test
        type: 'custom',
        version: 1,
        NavigatorContent: () => null,
      },
      TabRouter
    )
  ).toThrow(
    'createStandardNavigationFactories only works with standard navigator objects, but got navigator of type "custom".'
  );
});

test('throws for a invalid arguments', () => {
  expect(() =>
    createStandardNavigationFactories(
      // @ts-expect-error: invalid value for test
      () => null,
      TabRouter
    )
  ).toThrow(
    'createStandardNavigationFactories only works with standard navigator objects, but got navigator of unknown type.'
  );
});

test('throws for an unsupported standard navigator version', () => {
  expect(() =>
    createStandardNavigationFactories(
      {
        type: 'standard',
        // @ts-expect-error: invalid version for test
        version: 2,
        NavigatorContent: () => null,
      },
      TabRouter
    )
  ).toThrow(
    'createStandardNavigationFactories only works with version 1 of standard navigator objects, but got version 2.'
  );
});
