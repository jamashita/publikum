import { Noun } from '@jamashita/publikum-interface';

type RejectExecutorType = 'RejectExecutor' | 'RejectPeekExecutor' | 'RejectConsumerExecutor';

export interface IRejectExecutor<R, N extends RejectExecutorType = RejectExecutorType> extends Noun<N> {
  readonly noun: N;

  onReject(reject: R): Promise<void>;
}
