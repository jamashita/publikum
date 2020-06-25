import { Noun } from '@jamashita/publikum-interface';

type AliveExecutorType = 'AliveExecutor' | 'AliveNothingExecutor' | 'PeekExecutor';

export interface IAliveExecutor<A, N extends AliveExecutorType = AliveExecutorType> extends Noun<N> {
  readonly noun: N;

  onAlive(value: A): Promise<void>;
}
