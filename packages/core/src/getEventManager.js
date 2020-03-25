// @ts-check

/**
 * @param {string} target
 */
export default function getEventManager(target) {
  /**
   * @type {Record<string, Record<string, ((e: any) => void)[]>>}
   */
  const listeners = {};

  /**
   * @param {string} type
   * @param {() => void} callback
   */
  const removeListener = (type, callback) => {
    const callbacks = listeners[type] ? listeners[type][target] : undefined;

    if (!callbacks) {
      return;
    }

    const index = callbacks.indexOf(callback);

    callbacks.splice(index, 1);
  };

  /**
   * @param {string} type
   * @param {() => void} callback
   */
  const addListener = (type, callback) => {
    listeners[type] = listeners[type] || {};
    listeners[type][target] = listeners[type][target] || [];
    listeners[type][target].push(callback);

    return {
      remove: () => removeListener(type, callback),
    };
  };

  return {
    addListener,

    /**
     * @param {string} type
     * @param {any} [data]
     */
    emit: (type, data) => {
      const items = listeners[type] || {};

      /**
       * Copy the current list of callbacks in case they are mutated during execution
       * @type {((data: any) => void)[] | undefined}
       */
      const callbacks = items[target] && items[target].slice();

      callbacks?.forEach((cb) => cb(data));
    },
  };
}
