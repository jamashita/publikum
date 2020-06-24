import { Noun } from '@jamashita/publikum-interface';

type DeadExecutorType = 'DeadExecutor' | 'DeadNothingExecutor';

export interface IDeadExecutor<F extends Error, N extends DeadExecutorType = DeadExecutorType> extends Noun<N> {
  readonly noun: N;

  onDead(err: F): Promise<void>;
}
