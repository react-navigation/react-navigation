import { beforeEach, expect, test } from '@jest/globals';
import { StackRouter } from '@react-navigation/routers';
import { render } from '@testing-library/react-native';
import { act, useEffect } from 'react';

import { BaseNavigationContainer } from '../BaseNavigationContainer';
import { createNavigationContainerRef } from '../createNavigationContainerRef';
import { Screen } from '../Screen';
import { useNavigation } from '../useNavigation';
import { useNavigationBuilder } from '../useNavigationBuilder';
import { MockRouter, MockRouterKey } from './__fixtures__/MockRouter';

beforeEach(() => {
  MockRouterKey.current = 0;
});

test('gets navigation prop from context', () => {
  expect.assertions(2);

  const TestNavigator = (props: any): any => {
    const { state, descriptors } = useNavigationBuilder(MockRouter, props);

    return state.routes.map((route) => descriptors[route.key].render());
  };

  const Test = () => {
    const navigation = useNavigation();

    expect(navigation.getState()?.routeNames).toEqual(['foo']);

    useEffect(() => {
      expect(() => navigation.setOptions({})).not.toThrow();
    }, [navigation]);

    return null;
  };

  render(
    <BaseNavigationContainer>
      <TestNavigator>
        <Screen name="foo" component={Test} />
      </TestNavigator>
    </BaseNavigationContainer>
  );
});

test("gets navigation's parent from context", () => {
  expect.assertions(6);

  const TestNavigator = (props: any): any => {
    const { state, descriptors } = useNavigationBuilder(MockRouter, props);

    return state.routes.map((route) => descriptors[route.key].render());
  };

  const Test = () => {
    const navigation = useNavigation();

    expect(navigation.getState()?.routeNames).toEqual(['quo']);

    expect(navigation.getParent()?.getState()?.routeNames).toEqual(['bar']);

    expect(navigation.getParent()?.getParent()?.getState()?.routeNames).toEqual(
      ['foo']
    );

    useEffect(() => {
      expect(() => navigation.setOptions({})).not.toThrow();

      expect(() => navigation.getParent()?.setOptions({})).not.toThrow();

      expect(() =>
        navigation.getParent()?.getParent()?.setOptions({})
      ).not.toThrow();
    }, [navigation]);

    return null;
  };

  render(
    <BaseNavigationContainer>
      <TestNavigator>
        <Screen name="foo">
          {() => (
            <TestNavigator>
              <Screen name="bar">
                {() => (
                  <TestNavigator>
                    <Screen name="quo" component={Test} />
                  </TestNavigator>
                )}
              </Screen>
            </TestNavigator>
          )}
        </Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );
});

test('gets navigation from container from context', () => {
  expect.assertions(3);

  const TestNavigator = (props: any): any => {
    const { state, descriptors } = useNavigationBuilder(MockRouter, props);

    return state.routes.map((route) => descriptors[route.key].render());
  };

  const Test = () => {
    const navigation = useNavigation();

    expect(navigation.navigate).toBeDefined();
    expect(navigation.getState()).toBeUndefined();

    useEffect(() => {
      expect(() => navigation.setOptions({})).toThrow(
        'Cannot call setOptions outside a screen'
      );
    }, [navigation]);

    return null;
  };

  render(
    <BaseNavigationContainer>
      <Test />
      <TestNavigator>
        <Screen name="foo">{() => null}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );
});

test('gets navigation by route name', () => {
  expect.assertions(8);

  const TestNavigator = (props: any): any => {
    const { state, descriptors } = useNavigationBuilder(MockRouter, props);

    return state.routes.map((route) => descriptors[route.key].render());
  };

  const Test = () => {
    // @ts-expect-error - types not configured for test
    const navigationA: any = useNavigation('baz');

    expect(navigationA.getState()?.routeNames).toEqual(['baz', 'qux']);

    // @ts-expect-error - types not configured for test
    const navigationB: any = useNavigation('bar');

    expect(navigationB.getState()?.routeNames).toEqual(['bar']);

    // @ts-expect-error - types not configured for test
    const navigationC: any = useNavigation('foo');

    expect(navigationC.getState()?.routeNames).toEqual(['foo']);

    expect(() =>
      // @ts-expect-error - types not configured for test
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useNavigation('qux')
    ).toThrow(
      "Couldn't find a navigation object for 'qux' in current or any parent screens. Is your component inside the correct screen?"
    );

    expect(() =>
      // @ts-expect-error - types not configured for test
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useNavigation('non-existent')
    ).toThrow(
      "Couldn't find a navigation object for 'non-existent' in current or any parent screens. Is your component inside the correct screen?"
    );

    useEffect(() => {
      expect(() => navigationA.setOptions({})).not.toThrow();
      expect(() => navigationB.setOptions({})).not.toThrow();
      expect(() => navigationC.setOptions({})).not.toThrow();
    }, [navigationA, navigationB, navigationC]);

    return null;
  };

  render(
    <BaseNavigationContainer>
      <TestNavigator>
        <Screen name="foo">
          {() => (
            <TestNavigator>
              <Screen name="bar">
                {() => (
                  <TestNavigator>
                    <Screen name="baz" component={Test} />
                    <Screen name="qux">{() => null}</Screen>
                  </TestNavigator>
                )}
              </Screen>
            </TestNavigator>
          )}
        </Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );
});

test('gets navigation in preloaded screen', () => {
  expect.assertions(4);

  const TestNavigator = (props: any): any => {
    const { state, descriptors } = useNavigationBuilder(StackRouter, props);

    return (
      <>
        {state.routes.map((route) => descriptors[route.key].render())}
        {state.preloadedRoutes?.map((route) => descriptors[route.key].render())}
      </>
    );
  };

  const Test = () => {
    const navigationA: any = useNavigation();

    expect(navigationA.getState()?.routeNames).toEqual(['bar', 'baz']);

    // @ts-expect-error - types not configured for test
    const navigationB: any = useNavigation('baz');

    expect(navigationB.getState()?.routeNames).toEqual(['bar', 'baz']);

    // @ts-expect-error - types not configured for test
    const navigationC: any = useNavigation('foo');

    expect(navigationC.getState()?.routeNames).toEqual(['foo']);

    expect(() =>
      // @ts-expect-error - types not configured for test
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useNavigation('qux')
    ).toThrow(
      "Couldn't find a navigation object for 'qux' in current or any parent screens. Is your component inside the correct screen?"
    );

    return null;
  };

  const ref = createNavigationContainerRef();

  render(
    <BaseNavigationContainer ref={ref}>
      <TestNavigator>
        <Screen name="foo">
          {() => (
            <TestNavigator>
              <Screen name="bar">{() => null}</Screen>
              <Screen name="baz" component={Test} />
            </TestNavigator>
          )}
        </Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  act(() => {
    // @ts-expect-error - types not configured for test
    ref.preload('baz');
  });
});

test('throws if called outside a navigation context', () => {
  expect.assertions(1);

  const Test = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    expect(() => useNavigation()).toThrow(
      "Couldn't find a navigation object. Is your component inside NavigationContainer?"
    );

    return null;
  };

  render(<Test />);
});
