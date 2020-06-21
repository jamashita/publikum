import { Consumer } from '@jamashita/publikum-type';

import { CallbackExecutor } from './Interface/CallbackExecutor';

// TODO TESTS UNDONE
export class DeadExecutor<S, F extends Error> implements CallbackExecutor<S, F, 'DeadExecutor'> {
  public readonly noun: 'DeadExecutor' = 'DeadExecutor';
  private readonly dead: Consumer<F>;

  public static of<S, F extends Error>(dead: Consumer<F>): DeadExecutor<S, F> {
    return new DeadExecutor<S, F>(dead);
  }

  protected constructor(dead: Consumer<F>) {
    this.dead = dead;
  }

  public onAlive(value: S): void;
  public onAlive(): void {
    // NOOP
  }

  public onDead(err: F): void {
    this.dead(err);
  }
}
