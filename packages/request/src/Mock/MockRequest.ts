import { UnimplementedError } from '@jamashita/publikum-error';
import { IRequest } from '../Interface/IRequest';
import { RequestResponse } from '../RequestResponse';

export class MockRequest implements IRequest {
  public get(): Promise<RequestResponse> {
    throw new UnimplementedError();
  }

  public post(): Promise<RequestResponse> {
    throw new UnimplementedError();
  }

  public put(): Promise<RequestResponse> {
    throw new UnimplementedError();
  }

  public delete(): Promise<RequestResponse> {
    throw new UnimplementedError();
  }

  public head(): Promise<RequestResponse<null>> {
    throw new UnimplementedError();
  }
}
