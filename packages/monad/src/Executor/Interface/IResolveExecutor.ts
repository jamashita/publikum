import { Noun } from '@jamashita/publikum-interface';

type ResolveExecutorType = 'ResolveExecutor' | 'PeekExecutor' | 'ConsumerExecutor';

export interface IResolveExecutor<R, N extends ResolveExecutorType = ResolveExecutorType> extends Noun<N> {
  readonly noun: N;

  onResolve(resolve: R): Promise<void>;
}
