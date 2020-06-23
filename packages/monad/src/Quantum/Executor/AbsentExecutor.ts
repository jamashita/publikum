import { Kind, Reject, Resolve, Supplier, Suspicious } from '@jamashita/publikum-type';

import { Quantum } from '../Quantum';
import { IAbsentExecutor } from './Interface/IAbsentExecutor';

export class AbsentExecutor<U> implements IAbsentExecutor {
  public readonly noun: 'AbsentExecutor' = 'AbsentExecutor';
  private readonly mapper: Supplier<PromiseLike<Suspicious<U>> | Quantum<U> | Suspicious<U>>;
  private readonly resolve: Resolve<U>;
  private readonly reject: Reject<void>;

  public static of<U>(
    mapper: Supplier<PromiseLike<Suspicious<U>> | Quantum<U> | Suspicious<U>>,
    resolve: Resolve<U>,
    reject: Reject<void>
  ): AbsentExecutor<U> {
    return new AbsentExecutor<U>(mapper, resolve, reject);
  }

  protected constructor(
    mapper: Supplier<PromiseLike<Suspicious<U>> | Quantum<U> | Suspicious<U>>,
    resolve: Resolve<U>,
    reject: Reject<void>
  ) {
    this.mapper = mapper;
    this.resolve = resolve;
    this.reject = reject;
  }

  public async onAbsent(): Promise<void> {
    const mapped: PromiseLike<Suspicious<U>> | Quantum<U> | Suspicious<U> = this.mapper();

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
