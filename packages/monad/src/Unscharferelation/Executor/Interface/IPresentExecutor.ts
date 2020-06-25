import { Noun } from '@jamashita/publikum-interface';

type PresentExecutorType = 'PresentExecutor' | 'PresentNothingExecutor' | 'PeekExecutor' | 'ConsumerExecutor';

export interface IPresentExecutor<P, N extends PresentExecutorType = PresentExecutorType> extends Noun<N> {
  readonly noun: N;

  onPresent(value: P): Promise<void>;
}
