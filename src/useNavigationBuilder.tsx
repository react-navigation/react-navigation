import * as React from 'react';
import { NavigationStateContext } from './NavigationContainer';
import {
  Router,
  NavigationAction,
  Descriptor,
  NavigationHelpers,
} from './types';
import Screen, { Props as ScreenProps } from './Screen';
import SceneView from './SceneView';
import * as BaseActions from './BaseActions';

type Options = {
  initialRouteName?: string;
  children: React.ReactElement[];
};

export const NavigationHelpersContext = React.createContext<
  NavigationHelpers | undefined
>(undefined);

export default function useNavigationBuilder(router: Router, options: Options) {
  const screens = React.Children.map(options.children, child => {
    if (child.type !== Screen) {
      throw new Error(
        "A navigator can only contain 'Screen' components as its direct children"
      );
    }

    return child.props as ScreenProps;
  }).reduce(
    (acc, curr) => {
      acc[curr.name] = curr;
      return acc;
    },
    {} as { [key: string]: ScreenProps }
  );

  const routeNames = Object.keys(screens);
  const initialState = React.useMemo(
    () => ({
      ...router.initial({
        routeNames,
        initialRouteName: options.initialRouteName,
      }),
      names: routeNames,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [options.initialRouteName, router, ...routeNames]
  );

  const {
    state: currentState = initialState,
    getState: getCurrentState,
    setState,
  } = React.useContext(NavigationStateContext);

  const getState = React.useCallback(() => {
    let state = getCurrentState();

    if (state === undefined) {
      state = initialState;
    }

    if (state.names === undefined) {
      state = { ...state, names: routeNames };
    }

    return state;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getCurrentState, initialState, ...routeNames]);

  const parentNavigationHelpers = React.useContext(NavigationHelpersContext);

  const helpers = React.useMemo((): NavigationHelpers => {
    const dispatch = (action: NavigationAction) => {
      const state = getState();
      const result = router.reduce(state, action);

      // If router returned `null`, let the parent navigator handle it
      if (result === null) {
        if (parentNavigationHelpers !== undefined) {
          parentNavigationHelpers.dispatch(action);
        } else {
          throw new Error(
            `No navigators are able to handle the action "${action.type}".`
          );
        }
      } else {
        setState(result);
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
  }, [router, parentNavigationHelpers, getState, setState]);

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
              <SceneView
                helpers={helpers}
                route={route}
                screen={screen}
                getState={getState}
                setState={setState}
              />
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
