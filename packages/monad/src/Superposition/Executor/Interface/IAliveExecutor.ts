import { Noun } from '@jamashita/publikum-interface';

type AliveExecutorType = 'AliveExecutor' | 'AliveNothingExecutor';

export interface IAliveExecutor<S, N extends AliveExecutorType = AliveExecutorType> extends Noun<N> {
  readonly noun: N;

  onAlive(value: S): Promise<void>;
}
