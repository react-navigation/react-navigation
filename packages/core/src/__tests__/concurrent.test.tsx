import { beforeEach, expect, jest, test } from '@jest/globals';
import type { NavigationState, ParamListBase } from '@react-navigation/routers';
import { CommonActions, StackRouter } from '@react-navigation/routers';
import { act, render } from '@testing-library/react-native';
import * as React from 'react';
import { Text } from 'react-native';

import { BaseNavigationContainer } from '../BaseNavigationContainer';
import { createNavigationContainerRef } from '../createNavigationContainerRef';
import { Screen } from '../Screen';
import { useIsFocused } from '../useIsFocused';
import { useNavigation } from '../useNavigation';
import { useNavigationBuilder } from '../useNavigationBuilder';
import { useNavigationState } from '../useNavigationState';
import { MockRouter, MockRouterKey } from './__fixtures__/MockRouter';

beforeEach(() => {
  MockRouterKey.current = 0;
});

const TestNavigator = (props: any): any => {
  const { state, descriptors, NavigationContent } = useNavigationBuilder(
    MockRouter,
    props
  );

  const route = state.routes[state.index];

  if (route == null) {
    return null;
  }

  return (
    <NavigationContent>{descriptors[route.key]?.render()}</NavigationContent>
  );
};

test('shows the fallback when navigating with resetRoot without a transition', async () => {
  const { promise, resolve } = Promise.withResolvers<void>();

  const ScreenA = () => <Text>[screen-a]</Text>;

  const ScreenB = () => {
    React.use(promise);

    return <Text>[screen-b]</Text>;
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  const root = await render(
    <BaseNavigationContainer ref={navigation}>
      <React.Suspense fallback={<Text>[fallback]</Text>}>
        <TestNavigator>
          <Screen name="A" component={ScreenA} />
          <Screen name="B" component={ScreenB} />
        </TestNavigator>
      </React.Suspense>
    </BaseNavigationContainer>
  );

  expect(root).toMatchInlineSnapshot(`
    <Text>
      [screen-a]
    </Text>
  `);

  await act(() => {
    navigation.resetRoot({ index: 0, routes: [{ name: 'B' }] });
  });

  expect(root).toMatchInlineSnapshot(`
    <>
      <Text
        style={
          {
            "display": "none",
          }
        }
      >
        [screen-a]
      </Text>
      <Text>
        [fallback]
      </Text>
    </>
  `);

  await act(() => resolve());

  expect(root).toMatchInlineSnapshot(`
    <Text>
      [screen-b]
    </Text>
  `);
});

test('keeps the previous screen visible when navigating to a suspending screen', async () => {
  const { promise, resolve } = Promise.withResolvers<void>();

  const ScreenA = () => <Text>[screen-a]</Text>;

  const ScreenB = () => {
    React.use(promise);

    return <Text>[screen-b]</Text>;
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  const root = await render(
    <BaseNavigationContainer ref={navigation}>
      <React.Suspense fallback={<Text>[fallback]</Text>}>
        <TestNavigator>
          <Screen name="A" component={ScreenA} />
          <Screen name="B" component={ScreenB} />
        </TestNavigator>
      </React.Suspense>
    </BaseNavigationContainer>
  );

  expect(root).toMatchInlineSnapshot(`
    <Text>
      [screen-a]
    </Text>
  `);

  await act(() => {
    navigation.navigate('B');
  });

  expect(root).toMatchInlineSnapshot(`
    <Text>
      [screen-a]
    </Text>
  `);

  await act(() => resolve());

  expect(root).toMatchInlineSnapshot(`
    <Text>
      [screen-b]
    </Text>
  `);
});

test('keeps the current screen when going back to a suspending screen', async () => {
  const { promise, resolve } = Promise.withResolvers<void>();

  const ScreenA = () => <Text>[screen-a]</Text>;

  const ScreenB = () => {
    React.use(promise);

    return <Text>[screen-b]</Text>;
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  const root = await render(
    <BaseNavigationContainer ref={navigation}>
      <React.Suspense fallback={<Text>[fallback]</Text>}>
        <TestNavigator initialRouteName="second">
          <Screen name="first" component={ScreenB} />
          <Screen name="second" component={ScreenA} />
        </TestNavigator>
      </React.Suspense>
    </BaseNavigationContainer>
  );

  expect(root).toMatchInlineSnapshot(`
    <Text>
      [screen-a]
    </Text>
  `);

  await act(() => {
    navigation.goBack();
  });

  expect(root).toMatchInlineSnapshot(`
    <Text>
      [screen-a]
    </Text>
  `);

  await act(() => resolve());

  expect(root).toMatchInlineSnapshot(`
    <Text>
      [screen-b]
    </Text>
  `);
});

test('keeps the previous screen when resetting to a suspending screen', async () => {
  const { promise, resolve } = Promise.withResolvers<void>();

  const ScreenA = () => <Text>[screen-a]</Text>;

  const ScreenB = () => {
    React.use(promise);

    return <Text>[screen-b]</Text>;
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  const root = await render(
    <BaseNavigationContainer ref={navigation}>
      <React.Suspense fallback={<Text>[fallback]</Text>}>
        <TestNavigator>
          <Screen name="A" component={ScreenA} />
          <Screen name="B" component={ScreenB} />
        </TestNavigator>
      </React.Suspense>
    </BaseNavigationContainer>
  );

  expect(root).toMatchInlineSnapshot(`
    <Text>
      [screen-a]
    </Text>
  `);

  await act(() => {
    navigation.reset({ index: 0, routes: [{ name: 'B' }] });
  });

  expect(root).toMatchInlineSnapshot(`
    <Text>
      [screen-a]
    </Text>
  `);

  await act(() => resolve());

  expect(root).toMatchInlineSnapshot(`
    <Text>
      [screen-b]
    </Text>
  `);
});

test('keeps the previous screen when navigating in a nested navigator', async () => {
  const { promise, resolve } = Promise.withResolvers<void>();

  const ScreenA = () => <Text>[screen-a]</Text>;

  const ScreenB = () => {
    React.use(promise);

    return <Text>[screen-b]</Text>;
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  const root = await render(
    <BaseNavigationContainer ref={navigation}>
      <TestNavigator>
        <Screen name="outer">
          {() => (
            <React.Suspense fallback={<Text>[fallback]</Text>}>
              <TestNavigator>
                <Screen name="inner-a" component={ScreenA} />
                <Screen name="inner-b" component={ScreenB} />
              </TestNavigator>
            </React.Suspense>
          )}
        </Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  expect(root).toMatchInlineSnapshot(`
    <Text>
      [screen-a]
    </Text>
  `);

  await act(() => {
    navigation.navigate('inner-b');
  });

  expect(root).toMatchInlineSnapshot(`
    <Text>
      [screen-a]
    </Text>
  `);

  await act(() => resolve());

  expect(root).toMatchInlineSnapshot(`
    <Text>
      [screen-b]
    </Text>
  `);
});

test('holds stale content instead of fallback when setParams suspends', async () => {
  const SetParamsNavigator = (props: any) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      MockRouter,
      props
    );

    const route = state.routes[state.index];

    if (route == null) {
      return null;
    }

    return (
      <NavigationContent>{descriptors[route.key]?.render()}</NavigationContent>
    );
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  const { promise, resolve } = Promise.withResolvers<void>();

  const Content = ({ contentId }: { contentId: number }) => {
    if (contentId !== 0) {
      React.use(promise);
    }

    return <Text>[content-{contentId}]</Text>;
  };

  const TestScreen = (props: any) => {
    const contentId = props.route.params?.contentId ?? 0;

    return (
      <React.Suspense fallback={<Text>[fallback]</Text>}>
        <Content contentId={contentId} />
      </React.Suspense>
    );
  };

  const root = await render(
    <BaseNavigationContainer ref={navigation}>
      <SetParamsNavigator>
        <Screen name="A" component={TestScreen} />
      </SetParamsNavigator>
    </BaseNavigationContainer>
  );

  expect(root).toMatchInlineSnapshot(`
    <Text>
      [content-
      0
      ]
    </Text>
  `);

  await act(() => {
    navigation.dispatch(CommonActions.setParams({ contentId: 1 }));
  });

  expect(root).toMatchInlineSnapshot(`
    <Text>
      [content-
      0
      ]
    </Text>
  `);

  await act(() => resolve());

  expect(root).toMatchInlineSnapshot(`
    <Text>
      [content-
      1
      ]
    </Text>
  `);
});

test('reflects the pending state with useTransition during navigation', async () => {
  const { promise, resolve } = Promise.withResolvers<void>();

  const ScreenB = () => {
    React.use(promise);

    return <Text>[screen-b]</Text>;
  };

  let startNavigation: (() => void) | undefined;

  const PendingScreenA = () => {
    const navigation: any = useNavigation();
    const [isPending, startTransition] = React.useTransition();

    startNavigation = () => {
      startTransition(() => {
        navigation.navigate('B');
      });
    };

    return <Text>[screen-a-{isPending ? 'pending' : 'idle'}]</Text>;
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  const root = await render(
    <BaseNavigationContainer ref={navigation}>
      <React.Suspense fallback={<Text>[fallback]</Text>}>
        <TestNavigator>
          <Screen name="A" component={PendingScreenA} />
          <Screen name="B" component={ScreenB} />
        </TestNavigator>
      </React.Suspense>
    </BaseNavigationContainer>
  );

  expect(root).toMatchInlineSnapshot(`
    <Text>
      [screen-a-
      idle
      ]
    </Text>
  `);

  await act(() => {
    startNavigation?.();
  });

  expect(root).toMatchInlineSnapshot(`
    <Text>
      [screen-a-
      pending
      ]
    </Text>
  `);

  await act(() => resolve());

  expect(root).toMatchInlineSnapshot(`
    <Text>
      [screen-b]
    </Text>
  `);
});

test('does not leak state updates scheduled during a discarded render', async () => {
  const { promise, resolve } = Promise.withResolvers<void>();

  let collapse: (() => void) | undefined;

  const App = () => {
    const [collapsed, setCollapsed] = React.useState(false);

    collapse = () => {
      React.startTransition(() => {
        setCollapsed(true);
      });
    };

    return (
      <React.Suspense fallback={<Text>[fallback]</Text>}>
        <TestNavigator>
          <Screen name="A">
            {() => {
              // Collapsing removes screen B (scheduling a state update to drop it)
              // and suspends the focused screen, so this render is thrown away
              if (collapsed) {
                React.use(promise);
              }

              return <Text>[screen-a]</Text>;
            }}
          </Screen>
          {collapsed ? null : (
            <Screen name="B">{() => <Text>[screen-b]</Text>}</Screen>
          )}
        </TestNavigator>
      </React.Suspense>
    );
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  await render(
    <BaseNavigationContainer ref={navigation}>
      <App />
    </BaseNavigationContainer>
  );

  expect(navigation.getRootState()).toMatchObject({
    index: 0,
    routeNames: ['A', 'B'],
    routes: [{ name: 'A' }, { name: 'B' }],
  });

  await act(() => {
    collapse?.();
  });

  // The transition is held on the suspending screen, so collapsing hasn't committed.
  // An unrelated update now commits and flushes pending updates - the update scheduled
  await act(() => {
    navigation.dispatch({ type: 'UPDATE' });
  });

  expect(navigation.getRootState()).toMatchObject({
    index: 0,
    routeNames: ['A', 'B'],
    routes: [{ name: 'A' }, { name: 'B' }],
  });

  await act(() => resolve());

  expect(navigation.getRootState()).toMatchObject({
    index: 0,
    routeNames: ['A'],
    routes: [{ name: 'A' }],
  });
});

test('keeps useNavigationState consistent with the held screen during navigation', async () => {
  const { promise, resolve } = Promise.withResolvers<void>();

  const ScreenA = () => <Text>[screen-a]</Text>;

  const ScreenB = () => {
    React.use(promise);

    return <Text>[screen-b]</Text>;
  };

  const Index = () => {
    const index = useNavigationState((state: NavigationState) => state.index);

    return <Text>[index-{index}]</Text>;
  };

  const TestNavigatorWithIndex = (props: any): any => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      MockRouter,
      props
    );
    const route = state.routes[state.index];

    if (route == null) {
      return null;
    }

    return (
      <NavigationContent>
        <Index />
        <React.Suspense fallback={<Text>[fallback]</Text>}>
          {descriptors[route.key]?.render()}
        </React.Suspense>
      </NavigationContent>
    );
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  const root = await render(
    <BaseNavigationContainer ref={navigation}>
      <TestNavigatorWithIndex>
        <Screen name="A" component={ScreenA} />
        <Screen name="B" component={ScreenB} />
      </TestNavigatorWithIndex>
    </BaseNavigationContainer>
  );

  expect(root).toMatchInlineSnapshot(`
    <>
      <Text>
        [index-
        0
        ]
      </Text>
      <Text>
        [screen-a]
      </Text>
    </>
  `);

  await act(() => {
    navigation.navigate('B');
  });

  expect(root).toMatchInlineSnapshot(`
    <>
      <Text>
        [index-
        0
        ]
      </Text>
      <Text>
        [screen-a]
      </Text>
    </>
  `);

  await act(() => resolve());

  expect(root).toMatchInlineSnapshot(`
    <>
      <Text>
        [index-
        1
        ]
      </Text>
      <Text>
        [screen-b]
      </Text>
    </>
  `);
});

test('interrupts an in-flight transition when navigating again', async () => {
  const promiseB = Promise.withResolvers<void>();
  const promiseC = Promise.withResolvers<void>();

  const ScreenA = () => <Text>[screen-a]</Text>;

  const ScreenB = () => {
    React.use(promiseB.promise);

    return <Text>[screen-b]</Text>;
  };

  const ScreenC = () => {
    React.use(promiseC.promise);

    return <Text>[screen-c]</Text>;
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  const root = await render(
    <BaseNavigationContainer ref={navigation}>
      <React.Suspense fallback={<Text>[fallback]</Text>}>
        <TestNavigator>
          <Screen name="A" component={ScreenA} />
          <Screen name="B" component={ScreenB} />
          <Screen name="C" component={ScreenC} />
        </TestNavigator>
      </React.Suspense>
    </BaseNavigationContainer>
  );

  await act(() => {
    navigation.navigate('B');
  });

  expect(root).toMatchInlineSnapshot(`
    <Text>
      [screen-a]
    </Text>
  `);

  await act(() => {
    navigation.navigate('C');
  });

  expect(root).toMatchInlineSnapshot(`
    <Text>
      [screen-a]
    </Text>
  `);

  await act(() => promiseB.resolve());

  expect(root).toMatchInlineSnapshot(`
    <Text>
      [screen-a]
    </Text>
  `);

  await act(() => promiseC.resolve());

  expect(root).toMatchInlineSnapshot(`
    <Text>
      [screen-c]
    </Text>
  `);
});

test('shows the error boundary when a navigation transition fails', async () => {
  const { promise, reject } = Promise.withResolvers<void>();

  class ErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean }
  > {
    override state = { hasError: false };

    static getDerivedStateFromError() {
      return { hasError: true };
    }

    override render() {
      if (this.state.hasError) {
        return <Text>[error]</Text>;
      }

      return this.props.children;
    }
  }

  const ScreenA = () => <Text>[screen-a]</Text>;

  const ScreenB = () => {
    React.use(promise);

    return <Text>[screen-b]</Text>;
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  const root = await render(
    <BaseNavigationContainer ref={navigation}>
      <ErrorBoundary>
        <React.Suspense fallback={<Text>[fallback]</Text>}>
          <TestNavigator>
            <Screen name="A" component={ScreenA} />
            <Screen name="B" component={ScreenB} />
          </TestNavigator>
        </React.Suspense>
      </ErrorBoundary>
    </BaseNavigationContainer>
  );

  await act(() => {
    navigation.navigate('B');
  });

  expect(root).toMatchInlineSnapshot(`
    <Text>
      [screen-a]
    </Text>
  `);

  const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

  await act(() => {
    reject(new Error('Failed to load'));
  });

  expect(root).toMatchInlineSnapshot(`
    <Text>
      [error]
    </Text>
  `);

  expect(errorSpy).toHaveBeenCalled();

  errorSpy.mockRestore();
});

test('shows the fallback of a freshly mounted boundary during navigation', async () => {
  const { promise, resolve } = Promise.withResolvers<void>();

  const ScreenA = () => <Text>[screen-a]</Text>;

  const ScreenB = () => {
    React.use(promise);

    return <Text>[screen-b]</Text>;
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  const root = await render(
    <BaseNavigationContainer ref={navigation}>
      <TestNavigator>
        <Screen name="A" component={ScreenA} />
        <Screen name="B">
          {() => (
            <React.Suspense fallback={<Text>[fallback-b]</Text>}>
              <ScreenB />
            </React.Suspense>
          )}
        </Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  expect(root).toMatchInlineSnapshot(`
    <Text>
      [screen-a]
    </Text>
  `);

  await act(() => {
    navigation.navigate('B');
  });

  expect(root).toMatchInlineSnapshot(`
    <Text>
      [fallback-b]
    </Text>
  `);

  await act(() => resolve());

  expect(root).toMatchInlineSnapshot(`
    <Text>
      [screen-b]
    </Text>
  `);
});

test('allows navigating away while a transition is pending', async () => {
  const { promise, resolve } = Promise.withResolvers<void>();

  const ScreenA = () => <Text>[screen-a]</Text>;

  const ScreenB = () => {
    React.use(promise);

    return <Text>[screen-b]</Text>;
  };

  const ScreenC = () => <Text>[screen-c]</Text>;

  const navigation = createNavigationContainerRef<ParamListBase>();

  const root = await render(
    <BaseNavigationContainer ref={navigation}>
      <React.Suspense fallback={<Text>[fallback]</Text>}>
        <TestNavigator>
          <Screen name="A" component={ScreenA} />
          <Screen name="B" component={ScreenB} />
          <Screen name="C" component={ScreenC} />
        </TestNavigator>
      </React.Suspense>
    </BaseNavigationContainer>
  );

  await act(() => {
    navigation.navigate('B');
  });

  expect(root).toMatchInlineSnapshot(`
    <Text>
      [screen-a]
    </Text>
  `);

  await act(() => {
    navigation.navigate('C');
  });

  expect(root).toMatchInlineSnapshot(`
    <Text>
      [screen-c]
    </Text>
  `);

  await act(() => resolve());

  expect(root).toMatchInlineSnapshot(`
    <Text>
      [screen-c]
    </Text>
  `);
});

test('resets the pending state after a setParams transition completes', async () => {
  const { promise, resolve } = Promise.withResolvers<void>();

  let triggerUpdate: (() => void) | undefined;

  const Content = ({ contentId }: { contentId: number }) => {
    if (contentId !== 0) {
      React.use(promise);
    }

    return <Text>[content-{contentId}]</Text>;
  };

  const PendingScreen = (props: any) => {
    const navigation: any = useNavigation();
    const [isPending, startTransition] = React.useTransition();
    const contentId = props.route.params?.contentId ?? 0;

    triggerUpdate = () => {
      startTransition(() => {
        navigation.setParams({ contentId: 1 });
      });
    };

    return (
      <>
        <Text>[{isPending ? 'pending' : 'idle'}]</Text>
        <React.Suspense fallback={<Text>[fallback]</Text>}>
          <Content contentId={contentId} />
        </React.Suspense>
      </>
    );
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  const root = await render(
    <BaseNavigationContainer ref={navigation}>
      <TestNavigator>
        <Screen name="A" component={PendingScreen} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  expect(root).toMatchInlineSnapshot(`
    <>
      <Text>
        [
        idle
        ]
      </Text>
      <Text>
        [content-
        0
        ]
      </Text>
    </>
  `);

  await act(() => {
    triggerUpdate?.();
  });

  expect(root).toMatchInlineSnapshot(`
    <>
      <Text>
        [
        pending
        ]
      </Text>
      <Text>
        [content-
        0
        ]
      </Text>
    </>
  `);

  await act(() => resolve());

  expect(root).toMatchInlineSnapshot(`
    <>
      <Text>
        [
        idle
        ]
      </Text>
      <Text>
        [content-
        1
        ]
      </Text>
    </>
  `);
});

test('keeps navigation and route object identity when a transition render is discarded', async () => {
  const { promise, resolve } = Promise.withResolvers<void>();

  let suspendA = false;

  const navigations = new Set();
  const routes = new Set();

  const ScreenA = () => {
    const isFocused = useIsFocused();

    if (suspendA && isFocused) {
      React.use(promise);
    }

    return <Text>[screen-a]</Text>;
  };

  const ScreenB = (props: any) => {
    navigations.add(props.navigation);
    routes.add(props.route);

    return <Text>[screen-b]</Text>;
  };

  const StackNavigator = (props: any): any => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      StackRouter,
      props
    );

    return (
      <NavigationContent>
        {state.routes.map((route) => descriptors[route.key]?.render())}
      </NavigationContent>
    );
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  const App = ({ label }: { label: string }) => (
    <BaseNavigationContainer ref={navigation}>
      <React.Suspense fallback={<Text>[fallback]</Text>}>
        <StackNavigator>
          <Screen name="A" component={ScreenA} />
          <Screen name="B" component={ScreenB} />
        </StackNavigator>
      </React.Suspense>
      <Text>{label}</Text>
    </BaseNavigationContainer>
  );

  const root = await render(<App label="one" />);

  await act(() => navigation.navigate('B'));

  expect(navigations.size).toBe(1);
  expect(routes.size).toBe(1);

  // Popping the screen starts a transition where the focused screen suspends
  // So the transition render never commits until the promise resolves
  suspendA = true;

  await act(() => navigation.goBack());

  // The committed tree still shows both screens
  expect(root).toMatchInlineSnapshot(`
    <>
      <Text>
        [screen-a]
      </Text>
      <Text>
        [screen-b]
      </Text>
      <Text>
        one
      </Text>
    </>
  `);

  // An urgent update re-renders the committed tree while the transition is pending
  // The screen must receive the same navigation and route objects as before
  await root.rerender(<App label="two" />);

  expect(navigations.size).toBe(1);
  expect(routes.size).toBe(1);

  await act(() => resolve());

  expect(root).toMatchInlineSnapshot(`
    <>
      <Text>
        [screen-a]
      </Text>
      <Text>
        two
      </Text>
    </>
  `);
});
