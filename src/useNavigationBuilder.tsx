import * as React from 'react';
import { NavigationStateContext } from './NavigationContainer';
import Screen from './Screen';
import useRegisterNavigator from './useRegisterNavigator';
import useDescriptors from './useDescriptors';
import useNavigationHelpers from './useNavigationHelpers';
import useOnAction from './useOnAction';
import { Router, NavigationState, ScreenProps } from './types';
import useOnChildUpdate from './useOnChildUpdate';
import useChildActionListeners from './useChildActionListeners';

type Options = {
  initialRouteName?: string;
  children: React.ReactNode;
};

const isArrayEqual = (a: any[], b: any[]) =>
  a.length === b.length && a.every((it, index) => it === b[index]);

export default function useNavigationBuilder(
  router: Router<any>,
  options: Options
) {
  useRegisterNavigator();

  const screens = React.Children.map(options.children, child => {
    if (child === null || child === undefined) {
      return;
    }

    if (React.isValidElement(child) && child.type === Screen) {
      return child.props as ScreenProps;
    }

    throw new Error(
      `A navigator can only contain 'Screen' components as its direct children (found '${
        // @ts-ignore
        child.type && child.type.name ? child.type.name : String(child)
      }')`
    );
  })
    .filter(Boolean)
    .reduce(
      (acc, curr) => {
        acc[curr!.name] = curr as ScreenProps;
        return acc;
      },
      {} as { [key: string]: ScreenProps }
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
      setState(nextState);
    }

    state = nextState;
  }

  React.useEffect(() => {
    return () => {
      // We need to clean up state for this navigator on unmount
      getCurrentState() !== undefined && setState(undefined);
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
    getStateForAction: router.getStateForAction,
    actionListeners,
  });

  const onChildUpdate = useOnChildUpdate({
    router,
    onAction,
    key,
    getState,
    setState,
  });

  const helpers = useNavigationHelpers({
    onAction,
    getState,
    setState,
    actionCreators: router.actionCreators,
  });

  const navigation = React.useMemo(() => ({ ...helpers, state }), [
    helpers,
    state,
  ]);

  const descriptors = useDescriptors({
    state,
    screens,
    helpers,
    onAction,
    getState,
    setState,
    onChildUpdate,
    addActionListener,
    removeActionListener,
  });

  return {
    navigation,
    descriptors,
  };
}
