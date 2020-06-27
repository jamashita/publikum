import { Noun } from '@jamashita/publikum-interface';

export interface IRejectHandler<R, N extends string = string> extends Noun<N> {
  readonly noun: N;

  onReject(reject: R): Promise<void>;
}
