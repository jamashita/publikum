import { Noun } from '@jamashita/publikum-interface';

export interface IDeadExecutor<F extends Error> extends Noun<'DeadExecutor'> {
  readonly noun: 'DeadExecutor';

  onDead(err: F): Promise<void>;
}
