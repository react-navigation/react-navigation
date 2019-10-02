import * as React from 'react';
import {
  useNavigation,
  getStateFromPath,
  getActionFromState,
} from '@react-navigation/core';
import LinkingContext from './LinkingContext';

export default function useLinkTo() {
  const navigation = useNavigation();
  const getOptions = React.useContext(LinkingContext);

  const linkTo = React.useCallback(
    (path: string) => {
      if (!path.startsWith('/')) {
        throw new Error(`The path must start with '/' (${path}).`);
      }

      const options = getOptions();

      const state = options?.getStateFromPath
        ? options.getStateFromPath(path, options.config)
        : getStateFromPath(path, options?.config);

      if (state) {
        let root = navigation;
        let current;

        // Traverse up to get the root navigation
        while ((current = root.dangerouslyGetParent())) {
          root = current;
        }

        const action = getActionFromState(state);

        if (action !== undefined) {
          root.dispatch(action);
        } else {
          root.reset(state);
        }
      } else {
        throw new Error('Failed to parse the path to a navigation state.');
      }
    },
    [getOptions, navigation]
  );

  return linkTo;
}
