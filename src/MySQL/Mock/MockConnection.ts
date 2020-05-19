import { IConnection } from '../';
import { UnimplementedError } from '../../UnimplementedError';

export class MockConnection implements IConnection {
  public execute<R>(): Promise<R> {
    return Promise.reject<R>(new UnimplementedError());
  }

  public commit(): Promise<void> {
    return Promise.reject<void>(new UnimplementedError());
  }

  public rollback(): Promise<void> {
    return Promise.reject<void>(new UnimplementedError());
  }

  public release(): void {
    throw new UnimplementedError();
  }
}
