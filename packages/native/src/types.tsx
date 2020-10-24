import type {
  getStateFromPath as getStateFromPathDefault,
  getPathFromState as getPathFromStateDefault,
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
   *    prefixes: [
   *      "https://example.com", // Exact
   *      "https://*.example.com" // Match with any subdomain
   *    ]
   */
  prefixes: string[];
  /**
   * Config to fine-tune how to parse the path.
   *
   * Example:
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
   * Not supported on the web.
   */
  getInitialURL?: () => Promise<string | null | undefined>;
  /**
   * Custom function to get subscribe to URL updates.
   * Uses `Linking.addEventListener('url', callback)` by default.
   * Not supported on the web.
   */
  subscribe?: (
    listener: (url: string) => void
  ) => undefined | void | (() => void);
  /**
   * Custom function to parse the URL to a valid navigation state (advanced).
   */
  getStateFromPath?: typeof getStateFromPathDefault;
  /**
   * Custom function to convert the state object to a valid URL (advanced).
   * Only applicable on Web.
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
