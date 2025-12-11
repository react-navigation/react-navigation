/**
 * Flatten a type to remove all type alias names, unions etc.
 * This will show a plain object when hovering over the type.
 */
export type FlatType<T> = { [K in keyof T]: T[K] } & {};

/**
 * keyof T doesn't work for union types. We can use distributive conditional types instead.
 * https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types
 */
export type KeysOf<T> = T extends {} ? keyof T : never;

/**
 * Extract string keys from an object type.
 */
export type KeyOf<T extends {}> = Extract<keyof T, string>;

/**
 * We get a union type when using keyof, but we want an intersection instead.
 * https://stackoverflow.com/a/50375286/1665026
 */
export type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

export type UnknownToUndefined<T> = unknown extends T ? undefined : T;

/**
 * Exclude undefined from a type.
 * Similar to NonNullable but only excludes undefined, not null.
 */
export type NotUndefined<T> = T extends undefined ? never : T;

export type AnyToUnknown<T> = 0 extends 1 & T ? unknown : T;

/**
 * Check if a function type has arguments.
 */
export type HasArguments<T extends (...args: any[]) => any> =
  Parameters<T> extends []
    ? false
    : Parameters<T> extends [undefined?]
      ? false
      : true;

export type ValidPathPattern = `:${string}` | `${string}/:${string}`;

/**
 * Strip regex pattern from a path param.
 * e.g. `userId([a-z]+)` -> `userId`
 */
type StripRegex<Param extends string> = Param extends `${infer Name}(${string})`
  ? Name
  : Param;

/**
 * Extract a single path param from a segment.
 * e.g. `:userId` -> `{ userId: string }`, `:id?` -> `{ id?: string }`
 */
type ExtractSegmentParam<Segment extends string> =
  Segment extends `:${infer Param}?`
    ? { [K in StripRegex<Param>]?: string }
    : Segment extends `:${infer Param}`
      ? { [K in StripRegex<Param>]: string }
      : {};

/**
 * Extract path params from a path string.
 * e.g. `/foo/:userId/:postId` -> `{ userId: string; postId: string }`
 * Supports optional params with `?` suffix.
 * Params must start with `:` at the beginning of a segment (after `/`).
 */
export type ExtractParamStrings<Path extends string> =
  Path extends `${infer Segment}/${infer Rest}`
    ? ExtractSegmentParam<Segment> & ExtractParamStrings<Rest>
    : ExtractSegmentParam<Path>;

/**
 * Extract the parsed params type from base params and parse functions.
 * Applies the return type of parse functions to the corresponding params.
 */
export type ExtractParamsType<Params, Parse> = {
  [K in keyof Params]: K extends keyof Parse
    ? Parse[K] extends (value: string) => infer R
      ? R
      : Params[K]
    : Params[K];
};

/**
 * Infer the path string from a linking config.
 */
export type InferPath<T> = T extends { path: infer P extends string }
  ? P
  : never;

/**
 * Infer the parse functions from a linking config.
 */
export type InferParse<T> = T extends { parse: infer P } ? P : {};

/**
 * Infer the params type from a screen component or nested navigator.
 */
export type InferScreenParams<T> =
  T extends React.ComponentType<{ route: { params: infer P } }>
    ? P
    : T extends { config: { screens: infer Screens } }
      ? import('./types').NavigatorScreenParams<{
          [K in keyof Screens]: Screens[K] extends React.ComponentType<{
            route: { params: infer P };
          }>
            ? P
            : Screens[K] extends { screen: infer S }
              ? S extends React.ComponentType<{ route: { params: infer P } }>
                ? P
                : undefined
              : undefined;
        }>
      : undefined;
