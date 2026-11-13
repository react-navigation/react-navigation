import { expect, test } from '@jest/globals';
import {
  CommonActions,
  type ParamListBase,
  StackActions,
  StackRouter,
} from '@react-navigation/routers';
import { act, render } from '@testing-library/react-native';
import * as React from 'react';
import { Text } from 'react-native';

import { BaseNavigationContainer } from '../BaseNavigationContainer';
import { createNavigationContainerRef } from '../createNavigationContainerRef';
import { Screen } from '../Screen';
import type { NavigationContainerRefWithCurrent } from '../types';
import { useNavigation } from '../useNavigation';
import { useNavigationBuilder } from '../useNavigationBuilder';
import { useRoute } from '../useRoute';

type NavigatorProps = {
  children: React.ReactNode;
  initialRouteName?: string;
};

type NestedNavigatorProps = {
  version: 'first' | 'second';
  initialScreen?: React.ComponentType;
  targetScreen?: React.ComponentType;
};

type TestProps = NestedNavigatorProps & {
  navigation: NavigationContainerRefWithCurrent<ParamListBase>;
  show?: boolean;
  mode?: 'visible' | 'hidden';
};

const TestNavigator = (props: NavigatorProps) => {
  const { state, descriptors, render } = useNavigationBuilder(
    StackRouter,
    props
  );

  const route = state.routes[state.index];

  if (route == null) {
    return null;
  }

  return render(descriptors[route.key]?.render());
};

const TestScreen = () => {
  const route = useRoute();

  return <Text>{route.name}</Text>;
};

const NestedNavigator = ({
  version,
  initialScreen = TestScreen,
  targetScreen = TestScreen,
}: NestedNavigatorProps) => {
  const route = useRoute<{ Parent: { version: 'first' | 'second' } }>();
  const currentVersion = route.params?.version ?? version;
  const initialRouteName = currentVersion === 'first' ? 'First' : 'Second';

  return (
    <TestNavigator key={currentVersion} initialRouteName={initialRouteName}>
      <Screen name={initialRouteName} component={initialScreen} />
      <Screen name="Shared" component={TestScreen} />
      <Screen name="Target" component={targetScreen} />
      <Screen name="Last" component={TestScreen} />
    </TestNavigator>
  );
};

const Test = ({
  navigation,
  show = true,
  mode = 'visible',
  ...props
}: TestProps) => (
  <BaseNavigationContainer ref={navigation}>
    <TestNavigator>
      <Screen name="Parent">
        {() => (
          <React.Activity mode={mode}>
            {show ? <NestedNavigator {...props} /> : null}
          </React.Activity>
        )}
      </Screen>
    </TestNavigator>
  </BaseNavigationContainer>
);

test.each([false, true])(
  'shows fresh initial routes and supports navigation when swapping navigators directly in the container (StrictMode: %s)',
  async (strictMode) => {
    const navigation = createNavigationContainerRef<ParamListBase>();
    const Wrapper = strictMode ? React.StrictMode : React.Fragment;
    const DirectTest = ({ version }: NestedNavigatorProps) => {
      const initialRouteName = version === 'first' ? 'First' : 'Second';

      return (
        <Wrapper>
          <BaseNavigationContainer ref={navigation}>
            <TestNavigator key={version} initialRouteName={initialRouteName}>
              <Screen name={initialRouteName} component={TestScreen} />
              <Screen name="Shared" component={TestScreen} />
              <Screen name="Target" component={TestScreen} />
            </TestNavigator>
          </BaseNavigationContainer>
        </Wrapper>
      );
    };

    const root = await render(<DirectTest version="first" />);

    expect(root.getByText('First')).toBeTruthy();

    await act(() => navigation.navigate('Shared'));

    expect(root.getByText('Shared')).toBeTruthy();

    const firstState = navigation.getRootState();

    await root.rerender(<DirectTest version="second" />);

    expect(root.getByText('Second')).toBeTruthy();
    expect(navigation.getRootState()).toMatchObject({
      index: 0,
      routes: [{ name: 'Second' }],
    });

    await act(() => navigation.navigate('Target'));

    expect(root.getByText('Target')).toBeTruthy();

    await act(() => navigation.goBack());

    expect(root.getByText('Second')).toBeTruthy();

    await root.rerender(<DirectTest version="first" />);

    expect(root.getByText('First')).toBeTruthy();
    expect(navigation.getRootState()).toMatchObject({
      index: 0,
      routes: [{ name: 'First' }],
    });
    expect(navigation.getRootState()?.key).not.toBe(firstState?.key);
  }
);

test('shows the initial route when a different navigator replaces the current navigator', async () => {
  const navigation = createNavigationContainerRef<ParamListBase>();
  const root = await render(<Test navigation={navigation} version="first" />);

  await act(() => navigation.navigate('Shared'));

  expect(root.getByText('Shared')).toBeTruthy();
  expect(navigation.getRootState()?.routes[0]?.state?.stale).toBe(false);

  await root.rerender(<Test navigation={navigation} version="second" />);

  expect(root.getByText('Second')).toBeTruthy();
  expect(navigation.getRootState()?.routes[0]?.state).toMatchObject({
    index: 0,
    routes: [{ name: 'Second' }],
  });
});

test.each(['partial', 'full'])(
  'shows the restored route after the parent restores %s state while the navigator is unmounted',
  async (kind) => {
    const navigation = createNavigationContainerRef<ParamListBase>();
    const root = await render(<Test navigation={navigation} version="first" />);

    await act(() => navigation.navigate('Target'));

    const saved = navigation.getRootState();

    expect(saved?.routes[0]?.state?.stale).toBe(false);

    await act(() => navigation.navigate('Shared'));
    await root.rerender(
      <Test navigation={navigation} version="first" show={false} />
    );

    await act(() => {
      if (kind === 'full') {
        navigation.resetRoot(saved);
      } else {
        navigation.reset({
          routes: navigation.getState().routes.map((route) => ({
            ...route,
            state: { routes: [{ name: 'Target' }] },
          })),
        });
      }
    });

    await root.rerender(<Test navigation={navigation} version="first" />);

    expect(root.getByText('Target')).toBeTruthy();
    expect(navigation.getRootState()?.routes[0]?.state).toMatchObject({
      index: kind === 'full' ? 1 : 0,
      routes:
        kind === 'full'
          ? [{ name: 'First' }, { name: 'Target' }]
          : [{ name: 'Target' }],
    });
  }
);

test('pushes onto restored history when a screen restores parent state on mount', async () => {
  const navigation = createNavigationContainerRef<ParamListBase>();
  const root = await render(<Test navigation={navigation} version="first" />);

  await act(() => navigation.navigate('Target'));

  const saved = navigation.getRootState();

  await act(() => navigation.navigate('Shared'));
  await root.rerender(
    <Test navigation={navigation} version="first" show={false} />
  );

  const RestoreAndPush = () => {
    const childNavigation = useNavigation();

    React.useLayoutEffect(() => {
      navigation.resetRoot(saved);
      childNavigation.dispatch(StackActions.push('Last'));
    }, [childNavigation]);

    return <TestScreen />;
  };

  await root.rerender(
    <Test
      navigation={navigation}
      version="first"
      initialScreen={RestoreAndPush}
    />
  );

  expect(root.getByText('Last')).toBeTruthy();
  expect(navigation.getCurrentRoute()?.name).toBe('Last');
  expect(navigation.getRootState()?.routes[0]?.state).toMatchObject({
    index: 2,
    routes: [{ name: 'First' }, { name: 'Target' }, { name: 'Last' }],
  });
});

test.each<{ stale: true | undefined }>([{ stale: undefined }, { stale: true }])(
  'shows the restored route with restored history when the parent resets state during a navigator swap (stale: $stale)',
  async ({ stale }) => {
    const navigation = createNavigationContainerRef<ParamListBase>();
    const root = await render(<Test navigation={navigation} version="first" />);

    await act(() => navigation.navigate('Shared'));

    await act(() => {
      navigation.reset({
        routes: navigation.getState().routes.map((route) => ({
          ...route,
          params: { version: 'second' },
          state: {
            ...(stale === undefined ? {} : { stale }),
            routes: [{ name: 'Target' }],
          },
        })),
      });
    });

    expect(root.getByText('Target')).toBeTruthy();
    expect(navigation.getCurrentRoute()?.name).toBe('Target');
    expect(navigation.getRootState()?.routes[0]?.state).toMatchObject({
      index: 0,
      routeNames: ['Second', 'Shared', 'Target', 'Last'],
      routes: [{ name: 'Target' }],
    });
  }
);

test.each<{ stale: true | undefined }>([{ stale: undefined }, { stale: true }])(
  'drops a push made before the parent resets state and applies a push made after it while a replacement navigator mounts (stale: $stale)',
  async ({ stale }) => {
    const navigation = createNavigationContainerRef<ParamListBase>();

    const ResetAndPush = () => {
      const childNavigation = useNavigation();

      React.useLayoutEffect(() => {
        childNavigation.dispatch(StackActions.push('Last'));

        childNavigation.getParent()?.reset({
          routes: navigation.getState().routes.map((route) => ({
            ...route,
            state: {
              ...(stale === undefined ? {} : { stale }),
              routes: [{ name: 'Target' }],
            },
          })),
        });

        childNavigation.dispatch(StackActions.push('Shared'));
      }, [childNavigation]);

      return <TestScreen />;
    };

    const root = await render(
      <Test
        navigation={navigation}
        version="first"
        targetScreen={ResetAndPush}
      />
    );

    await act(() => navigation.navigate('Shared'));

    await act(() => {
      navigation.reset({
        routes: navigation.getState().routes.map((route) => ({
          ...route,
          params: { version: 'second' },
          state: {
            ...(stale === undefined ? {} : { stale }),
            routes: [{ name: 'Target' }],
          },
        })),
      });
    });

    expect(root.getByText('Shared')).toBeTruthy();
    expect(navigation.getCurrentRoute()?.name).toBe('Shared');
    expect(navigation.getRootState()?.routes[0]?.state).toMatchObject({
      index: 1,
      routeNames: ['Second', 'Shared', 'Target', 'Last'],
      routes: [{ name: 'Target' }, { name: 'Shared' }],
    });
  }
);

test.each([
  { targets: ['Target'], last: 'Target' },
  { targets: ['Target', 'Last'], last: 'Last' },
])(
  'shows $last after screens navigate on mount in a replacement navigator without keeping old history',
  async ({ targets, last }) => {
    const NavigateOnMount = ({ target }: { target: string }) => {
      const navigation = useNavigation();

      React.useLayoutEffect(() => {
        navigation.dispatch(CommonActions.navigate(target));
      }, [navigation, target]);

      return <TestScreen />;
    };

    const NavigateToTarget = () => <NavigateOnMount target="Target" />;
    const NavigateToLast = () => <NavigateOnMount target="Last" />;

    const navigation = createNavigationContainerRef<ParamListBase>();
    const root = await render(<Test navigation={navigation} version="first" />);

    await act(() => navigation.navigate('Shared'));

    expect(root.getByText('Shared')).toBeTruthy();

    await root.rerender(
      <Test
        navigation={navigation}
        version="second"
        initialScreen={NavigateToTarget}
        targetScreen={last === 'Last' ? NavigateToLast : TestScreen}
      />
    );

    expect(root.getByText(last)).toBeTruthy();
    expect(navigation.getRootState()?.routes[0]?.state).toMatchObject({
      index: targets.length,
      routes: ['Second', ...targets].map((name) => ({ name })),
    });
  }
);

test.each([false, true])(
  'preserves state when the same navigator renders again (hidden and shown with Activity: %s)',
  async (hidden) => {
    const navigation = createNavigationContainerRef<ParamListBase>();
    const root = await render(<Test navigation={navigation} version="first" />);

    await act(() => navigation.navigate('Shared'));

    const state = navigation.getRootState()?.routes[0]?.state;

    if (hidden) {
      await root.rerender(
        <Test navigation={navigation} version="first" mode="hidden" />
      );
    }

    await root.rerender(<Test navigation={navigation} version="first" />);

    expect(root.getByText('Shared')).toBeTruthy();
    expect(navigation.getRootState()?.routes[0]?.state).toEqual(state);
  }
);
