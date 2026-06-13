import { expect, jest, test } from '@jest/globals';

import { throttle } from '../throttle';

jest.useFakeTimers();

test('runs the function immediately on the first call', () => {
  const fn = jest.fn();
  const throttled = throttle(fn, 100);

  throttled();

  expect(fn).toHaveBeenCalledTimes(1);
});

test('ignores calls made within the duration', () => {
  const fn = jest.fn();
  const throttled = throttle(fn, 100);

  throttled();
  throttled();
  throttled();

  expect(fn).toHaveBeenCalledTimes(1);
});

test('runs again after the duration has elapsed', () => {
  const fn = jest.fn();
  const throttled = throttle(fn, 100);

  throttled();
  jest.advanceTimersByTime(100);
  throttled();

  expect(fn).toHaveBeenCalledTimes(2);
});

test('passes the arguments through to the function', () => {
  const fn = jest.fn();
  const throttled = throttle(fn, 100);

  throttled('a', 1);

  expect(fn).toHaveBeenCalledWith('a', 1);
});
