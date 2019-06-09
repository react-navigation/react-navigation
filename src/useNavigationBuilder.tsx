import * as React from 'react';
import { NavigationContext } from './NavigationContainer';
import {
  Router,
  NavigationAction,
  NavigationProp,
  Descriptor,
  NavigationState,
} from './types';
import Screen, { Props as ScreenProps } from './Screen';

type Options = {
  initialRouteName?: string;
  navigation?: NavigationProp;
  children: React.ReactElement[];
};

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

  const {
    state = router.getInitialState(routeNames, {
      initialRouteName: options.initialRouteName,
    }),
    setState,
  } = React.useContext(NavigationContext);

  const navigation = React.useMemo((): NavigationProp & {
    state: NavigationState;
  } => {
    const dispatch = (action: NavigationAction) =>
      setState(router.reduce(state, action));

    return {
      ...options.navigation,
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
  }, [options.navigation, router, state, setState]);

  const descriptors = state.routes.reduce(
    (acc, route) => {
      const screen = screens[route.name];
      const nav = {
        ...navigation,
        state: route,
      };

      acc[route.key] = {
        render: () => (
          <NavigationContext.Provider
            value={{
              state: route.state,
              setState: child =>
                setState({
                  ...state,
                  routes: state.routes.map(r =>
                    r === route ? { ...route, state: child } : r
                  ),
                }),
            }}
          >
            {'component' in screen && screen.component !== undefined ? (
              <screen.component navigation={nav} />
            ) : 'children' in screen && screen.children !== undefined ? (
              screen.children({ navigation: nav })
            ) : null}
          </NavigationContext.Provider>
        ),
        options: screen.options || {},
      };
      return acc;
    },
    {} as { [key: string]: Descriptor }
  );

  return { navigation, descriptors };
}
