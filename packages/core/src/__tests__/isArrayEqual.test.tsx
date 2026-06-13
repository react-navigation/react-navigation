import { expect, test } from '@jest/globals';

import { isArrayEqual } from '../isArrayEqual';

test('returns true for the same reference', () => {
  const array = [1, 2, 3];

  expect(isArrayEqual(array, array)).toBe(true);
});

test('returns true for equal values in the same order', () => {
  expect(isArrayEqual([1, 'a', true], [1, 'a', true])).toBe(true);
});

test('returns false when lengths differ', () => {
  expect(isArrayEqual([1, 2], [1, 2, 3])).toBe(false);
});

test('returns false when the order differs', () => {
  expect(isArrayEqual([1, 2], [2, 1])).toBe(false);
});

test('treats NaN values as equal', () => {
  expect(isArrayEqual([NaN], [NaN])).toBe(true);
});
