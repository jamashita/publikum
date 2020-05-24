import { UnimplementedError } from '@publikum/error';

import { IMySQL } from '../Interface/IMySQL';

export class MockMySQL implements IMySQL {
  public transact<R>(): Promise<R> {
    return Promise.reject<R>(new UnimplementedError());
  }

  public execute<R>(): Promise<R> {
    return Promise.reject<R>(new UnimplementedError());
  }
}
