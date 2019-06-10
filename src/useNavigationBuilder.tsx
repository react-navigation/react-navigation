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
import * as BaseActions from './actions';

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
    () =>
      router.initial({
        routeNames: Object.keys(screens),
        initialRouteName: options.initialRouteName,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [options.initialRouteName, router, ...routeNames]
  );

  const { state = initialState, setState } = React.useContext(
    NavigationStateContext
  );

  const parentNavigationHelpers = React.useContext(NavigationHelpersContext);

  const helpers = React.useMemo((): NavigationHelpers => {
    const dispatch = (action: NavigationAction) =>
      setState((s = initialState) => {
        const result = router.reduce(s, action);

        // If router returned `null`, let the parent navigator handle it
        if (result === null && parentNavigationHelpers !== undefined) {
          parentNavigationHelpers.dispatch(action);
        }

        return result;
      });

    const actions = { ...router.actions, ...BaseActions };

    return {
      ...parentNavigationHelpers,
      ...Object.keys(actions).reduce(
        (acc, name) => {
          acc[name] = (...args: any) => dispatch(actions[name](...args));
          return acc;
        },
        {} as { [key: string]: () => void }
      ),
      dispatch,
    };
  }, [parentNavigationHelpers, router, setState, initialState]);

  const navigation = React.useMemo(
    () => ({
      ...helpers,
      state,
    }),
    [helpers, state]
  );

  const descriptors = state.routes.reduce(
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
                initialState={initialState}
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
