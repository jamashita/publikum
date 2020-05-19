import { IRedisList } from '../';
import { UnimplementedError } from '../../UnimplementedError';

export class MockRedisList implements IRedisList {
  public push(): Promise<number> {
    return Promise.reject<number>(new UnimplementedError());
  }

  public pop(): Promise<string> {
    return Promise.reject<string>(new UnimplementedError());
  }

  public shift(): Promise<string> {
    return Promise.reject<string>(new UnimplementedError());
  }

  public length(): Promise<number> {
    return Promise.reject<number>(new UnimplementedError());
  }

  public remove(): Promise<number> {
    return Promise.reject<number>(new UnimplementedError());
  }

  public select(): Promise<Array<string>> {
    return Promise.reject<Array<string>>(new UnimplementedError());
  }

  public dump(): Promise<Array<string>> {
    return Promise.reject<Array<string>>(new UnimplementedError());
  }
}
