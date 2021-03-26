import * as React from 'react';
import type { NavigationState, ParamListBase } from '@react-navigation/routers';
import useNavigation from './useNavigation';
import type { NavigationProp } from './types';

type Selector<P extends ParamListBase, T> = (state: NavigationState<P>) => T;

/**
 * Hook to get a value from the current navigation state using a selector.
 *
 * @param selector Selector function to get a value from the state.
 */
export default function useNavigationState<P extends ParamListBase, T>(selector: Selector<P, T>): T {
  const navigation = useNavigation<NavigationProp<P>>();

  // We don't care about the state value, we run the selector again at the end
  // The state is only to make sure that there's a re-render when we have a new value
  const [, setResult] = React.useState(() => selector(navigation.getState()));

  // We store the selector in a ref to avoid re-subscribing listeners every render
  const selectorRef = React.useRef(selector);

  React.useEffect(() => {
    selectorRef.current = selector;
  });

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('state', (e) => {
      setResult(selectorRef.current(e.data.state));
    });

    return unsubscribe;
  }, [navigation]);

  return selector(navigation.getState());
}
