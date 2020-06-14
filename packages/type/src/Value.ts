export type Primitive = null | undefined | number | string | boolean | symbol | bigint;
export type Nullable<T> = T | null;
export type Ambiguous<T> = T | undefined;
export type Suspicious<T> = T | null | undefined;
export type PlainObject = {
  [key: string]: Item | ArrayLike<Item>;
};
type Item = Primitive | PlainObject;
export type ObjectLiteral = PlainObject | ArrayLike<Item>;
