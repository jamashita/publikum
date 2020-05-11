import { ISQL } from '..';
import { UnimplementedError } from '../../UnimplementedError';

export class MockSQL implements ISQL {
  public execute<R>(): Promise<R> {
    return Promise.reject<R>(new UnimplementedError());
  }
}
