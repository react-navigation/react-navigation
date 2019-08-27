import BaseRouter from '../BaseRouter';
import * as CommonActions from '../CommonActions';

jest.mock('shortid', () => () => 'test');

const STATE = {
  stale: false as false,
  key: 'root',
  index: 1,
  routes: [
    { key: 'foo', name: 'foo' },
    { key: 'bar', name: 'bar', params: { fruit: 'orange' } },
    { key: 'baz', name: 'baz' },
  ],
  routeNames: ['foo', 'bar', 'baz', 'qux'],
};

it('replaces focused screen with REPLACE', () => {
  const result = BaseRouter.getStateForAction(
    STATE,
    CommonActions.replace('qux', { answer: 42 })
  );

  expect(result).toEqual({
    stale: false,
    key: 'root',
    index: 1,
    routes: [
      { key: 'foo', name: 'foo' },
      { key: 'qux-test', name: 'qux', params: { answer: 42 } },
      { key: 'baz', name: 'baz' },
    ],
    routeNames: ['foo', 'bar', 'baz', 'qux'],
  });
});

it('replaces source screen with REPLACE', () => {
  const result = BaseRouter.getStateForAction(STATE, {
    ...CommonActions.replace('qux', { answer: 42 }),
    source: 'baz',
  });

  expect(result).toEqual({
    stale: false,
    key: 'root',
    index: 1,
    routes: [
      { key: 'foo', name: 'foo' },
      { key: 'bar', name: 'bar', params: { fruit: 'orange' } },
      { key: 'qux-test', name: 'qux', params: { answer: 42 } },
    ],
    routeNames: ['foo', 'bar', 'baz', 'qux'],
  });
});

it("doesn't handle REPLACE if source key isn't present", () => {
  const result = BaseRouter.getStateForAction(STATE, {
    ...CommonActions.replace('qux', { answer: 42 }),
    source: 'magic',
  });

  expect(result).toBe(null);
});

it('sets params for the focused screen with SET_PARAMS', () => {
  const result = BaseRouter.getStateForAction(
    STATE,
    CommonActions.setParams({ answer: 42 })
  );

  expect(result).toEqual({
    stale: false,
    key: 'root',
    index: 1,
    routes: [
      { key: 'foo', name: 'foo' },
      { key: 'bar', name: 'bar', params: { answer: 42, fruit: 'orange' } },
      { key: 'baz', name: 'baz' },
    ],
    routeNames: ['foo', 'bar', 'baz', 'qux'],
  });
});

it('sets params for the source screen with SET_PARAMS', () => {
  const result = BaseRouter.getStateForAction(STATE, {
    ...CommonActions.setParams({ answer: 42 }),
    source: 'foo',
  });

  expect(result).toEqual({
    stale: false,
    key: 'root',
    index: 1,
    routes: [
      { key: 'foo', name: 'foo', params: { answer: 42 } },
      { key: 'bar', name: 'bar', params: { fruit: 'orange' } },
      { key: 'baz', name: 'baz' },
    ],
    routeNames: ['foo', 'bar', 'baz', 'qux'],
  });
});

it("doesn't handle SET_PARAMS if source key isn't present", () => {
  const result = BaseRouter.getStateForAction(STATE, {
    ...CommonActions.setParams({ answer: 42 }),
    source: 'magic',
  });

  expect(result).toBe(null);
});

it('resets state to new state with RESET', () => {
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
    })
  );

  expect(result).toEqual({ ...STATE, index: 0, routes });
});

it('ignores key and routeNames when resetting with RESET', () => {
  const result = BaseRouter.getStateForAction(
    STATE,
    // @ts-ignore
    CommonActions.reset({ index: 2, key: 'foo', routeNames: ['test'] })
  );

  expect(result).toEqual({ ...STATE, index: 2 });
});
