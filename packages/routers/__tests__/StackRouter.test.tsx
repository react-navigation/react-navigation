import { CommonActions } from '@react-navigation/core';
import { StackRouter } from '../src';

jest.mock('shortid', () => () => 'test');

it('handles navigate action', () => {
  const router = StackRouter({});

  expect(
    router.getStateForAction(
      {
        stale: false,
        key: 'root',
        index: 1,
        routeNames: ['baz', 'bar', 'qux'],
        routes: [{ key: 'baz', name: 'baz' }, { key: 'bar', name: 'bar' }],
      },
      CommonActions.navigate('qux', { answer: 42 })
    )
  ).toEqual({
    stale: false,
    key: 'root',
    index: 2,
    routeNames: ['baz', 'bar', 'qux'],
    routes: [
      { key: 'baz', name: 'baz' },
      { key: 'bar', name: 'bar' },
      {
        key: 'qux-test',
        name: 'qux',
        params: {
          answer: 42,
        },
      },
    ],
  });
});

it('handles go back action', () => {
  const router = StackRouter({});

  expect(
    router.getStateForAction(
      {
        stale: false,
        key: 'root',
        index: 1,
        routeNames: ['baz', 'bar', 'qux'],
        routes: [{ key: 'baz', name: 'baz' }, { key: 'bar', name: 'bar' }],
      },
      { type: 'GO_BACK' }
    )
  ).toEqual({
    stale: false,
    key: 'root',
    index: 0,
    routeNames: ['baz', 'bar', 'qux'],
    routes: [{ key: 'baz', name: 'baz' }],
  });
});

it('handles pop action', () => {
  const router = StackRouter({});

  expect(
    router.getStateForAction(
      {
        stale: false,
        key: 'root',
        index: 2,
        routeNames: ['baz', 'bar', 'qux'],
        routes: [
          { key: 'baz', name: 'baz' },
          { key: 'bar', name: 'bar' },
          { key: 'qux', name: 'qux' },
        ],
      },
      { type: 'POP', payload: { count: 2 } }
    )
  ).toEqual({
    stale: false,
    key: 'root',
    index: 0,
    routeNames: ['baz', 'bar', 'qux'],
    routes: [{ key: 'baz', name: 'baz' }],
  });
});

it('handles pop to top action', () => {
  const router = StackRouter({});

  expect(
    router.getStateForAction(
      {
        stale: false,
        key: 'root',
        index: 2,
        routeNames: ['baz', 'bar', 'qux'],
        routes: [
          { key: 'baz', name: 'baz' },
          { key: 'bar', name: 'bar' },
          { key: 'qux', name: 'qux' },
        ],
      },
      { type: 'POP_TO_TOP' }
    )
  ).toEqual({
    stale: false,
    key: 'root',
    index: 0,
    routeNames: ['baz', 'bar', 'qux'],
    routes: [{ key: 'baz', name: 'baz' }],
  });
});

it('handles push action', () => {
  const router = StackRouter({});

  expect(
    router.getStateForAction(
      {
        stale: false,
        key: 'root',
        index: 2,
        routeNames: ['baz', 'bar', 'qux'],
        routes: [{ key: 'bar', name: 'bar' }],
      },
      { type: 'PUSH', payload: { name: 'baz' } }
    )
  ).toEqual({
    stale: false,
    key: 'root',
    index: 3,
    routeNames: ['baz', 'bar', 'qux'],
    routes: [{ key: 'bar', name: 'bar' }, { key: 'baz-test', name: 'baz' }],
  });
});
