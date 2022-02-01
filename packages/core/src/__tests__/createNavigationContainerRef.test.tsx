import type { NavigationState, ParamListBase } from '@react-navigation/routers';
import { render } from '@testing-library/react-native';
import * as React from 'react';

import BaseNavigationContainer from '../BaseNavigationContainer';
import createNavigationContainerRef from '../createNavigationContainerRef';
import Screen from '../Screen';
import useNavigationBuilder from '../useNavigationBuilder';
import MockRouter from './__fixtures__/MockRouter';

it('adds the listener even if container is mounted later', () => {
  const ref = createNavigationContainerRef<ParamListBase>();
  const listener = jest.fn();

  ref.addListener('state', listener);

  const TestNavigator = (props: any) => {
    const { state, descriptors } = useNavigationBuilder<
      NavigationState,
      any,
      {},
      { title?: string },
      any
    >(MockRouter, props);
    const { render, options } = descriptors[state.routes[state.index].key];

    return (
      <main>
        <h1>{options.title}</h1>
        <div>{render()}</div>
      </main>
    );
  };

  const element = (
    <BaseNavigationContainer ref={ref}>
      <TestNavigator>
        <Screen name="foo">{() => null}</Screen>
        <Screen name="bar">{() => null}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  render(element).update(element);

  expect(listener).toHaveBeenCalledTimes(1);
});

it('removal of non-existing listener should not break updating ref', () => {
  const ref = createNavigationContainerRef<ParamListBase>();
  ref.removeListener('state', jest.fn());
  expect(() => {
    ref.current = createNavigationContainerRef<ParamListBase>();
  }).not.toThrow();
});
