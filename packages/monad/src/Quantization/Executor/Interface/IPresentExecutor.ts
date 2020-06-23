import { Noun } from '@jamashita/publikum-interface';

export interface IPresentExecutor<T> extends Noun<'PresentExecutor'> {
  readonly noun: 'PresentExecutor';

  onPresent(value: T): Promise<void>;
}
