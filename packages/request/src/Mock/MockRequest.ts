import { UnimplementedError } from '@jamashita/publikum-error';
import { IRequest } from '../Interface/IRequest';
import { RequestResponse, RequestResponseType } from '../RequestResponse';

export class MockRequest<T extends RequestResponseType> implements IRequest<T> {
  public get(): Promise<RequestResponse<T>> {
    throw new UnimplementedError();
  }

  public post(): Promise<RequestResponse<T>> {
    throw new UnimplementedError();
  }

  public put(): Promise<RequestResponse<T>> {
    throw new UnimplementedError();
  }

  public delete(): Promise<RequestResponse<T>> {
    throw new UnimplementedError();
  }

  public head(): Promise<RequestResponse<T>> {
    throw new UnimplementedError();
  }
}
