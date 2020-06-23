import { Noun } from '@jamashita/publikum-interface';

type CallbackExecutorType = 'AliveExecutor' | 'DeadExecutor' | 'AnyExecutor' | 'NothingExecutor';

export interface CallbackExecutor<S, F extends Error, N extends CallbackExecutorType = CallbackExecutorType>
  extends Noun<N> {
  onAlive(value: S): Promise<void>;

  onDead(err: F): Promise<void>;
}
