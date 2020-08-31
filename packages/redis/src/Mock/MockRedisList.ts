import { UnimplementedError } from '@jamashita/publikum-error';
import { IRedisList } from '../Interface/IRedisList';

export class MockRedisList implements IRedisList {
  public push(): Promise<number> {
    throw new UnimplementedError();
  }

  public pop(): Promise<string> {
    throw new UnimplementedError();
  }

  public shift(): Promise<string> {
    throw new UnimplementedError();
  }

  public length(): Promise<number> {
    throw new UnimplementedError();
  }

  public remove(): Promise<number> {
    throw new UnimplementedError();
  }

  public select(): Promise<Array<string>> {
    throw new UnimplementedError();
  }

  public dump(): Promise<Array<string>> {
    throw new UnimplementedError();
  }
}
