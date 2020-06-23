import { Noun } from '@jamashita/publikum-interface';

export interface IDeadExecutor<F extends Error> extends Noun<'DeadExecutor'> {
  onDead(err: F): Promise<void>;
}
