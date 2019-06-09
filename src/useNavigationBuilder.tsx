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
  children: React.ReactElement[];
};

export default function useNavigationBuilder(
  router: Router,
  { initialRouteName, children }: Options
) {
  const screens = React.Children.map(children, child => {
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
    state = router.getInitialState(routeNames, { initialRouteName }),
    setState,
  } = React.useContext(NavigationContext);

  const navigation = React.useMemo((): NavigationProp & {
    state: NavigationState;
  } => {
    const dispatch = (action: NavigationAction) =>
      setState(router.reduce(state, action));

    return {
      state,
      dispatch,
      ...Object.keys(router.actions).reduce(
        (acc, name) => {
          acc[name] = (...args: any) => dispatch(router.actions[name](...args));
          return acc;
        },
        {} as { [key: string]: () => void }
      ),
    };
  }, [state, router, setState]);

  const descriptors = state.routes.reduce(
    (acc, route) => {
      const screen = screens[route.name];
      const nav = {
        ...navigation,
        state: route,
      };

      acc[route.name] = {
        render: () => (
          <NavigationContext.Provider
            value={{
              state: 'routes' in route && 'index' in route ? route : undefined,
              setState: s =>
                setState({
                  ...state,
                  // @ts-ignore
                  routes: state.routes.map(r => (r === route ? s : r)),
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
