import { expect, jest, test } from '@jest/globals';
import type { ParamListBase } from '@react-navigation/routers';
import {
  CommonActions,
  StackRouter,
  TabRouter,
} from '@react-navigation/routers';
import { act, render } from '@testing-library/react-native';
import * as React from 'react';
import { Text } from 'react-native';

import { BaseNavigationContainer } from '../BaseNavigationContainer';
import { createNavigationContainerRef } from '../createNavigationContainerRef';
import { createNavigatorFactory } from '../createNavigatorFactory';
import { useIsFocused } from '../useIsFocused';
import { useNavigationBuilder } from '../useNavigationBuilder';

const TestNavigator = (props: any) => {
  const { state, descriptors, NavigationContent } = useNavigationBuilder(
    TabRouter,
    props
  );

  const route = state.routes[state.index];
  const descriptor = route ? descriptors[route.key] : undefined;

  if (descriptor == null) {
    throw new Error('Missing descriptor for focused route.');
  }

  return <NavigationContent>{descriptor.render()}</NavigationContent>;
};

const createTestNavigator = createNavigatorFactory(TestNavigator);

const StackTestNavigator = (props: any) => {
  const { state, descriptors, NavigationContent } = useNavigationBuilder(
    StackRouter,
    props
  );

  const route = state.routes[state.index];
  const descriptor = route ? descriptors[route.key] : undefined;

  if (descriptor == null) {
    throw new Error('Missing descriptor for focused route.');
  }

  return <NavigationContent>{descriptor.render()}</NavigationContent>;
};

const createStackTestNavigator = createNavigatorFactory(StackTestNavigator);

const TestScreen = ({ route }: any) => {
  const isFocused = useIsFocused();

  return (
    <Text>
      Screen:{route.name}
      {isFocused ? '(focused)' : null}
    </Text>
  );
};

test('fires loader when an action navigates to a screen with UNSTABLE_loader', async () => {
  const fn = jest.fn(async (_options: { name: string; params: unknown }) => {});

  const Root = createTestNavigator({
    screens: {
      Home: TestScreen,
      Detail: {
        screen: TestScreen,
        UNSTABLE_loader: fn,
      },
    },
  });

  const Component = Root.getComponent();

  const navigation = createNavigationContainerRef<ParamListBase>();

  await render(
    <BaseNavigationContainer ref={navigation}>
      <Component />
    </BaseNavigationContainer>
  );

  expect(fn).not.toHaveBeenCalled();

  await act(() => {
    navigation.dispatch(CommonActions.navigate('Detail', { id: '42' }));
  });

  expect(fn).toHaveBeenCalledTimes(1);
  expect(fn).toHaveBeenCalledWith({
    name: 'Detail',
    params: { id: '42' },
  });
});

test('does not fire any loader when navigating to a screen without UNSTABLE_loader', async () => {
  const fn = jest.fn(async (_options: { name: string; params: unknown }) => {});

  const Root = createTestNavigator({
    screens: {
      Home: {
        screen: TestScreen,
        UNSTABLE_loader: fn,
      },
      Detail: TestScreen,
    },
  });

  const Component = Root.getComponent();

  const navigation = createNavigationContainerRef<ParamListBase>();

  await render(
    <BaseNavigationContainer ref={navigation}>
      <Component />
    </BaseNavigationContainer>
  );

  expect(fn).not.toHaveBeenCalled();

  await act(() => {
    navigation.dispatch(CommonActions.navigate('Detail'));
  });

  expect(fn).not.toHaveBeenCalled();
});

test('fires loader for the focused route on reset without index', async () => {
  const homeFn = jest.fn(
    async (_options: { name: string; params: unknown }) => {}
  );

  const detailFn = jest.fn(
    async (_options: { name: string; params: unknown }) => {}
  );

  const Root = createStackTestNavigator({
    screens: {
      Home: {
        screen: TestScreen,
        UNSTABLE_loader: homeFn,
      },
      Detail: {
        screen: TestScreen,
        UNSTABLE_loader: detailFn,
      },
    },
  });

  const Component = Root.getComponent();

  const navigation = createNavigationContainerRef<ParamListBase>();

  await render(
    <BaseNavigationContainer ref={navigation}>
      <Component />
    </BaseNavigationContainer>
  );

  await act(() => {
    navigation.dispatch(
      CommonActions.reset({
        routes: [{ name: 'Home' }, { name: 'Detail' }],
      })
    );
  });

  expect(navigation.getCurrentRoute()?.name).toBe('Detail');

  expect(homeFn).not.toHaveBeenCalled();
  expect(detailFn).toHaveBeenCalledTimes(1);
  expect(detailFn).toHaveBeenCalledWith({
    name: 'Detail',
    params: undefined,
  });
});

test("doesn't wait for the loader before committing the state", async () => {
  const loader = jest.fn(async () => {
    await new Promise<void>(() => {});
  });

  const Root = createTestNavigator({
    screens: {
      Home: TestScreen,
      Detail: {
        screen: TestScreen,
        UNSTABLE_loader: loader,
      },
    },
  });

  const Component = Root.getComponent();

  const navigation = createNavigationContainerRef<ParamListBase>();

  await render(
    <BaseNavigationContainer ref={navigation}>
      <Component />
    </BaseNavigationContainer>
  );

  await act(() => {
    navigation.dispatch(CommonActions.navigate('Detail'));
  });

  expect(loader).toHaveBeenCalledTimes(1);

  expect(navigation.getCurrentRoute()?.name).toBe('Detail');
});

test("doesn't fire loader when the focused route doesn't change", async () => {
  const loader = jest.fn(
    async (_options: { name: string; params: unknown }) => {}
  );

  const Root = createTestNavigator({
    screens: {
      Home: {
        screen: TestScreen,
        UNSTABLE_loader: loader,
      },
    },
  });

  const Component = Root.getComponent();

  const navigation = createNavigationContainerRef<ParamListBase>();

  await render(
    <BaseNavigationContainer ref={navigation}>
      <Component />
    </BaseNavigationContainer>
  );

  await act(() => {
    navigation.dispatch(CommonActions.setParams({ id: '42' }));
  });

  expect(loader).not.toHaveBeenCalled();

  expect(navigation.getCurrentRoute()?.params).toEqual({ id: '42' });
});

test('fires loader when a route is replaced with the same name and a different key', async () => {
  const loader = jest.fn(async () => {});

  const Root = createTestNavigator({
    screens: {
      Home: {
        screen: TestScreen,
        UNSTABLE_loader: loader,
      },
    },
  });

  const Component = Root.getComponent();
  const navigation = createNavigationContainerRef<ParamListBase>();

  await render(
    <BaseNavigationContainer ref={navigation}>
      <Component />
    </BaseNavigationContainer>
  );

  const route = navigation.getRootState().routes[0];

  if (route == null) {
    throw new Error('Expected a route');
  }

  await act(() => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: route.name, key: `${route.key}-replacement` }],
      })
    );
  });

  expect(navigation.getCurrentRoute()?.name).toBe('Home');
  expect(loader).toHaveBeenCalledTimes(1);
});

test('fires loader when the nested focused route changes under the same route', async () => {
  const parentFn = jest.fn(async () => {});
  const albumsFn = jest.fn(async () => {});
  const contactsFn = jest.fn(async () => {});

  const Child = createTestNavigator({
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

  const Root = createTestNavigator({
    initialRouteName: 'Nested',
    screens: {
      Home: TestScreen,
      Nested: {
        screen: Child,
        UNSTABLE_loader: parentFn,
      },
    },
  });

  const Component = Root.getComponent();

  const navigation = createNavigationContainerRef<ParamListBase>();

  await render(
    <BaseNavigationContainer ref={navigation}>
      <Component />
    </BaseNavigationContainer>
  );

  await act(() => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'Nested',
            key: 'Nested',
            state: {
              index: 0,
              routes: [{ name: 'Albums', key: 'Albums' }],
            },
          },
        ],
      })
    );
  });

  parentFn.mockClear();
  albumsFn.mockClear();
  contactsFn.mockClear();

  await act(() => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'Nested',
            key: 'Nested',
            state: {
              index: 1,
              routes: [
                { name: 'Albums', key: 'Albums' },
                { name: 'Contacts', key: 'Contacts' },
              ],
            },
          },
        ],
      })
    );
  });

  expect(navigation.getCurrentRoute()?.name).toBe('Contacts');
  expect(parentFn).not.toHaveBeenCalled();
  expect(albumsFn).not.toHaveBeenCalled();
  expect(contactsFn).toHaveBeenCalledTimes(1);
});

test.each([
  {
    type: 'screen',
    params: { screen: 'Contacts' },
  },
  {
    type: 'state',
    params: {
      state: {
        index: 0,
        routes: [{ name: 'Contacts' }],
      },
    },
  },
])(
  'fires only the newly focused loader when nested $type params change focus',
  async ({ params }) => {
    const parentFn = jest.fn(async () => {});
    const albumsFn = jest.fn(async () => {});
    const contactsFn = jest.fn(async () => {});

    const Child = createTestNavigator({
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

    const Root = createTestNavigator({
      initialRouteName: 'Nested',
      screens: {
        Nested: {
          screen: Child,
          UNSTABLE_loader: parentFn,
        },
      },
    });

    const Component = Root.getComponent();
    const navigation = createNavigationContainerRef<ParamListBase>();

    await render(
      <BaseNavigationContainer ref={navigation}>
        <Component />
      </BaseNavigationContainer>
    );

    await act(() => {
      navigation.dispatch(CommonActions.navigate('Nested', params));
    });

    expect(navigation.getCurrentRoute()?.name).toBe('Contacts');
    expect(parentFn).not.toHaveBeenCalled();
    expect(albumsFn).not.toHaveBeenCalled();
    expect(contactsFn).toHaveBeenCalledTimes(1);
  }
);

test('fires parent and child loaders when fresh nested params focus the parent', async () => {
  const parentFn = jest.fn(async () => {});
  const albumsFn = jest.fn(async () => {});
  const contactsFn = jest.fn(async () => {});

  const Child = createTestNavigator({
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

  const Root = createTestNavigator({
    screens: {
      Home: TestScreen,
      Nested: {
        screen: Child,
        UNSTABLE_loader: parentFn,
      },
    },
  });

  const Component = Root.getComponent();
  const navigation = createNavigationContainerRef<ParamListBase>();

  await render(
    <BaseNavigationContainer ref={navigation}>
      <Component />
    </BaseNavigationContainer>
  );

  await act(() => {
    navigation.dispatch(
      CommonActions.navigate('Nested', { screen: 'Contacts' })
    );
  });

  expect(navigation.getCurrentRoute()?.name).toBe('Contacts');
  expect(parentFn).toHaveBeenCalledTimes(1);
  expect(albumsFn).not.toHaveBeenCalled();
  expect(contactsFn).toHaveBeenCalledTimes(1);
});

test('fires loaders at every newly focused level in a deeply nested navigator', async () => {
  const parentFn = jest.fn(async () => {});
  const sectionFn = jest.fn(async () => {});
  const albumsFn = jest.fn(async () => {});
  const contactsFn = jest.fn(async () => {});

  const Grandchild = createTestNavigator({
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

  const Child = createTestNavigator({
    screens: {
      Section: {
        screen: Grandchild,
        UNSTABLE_loader: sectionFn,
      },
    },
  });

  const Root = createTestNavigator({
    screens: {
      Home: TestScreen,
      Nested: {
        screen: Child,
        UNSTABLE_loader: parentFn,
      },
    },
  });

  const Component = Root.getComponent();
  const navigation = createNavigationContainerRef<ParamListBase>();

  await render(
    <BaseNavigationContainer ref={navigation}>
      <Component />
    </BaseNavigationContainer>
  );

  await act(() => {
    navigation.dispatch(
      CommonActions.navigate('Nested', {
        screen: 'Section',
        params: { screen: 'Contacts' },
      })
    );
  });

  expect(navigation.getCurrentRoute()?.name).toBe('Contacts');
  expect(parentFn).toHaveBeenCalledTimes(1);
  expect(sectionFn).toHaveBeenCalledTimes(1);
  expect(albumsFn).not.toHaveBeenCalled();
  expect(contactsFn).toHaveBeenCalledTimes(1);
});

test('fires only the newly focused loader for a deeply nested focus change', async () => {
  const parentFn = jest.fn(async () => {});
  const sectionFn = jest.fn(async () => {});
  const albumsFn = jest.fn(async () => {});
  const contactsFn = jest.fn(async () => {});

  const Grandchild = createTestNavigator({
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

  const Child = createTestNavigator({
    screens: {
      Section: {
        screen: Grandchild,
        UNSTABLE_loader: sectionFn,
      },
    },
  });

  const Root = createTestNavigator({
    initialRouteName: 'Nested',
    screens: {
      Nested: {
        screen: Child,
        UNSTABLE_loader: parentFn,
      },
    },
  });

  const Component = Root.getComponent();
  const navigation = createNavigationContainerRef<ParamListBase>();

  await render(
    <BaseNavigationContainer ref={navigation}>
      <Component />
    </BaseNavigationContainer>
  );

  await act(() => {
    navigation.dispatch(
      CommonActions.navigate('Nested', {
        screen: 'Section',
        params: { screen: 'Contacts' },
      })
    );
  });

  expect(navigation.getCurrentRoute()?.name).toBe('Contacts');
  expect(parentFn).not.toHaveBeenCalled();
  expect(sectionFn).not.toHaveBeenCalled();
  expect(albumsFn).not.toHaveBeenCalled();
  expect(contactsFn).toHaveBeenCalledTimes(1);
});

test("doesn't fire loaders when nested params keep the same route focused", async () => {
  const parentFn = jest.fn(async () => {});
  const albumsFn = jest.fn(async () => {});

  const Child = createTestNavigator({
    screens: {
      Albums: {
        screen: TestScreen,
        UNSTABLE_loader: albumsFn,
      },
    },
  });

  const Root = createTestNavigator({
    initialRouteName: 'Nested',
    screens: {
      Nested: {
        screen: Child,
        UNSTABLE_loader: parentFn,
      },
    },
  });

  const Component = Root.getComponent();
  const navigation = createNavigationContainerRef<ParamListBase>();

  await render(
    <BaseNavigationContainer ref={navigation}>
      <Component />
    </BaseNavigationContainer>
  );

  await act(() => {
    navigation.dispatch(
      CommonActions.navigate('Nested', {
        screen: 'Albums',
        params: { id: '42' },
      })
    );
  });

  expect(navigation.getCurrentRoute()?.name).toBe('Albums');
  expect(parentFn).not.toHaveBeenCalled();
  expect(albumsFn).not.toHaveBeenCalled();
});

test.each([
  {
    type: 'screen',
    params: { screen: 'Contacts' },
  },
  {
    type: 'state',
    params: {
      state: {
        index: 0,
        routes: [{ name: 'Contacts' }],
      },
    },
  },
])('uses each nested $type params object only once', async ({ params }) => {
  const parentFn = jest.fn(async () => {});
  const albumsFn = jest.fn(async () => {});
  const contactsFn = jest.fn(async () => {});

  const Child = createTestNavigator({
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

  const Root = createTestNavigator({
    initialRouteName: 'Nested',
    screens: {
      Home: TestScreen,
      Nested: {
        screen: Child,
        UNSTABLE_loader: parentFn,
      },
    },
  });

  const Component = Root.getComponent();
  const navigation = createNavigationContainerRef<ParamListBase>();

  await render(
    <BaseNavigationContainer ref={navigation}>
      <Component />
    </BaseNavigationContainer>
  );

  await act(() => {
    navigation.dispatch(CommonActions.navigate('Nested', params));
  });

  const consumedParams = navigation
    .getRootState()
    .routes.find((route) => route.name === 'Nested')?.params;

  if (consumedParams == null) {
    throw new Error('Expected nested params');
  }

  parentFn.mockClear();
  albumsFn.mockClear();
  contactsFn.mockClear();

  await act(() => {
    navigation.dispatch(CommonActions.navigate('Home'));
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'Nested',
            params: consumedParams,
            state: {
              index: 0,
              routes: [{ name: 'Albums' }],
            },
          },
        ],
      })
    );
  });

  expect(navigation.getCurrentRoute()?.name).toBe('Albums');
  expect(parentFn).toHaveBeenCalledTimes(1);
  expect(albumsFn).toHaveBeenCalledTimes(1);
  expect(contactsFn).not.toHaveBeenCalled();

  parentFn.mockClear();
  albumsFn.mockClear();
  contactsFn.mockClear();

  await act(() => {
    navigation.dispatch(
      CommonActions.navigate('Nested', { ...consumedParams })
    );
  });

  expect(navigation.getCurrentRoute()?.name).toBe('Contacts');
  expect(parentFn).not.toHaveBeenCalled();
  expect(albumsFn).not.toHaveBeenCalled();
  expect(contactsFn).toHaveBeenCalledTimes(1);
});

test('uses a consumed params object only once within a container', async () => {
  const firstContactsFn = jest.fn(async () => {});
  const secondParentFn = jest.fn(async () => {});
  const secondAlbumsFn = jest.fn(async () => {});
  const secondContactsFn = jest.fn(async () => {});

  const FirstChild = createStackTestNavigator({
    screens: {
      Albums: TestScreen,
      Contacts: {
        screen: TestScreen,
        UNSTABLE_loader: firstContactsFn,
      },
    },
  });

  const SecondChild = createStackTestNavigator({
    screens: {
      Albums: {
        screen: TestScreen,
        UNSTABLE_loader: secondAlbumsFn,
      },
      Contacts: {
        screen: TestScreen,
        UNSTABLE_loader: secondContactsFn,
      },
    },
  });

  const Root = createStackTestNavigator({
    screens: {
      Home: TestScreen,
      First: FirstChild,
      Second: {
        screen: SecondChild,
        UNSTABLE_loader: secondParentFn,
      },
    },
  });

  const Component = Root.getComponent();
  const navigation = createNavigationContainerRef<ParamListBase>();

  await render(
    <BaseNavigationContainer ref={navigation}>
      <Component />
    </BaseNavigationContainer>
  );

  await act(() => {
    navigation.dispatch(
      CommonActions.navigate('First', { screen: 'Contacts' })
    );
  });

  const consumedParams = navigation
    .getRootState()
    .routes.find((route) => route.name === 'First')?.params;

  if (consumedParams == null) {
    throw new Error('Expected nested params');
  }

  firstContactsFn.mockClear();

  await act(() => {
    navigation.dispatch(CommonActions.navigate('Second', consumedParams));
  });

  expect(navigation.getCurrentRoute()?.name).toBe('Albums');
  expect(firstContactsFn).not.toHaveBeenCalled();
  expect(secondParentFn).toHaveBeenCalledTimes(1);
  expect(secondAlbumsFn).toHaveBeenCalledTimes(1);
  expect(secondContactsFn).not.toHaveBeenCalled();
});

test('fires loader when reset adds nested state under the same route key', async () => {
  const albumsFn = jest.fn(async () => {});
  const contactsFn = jest.fn(async () => {});

  const Child = createTestNavigator({
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

  const Root = createTestNavigator({
    initialRouteName: 'Nested',
    screens: {
      Home: TestScreen,
      Nested: Child,
    },
  });

  const Component = Root.getComponent();
  const navigation = createNavigationContainerRef<ParamListBase>();

  await render(
    <BaseNavigationContainer ref={navigation}>
      <Component />
    </BaseNavigationContainer>
  );

  albumsFn.mockClear();
  contactsFn.mockClear();

  const nested = navigation
    .getRootState()
    .routes.find((route) => route.name === 'Nested');

  if (!nested) {
    throw new Error('Nested route not found');
  }

  await act(() => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'Nested',
            key: nested.key,
            state: {
              index: 1,
              routes: [{ name: 'Albums' }, { name: 'Contacts' }],
            },
          },
        ],
      })
    );
  });

  expect(navigation.getCurrentRoute()?.name).toBe('Contacts');
  expect(albumsFn).not.toHaveBeenCalled();
  expect(contactsFn).toHaveBeenCalledTimes(1);
});

test('fires loader when reset removes nested state', async () => {
  const albumsFn = jest.fn(async () => {});

  const Child = createTestNavigator({
    screens: {
      Albums: {
        screen: TestScreen,
        UNSTABLE_loader: albumsFn,
      },
      Contacts: TestScreen,
    },
  });

  const Root = createTestNavigator({
    initialRouteName: 'Nested',
    screens: {
      Home: TestScreen,
      Nested: Child,
    },
  });

  const Component = Root.getComponent();
  const navigation = createNavigationContainerRef<ParamListBase>();

  await render(
    <BaseNavigationContainer ref={navigation}>
      <Component />
    </BaseNavigationContainer>
  );

  const nested = navigation
    .getRootState()
    .routes.find((route) => route.name === 'Nested');

  if (!nested) {
    throw new Error('Nested route not found');
  }

  await act(() => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'Nested',
            key: nested.key,
            state: {
              index: 1,
              routes: [{ name: 'Albums' }, { name: 'Contacts' }],
            },
          },
        ],
      })
    );
  });

  albumsFn.mockClear();

  await act(() => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Nested', key: nested.key }],
      })
    );
  });

  expect(navigation.getCurrentRoute()?.name).toBe('Albums');
  expect(albumsFn).toHaveBeenCalledTimes(1);
});

test("doesn't fire loader when the nested focused route is updated with the same key", async () => {
  const albumsFn = jest.fn(async () => {});

  const Child = createTestNavigator({
    screens: {
      Albums: {
        screen: TestScreen,
        UNSTABLE_loader: albumsFn,
      },
    },
  });

  const Root = createTestNavigator({
    initialRouteName: 'Nested',
    screens: {
      Home: TestScreen,
      Nested: Child,
    },
  });

  const Component = Root.getComponent();

  const navigation = createNavigationContainerRef<ParamListBase>();

  await render(
    <BaseNavigationContainer ref={navigation}>
      <Component />
    </BaseNavigationContainer>
  );

  await act(() => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'Nested',
            key: 'Nested',
            state: {
              index: 0,
              routes: [{ name: 'Albums', key: 'Albums' }],
            },
          },
        ],
      })
    );
  });

  albumsFn.mockClear();

  await act(() => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'Nested',
            key: 'Nested',
            state: {
              index: 0,
              routes: [
                {
                  name: 'Albums',
                  key: 'Albums',
                  params: { id: '42' },
                },
              ],
            },
          },
        ],
      })
    );
  });

  expect(albumsFn).not.toHaveBeenCalled();

  expect(navigation.getCurrentRoute()?.params).toEqual({ id: '42' });
});

test('composes parent and initial child loaders', async () => {
  const parentFn = jest.fn(
    async (_options: { name: string; params: unknown }) => {}
  );

  const childFn = jest.fn(
    async (_options: { name: string; params: unknown }) => {}
  );

  const Child = createTestNavigator({
    screens: {
      Albums: {
        screen: TestScreen,
        UNSTABLE_loader: childFn,
      },
    },
  });

  const Root = createTestNavigator({
    screens: {
      Home: TestScreen,
      Nested: {
        screen: Child,
        UNSTABLE_loader: parentFn,
      },
    },
  });

  const Component = Root.getComponent();

  const navigation = createNavigationContainerRef<ParamListBase>();

  await render(
    <BaseNavigationContainer ref={navigation}>
      <Component />
    </BaseNavigationContainer>
  );

  await act(() => {
    navigation.dispatch(CommonActions.navigate('Nested'));
  });

  expect(parentFn).toHaveBeenCalledTimes(1);
  expect(childFn).toHaveBeenCalledTimes(1);
});

test('uses the Suspense boundary in screen layout when present', async () => {
  const { promise, resolve } = Promise.withResolvers<void>();
  const loader = jest.fn(async () => {
    await promise;
  });

  const DetailScreen = () => {
    React.use(promise);

    return <Text>Detail</Text>;
  };

  const Root = createTestNavigator({
    screens: {
      Home: TestScreen,
      Detail: {
        screen: DetailScreen,
        UNSTABLE_loader: loader,
        layout: ({ children }) => (
          <React.Suspense fallback={<Text>ScreenLoading</Text>}>
            {children}
          </React.Suspense>
        ),
      },
    },
  });

  const Component = Root.getComponent();

  const navigation = createNavigationContainerRef<ParamListBase>();

  const root = await render(
    <BaseNavigationContainer ref={navigation}>
      <React.Suspense fallback={<Text>Loading</Text>}>
        <Component />
      </React.Suspense>
    </BaseNavigationContainer>
  );

  await act(() => {
    navigation.dispatch(CommonActions.navigate('Detail'));
  });

  expect(loader).toHaveBeenCalledTimes(1);

  expect(root.getByText('ScreenLoading')).toBeTruthy();
  expect(root.queryByText('Loading')).toBeNull();

  await act(() => {
    resolve();
  });

  expect(root.getByText('Detail')).toBeTruthy();
});

test('holds the previous screen when the loader screen relies on a parent boundary', async () => {
  const { promise, resolve } = Promise.withResolvers<void>();
  const loader = jest.fn(async () => {
    await promise;
  });

  const DetailScreen = () => {
    React.use(promise);

    return <Text>Detail</Text>;
  };

  const Root = createTestNavigator({
    screens: {
      Home: TestScreen,
      Detail: {
        screen: DetailScreen,
        UNSTABLE_loader: loader,
      },
    },
  });

  const Component = Root.getComponent();

  const navigation = createNavigationContainerRef<ParamListBase>();

  const root = await render(
    <BaseNavigationContainer ref={navigation}>
      <React.Suspense fallback={<Text>Loading</Text>}>
        <Component />
      </React.Suspense>
    </BaseNavigationContainer>
  );

  await act(() => {
    navigation.dispatch(CommonActions.navigate('Detail'));
  });

  expect(loader).toHaveBeenCalledTimes(1);
  expect(root.queryByText('Loading')).toBeNull();
  expect(root.getByText('Screen:Home(focused)')).toBeTruthy();

  await act(() => {
    resolve();
  });

  expect(root.getByText('Detail')).toBeTruthy();
});
