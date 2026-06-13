import { expect, test } from '@jest/globals';

import { deepFreeze, isPlainObject } from '../deepFreeze';

test('freezes a plain object', () => {
  const object = deepFreeze({ a: 1 });

  expect(Object.isFrozen(object)).toBe(true);
});

test('freezes nested objects and arrays', () => {
  const object = deepFreeze({ nested: { a: 1 }, list: [{ b: 2 }] });

  expect(Object.isFrozen(object.nested)).toBe(true);
  expect(Object.isFrozen(object.list)).toBe(true);
  expect(Object.isFrozen(object.list[0])).toBe(true);
});

test('does not freeze the contents of params', () => {
  const object = deepFreeze({
    name: 'Home',
    params: { user: { name: 'jane' } },
  });

  expect(Object.isFrozen(object)).toBe(true);
  expect(Object.isFrozen(object.params)).toBe(false);
});

test('returns primitives unchanged', () => {
  expect(deepFreeze(42)).toBe(42);
  expect(deepFreeze('text')).toBe('text');
  expect(deepFreeze(null)).toBeNull();
});

test('returns class instances without freezing them', () => {
  class Point {
    x = 1;
  }

  const point = new Point();

  expect(deepFreeze(point)).toBe(point);
  expect(Object.isFrozen(point)).toBe(false);
});

test('isPlainObject only matches plain objects', () => {
  expect(isPlainObject({})).toBe(true);
  expect(isPlainObject(Object.create(null))).toBe(false);
  expect(isPlainObject([])).toBe(false);
  expect(isPlainObject(null)).toBe(false);
  expect(isPlainObject(42)).toBe(false);
});
