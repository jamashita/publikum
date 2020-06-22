import { Consumer } from '@jamashita/publikum-type';

import { Peek } from '../../../type/src/Function';
import { CallbackExecutor } from './Interface/CallbackExecutor';

// TODO TESTS UNDONE
export class DeadExecutor<S, F extends Error> implements CallbackExecutor<S, F, 'DeadExecutor'> {
  public readonly noun: 'DeadExecutor' = 'DeadExecutor';
  private readonly dead: Consumer<F>;
  private readonly nothing: Peek;

  public static of<S, F extends Error>(dead: Consumer<F>, nothing: Peek): DeadExecutor<S, F> {
    return new DeadExecutor<S, F>(dead, nothing);
  }

  protected constructor(dead: Consumer<F>, nothing: Peek) {
    this.dead = dead;
    this.nothing = nothing;
  }

  public onAlive(value: S): void;
  public onAlive(): void {
    this.nothing();
  }

  public onDead(err: F): void {
    this.dead(err);
  }
}
