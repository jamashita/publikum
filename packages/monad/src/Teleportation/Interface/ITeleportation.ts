import { Noun } from '@jamashita/publikum-interface';
import { Suspicious, UnaryFunction } from '@jamashita/publikum-type';

import { Bennett } from '../Bennett/Bennett';

export interface ITeleportation<R, T extends ITeleportation<R, T, N>, N extends string>
  extends PromiseLike<R>,
    Noun<N> {
  cancel(): void;

  get(): Promise<R>;

  terminate(): Promise<Bennett<R>>;

  then<T1 = R, T2 = never>(
    onfulfilled?: Suspicious<UnaryFunction<R, T1 | PromiseLike<T1>>>,
    onrejected?: Suspicious<UnaryFunction<unknown, T2 | PromiseLike<T2>>>
  ): PromiseLike<T1 | T2>;

  map<S = R>(mapper: UnaryFunction<R, PromiseLike<S>>): T;
  map<S = R>(mapper: UnaryFunction<R, S>): T;
  map<S = R>(mapper: UnaryFunction<R, PromiseLike<S> | S>): T;

  recover<S = R>(mapper: UnaryFunction<Error, PromiseLike<S>>): T;
  recover<S = R>(mapper: UnaryFunction<Error, S>): T;
  recover<S = R>(mapper: UnaryFunction<Error, PromiseLike<S> | S>): T;
}
