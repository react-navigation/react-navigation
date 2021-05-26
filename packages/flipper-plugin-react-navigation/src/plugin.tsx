import { createState, PluginClient } from 'flipper-plugin';

import type { Log, NavigationState } from './types';

type Events = {
  action: Log;
  init: { id: string; state: NavigationState | undefined };
};

type Methods = {
  'navigation.invoke': (params: {
    method: string;
    args: any[];
  }) => Promise<any>;
  'linking.invoke': (params: { method: string; args: any[] }) => Promise<any>;
};

export function plugin(client: PluginClient<Events, Methods>) {
  const logs = createState<Log[]>([], { persist: 'logs' });
  const index = createState<number | null>(null, { persist: 'index' });

  client.onMessage('init', () => {
    logs.set([]);
    index.set(null);
  });

  client.onMessage('action', (action) => {
    const indexValue = index.get();
    index.set(null);
    logs.update((draft) => {
      if (indexValue != null) {
        draft.splice(indexValue + 1);
      }
      draft.push(action);
    });
  });

  function navigation(method: string, ...args: any[]) {
    return client.send('navigation.invoke', { method, args });
  }

  function resetTo(id: string) {
    const logsValue = logs.get();
    const indexValue = logsValue.findIndex((update) => update.id === id)!;
    const { state } = logsValue[indexValue];
    index.set(indexValue);
    return client.send('navigation.invoke', {
      method: 'resetRoot',
      args: [state],
    });
  }

  function linking(method: string, ...args: any[]) {
    return client.send('linking.invoke', { method, args });
  }

  return {
    logs,
    index,
    resetTo,
    navigation,
    linking,
  };
}
