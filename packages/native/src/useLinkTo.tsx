import * as React from 'react';
import {
  getStateFromPath,
  getActionFromState,
  NavigationContext,
} from '@react-navigation/core';
import LinkingContext from './LinkingContext';

export type To<
  ParamList extends ReactNavigation.RootParamList = ReactNavigation.RootParamList,
  RouteName extends keyof ParamList = keyof ParamList
> =
  | string
  | (undefined extends ParamList[RouteName]
      ? {
          screen: RouteName;
          params?: ParamList[RouteName];
        }
      : {
          screen: RouteName;
          params: ParamList[RouteName];
        });

export default function useLinkTo<
  ParamList extends ReactNavigation.RootParamList
>() {
  const navigation = React.useContext(NavigationContext);
  const linking = React.useContext(LinkingContext);

  const linkTo = React.useCallback(
    (to: To<ParamList>) => {
      if (navigation === undefined) {
        throw new Error(
          "Couldn't find a navigation object. Is your component inside a screen in a navigator?"
        );
      }

      let root = navigation;
      let current;

      // Traverse up to get the root navigation
      while ((current = root.getParent())) {
        root = current;
      }

      if (typeof to !== 'string') {
        // @ts-expect-error: This is fine
        root.navigate(to.screen, to.params);
        return;
      }

      if (!to.startsWith('/')) {
        throw new Error(`The path must start with '/' (${to}).`);
      }

      const { options } = linking;

      const state = options?.getStateFromPath
        ? options.getStateFromPath(to, options.config)
        : getStateFromPath(to, options?.config);

      if (state) {
        const action = getActionFromState(state, options?.config);

        if (action !== undefined) {
          root.dispatch(action);
        } else {
          root.reset(state);
        }
      } else {
        throw new Error('Failed to parse the path to a navigation state.');
      }
    },
    [linking, navigation]
  );

  return linkTo;
}
