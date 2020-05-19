import { IMySQL } from '../';
import { UnimplementedError } from '../../UnimplementedError';

export class MockMySQL implements IMySQL {
  public transact<R>(): Promise<R> {
    return Promise.reject<R>(new UnimplementedError());
  }

  public execute<R>(): Promise<R> {
    return Promise.reject<R>(new UnimplementedError());
  }
}
