import { beforeEach, expect, jest, test } from '@jest/globals';
import type {
  DefaultRouterOptions,
  NavigationState,
  Router,
} from '@react-navigation/routers';
import { act, render } from '@testing-library/react-native';
import * as React from 'react';
import { Text } from 'react-native';

import { BaseNavigationContainer } from '../BaseNavigationContainer';
import { Group } from '../Group';
import { Screen } from '../Screen';
import { useNavigationBuilder } from '../useNavigationBuilder';
import {
  type MockActions,
  MockRouter,
  MockRouterKey,
} from './__fixtures__/MockRouter';

jest.useFakeTimers();

beforeEach(() => {
  MockRouterKey.current = 0;
});

test('sets options with options prop as an object', async () => {
  const TestNavigator = (props: any) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder<
      NavigationState,
      any,
      {},
      { title?: string },
      any
    >(MockRouter, props);
    const route = state.routes[state.index];
    const descriptor = route == null ? undefined : descriptors[route.key];

    return (
      <NavigationContent>
        <main>
          <h1>
            <Text>{descriptor?.options.title}</Text>
          </h1>
          <div>{descriptor?.render()}</div>
        </main>
      </NavigationContent>
    );
  };

  const TestScreen = (): any => <Text>Test screen</Text>;

  const root = await render(
    <BaseNavigationContainer>
      <TestNavigator>
        <Screen
          name="foo"
          component={TestScreen}
          options={{ title: 'Hello world' }}
        />
        <Screen name="bar" component={React.Fragment} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  expect(root).toMatchInlineSnapshot(`
<main>
  <h1>
    <Text>
      Hello world
    </Text>
  </h1>
  <div>
    <Text>
      Test screen
    </Text>
  </div>
</main>
`);
});

test('sets options with options prop as a fuction', async () => {
  const TestNavigator = (props: any) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder<
      NavigationState,
      any,
      {},
      { title?: string },
      any
    >(MockRouter, props);
    const route = state.routes[state.index];
    const descriptor = route == null ? undefined : descriptors[route.key];

    return (
      <NavigationContent>
        <main>
          <h1>
            <Text>{descriptor?.options.title}</Text>
          </h1>
          <div>{descriptor?.render()}</div>
        </main>
      </NavigationContent>
    );
  };

  const TestScreen = (): any => <Text>Test screen</Text>;

  const root = await render(
    <BaseNavigationContainer>
      <TestNavigator>
        <Screen
          name="foo"
          component={TestScreen}
          options={({ route }: any) => ({ title: route.params.author })}
          initialParams={{ author: 'Jane' }}
        />
        <Screen name="bar" component={React.Fragment} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  expect(root).toMatchInlineSnapshot(`
<main>
  <h1>
    <Text>
      Jane
    </Text>
  </h1>
  <div>
    <Text>
      Test screen
    </Text>
  </div>
</main>
`);
});

test('sets options with screenOptions prop as an object', async () => {
  const TestNavigator = (props: any) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder<
      NavigationState,
      any,
      {},
      { title?: string },
      any
    >(MockRouter, props);

    return (
      <NavigationContent>
        {state.routes.map((route) => {
          const descriptor = descriptors[route.key];

          return (
            <main key={route.key}>
              <h1>
                <Text>{descriptor?.options.title}</Text>
              </h1>
              <div>{descriptor?.render()}</div>
            </main>
          );
        })}
      </NavigationContent>
    );
  };

  const TestScreenA = (): any => <Text>Test screen A</Text>;

  const TestScreenB = (): any => <Text>Test screen B</Text>;

  const root = await render(
    <BaseNavigationContainer>
      <TestNavigator screenOptions={{ title: 'Hello world' }}>
        <Screen name="foo" component={TestScreenA} />
        <Screen name="bar" component={TestScreenB} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  expect(root).toMatchInlineSnapshot(`
<>
  <main>
    <h1>
      <Text>
        Hello world
      </Text>
    </h1>
    <div>
      <Text>
        Test screen A
      </Text>
    </div>
  </main>
  <main>
    <h1>
      <Text>
        Hello world
      </Text>
    </h1>
    <div>
      <Text>
        Test screen B
      </Text>
    </div>
  </main>
</>
`);
});

test('sets options with screenOptions prop as a fuction', async () => {
  const TestNavigator = (props: any) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder<
      NavigationState,
      any,
      {},
      { title?: string },
      any
    >(MockRouter, props);

    return (
      <NavigationContent>
        {state.routes.map((route) => {
          const descriptor = descriptors[route.key];

          return (
            <main key={route.key}>
              <h1>
                <Text>{descriptor?.options.title}</Text>
              </h1>
              <div>{descriptor?.render()}</div>
            </main>
          );
        })}
      </NavigationContent>
    );
  };

  const TestScreenA = (): any => <Text>Test screen A</Text>;

  const TestScreenB = (): any => <Text>Test screen B</Text>;

  const root = await render(
    <BaseNavigationContainer>
      <TestNavigator
        screenOptions={({ route }: any) => ({
          title: `${route.name}: ${route.params.author || route.params.fruit}`,
        })}
      >
        <Screen
          name="foo"
          component={TestScreenA}
          initialParams={{ author: 'Jane' }}
        />
        <Screen
          name="bar"
          component={TestScreenB}
          initialParams={{ fruit: 'Apple' }}
        />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  expect(root).toMatchInlineSnapshot(`
<>
  <main>
    <h1>
      <Text>
        foo: Jane
      </Text>
    </h1>
    <div>
      <Text>
        Test screen A
      </Text>
    </div>
  </main>
  <main>
    <h1>
      <Text>
        bar: Apple
      </Text>
    </h1>
    <div>
      <Text>
        Test screen B
      </Text>
    </div>
  </main>
</>
`);
});

test('sets initial options with setOptions', async () => {
  const TestNavigator = (props: any) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder<
      NavigationState,
      any,
      {},
      {
        title?: string;
        color?: string;
      },
      any
    >(MockRouter, props);
    const route = state.routes[state.index];
    const descriptor = route == null ? undefined : descriptors[route.key];

    return (
      <NavigationContent>
        <main>
          <h1 color={descriptor?.options.color}>
            <Text>{descriptor?.options.title}</Text>
          </h1>
          <div>{descriptor?.render()}</div>
        </main>
      </NavigationContent>
    );
  };

  const TestScreen = ({ navigation }: any): any => {
    React.useEffect(() => {
      navigation.setOptions({
        title: 'Hello world',
      });
    });

    return <Text>Test screen</Text>;
  };

  const root = await render(
    <BaseNavigationContainer>
      <TestNavigator>
        <Screen name="foo" options={{ color: 'blue' }}>
          {(props) => <TestScreen {...props} />}
        </Screen>
        <Screen name="bar" component={React.Fragment} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  expect(root).toMatchInlineSnapshot(`
<main>
  <h1
    color="blue"
  >
    <Text>
      Hello world
    </Text>
  </h1>
  <div>
    <Text>
      Test screen
    </Text>
  </div>
</main>
`);
});

test('updates options with setOptions', async () => {
  const TestNavigator = (props: any) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder<
      NavigationState,
      any,
      any,
      any,
      any
    >(MockRouter, props);
    const route = state.routes[state.index];
    const descriptor = route == null ? undefined : descriptors[route.key];

    return (
      <NavigationContent>
        <main>
          <h1 color={descriptor?.options.color}>
            <Text>{descriptor?.options.title}</Text>
          </h1>
          <p>
            <Text>{descriptor?.options.description}</Text>
          </p>
          <caption>
            <Text>{descriptor?.options.author}</Text>
          </caption>
          <div>{descriptor?.render()}</div>
        </main>
      </NavigationContent>
    );
  };

  const TestScreen = ({ navigation }: any): any => {
    React.useEffect(() => {
      navigation.setOptions({
        title: 'Hello world',
        description: 'Something here',
      });

      const timer = setTimeout(() =>
        navigation.setOptions({
          title: 'Hello again',
          author: 'Jane',
        })
      );

      return () => clearTimeout(timer);
    });

    return <Text>Test screen</Text>;
  };

  const element = (
    <BaseNavigationContainer>
      <TestNavigator>
        <Screen name="foo" options={{ color: 'blue' }}>
          {(props) => <TestScreen {...props} />}
        </Screen>
        <Screen name="bar" component={React.Fragment} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  const root = await render(element);

  await act(() => jest.runAllTimers());

  expect(root).toMatchInlineSnapshot(`
<main>
  <h1
    color="blue"
  >
    <Text>
      Hello again
    </Text>
  </h1>
  <p>
    <Text>
      Something here
    </Text>
  </p>
  <caption>
    <Text>
      Jane
    </Text>
  </caption>
  <div>
    <Text>
      Test screen
    </Text>
  </div>
</main>
`);
});

test('renders layout defined for the screen', async () => {
  const TestNavigator = (props: any) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder<
      NavigationState,
      any,
      any,
      any,
      any
    >(MockRouter, props);
    const route = state.routes[state.index];
    const descriptor = route == null ? undefined : descriptors[route.key];

    return <NavigationContent>{descriptor?.render()}</NavigationContent>;
  };

  const TestScreen = () => {
    return <Text>Test screen</Text>;
  };

  const element = (
    <BaseNavigationContainer>
      <TestNavigator
        screenLayout={({ children }: any) => <main>{children}</main>}
      >
        <Group screenLayout={({ children }) => <section>{children}</section>}>
          <Screen
            name="foo"
            component={TestScreen}
            layout={({ children }) => <div>{children}</div>}
          />
          <Screen name="bar" component={React.Fragment} />
        </Group>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  const root = await render(element);

  expect(root).toMatchInlineSnapshot(`
<div>
  <Text>
    Test screen
  </Text>
</div>
`);
});

test('renders layout defined for the group', async () => {
  const TestNavigator = (props: any) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder<
      NavigationState,
      any,
      any,
      any,
      any
    >(MockRouter, props);
    const route = state.routes[state.index];
    const descriptor = route == null ? undefined : descriptors[route.key];

    return <NavigationContent>{descriptor?.render()}</NavigationContent>;
  };

  const TestScreen = () => {
    return <Text>Test screen</Text>;
  };

  const element = (
    <BaseNavigationContainer>
      <TestNavigator
        screenLayout={({ children }: any) => <main>{children}</main>}
      >
        <Group screenLayout={({ children }) => <section>{children}</section>}>
          <Screen name="foo" component={TestScreen} />
          <Screen name="bar" component={React.Fragment} />
        </Group>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  const root = await render(element);

  expect(root).toMatchInlineSnapshot(`
<section>
  <Text>
    Test screen
  </Text>
</section>
`);
});

test('renders layout defined for the navigator', async () => {
  const TestNavigator = (props: any) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder<
      NavigationState,
      any,
      any,
      any,
      any
    >(MockRouter, props);
    const route = state.routes[state.index];
    const descriptor = route == null ? undefined : descriptors[route.key];

    return <NavigationContent>{descriptor?.render()}</NavigationContent>;
  };

  const TestScreen = () => {
    return <Text>Test screen</Text>;
  };

  const element = (
    <BaseNavigationContainer>
      <TestNavigator
        screenLayout={({ children }: any) => <main>{children}</main>}
      >
        <Screen name="foo" component={TestScreen} />
        <Screen name="bar" component={React.Fragment} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  const root = await render(element);

  expect(root).toMatchInlineSnapshot(`
<main>
  <Text>
    Test screen
  </Text>
</main>
`);
});

test("returns correct value for canGoBack when it's not overridden", async () => {
  const TestNavigator = (props: any) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder<
      NavigationState,
      any,
      {},
      { title?: string },
      any
    >(MockRouter, props);
    const route = state.routes[state.index];
    const descriptor = route == null ? undefined : descriptors[route.key];

    return (
      <NavigationContent>
        <main>
          <h1>
            <Text>{descriptor?.options.title}</Text>
          </h1>
          <div>{descriptor?.render()}</div>
        </main>
      </NavigationContent>
    );
  };

  let result = true;

  const TestScreen = ({ navigation }: any): any => {
    React.useEffect(() => {
      result = navigation.canGoBack();
    });

    return null;
  };

  const root = (
    <BaseNavigationContainer>
      <TestNavigator>
        <Screen
          name="foo"
          component={TestScreen}
          options={{ title: 'Hello world' }}
        />
        <Screen name="bar" component={React.Fragment} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await render(root);

  expect(result).toBe(false);
});

test(`returns false for canGoBack when current router doesn't handle GO_BACK`, async () => {
  function TestRouter(options: DefaultRouterOptions) {
    const CurrentMockRouter = MockRouter(options);
    const ChildRouter: Router<NavigationState, MockActions> = {
      ...CurrentMockRouter,

      getStateForAction(state, action, options) {
        if (action.type === 'GO_BACK') {
          return null;
        }

        return CurrentMockRouter.getStateForAction(state, action, options);
      },
    };
    return ChildRouter;
  }

  const TestNavigator = (props: any) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder<
      NavigationState,
      any,
      any,
      any,
      any
    >(TestRouter, props);

    const route = state.routes[state.index];

    if (route == null) {
      return null;
    }

    return (
      <NavigationContent>{descriptors[route.key]?.render()}</NavigationContent>
    );
  };

  let result = false;

  const TestScreen = ({ navigation }: any): any => {
    React.useEffect(() => {
      result = navigation.canGoBack();
    });

    return null;
  };

  const root = (
    <BaseNavigationContainer>
      <TestNavigator>
        <Screen name="baz" component={TestScreen} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await render(root);

  expect(result).toBe(false);
});

test('returns true for canGoBack when current router handles GO_BACK', async () => {
  function ParentRouter(options: DefaultRouterOptions) {
    const CurrentMockRouter = MockRouter(options);
    const ChildRouter: Router<NavigationState, MockActions> = {
      ...CurrentMockRouter,

      getStateForAction(state, action, options) {
        if (action.type === 'GO_BACK') {
          return state;
        }

        return CurrentMockRouter.getStateForAction(state, action, options);
      },
    };
    return ChildRouter;
  }

  const ParentNavigator = (props: any) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder<
      NavigationState,
      any,
      {},
      { title?: string },
      any
    >(ParentRouter, props);
    const route = state.routes[state.index];

    if (route == null) {
      return null;
    }

    return (
      <NavigationContent>{descriptors[route.key]?.render()}</NavigationContent>
    );
  };

  const ChildNavigator = (props: any) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder<
      NavigationState,
      any,
      {},
      { title?: string },
      any
    >(MockRouter, props);

    const route = state.routes[state.index];

    if (route == null) {
      return null;
    }

    return (
      <NavigationContent>{descriptors[route.key]?.render()}</NavigationContent>
    );
  };

  let result = false;

  const TestScreen = ({ navigation }: any): any => {
    React.useEffect(() => {
      result = navigation.canGoBack();
    });

    return null;
  };

  const root = (
    <BaseNavigationContainer>
      <ParentNavigator>
        <Screen name="baz">
          {() => (
            <ChildNavigator>
              <Screen name="qux" component={TestScreen} />
            </ChildNavigator>
          )}
        </Screen>
      </ParentNavigator>
    </BaseNavigationContainer>
  );

  await render(root);

  expect(result).toBe(true);
});

test('returns true for canGoBack when parent router handles GO_BACK', async () => {
  function OverrodeRouter(options: DefaultRouterOptions) {
    const CurrentMockRouter = MockRouter(options);
    const ChildRouter: Router<NavigationState, MockActions> = {
      ...CurrentMockRouter,

      getStateForAction(state, action, options) {
        if (action.type === 'GO_BACK') {
          return state;
        }

        return CurrentMockRouter.getStateForAction(state, action, options);
      },
    };
    return ChildRouter;
  }

  const OverrodeNavigator = (props: any) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder<
      NavigationState,
      any,
      {},
      { title?: string },
      any
    >(OverrodeRouter, props);
    const route = state.routes[state.index];

    if (route == null) {
      return null;
    }

    return (
      <NavigationContent>{descriptors[route.key]?.render()}</NavigationContent>
    );
  };

  const TestNavigator = (props: any) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder<
      NavigationState,
      any,
      {},
      { title?: string },
      any
    >(MockRouter, props);

    const route = state.routes[state.index];

    if (route == null) {
      return null;
    }

    return (
      <NavigationContent>{descriptors[route.key]?.render()}</NavigationContent>
    );
  };

  let result = true;

  const TestScreen = ({ navigation }: any): any => {
    React.useEffect(() => {
      result = navigation.canGoBack();
    });

    return null;
  };

  const root = (
    <BaseNavigationContainer>
      <TestNavigator>
        <Screen name="foo">
          {() => (
            <TestNavigator>
              <Screen name="bar" component={TestScreen} />
            </TestNavigator>
          )}
        </Screen>
        <Screen name="baz">
          {() => (
            <OverrodeNavigator>
              <Screen name="qux">{() => null}</Screen>
            </OverrodeNavigator>
          )}
        </Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  await render(root);

  expect(result).toBe(false);
});
