import { expect, jest, test } from '@jest/globals';
import type {
  DefaultRouterOptions,
  NavigationState,
} from '@react-navigation/routers';

import { createNavigatorFactory } from '../createNavigatorFactory';
import { UNSTABLE_getLoaderForState } from '../DataLoading';
import type { EventMapBase } from '../types';
import { useIsFocused } from '../useIsFocused';
import { useNavigationBuilder } from '../useNavigationBuilder';
import { MockRouter } from './__fixtures__/MockRouter';

const TestNavigator = (props: any) => {
  const { state, descriptors, NavigationContent } = useNavigationBuilder<
    NavigationState,
    DefaultRouterOptions,
    {},
    { className?: string; testId?: string },
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
              className={descriptor.options?.className}
              data-testid={descriptor.options?.testId}
            >
              {descriptor.render()}
            </div>
          );
        })}
      </main>
    </NavigationContent>
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

test('returns undefined when screen has no loader', () => {
  const Navigator = createTestNavigator({
    screens: {
      Home: TestScreen,
    },
  });

  const loader = UNSTABLE_getLoaderForState(Navigator, {
    index: 0,
    routes: [{ name: 'Home' }],
  });

  expect(loader).toBeUndefined();
});

test('returns the loader for a screen with UNSTABLE_loader', async () => {
  const fn = jest.fn(async (_options: { route: { name: string } }) => {});

  const Navigator = createTestNavigator({
    screens: {
      Home: {
        screen: TestScreen,
        UNSTABLE_loader: fn,
      },
    },
  });

  const loader = UNSTABLE_getLoaderForState(Navigator, {
    index: 0,
    routes: [{ name: 'Home' }],
  });

  expect(loader).toBeDefined();

  await loader!();

  expect(fn).toHaveBeenCalledTimes(1);
  expect(fn).toHaveBeenCalledWith({ route: { name: 'Home' } });
});

test('composes loaders from nested navigators', async () => {
  const parentFn = jest.fn(async () => {});
  const childFn = jest.fn(async () => {});

  const ChildNavigator = createTestNavigator({
    screens: {
      Albums: {
        screen: TestScreen,
        UNSTABLE_loader: childFn,
      },
      Contacts: TestScreen,
    },
  });

  const RootNavigator = createTestNavigator({
    screens: {
      Home: {
        screen: ChildNavigator,
        UNSTABLE_loader: parentFn,
      },
    },
  });

  const loader = UNSTABLE_getLoaderForState(RootNavigator, {
    index: 0,
    routes: [{ name: 'Home' }],
  });

  expect(loader).toBeDefined();

  await loader!();

  expect(parentFn).toHaveBeenCalledTimes(1);
  expect(childFn).toHaveBeenCalledTimes(1);
});

test('each loader receives its own route', async () => {
  const parentFn = jest.fn(async (_options: { route: { name: string } }) => {});
  const childFn = jest.fn(async (_options: { route: { name: string } }) => {});

  const ChildNavigator = createTestNavigator({
    screens: {
      Albums: {
        screen: TestScreen,
        UNSTABLE_loader: childFn,
      },
    },
  });

  const RootNavigator = createTestNavigator({
    screens: {
      Home: {
        screen: ChildNavigator,
        UNSTABLE_loader: parentFn,
      },
    },
  });

  const loader = UNSTABLE_getLoaderForState(RootNavigator, {
    index: 0,
    routes: [{ name: 'Home' }],
  });

  await loader!();

  expect(parentFn).toHaveBeenCalledWith({ route: { name: 'Home' } });
  expect(childFn).toHaveBeenCalledWith({ route: { name: 'Albums' } });
});

test('uses initialRouteName to determine child loader', async () => {
  const albumsFn = jest.fn(async () => {});
  const contactsFn = jest.fn(async () => {});

  const ChildNavigator = createTestNavigator({
    initialRouteName: 'Contacts',
    screens: {
      Albums: {
        screen: TestScreen,
        UNSTABLE_loader: albumsFn,
      },
      Contacts: {
        screen: TestScreen,
        UNSTABLE_loader: contactsFn,
      },
    },
  });

  const RootNavigator = createTestNavigator({
    screens: {
      Home: ChildNavigator,
    },
  });

  const loader = UNSTABLE_getLoaderForState(RootNavigator, {
    index: 0,
    routes: [{ name: 'Home' }],
  });

  await loader!();

  expect(albumsFn).not.toHaveBeenCalled();
  expect(contactsFn).toHaveBeenCalledTimes(1);
});

test('uses nested state to determine child loader', async () => {
  const albumsFn = jest.fn(async () => {});
  const contactsFn = jest.fn(async () => {});

  const ChildNavigator = createTestNavigator({
    screens: {
      Albums: {
        screen: TestScreen,
        UNSTABLE_loader: albumsFn,
      },
      Contacts: {
        screen: TestScreen,
        UNSTABLE_loader: contactsFn,
      },
    },
  });

  const RootNavigator = createTestNavigator({
    screens: {
      Home: ChildNavigator,
    },
  });

  const loader = UNSTABLE_getLoaderForState(RootNavigator, {
    index: 0,
    routes: [
      {
        name: 'Home',
        state: {
          index: 0,
          routes: [{ name: 'Contacts' }],
        },
      },
    ],
  });

  await loader!();

  expect(albumsFn).not.toHaveBeenCalled();
  expect(contactsFn).toHaveBeenCalledTimes(1);
});

test('uses focused route from nested state', async () => {
  const albumsFn = jest.fn(async () => {});
  const contactsFn = jest.fn(async () => {});

  const ChildNavigator = createTestNavigator({
    screens: {
      Albums: {
        screen: TestScreen,
        UNSTABLE_loader: albumsFn,
      },
      Contacts: {
        screen: TestScreen,
        UNSTABLE_loader: contactsFn,
      },
    },
  });

  const RootNavigator = createTestNavigator({
    screens: {
      Home: ChildNavigator,
    },
  });

  const loader = UNSTABLE_getLoaderForState(RootNavigator, {
    index: 0,
    routes: [
      {
        name: 'Home',
        state: {
          index: 1,
          routes: [{ name: 'Albums' }, { name: 'Contacts' }],
        },
      },
    ],
  });

  await loader!();

  expect(albumsFn).not.toHaveBeenCalled();
  expect(contactsFn).toHaveBeenCalledTimes(1);
});

test('traverses deeply nested navigators', async () => {
  const rootFn = jest.fn(async () => {});
  const midFn = jest.fn(async () => {});
  const leafFn = jest.fn(async () => {});

  const LeafNavigator = createTestNavigator({
    screens: {
      Detail: {
        screen: TestScreen,
        UNSTABLE_loader: leafFn,
      },
    },
  });

  const MidNavigator = createTestNavigator({
    screens: {
      Inner: {
        screen: LeafNavigator,
        UNSTABLE_loader: midFn,
      },
    },
  });

  const RootNavigator = createTestNavigator({
    screens: {
      Outer: {
        screen: MidNavigator,
        UNSTABLE_loader: rootFn,
      },
    },
  });

  const loader = UNSTABLE_getLoaderForState(RootNavigator, {
    index: 0,
    routes: [{ name: 'Outer' }],
  });

  await loader!();

  expect(rootFn).toHaveBeenCalledTimes(1);
  expect(midFn).toHaveBeenCalledTimes(1);
  expect(leafFn).toHaveBeenCalledTimes(1);
});

test('finds loaders for screens inside groups', async () => {
  const fn = jest.fn(async () => {});

  const Navigator = createTestNavigator({
    screens: {},
    groups: {
      Auth: {
        screens: {
          Login: {
            screen: TestScreen,
            UNSTABLE_loader: fn,
          },
        },
      },
    },
  });

  const loader = UNSTABLE_getLoaderForState(Navigator, {
    index: 0,
    routes: [{ name: 'Login' }],
  });

  await loader!();

  expect(fn).toHaveBeenCalledTimes(1);
});

test('uses params.screen to determine child loader when no nested state', async () => {
  const albumsFn = jest.fn(async () => {});
  const contactsFn = jest.fn(async () => {});

  const ChildNavigator = createTestNavigator({
    screens: {
      Albums: {
        screen: TestScreen,
        UNSTABLE_loader: albumsFn,
      },
      Contacts: {
        screen: TestScreen,
        UNSTABLE_loader: contactsFn,
      },
    },
  });

  const RootNavigator = createTestNavigator({
    screens: {
      Home: ChildNavigator,
    },
  });

  const loader = UNSTABLE_getLoaderForState(RootNavigator, {
    index: 0,
    routes: [
      {
        name: 'Home',
        params: { screen: 'Contacts' },
      },
    ],
  });

  await loader!();

  expect(albumsFn).not.toHaveBeenCalled();
  expect(contactsFn).toHaveBeenCalledTimes(1);
});

test('uses params.state to determine child loader when no nested state', async () => {
  const albumsFn = jest.fn(async () => {});
  const contactsFn = jest.fn(async () => {});

  const ChildNavigator = createTestNavigator({
    screens: {
      Albums: {
        screen: TestScreen,
        UNSTABLE_loader: albumsFn,
      },
      Contacts: {
        screen: TestScreen,
        UNSTABLE_loader: contactsFn,
      },
    },
  });

  const RootNavigator = createTestNavigator({
    screens: {
      Home: ChildNavigator,
    },
  });

  const loader = UNSTABLE_getLoaderForState(RootNavigator, {
    index: 0,
    routes: [
      {
        name: 'Home',
        params: {
          state: {
            index: 0,
            routes: [{ name: 'Albums' }],
          },
        },
      },
    ],
  });

  await loader!();

  expect(albumsFn).toHaveBeenCalledTimes(1);
  expect(contactsFn).not.toHaveBeenCalled();
});

test('prefers route.state over params for determining child loader', async () => {
  const albumsFn = jest.fn(async () => {});
  const contactsFn = jest.fn(async () => {});

  const ChildNavigator = createTestNavigator({
    screens: {
      Albums: {
        screen: TestScreen,
        UNSTABLE_loader: albumsFn,
      },
      Contacts: {
        screen: TestScreen,
        UNSTABLE_loader: contactsFn,
      },
    },
  });

  const RootNavigator = createTestNavigator({
    screens: {
      Home: ChildNavigator,
    },
  });

  const loader = UNSTABLE_getLoaderForState(RootNavigator, {
    index: 0,
    routes: [
      {
        name: 'Home',
        // route.state should take priority
        state: {
          index: 0,
          routes: [{ name: 'Contacts' }],
        },
        // params.screen should be ignored
        params: { screen: 'Albums' },
      },
    ],
  });

  await loader!();

  expect(contactsFn).toHaveBeenCalledTimes(1);
  expect(albumsFn).not.toHaveBeenCalled();
});

test('infers screen from groups when screens is empty and no initialRouteName', async () => {
  const fn = jest.fn(async () => {});

  const Navigator = createTestNavigator({
    screens: {},
    groups: {
      Auth: {
        screens: {
          Login: {
            screen: TestScreen,
            UNSTABLE_loader: fn,
          },
        },
      },
    },
  });

  const loader = UNSTABLE_getLoaderForState(Navigator, undefined);

  expect(loader).toBeDefined();
  await loader!();

  expect(fn).toHaveBeenCalledTimes(1);
});

test('traverses deeply nested navigators via params', async () => {
  const leafFn = jest.fn(async () => {});

  const LeafNavigator = createTestNavigator({
    screens: {
      Detail: {
        screen: TestScreen,
        UNSTABLE_loader: leafFn,
      },
      Other: TestScreen,
    },
  });

  const MidNavigator = createTestNavigator({
    screens: {
      Inner: LeafNavigator,
    },
  });

  const RootNavigator = createTestNavigator({
    screens: {
      Outer: MidNavigator,
    },
  });

  const loader = UNSTABLE_getLoaderForState(RootNavigator, {
    index: 0,
    routes: [
      {
        name: 'Outer',
        params: {
          screen: 'Inner',
          params: {
            screen: 'Detail',
          },
        },
      },
    ],
  });

  await loader!();

  expect(leafFn).toHaveBeenCalledTimes(1);
});
