import { expect, jest, test } from '@jest/globals';
import { StackRouter } from '@react-navigation/routers';

import { createNavigatorFactory } from '../createNavigatorFactory';
import { getLoaderForState, getLoaderForStateChange } from '../DataLoading';
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

test('loads added routes while keeping matched routes idle', async () => {
  const homeFn = jest.fn(async () => {});
  const detailsFn = jest.fn(
    async (_options: { name: string; params: unknown }) => {}
  );
  const otherFn = jest.fn(async () => {});

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
      Other: {
        screen: TestScreen,
        UNSTABLE_loader: otherFn,
      },
    },
  });

  const loader = getLoaderForStateChange(
    Navigator,
    {
      index: 0,
      routes: [
        { name: 'Home', key: 'home' },
        { name: 'Details', key: 'details-old' },
        { name: 'Details', key: 'details-new', params: { id: 'new' } },
        { name: 'Other', key: 'other' },
      ],
    },
    {
      index: 0,
      routes: [
        { name: 'Home', key: 'home' },
        { name: 'Details', key: 'details-old' },
      ],
    },
    undefined
  );

  await loader?.();

  expect(homeFn).not.toHaveBeenCalled();
  expect(detailsFn).toHaveBeenCalledTimes(1);
  expect(detailsFn).toHaveBeenCalledWith({
    name: 'Details',
    params: { id: 'new' },
  });
  expect(otherFn).toHaveBeenCalledTimes(1);
});

test('does not reload a matched route when only its params change', () => {
  const Navigator = createTestNavigator({
    screens: {
      Home: TestScreen,
      Details: {
        screen: TestScreen,
        UNSTABLE_loader: jest.fn(async () => {}),
      },
    },
  });

  const loader = getLoaderForStateChange(
    Navigator,
    {
      index: 0,
      routes: [
        { name: 'Home', key: 'home' },
        { name: 'Details', key: 'details', params: { id: 'updated' } },
      ],
    },
    {
      index: 0,
      routes: [
        { name: 'Home', key: 'home' },
        { name: 'Details', key: 'details', params: { id: 'old' } },
      ],
    },
    undefined
  );

  expect(loader).toBeUndefined();
});

test('loads the newly focused route and skips other additions', async () => {
  const homeFn = jest.fn(async () => {});
  const detailsFn = jest.fn(async () => {});
  const otherFn = jest.fn(async () => {});

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
      Other: {
        screen: TestScreen,
        UNSTABLE_loader: otherFn,
      },
    },
  });

  const loader = getLoaderForStateChange(
    Navigator,
    {
      index: 1,
      routes: [
        { name: 'Home', key: 'home' },
        { name: 'Details', key: 'details' },
        { name: 'Other', key: 'other' },
      ],
    },
    {
      index: 0,
      routes: [{ name: 'Home', key: 'home' }],
    },
    undefined
  );

  await loader?.();

  expect(homeFn).not.toHaveBeenCalled();
  expect(detailsFn).toHaveBeenCalledTimes(1);
  expect(otherFn).not.toHaveBeenCalled();
});

test('loads additions within an existing focused navigator route', async () => {
  const parentFn = jest.fn(async () => {});
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
      Nested: {
        screen: ChildNavigator,
        UNSTABLE_loader: parentFn,
      },
    },
  });

  const loader = getLoaderForStateChange(
    RootNavigator,
    {
      index: 0,
      routes: [
        {
          name: 'Nested',
          key: 'nested',
          state: {
            index: 0,
            routes: [
              { name: 'Albums', key: 'albums' },
              { name: 'Contacts', key: 'contacts' },
            ],
          },
        },
      ],
    },
    {
      index: 0,
      routes: [
        {
          name: 'Nested',
          key: 'nested',
          state: {
            index: 0,
            routes: [{ name: 'Albums', key: 'albums' }],
          },
        },
      ],
    },
    undefined
  );

  await loader?.();

  expect(parentFn).not.toHaveBeenCalled();
  expect(albumsFn).not.toHaveBeenCalled();
  expect(contactsFn).toHaveBeenCalledTimes(1);
});

test('loads the focused path within an added unfocused navigator route', async () => {
  const parentFn = jest.fn(async () => {});
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
      Home: TestScreen,
      Nested: {
        screen: ChildNavigator,
        UNSTABLE_loader: parentFn,
      },
    },
  });

  const loader = getLoaderForStateChange(
    RootNavigator,
    {
      index: 0,
      routes: [
        { name: 'Home', key: 'home' },
        {
          name: 'Nested',
          key: 'nested',
          state: {
            index: 0,
            routes: [
              { name: 'Albums', key: 'albums' },
              { name: 'Contacts', key: 'contacts' },
            ],
          },
        },
      ],
    },
    {
      index: 0,
      routes: [{ name: 'Home', key: 'home' }],
    },
    undefined
  );

  await loader?.();

  expect(parentFn).toHaveBeenCalledTimes(1);
  expect(albumsFn).toHaveBeenCalledTimes(1);
  expect(contactsFn).not.toHaveBeenCalled();
});

test('matches keyless routes with the same name one-to-one', async () => {
  const albumsFn = jest.fn(
    async (_options: { name: string; params: unknown }) => {}
  );

  const Navigator = createTestNavigator({
    screens: {
      Albums: {
        screen: TestScreen,
        UNSTABLE_loader: albumsFn,
      },
    },
  });

  const loader = getLoaderForStateChange(
    Navigator,
    {
      index: 0,
      routes: [
        { name: 'Albums', params: { id: 'existing' } },
        { name: 'Albums', params: { id: 'new' } },
      ],
    },
    {
      index: 0,
      routes: [{ name: 'Albums', params: { id: 'existing' } }],
    },
    undefined
  );

  await loader?.();

  expect(albumsFn).toHaveBeenCalledTimes(1);
  expect(albumsFn).toHaveBeenCalledWith({
    name: 'Albums',
    params: { id: 'new' },
  });
});

test('prioritizes exact route keys before matching keyless routes', async () => {
  const albumsFn = jest.fn(
    async (_options: { name: string; params: unknown }) => {}
  );

  const Navigator = createTestNavigator({
    screens: {
      Albums: {
        screen: TestScreen,
        UNSTABLE_loader: albumsFn,
      },
    },
  });

  const loader = getLoaderForStateChange(
    Navigator,
    {
      index: 0,
      routes: [
        { name: 'Albums', params: { id: 'new' } },
        { name: 'Albums', key: 'albums', params: { id: 'existing' } },
      ],
    },
    {
      index: 0,
      routes: [{ name: 'Albums', key: 'albums', params: { id: 'existing' } }],
    },
    undefined
  );

  await loader?.();

  expect(albumsFn).toHaveBeenCalledTimes(1);
  expect(albumsFn).toHaveBeenCalledWith({
    name: 'Albums',
    params: { id: 'new' },
  });
});

test('does not load a focus change inside an existing unfocused route', () => {
  const ChildNavigator = createTestNavigator({
    screens: {
      Albums: {
        screen: TestScreen,
        UNSTABLE_loader: jest.fn(async () => {}),
      },
      Contacts: {
        screen: TestScreen,
        UNSTABLE_loader: jest.fn(async () => {}),
      },
    },
  });

  const RootNavigator = createTestNavigator({
    screens: { Home: TestScreen, Nested: ChildNavigator },
  });

  const loader = getLoaderForStateChange(
    RootNavigator,
    {
      index: 0,
      routes: [
        { name: 'Home', key: 'home' },
        {
          name: 'Nested',
          key: 'nested',
          state: {
            index: 1,
            routes: [
              { name: 'Albums', key: 'albums' },
              { name: 'Contacts', key: 'contacts' },
            ],
          },
        },
      ],
    },
    {
      index: 0,
      routes: [
        { name: 'Home', key: 'home' },
        {
          name: 'Nested',
          key: 'nested',
          state: {
            index: 0,
            routes: [
              { name: 'Albums', key: 'albums' },
              { name: 'Contacts', key: 'contacts' },
            ],
          },
        },
      ],
    },
    undefined
  );

  expect(loader).toBeUndefined();
});

test('loads an added child and ignores a focus change inside an unfocused route', async () => {
  const albumsFn = jest.fn(async () => {});
  const contactsFn = jest.fn(async () => {});
  const settingsFn = jest.fn(async () => {});

  const ChildNavigator = createTestNavigator({
    screens: {
      Albums: { screen: TestScreen, UNSTABLE_loader: albumsFn },
      Contacts: { screen: TestScreen, UNSTABLE_loader: contactsFn },
      Settings: { screen: TestScreen, UNSTABLE_loader: settingsFn },
    },
  });

  const RootNavigator = createTestNavigator({
    screens: { Home: TestScreen, Nested: ChildNavigator },
  });

  const loader = getLoaderForStateChange(
    RootNavigator,
    {
      index: 0,
      routes: [
        { name: 'Home', key: 'home' },
        {
          name: 'Nested',
          key: 'nested',
          state: {
            index: 1,
            routes: [
              { name: 'Albums', key: 'albums' },
              { name: 'Contacts', key: 'contacts' },
              { name: 'Settings', key: 'settings' },
            ],
          },
        },
      ],
    },
    {
      index: 0,
      routes: [
        { name: 'Home', key: 'home' },
        {
          name: 'Nested',
          key: 'nested',
          state: {
            index: 0,
            routes: [
              { name: 'Albums', key: 'albums' },
              { name: 'Contacts', key: 'contacts' },
            ],
          },
        },
      ],
    },
    undefined
  );

  await loader?.();

  expect(albumsFn).not.toHaveBeenCalled();
  expect(contactsFn).not.toHaveBeenCalled();
  expect(settingsFn).toHaveBeenCalledTimes(1);
});

test('loads additions below multiple existing unfocused navigator levels', async () => {
  const existingFn = jest.fn(async () => {});
  const addedFn = jest.fn(async () => {});

  const LeafNavigator = createTestNavigator({
    screens: {
      Existing: { screen: TestScreen, UNSTABLE_loader: existingFn },
      Added: { screen: TestScreen, UNSTABLE_loader: addedFn },
    },
  });

  const MiddleNavigator = createTestNavigator({
    screens: { Leaf: LeafNavigator },
  });

  const RootNavigator = createTestNavigator({
    screens: { Home: TestScreen, Middle: MiddleNavigator },
  });

  const createMiddleRoute = (routes: { name: string; key: string }[]) => ({
    name: 'Middle',
    key: 'middle',
    state: {
      index: 0,
      routes: [
        {
          name: 'Leaf',
          key: 'leaf',
          state: { index: 0, routes },
        },
      ],
    },
  });

  const loader = getLoaderForStateChange(
    RootNavigator,
    {
      index: 0,
      routes: [
        { name: 'Home', key: 'home' },
        createMiddleRoute([
          { name: 'Existing', key: 'existing' },
          { name: 'Added', key: 'added' },
        ]),
      ],
    },
    {
      index: 0,
      routes: [
        { name: 'Home', key: 'home' },
        createMiddleRoute([{ name: 'Existing', key: 'existing' }]),
      ],
    },
    undefined
  );

  await loader?.();

  expect(existingFn).not.toHaveBeenCalled();
  expect(addedFn).toHaveBeenCalledTimes(1);
});

test('does not load removed or reordered routes with stable keys', async () => {
  const homeFn = jest.fn(async () => {});
  const detailsFn = jest.fn(async () => {});
  const removedFn = jest.fn(async () => {});

  const Navigator = createTestNavigator({
    screens: {
      Home: { screen: TestScreen, UNSTABLE_loader: homeFn },
      Details: { screen: TestScreen, UNSTABLE_loader: detailsFn },
      Removed: { screen: TestScreen, UNSTABLE_loader: removedFn },
    },
  });

  const loader = getLoaderForStateChange(
    Navigator,
    {
      index: 1,
      routes: [
        { name: 'Details', key: 'details' },
        { name: 'Home', key: 'home' },
      ],
    },
    {
      index: 0,
      routes: [
        { name: 'Home', key: 'home' },
        { name: 'Details', key: 'details' },
        { name: 'Removed', key: 'removed' },
      ],
    },
    undefined
  );

  await loader?.();

  expect(homeFn).not.toHaveBeenCalled();
  expect(detailsFn).not.toHaveBeenCalled();
  expect(removedFn).not.toHaveBeenCalled();
});

test('matches a focused keyless route after it moves', async () => {
  const albumsFn = jest.fn(async () => {});
  const otherFn = jest.fn(async () => {});

  const Navigator = createTestNavigator({
    screens: {
      Albums: { screen: TestScreen, UNSTABLE_loader: albumsFn },
      Other: { screen: TestScreen, UNSTABLE_loader: otherFn },
    },
  });

  const loader = getLoaderForStateChange(
    Navigator,
    {
      index: 1,
      routes: [{ name: 'Other' }, { name: 'Albums' }],
    },
    {
      index: 0,
      routes: [{ name: 'Albums' }, { name: 'Other' }],
    },
    undefined
  );

  await loader?.();

  expect(albumsFn).not.toHaveBeenCalled();
  expect(otherFn).not.toHaveBeenCalled();
});

test.each([
  {
    label: 'current route has a key',
    current: { name: 'Albums', key: 'albums' },
    previous: { name: 'Albums' },
  },
  {
    label: 'previous route has a key',
    current: { name: 'Albums' },
    previous: { name: 'Albums', key: 'albums' },
  },
])('matches a mixed-key route when $label', async ({ current, previous }) => {
  const fn = jest.fn(async () => {});

  const Navigator = createTestNavigator({
    screens: {
      Home: TestScreen,
      Albums: { screen: TestScreen, UNSTABLE_loader: fn },
    },
  });

  const loader = getLoaderForStateChange(
    Navigator,
    { index: 0, routes: [{ name: 'Home', key: 'home' }, current] },
    { index: 0, routes: [{ name: 'Home', key: 'home' }, previous] },
    undefined
  );

  await loader?.();

  expect(fn).not.toHaveBeenCalled();
});

test('treats the same key with a different name as an added route', async () => {
  const detailsFn = jest.fn(async () => {});

  const Navigator = createTestNavigator({
    screens: {
      Home: TestScreen,
      Details: { screen: TestScreen, UNSTABLE_loader: detailsFn },
      Other: TestScreen,
    },
  });

  const loader = getLoaderForStateChange(
    Navigator,
    {
      index: 0,
      routes: [
        { name: 'Home', key: 'home' },
        { name: 'Details', key: 'shared' },
      ],
    },
    {
      index: 0,
      routes: [
        { name: 'Home', key: 'home' },
        { name: 'Other', key: 'shared' },
      ],
    },
    undefined
  );

  await loader?.();

  expect(detailsFn).toHaveBeenCalledTimes(1);
});

test('matches keyed and keyless routes one-to-one during additions and removals', async () => {
  const fn = jest.fn(async (_options: { name: string; params: unknown }) => {});
  const Navigator = createTestNavigator({
    screens: {
      Home: TestScreen,
      Albums: { screen: TestScreen, UNSTABLE_loader: fn },
    },
  });

  const loader = getLoaderForStateChange(
    Navigator,
    {
      index: 0,
      routes: [
        { name: 'Home', key: 'home' },
        { name: 'Albums', params: { id: 'keyless-existing' } },
        { name: 'Albums', key: 'kept', params: { id: 'keyed-existing' } },
        { name: 'Albums', key: 'added', params: { id: 'added' } },
      ],
    },
    {
      index: 0,
      routes: [
        { name: 'Home', key: 'home' },
        { name: 'Albums', key: 'removed' },
        { name: 'Albums', key: 'kept' },
      ],
    },
    undefined
  );

  await loader?.();

  expect(fn).toHaveBeenCalledTimes(1);
  expect(fn).toHaveBeenCalledWith({
    name: 'Albums',
    params: { id: 'added' },
  });
});

test.each([
  { type: 'screen', params: { screen: 'Contacts' } },
  {
    type: 'state',
    params: {
      state: { index: 0, routes: [{ name: 'Contacts' }] },
    },
  },
])(
  'uses nested $type params for a newly added navigator route',
  async ({ params }) => {
    const parentFn = jest.fn(async () => {});
    const albumsFn = jest.fn(async () => {});
    const contactsFn = jest.fn(async () => {});

    const ChildNavigator = createTestNavigator({
      screens: {
        Albums: { screen: TestScreen, UNSTABLE_loader: albumsFn },
        Contacts: { screen: TestScreen, UNSTABLE_loader: contactsFn },
      },
    });

    const RootNavigator = createTestNavigator({
      screens: {
        Home: TestScreen,
        Nested: { screen: ChildNavigator, UNSTABLE_loader: parentFn },
      },
    });

    const loader = getLoaderForStateChange(
      RootNavigator,
      {
        index: 0,
        routes: [
          { name: 'Home', key: 'home' },
          { name: 'Nested', key: 'nested', params },
        ],
      },
      { index: 0, routes: [{ name: 'Home', key: 'home' }] },
      undefined
    );

    await loader?.();

    expect(parentFn).toHaveBeenCalledTimes(1);
    expect(albumsFn).not.toHaveBeenCalled();
    expect(contactsFn).toHaveBeenCalledTimes(1);
  }
);

test('uses updated nested params instead of stale route state in an unfocused route', async () => {
  const albumsFn = jest.fn(async () => {});
  const contactsFn = jest.fn(async () => {});

  const ChildNavigator = createTestNavigator({
    screens: {
      Albums: { screen: TestScreen, UNSTABLE_loader: albumsFn },
      Contacts: { screen: TestScreen, UNSTABLE_loader: contactsFn },
    },
  });

  const RootNavigator = createTestNavigator({
    screens: { Home: TestScreen, Nested: ChildNavigator },
  });

  const loader = getLoaderForStateChange(
    RootNavigator,
    {
      index: 0,
      routes: [
        { name: 'Home', key: 'home' },
        {
          name: 'Nested',
          key: 'nested',
          params: { screen: 'Contacts' },
          state: {
            index: 0,
            routes: [{ name: 'Albums', key: 'albums' }],
          },
        },
      ],
    },
    {
      index: 0,
      routes: [
        { name: 'Home', key: 'home' },
        {
          name: 'Nested',
          key: 'nested',
          params: { screen: 'Albums' },
          state: {
            index: 0,
            routes: [{ name: 'Albums', key: 'albums' }],
          },
        },
      ],
    },
    undefined
  );

  await loader?.();

  expect(albumsFn).not.toHaveBeenCalled();
  expect(contactsFn).toHaveBeenCalledTimes(1);
});

test('uses route state instead of consumed nested params in an unfocused route', async () => {
  const albumsFn = jest.fn(async () => {});
  const contactsFn = jest.fn(async () => {});

  const params = { screen: 'Contacts' };

  const consumedParams = new WeakMap<object, true>();

  consumedParams.set(params, true);

  const ChildNavigator = createTestNavigator({
    screens: {
      Albums: { screen: TestScreen, UNSTABLE_loader: albumsFn },
      Contacts: { screen: TestScreen, UNSTABLE_loader: contactsFn },
    },
  });

  const RootNavigator = createTestNavigator({
    screens: { Home: TestScreen, Nested: ChildNavigator },
  });

  const loader = getLoaderForStateChange(
    RootNavigator,
    {
      index: 0,
      routes: [
        { name: 'Home', key: 'home' },
        {
          name: 'Nested',
          key: 'nested',
          params,
          state: {
            index: 0,
            routes: [
              { name: 'Albums', key: 'albums' },
              { name: 'Contacts', key: 'contacts' },
            ],
          },
        },
      ],
    },
    {
      index: 0,
      routes: [
        { name: 'Home', key: 'home' },
        {
          name: 'Nested',
          key: 'nested',
          state: {
            index: 0,
            routes: [{ name: 'Albums', key: 'albums' }],
          },
        },
      ],
    },
    consumedParams
  );

  await loader?.();

  expect(albumsFn).not.toHaveBeenCalled();
  expect(contactsFn).toHaveBeenCalledTimes(1);
});

test('loads an added screen from a static configuration group', async () => {
  const loginFn = jest.fn(async () => {});

  const Navigator = createTestNavigator({
    screens: { Home: TestScreen },
    groups: {
      Auth: {
        screens: {
          Login: { screen: TestScreen, UNSTABLE_loader: loginFn },
        },
      },
    },
  });

  const loader = getLoaderForStateChange(
    Navigator,
    {
      index: 0,
      routes: [
        { name: 'Home', key: 'home' },
        { name: 'Login', key: 'login' },
      ],
    },
    { index: 0, routes: [{ name: 'Home', key: 'home' }] },
    undefined
  );

  await loader?.();

  expect(loginFn).toHaveBeenCalledTimes(1);
});

test('loads an added getter-backed screen without reading the getter', async () => {
  const fn = jest.fn(async () => {});

  const getter = jest.fn(() => TestScreen);

  const Navigator = createTestNavigator({
    screens: {
      Home: TestScreen,
      Details: {
        get screen() {
          return getter();
        },
        UNSTABLE_loader: fn,
      },
    },
  });

  const loader = getLoaderForStateChange(
    Navigator,
    {
      index: 0,
      routes: [
        { name: 'Home', key: 'home' },
        { name: 'Details', key: 'details' },
      ],
    },
    { index: 0, routes: [{ name: 'Home', key: 'home' }] },
    undefined
  );

  await loader?.();

  expect(fn).toHaveBeenCalledTimes(1);
  expect(getter).not.toHaveBeenCalled();
});

test('starts added route loaders concurrently and propagates rejection', async () => {
  const { promise, reject } = Promise.withResolvers<void>();

  const detailsFn = jest.fn(() => promise);
  const otherFn = jest.fn(async () => {});

  const Navigator = createTestNavigator({
    screens: {
      Home: TestScreen,
      Details: { screen: TestScreen, UNSTABLE_loader: detailsFn },
      Other: { screen: TestScreen, UNSTABLE_loader: otherFn },
    },
  });

  const loader = getLoaderForStateChange(
    Navigator,
    {
      index: 0,
      routes: [
        { name: 'Home', key: 'home' },
        { name: 'Details', key: 'details' },
        { name: 'Other', key: 'other' },
      ],
    },
    { index: 0, routes: [{ name: 'Home', key: 'home' }] },
    undefined
  );

  const loading = loader?.();

  expect(detailsFn).toHaveBeenCalledTimes(1);
  expect(otherFn).toHaveBeenCalledTimes(1);

  const error = new Error('Failed to load details');

  reject(error);

  await expect(loading).rejects.toBe(error);
});
