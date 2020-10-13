type Any = unknown | void;
export type UnaryFunction<I, O> = (arg: I) => O;
export type BinaryFunction<I1, I2, O> = (arg1: I1, arg2: I2) => O;
export type Predicate<T> = (arg: T) => boolean;
export type BinaryPredicate<T1, T2> = (arg1: T1, args2: T2) => boolean;
export type Consumer<T> = (arg: T) => Any;
export type AsyncConsumer<T> = (arg: T) => Promise<Any>;
export type BinaryConsumer<T1, T2> = (arg1: T1, args2: T2) => Any;
export type Supplier<T> = () => T;
export type AsyncSupplier<T> = () => Promise<T>;
export type Peek = () => Any;
export type AsyncPeek = () => Promise<Any>;
export type Enumerator<K, V> = (value: V, key: K) => void;
export type Mapper<I, O> = (value: I, index: number) => O;
export type Resolve<T> = (arg: T | PromiseLike<T>) => Any;
export type Reject<E = unknown> = (arg: E) => Any;
