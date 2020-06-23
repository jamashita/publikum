import { Noun } from '@jamashita/publikum-interface';

export interface IAliveExecutor<S> extends Noun<'AliveExecutor'> {
  onAlive(value: S): Promise<void>;
}
