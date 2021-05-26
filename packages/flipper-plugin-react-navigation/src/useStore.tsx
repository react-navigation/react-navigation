import { usePlugin, useValue } from 'flipper-plugin';

import { plugin } from './plugin';
import type { StoreType } from './types';

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
