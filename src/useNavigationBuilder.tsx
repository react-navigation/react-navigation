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
import SceneView from './SceneView';
import * as BaseActions from './BaseActions';

type Options = {
  initialRouteName?: string;
  children: React.ReactNode;
};

type HandleAction = (action: NavigationAction, fromKey: string) => boolean;

const NavigationHelpersContext = React.createContext<
  NavigationHelpers | undefined
>(undefined);

const NavigationDispatchListenerContext = React.createContext<
  ((listener: HandleAction) => void) | undefined
>(undefined);

const NavigationHandleActionContext = React.createContext<
  HandleAction | undefined
>(undefined);

export default function useNavigationBuilder(router: Router, options: Options) {
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
    state: currentState = router.initial({
      screens,
      initialRouteName: options.initialRouteName,
    }),
    getState: getCurrentState,
    setState,
  } = React.useContext(NavigationStateContext);

  const parentNavigationHelpers = React.useContext(NavigationHelpersContext);
  const dispatchListeners = React.useRef<HandleAction[]>([]);
  const addDispatchListener = React.useCallback((listener: HandleAction) => {
    dispatchListeners.current.push(listener);

    return () => {
      const index = dispatchListeners.current.indexOf(listener);
      dispatchListeners.current.splice(index, 1);
    };
  }, []);

  const getState = React.useCallback(
    (): NavigationState =>
      router.initial({
        screens,
        partialState: getCurrentState(),
        initialRouteName: options.initialRouteName,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getCurrentState, ...routeNames]
  );

  const onDispatch = React.useContext(NavigationDispatchListenerContext);
  const handleActionParent = React.useContext(NavigationHandleActionContext);
  const handleAction = React.useCallback(
    (action: NavigationAction, fromKey?: string) => {
      const state = getState();

      // If the action was dispatched by this navigator, don't handle it
      // This ensures that the action won't travel back up from children or down from parent
      if (fromKey === state.key) {
        return false;
      }

      const result = router.reduce(state, action);

      if (result !== null) {
        setState(result);
        return true;
      }

      // If router returned `null`, it didn't handle it
      // try to delegate the action to child navigators
      for (let i = dispatchListeners.current.length - 1; i >= 0; i--) {
        const listener = dispatchListeners.current[i];

        if (listener(action, state.key)) {
          return true;
        }
      }

      if (handleActionParent !== undefined) {
        // If non of the child navigators could handle the action, delegate it to parent
        // This will enable sibling navigators to handle the action
        if (handleActionParent(action, state.key)) {
          return true;
        }
      }

      return false;
    },
    [getState, handleActionParent, router, setState]
  );

  React.useEffect(() => onDispatch && onDispatch(handleAction), [
    handleAction,
    onDispatch,
  ]);

  const helpers = React.useMemo((): NavigationHelpers => {
    const dispatch = (action: NavigationAction) => {
      if (!handleAction(action)) {
        throw new Error(
          `No navigators are able to handle the action "${action.type}".`
        );
      }
    };

    const actions = {
      ...router.actions,
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
  }, [handleAction, parentNavigationHelpers, router]);

  const navigation = React.useMemo(
    () => ({
      ...helpers,
      state: currentState,
    }),
    [helpers, currentState]
  );

  const descriptors = currentState.routes.reduce(
    (acc, route) => {
      const screen = screens[route.name];

      acc[route.key] = {
        render() {
          return (
            <NavigationHelpersContext.Provider value={helpers}>
              <NavigationHandleActionContext.Provider value={handleAction}>
                <NavigationDispatchListenerContext.Provider
                  value={addDispatchListener}
                >
                  <SceneView
                    helpers={helpers}
                    route={route}
                    screen={screen}
                    getState={getState}
                    setState={setState}
                  />
                </NavigationDispatchListenerContext.Provider>
              </NavigationHandleActionContext.Provider>
            </NavigationHelpersContext.Provider>
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
