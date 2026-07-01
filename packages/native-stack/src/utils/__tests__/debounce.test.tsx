import { expect, jest, test } from '@jest/globals';

import { debounce } from '../debounce';

jest.useFakeTimers();

test('runs the function only after the duration has elapsed', () => {
  const fn = jest.fn();
  const debounced = debounce(fn, 100);

  debounced();

  expect(fn).not.toHaveBeenCalled();

  jest.advanceTimersByTime(100);

  expect(fn).toHaveBeenCalledTimes(1);
});

test('resets the timer when called again before the duration', () => {
  const fn = jest.fn();
  const debounced = debounce(fn, 100);

  debounced();
  jest.advanceTimersByTime(50);
  debounced();
  jest.advanceTimersByTime(50);

  expect(fn).not.toHaveBeenCalled();

  jest.advanceTimersByTime(50);

  expect(fn).toHaveBeenCalledTimes(1);
});

test('runs with the latest arguments', () => {
  const fn = jest.fn();
  const debounced = debounce(fn, 100);

  debounced('a');
  debounced('b');
  jest.advanceTimersByTime(100);

  expect(fn).toHaveBeenCalledTimes(1);
  expect(fn).toHaveBeenCalledWith('b');
});
