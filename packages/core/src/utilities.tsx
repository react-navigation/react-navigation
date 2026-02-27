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

export type StandardSchemaValidationResult<Output> =
  | { value: Output; issues?: undefined }
  | { value?: undefined; issues: readonly unknown[] };

export type StandardSchemaV1<Input = unknown, Output = Input> = {
  readonly '~standard': {
    readonly version: 1;
    readonly vendor: string;
    readonly validate: (
      value: Input
    ) =>
      | StandardSchemaValidationResult<Output>
      | Promise<StandardSchemaValidationResult<Output>>;
  };
};

export type QueryParamInput = string | string[] | null | undefined;

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
 * Get the type of params based on the `parse` config and the path pattern.
 */
export type ExtractParamsType<Params, Parse> = {
  /**
   * Base param types from path pattern
   * Refine the type based on standard schema, then parse function
   * Otherwise, use the type from path pattern
   */
  [K in keyof Params]: K extends keyof Parse
    ? Parse[K] extends StandardSchemaV1<unknown, infer R>
      ? R
      : Parse[K] extends (value: string) => infer R
        ? R
        : Params[K]
    : Params[K];
} & {
  /**
   * Optional param types not in path pattern (for query params)
   */
  [K in QueryParamOptionalKeys<Params, Parse>]?: QueryParamValue<Parse[K]>;
} & {
  /**
   * Required param types not in path pattern (for query params)
   */
  [K in QueryParamRequiredKeys<Params, Parse>]: QueryParamValue<Parse[K]>;
};

type QueryParamValue<ParseValue> =
  ParseValue extends StandardSchemaV1<unknown, infer R>
    ? R
    : ParseValue extends (value: string) => infer R
      ? R
      : never;

/**
 * For schema, it's optional if the output has `undefined`, otherwise required
 * For parse function, it's always optional as it can't say if it's required or not
 */
type QueryParamOptionalKeys<Params, Parse> = {
  [K in Exclude<keyof Parse, keyof Params>]: Parse[K] extends StandardSchemaV1<
    unknown,
    infer R
  >
    ? undefined extends R
      ? K
      : never
    : Parse[K] extends (value: string) => unknown
      ? K
      : never;
}[Exclude<keyof Parse, keyof Params>];

/**
 * Exclude optional keys to get required keys
 * For schema, it's required if the output doesn't have `undefined`, otherwise optional
 * It doesn't include parse functions (as they are always optional)
 */
type QueryParamRequiredKeys<Params, Parse> = Exclude<
  Exclude<keyof Parse, keyof Params>,
  QueryParamOptionalKeys<Params, Parse>
>;

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
