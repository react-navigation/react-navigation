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
 * We get a union type when using keyof, but we want an intersection instead.
 * https://stackoverflow.com/a/50375286/1665026
 */
export type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

export type UnknownToUndefined<T> = unknown extends T ? undefined : T;

export type AnyToUnknown<T> = 0 extends 1 & T ? unknown : T;
