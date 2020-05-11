import { ICache } from '..';
import { UnimplementedError } from '../../UnimplementedError';

export class MockCache implements ICache {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public set(identifier: symbol, value: unknown): void {
    throw new UnimplementedError();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public get<H>(identifier: symbol): H {
    throw new UnimplementedError();
  }
}
