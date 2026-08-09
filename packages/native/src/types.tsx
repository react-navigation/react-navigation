import type {
  getActionFromState as getActionFromStateDefault,
  getPathFromState as getPathFromStateDefault,
  getStateFromPath as getStateFromPathDefault,
  InitialState,
  NavigationState,
  PathConfigMap,
  RootNavigator,
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
  enabled?: boolean | undefined;
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
  prefixes?: LinkingPrefix[] | undefined;
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
  filter?: ((url: string) => boolean) | undefined;
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
  config?:
    | {
        /**
         * Path string to match against for the whole navigation tree.
         * It's not possible to specify params here since this doesn't belong to a screen.
         * This is useful when the whole app is under a specific path.
         * e.g. all of the screens are under `/admin` in `https://example.com/admin`
         */
        path?: string | undefined;
        /**
         * Path configuration for child screens.
         */
        screens: PathConfigMap<ParamList>;
        /**
         * Name of the initial route to use for the root navigator.
         */
        initialRouteName?: Extract<keyof ParamList, string> | undefined;
      }
    | undefined;
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
  getInitialURL?:
    | (() => string | null | undefined | Promise<string | null | undefined>)
    | undefined;
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
  subscribe?:
    | ((listener: (url: string) => void) => undefined | void | (() => void))
    | undefined;
  /**
   * Custom function to parse the URL to a valid navigation state (advanced).
   */
  getStateFromPath?: typeof getStateFromPathDefault | undefined;
  /**
   * Custom function to convert the state object to a valid URL (advanced).
   * Only applicable on Web.
   */
  getPathFromState?: typeof getPathFromStateDefault | undefined;
  /**
   * Custom function to convert the state object to a valid action (advanced).
   */
  getActionFromState?: typeof getActionFromStateDefault | undefined;
};

type NormalizePath<Path extends string> = Path extends `/${infer Rest}`
  ? NormalizePath<Rest>
  : Path extends `${infer Rest}/`
    ? NormalizePath<Rest>
    : Path;

declare const _HREF_UNKNOWN_PATH: unique symbol;

type UnknownPath = typeof _HREF_UNKNOWN_PATH;

type IsUppercaseLetter<Character extends string> =
  Character extends Uppercase<Character>
    ? Character extends Lowercase<Character>
      ? false
      : true
    : false;

type IsLowercaseLetter<Character extends string> =
  Character extends Lowercase<Character>
    ? Character extends Uppercase<Character>
      ? false
      : true
    : false;

type IsDigit<Character extends string> =
  Character extends `${0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}` ? true : false;

type FirstCharacter<Value extends string> =
  Value extends `${infer Character}${infer _}` ? Character : '';

type NeedsKebabSeparator<
  Previous extends string,
  Current extends string,
  Rest extends string,
> =
  IsUppercaseLetter<Current> extends true
    ? IsLowercaseLetter<Previous> extends true
      ? true
      : IsDigit<Previous> extends true
        ? true
        : IsUppercaseLetter<Previous> extends true
          ? IsLowercaseLetter<FirstCharacter<Rest>>
          : false
    : false;

type KebabCase<
  Value extends string,
  Previous extends string = '',
> = Value extends `${infer Current}${infer Rest}`
  ? `${NeedsKebabSeparator<Previous, Current, Rest> extends true
      ? '-'
      : ''}${Lowercase<Current>}${KebabCase<Rest, Current>}`
  : '';

type JoinPath<
  Parent extends string,
  Child extends string,
  NormalizedChild extends string = NormalizePath<Child>,
> = Parent extends ''
  ? NormalizedChild
  : NormalizedChild extends ''
    ? Parent
    : `${Parent}/${NormalizedChild}`;

type CanonicalPathForConfig<Config, Parent extends string> = Config extends {
  readonly path: infer Path extends string;
}
  ? string extends Path
    ? UnknownPath
    : Config extends { readonly exact: true }
      ? NormalizePath<Path>
      : JoinPath<Parent, Path>
  : Config extends string
    ? string extends Config
      ? UnknownPath
      : JoinPath<Parent, Config>
    : Parent;

type AliasPathsForConfig<Config, Parent extends string> = Config extends {
  readonly alias: readonly (infer Alias)[];
}
  ? CanonicalPathForConfig<Alias, Parent>
  : never;

type ExplicitPathsForConfig<Config, Parent extends string> =
  | (Config extends string | { readonly path: string }
      ? CanonicalPathForConfig<Config, Parent>
      : never)
  | AliasPathsForConfig<Config, Parent>;

type PathsForPathConfig<Config, Parent extends string> = string extends Config
  ? UnknownPath
  : Config extends undefined
    ? never
    : CanonicalPathForConfig<Config, Parent> extends infer CanonicalPath
      ? CanonicalPath extends UnknownPath
        ? UnknownPath
        : CanonicalPath extends string
          ?
              | ExplicitPathsForConfig<Config, Parent>
              | (Config extends { readonly screens: infer Screens }
                  ? PathsForPathConfigScreens<Screens, CanonicalPath>
                  : never)
          : never
      : never;

type PathsForPathConfigScreens<
  Screens,
  Parent extends string,
> = string extends keyof Screens
  ? UnknownPath
  : PathsForPathConfig<Screens[keyof Screens], Parent>;

type CanBeHomeForScreen<
  Name extends string,
  InitialRouteName,
  CanBeHome extends boolean,
> = CanBeHome extends false
  ? false
  : InitialRouteName extends string
    ? string extends InitialRouteName
      ? true
      : Name extends InitialRouteName
        ? true
        : false
    : true;

type CanBeHomeForChildren<
  Linking,
  CanBeHome extends boolean,
> = Linking extends { readonly path: infer Path extends string }
  ? string extends Path
    ? CanBeHome
    : NormalizePath<Path> extends ''
      ? CanBeHome
      : false
  : Linking extends string
    ? string extends Linking
      ? CanBeHome
      : NormalizePath<Linking> extends ''
        ? CanBeHome
        : false
    : CanBeHome;

type InitialRouteNameForConfig<Config, Override> = Override extends string
  ? Override
  : Config extends { readonly initialRouteName: infer InitialRouteName }
    ? InitialRouteName
    : undefined;

// Runtime linking props can override the static initial route, and TypeScript
// cannot identify the first key used by order-based home detection. Keep both
// the generated path and the possible parent path for auto-generated leaves.
type AutoPathForScreen<
  Name extends string,
  Parent extends string,
  CanBeHome extends boolean,
> = string extends Name
  ? UnknownPath
  :
      | JoinPath<Parent, KebabCase<Name>>
      | (CanBeHome extends false ? never : Parent);

type PathsForStaticLeaf<
  Name extends string,
  Linking,
  Parent extends string,
  CanBeHome extends boolean,
> = Linking extends string | { readonly path: string }
  ? ExplicitPathsForConfig<Linking, Parent>
  :
      | AliasPathsForConfig<Linking, Parent>
      | AutoPathForScreen<Name, Parent, CanBeHome>;

type PathsForStaticScreen<
  Name extends string,
  Screen,
  Linking,
  Parent extends string,
  CanBeHome extends boolean,
> = string extends Linking
  ? Screen extends { readonly config: infer Config }
    ? PathsForStaticConfig<Config, Parent, CanBeHome>
    : AutoPathForScreen<Name, Parent, CanBeHome>
  : Linking extends null
    ? never
    : Linking extends undefined
      ? Screen extends { readonly config: infer Config }
        ? PathsForStaticConfig<Config, Parent, CanBeHome>
        : AutoPathForScreen<Name, Parent, CanBeHome>
      : Linking extends { readonly screens: infer Screens }
        ? CanonicalPathForConfig<Linking, Parent> extends infer CanonicalPath
          ? CanonicalPath extends UnknownPath
            ? UnknownPath
            : CanonicalPath extends string
              ?
                  | ExplicitPathsForConfig<Linking, Parent>
                  | PathsForPathConfigScreens<Screens, CanonicalPath>
              : never
          : never
        : Screen extends { readonly config: infer Config }
          ? CanonicalPathForConfig<Linking, Parent> extends infer CanonicalPath
            ? CanonicalPath extends UnknownPath
              ? UnknownPath
              : CanonicalPath extends string
                ?
                    | ExplicitPathsForConfig<Linking, Parent>
                    | PathsForStaticConfig<
                        Config,
                        CanonicalPath,
                        CanBeHomeForChildren<Linking, CanBeHome>,
                        Linking extends {
                          readonly initialRouteName: infer InitialRouteName;
                        }
                          ? InitialRouteName
                          : undefined
                      >
                : never
            : never
          : PathsForStaticLeaf<Name, Linking, Parent, CanBeHome>;

type PathsForStaticScreenItem<
  Name extends string,
  Item,
  Parent extends string,
  CanBeHome extends boolean,
> = Item extends {
  readonly screen: infer Screen;
  readonly linking?: infer Linking;
}
  ? PathsForStaticScreen<Name, Screen, Linking, Parent, CanBeHome>
  : Item extends { readonly config: infer Config }
    ? PathsForStaticConfig<Config, Parent, CanBeHome>
    : AutoPathForScreen<Name, Parent, CanBeHome>;

type PathsForStaticScreens<
  Screens,
  Parent extends string,
  CanBeHome extends boolean,
  InitialRouteName,
> = string extends keyof Screens
  ? UnknownPath
  : {
      [Name in keyof Screens & string]: PathsForStaticScreenItem<
        Name,
        Screens[Name],
        Parent,
        CanBeHomeForScreen<Name, InitialRouteName, CanBeHome>
      >;
    }[keyof Screens & string];

type PathsForStaticGroup<
  Group,
  Parent extends string,
  CanBeHome extends boolean,
  InitialRouteName,
> = Group extends {
  readonly screens: infer Screens;
}
  ? PathsForStaticScreens<Screens, Parent, CanBeHome, InitialRouteName>
  : never;

type PathsForStaticGroups<
  Groups,
  Parent extends string,
  CanBeHome extends boolean,
  InitialRouteName,
> = PathsForStaticGroup<
  Groups[keyof Groups],
  Parent,
  CanBeHome,
  InitialRouteName
>;

type PathsForStaticConfig<
  Config,
  Parent extends string,
  CanBeHome extends boolean,
  InitialRouteNameOverride = undefined,
  InitialRouteName = InitialRouteNameForConfig<
    Config,
    InitialRouteNameOverride
  >,
> =
  | (Config extends { readonly screens: infer Screens }
      ? PathsForStaticScreens<Screens, Parent, CanBeHome, InitialRouteName>
      : never)
  | (Config extends { readonly groups: infer Groups }
      ? PathsForStaticGroups<Groups, Parent, CanBeHome, InitialRouteName>
      : never);

type HrefParam = '__REACT_NAVIGATION_HREF_PARAM__';

type JoinHrefSegments<
  Parent extends string,
  Child extends string,
> = Parent extends ''
  ? Child
  : Child extends ''
    ? Parent
    : `${Parent}/${Child}`;

type PathForHref<Path extends string> =
  Path extends `${infer Segment}/${infer Rest}`
    ? JoinHrefSegments<
        Segment extends `:${string}?`
          ? '' | HrefParam
          : Segment extends `:${string}` | '*'
            ? HrefParam
            : Segment,
        PathForHref<Rest>
      >
    : Path extends `:${string}?`
      ? '' | HrefParam
      : Path extends `:${string}` | '*'
        ? HrefParam
        : Path;

type ReplaceHrefParams<Path extends string> =
  Path extends `${infer Before}${HrefParam}${infer After}`
    ? `${Before}${string}${ReplaceHrefParams<After>}`
    : Path;

type HrefForPath<Path extends string> =
  PathForHref<Path> extends infer Href extends string
    ? Href extends ''
      ? '/' | `/?${string}`
      : `/${ReplaceHrefParams<Href>}` | `/${ReplaceHrefParams<Href>}?${string}`
    : never;

type HrefForNavigator<Navigator> = Navigator extends {
  readonly config: infer Config;
}
  ? PathsForStaticConfig<Config, '', true> extends infer Path
    ? UnknownPath extends Path
      ? string
      : [Path] extends [never]
        ? string
        :
            | `${string}://${string}`
            | (Path extends string ? HrefForPath<Path> : never)
    : never
  : string;

/**
 * Href inferred from a static navigator's linking configuration.
 * Defaults to the registered root navigator and falls back to `string` when
 * the href cannot be inferred.
 */
export type Href<Navigator = RootNavigator> = HrefForNavigator<Navigator>;

export type DocumentTitleOptions = {
  enabled?: boolean | undefined;
  formatter?:
    | ((
        options: Record<string, any> | undefined,
        route: Route<string> | undefined
      ) => string)
    | undefined;
};

export type Persistor = {
  /**
   * Callback to persist the serialized navigation state.
   */
  persist: (state: string | undefined) => void | PromiseLike<void>;
  /**
   * Callback to restore the serialized navigation state.
   *
   * Should return the serialized state or a Promise which resolves to the serialized state.
   *
   * If a Promise is returned, providing a `fallback` component is recommended.
   */
  restore: () => PromiseLike<string | undefined> | string | undefined;
  /**
   * Optional callback to serialize the navigation state.
   */
  stringify?: (state: NavigationState | undefined) => string | undefined;
  /**
   * Optional callback to parse the serialized navigation state.
   */
  parse?: (state: string | undefined) => InitialState | undefined;
};
