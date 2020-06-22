import { Consumer } from '@jamashita/publikum-type';

import { Peek } from '../../../type/src/Function';
import { CallbackExecutor } from './Interface/CallbackExecutor';

export class AliveExecutor<S, F extends Error> implements CallbackExecutor<S, F, 'AliveExecutor'> {
  public readonly noun: 'AliveExecutor' = 'AliveExecutor';
  private readonly alive: Consumer<S>;
  private readonly nothing: Peek;

  public static of<S, F extends Error>(alive: Consumer<S>, nothing: Peek): AliveExecutor<S, F> {
    return new AliveExecutor<S, F>(alive, nothing);
  }

  protected constructor(alive: Consumer<S>, nothing: Peek) {
    this.alive = alive;
    this.nothing = nothing;
  }

  public onAlive(value: S): void {
    this.alive(value);
  }

  public onDead(err: F): void;
  public onDead(): void {
    this.nothing();
  }
}
