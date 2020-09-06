import { UnimplementedError } from '@jamashita/publikum-error';
import { AJAXResponse, AJAXResponseType } from '../AJAXResponse';
import { IAJAX } from '../Interface/IAJAX';

export class MockAJAX<T extends AJAXResponseType> implements IAJAX<T> {
  public get(): Promise<AJAXResponse<T>> {
    throw new UnimplementedError();
  }

  public post(): Promise<AJAXResponse<T>> {
    throw new UnimplementedError();
  }

  public put(): Promise<AJAXResponse<T>> {
    throw new UnimplementedError();
  }

  public delete(): Promise<AJAXResponse<T>> {
    throw new UnimplementedError();
  }

  public head(): Promise<AJAXResponse<T>> {
    throw new UnimplementedError();
  }
}
