import { Noun } from '@jamashita/publikum-interface';

type PresentExecutorType = 'PresentExecutor' | 'PresentNothingExecutor';

export interface IPresentExecutor<T, N extends PresentExecutorType = PresentExecutorType> extends Noun<N> {
  readonly noun: N;

  onPresent(value: T): Promise<void>;
}
