import * as React from 'react';
import shortid from 'shortid';
import { SingleNavigatorContext } from './EnsureSingleNavigator';

export default function useRegisterNavigator() {
  const [key] = React.useState(shortid());
  const singleNavigatorContext = React.useContext(SingleNavigatorContext);

  React.useEffect(() => {
    if (singleNavigatorContext === undefined) {
      throw new Error(
        "Couldn't register the navigator. You likely forgot to nest the navigator inside a 'NavigationContainer'."
      );
    }

    const { register, unregister } = singleNavigatorContext;

    register(key);

    return () => unregister(key);
  }, [key, singleNavigatorContext]);
}
