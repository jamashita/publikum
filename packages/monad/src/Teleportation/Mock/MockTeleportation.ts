import { UnimplementedError } from '@jamashita/publikum-error';
import { Suspicious, UnaryFunction } from '@jamashita/publikum-type';

import { Bennett } from '../Bennett/Bennett';
import { ITeleportation } from '../Interface/ITeleportation';

export class MockTeleportation<R> implements ITeleportation<R, 'MockTeleportation'> {
  public readonly noun: 'MockTeleportation' = 'MockTeleportation';

  public resolve(value: R): unknown;
  public resolve(): unknown {
    throw new UnimplementedError();
  }

  public reject(error: Error): unknown;
  public reject(): unknown {
    throw new UnimplementedError();
  }

  public cancel(): void {
    throw new UnimplementedError();
  }

  public get(): Promise<R> {
    throw new UnimplementedError();
  }

  public terminate(): Promise<Bennett<R>> {
    throw new UnimplementedError();
  }

  public then<T1 = R, T2 = never>(
    onfulfilled?: Suspicious<UnaryFunction<R, T1 | PromiseLike<T1>>>,
    onrejected?: Suspicious<UnaryFunction<unknown, T2 | PromiseLike<T2>>>
  ): PromiseLike<T1 | T2>;
  public then<T1 = R, T2 = never>(): PromiseLike<T1 | T2> {
    throw new UnimplementedError();
  }

  public map<S = R>(mapper: UnaryFunction<R, PromiseLike<S> | S>): MockTeleportation<S>;
  public map<S = R>(): MockTeleportation<S> {
    throw new UnimplementedError();
  }

  public recover<S = R>(mapper: UnaryFunction<Error, PromiseLike<S> | S>): MockTeleportation<R | S>;
  public recover<S = R>(): MockTeleportation<R | S> {
    throw new UnimplementedError();
  }
}
