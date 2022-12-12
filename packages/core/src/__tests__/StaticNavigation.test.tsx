import type {
  DefaultRouterOptions,
  NavigationState,
} from '@react-navigation/routers';
import { render } from '@testing-library/react-native';
import * as React from 'react';

import BaseNavigationContainer from '../BaseNavigationContainer';
import createNavigatorFactory from '../createNavigatorFactory';
import { createComponentForStaticNavigation } from '../StaticNavigation';
import type { EventMapBase } from '../types';
import useIsFocused from '../useIsFocused';
import useNavigationBuilder from '../useNavigationBuilder';
import MockRouter from './__fixtures__/MockRouter';

const TestNavigator = (props: any) => {
  const { state, descriptors } = useNavigationBuilder<
    NavigationState,
    DefaultRouterOptions,
    {},
    { className?: string; testId?: string },
    EventMapBase
  >(MockRouter, props);

  return (
    <main>
      {state.routes.map((route) => {
        const descriptor = descriptors[route.key];

        return (
          <div
            key={route.key}
            className={descriptor.options?.className}
            data-testid={descriptor.options?.testId}
          >
            {descriptor.render()}
          </div>
        );
      })}
    </main>
  );
};

const createTestNavigator = createNavigatorFactory(TestNavigator);

const TestScreen = ({ route }: any) => {
  const isFocused = useIsFocused();

  return (
    <>
      Screen:{route.name}
      {isFocused ? '(focused)' : null}
    </>
  );
};

it('renders the specified nested navigator configuration', () => {
  const Nested = createTestNavigator({
    screens: {
      Profile: TestScreen,
      Settings: {
        screen: TestScreen,
        options: {
          testId: 'settings',
        },
      },
    },
  });

  const Root = createTestNavigator({
    initialRouteName: 'Nested',
    screenOptions: {
      className: 'root-screen',
    },
    screens: {
      Home: TestScreen,
      Feed: {
        screen: TestScreen,
        if: () => false,
      },
      Nested: {
        screen: Nested,
        if: () => true,
      },
    },
  });

  const Component = createComponentForStaticNavigation(Root, 'RootNavigator');

  const element = render(
    <BaseNavigationContainer>
      <Component />
    </BaseNavigationContainer>
  );

  expect(element).toMatchInlineSnapshot(`
    <main>
      <div
        className="root-screen"
      >
        Screen:
        Home
      </div>
      <div
        className="root-screen"
      >
        <main>
          <div>
            Screen:
            Profile
            (focused)
          </div>
          <div
            data-testid="settings"
          >
            Screen:
            Settings
          </div>
        </main>
      </div>
    </main>
  `);
});

it('renders the specified nested navigator configuration with groups', () => {
  const Nested = createTestNavigator({
    screens: {
      Profile: TestScreen,
      Settings: TestScreen,
    },
  });

  const Root = createTestNavigator({
    initialRouteName: 'Nested',
    screens: {
      Home: TestScreen,
    },
    groups: {
      Auth: {
        if: () => false,
        screens: {
          Login: TestScreen,
          Register: TestScreen,
          Forgot: {
            screen: TestScreen,
            if: () => true,
          },
        },
      },
      Main: {
        if: () => true,
        screenOptions: {
          className: 'main-screen',
        },
        screens: {
          Nested: Nested,
          Feed: {
            screen: TestScreen,
            options: {
              testId: 'feed',
            },
          },
          Details: {
            screen: TestScreen,
            if: () => false,
          },
        },
      },
    },
  });

  const Component = createComponentForStaticNavigation(Root, 'RootNavigator');

  const element = render(
    <BaseNavigationContainer>
      <Component />
    </BaseNavigationContainer>
  );

  expect(element).toMatchInlineSnapshot(`
    <main>
      <div>
        Screen:
        Home
      </div>
      <div
        className="main-screen"
      >
        <main>
          <div>
            Screen:
            Profile
            (focused)
          </div>
          <div>
            Screen:
            Settings
          </div>
        </main>
      </div>
      <div
        className="main-screen"
        data-testid="feed"
      >
        Screen:
        Feed
      </div>
    </main>
  `);
});
