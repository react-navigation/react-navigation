import * as React from 'react';
import {
  NavigationContext,
  NavigationRouteContext,
  Route,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';

import Header from './Header';
import { WebStackNavigationProp, WebStackDescriptor } from '../../types';

export type Props = {
  scenes: {
    route: RouteProp<ParamListBase, string>;
    descriptor: WebStackDescriptor;
  }[];
  getPreviousRoute: (props: {
    route: Route<string>;
  }) => Route<string> | undefined;
  getFocusedRoute: () => Route<string>;
  style?: React.CSSProperties;
};

export default function HeaderContainer({
  scenes,
  getFocusedRoute,
  getPreviousRoute,
  style,
}: Props) {
  const focusedRoute = getFocusedRoute();

  return (
    <div style={style}>
      {scenes.slice(-3).map((scene, i, self) => {
        if (i !== self.length - 1 || !scene) {
          return null;
        }

        const { options } = scene.descriptor;
        const isFocused = focusedRoute.key === scene.route.key;
        const previousRoute = getPreviousRoute({ route: scene.route });

        const props = {
          canGoBack: !previousRoute,
          route: scene.route,
          descriptor: scene.descriptor,
          navigation: scene.descriptor.navigation as WebStackNavigationProp<
            ParamListBase
          >,
        };

        return (
          <NavigationContext.Provider
            key={scene.route.key}
            value={scene.descriptor.navigation}
          >
            <NavigationRouteContext.Provider value={scene.route}>
              <div aria-hidden={isFocused ? true : false}>
                {options.headerShown !== false ? (
                  options.header !== undefined ? (
                    options.header(props)
                  ) : (
                    <Header {...props} />
                  )
                ) : null}
              </div>
            </NavigationRouteContext.Provider>
          </NavigationContext.Provider>
        );
      })}
    </div>
  );
}
