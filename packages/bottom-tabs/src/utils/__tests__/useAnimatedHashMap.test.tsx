import { expect, test } from '@jest/globals';
import type { NavigationState } from '@react-navigation/native';
import { render } from '@testing-library/react-native';
import { Animated } from 'react-native';

import { useAnimatedHashMap } from '../useAnimatedHashMap';

const createState = (routeKeys: string[], index = 0): NavigationState => ({
  key: 'tab-1',
  index,
  routeNames: routeKeys,
  routes: routeKeys.map((key) => ({ key, name: key })),
  type: 'tab',
  stale: false,
});

test('returns the same map when the routes are unchanged', async () => {
  const results: Record<string, Animated.Value>[] = [];

  const Test = ({ state }: { state: NavigationState }) => {
    results.push(useAnimatedHashMap(state));

    return null;
  };

  const root = await render(<Test state={createState(['a', 'b'])} />);

  await root.rerender(<Test state={createState(['a', 'b'])} />);

  expect(results[1]).toBe(results[0]);
});

test('reuses existing values for persisting routes and adds new ones', async () => {
  const results: Record<string, Animated.Value>[] = [];

  const Test = ({ state }: { state: NavigationState }) => {
    results.push(useAnimatedHashMap(state));

    return null;
  };

  const root = await render(<Test state={createState(['a', 'b'])} />);

  await root.rerender(<Test state={createState(['a', 'b', 'c'])} />);

  const [first, second] = results;

  expect(second).not.toBe(first);
  expect(second?.a).toBe(first?.a);
  expect(second?.c).toBeDefined();
});

test('rebuilds the map when a route is removed', async () => {
  const results: Record<string, Animated.Value>[] = [];

  const Test = ({ state }: { state: NavigationState }) => {
    results.push(useAnimatedHashMap(state));

    return null;
  };

  const root = await render(<Test state={createState(['a', 'b'])} />);

  await root.rerender(<Test state={createState(['a'])} />);

  const [first, second] = results;

  expect(second).not.toBe(first);
  expect(second?.b).toBeUndefined();
});
