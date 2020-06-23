import { Reject, Resolve, UnaryFunction } from '@jamashita/publikum-type';

import { AliveExecutor } from './AliveExecutor';
import { DeadNothingExecutor } from './DeadNothingExecutor';
import { IDeadOrAliveExecutor } from './Interface/IDeadOrAliveExecutor';
import { Superposition } from '../Superposition';

export class MapExecutor<S, F extends Error, T = S, E extends Error = F>
  implements IDeadOrAliveExecutor<S, F, 'MapExecutor'> {
  public readonly noun: 'MapExecutor' = 'MapExecutor';
  private readonly alive: AliveExecutor<S, T, E>;
  private readonly dead: DeadNothingExecutor<F>;

  public static of<S, F extends Error, T = S, E extends Error = F>(
    aliveMapper: UnaryFunction<S, PromiseLike<T> | Superposition<T, E> | T>,
    resolve: Resolve<T>,
    reject: Reject<F | E>
  ): MapExecutor<S, F, T, E> {
    const alive: AliveExecutor<S, T, E> = AliveExecutor.of<S, T, E>(aliveMapper, resolve, reject);
    const dead: DeadNothingExecutor<F> = DeadNothingExecutor.of<F>(reject);

    return new MapExecutor<S, F, T, E>(alive, dead);
  }

  protected constructor(alive: AliveExecutor<S, T, E>, dead: DeadNothingExecutor<F>) {
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
