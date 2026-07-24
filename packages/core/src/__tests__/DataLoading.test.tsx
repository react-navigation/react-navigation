import { expect, jest, test } from '@jest/globals';
import { StackRouter } from '@react-navigation/routers';

import { createNavigatorFactory } from '../createNavigatorFactory';
import { getLoaderForState } from '../DataLoading';
import { useNavigationBuilder } from '../useNavigationBuilder';

const TestNavigator = (props: any) => {
  const { NavigationContent } = useNavigationBuilder(StackRouter, props);

  return <NavigationContent>{null}</NavigationContent>;
};

const createTestNavigator = createNavigatorFactory(TestNavigator);

const TestScreen = () => null;

test('returns undefined when screen has no loader', () => {
  const Navigator = createTestNavigator({
    screens: {
      Home: TestScreen,
    },
  });

  const loader = getLoaderForState(Navigator, {
    index: 0,
    routes: [{ name: 'Home' }],
  });

  expect(loader).toBeUndefined();
});

test('returns undefined when focused route is not in the config', () => {
  const Navigator = createTestNavigator({
    screens: {
      Home: {
        screen: TestScreen,
        UNSTABLE_loader: jest.fn(async () => {}),
      },
    },
  });

  const loader = getLoaderForState(Navigator, {
    index: 0,
    routes: [{ name: 'Missing' }],
  });

  expect(loader).toBeUndefined();
});

test('returns the loader for a screen with UNSTABLE_loader', async () => {
  const fn = jest.fn(async (_options: { name: string; params: unknown }) => {});

  const Navigator = createTestNavigator({
    screens: {
      Home: {
        screen: TestScreen,
        UNSTABLE_loader: fn,
      },
    },
  });

  const loader = getLoaderForState(Navigator, {
    index: 0,
    routes: [{ name: 'Home' }],
  });

  expect(loader).toBeDefined();

  await loader?.();

  expect(fn).toHaveBeenCalledTimes(1);
  expect(fn).toHaveBeenCalledWith({
    name: 'Home',
    params: undefined,
  });
});

test('uses the last route as focused when state has no index', async () => {
  const homeFn = jest.fn(
    async (_options: { name: string; params: unknown }) => {}
  );

  const detailsFn = jest.fn(
    async (_options: { name: string; params: unknown }) => {}
  );

  const Navigator = createTestNavigator({
    screens: {
      Home: {
        screen: TestScreen,
        UNSTABLE_loader: homeFn,
      },
      Details: {
        screen: TestScreen,
        UNSTABLE_loader: detailsFn,
      },
    },
  });

  const loader = getLoaderForState(Navigator, {
    routes: [{ name: 'Home' }, { name: 'Details' }],
  });

  await loader?.();

  expect(homeFn).not.toHaveBeenCalled();
  expect(detailsFn).toHaveBeenCalledTimes(1);
  expect(detailsFn).toHaveBeenCalledWith({
    name: 'Details',
    params: undefined,
  });
});

test('merges initialParams with route params for the loader', async () => {
  const fn = jest.fn(async (_options: { name: string; params: unknown }) => {});

  const Navigator = createTestNavigator({
    screens: {
      Profile: {
        screen: TestScreen,
        initialParams: { id: 'default', tab: 'overview' },
        UNSTABLE_loader: fn,
      },
    },
  });

  const loader = getLoaderForState(Navigator, {
    index: 0,
    routes: [{ name: 'Profile', params: { id: 'override' } }],
  });

  await loader?.();

  expect(fn).toHaveBeenCalledWith({
    name: 'Profile',
    params: { id: 'override', tab: 'overview' },
  });
});

test('composes loaders from nested navigators with their own name and params', async () => {
  const parentFn = jest.fn(
    async (_options: { name: string; params: unknown }) => {}
  );

  const childFn = jest.fn(
    async (_options: { name: string; params: unknown }) => {}
  );

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

  const loader = getLoaderForState(RootNavigator, {
    index: 0,
    routes: [
      {
        name: 'Home',
        state: {
          index: 0,
          routes: [{ name: 'Albums' }],
        },
      },
    ],
  });

  expect(loader).toBeDefined();

  await loader?.();

  expect(parentFn).toHaveBeenCalledTimes(1);
  expect(parentFn).toHaveBeenCalledWith({
    name: 'Home',
    params: undefined,
  });

  expect(childFn).toHaveBeenCalledTimes(1);
  expect(childFn).toHaveBeenCalledWith({
    name: 'Albums',
    params: undefined,
  });
});

test('uses the screen from nesting-level when there are multiple screens with same name', async () => {
  const rootProfileFn = jest.fn(async () => {});
  const childProfileFn = jest.fn(async () => {});

  const ChildNavigator = createTestNavigator({
    screens: {
      Profile: {
        screen: TestScreen,
        UNSTABLE_loader: childProfileFn,
      },
    },
  });

  const RootNavigator = createTestNavigator({
    screens: {
      Home: ChildNavigator,
      Profile: {
        screen: TestScreen,
        UNSTABLE_loader: rootProfileFn,
      },
    },
  });

  const loader = getLoaderForState(RootNavigator, {
    index: 0,
    routes: [
      {
        name: 'Home',
        state: {
          index: 0,
          routes: [{ name: 'Profile' }],
        },
      },
    ],
  });

  await loader?.();

  expect(childProfileFn).toHaveBeenCalledTimes(1);
  expect(rootProfileFn).not.toHaveBeenCalled();
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

  const loader = getLoaderForState(RootNavigator, {
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

  await loader?.();

  expect(albumsFn).not.toHaveBeenCalled();
  expect(contactsFn).toHaveBeenCalledTimes(1);
});

test('uses nested initialRouteName when no nested state is provided', async () => {
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

  const loader = getLoaderForState(RootNavigator, {
    index: 0,
    routes: [{ name: 'Home' }],
  });

  await loader?.();

  expect(albumsFn).not.toHaveBeenCalled();
  expect(contactsFn).toHaveBeenCalledTimes(1);
});

test('uses first group screen as nested initial route when screens is empty', async () => {
  const loginFn = jest.fn(async () => {});

  const ChildNavigator = createTestNavigator({
    screens: {},
    groups: {
      Auth: {
        screens: {
          Login: {
            screen: TestScreen,
            UNSTABLE_loader: loginFn,
          },
        },
      },
    },
  });

  const RootNavigator = createTestNavigator({
    screens: {
      Home: ChildNavigator,
    },
  });

  const loader = getLoaderForState(RootNavigator, {
    index: 0,
    routes: [{ name: 'Home' }],
  });

  await loader?.();

  expect(loginFn).toHaveBeenCalledTimes(1);
});

test('uses first screen as nested initial route when groups is empty', async () => {
  const albumsFn = jest.fn(async () => {});

  const ChildNavigator = createTestNavigator({
    groups: {},
    screens: {
      Albums: {
        screen: TestScreen,
        UNSTABLE_loader: albumsFn,
      },
    },
  });

  const RootNavigator = createTestNavigator({
    screens: {
      Home: ChildNavigator,
    },
  });

  const loader = getLoaderForState(RootNavigator, {
    index: 0,
    routes: [{ name: 'Home' }],
  });

  await loader?.();

  expect(albumsFn).toHaveBeenCalledTimes(1);
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

  const loader = getLoaderForState(RootNavigator, {
    index: 0,
    routes: [
      {
        name: 'Outer',
        state: {
          index: 0,
          routes: [
            {
              name: 'Inner',
              state: {
                index: 0,
                routes: [{ name: 'Detail' }],
              },
            },
          ],
        },
      },
    ],
  });

  await loader?.();

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

  const loader = getLoaderForState(Navigator, {
    index: 0,
    routes: [{ name: 'Login' }],
  });

  await loader?.();

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

  const loader = getLoaderForState(RootNavigator, {
    index: 0,
    routes: [
      {
        name: 'Home',
        params: { screen: 'Contacts' },
      },
    ],
  });

  await loader?.();

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

  const loader = getLoaderForState(RootNavigator, {
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

  await loader?.();

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

  const loader = getLoaderForState(RootNavigator, {
    index: 0,
    routes: [
      {
        name: 'Home',
        state: {
          index: 0,
          routes: [{ name: 'Contacts' }],
        },
        params: { screen: 'Albums' },
      },
    ],
  });

  await loader?.();

  expect(contactsFn).toHaveBeenCalledTimes(1);
  expect(albumsFn).not.toHaveBeenCalled();
});

test('returns undefined when state is undefined', () => {
  const fn = jest.fn(async () => {});

  const Navigator = createTestNavigator({
    screens: {
      Home: {
        screen: TestScreen,
        UNSTABLE_loader: fn,
      },
    },
  });

  expect(getLoaderForState(Navigator, undefined)).toBeUndefined();
});

test('ignores nested state when static config has no nested navigator', async () => {
  const homeFn = jest.fn(async () => {});
  const detailsFn = jest.fn(async () => {});

  const Navigator = createTestNavigator({
    screens: {
      Home: {
        screen: TestScreen,
        UNSTABLE_loader: homeFn,
      },
      Details: {
        screen: TestScreen,
        UNSTABLE_loader: detailsFn,
      },
    },
  });

  const loader = getLoaderForState(Navigator, {
    index: 0,
    routes: [
      {
        name: 'Home',
        state: {
          index: 0,
          routes: [{ name: 'Details' }],
        },
      },
    ],
  });

  await loader?.();

  expect(homeFn).toHaveBeenCalledTimes(1);
  expect(detailsFn).not.toHaveBeenCalled();
});

test('uses nested static config when static tree is deeper than state', async () => {
  const rootDetailsFn = jest.fn(async () => {});
  const childDetailsFn = jest.fn(async () => {});

  const ChildNavigator = createTestNavigator({
    screens: {
      Details: {
        screen: TestScreen,
        UNSTABLE_loader: childDetailsFn,
      },
    },
  });

  const RootNavigator = createTestNavigator({
    screens: {
      Home: ChildNavigator,
      Details: {
        screen: TestScreen,
        UNSTABLE_loader: rootDetailsFn,
      },
    },
  });

  const loader = getLoaderForState(RootNavigator, {
    index: 0,
    routes: [{ name: 'Home' }],
  });

  await loader?.();

  expect(childDetailsFn).toHaveBeenCalledTimes(1);
  expect(rootDetailsFn).not.toHaveBeenCalled();
});

test('traverses deeply nested navigators via params', async () => {
  const leafFn = jest.fn(
    async (_options: { name: string; params: unknown }) => {}
  );

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

  const loader = getLoaderForState(RootNavigator, {
    index: 0,
    routes: [
      {
        name: 'Outer',
        params: {
          screen: 'Inner',
          params: {
            screen: 'Detail',
            params: { id: '42' },
          },
        },
      },
    ],
  });

  await loader?.();

  expect(leafFn).toHaveBeenCalledTimes(1);
  expect(leafFn).toHaveBeenCalledWith({
    name: 'Detail',
    params: { id: '42' },
  });
});
