import { beforeEach, expect, test } from '@jest/globals';
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

test('shows the fallback when navigating to a suspending screen without a transition', async () => {
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

  await act(async () => {
    navigation.navigate('B');
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

  await act(async () => resolve());

  expect(root).toMatchInlineSnapshot(`
    <Text>
      [screen-b]
    </Text>
  `);
});

test('keeps the previous screen visible when navigating with a transition', async () => {
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

  await act(async () => {
    React.startTransition(() => {
      navigation.navigate('B');
    });
  });

  expect(root).toMatchInlineSnapshot(`
    <Text>
      [screen-a]
    </Text>
  `);

  await act(async () => resolve());

  expect(root).toMatchInlineSnapshot(`
    <Text>
      [screen-b]
    </Text>
  `);
});

test('keeps the current screen when going back to a suspending screen with a transition', async () => {
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

  await act(async () => {
    React.startTransition(() => {
      navigation.goBack();
    });
  });

  expect(root).toMatchInlineSnapshot(`
    <Text>
      [screen-a]
    </Text>
  `);

  await act(async () => resolve());

  expect(root).toMatchInlineSnapshot(`
    <Text>
      [screen-b]
    </Text>
  `);
});

test('keeps the previous screen when resetting to a suspending screen with a transition', async () => {
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

  await act(async () => {
    React.startTransition(() => {
      navigation.reset({ index: 0, routes: [{ name: 'B' }] });
    });
  });

  expect(root).toMatchInlineSnapshot(`
    <Text>
      [screen-a]
    </Text>
  `);

  await act(async () => resolve());

  expect(root).toMatchInlineSnapshot(`
    <Text>
      [screen-b]
    </Text>
  `);
});

test('keeps the previous screen when navigating in a nested navigator with a transition', async () => {
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

  await act(async () => {
    React.startTransition(() => {
      navigation.navigate('inner-b');
    });
  });

  expect(root).toMatchInlineSnapshot(`
    <Text>
      [screen-a]
    </Text>
  `);

  await act(async () => resolve());

  expect(root).toMatchInlineSnapshot(`
    <Text>
      [screen-b]
    </Text>
  `);
});

test('shows stale content instead of fallback with startTransition for setParams', async () => {
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

  let { promise, resolve } = Promise.withResolvers<void>();

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

  await act(async () => {
    navigation.dispatch(CommonActions.setParams({ contentId: 1 }));
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
        [content-
        0
        ]
      </Text>
      <Text>
        [fallback]
      </Text>
    </>
  `);

  await act(async () => resolve());

  expect(root).toMatchInlineSnapshot(`
    <Text>
      [content-
      1
      ]
    </Text>
  `);

  ({ promise, resolve } = Promise.withResolvers<void>());

  await act(async () => {
    navigation.dispatch(CommonActions.setParams({ contentId: 2 }));
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
        [content-
        1
        ]
      </Text>
      <Text>
        [fallback]
      </Text>
    </>
  `);

  await act(async () => resolve());

  expect(root).toMatchInlineSnapshot(`
    <Text>
      [content-
      2
      ]
    </Text>
  `);

  ({ promise, resolve } = Promise.withResolvers<void>());

  await act(async () => {
    React.startTransition(() => {
      navigation.dispatch(CommonActions.setParams({ contentId: 3 }));
    });
  });

  expect(root).toMatchInlineSnapshot(`
    <Text>
      [content-
      2
      ]
    </Text>
  `);

  await act(async () => resolve());

  expect(root).toMatchInlineSnapshot(`
    <Text>
      [content-
      3
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

  await act(async () => {
    startNavigation?.();
  });

  expect(root).toMatchInlineSnapshot(`
    <Text>
      [screen-a-
      pending
      ]
    </Text>
  `);

  await act(async () => resolve());

  expect(root).toMatchInlineSnapshot(`
    <Text>
      [screen-b]
    </Text>
  `);
});

test('keeps useNavigationState consistent with the held screen during a transition', async () => {
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

  await act(async () => {
    React.startTransition(() => {
      navigation.navigate('B');
    });
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

  await act(async () => resolve());

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
