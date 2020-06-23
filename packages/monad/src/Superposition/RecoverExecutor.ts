import { Reject, Resolve, UnaryFunction } from '@jamashita/publikum-type';

import { AliveNothingExecutor } from './AliveNothingExecutor';
import { DeadExecutor } from './DeadExecutor';
import { IDeadOrAliveExecutor } from './Interface/IDeadOrAliveExecutor';
import { Superposition } from './Superposition';

export class RecoverExecutor<S, F extends Error, T = S, E extends Error = F>
  implements IDeadOrAliveExecutor<S, F, 'RecoverExecutor'> {
  public readonly noun: 'RecoverExecutor' = 'RecoverExecutor';
  private readonly alive: AliveNothingExecutor<S>;
  private readonly dead: DeadExecutor<T, F, E>;

  public static of<S, F extends Error, T = S, E extends Error = F>(
    deadMapper: UnaryFunction<F, PromiseLike<T> | Superposition<T, E> | T>,
    resolve: Resolve<S | T>,
    reject: Reject<E>
  ): RecoverExecutor<S, F, T, E> {
    const alive: AliveNothingExecutor<S> = AliveNothingExecutor.of<S>(resolve);
    const dead: DeadExecutor<T, F, E> = DeadExecutor.of<T, F, E>(deadMapper, resolve, reject);

    return new RecoverExecutor<S, F, T, E>(alive, dead);
  }

  protected constructor(alive: AliveNothingExecutor<S>, dead: DeadExecutor<T, F, E>) {
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
