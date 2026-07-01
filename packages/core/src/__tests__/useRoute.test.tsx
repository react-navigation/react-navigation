import { beforeEach, expect, test } from '@jest/globals';
import { render } from '@testing-library/react-native';

import { BaseNavigationContainer } from '../BaseNavigationContainer';
import { Screen } from '../Screen';
import { useNavigationBuilder } from '../useNavigationBuilder';
import { useRoute } from '../useRoute';
import { MockRouter, MockRouterKey } from './__fixtures__/MockRouter';

beforeEach(() => {
  MockRouterKey.current = 0;
});

test('gets route prop from context', async () => {
  expect.assertions(2);

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
    expect(useRoute().params).toEqual({ x: 1 });

    expect(useRoute<{ foo: { x: number } }, 'foo'>('foo').params?.x).toBe(1);

    return null;
  };

  await render(
    <BaseNavigationContainer>
      <TestNavigator>
        <Screen name="foo" component={Test} initialParams={{ x: 1 }} />
      </TestNavigator>
    </BaseNavigationContainer>
  );
});

test('throws if route is not available', async () => {
  expect.assertions(1);

  const Test = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    expect(() => useRoute()).toThrow(
      "Couldn't find a route object. Is your component inside a screen in a navigator?"
    );

    return null;
  };

  await render(<Test />);
});

test('throws if not used in a screen', async () => {
  expect.assertions(1);

  const Test = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    expect(() => useRoute<{ test: { x: number } }, 'test'>('test')).toThrow(
      "Couldn't find a parent screen. Is your component inside a screen in a navigator?"
    );

    return null;
  };

  await render(<Test />);
});

test("throws if provided route name doesn't match current route name", async () => {
  expect.assertions(1);

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
    // eslint-disable-next-line react-hooks/rules-of-hooks
    expect(() => useRoute<{ test: { x: number } }, 'test'>('test')).toThrow(
      "Couldn't find a route named 'test' in any of the parent screens. Is your component inside the correct screen?"
    );

    return null;
  };

  await render(
    <BaseNavigationContainer>
      <TestNavigator>
        <Screen name="foo" component={Test} initialParams={{ x: 1 }} />
      </TestNavigator>
    </BaseNavigationContainer>
  );
});

test('returns route for the current route when name matches', async () => {
  expect.assertions(2);

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
    const route = useRoute<{ foo: { x: number } }, 'foo'>('foo');

    expect(route.name).toBe('foo');
    expect(route.params?.x).toBe(1);

    return null;
  };

  await render(
    <BaseNavigationContainer>
      <TestNavigator>
        <Screen name="foo" component={Test} initialParams={{ x: 1 }} />
      </TestNavigator>
    </BaseNavigationContainer>
  );
});

test('returns route for parent screen when nested', async () => {
  expect.assertions(3);

  const ParentNavigator = (props: any): any => {
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

  const ChildNavigator = (props: any): any => {
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
    const parentRoute = useRoute<{ parent: { y: number } }, 'parent'>('parent');
    const childRoute = useRoute<{ child: { z: string } }, 'child'>('child');

    expect(parentRoute.name).toBe('parent');
    expect(parentRoute.params?.y).toBe(2);
    expect(childRoute.name).toBe('child');

    return null;
  };

  const ChildScreen = () => (
    <ChildNavigator>
      <Screen name="child" component={Test} initialParams={{ z: 'test' }} />
    </ChildNavigator>
  );

  await render(
    <BaseNavigationContainer>
      <ParentNavigator>
        <Screen
          name="parent"
          component={ChildScreen}
          initialParams={{ y: 2 }}
        />
      </ParentNavigator>
    </BaseNavigationContainer>
  );
});

test('throws error for non-existent route name', async () => {
  expect.assertions(1);

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
    expect(() =>
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useRoute<{ nonexistent: {} }, 'nonexistent'>('nonexistent')
    ).toThrow(
      "Couldn't find a route named 'nonexistent' in any of the parent screens. Is your component inside the correct screen?"
    );

    return null;
  };

  await render(
    <BaseNavigationContainer>
      <TestNavigator>
        <Screen name="foo" component={Test} />
      </TestNavigator>
    </BaseNavigationContainer>
  );
});

test('throws error on accessing a child route from the parent', async () => {
  expect.assertions(1);

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
    expect(() =>
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useRoute<{ foo: {} }, 'foo'>('foo')
    ).toThrow(
      "Couldn't find a parent screen. Is your component inside a screen in a navigator?"
    );

    return (
      <TestNavigator>
        <Screen name="foo">{() => null}</Screen>
      </TestNavigator>
    );
  };

  await render(
    <BaseNavigationContainer>
      <Test />
    </BaseNavigationContainer>
  );
});

test('throws error on accessing a sibling route', async () => {
  expect.assertions(1);

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
    expect(() =>
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useRoute<{ bar: {} }, 'bar'>('bar')
    ).toThrow(
      "Couldn't find a route named 'bar' in any of the parent screens. Is your component inside the correct screen?"
    );

    return null;
  };

  await render(
    <BaseNavigationContainer>
      <TestNavigator>
        <Screen name="foo" component={Test} />
        <Screen name="bar">{() => null}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );
});
