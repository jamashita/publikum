export type Primitive = undefined | null | boolean | number | string | symbol | bigint;
export type Nullable<T> = T | null;
export type Ambiguous<T> = T | undefined;
export type Omittable<T> = T | void;
export type Suspicious<T> = T | null | undefined;
export type Eliminate<T, U extends T> = Exclude<T, U>;
export type Retain<T, U extends T> = Extract<T, U>;
export type SyncAsync<T> = T | PromiseLike<T>;
export type Constructor = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new(...args: ReadonlyArray<any>): any;
};
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
export type ObjectLiteral = PlainObject | ReadonlyArray<PlainObjectItem>;
export type PlainObjectItem = Primitive | ObjectLiteral;
