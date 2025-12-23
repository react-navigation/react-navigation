import type {
  getActionFromState as getActionFromStateDefault,
  getPathFromState as getPathFromStateDefault,
  getStateFromPath as getStateFromPathDefault,
  InitialState,
  NavigationState,
  PathConfigMap,
  Route,
} from '@react-navigation/core';
import type { ColorValue as ReactNativeColorValue } from 'react-native';

type ColorValue =
  | `#${string}`
  | `rgb(${string})`
  | `rgba(${string})`
  | `hsl(${string})`
  | `hsla(${string})`
  | `hwb(${string})`
  | `hwba(${string})`
  | `var(--${string})`
  | ReactNativeColorValue;

type FontStyle = {
  fontFamily: string;
  fontWeight:
    | 'normal'
    | 'bold'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900';
};

interface NativeTheme {
  dark: boolean;
  colors: {
    primary: ColorValue;
    background: ColorValue;
    card: ColorValue;
    text: ColorValue;
    border: ColorValue;
    notification: ColorValue;
  };
  fonts: {
    regular: FontStyle;
    medium: FontStyle;
    bold: FontStyle;
    heavy: FontStyle;
  };
}

declare module '@react-navigation/core' {
  interface Theme extends NativeTheme {}
}

export type LocaleDirection = 'ltr' | 'rtl';

export type LinkingPrefix = '*' | (string & {});

export type LinkingOptions<ParamList extends {}> = {
  /**
   * Whether deep link handling should be enabled.
   *
   * Defaults to `true` when a linking config is specified.
   */
  enabled?: boolean;
  /**
   * The prefixes to match to determine whether to handle a URL.
   *
   * Supported prefix formats:
   * - `${scheme}://` - App-specific scheme, e.g. `myapp://`
   * - `${protocol}://${host}` - Universal links or app links, e.g. `https://example.com`, `https://subdomain.example.com`
   * - `${protocol}://*.${domain}` - Any subdomain of given domain, e.g. `https://*.example.com`
   * - `${protocol}://${host}/${path}` - Subpath of given host, e.g. `https://example.com/app`
   * - `*` - Any domain or subdomain with `http://` and `https://` as well as any app-specific scheme
   *
   * The prefix will be stripped from the URL before it's parsed.
   *
   * Defaults to `[*]`.
   *
   * This is not supported on Web.
   *
   * @example
   * ```js
   * {
   *    prefixes: [
   *      "myapp://",
   *      "https://example.com",
   *      "https://*.example.com"
   *    ]
   * }
   * ```
   */
  prefixes?: LinkingPrefix[];
  /**
   * Optional function which takes an incoming URL returns a boolean
   * indicating whether React Navigation should handle it.
   *
   * This can be used to disable deep linking for specific URLs.
   * e.g. URLs used for authentication, and not for deep linking to screens.
   *
   * This is not supported on Web.
   *
   * @example
   * ```js
   * {
   *   // Filter out URLs used by expo-auth-session
   *   filter: (url) => !url.includes('+expo-auth-session')
   * }
   * ```
   */
  filter?: (url: string) => boolean;
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
  config?: {
    /**
     * Path string to match against for the whole navigation tree.
     * It's not possible to specify params here since this doesn't belong to a screen.
     * This is useful when the whole app is under a specific path.
     * e.g. all of the screens are under `/admin` in `https://example.com/admin`
     */
    path?: string;
    /**
     * Path configuration for child screens.
     */
    screens: PathConfigMap<ParamList>;
    /**
     * Name of the initial route to use for the root navigator.
     */
    initialRouteName?: keyof ParamList;
  };
  /**
   * Custom function to get the initial URL used for linking.
   * Uses `Linking.getInitialURL()` by default.
   *
   * This is not supported on Web.
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
   *
   * This is not supported on Web.
   *
   * @example
   * ```js
   * {
   *    subscribe: (listener) => {
   *      const onReceiveURL = ({ url }) => listener(url);
   *
   *      const subscription = Linking.addEventListener('url', onReceiveURL);
   *
   *      return () => {
   *        subscription.remove();
   *      };
   *   }
   * }
   * ```
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
  /**
   * Custom function to convert the state object to a valid action (advanced).
   */
  getActionFromState?: typeof getActionFromStateDefault;
};

export type DocumentTitleOptions = {
  enabled?: boolean;
  formatter?: (
    options: Record<string, any> | undefined,
    route: Route<string> | undefined
  ) => string;
};

export type Persistor = {
  /**
   * Callback to persist the navigation state.
   */
  persist(state: NavigationState | undefined): void;
  /**
   * Callback to restore the navigation state.
   * Should return the restored state or a Promise which resolves to the restored state.
   *
   * If a Promise is returned, providing a `fallback` component is recommended.
   */
  restore(): PromiseLike<InitialState | undefined> | InitialState | undefined;
};

export type ServerContainerRef = {
  getCurrentOptions(): Record<string, any> | undefined;
};
