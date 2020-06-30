export type UnaryFunction<I, O> = (arg: I) => O;
export type BinaryFunction<I1, I2, O> = (arg1: I1, arg2: I2) => O;
export type Predicate<T> = (arg: T) => boolean;
export type BinaryPredicate<T1, T2> = (arg1: T1, args2: T2) => boolean;
export type Consumer<T> = (arg: T) => void | unknown;
export type AsyncConsumer<T> = (arg: T) => Promise<void | unknown>;
export type Supplier<T> = () => T;
export type AsyncSupplier<T> = () => Promise<T>;
export type Peek = () => unknown;
export type AsyncPeek = () => Promise<unknown>;
export type Enumerator<K, V> = (value: V, key: K) => void;
export type Mapper<I, O> = (value: I, index: number) => O;
export type Resolve<T> = (arg: T) => unknown;
export type Reject<E = unknown> = (arg: E) => unknown;
export type Constructor = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (...args: Array<any>): any;
};
