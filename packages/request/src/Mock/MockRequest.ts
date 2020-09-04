import { UnimplementedError } from '@jamashita/publikum-error';
import { IRequest } from '../Interface/IRequest';
import { RequestResponse } from '../RequestResponse';

export class MockRequest implements IRequest<'json'> {
  public get(): Promise<RequestResponse<'json'>> {
    throw new UnimplementedError();
  }

  public post(): Promise<RequestResponse<'json'>> {
    throw new UnimplementedError();
  }

  public put(): Promise<RequestResponse<'json'>> {
    throw new UnimplementedError();
  }

  public delete(): Promise<RequestResponse<'json'>> {
    throw new UnimplementedError();
  }
}
