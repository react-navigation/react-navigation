import { expect, jest, test } from '@jest/globals';
import type { ParamListBase } from '@react-navigation/routers';
import { CommonActions, StackRouter } from '@react-navigation/routers';
import { act, render } from '@testing-library/react-native';
import * as React from 'react';
import { Text } from 'react-native';

import { BaseNavigationContainer } from '../BaseNavigationContainer';
import { createNavigationContainerRef } from '../createNavigationContainerRef';
import { createNavigatorFactory } from '../createNavigatorFactory';
import { useIsFocused } from '../useIsFocused';
import { useNavigationBuilder } from '../useNavigationBuilder';
import { MockRouter } from './__fixtures__/MockRouter';

const TestNavigator = (props: any) => {
  const { state, descriptors, NavigationContent } = useNavigationBuilder(
    MockRouter,
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

test('fires loader when the nested focused route changes under the same route', async () => {
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

  expect(albumsFn).not.toHaveBeenCalled();
  expect(contactsFn).toHaveBeenCalledTimes(1);
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

  const state = navigation.getRootState();
  const nested = state.routes.find((route) => route.name === 'Nested');

  await act(() => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'Nested',
            key: nested?.key,
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
