import { beforeEach, expect, jest, test } from '@jest/globals';
import type { NavigationState } from '@react-navigation/core';

import { createMemoryHistory } from '../createMemoryHistory';

beforeEach(() => {
  jest.useRealTimers();
});

test('finds previous entries without matching hash fragments', () => {
  const createState = (path: string): NavigationState => ({
    key: 'stack-123',
    index: 0,
    routeNames: ['One'],
    routes: [
      {
        name: 'One',
        path,
        key: 'One-23',
        params: undefined,
      },
    ],
    type: 'stack',
    stale: false,
  });

  const history = createMemoryHistory();

  history.replace({
    path: '/route-one#section',
    state: createState('/route-one'),
  });

  history.push({
    path: '/route-two',
    state: createState('/route-two'),
  });

  history.push({
    path: '/route-three',
    state: createState('/route-three'),
  });

  expect(history.backIndex({ path: '/route-one#details' })).toBe(0);
  expect(history.backIndex({ path: '/route-two#details' })).toBe(1);
});

test('keeps current hash when replacing the same path', () => {
  const createState = (path: string): NavigationState => ({
    key: 'stack-123',
    index: 0,
    routeNames: ['One'],
    routes: [
      {
        name: 'One',
        path,
        key: 'One-23',
        params: undefined,
      },
    ],
    type: 'stack',
    stale: false,
  });

  const history = createMemoryHistory();

  history.push({
    path: '/route-one#section',
    state: createState('/route-one'),
  });

  history.replace({
    path: '/route-one',
    state: createState('/route-one'),
  });

  expect(window.location.pathname).toBe('/route-one');
  expect(window.location.hash).toBe('#section');
});

test('will not attempt to navigate beyond whatever browser history it is possible to know about', () => {
  jest.useFakeTimers();
  const windowGoSpy = jest.spyOn(window.history, 'go');

  // Create a new memory history
  const history = createMemoryHistory();

  const mockStateOne: NavigationState = {
    key: 'stack-123',
    index: 0,
    routeNames: ['One', 'Two', 'Three'],
    routes: [
      {
        name: 'One',
        path: '/route-one',
        key: 'One-23',
        params: undefined,
      },
    ],
    type: 'stack',
    stale: false,
  };

  // When we add a path and state value then our index value will be zero
  history.replace({ path: '/route-one', state: mockStateOne });
  expect(history.index).toBe(0);

  // When we try to call history.go() with a negative value and there is nowhere to navigate to
  // Then window.history.go() should not be called at all
  history.go(-1);
  jest.runAllTimers();
  expect(windowGoSpy).not.toHaveBeenCalled();
  expect(history.index).toBe(0);

  // When we push another item then window history should stay synced with memory history and our index should advance
  const mockStateTwo: NavigationState = {
    key: 'stack-123',
    index: 1,
    routeNames: ['One', 'Two', 'Three'],
    routes: [
      {
        name: 'One',
        path: '/route-one',
        key: 'One-23',
        params: undefined,
      },
      {
        name: 'Two',
        path: '/route-two',
        key: 'Two-34',
        params: {},
      },
    ],
    type: 'stack',
    stale: false,
  };
  history.push({ path: '/route-two', state: mockStateTwo });
  expect(history.index).toBe(1);

  // When we navigate back our index should be updated
  history.go(-1);
  jest.runAllTimers();
  expect(windowGoSpy).toHaveBeenCalledTimes(1);
  expect(history.index).toBe(0);

  // When we navigate forward once then we should see our index change
  history.go(1);
  jest.runAllTimers();
  expect(windowGoSpy).toHaveBeenCalledTimes(2);
  expect(history.index).toBe(1);

  // If we try to go very far outside of the current bounds of memory history then we
  // will find ourselves in the same place.
  history.go(10);
  jest.runAllTimers();
  expect(windowGoSpy).toHaveBeenCalledTimes(2);
  expect(history.index).toBe(1);

  // Navigate back to the first index
  history.go(-1);
  jest.runAllTimers();
  expect(history.index).toBe(0);
  expect(windowGoSpy).toHaveBeenCalledTimes(3);

  const item = history.get(0);
  expect(window.history.state).toEqual({ id: item?.id });

  // Next replace the state and verify the item we are replacing
  // has the same id but the path has changed
  const mockStateThree: NavigationState = {
    key: 'stack-123',
    index: 0,
    routeNames: ['One', 'Two', 'Three'],
    routes: [
      {
        name: 'Three',
        path: '/route-three',
        key: 'Three-23',
        params: undefined,
      },
      {
        name: 'Two',
        path: '/route-two',
        key: 'Two-23',
        params: undefined,
      },
    ],
    type: 'stack',
    stale: false,
  };
  history.replace({ path: '/route-three', state: mockStateThree });
  expect(history.index).toBe(0);

  const replacedItem = history.get(0);
  expect(item?.path).toBe('/route-one');
  expect(replacedItem?.path).toBe('/route-three');
  expect(item?.id).toEqual(replacedItem?.id);
  expect(window.history.state).toEqual({ id: replacedItem?.id });

  // Push another item
  const mockStateFour: NavigationState = {
    key: 'stack-123',
    index: 1,
    routeNames: ['One', 'Two', 'Three'],
    routes: [
      {
        name: 'Three',
        path: '/route-three',
        key: 'Three-23',
        params: undefined,
      },
      {
        name: 'One',
        path: '/route-one',
        key: 'One-23',
        params: undefined,
      },
    ],
    type: 'stack',
    stale: false,
  };

  // Pushing a new route will remove any items after the new index
  history.push({ path: '/route-one', state: mockStateFour });
  expect(history.index).toBe(1);
  expect(history.get(0)?.path).toBe('/route-three');
  const newItem = history.get(1);
  expect(window.history.state).toEqual({ id: newItem?.id });
});

test('can go back in browser history after a previous attempt failed', async () => {
  jest.useFakeTimers();

  const state: NavigationState = {
    key: 'stack-123',
    index: 0,
    routeNames: ['One'],
    routes: [{ name: 'One', key: 'One-23' }],
    type: 'stack',
    stale: false,
  };
  const history = createMemoryHistory();

  history.replace({ path: '/route-one', state });
  history.push({ path: '/route-two', state });

  const windowGoSpy = jest
    .spyOn(window.history, 'go')
    .mockImplementation(() => {});

  const timedOutNavigation = history.go(-1);

  jest.advanceTimersByTime(100);

  await expect(timedOutNavigation).rejects.toThrow(
    'History was changed during navigation.'
  );

  windowGoSpy.mockRestore();

  const listener = jest.fn();
  const unlisten = history.listen(listener);
  const navigation = history.go(-1);

  jest.runAllTimers();

  await expect(navigation).resolves.toBeUndefined();

  expect(listener).not.toHaveBeenCalled();

  unlisten();
});
