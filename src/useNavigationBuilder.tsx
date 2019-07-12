import * as React from 'react';
import { NavigationStateContext } from './NavigationContainer';
import {
  Router,
  NavigationAction,
  Descriptor,
  NavigationHelpers,
  NavigationState,
  ScreenProps,
} from './types';
import Screen from './Screen';
import shortid from 'shortid';
import SceneView from './SceneView';
import * as BaseActions from './BaseActions';
import { SingleNavigatorContext } from './EnsureSingleNavigator';

type Options = {
  initialRouteName?: string;
  children: React.ReactNode;
};

type HandleAction = (action: NavigationAction) => boolean;

const NavigationBuilderContext = React.createContext<{
  helpers?: NavigationHelpers;
  onAction?: HandleAction;
}>({});

export default function useNavigationBuilder(
  router: Router<any>,
  options: Options
) {
  const [key] = React.useState(shortid());
  const singleNavigatorContext = React.useContext(SingleNavigatorContext);

  React.useEffect(() => {
    if (singleNavigatorContext === undefined) {
      throw new Error(
        "Couldn't register the navigator. You likely forgot to nest the navigator inside a 'NavigationContainer'."
      );
    }

    const { register, unregister } = singleNavigatorContext;

    register(key);

    return () => unregister(key);
  }, [key, singleNavigatorContext]);

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

  const {
    helpers: parentNavigationHelpers,
    onAction: handleActionParent,
  } = React.useContext(NavigationBuilderContext);

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

  const onAction = React.useCallback(
    (action: NavigationAction) => {
      const state = getState();

      const result = router.getStateForAction(state, action);

      if (result !== null) {
        if (state !== result) {
          setState(result);
        }

        return true;
      }

      if (handleActionParent !== undefined) {
        // Bubble action to the parent if the current navigator didn't handle it
        if (handleActionParent(action)) {
          return true;
        }
      }

      return false;
    },
    [getState, handleActionParent, router, setState]
  );

  const helpers = React.useMemo((): NavigationHelpers => {
    const dispatch = (
      action: NavigationAction | ((state: NavigationState) => NavigationState)
    ) => {
      if (typeof action === 'function') {
        setState(action(getState()));
      } else {
        onAction(action);
      }
    };

    const actions = {
      ...router.actionCreators,
      ...BaseActions,
    };

    // @ts-ignore
    return {
      ...parentNavigationHelpers,
      ...Object.keys(actions).reduce(
        (acc, name) => {
          // @ts-ignore
          acc[name] = (...args: any) => dispatch(actions[name](...args));
          return acc;
        },
        {} as { [key: string]: () => void }
      ),
      dispatch,
    };
  }, [getState, onAction, parentNavigationHelpers, router, setState]);

  const navigation = React.useMemo(
    () => ({
      ...helpers,
      state: currentState,
    }),
    [helpers, currentState]
  );

  const context = React.useMemo(
    () => ({
      helpers,
      onAction,
    }),
    [helpers, onAction]
  );

  const descriptors = currentState.routes.reduce(
    (acc, route) => {
      const screen = screens[route.name];

      acc[route.key] = {
        render() {
          return (
            <NavigationBuilderContext.Provider value={context}>
              <SceneView
                helpers={helpers}
                route={route}
                screen={screen}
                getState={getState}
                setState={setState}
              />
            </NavigationBuilderContext.Provider>
          );
        },
        options: screen.options || {},
      };
      return acc;
    },
    {} as { [key: string]: Descriptor }
  );

  return {
    navigation,
    descriptors,
  };
}
