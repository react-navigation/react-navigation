import BaseRouter from '../BaseRouter';
import * as CommonActions from '../CommonActions';

jest.mock('shortid', () => () => 'test');

const STATE = {
  stale: false as const,
  type: 'test',
  key: 'root',
  index: 1,
  routes: [
    { key: 'foo', name: 'foo' },
    { key: 'bar', name: 'bar', params: { fruit: 'orange' } },
    { key: 'baz', name: 'baz' },
  ],
  routeNames: ['foo', 'bar', 'baz', 'qux'],
};

it('sets params for the focused screen with SET_PARAMS', () => {
  const result = BaseRouter.getStateForAction(
    STATE,
    CommonActions.setParams({ answer: 42 })
  );

  expect(result).toEqual({
    stale: false,
    type: 'test',
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
    type: 'test',
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

  expect(result).toEqual({ index: 0, routes });
});

it("doesn't handle RESET if routes don't match routeNames", () => {
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
    })
  );

  expect(result).toEqual(null);
});

it("doesn't handle RESET if routeNames don't match", () => {
  const result = BaseRouter.getStateForAction(
    STATE,
    CommonActions.reset({
      ...STATE,
      // @ts-ignore
      routeNames: ['ten'],
    })
  );

  expect(result).toEqual(null);
});
