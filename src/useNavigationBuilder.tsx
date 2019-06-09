import * as React from 'react';
import { NavigationStateContext } from './NavigationContainer';
import {
  Router,
  NavigationAction,
  NavigationProp,
  Descriptor,
  NavigationState,
} from './types';
import Screen, { Props as ScreenProps } from './Screen';
import SceneView from './SceneView';

type Options = {
  initialRouteName?: string;
  children: React.ReactElement[];
};

export const NavigationPropContext = React.createContext<
  NavigationProp | undefined
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

  const {
    state = router.initial({
      routeNames: Object.keys(screens),
      initialRouteName: options.initialRouteName,
    }),
    setState,
  } = React.useContext(NavigationStateContext);

  const parentNavigation = React.useContext(NavigationPropContext);

  const navigation = React.useMemo((): NavigationProp & {
    state: NavigationState;
  } => {
    const dispatch = (action: NavigationAction) =>
      setState(router.reduce(state, action));

    return {
      ...parentNavigation,
      ...Object.keys(router.actions).reduce(
        (acc, name) => {
          acc[name] = (...args: any) => dispatch(router.actions[name](...args));
          return acc;
        },
        {} as { [key: string]: () => void }
      ),
      state,
      dispatch,
    };
  }, [router, state, setState, parentNavigation]);

  const descriptors = state.routes.reduce(
    (acc, route) => {
      const screen = screens[route.name];

      acc[route.key] = {
        render() {
          return (
            <SceneView
              navigation={navigation}
              route={route}
              screen={screen}
              state={state}
              setState={setState}
            />
          );
        },
        options: screen.options || {},
      };
      return acc;
    },
    {} as { [key: string]: Descriptor }
  );

  return { navigation, descriptors };
}
