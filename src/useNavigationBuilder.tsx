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

  const screens = React.Children.map(options.children, child => {
    if (React.isValidElement(child) && child.type === Screen) {
      return child.props as ScreenProps;
    }

    throw new Error(
      "A navigator can only contain 'Screen' components as its direct children"
    );
  }).reduce(
    (acc, curr) => {
      acc[curr.name] = curr;
      return acc;
    },
    {} as { [key: string]: ScreenProps }
  );

  const routeNames = Object.keys(screens);

  const {
    state: currentState = router.getInitialState({
      screens,
      initialRouteName: options.initialRouteName,
    }),
    getState: getCurrentState,
    setState,
  } = React.useContext(NavigationStateContext);

  const getState = React.useCallback(
    (): NavigationState =>
      router.getInitialState({
        screens,
        partialState: getCurrentState(),
        initialRouteName: options.initialRouteName,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getCurrentState, ...routeNames]
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
