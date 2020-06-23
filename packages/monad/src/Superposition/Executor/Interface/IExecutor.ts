import { Noun } from '@jamashita/publikum-interface';

import { IAliveExecutor } from './IAliveExecutor';
import { IDeadExecutor } from './IDeadExecutor';

type ExecutorType = 'AnyExecutor' | 'MapExecutor' | 'RecoverExecutor';

export interface IExecutor<S, F extends Error, N extends ExecutorType = ExecutorType>
  extends IAliveExecutor<S>,
    IDeadExecutor<F>,
    Noun<N> {
  // NOOP
}
