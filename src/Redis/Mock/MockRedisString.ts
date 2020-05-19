import { IRedisString } from '../';
import { Nullable } from '../../Type';
import { UnimplementedError } from '../../Error/UnimplementedError';

export class MockRedisString implements IRedisString {
  public set(): Promise<boolean> {
    return Promise.reject<boolean>(new UnimplementedError());
  }

  public get(): Promise<Nullable<string>> {
    return Promise.reject<Nullable<string>>(new UnimplementedError());
  }
}
