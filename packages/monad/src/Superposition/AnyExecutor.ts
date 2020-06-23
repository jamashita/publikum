import { Reject, Resolve, UnaryFunction } from '@jamashita/publikum-type';

import { AliveExecutor } from './AliveExecutor';
import { DeadExecutor } from './DeadExecutor';
import { CallbackExecutor } from './Interface/CallbackExecutor';
import { Superposition } from './Superposition';

export class AnyExecutor<S, F extends Error, T = S, E extends Error = F>
  implements CallbackExecutor<S, F, 'AnyExecutor'> {
  public readonly noun: 'AnyExecutor' = 'AnyExecutor';
  private readonly alive: AliveExecutor<S, F, T, E>;
  private readonly dead: DeadExecutor<S, F, T, E>;

  public static of<S, F extends Error, T = S, E extends Error = F>(
    aliveMapper: UnaryFunction<S, PromiseLike<T> | Superposition<T, E> | T>,
    deadMapper: UnaryFunction<F, PromiseLike<T> | Superposition<T, E> | T>,
    resolve: Resolve<T>,
    reject: Reject<E>
  ): AnyExecutor<S, F, T, E> {
    const alive: AliveExecutor<S, F, T, E> = AliveExecutor.of<S, F, T, E>(aliveMapper, resolve, reject);
    const dead: DeadExecutor<S, F, T, E> = DeadExecutor.of<S, F, T, E>(deadMapper, resolve, reject);

    return new AnyExecutor<S, F, T, E>(alive, dead);
  }

  protected constructor(alive: AliveExecutor<S, F, T, E>, dead: DeadExecutor<S, F, T, E>) {
    this.alive = alive;
    this.dead = dead;
  }

  public async onAlive(value: S): Promise<void> {
    return this.alive.onAlive(value);
  }

  public async onDead(err: F): Promise<void> {
    return this.dead.onDead(err);
  }
}
