import * as React from 'react';
import { NavigationStateContext } from './NavigationContainer';
import Screen from './Screen';
import useRegisterNavigator from './useRegisterNavigator';
import useDescriptors from './useDescriptors';
import useNavigationHelpers from './useNavigationHelpers';
import useOnAction from './useOnAction';
import { Router, NavigationState, RouteConfig } from './types';
import useOnRouteFocus from './useOnRouteFocus';
import useChildActionListeners from './useChildActionListeners';

type Options = {
  initialRouteName?: string;
  children: React.ReactNode;
};

const isArrayEqual = (a: any[], b: any[]) =>
  a.length === b.length && a.every((it, index) => it === b[index]);

const getRouteConfigsFromChildren = (children: React.ReactNode) =>
  React.Children.toArray(children).reduce<RouteConfig[]>((acc, child) => {
    if (React.isValidElement(child)) {
      if (child.type === Screen) {
        acc.push(child.props as RouteConfig);
        return acc;
      }

      if (child.type === React.Fragment) {
        acc.push(...getRouteConfigsFromChildren(child.props.children));
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

export default function useNavigationBuilder(
  router: Router<any>,
  options: Options
) {
  useRegisterNavigator();

  const screens = getRouteConfigsFromChildren(options.children).reduce(
    (acc, curr) => {
      acc[curr.name] = curr;
      return acc;
    },
    {} as { [key: string]: RouteConfig }
  );

  const routeNames = Object.keys(screens);
  const initialRouteName =
    options.initialRouteName !== undefined
      ? options.initialRouteName
      : routeNames[0];
  const initialParamsList = routeNames.reduce(
    (acc, curr) => {
      acc[curr] = screens[curr].initialParams;
      return acc;
    },
    {} as { [key: string]: object | undefined }
  );

  const [initialState] = React.useState(() =>
    router.getInitialState({
      routeNames,
      initialRouteName,
      initialParamsList,
    })
  );

  const {
    state: currentState = initialState,
    getState: getCurrentState,
    setState,
    key,
    performTransaction,
  } = React.useContext(NavigationStateContext);

  let state = router.getRehydratedState({
    routeNames,
    partialState: currentState,
  });

  if (!isArrayEqual(state.routeNames, routeNames)) {
    // When the list of route names change, the router should handle it to remove invalid routes
    const nextState = router.getStateForRouteNamesChange(state, {
      routeNames,
      initialRouteName,
      initialParamsList,
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

  const getState = React.useCallback(
    (): NavigationState =>
      router.getRehydratedState({
        routeNames,
        partialState: getCurrentState() || state,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getCurrentState, router.getRehydratedState, router.getInitialState]
  );

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

  const descriptors = useDescriptors({
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
