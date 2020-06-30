import { UnimplementedError } from '@jamashita/publikum-error';
import { Nullable } from '@jamashita/publikum-type';

import { IRedisString } from '../Interface/IRedisString';

export class MockRedisString implements IRedisString {
  public set(): Promise<boolean> {
    throw new UnimplementedError();
  }

  public get(): Promise<Nullable<string>> {
    throw new UnimplementedError();
  }
}
