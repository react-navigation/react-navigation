import { beforeEach, expect, test } from '@jest/globals';

import { BaseRouter } from '../BaseRouter';
import * as CommonActions from '../CommonActions';

let count = 0;

const uid = () => String(++count);

beforeEach(() => {
  count = 0;
});

const STATE = {
  stale: false as const,
  type: 'test',
  key: 'root',
  index: 1,
  routes: [
    { key: 'foo', name: 'foo' },
    { key: 'bar', name: 'bar', params: { fruit: 'orange' } },
    { key: 'baz', name: 'baz', params: { sort: 'latest' } },
  ],
  routeNames: ['foo', 'bar', 'baz', 'qux'],
};

test('sets params for the focused screen with SET_PARAMS', () => {
  const result = BaseRouter.getStateForAction(
    STATE,
    CommonActions.setParams({ answer: 42 }),
    { uid }
  );

  expect(result).toEqual({
    stale: false,
    type: 'test',
    key: 'root',
    index: 1,
    routes: [
      { key: 'foo', name: 'foo' },
      { key: 'bar', name: 'bar', params: { answer: 42, fruit: 'orange' } },
      { key: 'baz', name: 'baz', params: { sort: 'latest' } },
    ],
    routeNames: ['foo', 'bar', 'baz', 'qux'],
  });
});

test('merges params for the source screen with SET_PARAMS', () => {
  const result = BaseRouter.getStateForAction(
    STATE,
    {
      ...CommonActions.setParams({ user: 'jane' }),
      source: 'baz',
    },
    { uid }
  );

  expect(result).toEqual({
    stale: false,
    type: 'test',
    key: 'root',
    index: 1,
    routes: [
      { key: 'foo', name: 'foo' },
      { key: 'bar', name: 'bar', params: { fruit: 'orange' } },
      { key: 'baz', name: 'baz', params: { sort: 'latest', user: 'jane' } },
    ],
    routeNames: ['foo', 'bar', 'baz', 'qux'],
  });
});

test('sets params for the source screen with SET_PARAMS', () => {
  const result = BaseRouter.getStateForAction(
    STATE,
    {
      ...CommonActions.setParams({ user: 'jane' }),
      source: 'foo',
    },
    { uid }
  );

  expect(result).toEqual({
    stale: false,
    type: 'test',
    key: 'root',
    index: 1,
    routes: [
      { key: 'foo', name: 'foo', params: { user: 'jane' } },
      { key: 'bar', name: 'bar', params: { fruit: 'orange' } },
      { key: 'baz', name: 'baz', params: { sort: 'latest' } },
    ],
    routeNames: ['foo', 'bar', 'baz', 'qux'],
  });
});

test("doesn't handle SET_PARAMS if source key isn't present", () => {
  const result = BaseRouter.getStateForAction(
    STATE,
    {
      ...CommonActions.setParams({ answer: 42 }),
      source: 'magic',
    },
    { uid }
  );

  expect(result).toBeNull();
});

test('replaces params for the focused screen with REPLACE_PARAMS', () => {
  const result = BaseRouter.getStateForAction(
    STATE,
    CommonActions.replaceParams({ answer: 42 }),
    { uid }
  );

  expect(result).toEqual({
    stale: false,
    type: 'test',
    key: 'root',
    index: 1,
    routes: [
      { key: 'foo', name: 'foo' },
      { key: 'bar', name: 'bar', params: { answer: 42 } },
      { key: 'baz', name: 'baz', params: { sort: 'latest' } },
    ],
    routeNames: ['foo', 'bar', 'baz', 'qux'],
  });
});

test('adds params for the source screen with REPLACE_PARAMS', () => {
  const result = BaseRouter.getStateForAction(
    STATE,
    {
      ...CommonActions.replaceParams({ user: 'jane' }),
      source: 'foo',
    },
    { uid }
  );

  expect(result).toEqual({
    stale: false,
    type: 'test',
    key: 'root',
    index: 1,
    routes: [
      { key: 'foo', name: 'foo', params: { user: 'jane' } },
      { key: 'bar', name: 'bar', params: { fruit: 'orange' } },
      { key: 'baz', name: 'baz', params: { sort: 'latest' } },
    ],
    routeNames: ['foo', 'bar', 'baz', 'qux'],
  });
});

test('replaces params for the source screen with REPLACE_PARAMS', () => {
  const result = BaseRouter.getStateForAction(
    STATE,
    {
      ...CommonActions.replaceParams({ user: 'jane' }),
      source: 'baz',
    },
    { uid }
  );

  expect(result).toEqual({
    stale: false,
    type: 'test',
    key: 'root',
    index: 1,
    routes: [
      { key: 'foo', name: 'foo' },
      { key: 'bar', name: 'bar', params: { fruit: 'orange' } },
      { key: 'baz', name: 'baz', params: { user: 'jane' } },
    ],
    routeNames: ['foo', 'bar', 'baz', 'qux'],
  });
});

test("doesn't handle REPLACE_PARAMS if source key isn't present", () => {
  const result = BaseRouter.getStateForAction(
    STATE,
    {
      ...CommonActions.replaceParams({ answer: 42 }),
      source: 'magic',
    },
    { uid }
  );

  expect(result).toBeNull();
});

test('pushes new params for the focused screen with PUSH_PARAMS', () => {
  const result = BaseRouter.getStateForAction(
    STATE,
    CommonActions.pushParams({ answer: 42 }),
    { uid }
  );

  expect(result).toEqual({
    stale: false,
    type: 'test',
    key: 'root',
    index: 1,
    routes: [
      { key: 'foo', name: 'foo' },
      {
        key: 'bar',
        name: 'bar',
        params: { answer: 42 },
        history: [{ type: 'params', params: { fruit: 'orange' } }],
      },
      { key: 'baz', name: 'baz', params: { sort: 'latest' } },
    ],
    routeNames: ['foo', 'bar', 'baz', 'qux'],
  });
});

test('pushes new params for the source screen with PUSH_PARAMS', () => {
  const result = BaseRouter.getStateForAction(
    STATE,
    {
      ...CommonActions.pushParams({ user: 'jane' }),
      source: 'baz',
    },
    { uid }
  );

  expect(result).toEqual({
    stale: false,
    type: 'test',
    key: 'root',
    index: 1,
    routes: [
      { key: 'foo', name: 'foo' },
      { key: 'bar', name: 'bar', params: { fruit: 'orange' } },
      {
        key: 'baz',
        name: 'baz',
        params: { user: 'jane' },
        history: [{ type: 'params', params: { sort: 'latest' } }],
      },
    ],
    routeNames: ['foo', 'bar', 'baz', 'qux'],
  });
});

test('pushes new params for route with no existing params with PUSH_PARAMS', () => {
  const result = BaseRouter.getStateForAction(
    STATE,
    {
      ...CommonActions.pushParams({ user: 'jane' }),
      source: 'foo',
    },
    { uid }
  );

  expect(result).toEqual({
    stale: false,
    type: 'test',
    key: 'root',
    index: 1,
    routes: [
      {
        key: 'foo',
        name: 'foo',
        params: { user: 'jane' },
        history: [{ type: 'params', params: undefined }],
      },
      { key: 'bar', name: 'bar', params: { fruit: 'orange' } },
      { key: 'baz', name: 'baz', params: { sort: 'latest' } },
    ],
    routeNames: ['foo', 'bar', 'baz', 'qux'],
  });
});

test('pushes new params with existing history with PUSH_PARAMS', () => {
  const stateWithHistory = {
    ...STATE,
    routes: [
      { key: 'foo', name: 'foo' },
      {
        key: 'bar',
        name: 'bar',
        params: { fruit: 'apple' },
        history: [{ type: 'params' as const, params: { fruit: 'orange' } }],
      },
      { key: 'baz', name: 'baz', params: { sort: 'latest' } },
    ],
  };

  const result = BaseRouter.getStateForAction(
    stateWithHistory,
    CommonActions.pushParams({ fruit: 'banana' }),
    { uid }
  );

  expect(result).toEqual({
    stale: false,
    type: 'test',
    key: 'root',
    index: 1,
    routes: [
      { key: 'foo', name: 'foo' },
      {
        key: 'bar',
        name: 'bar',
        params: { fruit: 'banana' },
        history: [
          { type: 'params', params: { fruit: 'orange' } },
          { type: 'params', params: { fruit: 'apple' } },
        ],
      },
      { key: 'baz', name: 'baz', params: { sort: 'latest' } },
    ],
    routeNames: ['foo', 'bar', 'baz', 'qux'],
  });
});

test("doesn't handle PUSH_PARAMS if source key isn't present", () => {
  const result = BaseRouter.getStateForAction(
    STATE,
    {
      ...CommonActions.pushParams({ answer: 42 }),
      source: 'magic',
    },
    { uid }
  );

  expect(result).toBeNull();
});

test('resets state to new state with RESET', () => {
  const routes = [
    { key: 'foo', name: 'foo' },
    { key: 'bar', name: 'bar', params: { fruit: 'orange' } },
    { key: 'baz', name: 'baz' },
    { key: 'qux-1', name: 'qux' },
  ];

  const result = BaseRouter.getStateForAction(
    STATE,
    CommonActions.reset({
      index: 0,
      routes,
    }),
    { uid }
  );

  expect(result).toEqual({ index: 0, routes });
});

test('adds keys to routes missing keys during RESET', () => {
  const result = BaseRouter.getStateForAction(
    STATE,
    CommonActions.reset({
      ...STATE,
      routes: [...STATE.routes, { name: 'qux' }],
    }),
    { uid }
  );

  expect(result).toEqual({
    ...STATE,
    routes: [...STATE.routes, { key: 'qux-1', name: 'qux' }],
  });
});

test("doesn't handle RESET if routes don't match routeNames", () => {
  const routes = [
    { key: 'bar', name: 'bar', params: { fruit: 'orange' } },
    { key: 'baz', name: 'baz' },
    { key: 'qux', name: 'quz' },
  ];

  const result = BaseRouter.getStateForAction(
    STATE,
    CommonActions.reset({
      index: 0,
      routes,
    }),
    { uid }
  );

  expect(result).toBeNull();
});

test("doesn't handle RESET if routeNames don't match", () => {
  const result = BaseRouter.getStateForAction(
    STATE,
    CommonActions.reset({
      ...STATE,
      routeNames: ['ten'],
    }),
    { uid }
  );

  expect(result).toBeNull();
});

test("doesn't handle RESET if a complete state has an out-of-bounds index", () => {
  expect(
    BaseRouter.getStateForAction(
      STATE,
      CommonActions.reset({
        ...STATE,
        index: 99,
        routes: [{ key: 'foo', name: 'foo' }],
      }),
      { uid }
    )
  ).toBeNull();

  expect(
    BaseRouter.getStateForAction(
      STATE,
      CommonActions.reset({
        ...STATE,
        index: -1,
      }),
      { uid }
    )
  ).toBeNull();
});

test("doesn't handle RESET if there are no routes", () => {
  const result = BaseRouter.getStateForAction(
    STATE,
    CommonActions.reset({
      index: 0,
      routes: [],
    }),
    { uid }
  );

  expect(result).toBeNull();
});
