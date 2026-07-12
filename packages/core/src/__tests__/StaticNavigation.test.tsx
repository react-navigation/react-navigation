import { expect, jest, test } from '@jest/globals';
import type {
  DefaultRouterOptions,
  NavigationState,
  ParamListBase,
} from '@react-navigation/routers';
import { act, render } from '@testing-library/react-native';
import * as React from 'react';
import { Text } from 'react-native';

import { BaseNavigationContainer } from '../BaseNavigationContainer';
import { createNavigationContainerRef } from '../createNavigationContainerRef';
import { createNavigatorFactory } from '../createNavigatorFactory';
import { getStateFromPath } from '../getStateFromPath';
import { createPathConfigForStaticNavigation } from '../StaticNavigation';
import type {
  DefaultNavigatorOptions,
  EventMapBase,
  NavigatorTypeBagBase,
} from '../types';
import { useIsFocused } from '../useIsFocused';
import { useNavigationBuilder } from '../useNavigationBuilder';
import { MockRouter } from './__fixtures__/MockRouter';

type TestNavigatorScreenOptions = {
  className?: string;
  testId?: string;
  title?: string;
};

type TestNavigatorProps = DefaultNavigatorOptions<
  ParamListBase,
  NavigationState,
  TestNavigatorScreenOptions,
  EventMapBase,
  unknown
>;

const TestNavigator = (props: TestNavigatorProps) => {
  const { state, descriptors, NavigationContent } = useNavigationBuilder<
    NavigationState,
    DefaultRouterOptions,
    {},
    TestNavigatorScreenOptions,
    EventMapBase
  >(MockRouter, props);

  return (
    <NavigationContent>
      <main>
        {state.routes.map((route) => {
          const descriptor = descriptors[route.key];

          return (
            <div
              key={route.key}
              className={descriptor?.options?.className}
              data-testid={descriptor?.options?.testId}
            >
              {descriptor?.render()}
            </div>
          );
        })}
      </main>
    </NavigationContent>
  );
};

interface TestNavigatorTypeBag extends NavigatorTypeBagBase {
  ScreenOptions: TestNavigatorScreenOptions;
  Navigator: typeof TestNavigator;
}

const createTestNavigator =
  createNavigatorFactory<TestNavigatorTypeBag>(TestNavigator);

const TestScreen = ({ route }: any) => {
  const isFocused = useIsFocused();

  return (
    <Text>
      Screen:{route.name}
      {isFocused ? '(focused)' : null}
    </Text>
  );
};

test('renders the specified nested navigator configuration', async () => {
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

  const RootComponent = Root.getComponent();

  const element = await render(
    <BaseNavigationContainer>
      <RootComponent />
    </BaseNavigationContainer>
  );

  expect(element).toMatchInlineSnapshot(`
<main>
  <div
    className="root-screen"
  >
    <Text>
      Screen:
      Home
    </Text>
  </div>
  <div
    className="root-screen"
  >
    <main>
      <div>
        <Text>
          Screen:
          Profile
          (focused)
        </Text>
      </div>
      <div
        data-testid="settings"
      >
        <Text>
          Screen:
          Settings
        </Text>
      </div>
    </main>
  </div>
</main>
`);
});

test('renders the specified nested navigator configuration with groups', async () => {
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

  const RootComponent = Root.getComponent();

  const element = await render(
    <BaseNavigationContainer>
      <RootComponent />
    </BaseNavigationContainer>
  );

  expect(element).toMatchInlineSnapshot(`
<main>
  <div>
    <Text>
      Screen:
      Home
    </Text>
  </div>
  <div
    className="main-screen"
  >
    <main>
      <div>
        <Text>
          Screen:
          Profile
          (focused)
        </Text>
      </div>
      <div>
        <Text>
          Screen:
          Settings
        </Text>
      </div>
    </main>
  </div>
  <div
    className="main-screen"
    data-testid="feed"
  >
    <Text>
      Screen:
      Feed
    </Text>
  </div>
</main>
`);
});

test('handles conditional groups with nested if hooks', async () => {
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

  const RootComponent = Root.getComponent();

  const element = (
    <BaseNavigationContainer>
      <RootComponent />
    </BaseNavigationContainer>
  );

  const root = await render(element);

  expect(root).toMatchInlineSnapshot(`
<main>
  <div>
    <Text>
      Screen:
      Profile
      (focused)
    </Text>
  </div>
  <div>
    <Text>
      Screen:
      Settings
    </Text>
  </div>
  <div>
    <Text>
      Screen:
      Feed
    </Text>
  </div>
</main>
`);

  await act(() => {
    showNested = false;
    onUpdate?.();
  });

  expect(root).toMatchInlineSnapshot(`
<main>
  <div>
    <Text>
      Screen:
      Feed
      (focused)
    </Text>
  </div>
</main>
`);
});

test('handles non-function screens', async () => {
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

  const RootComponent = Root.getComponent();

  await expect(
    render(
      <BaseNavigationContainer>
        <RootComponent />
      </BaseNavigationContainer>
    )
  ).resolves.toBeDefined();
});

test('throws when static screen config has no screen property', () => {
  expect(() =>
    createTestNavigator({
      screens: {
        // @ts-expect-error: intentionally invalid config
        Profile: {
          options: {
            title: 'Profile',
          },
        },
      },
    })
  ).toThrow("Couldn't find a 'screen' property for the screen 'Profile'.");
});

test("throws if screens or groups property isn't specified", () => {
  expect(() => {
    // @ts-expect-error: invalid static config for runtime error test
    createTestNavigator({});
  }).toThrow("Couldn't find a 'screens' or 'groups' property");
});

test('throws if no screens are specified', () => {
  expect(() => {
    createTestNavigator({
      screens: {},
    });
  }).toThrow("Couldn't find any screens in the 'screens' or 'groups' property");

  expect(() => {
    createTestNavigator({
      groups: {},
    });
  }).toThrow("Couldn't find any screens in the 'screens' or 'groups' property");

  expect(() => {
    createTestNavigator({
      screens: {},
      groups: {},
    });
  }).toThrow("Couldn't find any screens in the 'screens' or 'groups' property");
});

test('renders the initial screen based on the order of screens', async () => {
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

  const AComponent = A.getComponent();

  expect(
    await render(
      <BaseNavigationContainer>
        <AComponent />
      </BaseNavigationContainer>
    )
  ).toMatchInlineSnapshot(`
<main>
  <div>
    <Text>
      Screen:
      Home
      (focused)
    </Text>
  </div>
  <div>
    <Text>
      Screen:
      Help
    </Text>
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

  const BComponent = B.getComponent();

  expect(
    await render(
      <BaseNavigationContainer>
        <BComponent />
      </BaseNavigationContainer>
    )
  ).toMatchInlineSnapshot(`
<main>
  <div>
    <Text>
      Screen:
      Help
      (focused)
    </Text>
  </div>
  <div>
    <Text>
      Screen:
      Home
    </Text>
  </div>
</main>
`);
});

test('passes additional props and options to the navigator component', async () => {
  const Root = createTestNavigator({
    initialRouteName: 'Feed',
    screenOptions: {
      className: 'root-screen',
    },
    screens: {
      Home: TestScreen,
      Feed: TestScreen,
      Profile: TestScreen,
    },
  });

  const RootComponent = Root.getComponent();

  expect(
    await render(
      <BaseNavigationContainer>
        <RootComponent
          initialRouteName="Profile"
          screenOptions={{ testId: 'my-test-id' }}
        />
      </BaseNavigationContainer>
    )
  ).toMatchInlineSnapshot(`
<main>
  <div
    className="root-screen"
    data-testid="my-test-id"
  >
    <Text>
      Screen:
      Home
    </Text>
  </div>
  <div
    className="root-screen"
    data-testid="my-test-id"
  >
    <Text>
      Screen:
      Feed
    </Text>
  </div>
  <div
    className="root-screen"
    data-testid="my-test-id"
  >
    <Text>
      Screen:
      Profile
      (focused)
    </Text>
  </div>
</main>
`);
});

test('renders wrapped navigator and merges options objects', async () => {
  const Root = createTestNavigator({
    initialRouteName: 'Feed',
    screenOptions: {
      className: 'config-class',
      testId: 'config-test-id',
    },
    screens: {
      Feed: TestScreen,
      Profile: TestScreen,
      Settings: TestScreen,
    },
  }).with(({ Navigator }) => {
    return (
      <section data-testid="root-wrapper">
        <Navigator
          initialRouteName="Profile"
          screenOptions={{ testId: 'navigator-test-id' }}
        />
      </section>
    );
  });

  expect(Root).not.toHaveProperty('with');

  const RootComponent = Root.getComponent();

  const element = await render(
    <BaseNavigationContainer>
      <RootComponent />
    </BaseNavigationContainer>
  );

  expect(element).toMatchInlineSnapshot(`
<section
  data-testid="root-wrapper"
>
  <main>
    <div
      className="config-class"
      data-testid="navigator-test-id"
    >
      <Text>
        Screen:
        Feed
      </Text>
    </div>
    <div
      className="config-class"
      data-testid="navigator-test-id"
    >
      <Text>
        Screen:
        Profile
        (focused)
      </Text>
    </div>
    <div
      className="config-class"
      data-testid="navigator-test-id"
    >
      <Text>
        Screen:
        Settings
      </Text>
    </div>
  </main>
</section>
`);
});

test('renders wrapped navigator and merges options object and options callback prop', async () => {
  const Root = createTestNavigator({
    initialRouteName: 'Feed',
    screenOptions: {
      className: 'config-class',
      testId: 'config-test-id',
    },
    screens: {
      Feed: TestScreen,
      Profile: TestScreen,
      Settings: TestScreen,
    },
  }).with(({ Navigator }) => {
    return (
      <section data-testid="root-wrapper">
        <Navigator
          initialRouteName="Profile"
          screenOptions={({ route }) => ({
            testId: `navigator-${route.name}`,
          })}
        />
      </section>
    );
  });

  expect(Root).not.toHaveProperty('with');

  const RootComponent = Root.getComponent();

  const element = await render(
    <BaseNavigationContainer>
      <RootComponent />
    </BaseNavigationContainer>
  );

  expect(element).toMatchInlineSnapshot(`
<section
  data-testid="root-wrapper"
>
  <main>
    <div
      className="config-class"
      data-testid="navigator-Feed"
    >
      <Text>
        Screen:
        Feed
      </Text>
    </div>
    <div
      className="config-class"
      data-testid="navigator-Profile"
    >
      <Text>
        Screen:
        Profile
        (focused)
      </Text>
    </div>
    <div
      className="config-class"
      data-testid="navigator-Settings"
    >
      <Text>
        Screen:
        Settings
      </Text>
    </div>
  </main>
</section>
`);
});

test('renders wrapped navigator and merges options callback and options object prop', async () => {
  const Root = createTestNavigator({
    initialRouteName: 'Feed',
    screenOptions: ({ route }) => {
      return {
        className: `${route.name}-config-class`,
        testId: `config-${route.name}`,
      };
    },
    screens: {
      Feed: TestScreen,
      Profile: TestScreen,
      Settings: TestScreen,
    },
  }).with(({ Navigator }) => {
    return (
      <section data-testid="root-wrapper">
        <Navigator
          initialRouteName="Profile"
          screenOptions={{ testId: 'navigator-test-id' }}
        />
      </section>
    );
  });

  expect(Root).not.toHaveProperty('with');

  const RootComponent = Root.getComponent();

  const element = await render(
    <BaseNavigationContainer>
      <RootComponent />
    </BaseNavigationContainer>
  );

  expect(element).toMatchInlineSnapshot(`
<section
  data-testid="root-wrapper"
>
  <main>
    <div
      className="Feed-config-class"
      data-testid="navigator-test-id"
    >
      <Text>
        Screen:
        Feed
      </Text>
    </div>
    <div
      className="Profile-config-class"
      data-testid="navigator-test-id"
    >
      <Text>
        Screen:
        Profile
        (focused)
      </Text>
    </div>
    <div
      className="Settings-config-class"
      data-testid="navigator-test-id"
    >
      <Text>
        Screen:
        Settings
      </Text>
    </div>
  </main>
</section>
`);
});

test('renders wrapped navigator and merges options and listeners callbacks', async () => {
  const configFocusListener = jest.fn();
  const navigatorBlurListener = jest.fn();

  const Root = createTestNavigator({
    initialRouteName: 'Feed',
    screenOptions: ({ route }) => ({
      className: `${route.name}-config-class`,
      testId: `config-${route.name}`,
    }),
    screenListeners: () => ({
      focus: configFocusListener,
    }),
    screens: {
      Feed: TestScreen,
      Profile: TestScreen,
      Settings: TestScreen,
    },
  }).with(({ Navigator }) => {
    return (
      <section data-testid="root-wrapper">
        <Navigator
          initialRouteName="Profile"
          screenOptions={({ route }) => ({
            testId: `navigator-${route.name}`,
          })}
          screenListeners={() => ({
            blur: navigatorBlurListener,
          })}
        />
      </section>
    );
  });

  expect(Root).not.toHaveProperty('with');

  const RootComponent = Root.getComponent();

  const ref = createNavigationContainerRef<ParamListBase>();

  const element = await render(
    <BaseNavigationContainer ref={ref}>
      <RootComponent />
    </BaseNavigationContainer>
  );

  expect(element).toMatchInlineSnapshot(`
<section
  data-testid="root-wrapper"
>
  <main>
    <div
      className="Feed-config-class"
      data-testid="navigator-Feed"
    >
      <Text>
        Screen:
        Feed
      </Text>
    </div>
    <div
      className="Profile-config-class"
      data-testid="navigator-Profile"
    >
      <Text>
        Screen:
        Profile
        (focused)
      </Text>
    </div>
    <div
      className="Settings-config-class"
      data-testid="navigator-Settings"
    >
      <Text>
        Screen:
        Settings
      </Text>
    </div>
  </main>
</section>
`);

  await act(() => ref.current?.navigate('Feed'));

  expect(configFocusListener).toHaveBeenCalled();
  expect(navigatorBlurListener).toHaveBeenCalled();
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

  if (screens == null) {
    throw new Error('Expected screens to be defined');
  }

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
        linking: null,
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

test('marks a reused screen with the same explicit path as shared', () => {
  const Profile = {
    screen: TestScreen,
    linking: 'profile/:id',
  };

  const HomeStack = createTestNavigator({
    screens: {
      Home: {
        screen: TestScreen,
      },
      Profile,
    },
  });

  const SearchStack = createTestNavigator({
    screens: {
      Search: {
        screen: TestScreen,
        linking: 'search',
      },
      Profile,
    },
  });

  const Tabs = createTestNavigator({
    screens: {
      HomeTab: {
        screen: HomeStack,
      },
      SearchTab: {
        screen: SearchStack,
      },
    },
  });

  expect(createPathConfigForStaticNavigation(Tabs, {}, true)).toEqual({
    HomeTab: {
      screens: {
        Home: {
          path: '',
        },
        Profile: {
          path: 'profile/:id',
          shared: true,
        },
      },
    },
    SearchTab: {
      screens: {
        Profile: {
          path: 'profile/:id',
          shared: true,
        },
        Search: {
          path: 'search',
        },
      },
    },
  });
});

test('marks a reused screen with the same generated path as shared', () => {
  const Profile = {
    screen: TestScreen,
  };

  const HomeStack = createTestNavigator({
    screens: {
      Home: {
        screen: TestScreen,
      },
      Profile,
    },
  });

  const SearchStack = createTestNavigator({
    screens: {
      Search: {
        screen: TestScreen,
        linking: 'search',
      },
      Profile,
    },
  });

  const Tabs = createTestNavigator({
    screens: {
      HomeTab: {
        screen: HomeStack,
      },
      SearchTab: {
        screen: SearchStack,
      },
    },
  });

  expect(createPathConfigForStaticNavigation(Tabs, {}, true)).toEqual({
    HomeTab: {
      screens: {
        Home: {
          path: '',
        },
        Profile: {
          path: 'profile',
          shared: true,
        },
      },
    },
    SearchTab: {
      screens: {
        Profile: {
          path: 'profile',
          shared: true,
        },
        Search: {
          path: 'search',
        },
      },
    },
  });
});

test('marks the same component with the same explicit path as shared', () => {
  const HomeStack = createTestNavigator({
    screens: {
      Home: {
        screen: TestScreen,
      },
      Profile: {
        screen: TestScreen,
        linking: 'profile/:id',
      },
    },
  });

  const SearchStack = createTestNavigator({
    screens: {
      Search: {
        screen: TestScreen,
        linking: 'search',
      },
      Profile: {
        screen: TestScreen,
        linking: 'profile/:id',
      },
    },
  });

  const Tabs = createTestNavigator({
    screens: {
      HomeTab: {
        screen: HomeStack,
      },
      SearchTab: {
        screen: SearchStack,
      },
    },
  });

  expect(createPathConfigForStaticNavigation(Tabs, {}, true)).toEqual({
    HomeTab: {
      screens: {
        Home: {
          path: '',
        },
        Profile: {
          path: 'profile/:id',
          shared: true,
        },
      },
    },
    SearchTab: {
      screens: {
        Profile: {
          path: 'profile/:id',
          shared: true,
        },
        Search: {
          path: 'search',
        },
      },
    },
  });
});

test('marks the same component with the same generated path as shared', () => {
  const HomeStack = createTestNavigator({
    screens: {
      Home: {
        screen: TestScreen,
      },
      Profile: {
        screen: TestScreen,
      },
    },
  });

  const SearchStack = createTestNavigator({
    screens: {
      Search: {
        screen: TestScreen,
        linking: 'search',
      },
      Profile: {
        screen: TestScreen,
      },
    },
  });

  const Tabs = createTestNavigator({
    screens: {
      HomeTab: {
        screen: HomeStack,
      },
      SearchTab: {
        screen: SearchStack,
      },
    },
  });

  expect(createPathConfigForStaticNavigation(Tabs, {}, true)).toEqual({
    HomeTab: {
      screens: {
        Home: {
          path: '',
        },
        Profile: {
          path: 'profile',
          shared: true,
        },
      },
    },
    SearchTab: {
      screens: {
        Profile: {
          path: 'profile',
          shared: true,
        },
        Search: {
          path: 'search',
        },
      },
    },
  });
});

test("doesn't mark a reused screen with different paths as shared", () => {
  const Profile = {
    screen: TestScreen,
    linking: 'profile/:id',
  };

  const HomeStack = createTestNavigator({
    screens: {
      Profile,
    },
  });

  const SearchStack = createTestNavigator({
    screens: {
      Profile,
    },
  });

  const Tabs = createTestNavigator({
    screens: {
      HomeTab: {
        screen: HomeStack,
      },
      SearchTab: {
        screen: SearchStack,
        linking: 'search',
      },
    },
  });

  expect(createPathConfigForStaticNavigation(Tabs, {})).toEqual({
    HomeTab: {
      screens: {
        Profile: {
          path: 'profile/:id',
        },
      },
    },
    SearchTab: {
      path: 'search',
      screens: {
        Profile: {
          path: 'profile/:id',
        },
      },
    },
  });
});

test('preserves explicit shared option in static linking', () => {
  const Stack = createTestNavigator({
    screens: {
      Profile: {
        screen: TestScreen,
        linking: {
          path: 'profile/:id',
          shared: true,
        },
      },
    },
  });

  expect(createPathConfigForStaticNavigation(Stack, {})).toEqual({
    Profile: {
      path: 'profile/:id',
      shared: true,
    },
  });
});

test("doesn't override explicit shared: false", () => {
  const Profile = {
    screen: TestScreen,
    linking: {
      path: 'profile/:id',
      shared: false,
    },
  };

  const HomeStack = createTestNavigator({
    screens: {
      Home: {
        screen: TestScreen,
      },
      Profile,
    },
  });

  const SearchStack = createTestNavigator({
    screens: {
      Search: {
        screen: TestScreen,
        linking: 'search',
      },
      Profile,
    },
  });

  const Tabs = createTestNavigator({
    screens: {
      HomeTab: {
        screen: HomeStack,
      },
      SearchTab: {
        screen: SearchStack,
      },
    },
  });

  expect(createPathConfigForStaticNavigation(Tabs, {}, true)).toEqual({
    HomeTab: {
      screens: {
        Home: {
          path: '',
        },
        Profile: {
          path: 'profile/:id',
          shared: false,
        },
      },
    },
    SearchTab: {
      screens: {
        Profile: {
          path: 'profile/:id',
          shared: false,
        },
        Search: {
          path: 'search',
        },
      },
    },
  });
});

test("doesn't mark screens under a parent with shared: false as shared", () => {
  const Profile = {
    screen: TestScreen,
    linking: 'profile/:id',
  };

  const HomeStack = createTestNavigator({
    screens: {
      Profile,
    },
  });

  const SearchStack = createTestNavigator({
    screens: {
      Profile,
    },
  });

  const Tabs = createTestNavigator({
    screens: {
      HomeTab: {
        screen: HomeStack,
        linking: {
          path: '',
          shared: false,
        },
      },
      SearchTab: {
        screen: SearchStack,
      },
    },
  });

  expect(createPathConfigForStaticNavigation(Tabs, {}, true)).toEqual({
    HomeTab: {
      path: '',
      shared: false,
      screens: {
        Profile: {
          path: 'profile/:id',
        },
      },
    },
    SearchTab: {
      screens: {
        Profile: {
          path: 'profile/:id',
        },
      },
    },
  });
});

test('preserves explicit shared option under a parent with shared: false', () => {
  const Profile = {
    screen: TestScreen,
    linking: {
      path: 'profile/:id',
      shared: true,
    },
  };

  const HomeStack = createTestNavigator({
    screens: {
      Profile,
    },
  });

  const SearchStack = createTestNavigator({
    screens: {
      Profile,
    },
  });

  const Tabs = createTestNavigator({
    screens: {
      HomeTab: {
        screen: HomeStack,
        linking: {
          path: '',
          shared: false,
        },
      },
      SearchTab: {
        screen: SearchStack,
      },
    },
  });

  expect(createPathConfigForStaticNavigation(Tabs, {}, true)).toEqual({
    HomeTab: {
      path: '',
      shared: false,
      screens: {
        Profile: {
          path: 'profile/:id',
          shared: true,
        },
      },
    },
    SearchTab: {
      screens: {
        Profile: {
          path: 'profile/:id',
          shared: true,
        },
      },
    },
  });
});

test("doesn't mark different components with the same path as shared", () => {
  const OtherScreen = () => null;

  const HomeStack = createTestNavigator({
    screens: {
      Profile: {
        screen: TestScreen,
        linking: 'profile/:id',
      },
    },
  });

  const SearchStack = createTestNavigator({
    screens: {
      Profile: {
        screen: OtherScreen,
        linking: 'profile/:id',
      },
    },
  });

  const Tabs = createTestNavigator({
    screens: {
      HomeTab: {
        screen: HomeStack,
      },
      SearchTab: {
        screen: SearchStack,
      },
    },
  });

  const screens = createPathConfigForStaticNavigation(Tabs, {});

  if (screens == null) {
    throw new Error('Expected screens to be defined');
  }

  expect(() => getStateFromPath('/profile/123', { screens })).toThrow(
    `Found conflicting screens with the same pattern. The pattern 'profile/:id' resolves to both 'SearchTab > Profile' and 'HomeTab > Profile'. Patterns must be unique and cannot resolve to more than one screen unless shared: true is specified.`
  );
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
            linking: null,
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

  if (screens == null) {
    throw new Error('Expected screens to be defined');
  }

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

test('splits acronym-to-word boundaries when automatically generating paths', () => {
  const Root = createTestNavigator({
    screens: {
      Home: TestScreen,
      URLDetails: TestScreen,
      MyURLScreen: TestScreen,
      XMLParser: TestScreen,
      FAQ: TestScreen,
    },
  });

  expect(createPathConfigForStaticNavigation(Root, {}, true)).toEqual({
    Home: { path: '' },
    URLDetails: { path: 'url-details' },
    MyURLScreen: { path: 'my-url-screen' },
    XMLParser: { path: 'xml-parser' },
    FAQ: { path: 'faq' },
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
            linking: null,
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

  if (screens == null) {
    throw new Error('Expected screens to be defined');
  }

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

test('uses initialRouteName for the automatic home screen across groups', () => {
  const Auth = createTestNavigator({
    screens: {
      Login: {
        screen: TestScreen,
      },
    },
  });

  const Root = createTestNavigator({
    initialRouteName: 'Profile',
    groups: {
      Guest: {
        screens: {
          Auth: {
            screen: Auth,
          },
          SignIn: {
            screen: TestScreen,
          },
        },
      },
      User: {
        screens: {
          Profile: {
            screen: TestScreen,
          },
          Settings: {
            screen: TestScreen,
          },
        },
      },
    },
  });

  const screens = createPathConfigForStaticNavigation(Root, {}, true);

  expect(screens).toMatchInlineSnapshot(`
    {
      "Auth": {
        "screens": {
          "Login": {
            "path": "login",
          },
        },
      },
      "Profile": {
        "path": "",
      },
      "Settings": {
        "path": "settings",
      },
      "SignIn": {
        "path": "sign-in",
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

test("doesn't generate duplicate empty path if initialRouteName has empty path", () => {
  const Root = createTestNavigator({
    initialRouteName: 'Home',
    screens: {
      Home: {
        screen: TestScreen,
        linking: '',
      },
      Profile: {
        screen: TestScreen,
      },
    },
  });

  const screens = createPathConfigForStaticNavigation(Root, {}, true);

  expect(screens).toMatchInlineSnapshot(`
    {
      "Home": {
        "path": "",
      },
      "Profile": {
        "path": "profile",
      },
    }
  `);
});

test('throws if linking.initialRouteName is not in nested static navigation', () => {
  const Nested = createTestNavigator({
    screens: {
      Feed: {
        screen: TestScreen,
      },
    },
  });

  const Root = createTestNavigator({
    screens: {
      Home: {
        screen: Nested,
        linking: {
          path: '',
          initialRouteName: 'Missing',
        },
      },
    },
  });

  expect(() => {
    createPathConfigForStaticNavigation(Root, {}, true);
  }).toThrow(
    "Couldn't find a screen named 'Missing' to use as 'initialRouteName'."
  );
});

test('throws if explicit static linking screens do not contain initialRouteName', () => {
  const Root = createTestNavigator({
    screens: {
      Home: {
        screen: TestScreen,
        linking: {
          path: '',
          screens: {
            Feed: 'feed',
          },
          initialRouteName: 'Missing',
        },
      },
    },
  });

  expect(() => createPathConfigForStaticNavigation(Root, {}, true)).toThrow(
    "Couldn't find a screen named 'Missing' to use as 'initialRouteName'."
  );
});

test("doesn't let nested initialRouteName with path suppress automatic home screen", () => {
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
    },
  });

  const Root = createTestNavigator({
    screens: {
      Home: {
        screen: TestScreen,
      },
      Nested: {
        screen: Nested,
      },
    },
  });

  const screens = createPathConfigForStaticNavigation(Root, {}, true);

  if (screens == null) {
    throw new Error('Expected screens to be defined');
  }

  expect(screens).toMatchInlineSnapshot(`
    {
      "Home": {
        "path": "",
      },
      "Nested": {
        "screens": {
          "First": {
            "path": "first",
          },
          "Second": {
            "path": "second",
          },
        },
      },
    }
  `);
});

test("doesn't generate duplicate empty path in nested navigator without initialRouteName", () => {
  const Nested = createTestNavigator({
    screens: {
      Index: {
        screen: TestScreen,
        linking: '',
      },
      Details: {
        screen: TestScreen,
      },
    },
  });

  const Root = createTestNavigator({
    screens: {
      Home: {
        screen: Nested,
      },
    },
  });

  const screens = createPathConfigForStaticNavigation(Root, {}, true);

  if (screens == null) {
    throw new Error('Expected screens to be defined');
  }

  expect(screens).toMatchInlineSnapshot(`
    {
      "Home": {
        "screens": {
          "Details": {
            "path": "details",
          },
          "Index": {
            "path": "",
          },
        },
      },
    }
  `);

  expect(getStateFromPath('/details', { screens })).toEqual({
    routes: [
      {
        name: 'Home',
        state: {
          routes: [
            {
              name: 'Details',
              path: '/details',
            },
          ],
        },
      },
    ],
  });
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

test('throws if exact is specified without a path', () => {
  const Root = {
    config: {
      screens: {
        Home: {
          screen: TestScreen,
          linking: {
            exact: true,
          },
        },
      },
    },
    getComponent: () => TestScreen,
  };

  expect(() => {
    createPathConfigForStaticNavigation(Root, {});
  }).toThrow(
    "A 'path' needs to be specified when specifying 'exact: true'. If you don't want this screen in the URL, specify it as empty string, e.g. `path: ''`."
  );
});

test('normalizes leading and trailing slashes in paths and aliases', () => {
  const Root = createTestNavigator({
    screens: {
      Profile: {
        screen: TestScreen,
        linking: {
          path: '/profile/',
          alias: [
            '/me/',
            {
              path: '/u/:id/',
              parse: {
                id: Number,
              },
            },
          ],
        },
      },
    },
    groups: {
      Admin: {
        screens: {
          Dashboard: {
            screen: TestScreen,
            linking: '/admin/dashboard/',
          },
        },
      },
    },
  });

  const screens = createPathConfigForStaticNavigation(Root, {});

  if (screens == null) {
    throw new Error('Expected screens to be defined');
  }

  expect(screens).toMatchInlineSnapshot(`
    {
      "Dashboard": {
        "path": "admin/dashboard",
      },
      "Profile": {
        "alias": [
          "me",
          {
            "parse": {
              "id": [Function],
            },
            "path": "u/:id",
          },
        ],
        "path": "profile",
      },
    }
  `);

  expect(getStateFromPath('/me', { screens })).toEqual({
    routes: [
      {
        name: 'Profile',
        path: '/me',
      },
    ],
  });

  expect(getStateFromPath('/u/42', { screens })).toEqual({
    routes: [
      {
        name: 'Profile',
        params: { id: 42 },
        path: '/u/42',
      },
    ],
  });

  expect(getStateFromPath('/admin/dashboard', { screens })).toEqual({
    routes: [
      {
        name: 'Dashboard',
        path: '/admin/dashboard',
      },
    ],
  });
});

test('uses linking.initialRouteName for nested static navigation', () => {
  const Nested = createTestNavigator({
    initialRouteName: 'Feed',
    screens: {
      Feed: {
        screen: TestScreen,
      },
      Notifications: {
        screen: TestScreen,
      },
    },
  });

  const Root = createTestNavigator({
    screens: {
      Home: {
        screen: Nested,
        linking: {
          path: '',
          initialRouteName: 'Notifications',
        },
      },
    },
  });

  const screens = createPathConfigForStaticNavigation(Root, {}, true);

  if (screens == null) {
    throw new Error('Expected screens to be defined');
  }

  expect(screens).toMatchInlineSnapshot(`
    {
      "Home": {
        "initialRouteName": "Notifications",
        "path": "",
        "screens": {
          "Feed": {
            "path": "feed",
          },
          "Notifications": {
            "path": "",
          },
        },
      },
    }
  `);

  expect(getStateFromPath('/', { screens })).toEqual({
    routes: [
      {
        name: 'Home',
        state: {
          routes: [
            {
              name: 'Notifications',
              path: '',
            },
          ],
        },
      },
    ],
  });
});

test('preserves linking.screens for nested static navigation', () => {
  const Nested = createTestNavigator({
    screens: {
      Feed: {
        screen: TestScreen,
      },
      Profile: {
        screen: TestScreen,
      },
    },
  });

  const Root = createTestNavigator({
    screens: {
      Home: {
        screen: Nested,
        linking: {
          path: '',
          screens: {
            Feed: 'start',
          },
        },
      },
    },
  });

  const screens = createPathConfigForStaticNavigation(Root, {}, true);

  if (screens == null) {
    throw new Error('Expected screens to be defined');
  }

  expect(screens).toMatchInlineSnapshot(`
    {
      "Home": {
        "path": "",
        "screens": {
          "Feed": "start",
        },
      },
    }
  `);

  expect(getStateFromPath('/start', { screens })).toEqual({
    routes: [
      {
        name: 'Home',
        state: {
          routes: [
            {
              name: 'Feed',
              path: '/start',
            },
          ],
        },
      },
    ],
  });
});
