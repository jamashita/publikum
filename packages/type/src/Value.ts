export type Primitive = undefined | null | boolean | number | string | symbol | bigint;
export type Nullable<T> = T | null;
export type Ambiguous<T> = T | undefined;
export type Suspicious<T> = T | null | undefined;
export type PlainObject = {
  [key: string]: Item;
};
type Item = Primitive | PlainObject | ArrayLike<Item>;
export type ObjectLiteral = PlainObject | ArrayLike<Item>;
