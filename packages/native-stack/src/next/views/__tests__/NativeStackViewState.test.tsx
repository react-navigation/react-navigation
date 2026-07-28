import { expect, test } from '@jest/globals';
import type {
  ParamListBase,
  Route,
  StackNavigationState,
} from '@react-navigation/native';
import { render } from '@testing-library/react-native';

import type {
  NativeStackDescriptorMap,
  NativeStackNavigationProp,
} from '../../../types';
import {
  type NativeStackViewState,
  reducer,
  useViewState,
} from '../NativeStackViewState';

const createRoute = (name: string): Route<string> => ({
  key: name,
  name,
});

const A = createRoute('A');
const B = createRoute('B');
const C = createRoute('C');
const D = createRoute('D');
const E = createRoute('E');

function getParent(): NativeStackNavigationProp<ParamListBase> {
  return navigation;
}

const navigation = {
  addListener: () => () => {},
  canGoBack: () => false,
  dispatch: () => {},
  getParent,
  getState: () => ({
    stale: false,
    type: 'stack',
    key: 'stack',
    index: 0,
    routeNames: [],
    routes: [],
    retainedRouteKeys: [],
  }),
  goBack: () => {},
  isFocused: () => true,
  navigate: () => {},
  pop: () => {},
  popTo: () => {},
  popToTop: () => {},
  preload: () => {},
  push: () => {},
  pushParams: () => {},
  removeListener: () => {},
  replace: () => {},
  replaceParams: () => {},
  reset: () => {},
  retain: () => {},
  setOptions: () => {},
  setParams: () => {},
} satisfies NativeStackNavigationProp<ParamListBase>;

const descriptors = {
  A: {
    navigation,
    options: {},
    render: () => <></>,
    route: A,
  },
  B: {
    navigation,
    options: {},
    render: () => <></>,
    route: B,
  },
  C: {
    navigation,
    options: {},
    render: () => <></>,
    route: C,
  },
  D: {
    navigation,
    options: {},
    render: () => <></>,
    route: D,
  },
  E: {
    navigation,
    options: {},
    render: () => <></>,
    route: E,
  },
} satisfies NativeStackDescriptorMap;

function createState(): NativeStackViewState {
  const routes = [A, B, C];

  return {
    previous: { index: 2, routes, descriptors },
    renderedRoutes: routes,
    poppedByKey: new Map(),
    nativelyDismissedRouteKeys: new Set(),
  };
}

const syncState = (
  state: NativeStackViewState,
  routes: Route<string>[],
  nextDescriptors: NativeStackDescriptorMap = descriptors
) =>
  reducer(state, {
    type: 'SYNC_STATE',
    index: routes.length - 1,
    routes,
    descriptors: nextDescriptors,
  });

const getRouteKeys = (state: NativeStackViewState) =>
  state.renderedRoutes.map((route) => route.key);

const getPoppedRouteKeys = (state: NativeStackViewState) =>
  state.renderedRoutes
    .filter((route) => state.poppedByKey.has(route.key))
    .map((route) => route.key);

const createNavigationState = (
  routes: Route<string>[]
): StackNavigationState<ParamListBase> => ({
  stale: false,
  type: 'stack',
  key: 'stack',
  index: routes.length - 1,
  routeNames: routes.map((route) => route.name),
  routes,
  retainedRouteKeys: [],
});

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

  state = reducer(state, {
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
  expect(state.poppedByKey.get('C')?.focusedReplacementKey).toBe('D');
});

test('recognizes a preloaded route as the replacement', () => {
  const routes = [A, B, C, D];
  const state = syncState(
    {
      previous: { index: 2, routes, descriptors },
      renderedRoutes: routes,
      poppedByKey: new Map(),
      nativelyDismissedRouteKeys: new Set(),
    },
    [A, B, D]
  );

  expect(getRouteKeys(state)).toEqual(['A', 'B', 'C', 'D']);
  expect(state.poppedByKey.get('C')?.focusedReplacementKey).toBe('D');
});

test('does not retarget a pending replacement after a later push', () => {
  let state = syncState(createState(), [A, B, D]);

  state = syncState(state, [A, B, D, E]);

  expect(getRouteKeys(state)).toEqual(['A', 'B', 'D', 'E', 'C']);
  expect(state.poppedByKey.get('C')?.focusedReplacementKey).toBe('D');
});

test('tracks consecutive replacements independently', () => {
  let state = syncState(createState(), [A, B, D]);

  state = syncState(state, [A, B, E]);

  expect(getRouteKeys(state)).toEqual(['A', 'B', 'E', 'D', 'C']);
  expect(state.poppedByKey.get('C')?.focusedReplacementKey).toBe('D');
  expect(state.poppedByKey.get('D')?.focusedReplacementKey).toBe('E');
});

test('keeps a removed middle route above its replacement while it closes', () => {
  const state = syncState(createState(), [A, D, C]);

  expect(getRouteKeys(state)).toEqual(['A', 'D', 'B', 'C']);
  expect(getPoppedRouteKeys(state)).toEqual(['B']);
  expect(state.poppedByKey.get('B')?.focusedReplacementKey).toBeUndefined();
});

test('rejects reordering retained routes', () => {
  expect(() => syncState(createState(), [C, A])).toThrow(
    'Changing the order of active routes is not supported in native stack.'
  );
});

test('allows a preloaded route to move into the active stack', () => {
  const routes = [A, B, C];
  const state = reducer(
    {
      previous: { index: 0, routes, descriptors },
      renderedRoutes: routes,
      poppedByKey: new Map(),
      nativelyDismissedRouteKeys: new Set(),
    },
    {
      type: 'SYNC_STATE',
      index: 1,
      routes: [A, C, B],
      descriptors,
    }
  );

  expect(getRouteKeys(state)).toEqual(['A', 'C', 'B']);
  expect(getPoppedRouteKeys(state)).toEqual([]);
});

test('keeps removed routes above a root replacement while they close', () => {
  const state = syncState(createState(), [D]);

  expect(getRouteKeys(state)).toEqual(['D', 'A', 'B', 'C']);
  expect(getPoppedRouteKeys(state)).toEqual(['A', 'B', 'C']);
  expect(state.poppedByKey.get('A')?.focusedReplacementKey).toBe('D');
  expect(state.poppedByKey.get('B')?.focusedReplacementKey).toBe('D');
  expect(state.poppedByKey.get('C')?.focusedReplacementKey).toBe('D');
});

test('stops retaining a route when its key returns to navigation state', () => {
  let state = syncState(createState(), [A, B]);

  state = syncState(state, [A, B, C]);

  expect(getRouteKeys(state)).toEqual(['A', 'B', 'C']);
  expect(getPoppedRouteKeys(state)).toEqual([]);
});

test('does not retain routes that were dismissed natively', () => {
  let state = reducer(createState(), {
    type: 'ADD_NATIVELY_DISMISSED_ROUTES',
    keys: ['C'],
  });

  state = syncState(state, [A, B]);

  expect(getRouteKeys(state)).toEqual(['A', 'B']);
  expect(getPoppedRouteKeys(state)).toEqual([]);
  expect(state.nativelyDismissedRouteKeys).toEqual(new Set());
});

test('retains a natively dismissed route if it stayed in navigation state', () => {
  let state = reducer(createState(), {
    type: 'ADD_NATIVELY_DISMISSED_ROUTES',
    keys: ['C'],
  });

  // The pop action following the native dismissal didn't remove the route, e.g.
  // when a 'beforeRemove' listener prevented it.
  state = syncState(state, [A, B, C]);

  expect(state.nativelyDismissedRouteKeys).toEqual(new Set());

  state = syncState(state, [A, B]);

  expect(getRouteKeys(state)).toEqual(['A', 'B', 'C']);
  expect(getPoppedRouteKeys(state)).toEqual(['C']);
});

test('does not retain detached routes removed from navigation state', () => {
  const initialState: NativeStackViewState = {
    previous: { index: 1, routes: [A, B, C], descriptors },
    renderedRoutes: [A, B, C],
    poppedByKey: new Map(),
    nativelyDismissedRouteKeys: new Set(),
  };

  const state = syncState(initialState, [A, B]);

  expect(getRouteKeys(state)).toEqual(['A', 'B']);
  expect(getPoppedRouteKeys(state)).toEqual([]);
});

test('retains a popped route and its previous descriptor until dismissal', () => {
  const state = syncState(createState(), [A, B], {
    A: descriptors.A,
    B: descriptors.B,
  });

  expect(state.poppedByKey.get('C')).toEqual({
    descriptor: descriptors.C,
    previousDescriptor: descriptors.B,
    focusedReplacementKey: undefined,
  });

  const dismissedState = reducer(state, {
    type: 'REMOVE_POPPED_ROUTE',
    key: 'C',
  });

  expect(getRouteKeys(dismissedState)).toEqual(['A', 'B']);
  expect(getPoppedRouteKeys(dismissedState)).toEqual([]);
});

test('uses the current descriptor for the previous route', () => {
  const previousDescriptor = {
    ...descriptors.B,
    options: { title: 'Updated' },
  };
  const state = syncState(createState(), [A, B], {
    A: descriptors.A,
    B: previousDescriptor,
  });

  expect(state.poppedByKey.get('C')?.previousDescriptor).toBe(
    previousDescriptor
  );
});

test('uses the old descriptor when the previous route was also removed', () => {
  const state = syncState(createState(), [A], {
    A: descriptors.A,
  });

  expect(state.poppedByKey.get('C')?.previousDescriptor).toBe(descriptors.B);
});

test('uses the latest descriptor snapshot when a route is popped', () => {
  const descriptor = {
    ...descriptors.C,
    options: { title: 'Updated' },
  };
  const updatedDescriptors = {
    ...descriptors,
    C: descriptor,
  };
  let state = reducer(createState(), {
    type: 'SYNC_DESCRIPTORS',
    descriptors: updatedDescriptors,
  });

  state = syncState(state, [A, B]);

  expect(state.poppedByKey.get('C')?.descriptor).toBe(descriptor);
});

test('preserves native dismissal state when descriptors change', () => {
  let state = reducer(createState(), {
    type: 'ADD_NATIVELY_DISMISSED_ROUTES',
    keys: ['C'],
  });

  state = reducer(state, {
    type: 'SYNC_DESCRIPTORS',
    descriptors: { ...descriptors },
  });

  expect(state.nativelyDismissedRouteKeys).toEqual(new Set(['C']));
});

test('renders content once while synchronizing descriptor changes', async () => {
  let renderCount = 0;
  let renderedDescriptors: NativeStackDescriptorMap | undefined;

  const Content = ({
    currentDescriptors,
  }: {
    currentDescriptors: NativeStackDescriptorMap;
  }) => {
    renderCount++;
    renderedDescriptors = currentDescriptors;

    return null;
  };

  const navigationState = createNavigationState([A, B, C]);

  const TestView = ({
    currentDescriptors,
  }: {
    currentDescriptors: NativeStackDescriptorMap;
  }) => {
    const [{ previous }] = useViewState({
      state: navigationState,
      descriptors: currentDescriptors,
    });

    return <Content currentDescriptors={previous.descriptors} />;
  };

  const screen = await render(<TestView currentDescriptors={descriptors} />);

  const nextDescriptors = { ...descriptors };

  await screen.rerender(<TestView currentDescriptors={nextDescriptors} />);

  expect(renderCount).toBe(2);
  expect(renderedDescriptors).toBe(nextDescriptors);
});

test('renders content once while synchronizing a back state', async () => {
  let renderCount = 0;
  let renderedRouteKeys: string[] = [];
  let poppedDescriptor: NativeStackDescriptorMap[string] | undefined;

  const Content = ({
    renderedRoutes,
    poppedByKey,
    currentDescriptors,
  }: Pick<NativeStackViewState, 'renderedRoutes' | 'poppedByKey'> & {
    currentDescriptors: NativeStackDescriptorMap;
  }) => {
    renderCount++;

    for (const route of renderedRoutes) {
      const descriptor =
        currentDescriptors[route.key] ?? poppedByKey.get(route.key)?.descriptor;

      if (descriptor == null) {
        throw new Error(`Missing descriptor for ${route.key}`);
      }
    }

    renderedRouteKeys = renderedRoutes.map((route) => route.key);
    poppedDescriptor = poppedByKey.get('C')?.descriptor;

    return null;
  };

  const TestView = ({
    state,
    currentDescriptors,
  }: {
    state: StackNavigationState<ParamListBase>;
    currentDescriptors: NativeStackDescriptorMap;
  }) => {
    const [{ renderedRoutes, poppedByKey }] = useViewState({
      state,
      descriptors: currentDescriptors,
    });

    return (
      <Content
        renderedRoutes={renderedRoutes}
        poppedByKey={poppedByKey}
        currentDescriptors={currentDescriptors}
      />
    );
  };

  const screen = await render(
    <TestView
      state={createNavigationState([A, B, C])}
      currentDescriptors={descriptors}
    />
  );

  const nextDescriptors = {
    A: descriptors.A,
    B: descriptors.B,
  };

  await screen.rerender(
    <TestView
      state={createNavigationState([A, B])}
      currentDescriptors={nextDescriptors}
    />
  );

  expect(renderCount).toBe(2);
  expect(renderedRouteKeys).toEqual(['A', 'B', 'C']);
  expect(poppedDescriptor).toBe(descriptors.C);
});
