import { Consumer } from '@jamashita/publikum-type';

import { CallbackExecutor } from './Interface/CallbackExecutor';

// TODO TESTS UNDONE
export class AliveExecutor<S, F extends Error> implements CallbackExecutor<S, F, 'AliveExecutor'> {
  public readonly noun: 'AliveExecutor' = 'AliveExecutor';
  private readonly alive: Consumer<S>;

  public static of<S, F extends Error>(alive: Consumer<S>): AliveExecutor<S, F> {
    return new AliveExecutor<S, F>(alive);
  }

  protected constructor(alive: Consumer<S>) {
    this.alive = alive;
  }

  public onAlive(value: S): void {
    this.alive(value);
  }

  public onDead(err: F): void;
  public onDead(): void {
    // NOOP
  }
}
