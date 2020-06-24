import { Noun } from '@jamashita/publikum-interface';

type AbsentExecutorType = 'AbsentExecutor' | 'AbsentNothingExecutor' | 'PeekExecutor';

export interface IAbsentExecutor<N extends AbsentExecutorType = AbsentExecutorType> extends Noun<N> {
  readonly noun: N;

  onAbsent(): Promise<void>;
}
