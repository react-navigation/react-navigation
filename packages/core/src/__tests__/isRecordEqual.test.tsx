import { expect, test } from '@jest/globals';

import { isRecordEqual } from '../isRecordEqual';

test('returns true for the same reference', () => {
  const record = { a: 1 };

  expect(isRecordEqual(record, record)).toBe(true);
});

test('returns true for equal keys and values regardless of order', () => {
  expect(isRecordEqual({ a: 1, b: 2 }, { b: 2, a: 1 })).toBe(true);
});

test('returns false when the number of keys differs', () => {
  expect(isRecordEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
});

test('returns false when keys differ', () => {
  expect(isRecordEqual({ a: 1 }, { b: 1 })).toBe(false);
});

test('returns false when a value differs', () => {
  expect(isRecordEqual({ a: 1 }, { a: 2 })).toBe(false);
});

test('treats NaN values as equal', () => {
  expect(isRecordEqual({ a: NaN }, { a: NaN })).toBe(true);
});
