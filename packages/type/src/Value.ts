export type Primitive = undefined | null | boolean | number | string | symbol | bigint;
export type Nullable<T> = T | null;
export type Ambiguous<T> = T | undefined;
export type Omittable<T> = T | void;
export type Suspicious<T> = T | null | undefined;
export type Matter<I> = I extends PromiseLike<infer R> ? R : I;
export type PlainObject = {
  [key: string]: PlainObjectItem;
};
export type PlainObjectItem = Primitive | PlainObject | ArrayLike<PlainObjectItem>;
export type ObjectLiteral = PlainObject | ArrayLike<PlainObjectItem>;
