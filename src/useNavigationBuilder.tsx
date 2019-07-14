import * as React from 'react';
import { NavigationStateContext } from './NavigationContainer';
import Screen from './Screen';
import useRegisterNavigator from './useRegisterNavigator';
import useDescriptors from './useDescriptors';
import useNavigationHelpers from './useNavigationHelpers';
import useOnAction from './useOnAction';
import { Router, NavigationState, ScreenProps } from './types';

type Options = {
  initialRouteName?: string;
  children: React.ReactNode;
};

export default function useNavigationBuilder(
  router: Router<any>,
  options: Options
) {
  useRegisterNavigator();

  const [screens] = React.useState(() =>
    React.Children.map(options.children, child => {
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
      )
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

  const {
    state: currentState = router.getInitialState({
      routeNames,
      initialRouteName,
      initialParamsList,
    }),
    getState: getCurrentState,
    setState,
  } = React.useContext(NavigationStateContext);

  React.useEffect(() => {
    // We need to clean up the state object when the navigator unmounts
    return () => setState(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getState = React.useCallback(
    (): NavigationState =>
      router.getRehydratedState({
        routeNames,
        partialState:
          getCurrentState() ||
          router.getInitialState({
            routeNames,
            initialRouteName,
            initialParamsList,
          }),
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getCurrentState, router.getRehydratedState, router.getInitialState]
  );

  const onAction = useOnAction({
    getState,
    setState,
    getStateForAction: router.getStateForAction,
  });

  const helpers = useNavigationHelpers({
    onAction,
    getState,
    setState,
    actionCreators: router.actionCreators,
  });

  const navigation = React.useMemo(
    () => ({
      ...helpers,
      state: currentState,
    }),
    [helpers, currentState]
  );

  const descriptors = useDescriptors({
    state: currentState,
    screens,
    helpers,
    onAction,
    getState,
    setState,
  });

  return {
    navigation,
    descriptors,
  };
}
