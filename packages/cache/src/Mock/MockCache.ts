import { UnimplementedError } from '@publikum/error';

import { ICache } from '../Interface/ICache';

export class MockCache implements ICache {
  public set(): void {
    throw new UnimplementedError();
  }

  public get<H>(): H {
    throw new UnimplementedError();
  }
}