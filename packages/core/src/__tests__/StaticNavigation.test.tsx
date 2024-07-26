import { expect, test } from '@jest/globals';
import type {
  DefaultRouterOptions,
  NavigationState,
} from '@react-navigation/routers';
import { render } from '@testing-library/react-native';
import assert from 'assert';
import * as React from 'react';

import { BaseNavigationContainer } from '../BaseNavigationContainer';
import { createNavigatorFactory } from '../createNavigatorFactory';
import { getStateFromPath } from '../getStateFromPath';
import {
  createComponentForStaticNavigation,
  createPathConfigForStaticNavigation,
} from '../StaticNavigation';
import type { EventMapBase } from '../types';
import { useIsFocused } from '../useIsFocused';
import { useNavigationBuilder } from '../useNavigationBuilder';
import { MockRouter } from './__fixtures__/MockRouter';

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

test('renders the specified nested navigator configuration', () => {
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

test('renders the specified nested navigator configuration with groups', () => {
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

test('handles non-function screens', () => {
  expect(() => {
    // eslint-disable-next-line @eslint-react/ensure-forward-ref-using-ref, @eslint-react/no-missing-component-display-name
    const TestScreen = React.forwardRef(() => null);

    const Root = createTestNavigator({
      screens: {
        Home: TestScreen,
        Settings: {
          screen: TestScreen,
        },
      },
    });

    const Component = createComponentForStaticNavigation(Root, 'RootNavigator');

    render(
      <BaseNavigationContainer>
        <Component />
      </BaseNavigationContainer>
    );
  }).not.toThrow();
});

test("throws if screens or groups property isn't specified", () => {
  expect(() => {
    const Root = createTestNavigator({});

    createComponentForStaticNavigation(Root, 'RootNavigator');
  }).toThrow("Couldn't find a 'screens' or 'groups' property");
});

test("doesn't throw if either screens or groups property is specified", () => {
  expect(() => {
    const Root = createTestNavigator({
      screens: {},
    });

    createComponentForStaticNavigation(Root, 'RootNavigator');
  }).not.toThrow();

  expect(() => {
    const Root = createTestNavigator({
      groups: {},
    });

    createComponentForStaticNavigation(Root, 'RootNavigator');
  }).not.toThrow();
});

test('renders the initial screen based on the order of screens', () => {
  const A = createTestNavigator({
    screens: {
      Home: TestScreen,
    },
    groups: {
      Help: {
        screens: {
          Help: TestScreen,
        },
      },
    },
  });

  const AComponent = createComponentForStaticNavigation(A, 'A');

  expect(
    render(
      <BaseNavigationContainer>
        <AComponent />
      </BaseNavigationContainer>
    )
  ).toMatchInlineSnapshot(`
<main>
  <div>
    Screen:
    Home
    (focused)
  </div>
  <div>
    Screen:
    Help
  </div>
</main>
`);

  const B = createTestNavigator({
    groups: {
      Help: {
        screens: {
          Help: TestScreen,
        },
      },
    },
    screens: {
      Home: TestScreen,
    },
  });

  const BComponent = createComponentForStaticNavigation(B, 'B');

  expect(
    render(
      <BaseNavigationContainer>
        <BComponent />
      </BaseNavigationContainer>
    )
  ).toMatchInlineSnapshot(`
<main>
  <div>
    Screen:
    Help
    (focused)
  </div>
  <div>
    Screen:
    Home
  </div>
</main>
`);
});

test('creates linking configuration for static config', () => {
  const Nested = createTestNavigator({
    screens: {
      Profile: {
        screen: TestScreen,
        linking: {
          path: 'profile/:id',
          parse: {
            id: Number,
          },
        },
      },
      Settings: {
        screen: TestScreen,
        options: {
          testId: 'settings',
        },
        linking: {
          path: 'settings',
          exact: true,
        },
      },
    },
    groups: {
      Auth: {
        screens: {
          Login: {
            screen: TestScreen,
            linking: 'login',
          },
          Register: {
            screen: TestScreen,
            linking: 'register',
          },
          Forgot: {
            screen: TestScreen,
            linking: {
              path: 'forgot-password',
              exact: true,
            },
          },
        },
      },
    },
  });

  const Root = createTestNavigator({
    screens: {
      Home: TestScreen,
      Feed: {
        screen: TestScreen,
        linking: 'feed',
      },
      Nested: {
        screen: Nested,
        linking: 'nested',
      },
    },
    groups: {
      Support: {
        screens: {
          Contact: {
            screen: TestScreen,
            linking: 'contact',
          },
          FAQ: {
            screen: TestScreen,
            linking: 'faq',
          },
        },
      },
    },
  });

  const screens = createPathConfigForStaticNavigation(Root, {});

  expect(screens).toMatchInlineSnapshot(`
{
  "Contact": {
    "path": "contact",
  },
  "FAQ": {
    "path": "faq",
  },
  "Feed": {
    "path": "feed",
  },
  "Nested": {
    "path": "nested",
    "screens": {
      "Forgot": {
        "exact": true,
        "path": "forgot-password",
      },
      "Login": {
        "path": "login",
      },
      "Profile": {
        "parse": {
          "id": [Function],
        },
        "path": "profile/:id",
      },
      "Register": {
        "path": "register",
      },
      "Settings": {
        "exact": true,
        "path": "settings",
      },
    },
  },
}
`);

  assert.ok(screens);

  expect(getStateFromPath('contact', { screens })).toEqual({
    routes: [
      {
        name: 'Contact',
        path: 'contact',
      },
    ],
  });

  expect(getStateFromPath('settings', { screens })).toEqual({
    routes: [
      {
        name: 'Nested',
        state: {
          routes: [{ name: 'Settings', path: 'settings' }],
        },
      },
    ],
  });

  expect(getStateFromPath('nested/profile/123', { screens })).toEqual({
    routes: [
      {
        name: 'Nested',
        state: {
          routes: [
            {
              name: 'Profile',
              path: 'nested/profile/123',
              params: { id: 123 },
            },
          ],
        },
      },
    ],
  });
});

test('returns undefined if there is no linking configuration', () => {
  const Nested = createTestNavigator({
    screens: {
      Profile: {
        screen: TestScreen,
      },
      Settings: {
        screen: TestScreen,
        options: {
          testId: 'settings',
        },
        linking: undefined,
      },
    },
    groups: {
      Auth: {
        screens: {
          Login: {
            screen: TestScreen,
          },
          Register: {
            screen: TestScreen,
          },
          Forgot: {
            screen: TestScreen,
          },
        },
      },
    },
  });

  const Root = createTestNavigator({
    screens: {
      Home: TestScreen,
      Feed: {
        screen: TestScreen,
      },
      Nested: {
        screen: Nested,
      },
    },
    groups: {
      Support: {
        screens: {
          Contact: {
            screen: TestScreen,
          },
          FAQ: {
            screen: TestScreen,
          },
        },
      },
    },
  });

  const screens = createPathConfigForStaticNavigation(Root, {});

  expect(screens).toBeUndefined();
});

test('automatically generates paths if auto is specified', () => {
  const NestedA = createTestNavigator({
    screens: {
      Home: TestScreen,
      Profile: {
        screen: TestScreen,
      },
      Settings: {
        screen: TestScreen,
        options: {
          testId: 'settings',
        },
      },
    },
    groups: {
      Auth: {
        screens: {
          Login: {
            screen: TestScreen,
            linking: undefined,
          },
          Register: {
            screen: TestScreen,
          },
          Forgot: {
            screen: TestScreen,
            linking: 'forgot-password',
          },
        },
      },
    },
  });

  const NestedB = createTestNavigator({
    screens: {
      Library: TestScreen,
      Wishlist: {
        screen: TestScreen,
      },
    },
  });

  const NestedC = createTestNavigator({
    screens: {
      Categories: TestScreen,
      Misc: TestScreen,
    },
  });

  const Root = createTestNavigator({
    screens: {
      NestedA,
      NestedB: {
        screen: NestedB,
        linking: 'store/:type',
      },
      NestedC,
      Feed: {
        screen: TestScreen,
      },
    },
    groups: {
      Support: {
        screens: {
          Contact: {
            screen: TestScreen,
          },
          FAQ: {
            screen: TestScreen,
          },
        },
      },
    },
  });

  const screens = createPathConfigForStaticNavigation(Root, {}, true);

  assert.ok(screens);

  expect(screens).toMatchInlineSnapshot(`
{
  "Contact": {
    "path": "contact",
  },
  "FAQ": {
    "path": "faq",
  },
  "Feed": {
    "path": "feed",
  },
  "NestedA": {
    "screens": {
      "Forgot": {
        "path": "forgot-password",
      },
      "Home": {
        "path": "",
      },
      "Profile": {
        "path": "profile",
      },
      "Register": {
        "path": "register",
      },
      "Settings": {
        "path": "settings",
      },
    },
  },
  "NestedB": {
    "path": "store/:type",
    "screens": {
      "Library": {
        "path": "library",
      },
      "Wishlist": {
        "path": "wishlist",
      },
    },
  },
  "NestedC": {
    "screens": {
      "Categories": {
        "path": "categories",
      },
      "Misc": {
        "path": "misc",
      },
    },
  },
}
`);

  expect(getStateFromPath('/', { screens })).toEqual({
    routes: [
      { name: 'NestedA', state: { routes: [{ name: 'Home', path: '/' }] } },
    ],
  });

  expect(getStateFromPath('login', { screens })).toBeUndefined();

  expect(getStateFromPath('forgot-password', { screens })).toEqual({
    routes: [
      {
        name: 'NestedA',
        state: { routes: [{ name: 'Forgot', path: 'forgot-password' }] },
      },
    ],
  });

  expect(getStateFromPath('settings', { screens })).toEqual({
    routes: [
      {
        name: 'NestedA',
        state: {
          routes: [{ name: 'Settings', path: 'settings' }],
        },
      },
    ],
  });

  expect(getStateFromPath('profile?id=123', { screens })).toEqual({
    routes: [
      {
        name: 'NestedA',
        state: {
          routes: [
            {
              name: 'Profile',
              path: 'profile?id=123',
              params: { id: '123' },
            },
          ],
        },
      },
    ],
  });

  expect(getStateFromPath('store/furniture', { screens })).toEqual({
    routes: [
      {
        name: 'NestedB',
        params: { type: 'furniture' },
        path: 'store/furniture',
      },
    ],
  });

  expect(getStateFromPath('store/digital/library', { screens })).toEqual({
    routes: [
      {
        name: 'NestedB',
        params: { type: 'digital' },
        state: { routes: [{ name: 'Library', path: 'store/digital/library' }] },
      },
    ],
  });

  expect(getStateFromPath('contact', { screens })).toEqual({
    routes: [
      {
        name: 'Contact',
        path: 'contact',
      },
    ],
  });
});

test('use initialRouteName for the automatic home screen', () => {
  const NestedA = createTestNavigator({
    initialRouteName: 'Profile',
    screens: {
      Home: TestScreen,
      Profile: {
        screen: TestScreen,
      },
      Settings: {
        screen: TestScreen,
        options: {
          testId: 'settings',
        },
      },
    },
    groups: {
      Auth: {
        screens: {
          Login: {
            screen: TestScreen,
            linking: undefined,
          },
          Register: {
            screen: TestScreen,
          },
          Forgot: {
            screen: TestScreen,
            linking: 'forgot-password',
          },
        },
      },
    },
  });

  const NestedB = createTestNavigator({
    initialRouteName: 'Wishlist',
    screens: {
      Library: TestScreen,
      Wishlist: {
        screen: TestScreen,
      },
    },
  });

  const NestedC = createTestNavigator({
    initialRouteName: 'Misc',
    screens: {
      Categories: TestScreen,
      Misc: TestScreen,
    },
  });

  const Root = createTestNavigator({
    screens: {
      NestedA,
      NestedB: {
        screen: NestedB,
        linking: 'store/:type',
      },
      NestedC,
      Feed: {
        screen: TestScreen,
      },
    },
    groups: {
      Support: {
        screens: {
          Contact: {
            screen: TestScreen,
          },
          FAQ: {
            screen: TestScreen,
          },
        },
      },
    },
  });

  const screens = createPathConfigForStaticNavigation(Root, {}, true);

  assert.ok(screens);

  expect(screens).toMatchInlineSnapshot(`
{
  "Contact": {
    "path": "contact",
  },
  "FAQ": {
    "path": "faq",
  },
  "Feed": {
    "path": "feed",
  },
  "NestedA": {
    "screens": {
      "Forgot": {
        "path": "forgot-password",
      },
      "Home": {
        "path": "home",
      },
      "Profile": {
        "path": "",
      },
      "Register": {
        "path": "register",
      },
      "Settings": {
        "path": "settings",
      },
    },
  },
  "NestedB": {
    "path": "store/:type",
    "screens": {
      "Library": {
        "path": "library",
      },
      "Wishlist": {
        "path": "wishlist",
      },
    },
  },
  "NestedC": {
    "screens": {
      "Categories": {
        "path": "categories",
      },
      "Misc": {
        "path": "misc",
      },
    },
  },
}
`);

  expect(getStateFromPath('/', { screens })).toEqual({
    routes: [
      { name: 'NestedA', state: { routes: [{ name: 'Profile', path: '/' }] } },
    ],
  });

  expect(getStateFromPath('login', { screens })).toBeUndefined();

  expect(getStateFromPath('forgot-password', { screens })).toEqual({
    routes: [
      {
        name: 'NestedA',
        state: { routes: [{ name: 'Forgot', path: 'forgot-password' }] },
      },
    ],
  });

  expect(getStateFromPath('settings', { screens })).toEqual({
    routes: [
      {
        name: 'NestedA',
        state: {
          routes: [{ name: 'Settings', path: 'settings' }],
        },
      },
    ],
  });

  expect(getStateFromPath('store/furniture', { screens })).toEqual({
    routes: [
      {
        name: 'NestedB',
        params: { type: 'furniture' },
        path: 'store/furniture',
      },
    ],
  });

  expect(getStateFromPath('store/digital/library', { screens })).toEqual({
    routes: [
      {
        name: 'NestedB',
        params: { type: 'digital' },
        state: { routes: [{ name: 'Library', path: 'store/digital/library' }] },
      },
    ],
  });

  expect(getStateFromPath('contact', { screens })).toEqual({
    routes: [
      {
        name: 'Contact',
        path: 'contact',
      },
    ],
  });
});
