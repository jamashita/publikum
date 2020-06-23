import { Reject, Resolve, UnaryFunction } from '@jamashita/publikum-type';

import { AliveExecutor } from './AliveExecutor';
import { DeadExecutor } from './DeadExecutor';
import { CallbackExecutor } from './Interface/CallbackExecutor';
import { Superposition } from './Superposition';

// TODO
export class AnyExecutor<S, T, F extends Error, E extends Error> implements CallbackExecutor<S, F, 'AnyExecutor'> {
  public readonly noun: 'AnyExecutor' = 'AnyExecutor';
  private readonly alive: AliveExecutor<S, T, F, E>;
  private readonly dead: DeadExecutor<S, T, F, E>;

  public static of<S, T, F extends Error, E extends Error>(
    aliveMapper: UnaryFunction<S, PromiseLike<T> | Superposition<T, E> | T>,
    deadMapper: UnaryFunction<F, PromiseLike<T> | Superposition<T, E> | T>,
    resolve: Resolve<T>,
    reject: Reject<F | E>
  ): AnyExecutor<S, T, F, E> {
    const alive: AliveExecutor<S, T, F, E> = AliveExecutor.of<S, T, F, E>(aliveMapper, resolve, reject);
    const dead: DeadExecutor<S, T, F, E> = DeadExecutor.of<S, T, F, E>(deadMapper, resolve, reject);

    return new AnyExecutor<S, T, F, E>(alive, dead);
  }

  protected constructor(alive: AliveExecutor<S, T, F, E>, dead: DeadExecutor<S, T, F, E>) {
    this.alive = alive;
    this.dead = dead;
  }

  public onAlive(value: S): void {
    this.alive.onAlive(value);
  }

  public onDead(err: F): void {
    this.dead.onDead(err);
  }
}
