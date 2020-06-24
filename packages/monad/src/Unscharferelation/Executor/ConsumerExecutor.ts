import { Consumer } from '@jamashita/publikum-type';

import { IAbsentExecutor } from './Interface/IAbsentExecutor';
import { IPresentExecutor } from './Interface/IPresentExecutor';

const promise: Promise<void> = Promise.resolve();

export class ConsumerExecutor<T>
  implements IPresentExecutor<T, 'ConsumerExecutor'>, IAbsentExecutor<'ConsumerExecutor'> {
  public readonly noun: 'ConsumerExecutor' = 'ConsumerExecutor';
  private readonly consumer: Consumer<T>;

  public static of<T>(consumer: Consumer<T>): ConsumerExecutor<T> {
    return new ConsumerExecutor<T>(consumer);
  }

  protected constructor(consumer: Consumer<T>) {
    this.consumer = consumer;
  }

  public onPresent(value: T): Promise<void> {
    this.consumer(value);

    return promise;
  }

  public onAbsent(): Promise<void> {
    return promise;
  }
}
