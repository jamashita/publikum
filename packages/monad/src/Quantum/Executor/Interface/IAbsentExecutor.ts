import { Noun } from '@jamashita/publikum-interface';

export interface IAbsentExecutor extends Noun<'AbsentExecutor'> {
  readonly noun: 'AbsentExecutor';

  onAbsent(): Promise<void>;
}
