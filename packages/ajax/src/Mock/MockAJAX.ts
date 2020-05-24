import { IAJAX } from '../';
import { UnimplementedError } from '../../Error/UnimplementedError';
import { AJAXResponse } from '../AJAXResponse';

export class MockAJAX implements IAJAX {
  public get<T>(): Promise<AJAXResponse<T>> {
    return Promise.reject<AJAXResponse<T>>(new UnimplementedError());
  }

  public post<T>(): Promise<AJAXResponse<T>> {
    return Promise.reject<AJAXResponse<T>>(new UnimplementedError());
  }

  public put<T>(): Promise<AJAXResponse<T>> {
    return Promise.reject<AJAXResponse<T>>(new UnimplementedError());
  }

  public delete<T>(): Promise<AJAXResponse<T>> {
    return Promise.reject<AJAXResponse<T>>(new UnimplementedError());
  }
}