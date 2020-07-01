import { Noun } from '@jamashita/publikum-interface';
import { Suspicious, UnaryFunction } from '@jamashita/publikum-type';

import { Bennett } from '../Bennett/Bennett';

export interface ITeleportation<R, N extends string = string> extends PromiseLike<R>, Noun<N> {
  cancel(): void;

  get(): Promise<R>;

  terminate(): Promise<Bennett<R>>;

  then<T1 = R, T2 = never>(
    onfulfilled?: Suspicious<UnaryFunction<R, T1 | PromiseLike<T1>>>,
    onrejected?: Suspicious<UnaryFunction<unknown, T2 | PromiseLike<T2>>>
  ): PromiseLike<T1 | T2>;

  map<S = R>(mapper: UnaryFunction<R, PromiseLike<S>>): ITeleportation<S, N>;
  map<S = R>(mapper: UnaryFunction<R, S>): ITeleportation<S, N>;
  map<S = R>(mapper: UnaryFunction<R, PromiseLike<S> | S>): ITeleportation<S, N>;

  recover<S = R>(mapper: UnaryFunction<Error, PromiseLike<S>>): ITeleportation<R | S, N>;
  recover<S = R>(mapper: UnaryFunction<Error, S>): ITeleportation<R | S, N>;
  recover<S = R>(mapper: UnaryFunction<Error, PromiseLike<S> | S>): ITeleportation<R | S, N>;
}
