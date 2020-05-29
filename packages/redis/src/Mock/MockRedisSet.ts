import { UnimplementedError } from '@jamashita/publikum-error';
import { Nullable } from '@jamashita/publikum-type';

import { IRedisSet } from '../Interface/IRedisSet';

export class MockRedisSet implements IRedisSet {
  public add(): Promise<number> {
    return Promise.reject<number>(new UnimplementedError());
  }

  public remove(): Promise<number> {
    return Promise.reject<number>(new UnimplementedError());
  }

  public has(): Promise<boolean> {
    return Promise.reject<boolean>(new UnimplementedError());
  }

  public length(): Promise<number> {
    return Promise.reject<number>(new UnimplementedError());
  }

  public dump(): Promise<Array<string>> {
    return Promise.reject<Array<string>>(new UnimplementedError());
  }

  public random(): Promise<Nullable<string>> {
    return Promise.reject<Nullable<string>>(new UnimplementedError());
  }

  public pop(): Promise<Nullable<string>> {
    return Promise.reject<Nullable<string>>(new UnimplementedError());
  }
}
