import * as React from 'react';
import shortid from 'shortid';
import { SingleNavigatorContext } from './EnsureSingleNavigator';

/**
 * Register a navigator in the parent context (either a navigation container or a screen).
 * This is used to prevent multiple navigators under a single container or screen.
 */
export default function useRegisterNavigator() {
  const [key] = React.useState(() => shortid());
  const container = React.useContext(SingleNavigatorContext);

  if (container === undefined) {
    throw new Error(
      "Couldn't register the navigator. Have you wrapped your app with 'NavigationContainer'?"
    );
  }

  React.useEffect(() => {
    const { register, unregister } = container;

    register(key);

    return () => unregister(key);
  }, [container, key]);

  return key;
}
