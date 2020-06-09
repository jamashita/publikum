import { UnimplementedError } from '@jamashita/publikum-error';

import { IRequest } from '../Interface/IRequest';
import { RequestResponse } from '../RequestResponse';

export class MockRequest implements IRequest {
  public get<T>(): Promise<RequestResponse<T>> {
    return Promise.reject<RequestResponse<T>>(new UnimplementedError());
  }

  public post<T>(): Promise<RequestResponse<T>> {
    return Promise.reject<RequestResponse<T>>(new UnimplementedError());
  }

  public put<T>(): Promise<RequestResponse<T>> {
    return Promise.reject<RequestResponse<T>>(new UnimplementedError());
  }

  public delete<T>(): Promise<RequestResponse<T>> {
    return Promise.reject<RequestResponse<T>>(new UnimplementedError());
  }
}
