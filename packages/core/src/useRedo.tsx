import { useEffect, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import useFocusEffect from './useFocusEffect';

type EffectCallback = () => undefined | void | (() => void);

/**
 * Hook to run an effect when resurfaced from either background or a different view.
 * This can be used to perform side-effects such as refetching data.
 *
 * @param callback callback containing the effect.
 */
export default function useRedo(effect: EffectCallback) {
  const memoizedEffect = useCallback(() => {
    effect();
  }, []);

  const handler = (nextAppState: AppStateStatus) => {
    if (nextAppState === 'active') {
      memoizedEffect();
    }
  };

  useFocusEffect(memoizedEffect);

  useEffect(() => {
    AppState.addEventListener('change', handler);

    return () => {
      AppState.removeEventListener('change', handler);
    };
  }, []);
}
