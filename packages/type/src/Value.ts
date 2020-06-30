export type Primitive = undefined | null | boolean | number | string | symbol | bigint;
export type Nullable<T> = T | null;
export type Ambiguous<T> = T | undefined;
export type Omittable<T> = T | void;
export type Suspicious<T> = T | null | undefined;
export type Nihil = void | undefined | null;
export type Matter<T> = T extends PromiseLike<infer R> ? R : T;
export type Freeze<T extends object> = {
  readonly [P in keyof T]: T[P] extends object ? Freeze<T[P]> : T[P];
};
export type Vague<T extends object = object> = {
  [P in keyof T]: unknown;
};
export type Inconnu = Record<string, unknown>;
export type PlainObject = {
  [key: string]: PlainObjectItem;
};
export type PlainObjectItem = Primitive | PlainObject | ArrayLike<PlainObjectItem>;
export type ObjectLiteral = PlainObject | ArrayLike<PlainObjectItem>;
