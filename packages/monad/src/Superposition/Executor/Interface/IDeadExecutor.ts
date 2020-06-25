import { Noun } from '@jamashita/publikum-interface';

type DeadExecutorType = 'DeadExecutor' | 'DeadNothingExecutor' | 'PeekExecutor';

export interface IDeadExecutor<D extends Error, N extends DeadExecutorType = DeadExecutorType> extends Noun<N> {
  readonly noun: N;

  onDead(err: D): Promise<void>;
}
