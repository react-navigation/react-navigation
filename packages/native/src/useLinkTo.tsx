import * as React from 'react';
import {
  getStateFromPath,
  getActionFromState,
  NavigationContext,
} from '@react-navigation/core';
import LinkingContext from './LinkingContext';

export default function useLinkTo() {
  const navigation = React.useContext(NavigationContext);
  const linking = React.useContext(LinkingContext);

  const linkTo = React.useCallback(
    (path: string) => {
      if (!path.startsWith('/')) {
        throw new Error(`The path must start with '/' (${path}).`);
      }

      if (navigation === undefined) {
        throw new Error(
          "Couldn't find a navigation object. Is your component inside a screen in a navigator?"
        );
      }

      const { options } = linking;

      const state = options?.getStateFromPath
        ? options.getStateFromPath(path, options.config)
        : getStateFromPath(path, options?.config);

      if (state) {
        let root = navigation;
        let current;

        // Traverse up to get the root navigation
        while ((current = root.getParent())) {
          root = current;
        }

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
