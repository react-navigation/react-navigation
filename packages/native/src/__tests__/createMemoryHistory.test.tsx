import type { NavigationState } from '@react-navigation/core';

import { createMemoryHistory } from '../../src/useLinking';
import window from '../__mocks__/window';

// @ts-expect-error: practically window is same as global, so we can ignore the error
global.window = window;

// eslint-disable-next-line import/extensions
jest.mock('../useLinking', () => require('../useLinking.tsx'));

it('will not attempt to navigate beyond whatever browser history it is possible to know about', () => {
  jest.useFakeTimers();
  const windowGoSpy = jest.spyOn(window.history, 'go');

  // Given a new memory history
  const history = createMemoryHistory();

  // And a window history that is initialized in an empty state (i.e. a single null item)
  expect(window.history.length).toBe(1);

  // Expect our memory history to have a length property and for it to be 0 because we haven't added any thing to it yet
  expect(history.length).toBe(0);

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

  // When we add a path and state value then our index value will be zero and it will have a length
  history.replace({ path: '/route-one', state: mockStateOne });
  expect(history.index).toBe(0);
  expect(history.length).toBe(1);

  // When we try to call history.go() with a negative value and there is nowhere to navigate to
  // Then window.history.go() should not be called at all
  history.go(-1);
  jest.runAllTimers();
  expect(windowGoSpy).not.toBeCalled();
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
  expect(history.length).toBe(2);
  expect(window.history.length).toBe(2);
  expect(history.index).toBe(1);

  // When we navigate back then our memory history should still have a length of 2, but our index will have updated
  history.go(-1);
  jest.runAllTimers();
  expect(history.length).toBe(2);
  expect(window.history.length).toBe(2);
  expect(windowGoSpy).toHaveBeenCalledTimes(1);
  expect(history.index).toBe(0);

  // When we navigate forward once then we should only see our index change
  history.go(1);
  jest.runAllTimers();
  expect(history.length).toBe(2);
  expect(window.history.length).toBe(2);
  expect(windowGoSpy).toHaveBeenCalledTimes(2);
  expect(history.index).toBe(1);

  // If we try to go very far outside of the current bounds of memory history then we
  // will find ourselves in the same place.
  history.go(10);
  jest.runAllTimers();
  expect(history.length).toBe(2);
  expect(window.history.length).toBe(2);
  expect(windowGoSpy).toHaveBeenCalledTimes(2);
  expect(history.index).toBe(1);

  // Navigate back to the first index
  history.go(-1);
  jest.runAllTimers();
  expect(history.index).toBe(0);
  expect(history.length).toBe(2);
  expect(windowGoSpy).toHaveBeenCalledTimes(3);

  const item = history.get(0);
  expect(window.history.state).toEqual({ id: item.id });

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
  expect(history.length).toBe(2);

  const replacedItem = history.get(0);
  expect(item.path).toBe('/route-one');
  expect(replacedItem.path).toBe('/route-three');
  expect(item.id).toEqual(replacedItem.id);
  expect(window.history.state).toEqual({ id: replacedItem.id });

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
  expect(history.length).toBe(2);
  expect(window.history.length).toBe(2);
  expect(history.get(0).path).toBe('/route-three');
  const newItem = history.get(1);
  expect(window.history.state).toEqual({ id: newItem.id });
});
