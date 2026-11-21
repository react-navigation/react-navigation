import { runInNewContext } from 'node:vm';

import { expect, test } from '@jest/globals';

import { checkSerializable } from '../checkSerializable';

class CustomValue {
  value = true;
}

class CustomArray extends Array<unknown> {}

test.each([
  ['null', null],
  ['boolean', true],
  ['empty string', ''],
  ['finite number', 42],
  ['smallest positive number', Number.MIN_VALUE],
  ['largest finite number', Number.MAX_VALUE],
])('returns true for serializable %s', (_, value) => {
  expect(checkSerializable(value)).toEqual({ serializable: true });
});

test('returns true for serializable object', () => {
  expect(
    checkSerializable({
      index: 0,
      key: '7',
      routeNames: ['foo', 'bar'],
      routes: [
        {
          key: 'foo',
          name: 'foo',
          state: {
            index: 0,
            key: '8',
            routeNames: ['qux', 'lex'],
            routes: [
              { key: 'qux', name: 'qux' },
              { key: 'lex', name: 'lex' },
            ],
          },
        },
      ],
    })
  ).toEqual({ serializable: true });
});

test('returns true when an object has an optional undefined property', () => {
  expect(checkSerializable({ optional: undefined })).toEqual({
    serializable: true,
  });
});

test('returns true for plain values from another realm', () => {
  const object: unknown = runInNewContext('({ nested: { value: 1 } })');
  const array: unknown = runInNewContext('[1, { value: 2 }]');

  expect(checkSerializable(object)).toEqual({ serializable: true });
  expect(checkSerializable(array)).toEqual({ serializable: true });
});

test('returns true for an object with a null prototype', () => {
  const object = Object.assign(Object.create(null), { value: 1 });

  expect(checkSerializable(object)).toEqual({ serializable: true });
});

test('returns true for a non-enumerable array item', () => {
  const array: unknown[] = [];

  Object.defineProperty(array, 0, { value: 'value' });

  expect(checkSerializable(array)).toEqual({ serializable: true });
});

test.each([
  ['negative zero', -0, 'Negative zero'],
  ['NaN', NaN, 'NaN'],
  ['positive infinity', Infinity, 'Infinity'],
  ['negative infinity', -Infinity, '-Infinity'],
])('returns false for lossy number %s', (_, value, reason) => {
  expect(checkSerializable(value)).toEqual({
    serializable: false,
    location: [],
    reason,
  });
});

test.each([
  ['undefined', undefined, 'Undefined'],
  ['BigInt', 1n, 'BigInt'],
  ['function', () => 42, 'Function'],
  ['symbol', Symbol('test'), 'Symbol(test)'],
])('returns false for unsupported %s value', (_, value, reason) => {
  expect(checkSerializable(value)).toEqual({
    serializable: false,
    location: [],
    reason,
  });
});

test.each([
  ['built-in object', new Date(0), 'Date'],
  ['class instance', new CustomValue(), 'Object with a custom prototype'],
  ['array subclass', new CustomArray(), 'Array subclass'],
  [
    'object with a custom prototype',
    Object.create({ inherited: true }),
    'Object with a custom prototype',
  ],
])('returns false for unsupported %s', (_, value, reason) => {
  expect(checkSerializable(value)).toEqual({
    serializable: false,
    location: [],
    reason,
  });
});

test('returns false when an array loses information', () => {
  const arrayWithProperty = Object.assign([1], { extra: true });
  const arrayWithSymbol = Object.assign([1], { [Symbol('extra')]: true });
  const sparseArray = new Array<unknown>(3);
  const sparseArrayWithProperty = Object.assign(new Array<unknown>(2), {
    extra: true,
  });

  sparseArray[0] = 1;
  sparseArray[2] = 3;
  sparseArrayWithProperty[0] = 1;

  expect(checkSerializable(arrayWithProperty)).toEqual({
    serializable: false,
    location: ['extra'],
    reason: 'Extra array property',
  });

  expect(checkSerializable(arrayWithSymbol)).toEqual({
    serializable: false,
    location: ['Symbol(extra)'],
    reason: 'Extra array property',
  });

  expect(checkSerializable({ routes: [{ params: sparseArray }] })).toEqual({
    serializable: false,
    location: ['routes', 0, 'params', 1],
    reason: 'Sparse array',
  });

  expect(checkSerializable(sparseArrayWithProperty)).toEqual({
    serializable: false,
    location: [1],
    reason: 'Sparse array',
  });

  expect(checkSerializable([undefined])).toEqual({
    serializable: false,
    location: [0],
    reason: 'Undefined',
  });
});

test('returns false for object properties that JSON ignores', () => {
  const symbol = Symbol('test');
  const objectWithSymbol = { visible: true, [symbol]: true };
  const objectWithHiddenProperty = { visible: true };

  Object.defineProperty(objectWithHiddenProperty, 'hidden', { value: true });

  expect(checkSerializable(objectWithSymbol)).toEqual({
    serializable: false,
    location: ['Symbol(test)'],
    reason: 'Symbol key',
  });

  expect(checkSerializable(objectWithHiddenProperty)).toEqual({
    serializable: false,
    location: ['hidden'],
    reason: 'Non-enumerable property',
  });
});

test.each([
  ['function', () => 42, 'Function'],
  ['symbol', Symbol('test'), 'Symbol(test)'],
])(
  'returns the nested location of a non-serializable %s',
  (_, value, reason) => {
    expect(checkSerializable({ routes: [{ params: { value } }] })).toEqual({
      serializable: false,
      location: ['routes', 0, 'params', 'value'],
      reason,
    });
  }
);

test('returns false for circular references', () => {
  const value: unknown[] = [];

  value.push({ parent: value });

  expect(checkSerializable(value)).toEqual({
    serializable: false,
    location: [0, 'parent'],
    reason: 'Circular reference',
  });
});

test("doesn't fail if same object used multiple times", () => {
  const o = { foo: 'bar' };

  expect(checkSerializable({ first: o, second: o })).toEqual({
    serializable: true,
  });
});

test('skips params with a custom stringify in the linking config', () => {
  const state = {
    routes: [{ name: 'foo', params: { date: new Date(0) } }],
  };

  expect(checkSerializable(state)).toEqual({
    serializable: false,
    location: ['routes', 0, 'params', 'date'],
    reason: 'Date',
  });

  expect(
    checkSerializable(state, {
      screens: {
        foo: { stringify: { date: (value: Date) => value.toISOString() } },
      },
    })
  ).toEqual({ serializable: true });
});

test('skips nested values inside params with a custom stringify', () => {
  expect(
    checkSerializable(
      {
        routes: [{ name: 'foo', params: { filter: { compare: () => 0 } } }],
      },
      {
        screens: {
          foo: { stringify: { filter: (value: object) => String(value) } },
        },
      }
    )
  ).toEqual({ serializable: true });
});

test('reports params without a custom stringify in the linking config', () => {
  const config = {
    screens: {
      foo: { stringify: { date: (value: Date) => value.toISOString() } },
    },
  };

  expect(
    checkSerializable(
      {
        routes: [
          { name: 'foo', params: { date: new Date(0), callback: () => 42 } },
        ],
      },
      config
    )
  ).toEqual({
    serializable: false,
    location: ['routes', 0, 'params', 'callback'],
    reason: 'Function',
  });

  expect(
    checkSerializable(
      {
        routes: [{ name: 'bar', params: { date: new Date(0) } }],
      },
      config
    )
  ).toEqual({
    serializable: false,
    location: ['routes', 0, 'params', 'date'],
    reason: 'Date',
  });
});

test("doesn't skip params when the screen config is a path string", () => {
  expect(
    checkSerializable(
      {
        routes: [{ name: 'foo', params: { date: new Date(0) } }],
      },
      { screens: { foo: 'foo/:date' } }
    )
  ).toEqual({
    serializable: false,
    location: ['routes', 0, 'params', 'date'],
    reason: 'Date',
  });
});

test('skips params with a custom stringify in a nested navigator state', () => {
  expect(
    checkSerializable(
      {
        routes: [
          {
            name: 'foo',
            state: {
              routes: [{ name: 'bar', params: { date: new Date(0) } }],
            },
          },
        ],
      },
      {
        screens: {
          foo: {
            screens: {
              bar: {
                stringify: { date: (value: Date) => value.toISOString() },
              },
            },
          },
        },
      }
    )
  ).toEqual({ serializable: true });
});

test('skips params with a custom stringify for a nested screen in params', () => {
  const config = {
    screens: {
      foo: {
        screens: {
          bar: { stringify: { date: (value: Date) => value.toISOString() } },
        },
      },
    },
  };

  expect(
    checkSerializable(
      {
        routes: [
          {
            name: 'foo',
            params: { screen: 'bar', params: { date: new Date(0) } },
          },
        ],
      },
      config
    )
  ).toEqual({ serializable: true });

  expect(
    checkSerializable(
      {
        routes: [
          {
            name: 'foo',
            params: {
              state: {
                routes: [{ name: 'bar', params: { date: new Date(0) } }],
              },
            },
          },
        ],
      },
      config
    )
  ).toEqual({ serializable: true });
});
