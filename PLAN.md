# Typesafe `navigation.dispatch`

Goal: `dispatch` (object and callback forms) validates actions against the
navigator's `ParamList`, the same way `navigate`, `push`, `popTo` etc. do.

## Design (as shipped)

- Action object types are generic over `ParamList` (default `ParamListBase`),
  distributing per-route actions over route names in a single mapped pass
  (`RouteActions` in `CommonActions`, ditto in `StackActionType` /
  `SwitchActionType`), with the shared `ActionPayloadParams<Params>` helper
  for required-vs-optional `params`.
- Action creators return narrowly-typed actions. `navigate`, `preload`,
  `push`, `replace`, `popTo`, `jumpTo` use two overloads (name-only →
  `params: undefined`; `(name, params)` → inferred `Params`) because a single
  generic signature can't avoid `Params | undefined` poisoning valid calls.
- `dispatch(action: Action | ((state: Readonly<State>) => Action))` where
  `Action` is a trailing defaulted type param on `NavigationHelpersCommon` /
  `NavigationPropBase` / `NavigationProp` / `NavigationHelpers`
  (default `CommonNavigationAction<ParamList>`). Navigator packages pass
  their union (e.g. `CommonNavigationAction<ParamList> |
  StackActionType<ParamList>`) into props, helpers, and type bags.
- The `PrivateValueStore` brand is untouched; composites derive each side's
  action union structurally from `dispatch` (`ActionOfNavigationProp`, via
  the callback overload's return type) and union both sides.
- Where the navigator type isn't known but is definitionally the app's root
  tree — `NavigationContainerRef` (root param list), `GenericNavigation` (bare
  `useNavigation()`) — dispatch accepts `RootNavigationAction`, derived from the
  augmented `RootNavigator` via `ActionOfNavigationProp<NavigationListForNested
  <RootNavigator>[keyof …]>` (the exact union of actions of navigators that
  actually exist in the app, custom navigators included), falling back to
  `CommonNavigationAction` when `RootNavigator` isn't augmented.
- `NavigationContainerRef<ParamList, Action>` gained a trailing defaulted
  `Action` param: root-derived when `ParamList` is the augmented `RootParamList`,
  common-only otherwise (dynamic-API refs pass `Action` explicitly).
- No-arg `getParent()` and `EventMapCore`'s `beforeRemove.action` can't use the
  root derivation — both are members of `NavigationProp`, which the derivation
  has to expand, so referencing it there is a value-level self-reference through
  the augmented `RootNavigator`. Both are typed as the wide `NavigationAction`
  (truthful — the action bubbles from anywhere in the tree; re-dispatch on a
  strict prop needs a cast).

## Done

1. `routers`: common action types generic over `ParamList`.
2. `routers`: `CommonActions` creators return narrow actions (overloads).
3. `routers`: `StackActionType`/`StackActions`, `SwitchActionType`/
   `TabActions.jumpTo`, `DrawerActionType` generic + narrow creators.
4. `core`: `Action` type param threaded; `dispatch` typed (both forms);
   composite union; brand-arity matches untouched (structural derivation).
5. Navigator packages pass their unions (props, helpers, type bags).
6. `NavigationContainerRef` / `GenericNavigation` dispatch derived from the
   augmented `RootNavigator` (`RootNavigationAction`); `NavigationContainerRef`
   gained a trailing defaulted `Action` param.
7. Internal call sites fixed; wide re-dispatch sites use `@ts-expect-error`
   with reasons; `Link` / `useLinkProps` `action` stays wide.
8. Type tests in `example/__typechecks__/common.check.tsx` and
   `static.check.tsx` (10 assertion groups + regression pins).
9. Verified: repo + standalone typechecks, full jest (1166), lint, cold
   perf measured (see notes).

## Review passes done

- Perf: attribution + optimization (−113K instantiations; single-pass mapped
  unions, cheaper composite action inference).
- Simplification: `ActionPayloadParams` extraction, overload-impl `satisfies`
  guards restored, `RouteActions` rename.
- Correctness/API: `GenericNavigation` regression fixed (was common-only),
  no-arg `getParent()` widened, suppression audit clean.
- Final polish: comment alignment, prettier fixes, error-message quality
  spot-checked.

## Notes / known limitations

- Breaking: values typed as wide `NavigationAction` aren't assignable to
  `dispatch` (needs a cast); typed props are no longer assignable to
  `NavigationProp<ParamListBase>` (dispatch contravariance) — utilities
  should take a type param instead. Changelog-worthy.
- Both `beforeRemove` paths (`addListener` and `usePreventRemove`) deliver a
  wide `NavigationAction` (the action can come from anywhere in the tree), so
  re-dispatching it on a strict prop needs a cast. See "Revisit later".
- `DrawerToggleButton` widens its `dispatch` with an internal cast — the
  drawer handling the action may be any ancestor, which `useNavigation()`
  can't know; goes away if bubbling-aware dispatch lands.
- Excess/misspelled param object properties aren't flagged through creators
  (generic inference skips freshness checks) — same as `main`.
- The root-derived union is only as precise as the augmented tree. A tree with
  plain `string` dynamic route keys (e.g. `Object.fromEntries` spreads) widens
  the derived union toward `NavigationAction`, so unknown actions aren't rejected
  in such apps — brand the dynamic keys to keep it strict (the standalone checks
  do this). The example app uses plain keys, so its `GenericNavigation` /
  root-`NavigationContainerRef` dispatch resolves wide; the standalone
  `static`/`dynamic` checks assert strict rejection on branded trees.
- Cold repo typecheck: 1.39M → ~2.06M instantiations (+48%, root-derived union
  over the full nested tree; the augmented union is cached in a parameterless
  alias to reuse it across consumers), check time ~5.6s → ~8.4s incl. type tests.

## Revisit later

- Bubbling-aware dispatch: accept the app-wide `RootNavigationAction` union on
  every prop's `dispatch` (unhandled actions bubble to parents at runtime). This
  would make `beforeRemove` re-dispatch and dispatch-to-parent compile without a
  cast, at the cost of per-navigator strictness. Deferred — dispatch stays
  strict per-navigator for now, so `e.data.action` re-dispatch needs a cast.
- `RootNavigationAction` can't feed `getParent()`/`EventMapCore` (both live
  inside `NavigationProp`, which the derivation expands → value-level cycle via
  the augmented `RootNavigator`). They use wide `NavigationAction` for now.
  Deriving a self-reference-free per-prop union would let them narrow.
