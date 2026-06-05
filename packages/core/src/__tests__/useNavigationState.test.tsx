import { beforeEach, expect, test } from '@jest/globals';
import type { NavigationState } from '@react-navigation/routers';
import { act, render } from '@testing-library/react-native';
import * as React from 'react';
import { Text } from 'react-native';

import { BaseNavigationContainer } from '../BaseNavigationContainer';
import { Screen } from '../Screen';
import { useNavigationBuilder } from '../useNavigationBuilder';
import { useNavigationState } from '../useNavigationState';
import { MockRouter, MockRouterKey } from './__fixtures__/MockRouter';

beforeEach(() => {
  MockRouterKey.current = 0;
});

test('gets the current navigation state', async () => {
  const TestNavigator = (props: any): any => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      MockRouter,
      props
    );

    return (
      <NavigationContent>
        {state.routes.map((route) => descriptors[route.key]?.render())}
      </NavigationContent>
    );
  };

  const Test = () => {
    const index = useNavigationState((state) => state.index);
    const params = useNavigationState(
      (state) => state.routes[state.index]?.params
    );

    return (
      <>
        <Text>{index}</Text>
        <Text>{JSON.stringify(params)}</Text>
      </>
    );
  };

  const navigation = React.createRef<any>();

  const element = await render(
    <BaseNavigationContainer ref={navigation}>
      <TestNavigator>
        <Screen name="first" component={Test} />
        <Screen name="second">{() => null}</Screen>
        <Screen name="third">{() => null}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  expect(element).toMatchInlineSnapshot(`
    <>
      <Text>
        0
      </Text>
      <Text />
    </>
  `);

  await act(() => navigation.current.navigate('second'));

  expect(element).toMatchInlineSnapshot(`
    <>
      <Text>
        1
      </Text>
      <Text />
    </>
  `);

  await act(() => navigation.current.navigate('third'));

  expect(element).toMatchInlineSnapshot(`
    <>
      <Text>
        2
      </Text>
      <Text />
    </>
  `);

  await act(() => navigation.current.navigate('second', { answer: 42 }));

  expect(element).toMatchInlineSnapshot(`
    <>
      <Text>
        1
      </Text>
      <Text>
        {"answer":42}
      </Text>
    </>
  `);
});

test('gets the current navigation state with selector', async () => {
  const TestNavigator = (props: any): any => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      MockRouter,
      props
    );

    return (
      <NavigationContent>
        {state.routes.map((route) => descriptors[route.key]?.render())}
      </NavigationContent>
    );
  };

  const Test = () => {
    const index = useNavigationState((state) => state.index);

    return <Text>{index}</Text>;
  };

  const navigation = React.createRef<any>();

  const root = await render(
    <BaseNavigationContainer ref={navigation}>
      <TestNavigator>
        <Screen name="first" component={Test} />
        <Screen name="second">{() => null}</Screen>
        <Screen name="third">{() => null}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  expect(root).toMatchInlineSnapshot(`
    <Text>
      0
    </Text>
  `);

  await act(() => navigation.current.navigate('second'));

  expect(root).toMatchInlineSnapshot(`
    <Text>
      1
    </Text>
  `);

  await act(() => navigation.current.navigate('third'));

  expect(root).toMatchInlineSnapshot(`
    <Text>
      2
    </Text>
  `);

  await act(() => navigation.current.navigate('second'));

  expect(root).toMatchInlineSnapshot(`
    <Text>
      1
    </Text>
  `);
});

test('gets the correct value if selector changes', async () => {
  const TestNavigator = (props: any): any => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      MockRouter,
      props
    );

    return (
      <NavigationContent>
        {state.routes.map((route) => descriptors[route.key]?.render())}
      </NavigationContent>
    );
  };

  const SelectorContext = React.createContext<any>(null);

  const Test = () => {
    const selector = React.use(SelectorContext);
    const result = useNavigationState(selector);

    return <Text>{String(result)}</Text>;
  };

  const App = ({ selector }: { selector: (state: NavigationState) => any }) => {
    return (
      <SelectorContext.Provider value={selector}>
        <BaseNavigationContainer>
          <TestNavigator>
            <Screen name="first" component={Test} />
            <Screen name="second">{() => null}</Screen>
            <Screen name="third">{() => null}</Screen>
          </TestNavigator>
        </BaseNavigationContainer>
      </SelectorContext.Provider>
    );
  };

  const root = await render(<App selector={(state) => state.index} />);

  expect(root).toMatchInlineSnapshot(`
    <Text>
      0
    </Text>
  `);

  await root.rerender(
    <App selector={(state) => state.routes[state.index]?.name} />
  );

  expect(root).toMatchInlineSnapshot(`
    <Text>
      first
    </Text>
  `);
});

test('gets the current navigation state at navigator level', async () => {
  const TestNavigator = (props: any): any => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      MockRouter,
      props
    );

    return (
      <NavigationContent>
        {state.routes.map((route) => descriptors[route.key]?.render())}
      </NavigationContent>
    );
  };

  const Test = () => {
    const index = useNavigationState((state) => state.index);
    const routes = useNavigationState((state) => state.routes);

    return <Text>{JSON.stringify({ index, routes }, null, 2)}</Text>;
  };

  const navigation = React.createRef<any>();

  const root = await render(
    <BaseNavigationContainer ref={navigation}>
      <TestNavigator layout={() => <Test />}>
        <Screen name="first">{() => null}</Screen>
        <Screen name="second">{() => null}</Screen>
        <Screen name="third">{() => null}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  expect(root).toMatchInlineSnapshot(`
    <Text>
      {
      "index": 0,
      "routes": [
        {
          "name": "first",
          "key": "first"
        },
        {
          "name": "second",
          "key": "second"
        },
        {
          "name": "third",
          "key": "third"
        }
      ]
    }
    </Text>
  `);

  await act(() => navigation.current.navigate('second'));

  expect(root).toMatchInlineSnapshot(`
    <Text>
      {
      "index": 1,
      "routes": [
        {
          "name": "first",
          "key": "first"
        },
        {
          "name": "second",
          "key": "second"
        },
        {
          "name": "third",
          "key": "third"
        }
      ]
    }
    </Text>
  `);

  await act(() => navigation.current.navigate('third'));

  expect(root).toMatchInlineSnapshot(`
    <Text>
      {
      "index": 2,
      "routes": [
        {
          "name": "first",
          "key": "first"
        },
        {
          "name": "second",
          "key": "second"
        },
        {
          "name": "third",
          "key": "third"
        }
      ]
    }
    </Text>
  `);

  await act(() => navigation.current.navigate('second'));

  expect(root).toMatchInlineSnapshot(`
    <Text>
      {
      "index": 1,
      "routes": [
        {
          "name": "first",
          "key": "first"
        },
        {
          "name": "second",
          "key": "second"
        },
        {
          "name": "third",
          "key": "third"
        }
      ]
    }
    </Text>
  `);
});

test('gets navigation state for current route name', async () => {
  const TestNavigator = (props: any): any => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      MockRouter,
      props
    );

    return (
      <NavigationContent>
        {state.routes.map((route) => descriptors[route.key]?.render())}
      </NavigationContent>
    );
  };

  const Test = () => {
    // @ts-expect-error for test purposes
    const index = useNavigationState('child', (state) => state.index);
    const routeName = useNavigationState(
      // @ts-expect-error for test purposes
      'child',
      (state: any) => state.routes[state.index]?.name
    );
    const params = useNavigationState(
      // @ts-expect-error for test purposes
      'child',
      (state: any) => state.routes[state.index]?.params
    );

    return (
      <>
        <Text>{String(index)}</Text>
        <Text>{String(routeName)}</Text>
        <Text>{JSON.stringify(params)}</Text>
      </>
    );
  };

  const navigation = React.createRef<any>();

  const root = await render(
    <BaseNavigationContainer ref={navigation}>
      <TestNavigator>
        <Screen name="parent">
          {() => (
            <TestNavigator>
              <Screen name="child" component={Test} />
              <Screen name="second">{() => null}</Screen>
              <Screen name="third">{() => null}</Screen>
            </TestNavigator>
          )}
        </Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  expect(root).toMatchInlineSnapshot(`
<>
  <Text>
    0
  </Text>
  <Text>
    child
  </Text>
  <Text />
</>
`);

  await act(() => navigation.current.navigate('child', { answer: 42 }));

  expect(root).toMatchInlineSnapshot(`
<>
  <Text>
    0
  </Text>
  <Text>
    child
  </Text>
  <Text>
    {"answer":42}
  </Text>
</>
`);

  await act(() => navigation.current.navigate('second'));

  expect(root).toMatchInlineSnapshot(`
<>
  <Text>
    1
  </Text>
  <Text>
    second
  </Text>
  <Text />
</>
`);
});

test('gets navigation state for parent route name', async () => {
  const TestNavigator = (props: any): any => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      MockRouter,
      props
    );

    return (
      <NavigationContent>
        {state.routes.map((route) => descriptors[route.key]?.render())}
      </NavigationContent>
    );
  };

  const Test = () => {
    // @ts-expect-error for test purposes
    const index = useNavigationState('parent', (state) => state.index);
    const routeName = useNavigationState(
      // @ts-expect-error for test purposes
      'parent',
      (state: any) => state.routes[state.index]?.name
    );
    const params = useNavigationState(
      // @ts-expect-error for test purposes
      'child',
      (state: any) => state.routes[state.index]?.params
    );

    return (
      <>
        <Text>{String(index)}</Text>
        <Text>{String(routeName)}</Text>
        <Text>{JSON.stringify(params)}</Text>
      </>
    );
  };

  const navigation = React.createRef<any>();

  const root = await render(
    <BaseNavigationContainer ref={navigation}>
      <TestNavigator>
        <Screen name="parent">
          {() => (
            <TestNavigator>
              <Screen name="child" component={Test} />
              <Screen name="second">{() => null}</Screen>
              <Screen name="third">{() => null}</Screen>
            </TestNavigator>
          )}
        </Screen>
        <Screen name="other">{() => null}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  expect(root).toMatchInlineSnapshot(`
<>
  <Text>
    0
  </Text>
  <Text>
    parent
  </Text>
  <Text />
</>
`);

  await act(() => navigation.current.navigate('parent', { answer: 42 }));

  expect(root).toMatchInlineSnapshot(`
<>
  <Text>
    0
  </Text>
  <Text>
    parent
  </Text>
  <Text />
</>
`);

  await act(() => navigation.current.navigate('other'));

  expect(root).toMatchInlineSnapshot(`
<>
  <Text>
    1
  </Text>
  <Text>
    other
  </Text>
  <Text />
</>
`);
});

test('gets navigation state for grandparent route name', async () => {
  const TestNavigator = (props: any): any => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      MockRouter,
      props
    );

    return (
      <NavigationContent>
        {state.routes.map((route) => descriptors[route.key]?.render())}
      </NavigationContent>
    );
  };

  const Test = () => {
    const index = useNavigationState(
      // @ts-expect-error for test purposes
      'grandparent',
      (state: any) => state.index
    );
    const routeName = useNavigationState(
      // @ts-expect-error for test purposes
      'grandparent',
      (state: any) => state.routes[state.index]?.name
    );
    const params = useNavigationState(
      // @ts-expect-error for test purposes
      'grandparent',
      (state: any) => state.routes[state.index]?.params
    );

    return (
      <>
        <Text>{String(index)}</Text>
        <Text>{String(routeName)}</Text>
        <Text>{JSON.stringify(params)}</Text>
      </>
    );
  };

  const navigation = React.createRef<any>();

  const root = await render(
    <BaseNavigationContainer ref={navigation}>
      <TestNavigator>
        <Screen name="grandparent">
          {() => (
            <TestNavigator>
              <Screen name="parent">
                {() => (
                  <TestNavigator>
                    <Screen name="child" component={Test} />
                    <Screen name="second">{() => null}</Screen>
                  </TestNavigator>
                )}
              </Screen>
              <Screen name="third">{() => null}</Screen>
            </TestNavigator>
          )}
        </Screen>
        <Screen name="fourth">{() => null}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  expect(root).toMatchInlineSnapshot(`
<>
  <Text>
    0
  </Text>
  <Text>
    grandparent
  </Text>
  <Text />
</>
`);

  await act(() => navigation.current.navigate('grandparent', { answer: 42 }));

  expect(root).toMatchInlineSnapshot(`
<>
  <Text>
    0
  </Text>
  <Text>
    grandparent
  </Text>
  <Text>
    {"answer":42}
  </Text>
</>
`);

  await act(() => navigation.current.navigate('fourth'));

  expect(root).toMatchInlineSnapshot(`
<>
  <Text>
    1
  </Text>
  <Text>
    fourth
  </Text>
  <Text />
</>
`);
});
