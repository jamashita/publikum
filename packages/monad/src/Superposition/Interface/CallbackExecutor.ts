import { Noun } from '@jamashita/publikum-interface';

type CallbackExecutorType = 'AliveExecutor' | 'DeadExecutor' | 'AnyExecutor';

export interface CallbackExecutor<S, F extends Error, N extends CallbackExecutorType> extends Noun<N> {
  onAlive(value: S): void;

  onDead(err: F): void;
}
