import { UnimplementedError } from '@jamashita/publikum/error';
import { Nullable } from '@jamashita/publikum/type';

import { IRedisHash } from '../Interface/IRedisHash';

export class MockRedisHash implements IRedisHash {
  public set(): Promise<boolean> {
    return Promise.reject<boolean>(new UnimplementedError());
  }

  public get(): Promise<Nullable<string>> {
    return Promise.reject<Nullable<string>>(new UnimplementedError());
  }

  public delete(): Promise<number> {
    return Promise.reject<number>(new UnimplementedError());
  }

  public length(): Promise<number> {
    return Promise.reject<number>(new UnimplementedError());
  }

  public has(): Promise<boolean> {
    return Promise.reject<boolean>(new UnimplementedError());
  }
}
