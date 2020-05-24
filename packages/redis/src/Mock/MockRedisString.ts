import { UnimplementedError } from '@publikum/error';
import { Nullable } from '@publikum/type';

import { IRedisString } from '../Interface/IRedisString';

export class MockRedisString implements IRedisString {
  public set(): Promise<boolean> {
    return Promise.reject<boolean>(new UnimplementedError());
  }

  public get(): Promise<Nullable<string>> {
    return Promise.reject<Nullable<string>>(new UnimplementedError());
  }
}
