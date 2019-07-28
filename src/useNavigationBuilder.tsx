import * as React from 'react';
import { NavigationStateContext } from './NavigationContainer';
import Screen from './Screen';
import useRegisterNavigator from './useRegisterNavigator';
import useDescriptors from './useDescriptors';
import useNavigationHelpers from './useNavigationHelpers';
import useOnAction from './useOnAction';
import useOnRouteFocus from './useOnRouteFocus';
import useChildActionListeners from './useChildActionListeners';
import {
  DefaultRouterOptions,
  NavigationState,
  ParamListBase,
  RouteConfig,
  Router,
  RouterFactory,
} from './types';

type Options = {
  children: React.ReactNode;
};

const isArrayEqual = (a: any[], b: any[]) =>
  a.length === b.length && a.every((it, index) => it === b[index]);

const getRouteConfigsFromChildren = <ScreenOptions extends object>(
  children: React.ReactNode
) =>
  React.Children.toArray(children).reduce<
    RouteConfig<ParamListBase, string, ScreenOptions>[]
  >((acc, child) => {
    if (React.isValidElement(child)) {
      if (child.type === Screen) {
        acc.push(child.props as RouteConfig<
          ParamListBase,
          string,
          ScreenOptions
        >);
        return acc;
      }

      if (child.type === React.Fragment) {
        acc.push(
          ...getRouteConfigsFromChildren<ScreenOptions>(child.props.children)
        );
        return acc;
      }
    }

    throw new Error(
      `A navigator can only contain 'Screen' components as its direct children (found '${
        // @ts-ignore
        child.type && child.type.name ? child.type.name : String(child)
      }')`
    );
  }, []);

export default function useNavigationBuilder<
  State extends NavigationState,
  ScreenOptions extends object,
  RouterOptions extends DefaultRouterOptions
>(
  createRouter: RouterFactory<State, any, RouterOptions>,
  options: Options & RouterOptions
) {
  useRegisterNavigator();

  const { children, ...rest } = options;
  const { current: router } = React.useRef<Router<State, any>>(
    createRouter((rest as unknown) as RouterOptions)
  );

  const screens = getRouteConfigsFromChildren<ScreenOptions>(children).reduce(
    (acc, curr) => {
      acc[curr.name] = curr;
      return acc;
    },
    {} as { [key: string]: RouteConfig<ParamListBase, string, ScreenOptions> }
  );

  const routeNames = Object.keys(screens);
  const routeParamList = routeNames.reduce(
    (acc, curr) => {
      acc[curr] = screens[curr].initialParams;
      return acc;
    },
    {} as { [key: string]: object | undefined }
  );

  if (!routeNames.length) {
    throw new Error(
      "Couldn't find any screens for the navigator. Have you defined any screens as its children?"
    );
  }

  const {
    state: currentState,
    getState: getCurrentState,
    setState,
    key,
    performTransaction,
  } = React.useContext(NavigationStateContext);

  const [initialState] = React.useState(() =>
    currentState === undefined
      ? router.getInitialState({
          routeNames,
          routeParamList,
        })
      : router.getRehydratedState({
          routeNames,
          partialState: currentState as any,
        })
  );

  let state =
    currentState === undefined || currentState.stale
      ? initialState
      : (currentState as State);

  if (!isArrayEqual(state.routeNames, routeNames)) {
    // When the list of route names change, the router should handle it to remove invalid routes
    const nextState = router.getStateForRouteNamesChange(state, {
      routeNames,
      routeParamList,
    });

    if (state !== nextState) {
      // If the state needs to be updated, we'll schedule an update with React
      // setState in render seems hacky, but that's how React docs implement getDerivedPropsFromState
      // https://reactjs.org/docs/hooks-faq.html#how-do-i-implement-getderivedstatefromprops
      performTransaction(() => {
        setState(nextState);
      });
    }

    state = nextState;
  }

  React.useEffect(() => {
    return () => {
      // We need to clean up state for this navigator on unmount
      performTransaction(
        () => getCurrentState() !== undefined && setState(undefined)
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getState = React.useCallback((): State => {
    const currentState = getCurrentState();

    return currentState === undefined || currentState.stale
      ? initialState
      : (currentState as State);
  }, [getCurrentState, initialState]);

  const {
    listeners: actionListeners,
    addActionListener,
    removeActionListener,
  } = useChildActionListeners();

  const onAction = useOnAction({
    router,
    getState,
    setState,
    key,
    listeners: actionListeners,
  });

  const onRouteFocus = useOnRouteFocus({
    router,
    onAction,
    key,
    getState,
    setState,
  });

  const navigation = useNavigationHelpers({
    onAction,
    getState,
    setState,
    actionCreators: router.actionCreators,
  });

  const descriptors = useDescriptors<ScreenOptions>({
    state,
    screens,
    navigation,
    onAction,
    getState,
    setState,
    onRouteFocus,
    addActionListener,
    removeActionListener,
  });

  return {
    state,
    navigation,
    descriptors,
  };
}
