import { Peek } from '@jamashita/publikum-type';

import { IAbsentExecutor } from './Interface/IAbsentExecutor';

export class AbsentExecutor implements IAbsentExecutor<'AbsentExecutor'> {
  public readonly noun: 'AbsentExecutor' = 'AbsentExecutor';
  private readonly mapper: Peek;

  public static of(mapper: Peek): AbsentExecutor {
    return new AbsentExecutor(mapper);
  }

  protected constructor(mapper: Peek) {
    this.mapper = mapper;
  }

  public onAbsent(): Promise<void> {
    this.mapper();

    return Promise.resolve();
  }
}
