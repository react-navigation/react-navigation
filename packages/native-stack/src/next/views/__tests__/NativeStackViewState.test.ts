import { expect, test } from '@jest/globals';
import type { Route } from '@react-navigation/native';

import {
  createNativeStackViewState,
  nativeStackViewReducer,
  type NativeStackViewState,
} from '../NativeStackViewState';

const createRoute = (name: string): Route<string> => ({
  key: name,
  name,
});

const A = createRoute('A');
const B = createRoute('B');
const C = createRoute('C');
const D = createRoute('D');

const descriptors = {
  A: 'descriptor-A',
  B: 'descriptor-B',
  C: 'descriptor-C',
  D: 'descriptor-D',
};

const createState = () =>
  createNativeStackViewState({
    index: 2,
    routes: [A, B, C],
    descriptors,
  });

const syncState = (
  state: NativeStackViewState<string>,
  routes: Route<string>[],
  nextDescriptors: Record<string, string> = descriptors
) =>
  nativeStackViewReducer(state, {
    type: 'SYNC_STATE',
    index: routes.length - 1,
    routes,
    descriptors: nextDescriptors,
  });

const getRouteKeys = (state: NativeStackViewState<string>) =>
  state.renderedRoutes.map((route) => route.key);

const getPoppedRouteKeys = (state: NativeStackViewState<string>) =>
  state.popped.map((popped) => popped.route.key);

test('preserves route order across consecutive pops', () => {
  let state = syncState(createState(), [A, B]);

  state = syncState(state, [A]);

  expect(getRouteKeys(state)).toEqual(['A', 'B', 'C']);
  expect(getPoppedRouteKeys(state)).toEqual(['B', 'C']);
});

test('retains all routes removed by pop-to-top in their original order', () => {
  let state = syncState(createState(), [A]);

  expect(getRouteKeys(state)).toEqual(['A', 'B', 'C']);
  expect(getPoppedRouteKeys(state)).toEqual(['B', 'C']);

  state = nativeStackViewReducer(state, {
    type: 'REMOVE_POPPED_ROUTE',
    key: 'C',
  });

  expect(getRouteKeys(state)).toEqual(['A', 'B']);
  expect(getPoppedRouteKeys(state)).toEqual(['B']);
});

test('keeps a removed route above its replacement while it closes', () => {
  const state = syncState(createState(), [A, B, D]);

  expect(getRouteKeys(state)).toEqual(['A', 'B', 'D', 'C']);
  expect(getPoppedRouteKeys(state)).toEqual(['C']);
});

test('stops retaining a route when its key returns to navigation state', () => {
  let state = syncState(createState(), [A, B]);

  state = syncState(state, [A, B, C]);

  expect(getRouteKeys(state)).toEqual(['A', 'B', 'C']);
  expect(getPoppedRouteKeys(state)).toEqual([]);
});

test('does not retain routes that were dismissed natively', () => {
  let state = nativeStackViewReducer(createState(), {
    type: 'ADD_NATIVELY_DISMISSED_ROUTES',
    keys: ['C'],
  });

  state = syncState(state, [A, B]);

  expect(getRouteKeys(state)).toEqual(['A', 'B']);
  expect(getPoppedRouteKeys(state)).toEqual([]);
  expect(state.nativelyDismissedRouteKeys).toEqual([]);
});

test('does not retain detached routes removed from navigation state', () => {
  const initialState = createNativeStackViewState({
    index: 1,
    routes: [A, B, C],
    descriptors,
  });

  const state = syncState(initialState, [A, B]);

  expect(getRouteKeys(state)).toEqual(['A', 'B']);
  expect(getPoppedRouteKeys(state)).toEqual([]);
});

test('retains the previous descriptor until a popped route is dismissed', () => {
  const state = syncState(createState(), [A, B], {
    A: descriptors.A,
    B: descriptors.B,
  });

  expect(state.popped[0]?.descriptor).toBe('descriptor-C');

  const dismissedState = nativeStackViewReducer(state, {
    type: 'REMOVE_POPPED_ROUTE',
    key: 'C',
  });

  expect(getRouteKeys(dismissedState)).toEqual(['A', 'B']);
  expect(getPoppedRouteKeys(dismissedState)).toEqual([]);
});
