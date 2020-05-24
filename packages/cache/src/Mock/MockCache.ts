import { UnimplementedError } from '@publikum/error';

import { ICache } from '../';

export class MockCache implements ICache {
  public set(): void {
    throw new UnimplementedError();
  }

  public get<H>(): H {
    throw new UnimplementedError();
  }
}
