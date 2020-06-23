import { Noun } from '@jamashita/publikum-interface';

import { IAliveExecutor } from './IAliveExecutor';
import { IDeadExecutor } from './IDeadExecutor';

type DeadOrAliveExecutorType = 'AnyExecutor' | 'MapExecutor' | 'RecoverExecutor';

export interface IDeadOrAliveExecutor<S, F extends Error, N extends DeadOrAliveExecutorType = DeadOrAliveExecutorType>
  extends IAliveExecutor<S>,
    IDeadExecutor<F>,
    Noun<N> {
  // NOOP
}
