import {
  CommonActions,
  type NavigationAction,
  type NavigationState,
  type Router,
} from '@react-navigation/routers';
import * as React from 'react';

import { NavigationStateListenerContext } from './useNavigationState';

type CanGoBackSnapshot = (source: string) => boolean;

type CanGoBackListener = {
  initialStateContext: React.Context<CanGoBackSnapshot>;
  getState: () => CanGoBackSnapshot;
  getSnapshot: () => CanGoBackSnapshot;
  subscribe: NonNullable<
    React.ContextType<typeof NavigationStateListenerContext>
  >['subscribe'];
};

type CanGoBackSource = {
  listener: CanGoBackListener;
  key: string;
};

type CanGoBackEntry = CanGoBackSource & {
  snapshot: CanGoBackSnapshot;
};

export const CanGoBackListenerContext = React.createContext<
  CanGoBackListener | undefined
>(undefined);

export const CanGoBackContext = React.createContext<
  readonly CanGoBackSource[] | undefined
>(undefined);

const select = (entries: readonly CanGoBackEntry[]) =>
  entries.some(({ snapshot, key }) => snapshot(key));

/**
 * Hook to get whether the current screen can go back.
 */
export function useCanGoBack(): boolean {
  const sources = React.use(CanGoBackContext);

  if (sources === undefined) {
    throw new Error(
      "Couldn't determine whether the screen can go back. Is your component inside a screen in a navigator?"
    );
  }

  const sourcesRef = React.useRef<readonly CanGoBackSource[]>(undefined);
  // When a source changes during render, we read the ancestors from context
  // so their state belongs to the same render as the new source.
  const initialEntries: CanGoBackEntry[] | undefined =
    sourcesRef.current !== sources ? [] : undefined;

  if (initialEntries) {
    let parentCanGoBack = false;

    for (const source of sources) {
      const snapshot: CanGoBackSnapshot = parentCanGoBack
        ? source.listener.getSnapshot()
        : React.use(source.listener.initialStateContext);

      initialEntries.push({ ...source, snapshot });
      parentCanGoBack ||= snapshot(source.key);
    }
  }

  const committedRef = React.useRef<{
    entry: readonly CanGoBackEntry[] | null;
    entries: readonly CanGoBackEntry[];
  }>({ entry: null, entries: initialEntries ?? [] });

  const [entry, dispatch] = React.useReducer(
    (previous: readonly CanGoBackEntry[], event: 'update' | 'commit') => {
      const previousEntries =
        previous === committedRef.current.entry
          ? committedRef.current.entries
          : previous;

      // All ancestors share the root store. We read them together because
      // one update can change back history in several navigators at once.
      const entries = sources.map((source) => ({
        ...source,
        snapshot:
          event === 'update'
            ? source.listener.getState()
            : source.listener.getSnapshot(),
      }));

      if (
        previousEntries.length === entries.length &&
        entries.every(
          (item, index) =>
            item.listener === previousEntries[index]?.listener &&
            item.key === previousEntries[index]?.key
        ) &&
        (entries.every(
          (item, index) => item.snapshot === previousEntries[index]?.snapshot
        ) ||
          (event === 'update' && select(entries) === select(previousEntries)))
      ) {
        return previous;
      }

      return entries;
    },
    initialEntries ?? []
  );

  const entries =
    initialEntries ??
    (entry === committedRef.current.entry
      ? sources.map((source) => ({
          ...source,
          snapshot: source.listener.getSnapshot(),
        }))
      : entry);

  React.useInsertionEffect(() => {
    sourcesRef.current = sources;
    committedRef.current = { entry, entries };
  });

  React.useLayoutEffect(() => {
    const check = (event: 'update' | 'commit') => {
      const nextCanGoBack = sources.some(({ listener, key }) =>
        (event === 'update' ? listener.getState() : listener.getSnapshot())(key)
      );

      if (select(committedRef.current.entries) !== nextCanGoBack) {
        dispatch(event);
      }
    };
    const unsubscribers = sources.map(({ listener }) =>
      listener.subscribe(check)
    );

    check('commit');

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [sources]);

  return select(entries);
}

export function CanGoBackProvider<State extends NavigationState>({
  router,
  state,
  getState,
  isSynced,
  children,
}: {
  router: Router<State, NavigationAction>;
  state: State;
  getState: () => State;
  isSynced: boolean;
  children: React.ReactNode;
}) {
  const listener = React.use(NavigationStateListenerContext);

  if (listener === undefined) {
    throw new Error("Couldn't find a navigation state listener.");
  }

  const getReader = React.useMemo(() => {
    const cache = new WeakMap<State, CanGoBackSnapshot>();

    return (state: State) => {
      let reader = cache.get(state);

      if (reader === undefined) {
        const results = new Map<string, boolean>();

        reader = (source) => {
          let result = results.get(source);

          if (result === undefined) {
            result =
              router.getStateForAction(
                state,
                { ...CommonActions.goBack(), source },
                {
                  routeNames: state.routeNames,
                  routeParamList: {},
                  routeGetIdList: {},
                }
              ) !== null;

            results.set(source, result);
          }

          return result;
        };

        cache.set(state, reader);
      }

      return reader;
    };
  }, [router]);

  const snapshot = getReader(state);
  const [InitialStateContext] = React.useState(() =>
    React.createContext(snapshot)
  );
  const snapshotRef = React.useRef(snapshot);

  React.useInsertionEffect(() => {
    snapshotRef.current = snapshot;
  }, [snapshot]);

  const nextSnapshot = isSynced ? undefined : snapshot;
  const { subscribe } = listener;
  const context = React.useMemo(
    () => ({
      initialStateContext: InitialStateContext,
      getState: () => getReader(getState()),
      getSnapshot: () => nextSnapshot ?? snapshotRef.current,
      subscribe,
    }),
    [InitialStateContext, getReader, getState, nextSnapshot, subscribe]
  );

  return (
    <CanGoBackListenerContext.Provider value={context}>
      <InitialStateContext.Provider value={snapshot}>
        {children}
      </InitialStateContext.Provider>
    </CanGoBackListenerContext.Provider>
  );
}

export function CanGoBackRouteProvider({
  routeKey,
  children,
}: {
  routeKey: string;
  children: React.ReactNode;
}) {
  const listener = React.use(CanGoBackListenerContext);
  const parents = React.use(CanGoBackContext);
  const sources = React.useMemo(
    () =>
      listener ? [...(parents ?? []), { listener, key: routeKey }] : parents,
    [listener, parents, routeKey]
  );

  return (
    <CanGoBackContext.Provider value={sources}>
      {children}
    </CanGoBackContext.Provider>
  );
}
