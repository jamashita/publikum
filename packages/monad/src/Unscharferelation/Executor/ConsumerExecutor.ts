import { Consumer } from '@jamashita/publikum-type';

import { IAbsentExecutor } from './Interface/IAbsentExecutor';
import { IPresentExecutor } from './Interface/IPresentExecutor';

export class ConsumerExecutor<P>
  implements IPresentExecutor<P, 'ConsumerExecutor'>, IAbsentExecutor<'ConsumerExecutor'> {
  public readonly noun: 'ConsumerExecutor' = 'ConsumerExecutor';
  private readonly consumer: Consumer<P>;

  public static of<P>(consumer: Consumer<P>): ConsumerExecutor<P> {
    return new ConsumerExecutor<P>(consumer);
  }

  protected constructor(consumer: Consumer<P>) {
    this.consumer = consumer;
  }

  public onPresent(value: P): Promise<void> {
    this.consumer(value);

    return Promise.resolve();
  }

  public onAbsent(): Promise<void> {
    return Promise.resolve();
  }
}
