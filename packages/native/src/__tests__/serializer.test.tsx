import { expect, test } from '@jest/globals';
import type { NavigationState } from '@react-navigation/core';

import { parse, stringify } from '../serializer';

test('omits undefined fields created by navigators', () => {
  const state: NavigationState = {
    stale: false,
    type: 'stack',
    key: 'stack',
    index: 0,
    routeNames: ['Home'],
    history: [{ key: 'home', params: undefined, type: 'route' }],
    routes: [
      {
        key: 'home',
        name: 'Home',
        params: undefined,
        path: undefined,
        history: [{ params: undefined, type: 'params' }],
        state: undefined,
      },
    ],
  };

  expect(stringify(state, undefined)).toBe(JSON.stringify(state));
});

test('uses linking config for current and historical params', () => {
  const date = new Date('2026-08-04T00:00:00.000Z');
  const parseDate = Object.assign(
    () => {
      throw new Error('Schema should not be called as a function.');
    },
    {
      '~standard': {
        version: 1 satisfies 1,
        vendor: 'test',
        validate: (value: unknown) => ({ value: new Date(String(value)) }),
      },
    }
  );
  const config = {
    screens: {
      Home: {
        parse: { date: parseDate },
        stringify: { date: (value: Date) => value.toISOString() },
      },
    },
  };
  const state: NavigationState = {
    stale: false,
    type: 'stack',
    key: 'stack',
    index: 0,
    routeNames: ['Home'],
    history: [{ key: 'home', params: { date }, type: 'route' }],
    routes: [
      {
        key: 'home',
        name: 'Home',
        params: {
          date,
        },
      },
    ],
  };
  const serialized = stringify(state, config);

  expect(JSON.parse(serialized ?? '')).toMatchObject({
    history: [{ params: { date: date.toISOString() } }],
    routes: [{ params: { date: date.toISOString() } }],
  });
  expect(parse(serialized, config)).toMatchObject({
    history: [{ params: { date } }],
    routes: [{ params: { date } }],
  });
});

test.each([
  ['undefined', { value: undefined }, undefined],
  ['negative zero', { value: -0 }, undefined],
  ['NaN', { value: NaN }, undefined],
  ['infinity', { value: Infinity }, undefined],
  ['date', { value: new Date('2026-08-04T00:00:00.000Z') }, undefined],
  ['map', { value: new Map([['key', 'value']]) }, undefined],
  ['null prototype', { value: Object.create(null) }, undefined],
  ['toJSON', { value: { toJSON: () => 'serialized' } }, undefined],
  [
    'hidden property',
    Object.defineProperty({ value: 'value' }, 'hidden', { value: 'hidden' }),
    { screens: { Home: { stringify: { value: String } } } },
  ],
])('rejects %s because JSON changes it', (_name, params, config) => {
  const state: NavigationState = {
    stale: false,
    type: 'stack',
    key: 'stack',
    index: 0,
    routeNames: ['Home'],
    routes: [
      {
        key: 'home',
        name: 'Home',
        params,
      },
    ],
  };

  expect(() => stringify(state, config)).toThrow(
    'Non-serializable value in navigation state.'
  );
  expect(() => stringify(state, config, () => 'custom')).toThrow(
    'Non-serializable value in navigation state.'
  );
});
