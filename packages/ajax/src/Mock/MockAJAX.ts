import { UnimplementedError } from '@jamashita/publikum-error';
import { AJAXResponse } from '../AJAXResponse';
import { IAJAX } from '../Interface/IAJAX';

export class MockAJAX implements IAJAX {
  public get<T>(): Promise<AJAXResponse<T>> {
    throw new UnimplementedError();
  }

  public post<T>(): Promise<AJAXResponse<T>> {
    throw new UnimplementedError();
  }

  public put<T>(): Promise<AJAXResponse<T>> {
    throw new UnimplementedError();
  }

  public delete<T>(): Promise<AJAXResponse<T>> {
    throw new UnimplementedError();
  }
}
