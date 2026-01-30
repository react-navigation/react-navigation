import { expect, test } from '@jest/globals';
import type {
  DefaultRouterOptions,
  NavigationState,
} from '@react-navigation/routers';
import { act, render } from '@testing-library/react-native';
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

const TestScreenWithNavigation = ({ route, navigation }: any) => {
  return (
    <>
      Screen:{route.name}
      {navigation ? '(has navigation)' : '(no navigation)'}
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

test('handles conditional groups with nested if hooks', () => {
  const useShowNested = () => {
    return React.useSyncExternalStore(
      (subscriber) => {
        onUpdate = subscriber;

        return () => {
          onUpdate = undefined;
        };
      },
      () => showNested,
      () => showNested
    );
  };

  const createUseTest = (value: boolean) => () => {
    // Use a hook to test that it follows rules of hooks
    const [state] = React.useState(value);

    return state;
  };

  const Root = createTestNavigator({
    groups: {
      User: {
        if: useShowNested,
        screens: {
          Profile: TestScreen,
          Settings: {
            screen: TestScreen,
            if: createUseTest(true),
          },
        },
      },
      Guest: {
        screens: {
          Feed: TestScreen,
          Details: {
            screen: TestScreen,
            if: createUseTest(false),
          },
        },
      },
    },
  });

  let onUpdate: (() => void) | undefined;
  let showNested = true;

  const Component = createComponentForStaticNavigation(Root, 'RootNavigator');

  const element = (
    <BaseNavigationContainer>
      <Component />
    </BaseNavigationContainer>
  );

  const root = render(element);

  expect(root).toMatchInlineSnapshot(`
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
  <div>
    Screen:
    Feed
  </div>
</main>
`);

  act(() => {
    showNested = false;
    onUpdate?.();
  });

  root.rerender(element);

  expect(root).toMatchInlineSnapshot(`
<main>
  <div>
    Screen:
    Feed
    (focused)
  </div>
</main>
`);
});

test('handles non-function screens', () => {
  expect(() => {
    // eslint-disable-next-line @eslint-react/no-useless-forward-ref, @eslint-react/ensure-forward-ref-using-ref, @eslint-react/no-missing-component-display-name
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
      { name: 'NestedA', state: { routes: [{ name: 'Home', path: '' }] } },
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
      { name: 'NestedA', state: { routes: [{ name: 'Profile', path: '' }] } },
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

test('handles config with only groups', () => {
  const Root = createTestNavigator({
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
      Legal: {
        screens: {
          Terms: {
            screen: TestScreen,
          },
          Privacy: {
            screen: TestScreen,
          },
        },
      },
    },
  });

  const screens = createPathConfigForStaticNavigation(Root, {}, true);

  expect(screens).toMatchInlineSnapshot(`
{
  "Contact": {
    "path": "",
  },
  "FAQ": {
    "path": "faq",
  },
  "Privacy": {
    "path": "privacy",
  },
  "Terms": {
    "path": "terms",
  },
}
`);
});

test("doesn't generate empty path if initialRouteName already has a path", () => {
  const Nested = createTestNavigator({
    initialRouteName: 'Second',
    screens: {
      First: {
        screen: TestScreen,
      },
      Second: {
        screen: TestScreen,
        linking: {
          path: 'second',
        },
      },
      Third: {
        screen: TestScreen,
      },
    },
  });

  expect(createPathConfigForStaticNavigation(Nested, {}, true))
    .toMatchInlineSnapshot(`
{
  "First": {
    "path": "first",
  },
  "Second": {
    "path": "second",
  },
  "Third": {
    "path": "third",
  },
}
`);

  const Root = createTestNavigator({
    screens: {
      Nested: {
        screen: Nested,
      },
      Other: {
        screen: TestScreen,
      },
    },
  });

  expect(createPathConfigForStaticNavigation(Root, {}, true))
    .toMatchInlineSnapshot(`
{
  "Nested": {
    "screens": {
      "First": {
        "path": "first",
      },
      "Second": {
        "path": "second",
      },
      "Third": {
        "path": "third",
      },
    },
  },
  "Other": {
    "path": "other",
  },
}
`);
});

test("doesn't generate empty path if it's already present", () => {
  const Nested = createTestNavigator({
    initialRouteName: 'Updates',
    screens: {
      Home: {
        screen: TestScreen,
        options: {
          title: 'Feed',
        },
        linking: {
          path: '',
        },
      },
      Updates: {
        screen: TestScreen,
      },
    },
  });

  const Root = createTestNavigator({
    groups: {
      Guest: {
        screens: {
          SignIn: {
            screen: TestScreen,
            options: {
              title: 'Welcome!',
            },
            linking: {
              path: 'sign-in',
            },
          },
        },
      },
      User: {
        screens: {
          Profile: {
            screen: TestScreen,
          },
          HomeTabs: {
            screen: Nested,
          },
        },
      },
    },
  });

  const screens = createPathConfigForStaticNavigation(Root, {}, true);

  expect(screens).toMatchInlineSnapshot(`
{
  "HomeTabs": {
    "screens": {
      "Home": {
        "path": "",
      },
      "Updates": {
        "path": "updates",
      },
    },
  },
  "Profile": {
    "path": "profile",
  },
  "SignIn": {
    "path": "sign-in",
  },
}
`);
});

test("doesn't skip initial screen detection if parent has empty path", () => {
  const Nested = createTestNavigator({
    screens: {
      Home: {
        screen: TestScreen,
        options: {
          title: 'Feed',
        },
      },
      Updates: {
        screen: TestScreen,
      },
    },
  });

  const Root = createTestNavigator({
    groups: {
      Guest: {
        screens: {
          SignIn: {
            screen: TestScreen,
            options: {
              title: 'Welcome!',
            },
            linking: {
              path: 'sign-in',
            },
          },
        },
      },
      User: {
        screens: {
          HomeTabs: {
            screen: Nested,
            linking: {
              path: '/',
            },
          },
          Profile: {
            screen: TestScreen,
          },
        },
      },
    },
  });

  const screens = createPathConfigForStaticNavigation(Root, {}, true);

  expect(screens).toMatchInlineSnapshot(`
{
  "HomeTabs": {
    "path": "",
    "screens": {
      "Home": {
        "path": "",
      },
      "Updates": {
        "path": "updates",
      },
    },
  },
  "Profile": {
    "path": "profile",
  },
  "SignIn": {
    "path": "sign-in",
  },
}
`);
});

test('adds group linking with string path', () => {
  const Root = createTestNavigator({
    groups: {
      User: {
        linking: 'users',
        screens: {
          Profile: {
            screen: TestScreen,
            linking: 'profile',
          },
          Settings: {
            screen: TestScreen,
            linking: 'settings/:tab',
          },
        },
      },
      Admin: {
        linking: 'admin',
        screens: {
          Dashboard: {
            screen: TestScreen,
            linking: 'dashboard',
          },
          Reports: {
            screen: TestScreen,
            linking: 'reports',
          },
        },
      },
    },
  });

  const screens = createPathConfigForStaticNavigation(Root, {});

  expect(screens).toMatchInlineSnapshot(`
{
  "Dashboard": {
    "path": "admin/dashboard",
  },
  "Profile": {
    "path": "users/profile",
  },
  "Reports": {
    "path": "admin/reports",
  },
  "Settings": {
    "path": "users/settings/:tab",
  },
}
`);
});

test('adds group linking with object configuration', () => {
  const Root = createTestNavigator({
    groups: {
      User: {
        linking: {
          path: 'users/:userId',
          parse: {
            userId: (id: string) => parseInt(id, 10),
          },
          stringify: {
            userId: (id: number) => id.toString(),
          },
        },
        screens: {
          Profile: {
            screen: TestScreen,
            linking: 'profile',
          },
          Settings: {
            screen: TestScreen,
            linking: {
              path: 'settings/:tab',
              parse: {
                tab: (tab: string) => tab.toLowerCase(),
              },
            },
          },
        },
      },
    },
  });

  const screens = createPathConfigForStaticNavigation(Root, {});

  expect(screens).toMatchInlineSnapshot(`
{
  "Profile": {
    "parse": {
      "userId": [Function],
    },
    "path": "users/:userId/profile",
    "stringify": {
      "userId": [Function],
    },
  },
  "Settings": {
    "parse": {
      "tab": [Function],
      "userId": [Function],
    },
    "path": "users/:userId/settings/:tab",
    "stringify": {
      "userId": [Function],
    },
  },
}
`);
});

test('handles group linking with nested navigators', () => {
  const Nested = createTestNavigator({
    screens: {
      Home: TestScreen,
      Feed: {
        screen: TestScreen,
        linking: 'feed',
      },
    },
  });

  const Root = createTestNavigator({
    groups: {
      Main: {
        linking: 'app',
        screens: {
          Tabs: {
            screen: Nested,
            linking: 'tabs',
          },
          Profile: {
            screen: TestScreen,
            linking: 'profile',
          },
        },
      },
      Auth: {
        linking: 'auth',
        screens: {
          Login: {
            screen: TestScreen,
            linking: 'login',
          },
          Register: {
            screen: TestScreen,
            linking: 'register',
          },
        },
      },
    },
  });

  const screens = createPathConfigForStaticNavigation(Root, {});

  expect(screens).toMatchInlineSnapshot(`
{
  "Login": {
    "path": "auth/login",
  },
  "Profile": {
    "path": "app/profile",
  },
  "Register": {
    "path": "auth/register",
  },
  "Tabs": {
    "path": "app/tabs",
    "screens": {
      "Feed": {
        "path": "feed",
      },
    },
  },
}
`);
});

test('handles group linking with auto path generation', () => {
  const Root = createTestNavigator({
    groups: {
      User: {
        linking: 'users',
        screens: {
          Profile: TestScreen,
          Settings: {
            screen: TestScreen,
            linking: 'custom-settings',
          },
        },
      },
      Admin: {
        linking: 'admin',
        screens: {
          Dashboard: TestScreen,
          UserManagement: TestScreen,
        },
      },
    },
  });

  const screens = createPathConfigForStaticNavigation(Root, {}, true);

  expect(screens).toMatchInlineSnapshot(`
{
  "Dashboard": {
    "path": "admin/dashboard",
  },
  "Profile": {
    "path": "users/profile",
  },
  "Settings": {
    "path": "users/custom-settings",
  },
  "UserManagement": {
    "path": "admin/user-management",
  },
}
`);
});

test('handles group linking with empty path prefix', () => {
  const Root = createTestNavigator({
    groups: {
      Root: {
        linking: '',
        screens: {
          Home: {
            screen: TestScreen,
            linking: 'home',
          },
          About: {
            screen: TestScreen,
            linking: 'about',
          },
        },
      },
      User: {
        linking: 'user',
        screens: {
          Profile: {
            screen: TestScreen,
            linking: '',
          },
          Settings: {
            screen: TestScreen,
            linking: 'settings',
          },
        },
      },
    },
  });

  const screens = createPathConfigForStaticNavigation(Root, {});

  expect(screens).toMatchInlineSnapshot(`
{
  "About": {
    "path": "about",
  },
  "Home": {
    "path": "home",
  },
  "Profile": {
    "path": "user",
  },
  "Settings": {
    "path": "user/settings",
  },
}
`);
});

test('merges parse and stringify options from group and screen linking', () => {
  const Root = createTestNavigator({
    groups: {
      User: {
        linking: {
          path: 'users/:userId',
          parse: {
            userId: (id: string) => parseInt(id, 10),
            sharedParam: (val: string) => val.toUpperCase(),
          },
          stringify: {
            userId: (id: number) => id.toString(),
            sharedParam: (val: string) => val.toLowerCase(),
          },
        },
        screens: {
          Profile: {
            screen: TestScreen,
            linking: {
              path: 'profile/:tab',
              parse: {
                tab: (tab: string) => tab.toLowerCase(),
                sharedParam: (val: string) => val + '_override',
              },
              stringify: {
                tab: (tab: string) => tab.toUpperCase(),
              },
            },
          },
        },
      },
    },
  });

  const screens = createPathConfigForStaticNavigation(Root, {});

  const Profile =
    typeof screens?.Profile === 'object' ? screens?.Profile : null;

  expect(Profile?.parse).toHaveProperty('userId');
  expect(Profile?.parse).toHaveProperty('tab');
  expect(Profile?.parse).toHaveProperty('sharedParam');
  expect(Profile?.stringify).toHaveProperty('userId');
  expect(Profile?.stringify).toHaveProperty('tab');
  expect(Profile?.stringify).toHaveProperty('sharedParam');
  expect(Profile?.path).toBe('users/:userId/profile/:tab');
});

test('passes navigation prop to screen components for parity with dynamic API', () => {
  const Root = createTestNavigator({
    screens: {
      Home: TestScreenWithNavigation,
      Settings: {
        screen: TestScreenWithNavigation,
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
        (has navigation)
      </div>
      <div>
        Screen:
        Settings
        (has navigation)
      </div>
    </main>
  `);
});
