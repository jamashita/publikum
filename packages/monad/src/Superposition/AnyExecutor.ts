import { Consumer } from '@jamashita/publikum-type';

import { CallbackExecutor } from './Interface/CallbackExecutor';

export class AnyExecutor<S, F extends Error> implements CallbackExecutor<S, F, 'AnyExecutor'> {
  public readonly noun: 'AnyExecutor' = 'AnyExecutor';
  private readonly alive: Consumer<S>;
  private readonly dead: Consumer<F>;

  public static of<S, F extends Error>(alive: Consumer<S>, dead: Consumer<F>): AnyExecutor<S, F> {
    return new AnyExecutor<S, F>(alive, dead);
  }

  protected constructor(alive: Consumer<S>, dead: Consumer<F>) {
    this.alive = alive;
    this.dead = dead;
  }

  public onAlive(value: S): void {
    this.alive(value);
  }

  public onDead(err: F): void {
    this.dead(err);
  }
}
