import { ICache } from '../';
import { UnimplementedError } from '../../UnimplementedError';

export class MockCache implements ICache {
  public set(): void {
    throw new UnimplementedError();
  }

  public get<H>(): H {
    throw new UnimplementedError();
  }
}
