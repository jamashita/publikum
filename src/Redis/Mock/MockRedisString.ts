import { IRedisString } from '..';
import { Nullable } from '../../Type';
import { UnimplementedError } from '../../UnimplementedError';

export class MockRedisString implements IRedisString {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public set(key: string, value: string): Promise<boolean> {
    return Promise.reject<boolean>(new UnimplementedError());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public get(key: string): Promise<Nullable<string>> {
    return Promise.reject<Nullable<string>>(new UnimplementedError());
  }
}
