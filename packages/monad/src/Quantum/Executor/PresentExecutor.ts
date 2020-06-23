import { Kind, Reject, Resolve, Suspicious, UnaryFunction } from '@jamashita/publikum-type';

import { Quantum } from '../Quantum';
import { IPresentExecutor } from './Interface/IPresentExecutor';

export class PresentExecutor<T, U> implements IPresentExecutor<T> {
  public readonly noun: 'PresentExecutor' = 'PresentExecutor';
  private readonly mapper: UnaryFunction<T, PromiseLike<Suspicious<U>> | Quantum<U> | Suspicious<U>>;
  private readonly resolve: Resolve<U>;
  private readonly reject: Reject<void>;

  public static of<T, U>(
    mapper: UnaryFunction<T, PromiseLike<Suspicious<U>> | Quantum<U> | Suspicious<U>>,
    resolve: Resolve<U>,
    reject: Reject<void>
  ): PresentExecutor<T, U> {
    return new PresentExecutor<T, U>(mapper, resolve, reject);
  }

  protected constructor(
    mapper: UnaryFunction<T, PromiseLike<Suspicious<U>> | Quantum<U> | Suspicious<U>>,
    resolve: Resolve<U>,
    reject: Reject<void>
  ) {
    this.mapper = mapper;
    this.resolve = resolve;
    this.reject = reject;
  }

  public async onPresent(value: T): Promise<void> {
    const mapped: PromiseLike<Suspicious<U>> | Quantum<U> | Suspicious<U> = this.mapper(value);

    if (mapped instanceof Quantum) {
      await mapped.map<void>((v: U) => {
        this.resolve(v);
      });
      await mapped.recover<void>(() => {
        this.reject();
      });

      return;
    }
    if (Kind.isPromiseLike(mapped)) {
      await mapped.then<void, void>(
        (v: Suspicious<U>) => {
          switch (v) {
            case null:
            case undefined: {
              this.reject();

              return;
            }
            default: {
              this.resolve(v);
            }
          }
        },
        () => {
          this.reject();
        }
      );

      return;
    }

    switch (mapped) {
      case null:
      case undefined: {
        this.reject();

        return;
      }
      default: {
        this.resolve(mapped);
      }
    }
  }
}
