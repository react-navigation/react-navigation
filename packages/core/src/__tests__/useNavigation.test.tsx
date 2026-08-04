import { afterEach, beforeEach, expect, jest, test } from '@jest/globals';
import {
  CommonActions,
  type ParamListBase,
  StackRouter,
} from '@react-navigation/routers';
import { render } from '@testing-library/react-native';
import { act, useEffect } from 'react';

import { BaseNavigationContainer } from '../BaseNavigationContainer';
import { createNavigationContainerRef } from '../createNavigationContainerRef';
import { Screen } from '../Screen';
import type { GenericNavigation } from '../types';
import { useNavigation } from '../useNavigation';
import { useNavigationBuilder } from '../useNavigationBuilder';
import { MockRouter, MockRouterKey } from './__fixtures__/MockRouter';

beforeEach(() => {
  MockRouterKey.current = 0;
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('gets navigation prop from context', async () => {
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
    const navigation = useNavigation();

    expect(navigation.getState()?.routeNames).toEqual(['foo']);

    useEffect(() => {
      expect(() => navigation.setOptions({})).not.toThrow();
    }, [navigation]);

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

test("gets navigation's parent from context", async () => {
  expect.assertions(6);

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

  await render(
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

test('gets navigation from container from context', async () => {
  expect.assertions(7);

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
    const navigation = useNavigation();

    expect(navigation.navigate).toBeDefined();
    expect(navigation.getState()).toBeUndefined();

    useEffect(() => {
      expect(navigation.isFocused()).toBe(true);

      expect(() => navigation.setParams({})).toThrow(
        'Cannot call setParams outside a screen'
      );
      expect(() => navigation.replaceParams({})).toThrow(
        'Cannot call replaceParams outside a screen'
      );
      expect(() => navigation.pushParams({})).toThrow(
        'Cannot call pushParams outside a screen'
      );
      expect(() => navigation.setOptions({})).toThrow(
        'Cannot call setOptions outside a screen'
      );
    }, [navigation]);

    return null;
  };

  await render(
    <BaseNavigationContainer>
      <Test />
      <TestNavigator>
        <Screen name="foo">{() => null}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );
});

test('dispatches to the root navigator by default and preserves explicit targets', async () => {
  const ref = createNavigationContainerRef();

  const onStateChange = jest.fn();
  const onAction = jest.fn();

  let dispatch: GenericNavigation<ParamListBase>['dispatch'];

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
    const navigation = useNavigation();

    useEffect(() => {
      dispatch = navigation.dispatch;
    }, [navigation]);

    return null;
  };

  await render(
    <BaseNavigationContainer ref={ref} onStateChange={onStateChange}>
      <Test />
      <TestNavigator>
        <Screen name="root">
          {() => (
            <TestNavigator>
              <Screen name="first">{() => null}</Screen>
              <Screen name="second">{() => null}</Screen>
            </TestNavigator>
          )}
        </Screen>
        <Screen name="second">{() => null}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  ref.addListener('__unsafe_action__', onAction);

  const target = ref.getRootState().routes[0]!.state!.key;

  act(() => {
    dispatch(() => ({
      ...CommonActions.navigate('second'),
      target,
    }));
  });

  expect(onAction).toHaveBeenLastCalledWith(
    expect.objectContaining({
      data: expect.objectContaining({
        action: expect.objectContaining({ target }),
      }),
    })
  );
  expect(onStateChange).toHaveBeenLastCalledWith(
    expect.objectContaining({
      index: 0,
      routes: [
        expect.objectContaining({
          state: expect.objectContaining({ index: 1 }),
        }),
        expect.anything(),
      ],
    })
  );

  act(() => {
    dispatch(() => CommonActions.navigate('second'));
  });

  expect(onAction).toHaveBeenLastCalledWith(
    expect.objectContaining({
      data: expect.objectContaining({
        action: expect.not.objectContaining({ target: expect.anything() }),
      }),
    })
  );
  expect(onStateChange).toHaveBeenLastCalledWith(
    expect.objectContaining({ index: 1 })
  );
});

test('warns when an action is not handled by the root navigator', async () => {
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

  let navigation: GenericNavigation<ParamListBase>;

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
    navigation = useNavigation();

    return null;
  };

  await render(
    <BaseNavigationContainer>
      <Test />
      <TestNavigator>
        <Screen name="root">
          {() => (
            <TestNavigator>
              <Screen name="nested">{() => null}</Screen>
            </TestNavigator>
          )}
        </Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  // The screen only exists in a child navigator, so the root navigator can't handle it
  act(() => {
    navigation.navigate('nested');
  });

  expect(spy).toHaveBeenCalledWith(
    expect.stringContaining(
      'The action \'NAVIGATE\' with payload {"name":"nested"} was not handled by any navigator.'
    )
  );
});

test('emits state events from the root navigator', async () => {
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
    const navigation = useNavigation();

    useEffect(() => {
      const unsubscribe = navigation.addListener('state', (event) => {
        expect(event.data.state.routes[event.data.state.index]?.name).toBe(
          'second'
        );
      });

      navigation.dispatch(CommonActions.navigate('second'));

      return unsubscribe;
    }, [navigation]);

    return null;
  };

  await render(
    <BaseNavigationContainer>
      <Test />
      <TestNavigator>
        <Screen name="first">{() => null}</Screen>
        <Screen name="second">{() => null}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );
});

test('gets navigation by route name', async () => {
  expect.assertions(8);

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

  await render(
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

test('gets navigation in preloaded screen', async () => {
  expect.assertions(4);

  const TestNavigator = (props: any): any => {
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

  await render(
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

  await act(() => {
    // @ts-expect-error - types not configured for test
    ref.preload('baz');
  });
});

test('throws if called outside a navigation context', async () => {
  expect.assertions(1);

  const Test = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    expect(() => useNavigation()).toThrow(
      "Couldn't find a navigation object. Is your component inside NavigationContainer?"
    );

    return null;
  };

  await render(<Test />);
});
