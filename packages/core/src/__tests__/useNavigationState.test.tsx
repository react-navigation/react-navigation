import { beforeEach, expect, test } from '@jest/globals';
import type { NavigationState } from '@react-navigation/routers';
import { act, render } from '@testing-library/react-native';
import * as React from 'react';

import { BaseNavigationContainer } from '../BaseNavigationContainer';
import { Screen } from '../Screen';
import { useNavigationBuilder } from '../useNavigationBuilder';
import { useNavigationState } from '../useNavigationState';
import { MockRouter, MockRouterKey } from './__fixtures__/MockRouter';

beforeEach(() => {
  MockRouterKey.current = 0;
});

test('gets the current navigation state', () => {
  const TestNavigator = (props: any): any => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      MockRouter,
      props
    );

    return (
      <NavigationContent>
        {state.routes.map((route) => descriptors[route.key].render())}
      </NavigationContent>
    );
  };

  const Test = () => {
    const index = useNavigationState((state) => state.index);
    const params = useNavigationState(
      (state) => state.routes[state.index].params
    );

    return (
      <>
        {index}
        {JSON.stringify(params)}
      </>
    );
  };

  const navigation = React.createRef<any>();

  const element = render(
    <BaseNavigationContainer ref={navigation}>
      <TestNavigator>
        <Screen name="first" component={Test} />
        <Screen name="second">{() => null}</Screen>
        <Screen name="third">{() => null}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  expect(element).toMatchInlineSnapshot(`"0"`);

  act(() => navigation.current.navigate('second'));

  expect(element).toMatchInlineSnapshot(`"1"`);

  act(() => navigation.current.navigate('third'));

  expect(element).toMatchInlineSnapshot(`"2"`);

  act(() => navigation.current.navigate('second', { answer: 42 }));

  expect(element).toMatchInlineSnapshot(`
[
  "1",
  "{"answer":42}",
]
`);
});

test('gets the current navigation state with selector', () => {
  const TestNavigator = (props: any): any => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      MockRouter,
      props
    );

    return (
      <NavigationContent>
        {state.routes.map((route) => descriptors[route.key].render())}
      </NavigationContent>
    );
  };

  const Test = () => {
    const index = useNavigationState((state) => state.index);

    return <>{index}</>;
  };

  const navigation = React.createRef<any>();

  const root = render(
    <BaseNavigationContainer ref={navigation}>
      <TestNavigator>
        <Screen name="first" component={Test} />
        <Screen name="second">{() => null}</Screen>
        <Screen name="third">{() => null}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  expect(root).toMatchInlineSnapshot(`"0"`);

  act(() => navigation.current.navigate('second'));

  expect(root).toMatchInlineSnapshot(`"1"`);

  act(() => navigation.current.navigate('third'));

  expect(root).toMatchInlineSnapshot(`"2"`);

  act(() => navigation.current.navigate('second'));

  expect(root).toMatchInlineSnapshot(`"1"`);
});

test('gets the correct value if selector changes', () => {
  const TestNavigator = (props: any): any => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      MockRouter,
      props
    );

    return (
      <NavigationContent>
        {state.routes.map((route) => descriptors[route.key].render())}
      </NavigationContent>
    );
  };

  const SelectorContext = React.createContext<any>(null);

  const Test = () => {
    const selector = React.useContext(SelectorContext);
    const result = useNavigationState(selector);

    return <>{result}</>;
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

  const root = render(<App selector={(state) => state.index} />);

  expect(root).toMatchInlineSnapshot(`"0"`);

  root.update(<App selector={(state) => state.routes[state.index].name} />);

  expect(root).toMatchInlineSnapshot(`"first"`);
});

test('gets the current navigation state at navigator level', () => {
  const TestNavigator = (props: any): any => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      MockRouter,
      props
    );

    return (
      <NavigationContent>
        {state.routes.map((route) => descriptors[route.key].render())}
      </NavigationContent>
    );
  };

  const Test = () => {
    const index = useNavigationState((state) => state.index);
    const routes = useNavigationState((state) => state.routes);

    return JSON.stringify({ index, routes }, null, 2);
  };

  const navigation = React.createRef<any>();

  const root = render(
    <BaseNavigationContainer ref={navigation}>
      <TestNavigator layout={() => <Test />}>
        <Screen name="first">{() => null}</Screen>
        <Screen name="second">{() => null}</Screen>
        <Screen name="third">{() => null}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  expect(root).toMatchInlineSnapshot(`
"{
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
}"
`);

  act(() => navigation.current.navigate('second'));

  expect(root).toMatchInlineSnapshot(`
"{
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
}"
`);

  act(() => navigation.current.navigate('third'));

  expect(root).toMatchInlineSnapshot(`
"{
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
}"
`);

  act(() => navigation.current.navigate('second'));

  expect(root).toMatchInlineSnapshot(`
"{
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
}"
`);
});

test('gets navigation state for current route name', () => {
  const TestNavigator = (props: any): any => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      MockRouter,
      props
    );

    return (
      <NavigationContent>
        {state.routes.map((route) => descriptors[route.key].render())}
      </NavigationContent>
    );
  };

  const Test = () => {
    // @ts-expect-error for test purposes
    const index = useNavigationState('child', (state) => state.index);
    const routeName = useNavigationState(
      // @ts-expect-error for test purposes
      'child',
      (state: any) => state.routes[state.index].name
    );
    const params = useNavigationState(
      // @ts-expect-error for test purposes
      'child',
      (state: any) => state.routes[state.index].params
    );

    return (
      <>
        {index}
        {routeName}
        {JSON.stringify(params)}
      </>
    );
  };

  const navigation = React.createRef<any>();

  const root = render(
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
[
  "0",
  "child",
]
`);

  act(() => navigation.current.navigate('child', { answer: 42 }));

  expect(root).toMatchInlineSnapshot(`
[
  "0",
  "child",
  "{"answer":42}",
]
`);

  act(() => navigation.current.navigate('second'));

  expect(root).toMatchInlineSnapshot(`
[
  "1",
  "second",
]
`);
});

test('gets navigation state for parent route name', () => {
  const TestNavigator = (props: any): any => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      MockRouter,
      props
    );

    return (
      <NavigationContent>
        {state.routes.map((route) => descriptors[route.key].render())}
      </NavigationContent>
    );
  };

  const Test = () => {
    // @ts-expect-error for test purposes
    const index = useNavigationState('parent', (state) => state.index);
    const routeName = useNavigationState(
      // @ts-expect-error for test purposes
      'parent',
      (state: any) => state.routes[state.index].name
    );
    const params = useNavigationState(
      // @ts-expect-error for test purposes
      'child',
      (state: any) => state.routes[state.index].params
    );

    return (
      <>
        {index}
        {routeName}
        {JSON.stringify(params)}
      </>
    );
  };

  const navigation = React.createRef<any>();

  const root = render(
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
[
  "0",
  "parent",
]
`);

  act(() => navigation.current.navigate('parent', { answer: 42 }));

  expect(root).toMatchInlineSnapshot(`
[
  "0",
  "parent",
]
`);

  act(() => navigation.current.navigate('other'));

  expect(root).toMatchInlineSnapshot(`
[
  "1",
  "other",
]
`);
});

test('gets navigation state for grandparent route name', () => {
  const TestNavigator = (props: any): any => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      MockRouter,
      props
    );

    return (
      <NavigationContent>
        {state.routes.map((route) => descriptors[route.key].render())}
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
      (state: any) => state.routes[state.index].name
    );
    const params = useNavigationState(
      // @ts-expect-error for test purposes
      'grandparent',
      (state: any) => state.routes[state.index].params
    );

    return (
      <>
        {index}
        {routeName}
        {JSON.stringify(params)}
      </>
    );
  };

  const navigation = React.createRef<any>();

  const root = render(
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
[
  "0",
  "grandparent",
]
`);

  act(() => navigation.current.navigate('grandparent', { answer: 42 }));

  expect(root).toMatchInlineSnapshot(`
[
  "0",
  "grandparent",
  "{"answer":42}",
]
`);

  act(() => navigation.current.navigate('fourth'));

  expect(root).toMatchInlineSnapshot(`
[
  "1",
  "fourth",
]
`);
});
