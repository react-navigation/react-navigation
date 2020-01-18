import * as React from 'react';
import useNavigation from './useNavigation';
import { NavigationState } from './types';

type Selector<T> = (state: NavigationState) => T;

/**
 * Hook to get a value from the current navigation state using a selector.
 *
 * @param selector Selector function to get a value from the state.
 */
export default function useNavigationState<T>(selector: Selector<T>): T {
  const navigation = useNavigation();

  const [result, setResult] = React.useState(() =>
    selector(navigation.dangerouslyGetState())
  );

  // We store the selector in a ref to avoid re-subscribing listeners every render
  const selectorRef = React.useRef(selector);

  React.useEffect(() => {
    selectorRef.current = selector;
  });

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('state', e => {
      setResult(selectorRef.current(e.data.state));
    });

    return unsubscribe;
  }, [navigation]);

  return result;
}
