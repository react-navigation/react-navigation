import type {
  getStateFromPath as getStateFromPathDefault,
  getPathFromState as getPathFromStateDefault,
  getActionFromState as getActionFromStateDefault,
  PathConfigMap,
  Route,
} from '@react-navigation/core';

export type Theme = {
  dark: boolean;
  colors: {
    primary: string;
    background: string;
    card: string;
    text: string;
    border: string;
    notification: string;
  };
};

export type LinkingOptions = {
  /**
   * Whether deep link handling should be enabled.
   * Defaults to true.
   */
  enabled?: boolean;
  /**
   * The prefixes are stripped from the URL before parsing them.
   * Usually they are the `scheme` + `host` (e.g. `myapp://chat?user=jane`)
   * Only applicable on Android and iOS.
   *
   * @example
   * ```js
   * {
   *    prefixes: [
   *      "myapp://", // App-specific scheme
   *      "https://example.com", // Prefix for universal links
   *      "https://*.example.com" // Prefix which matches any subdomain
   *    ]
   * }
   * ```
   */
  prefixes: string[];
  /**
   * Config to fine-tune how to parse the path.
   *
   * @example
   * ```js
   * {
   *   Chat: {
   *     path: 'chat/:author/:id',
   *     parse: { id: Number }
   *   }
   * }
   * ```
   */
  config?: { initialRouteName?: string; screens: PathConfigMap };
  /**
   * Custom function to get the initial URL used for linking.
   * Uses `Linking.getInitialURL()` by default.
   * Not supported on Web.
   *
   * @example
   * ```js
   * {
   *    getInitialURL () => Linking.getInitialURL(),
   * }
   * ```
   */
  getInitialURL?: () =>
    | string
    | null
    | undefined
    | Promise<string | null | undefined>;
  /**
   * Custom function to get subscribe to URL updates.
   * Uses `Linking.addEventListener('url', callback)` by default.
   * Not supported on Web.
   *
   * @example
   * ```js
   * {
   *    subscribe: (listener) => {
   *      const onReceiveURL = ({ url }) => listener(url);
   *
   *      Linking.addEventListener('url', onReceiveURL);
   *
   *      return () => Linking.removeEventListener('url', onReceiveURL);
   *   }
   * }
   * ```
   */
  subscribe?: (
    listener: (url: string) => void
  ) => undefined | void | (() => void);
  /**
   * Custom function to parse the URL to a valid navigation state (advanced).
   * This state object will be passed as `initialState` for initial URL,
   * and converted to an action object to `dispatch` for subsequent URLs.
   */
  getStateFromPath?: typeof getStateFromPathDefault;
  /**
   * Custom function to convert the state object to an action to dispatch (advanced).
   * By default, the state is converted to a `NAVIGATE` action.
   */
  getActionFromState?: typeof getActionFromStateDefault;
  /**
   * Custom function to convert the state object to a valid URL (advanced).
   * Used for creating links for navigation, primarily useful on Web.
   */
  getPathFromState?: typeof getPathFromStateDefault;
};

export type DocumentTitleOptions = {
  enabled?: boolean;
  formatter?: (
    options: Record<string, any> | undefined,
    route: Route<string> | undefined
  ) => string;
};

export type ServerContainerRef = {
  getCurrentOptions(): Record<string, any> | undefined;
};
