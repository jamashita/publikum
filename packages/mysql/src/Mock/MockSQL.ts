import { UnimplementedError } from '@jamashita/publikum-error';
import { ISQL } from '../Interface/ISQL';

export class MockSQL implements ISQL {
  public execute<R>(): Promise<R> {
    throw new UnimplementedError();
  }
}
