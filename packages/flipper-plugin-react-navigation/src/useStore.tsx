import { usePlugin, useValue } from 'flipper-plugin';
import type { StoreType } from './types';
import { plugin } from './plugin';

export function useStore(): StoreType {
  const instance = usePlugin(plugin);
  const logs = useValue(instance.logs);
  const index = useValue(instance.index);

  return {
    logs,
    index: index ?? logs.length - 1,
    navigation: instance.navigation,
    linking: instance.linking,
    resetTo: instance.resetTo,
  };
}
