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

type HandleAction = (action: NavigationAction, fromKey: string) => boolean;

const NavigationBuilderContext = React.createContext<{
  helpers?: NavigationHelpers;
  onDispatchListener?: (listener: HandleAction) => void;
  onAction?: HandleAction;
  onChildUpdate?: (state: NavigationState, focus?: boolean) => void;
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

  React.useEffect(() => {
    setState(currentState as NavigationState);
  }, [currentState, setState]);

  const {
    helpers: parentNavigationHelpers,
    onAction: handleActionParent,
    onChildUpdate: handleChildUpdateParent,
    onDispatchListener: handleParentDispatch,
  } = React.useContext(NavigationBuilderContext);

  const dispatchListeners = React.useRef<HandleAction[]>([]);
  const onDispatchListener = React.useCallback((listener: HandleAction) => {
    dispatchListeners.current.push(listener);

    return () => {
      const index = dispatchListeners.current.indexOf(listener);
      dispatchListeners.current.splice(index, 1);
    };
  }, []);

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
    (action: NavigationAction, fromKey?: string) => {
      const state = getState();

      // If the action was dispatched by this navigator, don't handle it
      // This ensures that the action won't travel back up from children or down from parent
      if (fromKey === state.key) {
        return false;
      }

      const result = router.getStateForAction(state, action);

      if (result !== null) {
        if (handleChildUpdateParent) {
          const shouldFocus = router.shouldActionChangeFocus(action);

          handleChildUpdateParent(result, shouldFocus);
        } else {
          if (state !== result) {
            setState(result);
          }
        }

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
    [getState, handleActionParent, handleChildUpdateParent, router, setState]
  );

  const onChildUpdate = React.useCallback(
    (update: NavigationState, focus?: boolean) => {
      const state = getState();
      const result = router.getStateForChildUpdate(state, {
        update,
        focus: true,
      });

      if (handleChildUpdateParent !== undefined) {
        handleChildUpdateParent(result, focus);
      } else {
        setState(result);
      }
    },
    [getState, handleChildUpdateParent, router, setState]
  );

  React.useEffect(
    () => handleParentDispatch && handleParentDispatch(onAction),
    [onAction, handleParentDispatch]
  );

  const helpers = React.useMemo((): NavigationHelpers => {
    const dispatch = (
      action: NavigationAction | ((state: NavigationState) => NavigationState)
    ) => {
      if (typeof action === 'function') {
        setState(action(getState()));
      } else if (!onAction(action)) {
        throw new Error(
          `No navigators are able to handle the action "${action.type}".`
        );
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
      onChildUpdate,
      onDispatchListener,
    }),
    [helpers, onAction, onDispatchListener, onChildUpdate]
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
