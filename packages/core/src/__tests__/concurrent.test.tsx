import { beforeEach, expect, jest, test } from '@jest/globals';
import type { NavigationState, ParamListBase } from '@react-navigation/routers';
import { CommonActions } from '@react-navigation/routers';
import { act, render } from '@testing-library/react-native';
import * as React from 'react';
import { Text } from 'react-native';

import { BaseNavigationContainer } from '../BaseNavigationContainer';
import { createNavigationContainerRef } from '../createNavigationContainerRef';
import { Screen } from '../Screen';
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
