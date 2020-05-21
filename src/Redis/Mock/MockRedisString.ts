import { IRedisString } from '../';
import { UnimplementedError } from '../../Error/UnimplementedError';
import { Nullable } from '../../Type';

export class MockRedisString implements IRedisString {
  public set(): Promise<boolean> {
    return Promise.reject<boolean>(new UnimplementedError());
  }

  public get(): Promise<Nullable<string>> {
    return Promise.reject<Nullable<string>>(new UnimplementedError());
  }
}
