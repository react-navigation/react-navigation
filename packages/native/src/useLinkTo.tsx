import {
  getActionFromState,
  getStateFromPath,
  NavigationContainerRefContext,
} from '@react-navigation/core';
import * as React from 'react';

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
  const navigation = React.useContext(NavigationContainerRefContext);
  const linking = React.useContext(LinkingContext);

  const linkTo = React.useCallback(
    (to: To<ParamList>) => {
      if (navigation === undefined) {
        throw new Error(
          "Couldn't find a navigation object. Is your component inside NavigationContainer?"
        );
      }

      if (typeof to !== 'string') {
        // @ts-expect-error: This is fine
        navigation.navigate(to.screen, to.params);
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
          navigation.dispatch(action);
        } else {
          navigation.reset(state);
        }
      } else {
        throw new Error('Failed to parse the path to a navigation state.');
      }
    },
    [linking, navigation]
  );

  return linkTo;
}
